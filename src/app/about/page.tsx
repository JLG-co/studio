'use client';

import PageTitle from '@/components/page-title';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Award, BrainCircuit, GitFork, ShieldCheck } from 'lucide-react';

const glassCardClasses =
  'bg-white/5 backdrop-blur-lg border border-cyan-300/10 rounded-2xl shadow-lg';
  
const achievements = [
    {
        icon: <ShieldCheck className="w-8 h-8 text-primary" />,
        title: "باحث أمني",
        description: "اكتشاف ونشر ثغرات أمنية في أنظمة معروفة.",
    },
    {
        icon: <GitFork className="w-8- h-8 text-primary" />,
        title: "مساهم في المصادر المفتوحة",
        description: "المساهمة في تطوير مشاريع مفتوحة المصدر يعتمد عليها الآلاف.",
    },
    {
        icon: <BrainCircuit className="w-8 h-8 text-primary" />,
        title: "مطور ذكاء اصطناعي",
        description: "بناء وتطوير أدوات تعليمية مدعومة بالذكاء الاصطناعي.",
    },
    {
        icon: <Award className="w-8 h-8 text-primary" />,
        title: "تفوق أكاديمي",
        description: "الحصول على مراتب متقدمة وتحقيق نتائج ممتازة على المستوى الدراسي.",
    },
];


const AboutPage = () => {
  return (
    <div className="space-y-12">
      <div>
        <PageTitle
          title="عن المطور"
          subtitle="تعرف على الشخص وراء Math Companion Pro"
        />
        <Card className={glassCardClasses}>
          <CardContent className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            <div className="md:col-span-1 flex justify-center">
              <div className="relative w-[250px] h-[250px]">
                <Image
                  src="https://picsum.photos/seed/jlg/250/250"
                  alt="Abdeldjalil Gouneiber"
                  data-ai-hint="portrait man"
                  fill
                  className="rounded-2xl border-4 border-primary/50 object-cover shadow-lg"
                />
              </div>
            </div>
            <div className="md:col-span-2 space-y-6 text-center md:text-right">
              <h2 className="text-4xl font-headline font-bold text-primary">
                عبد الجليل قنيبر
              </h2>
              <h3 className="text-xl font-semibold text-slate-300">
                مطور برمجيات وشغوف بالرياضيات
              </h3>
              <p className="text-lg text-slate-400 leading-relaxed">
                مرحبًا! أنا عبد الجليل، طالب ومطور شغوف بأمن المعلومات
                والبرمجة. قمت بإنشاء Math Companion Pro بهدف تبسيط المفاهيم
                الرياضية وجعلها أكثر تفاعلية والمتعة لطلاب السنة الثانية ثانوي.
                أؤمن بأن فهم الرياضيات هو مفتاح لفتح أبواب العديد من
                التخصصات العلمية والتقنية المتقدمة.
              </p>
              <p className="text-lg text-slate-400 leading-relaxed">
                مهمتي هي توفير أدوات تعليمية عالية الجودة تساعد الطلاب على
                تحقيق إمكاناتهم الكاملة. إذا كنت مهتمًا بالبرمجة، أمن
                المعلومات، أو لديك أي أفكار لتطوير التطبيق، فلا تتردد في
                التواصل معي.
              </p>
              <div className="flex justify-center md:justify-end pt-4">
                <Button asChild size="lg">
                  <Link href="https://solo.to/jlg-ps" target="_blank">
                    <ArrowLeft className="w-5 h-5 ml-2" />
                    تواصل معي
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-3xl md:text-4xl font-headline font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400">
            أبرز الإنجازات
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {achievements.map((achievement, index) => (
                <Card key={index} className={glassCardClasses}>
                    <CardHeader className="items-center text-center">
                        {achievement.icon}
                        <CardTitle className="font-headline text-xl mt-4">{achievement.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center text-slate-400">
                        <p>{achievement.description}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
      </div>

    </div>
  );
};

export default AboutPage;
