// SummarizeSheetData story implementation.
'use server';
/**
 * @fileOverview Summarizes the data in the currently selected sheet and date range.
 *
 * - summarizeSheetData - A function that handles the sheet data summarization process.
 * - SummarizeSheetDataInput - The input type for the summarizeSheetData function.
 * - SummarizeSheetDataOutput - The return type for the summarizeSheetData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeSheetDataInputSchema = z.object({
  sheetName: z.string().describe('The name of the sheet to summarize.'),
  startDate: z.string().describe('The start date for the data range.'),
  endDate: z.string().describe('The end date for the data range.'),
  data: z.array(z.object({
    col1: z.number(),
    col2: z.number(),
    col3: z.number(),
  })).describe('The data to summarize.'),
});
export type SummarizeSheetDataInput = z.infer<typeof SummarizeSheetDataInputSchema>;

const SummarizeSheetDataOutputSchema = z.object({
  summary: z.string().describe('A summary of the data in the sheet and date range.'),
});
export type SummarizeSheetDataOutput = z.infer<typeof SummarizeSheetDataOutputSchema>;

export async function summarizeSheetData(input: SummarizeSheetDataInput): Promise<SummarizeSheetDataOutput> {
  return summarizeSheetDataFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeSheetDataPrompt',
  input: {schema: SummarizeSheetDataInputSchema},
  output: {schema: SummarizeSheetDataOutputSchema},
  prompt: `You are an expert data analyst. You will receive data from a spreadsheet, 
  along with the sheet name, start date, and end date. You will provide a concise summary of the key trends and insights 
  from the data within the specified date range.

  Sheet Name: {{{sheetName}}}
  Start Date: {{{startDate}}}
  End Date: {{{endDate}}}

  Data: 
  {{#each data}}
    col1: {{{col1}}}, col2: {{{col2}}}, col3: {{{col3}}}
  {{/each}}
  `,
});

const summarizeSheetDataFlow = ai.defineFlow(
  {
    name: 'summarizeSheetDataFlow',
    inputSchema: SummarizeSheetDataInputSchema,
    outputSchema: SummarizeSheetDataOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
