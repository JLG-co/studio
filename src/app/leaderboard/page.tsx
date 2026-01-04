import PageTitle from "@/components/page-title";
import { leaderboardUsers } from "@/lib/data";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Crown, Medal, Trophy } from "lucide-react";

const glassCardClasses =
  "bg-white/5 backdrop-blur-lg border border-cyan-300/10 rounded-2xl shadow-lg";

const getRankIcon = (rank: number) => {
  if (rank === 1) return <Crown className="w-6 h-6 text-yellow-400" />;
  if (rank === 2) return <Medal className="w-6 h-6 text-slate-400" />;
  if (rank === 3) return <Trophy className="w-6 h-6 text-amber-600" />;
  return <span className="font-bold text-lg text-slate-400 w-6 text-center">{rank}</span>;
};

const LeaderboardPage = () => {
  return (
    <div>
      <PageTitle
        title="قائمة المتصدرين"
        subtitle="شاهد ترتيب أفضل الطلاب وتنافس لتكون في القمة!"
      />
      <Card className={glassCardClasses}>
        <CardHeader>
          <CardTitle className="text-2xl font-headline text-center">
            أفضل 16 طالبًا
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
              {leaderboardUsers.map((user, index) => (
                <TableRow
                  key={user.id}
                  className={`border-cyan-300/10 ${
                    index < 3 ? "bg-primary/10" : ""
                  }`}
                >
                  <TableCell>
                    <div className="flex items-center justify-start gap-4">
                      {getRankIcon(user.rank)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-4">
                      <Avatar className="h-10 w-10 border-2 border-primary/50">
                        <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint="avatar person" />
                        <AvatarFallback>
                          {user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-white">{user.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-bold text-lg text-primary">
                    {user.score.toLocaleString()}
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
