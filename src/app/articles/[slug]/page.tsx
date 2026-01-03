import PageTitle from "@/components/page-title";
import { articles } from "@/lib/data";
import { notFound } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";


type ArticlePageProps = {
  params: {
    slug: string;
  };
};

export async function generateStaticParams() {
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

const glassCardClasses = 'bg-white/5 backdrop-blur-lg border border-cyan-300/10 rounded-2xl shadow-lg';

const ArticlePage = ({ params }: ArticlePageProps) => {
  const article = articles.find((a) => a.slug === params.slug);

  if (!article) {
    notFound();
  }

  return (
    <div className="space-y-8">
       <div className="flex justify-between items-center">
        <Button asChild variant="outline">
          <Link href="/articles">
            <ArrowRight className="w-4 h-4 ml-2" />
            <span>العودة للمقالات</span>
          </Link>
        </Button>
        <PageTitle title={article.title} className="mb-0" />
        <div className="w-36"></div>
      </div>

      <Card className={glassCardClasses}>
        <CardContent className="p-6 md:p-8">
          <div
            className="prose prose-invert max-w-none text-slate-300"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ArticlePage;
