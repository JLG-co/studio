import PageTitle from "@/components/page-title";
import { lessons } from "@/lib/data";
import { notFound } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

type LessonPageProps = {
  params: {
    slug: string;
  };
};

export async function generateStaticParams() {
  return lessons.map((lesson) => ({
    slug: lesson.slug,
  }));
}

const glassCardClasses = 'bg-white/5 backdrop-blur-lg border border-cyan-300/10 rounded-2xl shadow-lg';

const LessonPage = ({ params }: LessonPageProps) => {
  const lesson = lessons.find((l) => l.slug === params.slug);

  if (!lesson) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <Button asChild variant="outline">
          <Link href="/lessons">
            <ArrowRight className="w-4 h-4 ml-2" />
            <span>العودة للدروس</span>
          </Link>
        </Button>
        <PageTitle title={lesson.title} className="mb-0" />
        <div className="w-32"></div>
      </div>
      
      <Card className={glassCardClasses}>
        <CardContent className="p-6 md:p-8">
          <div
            className="prose prose-invert max-w-none text-slate-300"
            dangerouslySetInnerHTML={{ __html: lesson.content }}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default LessonPage;
