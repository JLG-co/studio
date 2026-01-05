import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

// Check for the API key at runtime, but don't throw an error during build.
if (!process.env.GEMINI_API_KEY) {
    // In a production/deployed environment, this will cause AI calls to fail gracefully.
    // In local development, you should have a .env.local file.
    console.warn(
      'GEMINI_API_KEY environment variable not set. The application will build, but AI features will fail at runtime. Please create a .env.local file and add the key, or set it in your deployment environment.'
    );
}

export const ai = genkit({
    plugins: [googleAI({ apiKey: process.env.GEMINI_API_KEY })],
    logLevel: 'debug',
    enableTracing: true,
});
