"use client";

import * as React from "react";
import { useRef } from "react";
import { Loader2 } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { SheetSelector } from "@/components/sheet-selector";
import { DateRangePicker } from "@/components/date-range-picker";
import { SheetTable } from "@/components/sheet-table";
import { MilkSheetTable } from "@/components/milk-sheet-table";
import { EggAndBSheet } from "@/components/egg-and-b-sheet";
import { useToast } from "@/hooks/use-toast";
import { PageHeader } from "@/components/PageHeader";
import { useSheetData } from "@/hooks/useSheetData";
import { handlePrint } from "@/lib/pdfUtils";

export default function DataCanvas() {
  const { toast } = useToast();
  const printRef = React.useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = React.useState(false);

  const {
    sheetNames,
    selectedSheet,
    setSelectedSheet,
    selectedMonth,
    handleMonthChange,
    allSheetsData,
    handleTableDataChange,
    isLoading,
    isSaving,
    handleSave,
    hasUnsavedChanges,
  } = useSheetData();

  const onPrint = async () => {
    setIsDownloading(true);
    try {
      await handlePrint(printRef, toast, selectedSheet, selectedMonth);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader />

      {/* ✅ CORRECTED LINE BELOW */}
      <main className="flex-1 p-2 sm:p-4 md:p-6 lg:p-8">
        <div className="flex flex-col gap-6 flex-1">
          <Card className="flex-1 flex flex-col">
            <CardHeader>
              <CardTitle>Controls</CardTitle>
              <CardDescription>Select a sheet and date range to view and edit your data.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="grid grid-cols-1 gap-4">
                <SheetSelector sheets={sheetNames} value={selectedSheet} onValueChange={setSelectedSheet} />
                <DateRangePicker
                  selectedMonth={selectedMonth}
                  onMonthChange={handleMonthChange}
                  onMonthDownload={onPrint}
                  onSave={handleSave}
                  isSaving={isSaving}
                  hasUnsavedChanges={hasUnsavedChanges}
                  isDownloading={isDownloading}
                />
              </div>
            </CardContent>
          </Card>

          <div ref={printRef}>
            {isLoading ? (
              <div className="flex items-center justify-center h-96">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <>
                {selectedSheet === "Meal Planning" && (
                  <SheetTable
                    initialData={allSheetsData[selectedSheet] || []}
                    onTableDataChange={(newData: any) => handleTableDataChange(selectedSheet, newData)}
                    selectedMonth={selectedMonth}
                  />
                )}
                {selectedSheet === "Milk & Ragi Distribution" && (
                  <MilkSheetTable
                    initialData={allSheetsData[selectedSheet] || []}
                    onTableDataChange={(newData: any) => handleTableDataChange(selectedSheet, newData)}
                    selectedMonth={selectedMonth}
                  />
                )}
                {selectedSheet === "ಮೊಟ್ಟೆ ಮತ್ತು ಬಾಳೆಹಣ್ಣು" && (
                  <EggAndBSheet
                    initialData={allSheetsData[selectedSheet] || []}
                    onTableDataChange={(newData: any) => handleTableDataChange(selectedSheet, newData)}
                    selectedMonth={selectedMonth}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}