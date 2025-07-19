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
import { summarizeSheetData } from "@/ai/flows/summarize-sheet-data";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/theme-toggle";

export type Row = {
  id: number;
  date: Date;
  col1: number;
  col2: number;
  col3: number;
};

const staticInitialData: { [key: string]: Row[] } = {
  "Sales Q1": Array.from({ length: 15 }, (_, i) => {
    const col1 = Math.floor(Math.random() * 200) + 50;
    const col2 = Math.floor(Math.random() * 30) + 10;
    return {
      id: i + 1,
      date: subDays(new Date(), i * 4 + Math.floor(Math.random() * 3)),
      col1,
      col2,
      col3: col1 * col2,
    };
  }),
  "Marketing Spend": Array.from({ length: 12 }, (_, i) => {
    const col1 = Math.floor(Math.random() * 500) + 100;
    const col2 = Math.floor(Math.random() * 80) + 20;
    return {
      id: i + 1,
      date: subDays(new Date(), i * 6 + Math.floor(Math.random() * 5)),
      col1,
      col2,
      col3: col1 * col2,
    };
  }),
  "Inventory Levels": Array.from({ length: 18 }, (_, i) => {
    const col1 = Math.floor(Math.random() * 1000) + 200;
    const col2 = Math.floor(Math.random() * 5) + 1;
    return {
      id: i + 1,
      date: subDays(new Date(), i * 3 + Math.floor(Math.random() * 2)),
      col1,
      col2,
      col3: col1 * col2,
    };
  }),
};

export default function DataCanvas() {
  const { toast } = useToast();
  const [allData, setAllData] = useState<{ [key: string]: Row[] } | null>(null);
  const [filteredData, setFilteredData] = useState<Row[]>([]);
  const [selectedSheet, setSelectedSheet] = useState<string>("Sales Q1");
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [currentTableData, setCurrentTableData] = useState<any[]>([]);

  useEffect(() => {
    // This hook ensures that the data is only set on the client-side,
    // preventing hydration mismatches from Math.random().
    setAllData(staticInitialData);
  }, []);

  const sheetNames = useMemo(() => allData ? Object.keys(allData) : [], [allData]);

  useEffect(() => {
    if (!allData) return;
    const currentSheetData = allData[selectedSheet] || [];
    setFilteredData(currentSheetData.sort((a, b) => b.date.getTime() - a.date.getTime()));
  }, [selectedSheet, allData]);

  const handleRowChange = (id: number, column: "col1" | "col2", value: number) => {
    setAllData((prev) => {
      if (!prev) return null;
      const newData = { ...prev };
      const sheetData = newData[selectedSheet].map((row) => {
        if (row.id === id) {
          const newRow = { ...row, [column]: value };
          newRow.col3 = newRow.col1 * newRow.col2;
          return newRow;
        }
        return row;
      });
      newData[selectedSheet] = sheetData;
      return newData;
    });
  };

  const handleAddRow = () => {
    setAllData((prev) => {
      if (!prev) return null;
      const newData = { ...prev };
      const newId = Math.max(0, ...newData[selectedSheet].map((r) => r.id)) + 1;
      const newRow: Row = {
        id: newId,
        date: new Date(),
        col1: 0,
        col2: 0,
        col3: 0,
      };
      newData[selectedSheet] = [newRow, ...newData[selectedSheet]];
      return newData;
    });
  };
  
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
    
    // Export logic (CSV) for meal planning data - using exact column headers from UI
    const headers = [
      "Date", "Day", "Meal Type", 
      "ಮಕ್ಕಳ ಸಂಖ್ಯೆ (1-5)", "ಅಕ್ಕಿ (1-5)", "ಗೋಧಿ (1-5)", "ಎಣ್ಣೆ (1-5)", "ಬೇಳೆ (1-5)", "ಸಾದಿಲ್ವಾರು (1-5)",
      "ಮಕ್ಕಳ ಸಂಖ್ಯೆ (6-10)", "ಅಕ್ಕಿ (6-10)", "ಗೋಧಿ (6-10)", "ಎಣ್ಣೆ (6-10)", "ಬೇಳೆ (6-10)", "ಸಾದಿಲ್ವಾರು (6-10)",
      "ಒಟ್ಟು ಸಾದಿಲ್ವಾರು"
    ];
    
    const csvContent = [
      headers.join(","),
      ...currentTableData
        .map(row => {
          const calc1to5 = (count: number, mealType: string | null) => ({
            rice: mealType === 'rice' ? count * 0.1 : 0,
            wheat: mealType === 'wheat' ? count * 0.1 : 0,
            oil: count * 0.005,
            pulses: count * 0.02,
            sadilvaru: count * 2.15,
          });
          const calc6to8 = (count: number, mealType: string | null) => ({
            rice: mealType === 'rice' ? count * 0.15 : 0,
            wheat: mealType === 'wheat' ? count * 0.15 : 0,
            oil: count * 0.0075,
            pulses: count * 0.03,
            sadilvaru: count * 3.12,
          });
          
          const c1 = calc1to5(row.count1to5 || 0, row.mealType);
          const c2 = calc6to8(row.count6to8 || 0, row.mealType);
          const totalSadilvaru = c1.sadilvaru + c2.sadilvaru;
          
          return [
            row.date.toISOString().split('T')[0],
            row.date.toLocaleDateString('en-US', { weekday: 'long' }),
            row.mealType || '',
            row.count1to5 || 0,
            row.count1to5 > 0 && row.mealType ? c1.rice.toFixed(3) : '',
            row.count1to5 > 0 && row.mealType ? c1.wheat.toFixed(3) : '',
            row.count1to5 > 0 && row.mealType ? c1.oil.toFixed(3) : '',
            row.count1to5 > 0 && row.mealType ? c1.pulses.toFixed(3) : '',
            row.count1to5 > 0 && row.mealType ? c1.sadilvaru.toFixed(3) : '',
            row.count6to8 || 0,
            row.count6to8 > 0 && row.mealType ? c2.rice.toFixed(3) : '',
            row.count6to8 > 0 && row.mealType ? c2.wheat.toFixed(3) : '',
            row.count6to8 > 0 && row.mealType ? c2.oil.toFixed(3) : '',
            row.count6to8 > 0 && row.mealType ? c2.pulses.toFixed(3) : '',
            row.count6to8 > 0 && row.mealType ? c2.sadilvaru.toFixed(3) : '',
            (row.count1to5 > 0 || row.count6to8 > 0) && row.mealType ? totalSadilvaru.toFixed(3) : ''
          ].join(",");
        })
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      const monthName = selectedMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      link.setAttribute("download", `Meal_Planning_${monthName.replace(' ', '_')}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    
    toast({
      title: "Export Started",
      description: `Exporting meal planning data for ${selectedMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}...`,
    });
  };

  if (!allData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

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
                        Displaying {filteredData.length} of {allData[selectedSheet]?.length || 0} rows.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <SheetTable 
                      data={filteredData} 
                      onRowChange={handleRowChange} 
                      addRow={handleAddRow}
                      selectedMonth={selectedMonth}
                      onTableDataChange={setCurrentTableData}
                    />
                </CardContent>
            </Card>
        </div>
      </main>
    </div>
  );
}
