'use server';
/**
 * @fileOverview An AI flow for handling math-related chat conversations.
 *
 * - mathChat - A function that takes conversation history and a new query to generate a response.
 * - MathChatInput - The input type for the mathChat function.
 * - MathChatOutput - The return type for the mathChat function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const MessageSchema = z.object({
  role: z.enum(['user', 'bot']),
  content: z.string(),
});

export const MathChatInputSchema = z.object({
  history: z.array(MessageSchema).describe('The previous conversation history.'),
  query: z.string().describe('The user\'s latest question or message.'),
});
export type MathChatInput = z.infer<typeof MathChatInputSchema>;

export const MathChatOutputSchema = z.object({
  answer: z.string().describe('The AI\'s response to the user\'s query, in Arabic and formatted in Markdown.'),
});
export type MathChatOutput = z.infer<typeof MathChatOutputSchema>;


export async function mathChat(input: MathChatInput): Promise<MathChatOutput> {
  return mathChatFlow(input);
}


const mathChatPrompt = ai.definePrompt({
  name: 'mathChatPrompt',
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
