'use client';

import { useMemo } from 'react';
import PageTitle from '@/components/page-title';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogIn, LogOut, TrendingUp, CheckCircle, BarChart } from 'lucide-react';
import { useUser, useFirestore, useCollection } from '@/firebase';
import { signInWithGoogle, signOutUser } from '@/firebase/auth/auth-service';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { collection, query, orderBy } from 'firebase/firestore';
import { Progress } from '@/components/ui/progress';
import { format } from 'date-fns';

const glassCardClasses = 'bg-white/5 backdrop-blur-lg border border-cyan-300/10 rounded-2xl shadow-lg';

const ProfilePage = () => {
  const { user, loading: userLoading } = useUser();
  const firestore = useFirestore();

  const resultsQuery = useMemo(() => {
    if (!user || !firestore) return null;
    return query(collection(firestore, `users/${user.uid}/exerciseResults`), orderBy('completedAt', 'desc'));
  }, [user, firestore]);

  const { data: results, loading: resultsLoading } = useCollection(resultsQuery);

  const loading = userLoading || (user && resultsLoading);

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
                <CardContent className='space-y-4'>
                    <Skeleton className="h-8 w-1/3" />
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-10 w-32" />
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
                <Avatar className="w-16 h-16 border-2 border-primary">
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
                <h3 className="text-2xl font-headline mb-4 flex items-center gap-2"><BarChart /> التقدم المحرز</h3>
                {results && results.length > 0 ? (
                  <div className="space-y-4">
                    {results.map((result: any) => (
                      <div key={result.id} className="p-4 bg-background/50 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <p className="font-bold text-lg text-white">{result.exerciseTitle}</p>
                          <p className="text-sm text-muted-foreground">
                            {result.completedAt ? format(result.completedAt.toDate(), 'yyyy/MM/dd') : ''}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <Progress value={result.percentage} className="h-3" />
                           <span className="font-bold text-primary text-lg w-16 text-left">{result.percentage}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">لم تكمل أي تمارين بعد. اذهب إلى صفحة التمارين وابدأ!</p>
                )}
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
