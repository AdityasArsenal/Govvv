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

export function SheetTable({ data, onRowChange, addRow }: SheetTableProps) {
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: number,
    column: "col1" | "col2"
  ) => {
    const value = e.target.valueAsNumber;
    if (!isNaN(value)) {
      onRowChange(id, column, value);
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[150px]">Date</TableHead>
            <TableHead>Column 1</TableHead>
            <TableHead>Column 2</TableHead>
            <TableHead className="text-right">Column 3 (Result)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? (
            data.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="font-medium">
                  {format(row.date, "PP")}
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    defaultValue={row.col1}
                    onChange={(e) => handleInputChange(e, row.id, "col1")}
                    className="w-24"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    defaultValue={row.col2}
                    onChange={(e) => handleInputChange(e, row.id, "col2")}
                    className="w-24"
                  />
                </TableCell>
                <TableCell className="text-right font-mono">{row.col3.toLocaleString()}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={4}>
              <Button onClick={addRow} size="sm" variant="ghost" className="text-accent-foreground hover:text-accent-foreground">
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
