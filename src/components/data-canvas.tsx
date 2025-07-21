"use client";

import * as React from "react";
import { useState, useEffect, useMemo } from "react";
import type { DateRange } from "react-day-picker";
import { subDays } from "date-fns";
import { Sparkles, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { SheetSelector } from "@/components/sheet-selector";
import { DateRangePicker } from "@/components/date-range-picker";
import { SheetTable } from "@/components/sheet-table";
import { MilkSheetTable } from "@/components/milk-sheet-table";
import { summarizeSheetData } from "@/ai/flows/summarize-sheet-data";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/theme-toggle";



const sheetNames = ["Meal Planning", "Milk & Ragi Distribution"];



export default function DataCanvas() {
  const { toast } = useToast();
  const [selectedSheet, setSelectedSheet] = useState<string>(sheetNames[0]);

  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [currentTableData, setCurrentTableData] = useState<any[]>([]);


  
  // Handle month selection change from DateRangePicker
  const handleMonthChange = (year: number, month: number) => {
    const newDate = new Date(year, month, 1);
    setSelectedMonth(newDate);
  };

  // Download handler for current table data
  const handleMonthDownload = () => {
    if (currentTableData.length === 0) {
      toast({
        variant: "destructive",
        title: "No Data",
        description: `No data found for the selected month.`,
      });
      return;
    }

    let headers: string[] = [];
    let csvContent: string = "";

    if (selectedSheet === "Meal Planning") {
      headers = [
        "Date", "Day", "Meal Type",
        "ಮಕ್ಕಳ ಸಂಖ್ಯೆ (1-5)", "ಅಕ್ಕಿ (1-5)", "ಗೋಧಿ (1-5)", "ಎಣ್ಣೆ (1-5)", "ಬೇಳೆ (1-5)", "ಸಾದಿಲ್ವಾರು (1-5)",
        "ಮಕ್ಕಳ ಸಂಖ್ಯೆ (6-10)", "ಅಕ್ಕಿ (6-10)", "ಗೋಧಿ (6-10)", "ಎಣ್ಣೆ (6-10)", "ಬೇಳೆ (6-10)", "ಸಾದಿಲ್ವಾರು (6-10)",
        "ಒಟ್ಟು ಸಾದಿಲ್ವಾರು"
      ];

      csvContent = [
        headers.join(","),
        ...currentTableData
          .map(row => {
            const calc1to5 = (count: number, mealType: string | null) => ({ rice: mealType === 'rice' ? count * 0.1 : 0, wheat: mealType === 'wheat' ? count * 0.1 : 0, oil: count * 0.005, pulses: count * 0.02, sadilvaru: count * 2.15 });
            const calc6to8 = (count: number, mealType: string | null) => ({ rice: mealType === 'rice' ? count * 0.15 : 0, wheat: mealType === 'wheat' ? count * 0.15 : 0, oil: count * 0.0075, pulses: count * 0.03, sadilvaru: count * 3.12 });
            const c1 = calc1to5(row.count1to5 || 0, row.mealType);
            const c2 = calc6to8(row.count6to8 || 0, row.mealType);
            const totalSadilvaru = c1.sadilvaru + c2.sadilvaru;
            return [row.date.toISOString().split('T')[0], row.date.toLocaleDateString('en-US', { weekday: 'long' }), row.mealType || '', row.count1to5 || 0, row.count1to5 > 0 && row.mealType ? c1.rice.toFixed(3) : '', row.count1to5 > 0 && row.mealType ? c1.wheat.toFixed(3) : '', row.count1to5 > 0 && row.mealType ? c1.oil.toFixed(3) : '', row.count1to5 > 0 && row.mealType ? c1.pulses.toFixed(3) : '', row.count1to5 > 0 && row.mealType ? c1.sadilvaru.toFixed(3) : '', row.count6to8 || 0, row.count6to8 > 0 && row.mealType ? c2.rice.toFixed(3) : '', row.count6to8 > 0 && row.mealType ? c2.wheat.toFixed(3) : '', row.count6to8 > 0 && row.mealType ? c2.oil.toFixed(3) : '', row.count6to8 > 0 && row.mealType ? c2.pulses.toFixed(3) : '', row.count6to8 > 0 && row.mealType ? c2.sadilvaru.toFixed(3) : '', (row.count1to5 > 0 || row.count6to8 > 0) && row.mealType ? totalSadilvaru.toFixed(3) : ''].join(",");
          })
      ].join("\n");
    } else if (selectedSheet === "Milk & Ragi Distribution") {
      headers = ["Date", "Total Children", "Opening Milk Powder", "Opening Ragi", "Opening Sugar", "Monthly Receipt Milk Powder", "Monthly Receipt Ragi", "Monthly Receipt Sugar", "Total Milk Powder", "Total Ragi", "Total Sugar", "Daily Distribution Milk Powder", "Daily Distribution Ragi", "Daily Distribution Sugar", "Closing Milk Powder", "Closing Ragi", "Closing Sugar", "Head Cook Signature"];
      csvContent = [
        headers.join(","),
        ...currentTableData.map(row => {
          const totalMilkPowder = row.openingMilkPowder + row.monthlyReceiptMilkPowder;
          const totalRagi = row.openingRagi + row.monthlyReceiptRagi;
          const totalSugar = row.openingSugar + row.monthlyReceiptSugar;
          const closingMilkPowder = totalMilkPowder - row.dailyDistributionMilkPowder;
          const closingRagi = totalRagi - row.dailyDistributionRagi;
          const closingSugar = totalSugar - row.dailyDistributionSugar;
          return [row.date.toISOString().split('T')[0], row.totalChildren, row.openingMilkPowder, row.openingRagi, row.openingSugar, row.monthlyReceiptMilkPowder, row.monthlyReceiptRagi, row.monthlyReceiptSugar, totalMilkPowder, totalRagi, totalSugar, row.dailyDistributionMilkPowder, row.dailyDistributionRagi, row.dailyDistributionSugar, closingMilkPowder, closingRagi, closingSugar, row.headCookSignature].join(",");
        })
      ].join("\n");
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      const monthName = selectedMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      const fileName = `${selectedSheet.replace(/ & /g, '_')}_${monthName.replace(' ', '_')}.csv`;
      link.setAttribute("download", fileName);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    toast({
      title: "Export Started",
      description: `Exporting data for ${selectedSheet} - ${selectedMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}...`,
    });
  };



  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
                <h1 className="text-2xl font-bold font-headline text-primary">Data Canvas</h1>
                <div className="flex items-center gap-2">
                    {/* Removed Generate Summary Button */}
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
                          onMonthDownload={handleMonthDownload} 
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
                  {selectedSheet === "Meal Planning" ? (
                    <SheetTable 
                      selectedMonth={selectedMonth}
                      onTableDataChange={setCurrentTableData}
                    />
                  ) : (
                    <MilkSheetTable 
                      selectedMonth={selectedMonth}
                      onTableDataChange={setCurrentTableData}
                    />
                  )}
                </CardContent>
            </Card>
        </div>
      </main>
    </div>
  );
}
