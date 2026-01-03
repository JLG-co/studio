'use client'
import PageTitle from "@/components/page-title";
import { olympiadQuestions } from "@/lib/data";
import { notFound } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Lightbulb } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

type OlympiadProblemPageProps = {
  params: {
    slug: string;
  };
};

export async function generateStaticParams() {
  return olympiadQuestions.map((problem) => ({
    slug: problem.slug,
  }));
}

const glassCardClasses = 'bg-white/5 backdrop-blur-lg border border-cyan-300/10 rounded-2xl shadow-lg';

const OlympiadProblemPage = ({ params }: OlympiadProblemPageProps) => {
  const problem = olympiadQuestions.find((p) => p.slug === params.slug);

  if (!problem) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <Button asChild variant="outline">
          <Link href="/olympiad">
            <ArrowRight className="w-4 h-4 ml-2" />
            <span>العودة للمسائل</span>
          </Link>
        </Button>
        <PageTitle title={problem.title} className="mb-0" />
        <div className="w-36"></div>
      </div>

      <Card className={glassCardClasses}>
        <CardContent className="p-6 md:p-8 space-y-6">
            <h2 className="text-2xl font-headline text-primary">نص المسألة</h2>
             <div
                className="prose prose-invert max-w-none text-slate-300"
                dangerouslySetInnerHTML={{ __html: problem.problemStatement }}
            />
        </CardContent>
      </Card>
      
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="solution" className={`${glassCardClasses} border-b-0`}>
            <AccordionTrigger className="p-6 text-xl font-headline hover:no-underline">
                <div className="flex items-center gap-2">
                    <Lightbulb className="w-6 h-6 text-yellow-400"/>
                    <span>عرض الحل</span>
                </div>
            </AccordionTrigger>
            <AccordionContent className="p-6 pt-0">
                <div
                    className="prose prose-invert max-w-none text-slate-300"
                    dangerouslySetInnerHTML={{ __html: problem.solution }}
                />
            </AccordionContent>
        </AccordionItem>
      </Accordion>

    </div>
  );
};

export default OlympiadProblemPage;
