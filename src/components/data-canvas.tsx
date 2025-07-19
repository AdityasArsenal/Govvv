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
import { ExportButton } from "@/components/export-button";
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
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 29),
    to: new Date(),
  });
  const [summary, setSummary] = useState<string>("");
  const [isSummarizing, setIsSummarizing] = useState<boolean>(false);

  useEffect(() => {
    // This hook ensures that the data is only set on the client-side,
    // preventing hydration mismatches from Math.random().
    setAllData(staticInitialData);
  }, []);

  const sheetNames = useMemo(() => allData ? Object.keys(allData) : [], [allData]);

  useEffect(() => {
    if (!allData) return;
    const currentSheetData = allData[selectedSheet] || [];
    const filtered = currentSheetData.filter((row) => {
      if (!dateRange?.from) return true;
      const from = new Date(dateRange.from.setHours(0, 0, 0, 0));
      const to = dateRange.to ? new Date(dateRange.to.setHours(23, 59, 59, 999)) : from;
      return row.date >= from && row.date <= to;
    });
    setFilteredData(filtered.sort((a,b) => b.date.getTime() - a.date.getTime()));
  }, [selectedSheet, dateRange, allData]);

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
  
  const handleSummarize = async () => {
    setIsSummarizing(true);
    setSummary("");
    try {
      if (filteredData.length === 0) {
        toast({
          variant: "destructive",
          title: "No Data",
          description: "Cannot generate summary for an empty dataset.",
        });
        return;
      }
      const formattedData = filteredData.map(d => ({ col1: d.col1, col2: d.col2, col3: d.col3 }));
      const result = await summarizeSheetData({
        sheetName: selectedSheet,
        startDate: dateRange?.from?.toLocaleDateString() ?? '',
        endDate: dateRange?.to?.toLocaleDateString() ?? '',
        data: formattedData,
      });
      setSummary(result.summary);
    } catch (error) {
      console.error("Error summarizing data:", error);
      toast({
        variant: "destructive",
        title: "Summarization Failed",
        description: "An error occurred while generating the summary.",
      });
    } finally {
      setIsSummarizing(false);
    }
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
                    <Button onClick={handleSummarize} disabled={isSummarizing}>
                        {isSummarizing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                        {isSummarizing ? "Analyzing..." : "Generate Summary"}
                    </Button>
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
                        <DateRangePicker date={dateRange} setDate={setDateRange} />
                        <ExportButton data={filteredData} />
                    </div>
                </CardContent>
            </Card>

            {summary && (
              <Card className="animate-in fade-in-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Sparkles className="text-primary"/>AI Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{summary}</p>
                </CardContent>
              </Card>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>{selectedSheet}</CardTitle>
                    <CardDescription>
                        Displaying {filteredData.length} of {allData[selectedSheet]?.length || 0} rows.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <SheetTable data={filteredData} onRowChange={handleRowChange} addRow={handleAddRow} />
                </CardContent>
            </Card>
        </div>
      </main>
    </div>
  );
}
