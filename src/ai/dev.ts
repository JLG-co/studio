import { config } from 'dotenv';
config();

import '@/ai/flows/recommend-learning-resources.ts';
import '@/ai/flows/summarize-article.ts';
import '@/ai/flows/generate-lesson-plan.ts';
import '@/ai/flows/analyze-function.ts';
import '@/ai/flows/math-chatbot.ts';
import '@/ai/tools/retrieval-tools.ts';
