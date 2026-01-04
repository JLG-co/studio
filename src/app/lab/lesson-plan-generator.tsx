'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Wand2, Loader2, BookCopy } from 'lucide-react';
import { generateLessonPlan, GenerateLessonPlanOutput } from '@/ai/flows/generate-lesson-plan';
import { marked } from 'marked';

const LessonPlanGenerator = () => {
  const [concept, setConcept] = useState('');
  const [result, setResult] = useState<GenerateLessonPlanOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!concept.trim()) {
      setError('يرجى إدخال مفهوم لإنشاء خطة درس له.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const output = await generateLessonPlan({ concept });
      setResult(output);
    } catch (e) {
      console.error(e);
      setError('حدث خطأ أثناء إنشاء خطة الدرس. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">مولد خطط الدروس</CardTitle>
        <CardDescription>أدخل مفهومًا رياضيًا وسيقوم الذكاء الاصطناعي بإنشاء مخطط خطة درس لك.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex w-full max-w-lg mx-auto items-center space-x-2 space-x-reverse">
          <Input 
            type="text" 
            value={concept}
            onChange={(e) => setConcept(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleGenerate()}
            placeholder="e.g., المتطابقات الهامة"
            className="text-right"
          />
          <Button onClick={handleGenerate} disabled={isLoading}>
             {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ...
              </>
            ) : (
              <Wand2 className="h-5 w-5" />
            )}
            إنشاء
          </Button>
        </div>

        {error && (
            <Alert variant="destructive">
                <AlertTitle>خطأ</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}

        {result && (
          <div className="pt-6 border-t border-white/10 space-y-4">
              <h3 className="font-headline text-2xl text-primary flex items-center gap-2 mb-4"><BookCopy /> خطة الدرس المقترحة لـ "{concept}"</h3>
              <div 
                className="prose prose-invert max-w-none text-slate-300 bg-gray-900/50 p-6 rounded-lg"
                dangerouslySetInnerHTML={{ __html: marked(result.lessonPlan) as string }}
              />
          </div>
        )}
      </CardContent>
    </>
  );
};

export default LessonPlanGenerator;
