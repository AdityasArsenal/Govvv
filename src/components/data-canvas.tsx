"use client";

import * as React from "react";
import { useState, useEffect, useRef } from "react";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { SheetSelector } from "@/components/sheet-selector";
import { DateRangePicker } from "@/components/date-range-picker";
import { SheetTable } from "@/components/sheet-table";
import { MilkSheetTable } from "@/components/milk-sheet-table";
import { EggAndBSheet } from "@/components/egg-and-b-sheet";
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

  const addPrintStyles = () => {
    const existingStyle = document.getElementById('pdf-print-styles');
    if (existingStyle) {
      existingStyle.remove();
    }

    const style = document.createElement('style');
    style.id = 'pdf-print-styles';
    style.textContent = `
      .pdf-container {
        background: white !important;
        color: black !important;
        font-family: 'Arial', sans-serif !important;
        padding: 10px !important;
        box-sizing: border-box !important;
        overflow: visible !important;
        width: auto !important;
        max-width: none !important;
      }
      
      .pdf-container * {
        background: white !important;
        color: black !important;
        border-color: #333 !important;
        box-shadow: none !important;
      }
      
      .pdf-container table {
        width: 100% !important;
        border-collapse: collapse !important;
        font-size: 8px !important;
        line-height: 1.1 !important;
        table-layout: fixed !important;
      }
      
      .pdf-container th,
      .pdf-container td {
        padding: 3px 1px !important;
        border: 1px solid #333 !important;
        text-align: center !important;
        word-wrap: break-word !important;
        overflow-wrap: break-word !important;
        white-space: normal !important;
        font-size: 7px !important;
        max-width: none !important;
        min-width: 0 !important;
      }
      
      .pdf-container th {
        background: #f5f5f5 !important;
        font-weight: bold !important;
        font-size: 8px !important;
      }
      
      .pdf-container .card {
        border: 1px solid #333 !important;
        border-radius: 4px !important;
        margin: 5px 0 !important;
      }
      
      .pdf-container .card-header {
        border-bottom: 1px solid #333 !important;
        padding: 8px !important;
        background: #f8f8f8 !important;
      }
      
      .pdf-container .card-title {
        font-size: 14px !important;
        font-weight: bold !important;
        margin: 0 !important;
      }
      
      .pdf-container .card-content {
        padding: 5px !important;
      }
      
      .pdf-container .summary-section {
        margin: 10px 0 !important;
        padding: 8px !important;
        border: 1px solid #333 !important;
        background: #f9f9f9 !important;
      }
      
      .pdf-container .date-cell {
        font-weight: bold !important;
        background: #f0f0f0 !important;
      }
      
      .pdf-container .total-row {
        font-weight: bold !important;
        background: #e8e8e8 !important;
      }
      
      .pdf-container .lucide,
      .pdf-container svg {
        display: none !important;
      }
      
      .pdf-container .table,
      .pdf-container .table-header,
      .pdf-container .table-body,
      .pdf-container .table-row,
      .pdf-container .table-head,
      .pdf-container .table-cell,
      .pdf-container .table-footer {
        display: table !important;
        width: 100% !important;
        table-layout: fixed !important;
      }
      
      .pdf-container .table-header,
      .pdf-container .table-body,
      .pdf-container .table-footer {
        display: table-row-group !important;
      }
      
      .pdf-container .table-row {
        display: table-row !important;
      }
      
      .pdf-container .table-head,
      .pdf-container .table-cell {
        display: table-cell !important;
      }
    `;
    document.head.appendChild(style);
  };

  const removePrintStyles = () => {
    const style = document.getElementById('pdf-print-styles');
    if (style) {
      style.remove();
    }
  };

  const handlePrint = async () => {
    const input = printRef.current;
    if (!input) {
      toast({
        variant: "destructive",
        title: "Export Failed",
        description: "No content found to export.",
      });
      return;
    }

    try {
      const originalTheme = document.documentElement.getAttribute('data-theme');
      const originalClass = input.className;

      document.documentElement.setAttribute('data-theme', 'light');
      addPrintStyles();
      input.className = `${originalClass} pdf-container`;

      await new Promise(resolve => setTimeout(resolve, 500));

      const canvas = await html2canvas(input, {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: input.scrollWidth,
        height: input.scrollHeight,
        scrollX: 0,
        scrollY: 0,
        windowWidth: input.scrollWidth,
        windowHeight: input.scrollHeight,
        onclone: (clonedDoc) => {
          const clonedInput = clonedDoc.querySelector('.pdf-container');
          if (clonedInput) {
            // Replace inputs with their values
            const inputs = clonedInput.querySelectorAll('input');
            inputs.forEach((input: HTMLInputElement) => {
              const value = input.value || '0';
              const span = clonedDoc.createElement('span');
              span.textContent = value;
              span.style.display = 'inline-block';
              span.style.width = '100%';
              span.style.textAlign = 'center';
              span.style.fontSize = '7px';
              input.parentNode?.replaceChild(span, input);
            });

            // Replace button groups with selected text
            const buttonGroups = clonedInput.querySelectorAll('.flex.flex-col.gap-1');
            buttonGroups.forEach((group) => {
              const selectedButton = group.querySelector(
                'button.bg-blue-500, button.bg-orange-500, button.bg-green-500, button.bg-purple-500'
              );
              if (selectedButton) {
                const span = clonedDoc.createElement('span');
                span.textContent = selectedButton.textContent || '';
                span.style.display = 'inline-block';
                span.style.width = '100%';
                span.style.textAlign = 'center';
                span.style.fontSize = '7px';
                group.parentNode?.replaceChild(span, group);
              }
            });

            // Ensure tables are styled correctly
            const tables = clonedInput.querySelectorAll('table');
            tables.forEach(table => {
              table.style.width = '100%';
              table.style.tableLayout = 'fixed';
              table.style.wordBreak = 'break-word';
            });
          }
        }
      });

      const imgData = canvas.toDataURL('image/png', 1.0);

      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a3',
        compress: true
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;

      let imgWidth = pdfWidth - 20;
      let imgHeight = (canvasHeight / canvasWidth) * imgWidth;
      if (imgHeight > pdfHeight - 20) {
        imgHeight = pdfHeight - 20;
        imgWidth = (canvasWidth / canvasHeight) * imgHeight;
      }

      const x = (pdfWidth - imgWidth) / 2;
      const y = (pdfHeight - imgHeight) / 2;

      pdf.setFontSize(16);
      pdf.setTextColor(0, 0, 0);
      const title = `${selectedSheet} - ${selectedMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`;
      const titleWidth = pdf.getStringUnitWidth(title) * 16 / pdf.internal.scaleFactor;
      pdf.text(title, (pdfWidth - titleWidth) / 2, 15);

      pdf.addImage(imgData, 'PNG', x, y + 10, imgWidth, imgHeight - 10, '', 'FAST');

      const monthName = selectedMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      const fileName = `${selectedSheet.replace(/ & /g, '_').replace(/[^\w\s]/gi, '_')}_${monthName.replace(' ', '_')}.pdf`;

      pdf.save(fileName);

      toast({
        title: "Export Successful",
        description: `The report has been saved as ${fileName}`,
      });

      input.className = originalClass;
      if (originalTheme) {
        document.documentElement.setAttribute('data-theme', originalTheme);
      }
      removePrintStyles();

    } catch (err) {
      console.error("Error generating PDF:", err);
      toast({
        variant: "destructive",
        title: "Export Failed",
        description: "Could not generate PDF. Please try again.",
      });

      const originalClass = printRef.current?.className.replace(' pdf-container', '') || '';
      if (printRef.current) {
        printRef.current.className = originalClass;
      }
      if (document.documentElement.getAttribute('data-theme')) {
        document.documentElement.setAttribute('data-theme', document.documentElement.getAttribute('data-theme') || 'light');
      }
      removePrintStyles();
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