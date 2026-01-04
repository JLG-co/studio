'use server';
/**
 * @fileOverview Defines tools for the Genkit AI to retrieve app content.
 */
import { ai } from '@/ai/genkit';
import { articles, lessons } from '@/lib/data';
import { z } from 'zod';

export const listLessons = ai.defineTool(
  {
    name: 'listLessons',
    description: 'Get a list of all available lesson titles.',
    inputSchema: z.object({}),
    outputSchema: z.array(z.string()),
  },
  async () => {
    return lessons.map((l) => l.title);
  }
);

export const listArticles = ai.defineTool(
  {
    name: 'listArticles',
    description: 'Get a list of all available scientific article titles.',
    inputSchema: z.object({}),
    outputSchema: z.array(z.string()),
  },
  async () => {
    return articles.map((a) => a.title);
  }
);

export const getContentByTitle = ai.defineTool(
  {
    name: 'getContentByTitle',
    description: 'Retrieve the full content of a specific lesson or article by its title.',
    inputSchema: z.object({
      title: z.string().describe('The title of the lesson or article.'),
      type: z.enum(['lesson', 'article']).describe('The type of content to retrieve.'),
    }),
    outputSchema: z.object({
        title: z.string(),
        content: z.string()
    }).nullable(),
  },
  async ({ title, type }) => {
    const source = type === 'lesson' ? lessons : articles;
    const item = source.find(
      (i) => i.title.toLowerCase() === title.toLowerCase()
    );
    if (item) {
      // Return a simplified version of the content, stripping HTML for the AI
      const cleanContent = item.content.replace(/<[^>]*>/g, ' ');
      return { title: item.title, content: cleanContent };
    }
    return null;
  }
);
