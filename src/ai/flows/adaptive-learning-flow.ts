'use server';
/**
 * @fileOverview An AI flow for generating personalized learning paths.
 *
 * - getAdaptiveLearningPath - A function that analyzes user performance and suggests next steps.
 */
import { ai } from '@/ai/genkit';
import {
    AdaptiveLearningInputSchema,
    AdaptiveLearningOutputSchema,
    type AdaptiveLearningInput,
    type AdaptiveLearningOutput
} from './types';

export async function getAdaptiveLearningPath(input: AdaptiveLearningInput): Promise<AdaptiveLearningOutput> {
    return adaptiveLearningFlow(input);
}


const adaptiveLearningPrompt = ai.definePrompt({
    name: 'adaptiveLearningPrompt',
    model: 'googleai/gemini-1.5-pro-latest',
    input: { schema: AdaptiveLearningInputSchema },
    output: { schema: AdaptiveLearningOutputSchema },
    prompt: `You are an expert AI learning coach for a high school math application. Your goal is to create a personalized learning path based on a student's recent performance. All output must be in Arabic.

Analyze the student's performance data provided below. Identify patterns of strength and weakness.

Student's Recent Performance:
{{#each previousPerformance}}
- Exercise: "{{exerciseTitle}}", Score: {{score}}/{{totalQuestions}}
{{/each}}

Based on your analysis, provide:
1.  **Performance Analysis:** A brief, encouraging paragraph in Arabic summarizing the student's performance. Highlight areas where they are doing well and pinpoint specific topics that need more attention.
2.  **Recommended Lesson:** Choose the most relevant lesson from the available list that addresses the student's weakest area. Provide a clear reason for your choice.
3.  **Recommended Exercise:** Choose the most relevant exercise that will help the student practice the concepts from the recommended lesson or reinforce a weak area. Provide a clear reason for your choice.

Available Lessons:
{{#each availableLessons}}
- Slug: {{slug}}, Title: {{title}}, Description: {{description}}
{{/each}}

Available Exercises:
{{#each availableExercises}}
- Slug: {{slug}}, Title: {{title}}, Description: {{description}}
{{/each}}

Your response MUST be in the specified JSON format.
`,
});

const adaptiveLearningFlow = ai.defineFlow(
    {
        name: 'adaptiveLearningFlow',
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
