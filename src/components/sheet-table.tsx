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
import type { Row } from "./data-canvas";
import { PlusCircle } from "lucide-react";
import { format } from "date-fns";

interface SheetTableProps {
  data: Row[];
  onRowChange: (id: number, column: "col1" | "col2", value: number) => void;
  addRow: () => void;
}

interface SheetTableRow {
  id: number;
  count1to5: number;
  count6to8: number;
}

export function SheetTable({ data, onRowChange, addRow }: SheetTableProps) {
  const [rows, setRows] = React.useState<SheetTableRow[]>([
    { id: 1, count1to5: 0, count6to8: 0 },
  ]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: number,
    group: "count1to5" | "count6to8"
  ) => {
    const value = e.target.valueAsNumber;
    setRows(prev => prev.map(row => row.id === id ? { ...row, [group]: isNaN(value) ? 0 : value } : row));
  };

  const handleAddRow = () => {
    setRows(prev => [
      ...prev,
      { id: prev.length ? Math.max(...prev.map(r => r.id)) + 1 : 1, count1to5: 0, count6to8: 0 },
    ]);
  };

  // Calculation formulas
  const calc1to5 = (count: number) => ({
    rice: count * 0.1,
    wheat: count * 0.1,
    oil: count * 0.005,
    pulses: count * 0.02,
    sadilvaru: count * 2.15,
  });
  const calc6to8 = (count: number) => ({
    rice: count * 0.15,
    wheat: count * 0.15,
    oil: count * 0.0075,
    pulses: count * 0.03,
    sadilvaru: count * 3.12,
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead colSpan={6} className="text-center border-r font-bold">1-5</TableHead>
            <TableHead colSpan={6} className="text-center font-bold">6-8</TableHead>
          </TableRow>
          <TableRow>
            <TableHead className="w-[100px]">ಮಕ್ಕಳ ಸಂಖ್ಯೆ</TableHead>
            <TableHead>ಅಕ್ಕಿ</TableHead>
            <TableHead>ಗೋಧಿ</TableHead>
            <TableHead>ಎಣ್ಣೆ</TableHead>
            <TableHead>ಬೇಳೆ</TableHead>
            <TableHead className="border-r">ಸಾದಿಲ್ವಾರು</TableHead>
            <TableHead>ಮಕ್ಕಳ ಸಂಖ್ಯೆ</TableHead>
            <TableHead>ಅಕ್ಕಿ</TableHead>
            <TableHead>ಗೋಧಿ</TableHead>
            <TableHead>ಎಣ್ಣೆ</TableHead>
            <TableHead>ಬೇಳೆ</TableHead>
            <TableHead>ಸಾದಿಲ್ವಾರು</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map(row => {
            const c1 = calc1to5(row.count1to5);
            const c2 = calc6to8(row.count6to8);
            return (
              <TableRow key={row.id}>
                <TableCell>
                  <Input
                    type="number"
                    value={row.count1to5}
                    onChange={e => handleInputChange(e, row.id, "count1to5")}
                    className="w-20"
                  />
                </TableCell>
                <TableCell>{c1.rice.toFixed(3)}</TableCell>
                <TableCell>{c1.wheat.toFixed(3)}</TableCell>
                <TableCell>{c1.oil.toFixed(3)}</TableCell>
                <TableCell>{c1.pulses.toFixed(3)}</TableCell>
                <TableCell className="border-r">{c1.sadilvaru.toFixed(3)}</TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={row.count6to8}
                    onChange={e => handleInputChange(e, row.id, "count6to8")}
                    className="w-20"
                  />
                </TableCell>
                <TableCell>{c2.rice.toFixed(3)}</TableCell>
                <TableCell>{c2.wheat.toFixed(3)}</TableCell>
                <TableCell>{c2.oil.toFixed(3)}</TableCell>
                <TableCell>{c2.pulses.toFixed(3)}</TableCell>
                <TableCell>{c2.sadilvaru.toFixed(3)}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={12}>
              <Button onClick={handleAddRow} size="sm" variant="ghost" className="text-accent-foreground hover:text-accent-foreground">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Row
              </Button>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
