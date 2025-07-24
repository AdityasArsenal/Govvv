"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { PlusCircle, Check } from "lucide-react";
import { format, getDaysInMonth, startOfMonth, getDay, isToday } from "date-fns";

interface SheetTableProps {
  selectedMonth: Date;
  initialData: SheetTableRow[];
  onTableDataChange: (data: SheetTableRow[]) => void;
}

interface SheetTableRow {
  id: number;
  date: Date;
  count1to5: number;
  count6to8: number;
  mealType: 'rice' | 'wheat' | null; // ಅಕ್ಕಿ or ಗೋಧಿ selection
}

export function SheetTable({ selectedMonth, initialData, onTableDataChange }: SheetTableProps) {
  
  const generateMonthDates = React.useCallback((date: Date) => {
    const daysInMonth = getDaysInMonth(date);
    const monthStart = startOfMonth(date);
    return Array.from({ length: daysInMonth }, (_, i) => ({
      id: i + 1,
      date: new Date(monthStart.getFullYear(), monthStart.getMonth(), i + 1),
      count1to5: 0,
      count6to8: 0,
      mealType: null,
    }));
  }, []);

  const [rows, setRows] = React.useState<SheetTableRow[]>(() => {
    if (initialData && initialData.length > 0) {
      return initialData.map(row => ({...row, date: new Date(row.date)}));
    }
    return generateMonthDates(selectedMonth);
  });

  React.useEffect(() => {
    if (initialData && initialData.length > 0) {
        setRows(initialData.map(row => ({...row, date: new Date(row.date)})));
    } else {
        setRows(generateMonthDates(selectedMonth));
    }
  }, [selectedMonth, initialData, generateMonthDates]);

  // Update parent component with current table data whenever rows change
  React.useEffect(() => {
    onTableDataChange(rows);
  }, [rows, onTableDataChange]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: number,
    group: "count1to5" | "count6to8"
  ) => {
    const value = e.target.valueAsNumber;
    setRows(prev => prev.map(row => row.id === id ? { ...row, [group]: isNaN(value) ? 0 : value } : row));
  };

  const handleMealTypeChange = (id: number, mealType: 'rice' | 'wheat') => {
    setRows(prev => prev.map(row => row.id === id ? { ...row, mealType } : row));
  };

  // Remove the local month change handler since it's now controlled by parent

  // Calculation formulas with meal type consideration
  const calc1to5 = (count: number, mealType: 'rice' | 'wheat' | null) => ({
    rice: mealType === 'rice' ? count * 0.1 : 0,
    wheat: mealType === 'wheat' ? count * 0.1 : 0,
    oil: count * 0.005,
    pulses: count * 0.02,
    sadilvaru: count * 2.15,
  });
  const calc6to8 = (count: number, mealType: 'rice' | 'wheat' | null) => ({
    rice: mealType === 'rice' ? count * 0.15 : 0,
    wheat: mealType === 'wheat' ? count * 0.15 : 0,
    oil: count * 0.0075,
    pulses: count * 0.03,
    sadilvaru: count * 3.12,
  });

  // Helper function to check if a date is Sunday
  const isSunday = (date: Date) => getDay(date) === 0;

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell colSpan={15} className="text-center">
              <div className="text-lg font-semibold text-gray-700">
                {format(selectedMonth, 'MMMM yyyy')} - Meal Planning Schedule
              </div>
            </TableCell>
          </TableRow>

          <TableRow>
            <TableHead className="text-center font-bold">Date</TableHead>
            <TableHead className="text-center font-bold">Meal</TableHead>
            <TableHead colSpan={6} className="text-center border-r font-bold">1-5</TableHead>
            <TableHead colSpan={6} className="text-center font-bold">6-10</TableHead>
            <TableHead className="text-center font-bold">ಒಟ್ಟು ಸಾದಿಲ್ವಾರು</TableHead>
          </TableRow>
          <TableRow>
            <TableHead className="w-[100px]"></TableHead>
            <TableHead className="w-[120px]">Meal Type</TableHead>
            <TableHead className="w-[100px]">ಮಕ್ಕಳ ಸಂಖ್ಯೆ</TableHead>
            <TableHead>ಅಕ್ಕಿ</TableHead>
            <TableHead>ಗೋಧಿ</TableHead>
            <TableHead>ಎಣ್ಣೆ</TableHead>
            <TableHead>ಬೇಳೆ</TableHead>
            <TableHead className="border-r">ಸಾದಿಲ್ವಾರು</TableHead>
            <TableHead className="w-[100px]">ಮಕ್ಕಳ ಸಂಖ್ಯೆ</TableHead>
            <TableHead>ಅಕ್ಕಿ</TableHead>
            <TableHead>ಗೋಧಿ</TableHead>
            <TableHead>ಎಣ್ಣೆ</TableHead>
            <TableHead>ಬೇಳೆ</TableHead>
            <TableHead className="border-r">ಸಾದಿಲ್ವಾರು</TableHead>
            <TableHead className="text-center"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map(row => {
            const c1 = calc1to5(row.count1to5, row.mealType);
            const c2 = calc6to8(row.count6to8, row.mealType);
            const totalSadilvaru = c1.sadilvaru + c2.sadilvaru;
            const isRowSunday = isSunday(row.date);
            const isRowToday = isToday(row.date);
            
            return (
              <TableRow 
              key={row.id} 
              className={`${
                isRowToday ? 'bg-blue-100 dark:bg-blue-900/50' : ''
              }`}
            >
              <TableCell className={`font-medium ${
                isRowSunday ? 'text-red-600 dark:text-red-400 font-semibold' : ''
              }`}>
                {format(row.date, 'dd/MM/yyyy')}
                <div className="text-xs text-gray-500">{format(row.date, 'EEEE')}</div>
              </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => handleMealTypeChange(row.id, 'rice')}
                      className={`w-20 px-2 py-1 text-xs rounded flex items-center justify-center gap-1 transition-colors ${
                        row.mealType === 'rice'
                          ? 'bg-blue-500 text-white font-semibold'
                          : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600'
                      }`}
                    >
                      {row.mealType === 'rice' && <Check className="h-3 w-3" />}
                      <span>ಅಕ್ಕಿ</span>
                    </button>
                    <button
                      onClick={() => handleMealTypeChange(row.id, 'wheat')}
                      className={`w-20 px-2 py-1 text-xs rounded flex items-center justify-center gap-1 transition-colors ${
                        row.mealType === 'wheat'
                          ? 'bg-orange-500 text-white font-semibold'
                          : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600'
                      }`}
                    >
                      {row.mealType === 'wheat' && <Check className="h-3 w-3" />}
                      <span>ಗೋಧಿ</span>
                    </button>
                  </div>
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={row.count1to5 || ''}
                    onChange={e => handleInputChange(e, row.id, "count1to5")}
                    className="w-20"
                    placeholder="0"
                    disabled={isRowSunday}
                  />
                </TableCell>
                <TableCell>{row.count1to5 > 0 && row.mealType ? c1.rice.toFixed(3) : ''}</TableCell>
                <TableCell>{row.count1to5 > 0 && row.mealType ? c1.wheat.toFixed(3) : ''}</TableCell>
                <TableCell>{row.count1to5 > 0 && row.mealType ? c1.oil.toFixed(3) : ''}</TableCell>
                <TableCell>{row.count1to5 > 0 && row.mealType ? c1.pulses.toFixed(3) : ''}</TableCell>
                <TableCell className="border-r">{row.count1to5 > 0 && row.mealType ? c1.sadilvaru.toFixed(3) : ''}</TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={row.count6to8 || ''}
                    onChange={e => handleInputChange(e, row.id, "count6to8")}
                    className="w-20"
                    placeholder="0"
                    disabled={isRowSunday}
                  />
                </TableCell>
                <TableCell>{row.count6to8 > 0 && row.mealType ? c2.rice.toFixed(3) : ''}</TableCell>
                <TableCell>{row.count6to8 > 0 && row.mealType ? c2.wheat.toFixed(3) : ''}</TableCell>
                <TableCell>{row.count6to8 > 0 && row.mealType ? c2.oil.toFixed(3) : ''}</TableCell>
                <TableCell>{row.count6to8 > 0 && row.mealType ? c2.pulses.toFixed(3) : ''}</TableCell>
                <TableCell className="border-r">{row.count6to8 > 0 && row.mealType ? c2.sadilvaru.toFixed(3) : ''}</TableCell>
                <TableCell className="font-medium text-center">
                  {(row.count1to5 > 0 || row.count6to8 > 0) && row.mealType ? totalSadilvaru.toFixed(3) : ''}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={2} className="font-bold">Grand Total</TableCell>
            <TableCell className="font-bold">{rows.reduce((acc, row) => acc + (row.count1to5 || 0), 0)}</TableCell>
            <TableCell className="font-bold">{rows.reduce((acc, row) => acc + (row.mealType ? calc1to5(row.count1to5, row.mealType).rice : 0), 0).toFixed(3)}</TableCell>
            <TableCell className="font-bold">{rows.reduce((acc, row) => acc + (row.mealType ? calc1to5(row.count1to5, row.mealType).wheat : 0), 0).toFixed(3)}</TableCell>
            <TableCell className="font-bold">{rows.reduce((acc, row) => acc + (row.mealType ? calc1to5(row.count1to5, row.mealType).oil : 0), 0).toFixed(3)}</TableCell>
            <TableCell className="font-bold">{rows.reduce((acc, row) => acc + (row.mealType ? calc1to5(row.count1to5, row.mealType).pulses : 0), 0).toFixed(3)}</TableCell>
            <TableCell className="border-r font-bold">{rows.reduce((acc, row) => acc + (row.mealType ? calc1to5(row.count1to5, row.mealType).sadilvaru : 0), 0).toFixed(3)}</TableCell>
            <TableCell className="font-bold">{rows.reduce((acc, row) => acc + (row.count6to8 || 0), 0)}</TableCell>
            <TableCell className="font-bold">{rows.reduce((acc, row) => acc + (row.mealType ? calc6to8(row.count6to8, row.mealType).rice : 0), 0).toFixed(3)}</TableCell>
            <TableCell className="font-bold">{rows.reduce((acc, row) => acc + (row.mealType ? calc6to8(row.count6to8, row.mealType).wheat : 0), 0).toFixed(3)}</TableCell>
            <TableCell className="font-bold">{rows.reduce((acc, row) => acc + (row.mealType ? calc6to8(row.count6to8, row.mealType).oil : 0), 0).toFixed(3)}</TableCell>
            <TableCell className="font-bold">{rows.reduce((acc, row) => acc + (row.mealType ? calc6to8(row.count6to8, row.mealType).pulses : 0), 0).toFixed(3)}</TableCell>
            <TableCell className="border-r font-bold">{rows.reduce((acc, row) => acc + (row.mealType ? calc6to8(row.count6to8, row.mealType).sadilvaru : 0), 0).toFixed(3)}</TableCell>
            <TableCell className="font-bold text-center">{rows.reduce((acc, row) => acc + (row.mealType ? calc1to5(row.count1to5, row.mealType).sadilvaru + calc6to8(row.count6to8, row.mealType).sadilvaru : 0), 0).toFixed(3)}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
