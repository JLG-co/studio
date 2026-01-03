'use client';

import { useState } from 'react';
import PageTitle from '@/components/page-title';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { recommendLearningResources, RecommendedResource } from '@/ai/flows/recommend-learning-resources';
import { lessons, articles } from '@/lib/data';
import { Loader2, Wand2, BookOpen, Newspaper } from 'lucide-react';
import Link from 'next/link';

const glassCardClasses = 'bg-white/5 backdrop-blur-lg border border-cyan-300/10 rounded-2xl shadow-lg';

const AdaptiveLearningPage = () => {
  const [performanceInput, setPerformanceInput] = useState('');
  const [recommendations, setRecommendations] = useState<RecommendedResource[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetRecommendations = async () => {
    if (!performanceInput.trim()) {
      setError('يرجى وصف أدائك أو الصعوبات التي تواجهها.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setRecommendations([]);
    
    try {
      const lessonTitles = lessons.map(l => l.title);
      const articleTitles = articles.map(a => a.title);

      const result = await recommendLearningResources({
        studentPerformance: performanceInput,
        allLessons: lessonTitles,
        allArticles: articleTitles,
      });

      setRecommendations(result);
    } catch (e) {
      console.error(e);
      setError('حدث خطأ أثناء الحصول على التوصيات. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const getLinkForResource = (resource: RecommendedResource) => {
    const list = resource.type === 'lesson' ? lessons : articles;
    const item = list.find(i => i.title === resource.title);
    return item ? `/${resource.type}s/${item.slug}` : '#';
  };

  return (
    <div>
      <PageTitle
        title="أداة التعلم التكيفي"
        subtitle="صف الصعوبات التي تواجهها في الرياضيات، وسيقوم الذكاء الاصطناعي باقتراح الدروس والمقالات المناسبة لك."
      />

      <Card className={glassCardClasses}>
        <CardContent className="p-6 space-y-4">
          <Textarea
            value={performanceInput}
            onChange={(e) => setPerformanceInput(e.target.value)}
            placeholder="مثال: أجد صعوبة في فهم قاعدة السلسلة في الاشتقاق، ولا أعرف متى أستخدمها. حصلت على درجة منخفضة في التمرين المتعلق بها..."
            className="min-h-[150px] text-lg bg-background/50"
            rows={5}
          />
          {error && <p className="text-red-500">{error}</p>}
          <Button onClick={handleGetRecommendations} disabled={isLoading} size="lg" className="w-full font-bold">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                جاري التحليل...
              </>
            ) : (
              <>
                <Wand2 className="mr-2 h-5 w-5" />
                احصل على توصيات
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {recommendations.length > 0 && (
        <div className="mt-8">
          <h2 className="text-3xl font-headline text-center mb-6">الموارد المقترحة لك</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recommendations.map((rec, index) => (
               <Link href={getLinkForResource(rec)} key={index} className="block group">
                <Card className={`${glassCardClasses} transition-transform hover:-translate-y-1`}>
                  <CardContent className="p-6 flex items-center gap-4">
                    {rec.type === 'lesson' 
                      ? <BookOpen className="h-8 w-8 text-primary flex-shrink-0" />
                      : <Newspaper className="h-8 w-8 text-primary flex-shrink-0" />
                    }
                    <div>
                      <p className="text-sm text-primary font-semibold">
                        {rec.type === 'lesson' ? 'درس مقترح' : 'مقال مقترح'}
                      </p>
                      <h3 className="text-xl font-bold font-headline text-white">{rec.title}</h3>
                    </div>
                  </CardContent>
                </Card>
               </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdaptiveLearningPage;
