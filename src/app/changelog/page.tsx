'use client';

import PageTitle from '@/components/page-title';
import { changelog } from '@/lib/changelog';
import { Badge } from '@/components/ui/badge';
import { GitCommit, Bug, Wand2, PlusCircle } from 'lucide-react';

const glassCardClasses =
  'bg-white/5 backdrop-blur-lg border border-cyan-300/10 rounded-2xl shadow-lg';
  
const getChangeTypeInfo = (type: 'new' | 'fix' | 'improvement') => {
  switch (type) {
    case 'new':
      return { icon: <PlusCircle className="w-4 h-4" />, text: 'جديد', color: 'text-green-400' };
    case 'fix':
      return { icon: <Bug className="w-4 h-4" />, text: 'إصلاح', color: 'text-yellow-400' };
    case 'improvement':
      return { icon: <Wand2 className="w-4 h-4" />, text: 'تحسين', color: 'text-blue-400' };
  }
};


const ChangelogPage = () => {
  return (
    <div className="space-y-12">
      <PageTitle
        title="سجل التغييرات"
        subtitle="تتبع جميع الميزات الجديدة والتحديثات والتحسينات في Math Companion Pro."
      />
      <div className="relative pl-8 border-r-2 border-primary/20">
        {changelog.map((entry, index) => (
          <div key={entry.version} className="mb-12">
             <div className="absolute w-8 h-8 bg-primary rounded-full -right-4 flex items-center justify-center ring-8 ring-background">
                <GitCommit className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className={`${glassCardClasses} p-6`}>
                <p className="text-sm text-slate-400 mb-2">{entry.date}</p>
                <h2 className="text-2xl font-headline font-bold text-white mb-1">
                    {entry.title}
                </h2>
                <Badge variant="outline" className="mb-4">الإصدار {entry.version}</Badge>
                
                <ul className="space-y-3">
                    {entry.changes.map((change, i) => {
                        const { icon, text, color } = getChangeTypeInfo(change.type);
                        return (
                             <li key={i} className="flex items-start gap-4">
                                <span className={`flex-shrink-0 flex items-center gap-2 font-semibold ${color}`}>
                                    {icon}
                                    {text}
                                </span>
                                <p className="text-slate-300">{change.description}</p>
                            </li>
                        )
                    })}
                </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChangelogPage;
