import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, FlaskConical, Newspaper, BrainCircuit, MoveRight, PencilRuler, Trophy } from 'lucide-react';
import Link from 'next/link';

const features = [
  {
    icon: <BookOpen className="w-8 h-8 text-primary" />,
    title: "دروس تفاعلية",
    description: "شروحات شاملة ومفصلة لمنهج الرياضيات للسنة الثانية ثانوي.",
    href: "/lessons",
  },
  {
    icon: <PencilRuler className="w-8 h-8 text-primary" />,
    title: "تمارين تطبيقية",
    description: "مجموعات من التمارين لاختبار فهمك وتطبيق ما تعلمته.",
    href: "/exercises",
  },
  {
    icon: <Trophy className="w-8 h-8 text-primary" />,
    title: 'مسائل أولمبياد',
    description: 'تحدَّ نفسك مع مسائل صعبة من مسابقات الرياضيات لتعزيز مهاراتك.',
    href: '/olympiad',
  },
  {
    icon: <FlaskConical className="w-8 h-8 text-primary" />,
    title: "مختبر الحساب",
    description: "أدوات تفاعلية لرسم الدوال، حل المعادلات، وحساب المرجح.",
    href: "/lab",
  },
  {
    icon: <Newspaper className="w-8 h-8 text-primary" />,
    title: "مقالات علمية",
    description: "اكتشف تطبيقات الرياضيات في الطب، الهندسة، وأمن المعلومات.",
    href: "/articles",
  },
  {
    icon: <BrainCircuit className="w-8 h-8 text-primary" />,
    title: "التعلم التكيفي",
    description: "أداة ذكاء اصطناعي تقترح عليك موارد لتقوية نقاط ضعفك.",
    href: "/adaptive-learning",
  },
];

const glassCardClasses = 'bg-white/5 backdrop-blur-lg border border-cyan-300/10 rounded-2xl shadow-lg transition-all duration-300 hover:border-cyan-300/20 hover:shadow-cyan-300/10';

export default function Home() {
  return (
    <div className="flex flex-col items-center text-center space-y-16 my-12">
      <div className="space-y-6 max-w-4xl">
        <h1 className="text-5xl md:text-7xl font-headline font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-400">
          Math Companion Pro
        </h1>
        <p className="text-2xl md:text-3xl font-headline text-slate-300">
          رفيقك الأمثل لإتقان الرياضيات
        </p>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto">
          انطلق في رحلة تعلم فريدة مع دروس تفاعلية، أدوات حسابية قوية، ومقالات علمية تثري معرفتك. مصمم خصيصًا لطلاب السنة الثانية ثانوي.
        </p>
        <div className="flex justify-center gap-4">
          <Button asChild size="lg" className="font-bold text-lg">
            <Link href="/lessons">ابدأ التعلم الآن</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="font-bold text-lg">
            <Link href="/about">عن المطور</Link>
          </Button>
        </div>
      </div>

      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature) => (
          <Link href={feature.href} key={feature.title} className="block group">
            <Card className={glassCardClasses}>
              <CardHeader className="flex-row items-center gap-4 space-y-0">
                {feature.icon}
                <CardTitle className="font-headline text-2xl text-right">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base text-slate-400 text-right">{feature.description}</CardDescription>
                <div className="flex items-center justify-end mt-4 text-primary font-semibold group-hover:translate-x-[-4px] transition-transform">
                  <span>استكشف</span>
                  <MoveRight className="w-4 h-4 mr-2" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
