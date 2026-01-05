'use client';
import PageTitle from "@/components/page-title";
import { articles } from "@/lib/data";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Lightbulb, MoveLeft } from "lucide-react";
import { useUser } from "@/firebase";
import SuggestArticleDialog from "./SuggestArticleDialog";
import { Button } from "@/components/ui/button";

const glassCardClasses = 'bg-white/5 backdrop-blur-lg border border-cyan-300/10 rounded-2xl shadow-lg transition-all duration-300 hover:border-cyan-300/20 hover:shadow-cyan-300/10 hover:-translate-y-1';

const ArticlesPage = () => {
  const { user } = useUser();
  
  return (
    <div>
      <div className="flex justify-between items-center mb-12">
        <div className="flex-1"></div>
        <div className="flex-1 text-center">
            <PageTitle 
              title="مقالات علمية"
              subtitle="استكشف كيف تشكل الرياضيات عالمنا من خلال مقالات معمقة حول تطبيقاتها في مجالات متنوعة ومثيرة."
              className="mb-0"
            />
        </div>
        <div className="flex-1 flex justify-end">
          <SuggestArticleDialog user={user}>
            <Button variant="outline" disabled={!user}>
              <Lightbulb className="w-4 h-4 ml-2" />
              اقترح مقالاً
            </Button>
          </SuggestArticleDialog>
        </div>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {articles.map((article) => (
          <Link href={`/articles/${article.slug}`} key={article.slug} className="block group">
            <Card className={glassCardClasses}>
              <CardHeader>
                <CardTitle className="font-headline text-2xl mb-2">{article.title}</CardTitle>
                <CardDescription className="text-slate-400">{article.description}</CardDescription>
              </CardHeader>
              <div className="flex items-center justify-start p-6 pt-0 text-primary font-semibold group-hover:translate-x-1 transition-transform">
                <MoveLeft className="w-4 h-4 ml-2" />
                <span>اقرأ المقال</span>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ArticlesPage;
