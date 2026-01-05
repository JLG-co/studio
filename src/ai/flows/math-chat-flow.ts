'use server';
/**
 * @fileOverview An AI flow for handling math-related chat conversations.
 *
 * - mathChat - A function that takes conversation history and a new query to generate a response.
 */

import { ai } from '@/ai/genkit';
import {
  MathChatInputSchema,
  MathChatOutputSchema,
  type MathChatInput,
  type MathChatOutput,
} from './types';

export async function mathChat(input: MathChatInput): Promise<MathChatOutput> {
  return mathChatFlow(input);
}


const mathChatPrompt = ai.definePrompt({
  name: 'mathChatPrompt',
  model: 'googleai/gemini-1.5-pro-latest',
  input: { schema: MathChatInputSchema },
  output: { schema: MathChatOutputSchema },
  prompt: `You are Math Companion Pro, an expert AI assistant for high school students specializing in mathematics for the 2nd year of Algerian secondary education. Your tone should be encouraging, clear, and helpful. Always respond in ARABIC and use Markdown for formatting.

When a user asks a question, provide a step-by-step explanation. Use code blocks for formulas.

Here is the conversation history:
{{#each history}}
- {{role}}: {{{content}}}
{{/each}}

Here is the user's new question:
{{{query}}}

Your response must be in the specified JSON format.
`,
});

const mathChatFlow = ai.defineFlow(
  {
    name: 'mathChatFlow',
    inputSchema: MathChatInputSchema,
    outputSchema: MathChatOutputSchema,
  },
  async (input) => {
    const { output } = await mathChatPrompt(input);
    if (!output) {
        throw new Error('The AI failed to generate a response.');
    }
    return output;
  }
);
