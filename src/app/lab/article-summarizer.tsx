'use client'

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, BrainCircuit, Newspaper } from "lucide-react";
import { summarizeArticle, ArticleSummarizerInput, ArticleSummarizerOutput } from "@/ai/flows/article-summarizer-flow";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";

const ArticleSummarizer = () => {
    const [articleText, setArticleText] = useState('');
    const [result, setResult] = useState<ArticleSummarizerOutput | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSummarize = async () => {
        if (!articleText.trim()) {
            setError("يرجى إدخال نص المقال لتلخيصه.");
            return;
        }

        setLoading(true);
        setError('');
        setResult(null);

        const input: ArticleSummarizerInput = { articleText };

        try {
            const summary = await summarizeArticle(input);
            setResult(summary);
        } catch (err) {
            console.error(err);
            setError("حدث خطأ أثناء تلخيص المقال. يرجى المحاولة مرة أخرى.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <CardHeader className="text-center">
                 <div className="flex justify-center items-center mb-4">
                    <Newspaper className="w-12 h-12 text-primary" />
                </div>
                <CardTitle className="font-headline text-2xl">ملخص المقالات</CardTitle>
                <CardDescription>
                    الصق نص مقال علمي هنا، وسيقوم الذكاء الاصطناعي بتلخيصه لك في نقاط رئيسية.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="article-text">نص المقال</Label>
                    <Textarea 
                        id="article-text"
                        value={articleText} 
                        onChange={(e) => setArticleText(e.target.value)} 
                        placeholder="الصق نص المقال هنا..."
                        className="min-h-[200px]"
                    />
                </div>
                <Button onClick={handleSummarize} disabled={loading || !articleText.trim()} className="w-full">
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <BrainCircuit className="mr-2 h-4 w-4" />}
                    لخص المقال
                </Button>

                {error && <Alert variant="destructive"><AlertTitle>خطأ</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}

                {loading && (
                    <div className="space-y-4">
                        <Skeleton className="h-8 w-1/3" />
                        <Skeleton className="h-32 w-full" />
                    </div>
                )}

                {result && (
                    <div className="space-y-6 pt-6 border-t border-white/10">
                         <div>
                            <h3 className="font-headline text-xl text-primary mb-2">النقاط الرئيسية</h3>
                            <ul className="list-disc pr-6 space-y-2 text-slate-300">
                                {result.keyPoints.map((point, index) => (
                                    <li key={index}>{point}</li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-headline text-xl text-primary mb-2">الملخص</h3>
                            <p className="text-slate-300 leading-relaxed bg-gray-900/50 p-4 rounded-md">{result.summary}</p>
                        </div>
                    </div>
                )}
            </CardContent>
        </>
    );
};

export default ArticleSummarizer;
