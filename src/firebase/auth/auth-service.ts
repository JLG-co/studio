'use client';

import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider,
  signOut,
} from 'firebase/auth';
import { initializeFirebase } from '@/firebase';

// Initialize Firebase to get the auth instance
const { auth } = initializeFirebase();

const provider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  if (!auth) {
    console.error("Firebase auth is not initialized.");
    return;
  }
  try {
    const result = await signInWithPopup(auth, provider);
    // The signed-in user info.
    const user = result.user;
    console.log('User signed in: ', user);
  } catch (error) {
    console.error('Error during sign-in:', error);
  }
};

export const signOutUser = async () => {
    if (!auth) {
        console.error("Firebase auth is not initialized.");
        return;
    }
  try {
    await signOut(auth);
    console.log('User signed out');
  } catch (error) {
    console.error('Error during sign-out:', error);
  }
};
