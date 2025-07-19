"use client";

import * as React from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Row } from "./data-canvas";
import { useToast } from "@/hooks/use-toast";

interface ExportButtonProps {
  data: Row[];
}

export function ExportButton({ data }: ExportButtonProps) {
  const { toast } = useToast();
  
  const handleExport = () => {
    // Placeholder for CSV export logic
    console.log("Exporting data:", data);
    toast({
      title: "Export Started",
      description: "Your data is being prepared for download.",
    });

    if (data.length === 0) {
      toast({
        variant: "destructive",
        title: "No Data to Export",
        description: "There are no rows in the current view to export.",
      });
      return;
    }
    
    // Simple CSV conversion
    const headers = ["ID", "Date", "Column 1", "Column 2", "Column 3 (Result)"];
    const csvContent = [
      headers.join(","),
      ...data.map(row => [
        row.id,
        row.date.toISOString().split('T')[0],
        row.col1,
        row.col2,
        row.col3
      ].join(","))
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `data-export-${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
  };

  return (
    <Button onClick={handleExport} variant="outline" className="w-full">
      <Download className="mr-2 h-4 w-4" />
      Export to CSV
    </Button>
  );
}
