import PageTitle from '@/components/page-title';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Github, Linkedin, Mail } from 'lucide-react';

const glassCardClasses = 'bg-white/5 backdrop-blur-lg border border-cyan-300/10 rounded-2xl shadow-lg';

const AboutPage = () => {
  const profileImage = PlaceHolderImages.find(img => img.id === 'abdeldjalil-gouneiber');

  return (
    <div>
      <PageTitle title="عن المطور" subtitle="تعرف على الشخص وراء Math Companion Pro" />
      <Card className={glassCardClasses}>
        <CardContent className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          <div className="md:col-span-1 flex justify-center">
            {profileImage && (
              <Image
                src={profileImage.imageUrl}
                alt={profileImage.description}
                data-ai-hint={profileImage.imageHint}
                width={250}
                height={250}
                className="rounded-full border-4 border-primary/50 object-cover shadow-lg"
              />
            )}
          </div>
          <div className="md:col-span-2 space-y-4 text-center md:text-right">
            <h2 className="text-4xl font-headline font-bold text-primary">عبد الجليل قنيبر</h2>
            <h3 className="text-xl font-semibold text-slate-300">مطور برمجيات وشغوف بالرياضيات</h3>
            <p className="text-lg text-slate-400 leading-relaxed">
              مرحبًا! أنا عبد الجليل، طالب ومطور شغوف بأمن المعلومات والبرمجة. قمت بإنشاء Math Companion Pro بهدف تبسيط المفاهيم الرياضية وجعلها أكثر تفاعلية ومتعة لطلاب السنة الثانية ثانوي. أؤمن بأن فهم الرياضيات هو مفتاح لفتح أبواب العديد من التخصصات العلمية والتقنية المتقدمة.
            </p>
            <p className="text-lg text-slate-400 leading-relaxed">
              مهمتي هي توفير أدوات تعليمية عالية الجودة تساعد الطلاب على تحقيق إمكاناتهم الكاملة. إذا كنت مهتمًا بالبرمجة، أمن المعلومات، أو لديك أي أفكار لتطوير التطبيق، فلا تتردد في التواصل معي.
            </p>
            <div className="flex justify-center md:justify-end gap-4 pt-4">
              <Button asChild variant="outline" size="icon">
                <Link href="#" target="_blank"><Github /></Link>
              </Button>
              <Button asChild variant="outline" size="icon">
                <Link href="#" target="_blank"><Linkedin /></Link>
              </Button>
              <Button asChild variant="outline" size="icon">
                <Link href="mailto:"><Mail /></Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AboutPage;
