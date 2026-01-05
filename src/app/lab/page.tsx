'use client';
import PageTitle from "@/components/page-title";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NeonGrapher from "./neon-grapher";
import DeltaSolver from "./delta-solver";
import BarycenterCalculator from "./barycenter-calculator";

const glassCardClasses = 'bg-white/5 backdrop-blur-lg border border-cyan-300/10 rounded-2xl shadow-lg mt-6';

const LabPage = () => {
  return (
    <div>
      <PageTitle 
        title="مختبر الحساب"
        subtitle="مجموعة من الأدوات التفاعلية لمساعدتك على تصور وحل المشكلات الرياضية المعقدة."
      />
      <Tabs defaultValue="grapher" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-white/5 border border-cyan-300/10 h-auto flex-wrap">
          <TabsTrigger value="grapher" className="font-headline py-2">راسم الدوال</TabsTrigger>
          <TabsTrigger value="solver" className="font-headline py-2">حل معادلة الدرجة الثانية</TabsTrigger>
          <TabsTrigger value="barycenter" className="font-headline py-2">حساب المرجح</TabsTrigger>
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
      </Tabs>
    </div>
  );
}

export default LabPage;
