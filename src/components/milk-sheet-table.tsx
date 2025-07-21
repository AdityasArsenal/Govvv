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

interface MilkSheetTableRow {
  id: number;
  date: Date;
  totalChildren: number;
  openingMilkPowder: number;
  openingRagi: number;
  monthlyReceiptMilkPowder: number;
  monthlyReceiptRagi: number;
  headCookSignature: string;
}

interface MilkSheetTableProps {
  selectedMonth: Date;
  onTableDataChange: (data: MilkSheetTableRow[]) => void;
}

export function MilkSheetTable({ selectedMonth, onTableDataChange }: MilkSheetTableProps) {
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
        headCookSignature: "",
      });
    }
    return dates;
  }, []);

  const [rows, setRows] = React.useState<MilkSheetTableRow[]>(() => generateMonthDates(selectedMonth));

  React.useEffect(() => {
    const newRows = generateMonthDates(selectedMonth);
    setRows(newRows);
  }, [selectedMonth, generateMonthDates]);

  React.useEffect(() => {
    // Recalculate the entire table when the month changes
    const newRows = generateMonthDates(selectedMonth);
    setRows(newRows);
  }, [selectedMonth, generateMonthDates]);

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
          const prevDistRagi = prev.totalChildren * 0.005;
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
            <TableCell colSpan={15} className="text-center">
              <div className="text-lg font-semibold">
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
            <TableHead rowSpan={2} className="text-center align-middle">ಮುಖ್ಯ ಅಡುಗೆಯವರ ಸಹಿ</TableHead>
          </TableRow>
          <TableRow>
            <TableHead>ಹಾಲಿನ ಪುಡಿ</TableHead>
            <TableHead>ರಾಗಿ</TableHead>
            <TableHead>ಹಾಲಿನ ಪುಡಿ</TableHead>
            <TableHead>ರಾಗಿ</TableHead>
            <TableHead>ಹಾಲಿನ ಪುಡಿ</TableHead>
            <TableHead>ರಾಗಿ</TableHead>
            <TableHead>ಹಾಲಿನ ಪುಡಿ</TableHead>
            <TableHead>ರಾಗಿ</TableHead>
            <TableHead>ಹಾಲಿನ ಪುಡಿ</TableHead>
            <TableHead>ರಾಗಿ</TableHead>
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
            const distRagi = row.totalChildren * 0.005;
            const closingMilkPowder = totalMilkPowder - distMilkPowder;
            const closingRagi = totalRagi - distRagi;
            const totalSugarCalculated = row.totalChildren * 0.44;

            return (
              <TableRow key={row.id} className={`${isRowSunday ? 'text-red-600 dark:text-red-400 font-semibold' : ''} ${isRowToday ? 'bg-blue-900/50' : ''}`}>
                <TableCell>
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
                <TableCell>
                  <Input 
                    type="text" 
                    value={row.headCookSignature}
                    onChange={(e) => handleInputChange(row.id, 'headCookSignature', e.target.value)}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
