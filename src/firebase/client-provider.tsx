'use client';
import { ReactNode } from 'react';
import { FirebaseProvider } from './provider';
import { initializeFirebase } from '.';

export function FirebaseClientProvider({ children }: { children: ReactNode }) {
  const { firebaseApp, firestore, auth } = initializeFirebase();
  return (
    <FirebaseProvider
      firebaseApp={firebaseApp}
      firestore={firestore}
      auth={auth}
    >
      {children}
    </FirebaseProvider>
  );
}
