'use client';

import { useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { useToast } from '@/hooks/use-toast';

/**
 * Listens for custom Firebase permission errors and displays them in a toast.
 * This is crucial for debugging Security Rules during development.
 */
export function FirebaseErrorListener() {
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = errorEmitter.on('permission-error', (error) => {
      console.error('Firestore Permission Error:', error.message, error.context);
      
      // In a production environment, you might want to log this to a service
      // instead of showing it to the user. For development, a toast is helpful.
      if (process.env.NODE_ENV === 'development') {
        toast({
          variant: 'destructive',
          title: 'Firestore Permission Error',
          description: (
            <div className="text-xs w-full">
              <p>Your request was denied by Security Rules.</p>
              <pre className="mt-2 w-full whitespace-pre-wrap rounded-md bg-slate-950 p-4">
                <code className="text-white">{JSON.stringify(error.context, null, 2)}</code>
              </pre>
            </div>
          ),
          duration: 15000, 
        });
      }
    });

    return () => {
      unsubscribe();
    };
  }, [toast]);

  return null;
}
