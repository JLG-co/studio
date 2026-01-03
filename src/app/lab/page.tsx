'use client';
import PageTitle from "@/components/page-title";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NeonGrapher from "./neon-grapher";
import DeltaSolver from "./delta-solver";
import BarycenterCalculator from "./barycenter-calculator";
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
      <Tabs defaultValue="grapher" className="w-full">
        <TabsList className="grid w-full grid-cols-6 bg-white/5 border border-cyan-300/10">
          <TabsTrigger value="grapher" className="font-headline">راسم الدوال</TabsTrigger>
          <TabsTrigger value="solver" className="font-headline">حل معادلة الدرجة الثانية</TabsTrigger>
          <TabsTrigger value="barycenter" className="font-headline">حساب المرجح</TabsTrigger>
          <TabsTrigger value="properties" className="font-headline">خواص الدوال</TabsTrigger>
          <TabsTrigger value="lesson-plan" className="font-headline">مولد الخطط</TabsTrigger>
          <TabsTrigger value="summarizer" className="font-headline">ملخص المقالات</TabsTrigger>
        </TabsList>
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
        <TabsContent value="properties">
          <div className={glassCardClasses}>
            <FunctionPropertiesExplorer />
          </div>
        </TabsContent>
        <TabsContent value="lesson-plan">
          <div className={glassCardClasses}>
            <LessonPlanGenerator />
          </div>
        </TabsContent>
        <TabsContent value="summarizer">
          <div className={glassCardClasses}>
            <ArticleSummarizer />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default LabPage;
