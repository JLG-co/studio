import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { initializeAdmin } from '@/firebase/admin';

export async function POST(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');

  if (!filename || !request.body) {
    return NextResponse.json({ message: 'No filename provided.' }, { status: 400 });
  }

  const app = initializeAdmin();
  const idToken = request.headers.get('Authorization')?.split('Bearer ')[1];

  if (!idToken) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const decodedToken = await getAuth(app).verifyIdToken(idToken);
    const uid = decodedToken.uid;
    
    const blob = await put(`avatars/${uid}/${filename}`, request.body, {
      access: 'public',
    });

    return NextResponse.json(blob);
  } catch (error) {
    console.error('Upload error:', error);
    let message = 'An unknown error occurred during upload.';
    let status = 500;
    if (error instanceof Error && 'code' in error && error.code === 'auth/id-token-expired') {
        message = 'Authentication token expired. Please sign in again.';
        status = 401;
    } else if (error instanceof Error && 'code' in error && error.code === 'auth/argument-error') {
        message = 'Invalid authentication token.';
        status = 401;
    }
    return NextResponse.json({ message }, { status });
  }
}
