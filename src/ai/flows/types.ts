import { z } from 'zod';

// Article Summarizer
export const ArticleSummarizerInputSchema = z.object({
  articleText: z.string().describe('The full text of the scientific article to be summarized.'),
});
export type ArticleSummarizerInput = z.infer<typeof ArticleSummarizerInputSchema>;

export const ArticleSummarizerOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the article in a single paragraph. This should be in Arabic.'),
  keyPoints: z.array(z.string()).describe('A list of the most important key points or findings from the article. This should be in Arabic.'),
});
export type ArticleSummarizerOutput = z.infer<typeof ArticleSummarizerOutputSchema>;


// Function Properties
export const FunctionAnalysisInputSchema = z.object({
  functionStr: z.string().describe('The mathematical function to analyze, as a string. e.g., "x^3 - 3*x + 2"'),
  domainStr: z.string().describe('The domain over which to analyze the function, as a string. e.g., "[-2, 2]" or "R"'),
});
export type FunctionAnalysisInput = z.infer<typeof FunctionAnalysisInputSchema>;

export const FunctionAnalysisOutputSchema = z.object({
    analysis: z.array(z.string()).describe('A step-by-step analysis of the function in Arabic, including calculating the derivative, finding critical points, and determining intervals of increase/decrease.'),
    variationTable: z.object({
        headers: z.array(z.string()).describe('The headers for the variation table. Typically ["x", "f\'(x)", "f(x)"].'),
        rows: z.array(z.array(z.string())).describe('The rows of the variation table, where each inner array represents a row.'),
    }).describe('A structured representation of the function\'s variation table (tableau de variation).'),
});
export type FunctionAnalysisOutput = z.infer<typeof FunctionAnalysisOutputSchema>;


// Lesson Plan
export const LessonPlanInputSchema = z.object({
  topic: z.string().describe('The mathematical topic for which to generate a lesson plan.'),
});
export type LessonPlanInput = z.infer<typeof LessonPlanInputSchema>;

export const LessonPlanOutputSchema = z.object({
  title: z.string().describe('A suitable title for the lesson plan in Arabic.'),
  content: z.string().describe('The full lesson plan content in Markdown format. This should be in Arabic and include sections for objectives, prerequisites, activities, and evaluation.'),
});
export type LessonPlanOutput = z.infer<typeof LessonPlanOutputSchema>;


// Math Chat
const MessageSchema = z.object({
  role: z.enum(['user', 'bot']),
  content: z.string(),
});

export const MathChatInputSchema = z.object({
  history: z.array(MessageSchema).describe('The previous conversation history.'),
  query: z.string().describe('The user\'s latest question or message.'),
});
export type MathChatInput = z.infer<typeof MathChatInputSchema>;

export const MathChatOutputSchema = z.object({
  answer: z.string().describe('The AI\'s response to the user\'s query, in Arabic and formatted in Markdown.'),
});
export type MathChatOutput = z.infer<typeof MathChatOutputSchema>;


// Adaptive Learning
const PerformanceRecordSchema = z.object({
    exerciseTitle: z.string(),
    score: z.number(),
    totalQuestions: z.number(),
});

const AvailableContentSchema = z.object({
    slug: z.string(),
    title: z.string(),
    description: z.string(),
});

export const AdaptiveLearningInputSchema = z.object({
    previousPerformance: z.array(PerformanceRecordSchema).describe("The student's recent performance on exercises."),
    availableLessons: z.array(AvailableContentSchema).describe('List of all available lessons.'),
    availableExercises: z.array(AvailableContentSchema).describe('List of all available exercises.'),
});
export type AdaptiveLearningInput = z.infer<typeof AdaptiveLearningInputSchema>;

const RecommendationSchema = z.object({
    slug: z.string().describe('The slug of the recommended content.'),
    title: z.string().describe('The title of the recommended content.'),
    reasoning: z.string().describe('The reason for recommending this specific content, in Arabic.'),
});

export const AdaptiveLearningOutputSchema = z.object({
    performanceAnalysis: z.string().describe("A brief, encouraging summary of the student's performance, in Arabic."),
    recommendedLesson: RecommendationSchema.describe('The suggested lesson for the student to focus on next.'),
    recommendedExercise: RecommendationSchema.describe('The suggested exercise for the student to practice.'),
});
export type AdaptiveLearningOutput = z.infer<typeof AdaptiveLearningOutputSchema>;
