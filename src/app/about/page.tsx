'use client';

import PageTitle from '@/components/page-title';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';

const glassCardClasses =
  'bg-white/5 backdrop-blur-lg border border-cyan-300/10 rounded-2xl shadow-lg';

const AboutPage = () => {
  const [profileImageUrl, setProfileImageUrl] = useState(
    'https://picsum.photos/seed/jlg/250/250'
  );

  useEffect(() => {
    // This is a workaround to use the uploaded image.
    // In a real application, this would be hosted properly.
    const uploadedImageUrl =
      'https://storage.googleapis.com/maker-studio-5f33a.appspot.com/users/user-lK2DvxQd2q2v62i3Y3dJ/studios/studio-1lF6t7l1v7j8n8s9k9h9/1723145610813-jlg.jpeg?alt=media';
    setProfileImageUrl(uploadedImageUrl);
  }, []);

  return (
    <div>
      <PageTitle
        title="عن المطور"
        subtitle="تعرف على الشخص وراء Math Companion Pro"
      />
      <Card className={glassCardClasses}>
        <CardContent className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          <div className="md:col-span-1 flex justify-center">
            <Image
              src={profileImageUrl}
              alt="Abdeldjalil Gouneiber"
              data-ai-hint="portrait man"
              width={250}
              height={250}
              className="rounded-full border-4 border-primary/50 object-cover shadow-lg aspect-square"
            />
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
              الرياضية وجعلها أكثر تفاعلية ومتعة لطلاب السنة الثانية ثانوي.
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
  );
};

export default AboutPage;
