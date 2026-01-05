'use server';
import {nextHandler} from '@genkit-ai/next';

export const runtime = 'nodejs';

export const GET = nextHandler();
export const POST = nextHandler();
