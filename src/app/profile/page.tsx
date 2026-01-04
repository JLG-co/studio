'use client';

import { useState } from 'react';
import PageTitle from '@/components/page-title';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogIn, LogOut, UserPlus, BarChart, Lock, Mail } from 'lucide-react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { signInWithEmail, signUpWithEmail, signOutUser, sendPasswordReset, signInWithGoogle, signInWithApple } from '@/firebase/auth/auth-service';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Separator } from '@/components/ui/separator';

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

const resetPasswordSchema = z.object({
    email: z.string().email({ message: "البريد الإلكتروني غير صالح" }),
});

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px" {...props}>
        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C42.022,35.244,44,30.036,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
    </svg>
);

const AppleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24px" height="24px" {...props}>
        <path d="M18.66,20.337C17.49,21.43,16.14,22,14.58,22c-1.5,0-2.48-0.9-3.95-0.9c-1.46,0-2.58,0.9-3.95,0.9 c-1.52,0-2.93-0.54-4.09-1.63c-1.58-1.48-2.39-3.66-2.43-5.8c0.04-2.5,1.25-4.6,3.13-5.75c1.19-0.72,2.61-1.12,4.03-1.12 c1.4,0,2.5,0.48,3.71,0.48c1.19,0,2.5-0.52,4.03-0.52c1.32,0,2.68,0.38,3.81,1.05c-1.74,1.1-2.94,3.1-2.9,5.2 C15.63,17.48,16.8,19.26,18.66,20.337z M14.85,6.537c0.82-1.02,1.35-2.4,1.21-3.79c-1.25,0.08-2.67,0.85-3.56,1.86 c-0.84,0.95-1.47,2.36-1.32,3.71C12.44,8.397,13.92,7.637,14.85,6.537z" />
    </svg>
);

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
    
    const resetPasswordForm = useForm<z.infer<typeof resetPasswordSchema>>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: { email: "" },
    });

    const handleSocialLogin = async (provider: 'google' | 'apple') => {
        setLoading(true);
        setAuthError(null);
        try {
            if (provider === 'google') {
                await signInWithGoogle();
            } else {
                await signInWithApple();
            }
        } catch (error: any) {
            console.error("Social login error:", error);
            if (error.code === 'auth/account-exists-with-different-credential') {
                setAuthError("يوجد حساب بالفعل بهذا البريد الإلكتروني ولكن ببيانات اعتماد مختلفة.");
            } else {
                setAuthError("فشل تسجيل الدخول. يرجى المحاولة مرة أخرى.");
            }
        } finally {
            setLoading(false);
        }
    }

    const onLoginSubmit = async (values: z.infer<typeof loginSchema>) => {
        setLoading(true);
        setAuthError(null);
        try {
            await signInWithEmail(values.email, values.password);
        } catch (error: any) {
            if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
                setAuthError("لا يوجد حساب مسجل بهذا البريد الإلكتروني. هل تريد إنشاء حساب جديد؟");
            } else {
                setAuthError("فشل تسجيل الدخول. يرجى التحقق من بريدك الإلكتروني وكلمة المرور.");
            }
            console.error("Login error:", error);
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
                description: "تم إرسال بريد إلكتروني للتحقق. يرجى التحقق من بريدك الوارد.",
            });
        } catch (error: any) {
             if (error.code === 'auth/email-already-in-use') {
                setAuthError("هذا البريد الإلكتروني مستخدم بالفعل. حاول تسجيل الدخول بدلاً من ذلك.");
            } else {
                const message = (error.message || "فشل إنشاء الحساب. يرجى المحاولة مرة أخرى.").replace("Firebase: ", "");
                setAuthError(message);
            }
            console.error("Signup error:", error);
        } finally {
            setLoading(false);
        }
    };
    
    const onPasswordResetSubmit = async (values: z.infer<typeof resetPasswordSchema>) => {
        setLoading(true);
        try {
            await sendPasswordReset(values.email);
            toast({
                title: "تم إرسال طلب إعادة التعيين",
                description: "إذا كان هناك حساب مرتبط بهذا البريد الإلكتروني، فستصلك رسالة لإعادة تعيين كلمة المرور.",
            });
            return true; // To close the dialog
        } catch (error) {
            console.error("Password reset error:", error);
            toast({
                variant: 'destructive',
                title: "حدث خطأ",
                description: "لم نتمكن من إرسال بريد إعادة التعيين. يرجى المحاولة مرة أخرى.",
            });
            return false; // To keep dialog open
        } finally {
            setLoading(false);
        }
    }

    return (
        <Card className={`${glassCardClasses} max-w-md mx-auto`}>
            <CardHeader className='text-center'>
                <CardTitle className="font-headline text-3xl">صفحة الملف الشخصي</CardTitle>
                <CardDescription>
                    قم بتسجيل الدخول أو إنشاء حساب جديد لتتبع تقدمك.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" onClick={() => handleSocialLogin('google')} disabled={loading}>
                        <GoogleIcon className="mr-2" /> Google
                    </Button>
                    <Button variant="outline" onClick={() => handleSocialLogin('apple')} disabled={loading}>
                        <AppleIcon className="mr-2" /> Apple
                    </Button>
                </div>

                <div className="my-4 flex items-center">
                    <Separator className="flex-1" />
                    <span className="px-4 text-xs text-muted-foreground">أو أكمل بواسطة</span>
                    <Separator className="flex-1" />
                </div>
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
                                <div className="flex items-center justify-between">
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button type="button" variant="link" className="p-0 h-auto">هل نسيت كلمة المرور؟</Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <Form {...resetPasswordForm}>
                                            <form onSubmit={resetPasswordForm.handleSubmit(async (values) => {
                                                const success = await onPasswordResetSubmit(values);
                                                // This is a bit of a hack to close the dialog.
                                                // We rely on the button to be of type "button" to prevent form submission
                                                // and manually click the cancel button.
                                                if (success) {
                                                    document.getElementById('reset-password-cancel')?.click();
                                                }
                                            })}>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>إعادة تعيين كلمة المرور</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        أدخل بريدك الإلكتروني المسجل لإرسال رابط إعادة تعيين كلمة المرور.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <div className="py-4">
                                                    <FormField
                                                        control={resetPasswordForm.control}
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
                                                </div>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel id="reset-password-cancel">إلغاء</AlertDialogCancel>
                                                    <Button type="submit" disabled={loading}>
                                                        {loading ? "جاري الإرسال..." : "إرسال"}
                                                    </Button>
                                                </AlertDialogFooter>
                                                </form>
                                            </Form>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
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
            <div className="flex flex-wrap items-center gap-4 justify-between">
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
                 {!user.emailVerified && (
                    <div className='text-sm text-yellow-400 bg-yellow-400/10 border border-yellow-400/50 rounded-md p-3 flex items-center gap-2'>
                        <Mail className='w-4 h-4'/>
                        <span>بريدك الإلكتروني غير مُفعَّل. يرجى التحقق من صندوق الوارد الخاص بك.</span>
                    </div>
                )}
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

    