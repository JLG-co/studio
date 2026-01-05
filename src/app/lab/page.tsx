'use client';
import PageTitle from "@/components/page-title";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NeonGrapher from "./neon-grapher";
import DeltaSolver from "./delta-solver";
import BarycenterCalculator from "./barycenter-calculator";
import MathChatbot from "./math-chatbot";
import FunctionPropertiesExplorer from "./function-properties-explorer";
import LessonPlanGenerator from "./lesson-plan-generator";
import ArticleSummarizer from "./article-summarizer";

const glassCardClasses = 'bg-white/5 backdrop-blur-lg border border-cyan-300/10 rounded-2xl shadow-lg mt-6';

const LabPage = () => {
  return (
    <div>
      <PageTitle 
        title="مختبر الحساب"
        subtitle="مجموعة من الأدوات التفاعلية لمساعدتك على تصور وحل المشكلات الرياضية المعقدة."
      />
      <Tabs defaultValue="chatbot" className="w-full">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 lg:grid-cols-7 bg-white/5 border border-cyan-300/10 h-auto flex-wrap">
          <TabsTrigger value="chatbot" className="font-headline py-2">رفيقك الذكي</TabsTrigger>
          <TabsTrigger value="function-explorer" className="font-headline py-2">مستكشف الدوال</TabsTrigger>
          <TabsTrigger value="lesson-generator" className="font-headline py-2">مولد خطط الدروس</TabsTrigger>
          <TabsTrigger value="article-summarizer" className="font-headline py-2">ملخص المقالات</TabsTrigger>
          <TabsTrigger value="grapher" className="font-headline py-2">راسم الدوال</TabsTrigger>
          <TabsTrigger value="solver" className="font-headline py-2">حل معادلة الدرجة الثانية</TabsTrigger>
          <TabsTrigger value="barycenter" className="font-headline py-2">حساب المرجح</TabsTrigger>
        </TabsList>
        <TabsContent value="chatbot">
          <div className={glassCardClasses}>
            <MathChatbot />
          </div>
        </TabsContent>
        <TabsContent value="function-explorer">
          <div className={glassCardClasses}>
            <FunctionPropertiesExplorer />
          </div>
        </TabsContent>
        <TabsContent value="lesson-generator">
          <div className={glassCardClasses}>
            <LessonPlanGenerator />
          </div>
        </TabsContent>
         <TabsContent value="article-summarizer">
          <div className={glassCardClasses}>
            <ArticleSummarizer />
          </div>
        </TabsContent>
        <TabsContent value="grapher">
          <div className={glassCardClasses}>
            <NeonGrapher />
          </div>
        </TabsContent>
        <TabsContent value="solver">
          <div className={glassCardClasses}>
            <DeltaSolver />
          </div>
        </TabsContent>
        <TabsContent value="barycenter">
          <div className={glassCardClasses}>
            <BarycenterCalculator />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default LabPage;
