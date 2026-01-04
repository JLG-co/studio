'use client';

import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { initializeFirebase } from '@/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

const { auth, firestore } = initializeFirebase();
const provider = new GoogleAuthProvider();

export const signUpWithEmail = async (email: string, password: string, displayName: string) => {
  if (!auth || !firestore) {
    throw new Error('Firebase not initialized');
  }
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  
  // Update the user's profile with the display name
  await updateProfile(user, { displayName });

  // Create a user document in Firestore
  const userDocRef = doc(firestore, 'users', user.uid);
  const profileData = {
    id: user.uid,
    displayName: displayName,
    email: user.email,
    createdAt: serverTimestamp(),
  };

  setDoc(userDocRef, profileData)
    .catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
            path: userDocRef.path,
            operation: 'create',
            requestResourceData: profileData,
        });
        errorEmitter.emit('permission-error', permissionError);
    });


  return userCredential;
};

export const signInWithEmail = async (email: string, password: string) => {
  if (!auth) {
    throw new Error('Firebase not initialized');
  }
  return signInWithEmailAndPassword(auth, email, password);
};


export const signOutUser = async () => {
  if (!auth) {
    console.error('Firebase auth is not initialized.');
    return;
  }
  try {
    await signOut(auth);
    console.log('User signed out');
  } catch (error) {
    console.error('Error during sign-out:', error);
  }
};
