'use client';

import PageTitle from '@/components/page-title';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, LogIn } from 'lucide-react';

// This is a placeholder for a real authentication flow
const user = null; // Set to a user object to see the authenticated state

const glassCardClasses =
  'bg-white/5 backdrop-blur-lg border border-cyan-300/10 rounded-2xl shadow-lg';

const ProfilePage = () => {
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <Card className={`${glassCardClasses} max-w-md`}>
          <CardHeader>
            <CardTitle className="font-headline text-3xl">صفحة الملف الشخصي</CardTitle>
            <CardDescription>
                للوصول إلى هذه الصفحة، يرجى تسجيل الدخول. سيسمح لك ذلك بتتبع تقدمك وحفظ نتائجك.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button size="lg" className="w-full">
                <LogIn className="w-5 h-5 ml-2" />
                تسجيل الدخول (قريباً)
            </Button>
            <p className="text-xs text-muted-foreground mt-4">
                ميزة تسجيل الدخول قيد التطوير حاليًا.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <PageTitle title="ملفك الشخصي" subtitle="تتبع رحلتك التعليمية هنا" />
      <Card className={glassCardClasses}>
        <CardHeader>
            <div className="flex items-center gap-4">
                <User className="w-12 h-12 text-primary" />
                <div>
                    <CardTitle className="font-headline text-4xl">اسم الطالب</CardTitle>
                    <CardDescription>مرحباً بعودتك!</CardDescription>
                </div>
            </div>
        </CardHeader>
        <CardContent>
            <h3 className="text-2xl font-headline mb-4">التقدم المحرز</h3>
            <p className="text-muted-foreground">ستظهر هنا نتائج التمارين والتوصيات المخصصة لك قريبًا.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
