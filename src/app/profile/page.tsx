'use client';

import PageTitle from '@/components/page-title';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogIn, LogOut } from 'lucide-react';
import { useUser } from '@/firebase';
import { signInWithGoogle, signOutUser } from '@/firebase/auth/auth-service';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';

const glassCardClasses = 'bg-white/5 backdrop-blur-lg border border-cyan-300/10 rounded-2xl shadow-lg';

const ProfilePage = () => {
  const { user, loading } = useUser();

  if (loading) {
    return (
        <div className="space-y-12">
            <PageTitle title="ملفك الشخصي" subtitle="تتبع رحلتك التعليمية هنا" />
            <Card className={glassCardClasses}>
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <Skeleton className="h-16 w-16 rounded-full" />
                        <div className='space-y-2'>
                            <Skeleton className="h-8 w-48" />
                            <Skeleton className="h-4 w-64" />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-10 w-full" />
                </CardContent>
            </Card>
        </div>
    )
  }

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
            <Button size="lg" className="w-full" onClick={signInWithGoogle}>
                <LogIn className="w-5 h-5 ml-2" />
                تسجيل الدخول باستخدام جوجل
            </Button>
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
                <Avatar className="w-16 h-16">
                    <AvatarImage src={user.photoURL || ''} alt={user.displayName || 'User'} />
                    <AvatarFallback>
                        {user.displayName?.charAt(0) || 'U'}
                    </AvatarFallback>
                </Avatar>
                <div>
                    <CardTitle className="font-headline text-4xl">{user.displayName}</CardTitle>
                    <CardDescription>{user.email}</CardDescription>
                </div>
            </div>
        </CardHeader>
        <CardContent className="space-y-6">
             <div>
                <h3 className="text-2xl font-headline mb-4">التقدم المحرز</h3>
                <p className="text-muted-foreground">ستظهر هنا نتائج التمارين والتوصيات المخصصة لك قريبًا.</p>
            </div>
            <Button variant="outline" onClick={signOutUser}>
                <LogOut className="w-5 h-5 ml-2" />
                تسجيل الخروج
            </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
