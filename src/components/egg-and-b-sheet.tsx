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
import { format, getDaysInMonth, startOfMonth, getDay, isToday } from "date-fns";
import { Check } from "lucide-react";

interface EggAndBSheetRow {
  id: number;
  date: Date;
  payer: 'APF' | 'GOV' | null;
  eggMale: number;
  eggFemale: number;
  chikkiMale: number;
  chikkiFemale: number;
}

interface EggAndBSheetProps {
  selectedMonth: Date;
  initialData: EggAndBSheetRow[];
  onTableDataChange: (data: EggAndBSheetRow[]) => void;
}

export function EggAndBSheet({ selectedMonth, initialData, onTableDataChange }: EggAndBSheetProps) {
  const [eggPrice, setEggPrice] = React.useState<number>(6);
  const [bananaPrice, setBananaPrice] = React.useState<number>(5);
  const generateMonthDates = React.useCallback((date: Date) => {
    const daysInMonth = getDaysInMonth(date);
    const monthStart = startOfMonth(date);
    return Array.from({ length: daysInMonth }, (_, i) => {
      const currentDate = new Date(monthStart.getFullYear(), monthStart.getMonth(), i + 1);
      return {
        id: i + 1,
        date: currentDate,
        payer: null,
        eggMale: 0,
        eggFemale: 0,
        chikkiMale: 0,
        chikkiFemale: 0,
      };
    });
  }, []);

  const [rows, setRows] = React.useState<EggAndBSheetRow[]>(() => {
    if (initialData && initialData.length > 0) {
      return initialData.map(row => ({...row, date: new Date(row.date)}));
    }
    return generateMonthDates(selectedMonth);
  });

  const handlePriceChange = (setter: React.Dispatch<React.SetStateAction<number>>, value: string) => {
    setter(parseFloat(value) || 0);
  };

  React.useEffect(() => {
    if (initialData && initialData.length > 0) {
        setRows(initialData.map(row => ({...row, date: new Date(row.date)})));
    } else {
        setRows(generateMonthDates(selectedMonth));
    }
  }, [selectedMonth, initialData, generateMonthDates]);

  React.useEffect(() => {
    onTableDataChange(rows);
  }, [rows, onTableDataChange]);

  const handleInputChange = (id: number, field: keyof EggAndBSheetRow, value: any) => {
    setRows(prev => prev.map(row => row.id === id ? { ...row, [field]: value } : row));
  };

  const handlePayerChange = (id: number, payer: 'APF' | 'GOV') => {
    setRows(prev => prev.map(row => row.id === id ? { ...row, payer } : row));
  };

  const isSunday = (date: Date) => getDay(date) === 0;

  const calculateTotals = (row: EggAndBSheetRow) => {
    const c1 = row.eggMale || 0;
    const c2 = row.eggFemale || 0;
    const c3 = c1 + c2;
    const c4 = c3 * eggPrice;

    const d1 = row.chikkiMale || 0;
    const d2 = row.chikkiFemale || 0;
    const d3 = d1 + d2;
    const d4 = d3 * bananaPrice;

    const e1 = c1 + d1;
    const e2 = c2 + d2;
    const e3 = e1 + e2;

    const f = c4 + d4;

    return { c1, c2, c3, c4, d1, d2, d3, d4, e1, e2, e3, f };
  };

  const summary = React.useMemo(() => {
    const apfEggAmount = rows.filter(r => r.payer === 'APF').reduce((acc, row) => acc + calculateTotals(row).c4, 0);
    const govEggAmount = rows.filter(r => r.payer === 'GOV').reduce((acc, row) => acc + calculateTotals(row).c4, 0);
    const apfBananaAmount = rows.filter(r => r.payer === 'APF').reduce((acc, row) => acc + calculateTotals(row).d4, 0);
    const govBananaAmount = rows.filter(r => r.payer === 'GOV').reduce((acc, row) => acc + calculateTotals(row).d4, 0);

    const totalEgg = apfEggAmount + govEggAmount;
    const totalBanana = apfBananaAmount + govBananaAmount;
    const apfTotal = apfEggAmount + apfBananaAmount;
    const govTotal = govEggAmount + govBananaAmount;
    const grandTotal = apfTotal + govTotal;

    return {
      apfEggAmount, govEggAmount, apfBananaAmount, govBananaAmount,
      totalEgg, totalBanana, apfTotal, govTotal, grandTotal
    };
  }, [rows, eggPrice, bananaPrice]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 p-4 border rounded-lg">
        <h3 className="text-lg font-semibold">ಬೆಲೆಗಳು</h3>
        <div className="flex items-center gap-2">
          <label htmlFor="egg-price" className="font-medium">ಮೊಟ್ಟೆ ಬೆಲೆ:</label>
          <Input id="egg-price" type="number" value={eggPrice} onChange={e => handlePriceChange(setEggPrice, e.target.value)} className="w-24" />
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="banana-price" className="font-medium">ಬಾಳೆ ಬೆಲೆ:</label>
          <Input id="banana-price" type="number" value={bananaPrice} onChange={e => handlePriceChange(setBananaPrice, e.target.value)} className="w-24" />
        </div>
      </div>

      <div className="rounded-md border p-4">
        <h3 className="text-lg font-semibold text-center">Summary</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead></TableHead>
              <TableHead className="text-center font-bold">ಮೊಟ್ಟೆ</TableHead>
              <TableHead className="text-center font-bold">ಬಾಳೆ</TableHead>
              <TableHead className="text-center font-bold">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-bold">APF</TableCell>
              <TableCell className="text-center">{summary.apfEggAmount.toFixed(2)}</TableCell>
              <TableCell className="text-center">{summary.apfBananaAmount.toFixed(2)}</TableCell>
              <TableCell className="text-center font-bold">{summary.apfTotal.toFixed(2)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-bold">GOV</TableCell>
              <TableCell className="text-center">{summary.govEggAmount.toFixed(2)}</TableCell>
              <TableCell className="text-center">{summary.govBananaAmount.toFixed(2)}</TableCell>
              <TableCell className="text-center font-bold">{summary.govTotal.toFixed(2)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-bold">Total</TableCell>
              <TableCell className="text-center font-bold">{summary.totalEgg.toFixed(2)}</TableCell>
              <TableCell className="text-center font-bold">{summary.totalBanana.toFixed(2)}</TableCell>
              <TableCell className="text-center font-bold text-lg">{summary.grandTotal.toFixed(2)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell colSpan={15} className="text-center">
              <div className="text-lg font-semibold">{format(selectedMonth, 'MMMM yyyy')} - ಮೊಟ್ಟೆ ಮತ್ತು ಬಾಳೆಹಣ್ಣು</div>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableHead rowSpan={2} className="align-middle text-center">ದಿನಾಂಕ</TableHead>
            <TableHead rowSpan={2} className="align-middle text-center">ಪಾವತಿಸುವವನು</TableHead>
            <TableHead colSpan={4} className="text-center">ಮೊಟ್ಟೆ</TableHead>
            <TableHead colSpan={4} className="text-center">ಚಿಕ್ಕಿ/ಬಾಳೆ ಹಣ್ಣು</TableHead>
            <TableHead colSpan={3} className="text-center">ಒಟ್ಟು</TableHead>
            <TableHead rowSpan={2} className="align-middle text-center">ಒಟ್ಟು ಹಣ</TableHead>
          </TableRow>
          <TableRow>
            <TableHead>ಗಂಡು</TableHead>
            <TableHead>ಹೆಣ್ಣು</TableHead>
            <TableHead>ಒಟ್ಟು</TableHead>
            <TableHead>ಹಣ</TableHead>
            <TableHead>ಗಂಡು</TableHead>
            <TableHead>ಹೆಣ್ಣು</TableHead>
            <TableHead>ಒಟ್ಟು</TableHead>
            <TableHead>ಹಣ</TableHead>
            <TableHead>ಗಂಡು</TableHead>
            <TableHead>ಹೆಣ್ಣು</TableHead>
            <TableHead>ಒಟ್ಟು</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map(row => {
            const isRowSunday = isSunday(row.date);
            const isRowToday = isToday(row.date);
            const totals = calculateTotals(row);

            return (
              <TableRow key={row.id} className={`${isRowToday ? 'bg-blue-100 dark:bg-blue-900/50' : ''}`}>
                <TableCell className={`font-medium ${isRowSunday ? 'text-red-600 dark:text-red-400 font-semibold' : ''}`}>
                  {format(row.date, 'dd/MM/yyyy')}
                  <div className="text-xs text-gray-500">{format(row.date, 'EEEE')}</div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => handlePayerChange(row.id, 'APF')}
                      disabled={isRowSunday}
                      className={`w-20 px-2 py-1 text-xs rounded flex items-center justify-center gap-1 transition-colors ${
                        row.payer === 'APF'
                          ? 'bg-green-500 text-white font-semibold'
                          : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600'
                      }`}>
                      {row.payer === 'APF' && <Check className="h-3 w-3" />}<span>APF</span>
                    </button>
                    <button
                      onClick={() => handlePayerChange(row.id, 'GOV')}
                      disabled={isRowSunday}
                      className={`w-20 px-2 py-1 text-xs rounded flex items-center justify-center gap-1 transition-colors ${
                        row.payer === 'GOV'
                          ? 'bg-purple-500 text-white font-semibold'
                          : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600'
                      }`}>
                      {row.payer === 'GOV' && <Check className="h-3 w-3" />}<span>GOV</span>
                    </button>
                  </div>
                </TableCell>
                <TableCell><Input type="number" value={row.eggMale || ''} onChange={e => handleInputChange(row.id, 'eggMale', e.target.valueAsNumber)} disabled={isRowSunday} className="w-20" /></TableCell>
                <TableCell><Input type="number" value={row.eggFemale || ''} onChange={e => handleInputChange(row.id, 'eggFemale', e.target.valueAsNumber)} disabled={isRowSunday} className="w-20" /></TableCell>
                <TableCell>{totals.c3}</TableCell>
                <TableCell>{totals.c4.toFixed(2)}</TableCell>
                <TableCell><Input type="number" value={row.chikkiMale || ''} onChange={e => handleInputChange(row.id, 'chikkiMale', e.target.valueAsNumber)} disabled={isRowSunday} className="w-20" /></TableCell>
                <TableCell><Input type="number" value={row.chikkiFemale || ''} onChange={e => handleInputChange(row.id, 'chikkiFemale', e.target.valueAsNumber)} disabled={isRowSunday} className="w-20" /></TableCell>
                <TableCell>{totals.d3}</TableCell>
                <TableCell>{totals.d4.toFixed(2)}</TableCell>
                <TableCell>{totals.e1}</TableCell>
                <TableCell>{totals.e2}</TableCell>
                <TableCell>{totals.e3}</TableCell>
                <TableCell>{totals.f.toFixed(2)}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
        <TableFooter>
            <TableRow>
                <TableCell colSpan={2} className="font-bold">Grand Total</TableCell>
                <TableCell className="font-bold">{rows.reduce((acc, row) => acc + (row.eggMale || 0), 0)}</TableCell>
                <TableCell className="font-bold">{rows.reduce((acc, row) => acc + (row.eggFemale || 0), 0)}</TableCell>
                <TableCell></TableCell>
                <TableCell className="font-bold">{rows.reduce((acc, row) => acc + calculateTotals(row).c4, 0).toFixed(2)}</TableCell>
                <TableCell className="font-bold">{rows.reduce((acc, row) => acc + (row.chikkiMale || 0), 0)}</TableCell>
                <TableCell className="font-bold">{rows.reduce((acc, row) => acc + (row.chikkiFemale || 0), 0)}</TableCell>
                <TableCell></TableCell>
                <TableCell className="font-bold">{rows.reduce((acc, row) => acc + calculateTotals(row).d4, 0).toFixed(2)}</TableCell>
                <TableCell className="font-bold">{rows.reduce((acc, row) => acc + calculateTotals(row).e1, 0)}</TableCell>
                <TableCell className="font-bold">{rows.reduce((acc, row) => acc + calculateTotals(row).e2, 0)}</TableCell>
                <TableCell className="font-bold">{rows.reduce((acc, row) => acc + calculateTotals(row).e3, 0)}</TableCell>
                <TableCell className="font-bold">{rows.reduce((acc, row) => acc + calculateTotals(row).f, 0).toFixed(2)}</TableCell>
            </TableRow>
        </TableFooter>
      </Table>
    </div>
    </div>
  );
}
