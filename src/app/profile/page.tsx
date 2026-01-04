'use client';

import { useState } from 'react';
import PageTitle from '@/components/page-title';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogIn, LogOut, UserPlus, BarChart, Lock } from 'lucide-react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { signInWithEmail, signUpWithEmail, signOutUser } from '@/firebase/auth/auth-service';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { collection, query, orderBy } from 'firebase/firestore';
import { Progress } from '@/components/ui/progress';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

const glassCardClasses = 'bg-white/5 backdrop-blur-lg border border-cyan-300/10 rounded-2xl shadow-lg';

const loginSchema = z.object({
  email: z.string().email({ message: "البريد الإلكتروني غير صالح" }),
  password: z.string().min(1, { message: "كلمة المرور مطلوبة" }),
});

const signupSchema = z.object({
  displayName: z.string().min(3, { message: "يجب أن يكون اسم العرض 3 أحرف على الأقل" }),
  email: z.string().email({ message: "البريد الإلكتروني غير صالح" }),
  password: z.string().min(6, { message: "يجب أن تكون كلمة المرور 6 أحرف على الأقل" }),
});


const AuthForm = () => {
    const [authError, setAuthError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const loginForm = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: "", password: "" },
    });

    const signupForm = useForm<z.infer<typeof signupSchema>>({
        resolver: zodResolver(signupSchema),
        defaultValues: { displayName: "", email: "", password: "" },
    });

    const onLoginSubmit = async (values: z.infer<typeof loginSchema>) => {
        setLoading(true);
        setAuthError(null);
        try {
            await signInWithEmail(values.email, values.password);
        } catch (error: any) {
            setAuthError(error.message || "فشل تسجيل الدخول. يرجى التحقق من بريدك الإلكتروني وكلمة المرور.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const onSignupSubmit = async (values: z.infer<typeof signupSchema>) => {
        setLoading(true);
        setAuthError(null);
        try {
            await signUpWithEmail(values.email, values.password, values.displayName);
             toast({
                title: "تم إنشاء الحساب بنجاح!",
                description: "يمكنك الآن تسجيل الدخول.",
            });
        } catch (error: any) {
             const message = (error.message || "فشل إنشاء الحساب. يرجى المحاولة مرة أخرى.").replace("Firebase: ", "").replace(`Error (auth/email-already-in-use).`, "هذا البريد مستخدم بالفعل");
             setAuthError(message);
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className={`${glassCardClasses} max-w-md mx-auto`}>
            <CardHeader className='text-center'>
                <CardTitle className="font-headline text-3xl">صفحة الملف الشخصي</CardTitle>
                <CardDescription>
                    قم بتسجيل الدخول أو إنشاء حساب جديد لتتبع تقدمك.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="login" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="login">تسجيل الدخول</TabsTrigger>
                        <TabsTrigger value="signup">إنشاء حساب</TabsTrigger>
                    </TabsList>
                    <TabsContent value="login">
                        <Form {...loginForm}>
                            <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4 mt-4">
                                <FormField
                                    control={loginForm.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>البريد الإلكتروني</FormLabel>
                                            <FormControl>
                                                <Input type="email" placeholder="email@example.com" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={loginForm.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>كلمة المرور</FormLabel>
                                            <FormControl>
                                                <Input type="password" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                {authError && <p className="text-sm font-medium text-destructive">{authError}</p>}
                                <Button type="submit" disabled={loading} className="w-full">
                                    <LogIn className="w-4 h-4 ml-2" />
                                    {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
                                </Button>
                            </form>
                        </Form>
                    </TabsContent>
                    <TabsContent value="signup">
                        <Form {...signupForm}>
                            <form onSubmit={signupForm.handleSubmit(onSignupSubmit)} className="space-y-4 mt-4">
                               <FormField
                                    control={signupForm.control}
                                    name="displayName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>الاسم</FormLabel>
                                            <FormControl>
                                                <Input placeholder="اسمك الكامل" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={signupForm.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>البريد الإلكتروني</FormLabel>
                                            <FormControl>
                                                <Input type="email" placeholder="email@example.com" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={signupForm.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>كلمة المرور</FormLabel>
                                            <FormControl>
                                                <Input type="password" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                {authError && <p className="text-sm font-medium text-destructive">{authError}</p>}
                                <Button type="submit" disabled={loading} className="w-full">
                                    <UserPlus className="w-4 h-4 ml-2" />
                                    {loading ? 'جاري الإنشاء...' : 'إنشاء حساب'}
                                </Button>
                            </form>
                        </Form>
                    </TabsContent>
                </Tabs>
                 <div className="mt-6 flex items-center justify-center text-xs text-muted-foreground">
                    <Lock className="w-3 h-3 ml-2" />
                    <span>بياناتك مؤمنة ومشفرة. خصوصيتك هي أولويتنا.</span>
                </div>
            </CardContent>
        </Card>
    );
};


const ProfilePage = () => {
  const { user, loading: userLoading } = useUser();
  const firestore = useFirestore();

  const resultsQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return query(collection(firestore, `users/${user.uid}/exerciseResults`), orderBy('completedAt', 'desc'));
  }, [user, firestore]);

  const { data: results, isLoading: resultsLoading } = useCollection(resultsQuery);

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
        <AuthForm />
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
                        {user.displayName?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                </Avatar>
                <div>
                    <CardTitle className="font-headline text-4xl">{user.displayName || 'مستخدم جديد'}</CardTitle>
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
