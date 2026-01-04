'use client';

import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
  sendPasswordResetEmail,
  OAuthProvider,
  User,
} from 'firebase/auth';
import { initializeFirebase } from '@/firebase';
import { doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

const { auth, firestore } = initializeFirebase();
const googleProvider = new GoogleAuthProvider();
const appleProvider = new OAuthProvider('apple.com');


const createUserProfileDocument = async (user: User) => {
  if (!firestore) return;
  const userDocRef = doc(firestore, 'users', user.uid);
  const userDoc = await getDoc(userDocRef);

  if (!userDoc.exists()) {
    const profileData = {
      id: user.uid,
      displayName: user.displayName,
      email: user.email,
      createdAt: serverTimestamp(),
      score: 0,
      avatarUrl: user.photoURL || `https://picsum.photos/seed/${user.uid}/100/100`,
    };

    setDoc(userDocRef, profileData).catch(async (serverError) => {
      const permissionError = new FirestorePermissionError({
        path: userDocRef.path,
        operation: 'create',
        requestResourceData: profileData,
      });
      errorEmitter.emit('permission-error', permissionError);
    });
  }
}

export const signInWithGoogle = async () => {
    if (!auth) throw new Error('Firebase not initialized');
    try {
        const result = await signInWithPopup(auth, googleProvider);
        await createUserProfileDocument(result.user);
        return result;
    } catch (error) {
        // Handle credential already in use error
        if ((error as any).code === 'auth/credential-already-in-use') {
            console.warn("Credential already in use. User might have signed up with a different method.");
        }
        throw error;
    }
}

export const signInWithApple = async () => {
    if (!auth) throw new Error('Firebase not initialized');
    try {
        const result = await signInWithPopup(auth, appleProvider);
        await createUserProfileDocument(result.user);
        return result;
    } catch (error) {
        if ((error as any).code === 'auth/credential-already-in-use') {
            console.warn("Credential already in use. User might have signed up with a different method.");
        }
        throw error;
    }
}

export const signUpWithEmail = async (email: string, password: string, displayName: string) => {
  if (!auth || !firestore) {
    throw new Error('Firebase not initialized');
  }
  
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update the user's profile with the display name
    await updateProfile(user, { displayName });
    
    // Send verification email
    await sendEmailVerification(user);

    // Create a user document in Firestore
    await createUserProfileDocument(user);

    return userCredential;
  } catch (error) {
    // Re-throw the error to be caught by the calling form
    throw error;
  }
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

export const sendPasswordReset = async (email: string) => {
  if (!auth) {
    throw new Error('Firebase not initialized');
  }
  return sendPasswordResetEmail(auth, email);
};

export const resendVerificationEmail = async () => {
    if (!auth.currentUser) {
        throw new Error('No user is currently signed in.');
    }
    try {
        await sendEmailVerification(auth.currentUser);
    } catch (error) {
        console.error('Error sending verification email:', error);
        // Re-throw to be handled by the UI
        throw error;
    }
};