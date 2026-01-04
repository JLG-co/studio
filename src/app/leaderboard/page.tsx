'use client';

import PageTitle from '@/components/page-title';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Crown, LogIn, Medal, Trophy } from 'lucide-react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { leaderboardUsers } from '@/lib/data';

const glassCardClasses =
  'bg-white/5 backdrop-blur-lg border border-cyan-300/10 rounded-2xl shadow-lg';

const getRankIcon = (rank: number) => {
  if (rank === 1) return <Crown className="w-6 h-6 text-yellow-400" />;
  if (rank === 2) return <Medal className="w-6 h-6 text-slate-400" />;
  if (rank === 3) return <Trophy className="w-6 h-6 text-amber-600" />;
  return (
    <span className="font-bold text-lg text-slate-400 w-6 text-center">
      {rank}
    </span>
  );
};

const LeaderboardPage = () => {
    const { user, loading: userLoading } = useUser();
    const firestore = useFirestore();

    const leaderboardQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return query(
            collection(firestore, 'users'),
            orderBy('score', 'desc'),
            limit(15)
        );
    }, [firestore]);

    const { data: users, isLoading: usersLoading } = useCollection(leaderboardQuery);

    const loading = userLoading || usersLoading;

    if (userLoading) {
        return (
            <div>
                <PageTitle
                    title="قائمة المتصدرين"
                    subtitle="شاهد ترتيب أفضل الطلاب وتنافس لتكون في القمة!"
                />
                <Card className={glassCardClasses}>
                    <CardHeader>
                        <CardTitle className="text-2xl font-headline text-center">
                          أفضل 15 طالبًا
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Skeleton className='h-64 w-full' />
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (!user) {
        return (
             <div>
                <PageTitle
                    title="قائمة المتصدرين"
                    subtitle="شاهد ترتيب أفضل الطلاب وتنافس لتكون في القمة!"
                />
                <Card className={`${glassCardClasses} text-center`}>
                     <CardHeader>
                        <CardTitle className="text-2xl font-headline">
                           ميزة حصرية للأعضاء
                        </CardTitle>
                        <CardDescription>
                            يجب عليك تسجيل الدخول لعرض قائمة المتصدرين.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild>
                           <Link href="/profile">
                                <LogIn className="ml-2 h-4 w-4" />
                                تسجيل الدخول
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }


  return (
    <div>
      <PageTitle
        title="قائمة المتصدرين"
        subtitle="شاهد ترتيب أفضل الطلاب وتنافس لتكون في القمة!"
      />
      <Card className={glassCardClasses}>
        <CardHeader>
          <CardTitle className="text-2xl font-headline text-center">
            أفضل 15 طالبًا
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-cyan-300/20">
                <TableHead className="w-[100px] text-right">الترتيب</TableHead>
                <TableHead className="text-right">الاسم</TableHead>
                <TableHead className="text-right">النقاط</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && Array.from({length: 10}).map((_, i) => (
                <TableRow key={i} className='border-cyan-300/10'>
                  <TableCell><Skeleton className='h-8 w-8' /></TableCell>
                  <TableCell><div className='flex items-center gap-4'><Skeleton className='h-10 w-10 rounded-full' /><Skeleton className='h-6 w-32' /></div></TableCell>
                  <TableCell><Skeleton className='h-6 w-16' /></TableCell>
                </TableRow>
              ))}
              {!loading && users && users.map((u: any, index) => (
                <TableRow
                  key={u.id}
                  className={`border-cyan-300/10 ${
                    index < 3 ? 'bg-primary/10' : ''
                  } ${u.id === user.uid ? 'bg-primary/20' : ''}`}
                >
                  <TableCell>
                    <div className="flex items-center justify-start gap-4">
                      {getRankIcon(index + 1)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-4">
                      <Avatar className="h-10 w-10 border-2 border-primary/50">
                        <AvatarImage src={u.avatarUrl || ''} alt={u.displayName} data-ai-hint="avatar person" />
                        <AvatarFallback>
                          {u.displayName?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-white">{u.displayName}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-bold text-lg text-primary">
                    {u.score?.toLocaleString() || 0}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeaderboardPage;
