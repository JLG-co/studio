'use server';
/**
 * @fileOverview A math-focused chatbot AI agent.
 *
 * - mathChat - A function that handles the chatbot conversation.
 * - MathChatInput - The input type for the mathChat function.
 * - MathChatOutput - The return type for the mathChat function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit/zod';

const MessageSchema = z.object({
    role: z.enum(['user', 'bot']),
    content: z.string(),
});

export const MathChatInputSchema = z.object({
  history: z.array(MessageSchema).describe('The conversation history.'),
  query: z.string().describe('The user\'s latest query.'),
});
export type MathChatInput = z.infer<typeof MathChatInputSchema>;

export const MathChatOutputSchema = z.object({
  answer: z.string().describe('The AI\'s response to the user\'s query.'),
});
export type MathChatOutput = z.infer<typeof MathChatOutputSchema>;


export async function mathChat(input: MathChatInput): Promise<MathChatOutput> {
  return mathChatFlow(input);
}


const mathChatPrompt = ai.definePrompt({
    name: 'mathChatPrompt',
    input: { schema: MathChatInputSchema },
    output: { schema: MathChatOutputSchema },
    prompt: `You are "Math Companion Pro", a friendly and helpful AI assistant with expertise in mathematics, designed for 2nd-year secondary school students in Algeria. Your personality is encouraging, clear, and a bit enthusiastic about math.

Your primary goal is to help students understand mathematical concepts. You can answer general questions, but your main strength is explaining math. Use Markdown for formatting, like code blocks for equations, and lists for steps. Always answer in Arabic.

Conversation History:
{{#each history}}
- {{this.role}}: {{this.content}}
{{/each}}

User's new question:
- user: {{{query}}}

Your response should be in the specified JSON format.`,
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
            throw new Error('Failed to get a response from the chatbot.');
        }
        return output;
    }
);
