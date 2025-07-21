"use client";

import * as React from "react";
import { useState, useEffect, useMemo, useRef } from "react";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import type { DateRange } from "react-day-picker";
import { subDays } from "date-fns";
import { Sparkles, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { SheetSelector } from "@/components/sheet-selector";
import { DateRangePicker } from "@/components/date-range-picker";
import { SheetTable } from "@/components/sheet-table";
import { MilkSheetTable } from "@/components/milk-sheet-table";
import { EggAndBSheet } from "@/components/egg-and-b-sheet";
import { summarizeSheetData } from "@/ai/flows/summarize-sheet-data";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/theme-toggle";

const sheetNames = ["Meal Planning", "Milk & Ragi Distribution", "ಮೊಟ್ಟೆ ಮತ್ತು ಬಾಳೆಹಣ್ಣು"];

export default function DataCanvas() {
  const { toast } = useToast();
  const [selectedSheet, setSelectedSheet] = useState<string>(sheetNames[0]);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [currentTableData, setCurrentTableData] = useState<any[]>([]);
  const printRef = useRef<HTMLDivElement>(null);

  const handleMonthChange = (year: number, month: number) => {
    const newDate = new Date(year, month, 1);
    setSelectedMonth(newDate);
  };

  const handlePrint = () => {
    const input = printRef.current;
    if (input) {
      // Temporarily change theme to light for PDF generation
      const originalTheme = document.documentElement.getAttribute('data-theme');
      document.documentElement.setAttribute('data-theme', 'light');

      html2canvas(input, {
        scale: 2, // Higher scale for better quality
        useCORS: true,
        logging: true,
        backgroundColor: null, // Use element's background
      }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: 'landscape',
          unit: 'mm',
          format: 'a4',
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        const ratio = canvasWidth / canvasHeight;

        let imgWidth = pdfWidth - 20; // with margin
        let imgHeight = imgWidth / ratio;

        if (imgHeight > pdfHeight - 20) {
          imgHeight = pdfHeight - 20; // with margin
          imgWidth = imgHeight * ratio;
        }

        const x = (pdfWidth - imgWidth) / 2;
        const y = (pdfHeight - imgHeight) / 2;

        pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);

        const monthName = selectedMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        const fileName = `${selectedSheet.replace(/ & /g, '_')}_${monthName.replace(' ', '_')}.pdf`;
        pdf.save(fileName);

        // Restore theme
        if (originalTheme) {
            document.documentElement.setAttribute('data-theme', originalTheme);
        }

        toast({
          title: "Export Successful",
          description: `The report has been saved as ${fileName}`,
        });
      }).catch(err => {
        console.error("Error generating PDF:", err);
        toast({
          variant: "destructive",
          title: "Export Failed",
          description: "Could not generate PDF. See console for details.",
        });
        // Restore theme on error
        if (originalTheme) {
            document.documentElement.setAttribute('data-theme', originalTheme);
        }
      });
    } else {
      toast({
        variant: "destructive",
        title: "Export Failed",
        description: "No content found to export.",
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
                <h1 className="text-2xl font-bold font-headline text-primary">Data Canvas</h1>
                <div className="flex items-center gap-2">
                    <ThemeToggle />
                </div>
            </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Controls</CardTitle>
                    <CardDescription>Select a sheet and date range to view and edit your data.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <SheetSelector sheets={sheetNames} value={selectedSheet} onValueChange={setSelectedSheet} />
                        <DateRangePicker 
                          selectedMonth={selectedMonth}
                          onMonthChange={handleMonthChange}
                          onMonthDownload={handlePrint} 
                        />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>{selectedSheet}</CardTitle>
                    <CardDescription>
                        Select a sheet and date to view and edit your data.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                  <div ref={printRef}>
                  {selectedSheet === "Meal Planning" ? (
                    <SheetTable 
                      selectedMonth={selectedMonth}
                      onTableDataChange={setCurrentTableData}
                    />
                  ) : selectedSheet === "Milk & Ragi Distribution" ? (
                    <MilkSheetTable 
                      selectedMonth={selectedMonth}
                      onTableDataChange={setCurrentTableData}
                    />
                  ) : (
                    <EggAndBSheet
                      selectedMonth={selectedMonth}
                      onTableDataChange={setCurrentTableData}
                    />
                  )}
                  </div>
                </CardContent>
            </Card>
        </div>
      </main>
    </div>
  );
}
