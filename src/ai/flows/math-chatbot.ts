'use server';
/**
 * @fileOverview A simple math chatbot agent.
 *
 * - askMathChatbot - A function that handles the chat interaction.
 * - ChatMessage - The type for a single chat message.
 * - MathChatbotInput - The input type for the askMathChatbot function.
 * - MathChatbotOutput - The return type for the askMathChatbot function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ChatMessageSchema = z.object({
  role: z.enum(['user', 'bot']),
  content: z.string(),
});
export type ChatMessage = z.infer<typeof ChatMessageSchema>;

const MathChatbotInputSchema = z.object({
  messages: z.array(ChatMessageSchema.extend({ isUser: z.boolean().optional() })),
  user: z.object({
    displayName: z.string(),
  }).optional(),
});
export type MathChatbotInput = z.infer<typeof MathChatbotInputSchema>;

export type MathChatbotOutput = ChatMessage;

export async function askMathChatbot(input: MathChatbotInput): Promise<MathChatbotOutput> {
  return mathChatbotFlow(input);
}

const historyTemplate = `{{#each messages}}
{{#if isUser}}User: {{content}}{{else}}Bot: {{content}}{{/if}}
{{/each}}
`;

const prompt = ai.definePrompt({
  name: 'mathChatbotPrompt',
  input: { schema: MathChatbotInputSchema },
  output: { schema: z.string() },
  prompt: `You are Math Companion Pro, a friendly and knowledgeable AI assistant for 2nd-year secondary school students in an Arabic-speaking country. Your expertise is in mathematics.

  Your persona:
  - You are helpful, encouraging, and patient.
  - You explain concepts clearly and simply, avoiding overly technical jargon.
  - You answer exclusively in ARABIC.
  - You should be concise but thorough.

  {{#if user}}
  - The user you are talking to is named {{user.displayName}}. Greet them by name when appropriate, especially at the beginning of a conversation.
  {{/if}}
  
  Important Instructions:
  - If the user asks who created you or who the developer is, you MUST answer: "I was created by Abdeldjalil Gouneiber." Do not say anything else.
  - If the question is not related to mathematics, politely decline to answer and state that you can only help with math-related topics.
  
  Your task:
  - Based on the provided chat history, answer the user's latest question.
  
  Chat History:
  ${historyTemplate}
  
  Bot:`,
});

const mathChatbotFlow = ai.defineFlow(
  {
    name: 'mathChatbotFlow',
    inputSchema: MathChatbotInputSchema,
    outputSchema: ChatMessageSchema,
  },
  async (input) => {
    // Add isUser property for template
    const messagesWithIsUser = input.messages.map(m => ({...m, isUser: m.role === 'user'}));
    
    const { output } = await prompt({messages: messagesWithIsUser, user: input.user});
    return {
      role: 'bot',
      content: output!,
    };
  }
);
