"use client";

import * as React from "react";
import { Calendar as CalendarIcon, Download, ChevronDown } from "lucide-react";
import { addYears, subYears, format } from "date-fns";
import type { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DateRangePickerProps extends React.HTMLAttributes<HTMLDivElement> {
  selectedMonth: Date;
  onMonthChange: (year: number, month: number) => void;
  onMonthDownload: () => void;
}

export function DateRangePicker({
  className,
  selectedMonth,
  onMonthChange,
  onMonthDownload,
}: DateRangePickerProps) {
  const year = selectedMonth.getFullYear();
  const month = selectedMonth.getMonth();
  
  const handleYearChange = (newYear: number) => {
    onMonthChange(newYear, month);
  };
  
  const handleMonthChange = (newMonth: number) => {
    onMonthChange(year, newMonth);
  };
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  // Generate a range of years (e.g., 2000-2050)
  const years = Array.from({ length: 51 }, (_, i) => 2000 + i);

  return (
    <div className={cn("flex items-center gap-3 p-4 bg-white rounded-lg border shadow-sm", className)}>
      <div className="flex items-center gap-2">
        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium text-gray-700">Select Period:</span>
      </div>
      
      <div className="flex items-center gap-2">
        <div className="relative">
          <select
            value={year}
            onChange={e => handleYearChange(Number(e.target.value))}
            className="appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 text-sm font-medium pr-8 min-w-[80px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400 transition-colors"
          >
            {years.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none text-gray-500" />
        </div>
        
        <div className="relative">
          <select
            value={month}
            onChange={e => handleMonthChange(Number(e.target.value))}
            className="appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 text-sm font-medium pr-8 min-w-[120px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400 transition-colors"
          >
            {months.map((m, idx) => (
              <option key={m} value={idx}>{m}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none text-gray-500" />
        </div>
      </div>
      
      <div className="flex-1" />
      
      <Button
        size="sm"
        variant="default"
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white transition-colors"
        onClick={onMonthDownload}
      >
        <Download className="h-4 w-4" /> 
        Download Report
      </Button>
    </div>
  );
}
