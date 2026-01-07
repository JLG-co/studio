import { createNextApiHandler } from '@genkit-ai/next';
import '@/ai/flows/adaptive-learning-flow';
import '@/ai/flows/article-summarizer-flow';
import '@/ai/flows/function-properties-flow';
import '@/ai/flows/lesson-plan-flow';
import '@/ai/flows/math-chat-flow';

const { GET, POST } = createNextApiHandler();

export { GET, POST };
