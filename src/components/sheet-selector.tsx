"use client";

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SheetSelectorProps {
  sheets: string[];
  value: string;
  onValueChange: (value: string) => void;
}

export function SheetSelector({ sheets, value, onValueChange }: SheetSelectorProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a sheet" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Sheets</SelectLabel>
          {sheets.map((sheet) => (
            <SelectItem key={sheet} value={sheet}>
              {sheet}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
