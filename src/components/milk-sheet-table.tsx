"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { format, getDaysInMonth, startOfMonth, getDay, isToday } from "date-fns";
import { TableFooter } from "@/components/ui/table";

interface MilkSheetTableRow {
  id: number;
  date: Date;
  totalChildren: number;
  openingMilkPowder: number;
  openingRagi: number;
  monthlyReceiptMilkPowder: number;
  monthlyReceiptRagi: number;
}

interface MilkSheetTableProps {
  selectedMonth: Date;
  initialData: MilkSheetTableRow[];
  onTableDataChange: (data: MilkSheetTableRow[]) => void;
}

export function MilkSheetTable({ selectedMonth, initialData, onTableDataChange }: MilkSheetTableProps) {
  const generateMonthDates = React.useCallback((date: Date) => {
    const daysInMonth = getDaysInMonth(date);
    const monthStart = startOfMonth(date);
    const dates: MilkSheetTableRow[] = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(monthStart.getFullYear(), monthStart.getMonth(), day);
      dates.push({
        id: day,
        date: currentDate,
        totalChildren: 0,
        openingMilkPowder: 0,
        openingRagi: 0,
        monthlyReceiptMilkPowder: 0,
        monthlyReceiptRagi: 0,

      });
    }
    return dates;
  }, []);

  const [rows, setRows] = React.useState<MilkSheetTableRow[]>(() => {
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

  const handleInputChange = (id: number, field: keyof MilkSheetTableRow, value: any) => {
    const newRows = [...rows];
    const rowIndex = newRows.findIndex(row => row.id === id);

    if (rowIndex !== -1) {
      (newRows[rowIndex] as any)[field] = value;

      // Recalculate all subsequent rows
      for (let i = rowIndex; i < newRows.length; i++) {
        const current = newRows[i];
        const prev = i > 0 ? newRows[i - 1] : null;

        // Carry over closing stock from previous day to opening stock of current day
        if (prev) {
          const prevTotalMilk = prev.openingMilkPowder + prev.monthlyReceiptMilkPowder;
          const prevDistMilk = prev.totalChildren * 0.018;
          current.openingMilkPowder = prevTotalMilk - prevDistMilk;

          const prevTotalRagi = prev.openingRagi + prev.monthlyReceiptRagi;
          const prevDayOfWeek = getDay(prev.date);
          const prevDistRagi = [1, 3, 5].includes(prevDayOfWeek) ? prev.totalChildren * 0.005 : 0;
          current.openingRagi = prevTotalRagi - prevDistRagi;
        }
      }
      setRows(newRows);
    }
  };

  React.useEffect(() => {
    onTableDataChange(rows);
  }, [rows, onTableDataChange]);

  const isSunday = (date: Date) => getDay(date) === 0;

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell colSpan={14} className="text-center">
              <div className="text-lg font-semibold text-gray-700">
                {format(selectedMonth, 'MMMM yyyy')} - Milk & Ragi Distribution
              </div>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableHead rowSpan={2} className="text-center align-middle">ದಿನಾಂಕ</TableHead>
            <TableHead rowSpan={2} className="text-center align-middle">ಒಟ್ಟು ಮಕ್ಕಳ ಸಂಖ್ಯೆ</TableHead>
            <TableHead colSpan={2} className="text-center">ಆರಂಭಿಕ ಶಿಲ್ಕು</TableHead>
            <TableHead colSpan={2} className="text-center">ತಿಂಗಳ ಸ್ವೀಕೃತಿ</TableHead>
            <TableHead colSpan={2} className="text-center">ಒಟ್ಟು</TableHead>
            <TableHead colSpan={2} className="text-center">ದಿನದ ವಿತರಣೆ</TableHead>
            <TableHead colSpan={2} className="text-center">ಅಂತಿಮ ಶಿಲ್ಕು</TableHead>
            <TableHead rowSpan={2} className="text-center align-middle">ಒಟ್ಟು ಸಕ್ಕರೆ</TableHead>

          </TableRow>
          <TableRow>
            <TableHead>ಹಾಲಿನ ಪುಡಿ</TableHead>
            <TableHead>ರಾಗಿ ಶ್ಯೂರ್</TableHead>
            <TableHead>ಹಾಲಿನ ಪುಡಿ</TableHead>
            <TableHead>ರಾಗಿ ಶ್ಯೂರ್</TableHead>
            <TableHead>ಹಾಲಿನ ಪುಡಿ</TableHead>
            <TableHead>ರಾಗಿ ಶ್ಯೂರ್</TableHead>
            <TableHead>ಹಾಲಿನ ಪುಡಿ</TableHead>
            <TableHead>ರಾಗಿ ಶ್ಯೂರ್</TableHead>
            <TableHead>ಹಾಲಿನ ಪುಡಿ</TableHead>
            <TableHead>ರಾಗಿ ಶ್ಯೂರ್</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => {
            const isRowSunday = isSunday(row.date);
            const isRowToday = isToday(row.date);

            // Calculations
            const totalMilkPowder = row.openingMilkPowder + row.monthlyReceiptMilkPowder;
            const totalRagi = row.openingRagi + row.monthlyReceiptRagi;
            const distMilkPowder = row.totalChildren * 0.018;
            const dayOfWeek = getDay(row.date);
            const distRagi = [1, 3, 5].includes(dayOfWeek) ? row.totalChildren * 0.005 : 0;
            const closingMilkPowder = totalMilkPowder - distMilkPowder;
            const closingRagi = totalRagi - distRagi;
            const totalSugarCalculated = row.totalChildren * 0.44;

            return (
              <TableRow key={row.id} className={`${isRowToday ? 'bg-blue-100 dark:bg-blue-900/50' : ''}`}>
                <TableCell className={`font-medium ${isRowSunday ? 'text-red-600 dark:text-red-400 font-semibold' : ''}`}>
                  {format(row.date, 'dd/MM/yyyy')}
                  <div className="text-xs text-gray-500">{format(row.date, 'EEEE')}</div>
                </TableCell>
                <TableCell>
                  <Input 
                    type="number" 
                    value={row.totalChildren || ''} 
                    onChange={(e) => handleInputChange(row.id, 'totalChildren', e.target.valueAsNumber)}
                    className="w-24"
                    placeholder="0"
                    disabled={isRowSunday}
                  />
                </TableCell>
                <TableCell>{row.openingMilkPowder.toFixed(3)}</TableCell>
                <TableCell>{row.openingRagi.toFixed(3)}</TableCell>
                <TableCell>
                  <Input 
                    type="number" 
                    value={row.monthlyReceiptMilkPowder || ''} 
                    onChange={(e) => handleInputChange(row.id, 'monthlyReceiptMilkPowder', e.target.valueAsNumber)}
                    className="w-24"
                    placeholder="0"
                  />
                </TableCell>
                <TableCell>
                  <Input 
                    type="number" 
                    value={row.monthlyReceiptRagi || ''} 
                    onChange={(e) => handleInputChange(row.id, 'monthlyReceiptRagi', e.target.valueAsNumber)}
                    className="w-24"
                    placeholder="0"
                  />
                </TableCell>
                <TableCell>{totalMilkPowder.toFixed(3)}</TableCell>
                <TableCell>{totalRagi.toFixed(3)}</TableCell>
                <TableCell>{distMilkPowder.toFixed(3)}</TableCell>
                <TableCell>{distRagi.toFixed(3)}</TableCell>
                <TableCell>{closingMilkPowder.toFixed(3)}</TableCell>
                <TableCell>{closingRagi.toFixed(3)}</TableCell>
                <TableCell>{totalSugarCalculated.toFixed(2)}</TableCell>

              </TableRow>
            );
          })}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={1} className="font-bold">Grand Total</TableCell>
            <TableCell className="font-bold">{rows.reduce((acc, row) => acc + (row.totalChildren || 0), 0)}</TableCell>
            <TableCell colSpan={2}></TableCell>
            <TableCell className="font-bold">{rows.reduce((acc, row) => acc + (row.monthlyReceiptMilkPowder || 0), 0).toFixed(3)}</TableCell>
            <TableCell className="font-bold">{rows.reduce((acc, row) => acc + (row.monthlyReceiptRagi || 0), 0).toFixed(3)}</TableCell>
            <TableCell colSpan={2}></TableCell>
            <TableCell className="font-bold">{rows.reduce((acc, row) => acc + (row.totalChildren * 0.018), 0).toFixed(3)}</TableCell>
            <TableCell className="font-bold">{rows.reduce((acc, row) => {
                const dayOfWeek = getDay(row.date);
                const ragiDist = [1, 3, 5].includes(dayOfWeek) ? row.totalChildren * 0.005 : 0;
                return acc + ragiDist;
            }, 0).toFixed(3)}</TableCell>
            <TableCell colSpan={2}></TableCell>
            <TableCell className="font-bold">{rows.reduce((acc, row) => acc + (row.totalChildren * 0.44), 0).toFixed(2)}</TableCell>

          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
