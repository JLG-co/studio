'use server';
/**
 * @fileOverview An AI flow for generating lesson plans.
 *
 * - generateLessonPlan - A function that takes a topic and returns a detailed lesson plan.
 */

import { ai } from '@/ai/genkit';
import {
  LessonPlanInputSchema,
  LessonPlanOutputSchema,
  type LessonPlanInput,
  type LessonPlanOutput,
} from './types';


export async function generateLessonPlan(input: LessonPlanInput): Promise<LessonPlanOutput> {
  return lessonPlanFlow(input);
}


const lessonPlanPrompt = ai.definePrompt({
    name: 'lessonPlanPrompt',
    model: 'googleai/gemini-1.5-flash-latest',
    input: { schema: LessonPlanInputSchema },
    output: { schema: LessonPlanOutputSchema },
    prompt: `You are an expert high school math teacher. Your task is to create a detailed lesson plan in ARABIC for the given topic. The lesson plan should be structured in Markdown format.

Topic: {{{topic}}}

The lesson plan must include the following sections:
-   **الأهداف التعليمية (Learning Objectives):** What should students be able to do after the lesson?
-   **المكتسبات القبلية (Prerequisites):** What prior knowledge is required?
-   **سيرورة الدرس (Lesson Procedure):** Step-by-step activities, including an introduction, core concepts, examples, and practice problems.
-   **التقييم (Evaluation):** How to assess student understanding (e.g., a short quiz, homework problems).

The output must be in the specified JSON format with the content as a single Markdown string.
`,
});

const lessonPlanFlow = ai.defineFlow(
    {
        name: 'lessonPlanFlow',
        inputSchema: LessonPlanInputSchema,
        outputSchema: LessonPlanOutputSchema,
    },
    async (input) => {
        const { output } = await lessonPlanPrompt(input);
        if (!output) {
            throw new Error('Failed to generate the lesson plan.');
        }
        return output;
    }
);
