'use server';
/**
 * @fileOverview An adaptive learning AI agent that creates personalized learning paths.
 *
 * - getAdaptiveLearningPath - A function that generates a personalized learning plan.
 * - AdaptiveLearningInput - The input type for the getAdaptiveLearningPath function.
 * - AdaptiveLearningOutput - The return type for the getAdaptiveLearningPath function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit/zod';

const PerformanceSchema = z.object({
    exerciseTitle: z.string().describe('The title of the exercise the user completed.'),
    score: z.number().describe('The number of questions the user answered correctly.'),
    totalQuestions: z.number().describe('The total number of questions in the exercise.'),
});

const ContentInfoSchema = z.object({
    slug: z.string().describe('The unique identifier slug for the content.'),
    title: z.string().describe('The title of the content.'),
    description: z.string().describe('A brief description of the content.'),
});

export const AdaptiveLearningInputSchema = z.object({
  previousPerformance: z.array(PerformanceSchema).describe('An array of the user\'s recent performance on exercises.'),
  availableLessons: z.array(ContentInfoSchema).describe('A list of all available lessons.'),
  availableExercises: z.array(ContentInfoSchema).describe('A list of all available exercises.'),
});
export type AdaptiveLearningInput = z.infer<typeof AdaptiveLearningInputSchema>;

export const AdaptiveLearningOutputSchema = z.object({
  performanceAnalysis: z.string().describe('A brief, encouraging analysis of the user\'s performance, identifying potential strengths and weaknesses based on their exercise results. This should be in Arabic.'),
  recommendedLesson: z.object({
    slug: z.string().describe('The slug of the recommended lesson.'),
    title: z.string().describe('The title of the recommended lesson.'),
    reasoning: z.string().describe('A short explanation in Arabic for why this specific lesson is recommended based on the performance analysis.'),
  }),
  recommendedExercise: z.object({
    slug: z.string().describe('The slug of the recommended exercise.'),
    title: z.string().describe('The title of the recommended exercise.'),
    reasoning: z.string().describe('A short explanation in Arabic for why this specific exercise is recommended, often as a follow-up to the recommended lesson.'),
  }),
});
export type AdaptiveLearningOutput = z.infer<typeof AdaptiveLearningOutputSchema>;

export async function getAdaptiveLearningPath(input: AdaptiveLearningInput): Promise<AdaptiveLearningOutput> {
  return adaptiveLearningPathFlow(input);
}

const adaptiveLearningPrompt = ai.definePrompt({
  name: 'adaptiveLearningPrompt',
  input: { schema: AdaptiveLearningInputSchema },
  output: { schema: AdaptiveLearningOutputSchema },
  prompt: `You are an expert AI learning assistant for a high school math application. Your task is to create a personalized, adaptive learning path for a student.

You will be given the user's recent performance on various exercises, along with a list of all available lessons and exercises in the application.

Based on the user's performance, you must:
1.  **Analyze Performance**: Write a brief, encouraging analysis in Arabic of the user's performance. Identify topics where the user is strong and topics where they seem to be struggling. For example, if they scored low on "Derivatives Basics", they might need to review the "Derivatives" lesson.
2.  **Recommend a Lesson**: Choose ONE lesson from the "availableLessons" that directly addresses a weak area identified in the performance analysis. Provide its slug, title, and a clear reason in Arabic for the recommendation.
3.  **Recommend an Exercise**: Choose ONE exercise from the "availableExercises" that would be a good next step. This could be the exercise they struggled with (for a retry) or a new exercise that applies the concepts from the recommended lesson. Provide its slug, title, and a clear reason in Arabic for the recommendation.

The goal is to guide the user logically. If they struggled with a topic, recommend the corresponding lesson first, then an exercise to practice. Do not recommend content the user is already mastering.

**User's Performance Data:**
{{#each previousPerformance}}
- Exercise: "{{this.exerciseTitle}}", Score: {{this.score}}/{{this.totalQuestions}}
{{/each}}

**Available Lessons:**
{{#each availableLessons}}
- Slug: "{{this.slug}}", Title: "{{this.title}}", Description: "{{this.description}}"
{{/each}}

**Available Exercises:**
{{#each availableExercises}}
- Slug: "{{this.slug}}", Title: "{{this.title}}", Description: "{{this.description}}"
{{/each}}

Produce the output in the specified JSON format.
`,
});

const adaptiveLearningPathFlow = ai.defineFlow(
  {
    name: 'adaptiveLearningPathFlow',
    inputSchema: AdaptiveLearningInputSchema,
    outputSchema: AdaptiveLearningOutputSchema,
  },
  async (input) => {
    const { output } = await adaptiveLearningPrompt(input);
    if (!output) {
      throw new Error('Failed to generate an adaptive learning path.');
    }
    return output;
  }
);
