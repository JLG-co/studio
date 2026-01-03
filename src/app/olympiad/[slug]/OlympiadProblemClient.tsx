'use client'
import { Card, CardContent } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { OlympiadQuestion } from "@/lib/types";

const glassCardClasses = 'bg-white/5 backdrop-blur-lg border border-cyan-300/10 rounded-2xl shadow-lg';

type OlympiadProblemClientProps = {
  problem: OlympiadQuestion;
}

const OlympiadProblemClient = ({ problem }: OlympiadProblemClientProps) => {
  return (
    <>
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
    </>
  )
}

export default OlympiadProblemClient;
