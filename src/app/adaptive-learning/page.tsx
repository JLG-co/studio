'use client';
import { useState } from 'react';
import PageTitle from '@/components/page-title';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { getAdaptiveLearningPath } from '@/ai/flows/adaptive-learning-flow';
import { type AdaptiveLearningInput, type AdaptiveLearningOutput } from '@/ai/flows/types';
import { Loader2, BrainCircuit, BookOpen, PencilRuler } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ExerciseResult } from '@/lib/types';
import { lessons, exerciseSets } from '@/lib/data';
import { Badge } from '@/components/ui/badge';

const glassCardClasses = 'bg-white/5 backdrop-blur-lg border border-cyan-300/10 rounded-2xl shadow-lg';

const AdaptiveLearningPage = () => {
    const { user, isUserLoading: userLoading } = useUser();
    const firestore = useFirestore();
    
    const [plan, setPlan] = useState<AdaptiveLearningOutput | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const resultsQuery = useMemoFirebase(() => {
        if (!user || !firestore) return null;
        return query(
            collection(firestore, `users/${user.uid}/exerciseResults`),
            orderBy('completedAt', 'desc'),
            limit(10)
        );
    }, [user, firestore]);
    
    const { data: results, isLoading: resultsLoading } = useCollection<ExerciseResult>(resultsQuery);

    const handleGeneratePlan = async () => {
        if (!results) return;

        setLoading(true);
        setError(null);
        setPlan(null);

        const input: AdaptiveLearningInput = {
            previousPerformance: results.map(r => ({
                exerciseTitle: r.exerciseTitle,
                score: r.score,
                totalQuestions: r.totalQuestions,
            })),
            availableLessons: lessons.map(l => ({ slug: l.slug, title: l.title, description: l.description })),
            availableExercises: exerciseSets.map(e => ({ slug: e.slug, title: e.title, description: e.description })),
        };

        try {
            const newPlan = await getAdaptiveLearningPath(input);
            setPlan(newPlan);
        } catch (err) {
            console.error(err);
            setError("عذراً، حدث خطأ أثناء إنشاء خطتك التعليمية. قد يكون بسبب الضغط على الخادم، يرجى المحاولة مرة أخرى بعد قليل.");
        } finally {
            setLoading(false);
        }
    };

    const isLoading = userLoading || resultsLoading;

    if (isLoading) {
        return (
            <div>
                <PageTitle title="التعلم التكيفي" subtitle="مسار تعليمي مخصص بناءً على أدائك." />
                <Skeleton className={`w-full h-64 ${glassCardClasses}`} />
            </div>
        )
    }

    if (!user) {
        return (
             <div>
                <PageTitle title="التعلم التكيفي" subtitle="مسار تعليمي مخصص بناءً على أدائك." />
                <Card className={`${glassCardClasses} text-center`}>
                     <CardHeader>
                        <CardTitle className="text-2xl font-headline">
                           ميزة حصرية للأعضاء
                        </CardTitle>
                        <CardDescription>
                            يجب عليك تسجيل الدخول للاستفادة من مسار التعلم المخصص.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild>
                           <Link href="/profile">
                                تسجيل الدخول
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }
    
    if (!results || results.length < 3) {
         return (
             <div>
                <PageTitle title="التعلم التكيفي" subtitle="مسار تعليمي مخصص بناءً على أدائك." />
                <Card className={`${glassCardClasses} text-center`}>
                     <CardHeader>
                        <CardTitle className="text-2xl font-headline">
                           لا توجد بيانات كافية
                        </CardTitle>
                        <CardDescription>
                            يجب عليك إكمال 3 تمارين على الأقل حتى نتمكن من تحليل أدائك وإنشاء خطة مخصصة لك.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild>
                           <Link href="/exercises">
                                <PencilRuler className="ml-2 h-4 w-4" />
                                اذهب للتمارين
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div>
            <PageTitle title="التعلم التكيفي" subtitle="مسار تعليمي مخصص بناءً على أدائك." />

            {!plan && (
                 <div className={`text-center p-8 ${glassCardClasses}`}>
                    <CardHeader>
                        <div className="flex justify-center items-center mb-4">
                            <BrainCircuit className="w-16 h-16 text-primary animate-pulse" />
                        </div>
                        <CardTitle className="text-2xl font-headline">
                            هل أنت مستعد لخطتك التعليمية المخصصة؟
                        </CardTitle>
                        <CardDescription>
                            بناءً على آخر 10 تمارين قمت بحلها، سيقوم الذكاء الاصطناعي بتحليل نقاط قوتك وضعفك واقتراح الخطوات التالية في رحلتك التعليمية.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button onClick={handleGeneratePlan} disabled={loading} size="lg">
                            {loading ? <Loader2 className="ml-2 h-5 w-5 animate-spin" /> : <BrainCircuit className="ml-2 h-5 w-5" />}
                            {loading ? 'جاري إنشاء الخطة...' : 'أنشئ خطتي الآن'}
                        </Button>
                         {error && <Alert variant="destructive" className="mt-6 text-right"><AlertTitle>خطأ</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}
                    </CardContent>
                </div>
            )}
            
            {plan && (
                 <Card className={glassCardClasses}>
                    <CardHeader className="text-center">
                        <CardTitle className="text-3xl font-headline text-primary">خطتك التعليمية المقترحة</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-8">
                        <div>
                            <h3 className="text-xl font-bold mb-4">تحليل الأداء:</h3>
                            <p className="bg-background/50 p-4 rounded-md text-slate-300">{plan.performanceAnalysis}</p>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <h3 className="text-xl font-bold mb-2">الدرس المقترح:</h3>
                                 <Link href={`/lessons/${plan.recommendedLesson.slug}`} className="block group">
                                    <Card className="bg-muted/30 hover:bg-muted/50 transition-colors">
                                        <CardHeader>
                                            <div className="flex items-center gap-3">
                                                <BookOpen className="w-8 h-8 text-primary" />
                                                <CardTitle className="text-2xl font-headline">{plan.recommendedLesson.title}</CardTitle>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-slate-400 mb-2">{plan.recommendedLesson.reasoning}</p>
                                            <Badge variant="secondary">{lessons.find(l => l.slug === plan.recommendedLesson.slug)?.description}</Badge>
                                        </CardContent>
                                    </Card>
                                </Link>
                            </div>
                             <div className="space-y-4">
                                <h3 className="text-xl font-bold mb-2">التمرين المقترح:</h3>
                                <Link href={`/exercises/${plan.recommendedExercise.slug}`} className="block group">
                                    <Card className="bg-muted/30 hover:bg-muted/50 transition-colors">
                                        <CardHeader>
                                            <div className="flex items-center gap-3">
                                                <PencilRuler className="w-8 h-8 text-primary" />
                                                <CardTitle className="text-2xl font-headline">{plan.recommendedExercise.title}</CardTitle>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-slate-400 mb-2">{plan.recommendedExercise.reasoning}</p>
                                            <Badge variant="secondary">{exerciseSets.find(e => e.slug === plan.recommendedExercise.slug)?.description}</Badge>
                                        </CardContent>
                                    </Card>
                                </Link>
                            </div>
                        </div>

                         <div className="text-center pt-6 border-t border-cyan-300/10">
                            <Button onClick={handleGeneratePlan} disabled={loading} >
                                {loading ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : <BrainCircuit className="ml-2 h-4 w-4" />}
                                {loading ? 'جاري إعادة الإنشاء...' : 'إعادة إنشاء الخطة'}
                            </Button>
                        </div>
                    </CardContent>
                 </Card>
            )}

        </div>
    );
};

export default AdaptiveLearningPage;
