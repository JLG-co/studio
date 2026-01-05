'use server';
/**
 * @fileOverview An AI agent for analyzing mathematical function properties.
 *
 * - analyzeFunctionProperties - A function that analyzes a given function string.
 * - FunctionAnalysisInput - The input type for the analyzeFunctionProperties function.
 * - FunctionAnalysisOutput - The return type for the analyzeFunctionProperties function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

export const FunctionAnalysisInputSchema = z.object({
  functionStr: z.string().describe('The mathematical function to analyze, as a string. e.g., "x^3 - 3*x + 2"'),
  domainStr: z.string().describe('The domain over which to analyze the function, as a string. e.g., "[-2, 2]" or "R"'),
});
export type FunctionAnalysisInput = z.infer<typeof FunctionAnalysisInputSchema>;

export const FunctionAnalysisOutputSchema = z.object({
    analysis: z.array(z.string()).describe('A step-by-step analysis of the function in Arabic, including calculating the derivative, finding critical points, and determining intervals of increase/decrease.'),
    variationTable: z.object({
        headers: z.array(z.string()).describe('The headers for the variation table. Typically ["x", "f\'(x)", "f(x)"].'),
        rows: z.array(z.array(z.string())).describe('The rows of the variation table, where each inner array represents a row.'),
    }).describe('A structured representation of the function\'s variation table (tableau de variation).'),
});
export type FunctionAnalysisOutput = z.infer<typeof FunctionAnalysisOutputSchema>;

export async function analyzeFunctionProperties(input: FunctionAnalysisInput): Promise<FunctionAnalysisOutput> {
  return functionAnalysisFlow(input);
}


const functionAnalysisPrompt = ai.definePrompt({
    name: 'functionAnalysisPrompt',
    input: { schema: FunctionAnalysisInputSchema },
    output: { schema: FunctionAnalysisOutputSchema },
    prompt: `You are an expert mathematician AI. Your task is to analyze a given function f(x) over a specified domain and produce a detailed analysis and a variation table (tableau de variation). All output text must be in Arabic.

Function: f(x) = {{{functionStr}}}
Domain: {{{domainStr}}}

Perform the following steps for your analysis:
1.  Calculate the derivative, f'(x).
2.  Find the critical points by solving f'(x) = 0.
3.  Study the sign of f'(x) to determine the intervals where f(x) is increasing or decreasing.
4.  Calculate the values of f(x) at the critical points and the boundaries of the domain.
5.  Summarize these findings in a structured variation table.

The output must be in the specified JSON format. The variation table should be structured with headers and rows of strings. Use arrows like '↗' for increasing and '↘' for decreasing in the f(x) row.
`,
});


const functionAnalysisFlow = ai.defineFlow(
  {
    name: 'functionAnalysisFlow',
    inputSchema: FunctionAnalysisInputSchema,
    outputSchema: FunctionAnalysisOutputSchema,
  },
  async (input) => {
    const { output } = await functionAnalysisPrompt(input);
    if (!output) {
      throw new Error('Failed to analyze the function.');
    }
    return output;
  }
);
