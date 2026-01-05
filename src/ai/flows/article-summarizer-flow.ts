'use server';
/**
 * @fileOverview An AI flow for summarizing scientific articles.
 *
 * - summarizeArticle - A function that takes article text and returns a summary.
 */

import { ai } from '@/ai/genkit';
import {
  ArticleSummarizerInputSchema,
  ArticleSummarizerOutputSchema,
  type ArticleSummarizerInput,
  type ArticleSummarizerOutput,
} from './types';


export async function summarizeArticle(input: ArticleSummarizerInput): Promise<ArticleSummarizerOutput> {
  return articleSummarizerFlow(input);
}


const articleSummarizerPrompt = ai.definePrompt({
    name: 'articleSummarizerPrompt',
    input: { schema: ArticleSummarizerInputSchema },
    output: { schema: ArticleSummarizerOutputSchema },
    prompt: `You are an expert academic assistant specializing in summarizing scientific texts for high school students. You will be given the text of an article. Your task is to analyze the text and provide a summary and key points in ARABIC.

The output must be in the specified JSON format and in Arabic.

Article Text:
{{{articleText}}}
`,
});

const articleSummarizerFlow = ai.defineFlow(
    {
        name: 'articleSummarizerFlow',
        inputSchema: ArticleSummarizerInputSchema,
        outputSchema: ArticleSummarizerOutputSchema,
    },
    async (input) => {
        const { output } = await articleSummarizerPrompt(input);
        if (!output) {
            throw new Error('Failed to summarize the article.');
        }
        return output;
    }
);
