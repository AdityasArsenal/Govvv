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
  // Remove date and setDate props, add onMonthDownload
  onMonthDownload: (year: number, month: number) => void;
}

export function DateRangePicker({
  className,
  onMonthDownload,
}: DateRangePickerProps) {
  const now = new Date();
  const [year, setYear] = React.useState(now.getFullYear());
  const [month, setMonth] = React.useState(now.getMonth());
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  // Generate a range of years (e.g., 2000-2050)
  const years = Array.from({ length: 51 }, (_, i) => 2000 + i);

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative">
        <select
          value={year}
          onChange={e => setYear(Number(e.target.value))}
          className="appearance-none border rounded px-2 py-1 text-sm pr-6 min-w-[60px]"
          style={{ minWidth: 60 }}
        >
          {years.map(y => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
        <ChevronDown className="absolute right-1 top-1/2 -translate-y-1/2 h-3 w-3 pointer-events-none text-muted-foreground" />
      </div>
      <div className="relative">
        <select
          value={month}
          onChange={e => setMonth(Number(e.target.value))}
          className="appearance-none border rounded px-2 py-1 text-sm pr-6 min-w-[80px]"
          style={{ minWidth: 80 }}
        >
          {months.map((m, idx) => (
            <option key={m} value={idx}>{m}</option>
          ))}
        </select>
        <ChevronDown className="absolute right-1 top-1/2 -translate-y-1/2 h-3 w-3 pointer-events-none text-muted-foreground" />
      </div>
      <Button
        size="sm"
        variant="outline"
        className="flex items-center px-2 py-1 text-xs"
        onClick={() => onMonthDownload(year, month)}
      >
        <Download className="h-4 w-4 mr-1" /> Download
      </Button>
    </div>
  );
}
