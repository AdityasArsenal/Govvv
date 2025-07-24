"use client";

import * as React from "react";
import { Calendar as CalendarIcon, Download, ChevronDown, Save, Loader2 } from "lucide-react";
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
  onMonthDownload: () => Promise<void>;
  onSave: () => void;
  isSaving: boolean;
  hasUnsavedChanges: boolean;
  isDownloading: boolean;
}

export function DateRangePicker({
  className,
  selectedMonth,
  onMonthChange,
  onMonthDownload,
  onSave,
  isSaving,
  hasUnsavedChanges,
  isDownloading,
}: DateRangePickerProps) {
  const year = selectedMonth.getFullYear();
  const month = selectedMonth.getMonth();
  const [showSaveReminder, setShowSaveReminder] = React.useState(true);
  const [isAttemptingToClose, setIsAttemptingToClose] = React.useState(false);

  React.useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        // This is the standard, cross-browser way to trigger the confirmation prompt.
        // Custom messages are no longer supported by most browsers for security reasons.
        e.preventDefault();
        e.returnValue = '';
        setIsAttemptingToClose(true);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasUnsavedChanges]);
  
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
    <div className={cn("flex flex-col md:flex-row md:items-center gap-4 p-4 bg-card rounded-lg border shadow-sm", className)}>
      <div className="flex items-center gap-2">
        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium text-card-foreground">Select Period:</span>
      </div>
      
      <div className="flex items-center gap-2">
        <div className="relative">
          <select
            value={year}
            onChange={e => handleYearChange(Number(e.target.value))}
            className="appearance-none bg-background border border-input rounded-md px-3 py-2 text-sm font-medium pr-8 w-full md:w-auto min-w-[80px] focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent hover:border-muted-foreground transition-colors"
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
            className="appearance-none bg-background border border-input rounded-md px-3 py-2 text-sm font-medium pr-8 w-full md:w-auto min-w-[120px] focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent hover:border-muted-foreground transition-colors"
          >
            {months.map((m, idx) => (
              <option key={m} value={idx}>{m}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none text-gray-500" />
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row items-center gap-2 md:ml-auto mt-4 md:mt-0">
        {showSaveReminder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-blue-950 p-6 rounded-lg shadow-xl text-center">
              <h3 className="text-lg font-bold text-white mb-4">Don't Forget to Save!</h3>
              <p className="mb-4 text-white">Click the 'Save' button to make sure your data is stored.</p>
              <Button onClick={() => setShowSaveReminder(false)}>Got it</Button>
            </div>
          </div>
        )}
        <Button
          size="sm"
          variant="outline"
          className={`flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium ${isAttemptingToClose ? 'blinking' : ''}`}
          onClick={() => { onSave(); setShowSaveReminder(false); }}
          disabled={isSaving}
        >
          {isSaving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {isSaving ? 'Saving...' : 'Save'}
        </Button>
        <Button
          size="sm"
          variant="default"
          className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium bg-primary hover:bg-primary/90 text-primary-foreground transition-colors"
          onClick={onMonthDownload}
          disabled={isDownloading}
        >
          {isDownloading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          {isDownloading ? 'Generating...' : 'Download Report'}
        </Button>
      </div>
      {isDownloading && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
          <div className="text-center">
            <p className="text-2xl font-bold text-white shine-animation">Please wait, the PDF is being generated...</p>
          </div>
        </div>
      )}
    </div>
  );
}
