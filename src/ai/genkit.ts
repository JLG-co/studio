'use server';
/**
 * @fileOverview Initializes and exports the Genkit AI instance.
 */

import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

// Check for the API key at runtime. This provides a clear warning for developers
// without causing build failures.
if (!process.env.GEMINI_API_KEY) {
  if (process.env.NODE_ENV === 'development') {
    console.warn(
      'GEMINI_API_KEY environment variable not set. Please create a .env.local file and add the key. AI features will fail at runtime.'
    );
  } else {
    // In a production environment, just log a standard message.
    console.warn('GEMINI_API_KEY is not set. AI features will be unavailable.');
  }
}

// Initialize Genkit with the Google AI plugin.
// Genkit will automatically look for the GEMINI_API_KEY in the environment variables.
export const ai = genkit({
  plugins: [googleAI()],
  logLevel: 'debug',
  enableTracing: true,
});
