import PageTitle from "@/components/page-title";
import { olympiadQuestions } from "@/lib/data";
import { Card, CardDescription, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { MoveLeft, BarChart3, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const glassCardClasses = 'bg-white/5 backdrop-blur-lg border border-cyan-300/10 rounded-2xl shadow-lg transition-all duration-300 hover:border-cyan-300/20 hover:shadow-cyan-300/10 hover:-translate-y-1';

const getDifficultyClass = (difficulty: 'متوسط' | 'صعب' | 'صعب جداً') => {
  switch (difficulty) {
    case 'متوسط':
      return 'border-green-500/50 text-green-400';
    case 'صعب':
      return 'border-yellow-500/50 text-yellow-400';
    case 'صعب جداً':
      return 'border-red-500/50 text-red-400';
  }
};

const OlympiadPage = () => {
  return (
    <div>
      <PageTitle 
        title="مسائل الأولمبياد"
        subtitle="مجموعة من المسائل الصعبة والممتعة من مسابقات الرياضيات العالمية لصقل مهاراتك في حل المشكلات."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {olympiadQuestions.map((problem) => (
          <Link href={`/olympiad/${problem.slug}`} key={problem.slug} className="block group">
            <Card className={glassCardClasses}>
              <CardHeader>
                <CardTitle className="font-headline text-2xl mb-2">{problem.title}</CardTitle>
                <CardDescription className="text-slate-400">{problem.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {problem.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      <Tag className="h-3 w-3" />
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                    <Badge variant="outline" className={`flex items-center gap-2 ${getDifficultyClass(problem.difficulty)}`}>
                        <BarChart3 className="h-4 w-4" />
                        {problem.difficulty}
                    </Badge>
                    <div className="flex items-center text-primary font-semibold group-hover:translate-x-1 transition-transform">
                        <MoveLeft className="w-4 h-4 ml-2" />
                        <span>عرض المسألة</span>
                    </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default OlympiadPage;
