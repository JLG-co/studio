import PageTitle from "@/components/page-title";
import { articles } from "@/lib/data";
import { notFound } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Image from "next/image";


type PageProps<T extends Record<string, string> = {}> = {
  params: T;
  searchParams: { [key: string]: string | string[] | undefined };
};

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

const ArticlePage = ({ params }: PageProps<ArticlePageProps['params']>) => {
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
        <PageTitle title={article.title} className="mb-0 text-center" />
        <div className="w-36 md:w-48"></div> {/* Spacer */}
      </div>

      <Card className={glassCardClasses}>
        <CardContent className="p-6 md:p-8">
          {article.imageUrl && (
              <div className="relative w-full md:w-1/3 max-w-sm h-64 float-left ml-6 mb-4 rounded-lg overflow-hidden border-2 border-cyan-300/20">
                  <Image
                      src={article.imageUrl}
                      alt={article.title}
                      data-ai-hint={article.imageHint || 'abstract'}
                      fill
                      className="object-cover"
                  />
              </div>
          )}
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
