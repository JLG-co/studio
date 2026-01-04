'use server';
/**
 * @fileOverview An AI agent for analyzing mathematical functions.
 *
 * - analyzeFunction - A function that handles the function analysis process.
 * - AnalyzeFunctionInput - The input type for the analyzeFunction function.
 * - AnalyzeFunctionOutput - The return type for the analyzeFunction function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeFunctionInputSchema = z.object({
  func: z.string().describe('The mathematical function to analyze, written as a string. For example, "x^2" or "1/(x-2)".'),
});
export type AnalyzeFunctionInput = z.infer<typeof AnalyzeFunctionInputSchema>;

const AnalyzeFunctionOutputSchema = z.object({
  domain: z.string().describe('The domain of the function in interval notation. Example: "(-∞, 2) U (2, +∞)". Write it in Arabic if possible. For example: "R \\ {2}"'),
  range: z.string().describe('The range of the function in interval notation. Example: "[0, +∞)". Write it in Arabic if possible. For example: "[0, +∞)"'),
  derivative: z.string().describe('The first derivative of the function. Example: "2x" or "-1/(x-2)^2"'),
  behavior: z.string().describe('A brief analysis of the function\'s variations, including increasing/decreasing intervals and any asymptotes, in Arabic.'),
});
export type AnalyzeFunctionOutput = z.infer<typeof AnalyzeFunctionOutputSchema>;

export async function analyzeFunction(input: AnalyzeFunctionInput): Promise<AnalyzeFunctionOutput> {
  return analyzeFunctionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeFunctionPrompt',
  input: {schema: AnalyzeFunctionInputSchema},
  output: {schema: AnalyzeFunctionOutputSchema},
  prompt: `You are an expert mathematician. Analyze the following function and provide its properties.

Function: f(x) = {{{func}}}

Provide the following properties in the output format:
1.  **Domain (مجال التعريف)**: The set of all possible input values (x-values). Use interval notation.
2.  **Range (المدى)**: The set of all possible output values (y-values). Use interval notation.
3.  **Derivative (المشتقة)**: The first derivative of the function, f'(x).
4.  **تغيرات الدالة**: A brief summary in Arabic of where the function is increasing or decreasing (using the term 'المجال' for 'domain' or 'interval'), and identify any vertical or horizontal asymptotes.
`,
});

const analyzeFunctionFlow = ai.defineFlow(
  {
    name: 'analyzeFunctionFlow',
    inputSchema: AnalyzeFunctionInputSchema,
    outputSchema: AnalyzeFunctionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
