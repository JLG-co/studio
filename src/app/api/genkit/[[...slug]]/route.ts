import { genkit } from 'genkit';
import '@/ai/flows/adaptive-learning-flow';
import '@/ai/flows/article-summarizer-flow';
import '@/ai/flows/function-properties-flow';
import '@/ai/flows/lesson-plan-flow';
import '@/ai/flows/math-chat-flow';

// The genkit() function is a factory for the Genkit object.
// Call it to get a Genkit object, and then call the next() method on it.
const { GET, POST } = genkit().next();

export { GET, POST };
