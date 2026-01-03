'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Wand2, Loader2, BookCopy, FileText } from 'lucide-react';
import { summarizeArticle, SummarizeArticleOutput } from '@/ai/flows/summarize-article';

const ArticleSummarizer = () => {
  const [article, setArticle] = useState('');
  const [result, setResult] = useState<SummarizeArticleOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!article.trim()) {
      setError('يرجى إدخال نص المقال لتلخيصه.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const output = await summarizeArticle({ article });
      setResult(output);
    } catch (e) {
      console.error(e);
      setError('حدث خطأ أثناء تلخيص المقال. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">ملخص المقالات</CardTitle>
        <CardDescription>الصق نص مقال علمي وسيقوم الذكاء الاصطناعي بتلخيصه لك باللغة العربية.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
            <Textarea
              value={article}
              onChange={(e) => setArticle(e.target.value)}
              placeholder="الصق نص المقال هنا..."
              className="min-h-[200px] text-lg bg-background/50 text-left"
              rows={8}
              dir="ltr"
            />
            <Button onClick={handleGenerate} disabled={isLoading} size="lg" className="w-full font-bold">
                {isLoading ? (
                <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    ...جاري التلخيص
                </>
                ) : (
                <>
                    <Wand2 className="mr-2 h-5 w-5" />
                    لخص المقال
                </>
                )}
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
              <div className="bg-gray-900/50 p-4 rounded-lg">
                <h3 className="font-headline text-lg text-primary flex items-center gap-2 mb-2"><FileText /> الملخص</h3>
                <div 
                  className="prose prose-invert max-w-none text-slate-300 whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{ __html: result.summary }}
                />
            </div>
          </div>
        )}
      </CardContent>
    </>
  );
};

export default ArticleSummarizer;
