'use client'

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, BrainCircuit, BookCopy } from "lucide-react";
import { generateLessonPlan, LessonPlanInput, LessonPlanOutput } from "@/ai/flows/lesson-plan-flow";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import { marked } from "marked";

const LessonPlanGenerator = () => {
    const [topic, setTopic] = useState('مقدمة في الاشتقاق');
    const [result, setResult] = useState<LessonPlanOutput | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleGenerate = async () => {
        setLoading(true);
        setError('');
        setResult(null);

        const input: LessonPlanInput = { topic };

        try {
            const plan = await generateLessonPlan(input);
            setResult(plan);
        } catch (err) {
            console.error(err);
            setError("حدث خطأ أثناء إنشاء خطة الدرس. يرجى المحاولة مرة أخرى.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <CardHeader className="text-center">
                 <div className="flex justify-center items-center mb-4">
                    <BookCopy className="w-12 h-12 text-primary" />
                </div>
                <CardTitle className="font-headline text-2xl">مولد خطط الدروس</CardTitle>
                <CardDescription>
                    أدخل موضوع درس في الرياضيات، وسيقوم الذكاء الاصطناعي بإنشاء خطة درس مفصلة لك.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="topic-input">موضوع الدرس</Label>
                        <Input 
                            id="topic-input"
                            value={topic} 
                            onChange={(e) => setTopic(e.target.value)} 
                            placeholder="e.g., المتتاليات الهندسية"
                        />
                    </div>
                    <Button onClick={handleGenerate} disabled={loading} className="w-full">
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <BrainCircuit className="mr-2 h-4 w-4" />}
                        أنشئ الخطة
                    </Button>
                </div>

                {error && <Alert variant="destructive"><AlertTitle>خطأ</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}

                {loading && (
                    <div className="space-y-4">
                        <Skeleton className="h-8 w-1/3" />
                        <Skeleton className="h-64 w-full" />
                    </div>
                )}

                {result && (
                    <div className="space-y-6 pt-6 border-t border-white/10">
                        <h2 className="text-3xl font-headline text-center text-primary">{result.title}</h2>
                        <div 
                            className="prose prose-invert max-w-none text-slate-300"
                            dangerouslySetInnerHTML={{ __html: marked(result.content) }}
                        />
                    </div>
                )}
            </CardContent>
        </>
    );
};

export default LessonPlanGenerator;
