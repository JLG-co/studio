import PageTitle from "@/components/page-title";
import { articles } from "@/lib/data";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { MoveLeft } from "lucide-react";

const glassCardClasses = 'bg-white/5 backdrop-blur-lg border border-cyan-300/10 rounded-2xl shadow-lg transition-all duration-300 hover:border-cyan-300/20 hover:shadow-cyan-300/10 hover:-translate-y-1';

const ArticlesPage = () => {
  return (
    <div>
      <PageTitle 
        title="مقالات علمية"
        subtitle="استكشف كيف تشكل الرياضيات عالمنا من خلال مقالات معمقة حول تطبيقاتها في مجالات متنوعة ومثيرة."
      />

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
