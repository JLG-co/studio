import PageTitle from "@/components/page-title";
import { exerciseSets, lessons } from "@/lib/data";
import { Card, CardDescription, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { MoveLeft, Book } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const glassCardClasses = 'bg-white/5 backdrop-blur-lg border border-cyan-300/10 rounded-2xl shadow-lg transition-all duration-300 hover:border-cyan-300/20 hover:shadow-cyan-300/10 hover:-translate-y-1';

const ExercisesPage = () => {
  return (
    <div>
      <PageTitle 
        title="تمارين تطبيقية"
        subtitle="اختر مجموعة من التمارين لتقييم فهمك وتحدي معرفتك في مختلف الدروس."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {exerciseSets.map((exercise) => {
          const relatedLesson = lessons.find(l => l.slug === exercise.lessonSlug);
          return (
            <Link href={`/exercises/${exercise.slug}`} key={exercise.slug} className="block group">
              <Card className={glassCardClasses}>
                <CardHeader>
                  <CardTitle className="font-headline text-2xl mb-2">{exercise.title}</CardTitle>
                  <CardDescription className="text-slate-400">{exercise.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  {relatedLesson && (
                    <Badge variant="outline" className="flex items-center gap-2 w-fit">
                      <Book className="h-4 w-4" />
                      مرتبط بدرس: {relatedLesson.title}
                    </Badge>
                  )}
                   <div className="flex items-center justify-start mt-4 text-primary font-semibold group-hover:translate-x-1 transition-transform">
                    <MoveLeft className="w-4 h-4 ml-2" />
                    <span>ابدأ التمرين</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  );
};

export default ExercisesPage;
