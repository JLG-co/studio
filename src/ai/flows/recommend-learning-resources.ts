'use server';

/**
 * @fileOverview This file defines a Genkit flow for recommending learning resources (lessons and articles)
 * based on the student's performance in exercises.
 *
 * - recommendLearningResources - A function that takes student performance data and returns
 *   recommended learning resources.
 * - RecommendLearningResourcesInput - The input type for the recommendLearningResources function.
 * - RecommendedResource - Represents a single recommended resource with its type and title.
 * - RecommendLearningResourcesOutput - The output type for the recommendLearningResources function,
 *   which is an array of RecommendedResource objects.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendLearningResourcesInputSchema = z.object({
  studentPerformance: z
    .string()
    .describe(
      'A string containing data about the student performance on exercises.  Include specific exercises, and scores, and areas of difficulty.'
    ),
  allLessons: z.array(z.string()).describe('A list of all available lesson titles.'),
  allArticles: z.array(z.string()).describe('A list of all available article titles.'),
});
export type RecommendLearningResourcesInput = z.infer<typeof RecommendLearningResourcesInputSchema>;

const RecommendedResourceSchema = z.object({
  type: z.enum(['lesson', 'article']).describe('The type of the recommended resource.'),
  title: z.string().describe('The title of the recommended resource.'),
});

export type RecommendedResource = z.infer<typeof RecommendedResourceSchema>;

const RecommendLearningResourcesOutputSchema = z.array(RecommendedResourceSchema);
export type RecommendLearningResourcesOutput = z.infer<typeof RecommendLearningResourcesOutputSchema>;

export async function recommendLearningResources(
  input: RecommendLearningResourcesInput
): Promise<RecommendLearningResourcesOutput> {
  return recommendLearningResourcesFlow(input);
}

const recommendLearningResourcesPrompt = ai.definePrompt({
  name: 'recommendLearningResourcesPrompt',
  input: {schema: RecommendLearningResourcesInputSchema},
  output: {schema: RecommendLearningResourcesOutputSchema},
  prompt: `Based on the student's performance data, recommend a list of lessons and articles that can help the student improve.

Student Performance Data: {{{studentPerformance}}}

Available Lessons: {{#each allLessons}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

Available Articles: {{#each allArticles}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

Ensure that the lessons and articles recommended are highly relevant to the student's weaknesses and knowledge gaps as evidenced by their performance data.
Return the lessons and articles as a JSON array of RecommendedResource objects.
`,
});

const recommendLearningResourcesFlow = ai.defineFlow(
  {
    name: 'recommendLearningResourcesFlow',
    inputSchema: RecommendLearningResourcesInputSchema,
    outputSchema: RecommendLearningResourcesOutputSchema,
  },
  async input => {
    const {output} = await recommendLearningResourcesPrompt(input);
    return output!;
  }
);
