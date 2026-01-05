'use server';
import {nextHandler} from '@genkit-ai/next';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const GET = nextHandler();
export const POST = nextHandler();
