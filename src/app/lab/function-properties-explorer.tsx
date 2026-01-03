'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Wand2, Loader2, Compass, Sigma, AreaChart } from 'lucide-react';
import { analyzeFunction, AnalyzeFunctionOutput } from '@/ai/flows/analyze-function';

const FunctionPropertiesExplorer = () => {
  const [expression, setExpression] = useState('x^2');
  const [result, setResult] = useState<AnalyzeFunctionOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!expression.trim()) {
      setError('يرجى إدخال دالة لتحليلها.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const output = await analyzeFunction({ func: expression });
      setResult(output);
    } catch (e) {
      console.error(e);
      setError('حدث خطأ أثناء تحليل الدالة. يرجى التأكد من أن الصيغة صحيحة.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">مستكشف خواص الدوال</CardTitle>
        <CardDescription>أدخل دالة وسيقوم الذكاء الاصطناعي بتحليلها وتوفير خصائصها الأساسية.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex w-full max-w-lg mx-auto items-center space-x-2 space-x-reverse">
          <Input 
            dir="ltr"
            type="text" 
            value={expression}
            onChange={(e) => setExpression(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAnalyze()}
            placeholder="e.g., 1/(x-2)"
            className="text-left"
          />
          <Button onClick={handleAnalyze} disabled={isLoading}>
             {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ...
              </>
            ) : (
              <Wand2 className="h-5 w-5" />
            )}
            تحليل
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-900/50 p-4 rounded-lg">
                    <h3 className="font-headline text-lg text-primary flex items-center gap-2 mb-2"><Compass /> مجال التعريف</h3>
                    <p className="font-mono text-lg text-slate-200 dir-ltr text-left">{result.domain}</p>
                </div>
                 <div className="bg-gray-900/50 p-4 rounded-lg">
                    <h3 className="font-headline text-lg text-primary flex items-center gap-2 mb-2"><AreaChart /> المدى</h3>
                    <p className="font-mono text-lg text-slate-200 dir-ltr text-left">{result.range}</p>
                </div>
              </div>
             <div className="bg-gray-900/50 p-4 rounded-lg">
                <h3 className="font-headline text-lg text-primary flex items-center gap-2 mb-2"><Sigma /> الاشتقاق</h3>
                <p className="font-mono text-lg text-slate-200 dir-ltr text-left">{result.derivative}</p>
            </div>
             <div className="bg-gray-900/50 p-4 rounded-lg">
                <h3 className="font-headline text-lg text-primary mb-2">تحليل السلوك</h3>
                <p className="text-slate-300">{result.behavior}</p>
            </div>
          </div>
        )}
      </CardContent>
    </>
  );
};

export default FunctionPropertiesExplorer;
