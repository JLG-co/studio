'use client';

import { useEffect, useState } from 'react';
import { notFound, useParams } from 'next/navigation';
import { exerciseSets } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle2, XCircle, ArrowLeft, RotateCw } from 'lucide-react';
import PageTitle from '@/components/page-title';
import Link from 'next/link';
import { useUser, useFirestore } from '@/firebase';
import { collection, addDoc, serverTimestamp, doc, runTransaction, DocumentReference } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

const glassCardClasses = 'bg-white/5 backdrop-blur-lg border border-cyan-300/10 rounded-2xl shadow-lg';

const ExercisePage = () => {
  const params = useParams();
  const slug = params.slug as string;
  const exerciseSet = exerciseSets.find((e) => e.slug === slug);

  const { user } = useUser();
  const firestore = useFirestore();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (isFinished && user && firestore) {
      const saveResult = async () => {
        const percentage = Math.round((score / exerciseSet!.questions.length) * 100);
        const pointsGained = score * 10; // e.g. 10 points per correct answer
        
        const resultData = {
          userId: user.uid,
          exerciseSlug: slug,
          exerciseTitle: exerciseSet!.title,
          score: score,
          totalQuestions: exerciseSet!.questions.length,
          percentage: percentage,
          completedAt: serverTimestamp(),
        };

        const userDocRef = doc(firestore, 'users', user.uid);
        const resultsCollection = collection(firestore, `users/${user.uid}/exerciseResults`);
        
        // Save exercise result
        addDoc(resultsCollection, resultData)
          .catch(async (serverError) => {
              const permissionError = new FirestorePermissionError({
                  path: resultsCollection.path,
                  operation: 'create',
                  requestResourceData: resultData,
              });
              errorEmitter.emit('permission-error', permissionError);
          });
          
        // Update total score in a transaction
        try {
            await runTransaction(firestore, async (transaction) => {
                const userDoc = await transaction.get(userDocRef);
                const currentScore = userDoc.data()?.score || 0;
                transaction.update(userDocRef, { score: currentScore + pointsGained });
            });
        } catch (e) {
             console.error("Transaction failed: ", e);
             const permissionError = new FirestorePermissionError({
                path: userDocRef.path,
                operation: 'update',
                requestResourceData: { score: `currentScore + ${pointsGained}` },
            });
            errorEmitter.emit('permission-error', permissionError);
        }
      };

      saveResult();
    }
  }, [isFinished, user, firestore, score, slug, exerciseSet]);

  if (!exerciseSet) {
    notFound();
  }

  const question = exerciseSet.questions[currentQuestionIndex];

  const handleCheckAnswer = () => {
    if (!selectedAnswer) return;
    setIsAnswered(true);
    if (selectedAnswer === question.correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    setIsAnswered(false);
    setSelectedAnswer(null);
    if (currentQuestionIndex < exerciseSet.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setIsFinished(true);
    }
  };
  
  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setIsFinished(false);
  }

  if (isFinished) {
    const percentage = Math.round((score / exerciseSet.questions.length) * 100);
    return (
        <div className="text-center">
            <PageTitle title="لقد أكملت التمرين!" />
            <Card className={glassCardClasses}>
                <CardContent className="p-8 space-y-6">
                    <h2 className="text-2xl font-bold">نتيجتك النهائية</h2>
                    <p className="text-6xl font-bold text-primary">{percentage}%</p>
                    <p className="text-xl text-slate-300">
                        لقد أجبت بشكل صحيح على {score} من أصل {exerciseSet.questions.length} أسئلة.
                    </p>
                    <p className="text-2xl font-bold text-yellow-400">
                        +{score * 10} نقطة!
                    </p>
                    {user && <p className='text-slate-400'>تم تحديث نتيجتك في ملفك الشخصي ولوحة المتصدرين.</p>}
                    <div className="flex justify-center gap-4">
                        <Button onClick={handleRestart}>
                            <RotateCw className="w-4 h-4 ml-2" />
                            إعادة التمرين
                        </Button>
                        <Button asChild variant="outline">
                            <Link href="/exercises">
                                <ArrowLeft className="w-4 h-4 ml-2" />
                                العودة لقائمة التمارين
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
  }

  return (
    <div>
      <PageTitle title={exerciseSet.title} subtitle={`السؤال ${currentQuestionIndex + 1} من ${exerciseSet.questions.length}`} />

      <Card className={glassCardClasses}>
        <CardHeader>
          <CardTitle className="text-2xl font-headline">{question.question}</CardTitle>
          <CardDescription>اختر الإجابة التي تعتقد أنها صحيحة.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <RadioGroup
            value={selectedAnswer ?? ''}
            onValueChange={setSelectedAnswer}
            disabled={isAnswered}
          >
            {question.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-3 space-x-reverse">
                <RadioGroupItem value={option} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="text-lg cursor-pointer">{option}</Label>
              </div>
            ))}
          </RadioGroup>

          {isAnswered && (
            <Alert variant={selectedAnswer === question.correctAnswer ? 'default' : 'destructive'} className={selectedAnswer === question.correctAnswer ? 'border-green-500/50 bg-green-500/10' : ''}>
                {selectedAnswer === question.correctAnswer 
                    ? <CheckCircle2 className="h-4 w-4" />
                    : <XCircle className="h-4 w-4" />
                }
              <AlertTitle>
                {selectedAnswer === question.correctAnswer ? 'إجابة صحيحة!' : 'إجابة خاطئة'}
              </AlertTitle>
              <AlertDescription>{question.explanation}</AlertDescription>
            </Alert>
          )}

          <div className="flex justify-end">
            {!isAnswered ? (
              <Button onClick={handleCheckAnswer} disabled={!selectedAnswer}>
                تحقق من الإجابة
              </Button>
            ) : (
              <Button onClick={handleNextQuestion}>
                {currentQuestionIndex < exerciseSet.questions.length - 1 ? 'السؤال التالي' : 'إنهاء التمرين'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExercisePage;
