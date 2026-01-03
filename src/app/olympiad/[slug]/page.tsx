import PageTitle from "@/components/page-title";
import { olympiadQuestions } from "@/lib/data";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import OlympiadProblemClient from "./OlympiadProblemClient";


type OlympiadProblemPageProps = {
  params: {
    slug: string;
  };
};

export function generateStaticParams() {
  return olympiadQuestions.map((problem) => ({
    slug: problem.slug,
  }));
}

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

      <OlympiadProblemClient problem={problem} />
    </div>
  );
};

export default OlympiadProblemPage;
