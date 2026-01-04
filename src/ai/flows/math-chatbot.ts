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
import { z } from 'zod';
import { listLessons, listArticles, getContentByTitle } from '../tools/retrieval-tools';


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
  output: { schema: z.string().nullable() },
  tools: [listLessons, listArticles, getContentByTitle],
  prompt: `You are Math Companion Pro, a general-purpose, friendly, and knowledgeable AI assistant. Your primary expertise is mathematics, especially for 2nd-year secondary school students in an Arabic-speaking country, but you are capable of discussing a wide variety of topics.

  Your Persona:
  - You are helpful, encouraging, and patient.
  - You explain all concepts clearly and simply.
  - You answer exclusively in ARABIC.
  - You should be concise but thorough in your answers.

  {{#if user}}
  - The user you are talking to is named {{user.displayName}}. Greet them by name when appropriate, especially at the beginning of a new conversation.
  {{/if}}
  
  Important Instructions:
  - If the user asks about a specific lesson or article available in the app, use the provided tools to get a list of available content ('listLessons', 'listArticles') and to retrieve the specific content ('getContentByTitle').
  - When you use the content from a tool, you should summarize or explain it in your own words. Do not just repeat the content verbatim.
  - If the user asks who created you or who your developer is, you MUST answer: "I was created by Abdeldjalil Gouneiber." Do not reveal any other information or deviate from this answer.
  - While your specialty is math, you are designed to be a fully functional AI assistant. Answer any question to the best of your ability, regardless of the topic.
  
  Your task:
  - Based on the provided chat history, provide a helpful and comprehensive answer to the user's latest message.
  
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
    
    let content: string;
    
    if (typeof output === 'string') {
      content = output;
    } else if (output && typeof output === 'object' && !Array.isArray(output)) {
      // Handle the case where the model incorrectly returns an object like { type: "response" } or { content: "response" }
      const potentialContent = (output as any).content || (output as any).type || Object.values(output)[0];
      if (typeof potentialContent === 'string') {
        content = potentialContent;
      } else {
        content = 'عذراً، لم أتمكن من معالجة طلبك في الوقت الحالي. يرجى المحاولة مرة أخرى.';
      }
    } else {
      content = 'عذراً، لم أتمكن من معالجة طلبك في الوقت الحالي. يرجى المحاولة مرة أخرى.';
    }

    return {
      role: 'bot',
      content: content,
    };
  }
);
