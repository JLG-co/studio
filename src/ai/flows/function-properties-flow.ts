'use server';
/**
 * @fileOverview An AI agent for analyzing mathematical function properties.
 *
 * - analyzeFunctionProperties - A function that analyzes a given function string.
 */

import { ai } from '@/ai/genkit';
import {
  FunctionAnalysisInputSchema,
  FunctionAnalysisOutputSchema,
  type FunctionAnalysisInput,
  type FunctionAnalysisOutput,
} from './types';

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
