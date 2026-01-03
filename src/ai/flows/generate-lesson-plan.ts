'use server';

/**
 * @fileOverview A lesson plan generator AI agent.
 *
 * - generateLessonPlan - A function that handles the lesson plan generation process.
 * - GenerateLessonPlanInput - The input type for the generateLessonPlan function.
 * - GenerateLessonPlanOutput - The return type for the generateLessonPlan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateLessonPlanInputSchema = z.object({
  concept: z.string().describe('The mathematical concept to create a lesson plan for, written in Arabic.'),
});
export type GenerateLessonPlanInput = z.infer<typeof GenerateLessonPlanInputSchema>;

const GenerateLessonPlanOutputSchema = z.object({
  lessonPlan: z.string().describe('The lesson plan outline in Arabic.'),
});
export type GenerateLessonPlanOutput = z.infer<typeof GenerateLessonPlanOutputSchema>;

export async function generateLessonPlan(input: GenerateLessonPlanInput): Promise<GenerateLessonPlanOutput> {
  return generateLessonPlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateLessonPlanPrompt',
  input: {schema: GenerateLessonPlanInputSchema},
  output: {schema: GenerateLessonPlanOutputSchema},
  prompt: `You are an expert mathematics teacher specializing in the 2AS (second year of secondary education) curriculum.  You are fluent in Arabic.

You will generate a lesson plan outline for the given mathematical concept in Arabic.

Concept: {{{concept}}}`,
});

const generateLessonPlanFlow = ai.defineFlow(
  {
    name: 'generateLessonPlanFlow',
    inputSchema: GenerateLessonPlanInputSchema,
    outputSchema: GenerateLessonPlanOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
