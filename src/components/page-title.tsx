import { cn } from "@/lib/utils";

type PageTitleProps = {
  title: string;
  subtitle?: string;
  className?: string;
};

const PageTitle = ({ title, subtitle, className }: PageTitleProps) => {
  return (
    <div className={cn("text-center mb-12 space-y-2", className)}>
      <h1 className="text-4xl md:text-5xl font-headline font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400">
        {title}
      </h1>
      {subtitle && (
        <p className="text-lg text-slate-400 max-w-2xl mx-auto">{subtitle}</p>
      )}
    </div>
  );
};

export default PageTitle;
