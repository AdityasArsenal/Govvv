import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/hooks/use-toast';
import { format, getDaysInMonth, startOfMonth, getDay, isToday } from 'date-fns';

const sheetNames = ["Meal Planning", "Milk & Ragi Distribution", "ಮೊಟ್ಟೆ ಮತ್ತು ಬಾಳೆಹಣ್ಣು", "Stock Management"];

const generateInitialData = (sheetName: string, month: Date) => {
  const daysInMonth = getDaysInMonth(month);
  const monthStart = startOfMonth(month);
  const dates = Array.from({ length: daysInMonth }, (_, i) => {
    return new Date(monthStart.getFullYear(), monthStart.getMonth(), i + 1);
  });

  switch (sheetName) {
    case "Meal Planning":
      return dates.map((date, i) => ({
        id: i + 1,
        date: date,
        day: format(date, "EEEE"),
        isSunday: getDay(date) === 0,
        isToday: isToday(date),
        morningMilk: 0,
        breakfast: '',
        afternoonRice: 0,
        dal: 0,
        vegetables: 0,
        eggOrBanana: '',
        chikki: 0,
        headCookSignature: "",
      }));
    case "Milk & Ragi Distribution":
      return dates.map((date, i) => ({
        id: i + 1,
        date: date,
        totalChildren: 0,
        openingMilkPowder: 0,
        openingRagi: 0,
        monthlyReceiptMilkPowder: 0,
        monthlyReceiptRagi: 0,
      }));
    case "ಮೊಟ್ಟೆ ಮತ್ತು ಬಾಳೆಹಣ್ಣು":
      return dates.map((date, i) => ({
        id: i + 1,
        date: date,
        payer: null,
        eggMale: 0,
        eggFemale: 0,
        chikkiMale: 0,
        chikkiFemale: 0,
      }));
    case "Stock Management":
      return dates.map((date, i) => ({
        id: i + 1,
        date: date,
        added_1to5: { rice: 0, wheat: 0, oil: 0, pulses: 0 },
        added_6to8: { rice: 0, wheat: 0, oil: 0, pulses: 0 },
      }));
    default:
      return [];
  }
};

export function useSheetData() {
  const { toast } = useToast();
  const [selectedSheet, setSelectedSheet] = useState<string>(sheetNames[0]);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [allSheetsData, setAllSheetsData] = useState<{ [key: string]: any[] }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    const fetchMonthData = async () => {
      setIsLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          const emptyData: { [key: string]: any[] } = {};
          sheetNames.forEach(name => {
            emptyData[name] = generateInitialData(name, selectedMonth);
          });
          setAllSheetsData(emptyData);
          toast({
            variant: "destructive",
            title: "Not Authenticated",
            description: "Please log in to fetch and save your data.",
          });
          return;
        }

        const monthStr = selectedMonth.toISOString().slice(0, 7);
        const { data, error } = await supabase
          .from('monthly_sheet_data')
          .select('sheet_name, data')
          .eq('month', monthStr)
          .eq('user_id', user.id);

        if (error) throw error;

        const newAllSheetsData: { [key: string]: any[] } = {};
        sheetNames.forEach(name => {
          const savedData = data.find(d => d.sheet_name === name);
          if (savedData && savedData.data) {
            newAllSheetsData[name] = savedData.data.map((row: any) => ({ ...row, date: new Date(row.date) }));
          } else {
            newAllSheetsData[name] = generateInitialData(name, selectedMonth);
          }
        });

        setAllSheetsData(newAllSheetsData);
        setHasUnsavedChanges(false);
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Failed to fetch data",
          description: error.message || "Could not retrieve data for the selected month.",
        });
        const emptyData: { [key: string]: any[] } = {};
        sheetNames.forEach(name => {
          emptyData[name] = generateInitialData(name, selectedMonth);
        });
        setAllSheetsData(emptyData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMonthData();
  }, [selectedMonth, toast]);

  const handleTableDataChange = useCallback((sheetName: string, newData: any[]) => {
    setAllSheetsData(prev => {
      if (JSON.stringify(prev[sheetName]) === JSON.stringify(newData)) {
        return prev;
      }
      setHasUnsavedChanges(true);
      return {
        ...prev,
        [sheetName]: newData,
      };
    });
  }, []);

  const handleMonthChange = (year: number, month: number) => {
    const newDate = new Date(year, month, 1);
    setSelectedMonth(newDate);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: "You must be logged in to save data.",
        });
        return;
      }

      const savePromises = Object.keys(allSheetsData).map(async (sheetName) => {
        const dataToSave = {
          user_id: user.id,
          sheet_name: sheetName,
          month: selectedMonth.toISOString().slice(0, 7),
          data: allSheetsData[sheetName],
          last_saved: new Date().toISOString(),
        };

        const { error } = await supabase
          .from('monthly_sheet_data')
          .upsert(dataToSave, { onConflict: 'user_id, sheet_name, month' });

        if (error) {
          console.error(`Error saving ${sheetName}:`, error);
          throw new Error(`Failed to save ${sheetName}: ${error.message}`);
        }
      });

      await Promise.all(savePromises);

      toast({
        title: "Data Saved",
        description: "Your changes have been saved successfully.",
      });
      setHasUnsavedChanges(false);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Save Failed",
        description: error.message || "Could not save data. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return {
    sheetNames,
    selectedSheet,
    setSelectedSheet,
    selectedMonth,
    handleMonthChange,
    allSheetsData,
    handleTableDataChange,
    isLoading,
    isSaving,
    handleSave,
    hasUnsavedChanges,
  };
}
