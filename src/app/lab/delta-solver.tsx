'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

interface Solution {
  delta: number;
  message: string;
  solutions: string[];
  steps: string[];
}

const DeltaSolver = () => {
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const [c, setC] = useState('');
  const [solution, setSolution] = useState<Solution | null>(null);

  const solveEquation = () => {
    const numA = parseFloat(a);
    const numB = parseFloat(b);
    const numC = parseFloat(c);

    if (isNaN(numA) || isNaN(numB) || isNaN(numC)) {
      setSolution({
        delta: 0,
        message: 'الرجاء إدخال قيم عددية صالحة للمعاملات a, b, c.',
        solutions: [],
        steps: [],
      });
      return;
    }
    
    if (numA === 0) {
      setSolution({
        delta: 0,
        message: 'المعامل a لا يمكن أن يكون صفرًا في معادلة من الدرجة الثانية.',
        solutions: [],
        steps: [],
      });
      return;
    }

    const delta = numB * numB - 4 * numA * numC;
    let steps: string[] = [
      `نحسب المميز Δ: Δ = b² - 4ac`,
      `Δ = (${numB})² - 4 * (${numA}) * (${numC})`,
      `Δ = ${numB * numB} - ${4 * numA * numC}`,
      `Δ = ${delta}`
    ];
    let message = '';
    let solutions: string[] = [];

    if (delta > 0) {
      const x1 = (-numB - Math.sqrt(delta)) / (2 * numA);
      const x2 = (-numB + Math.sqrt(delta)) / (2 * numA);
      message = 'Δ > 0، للمعادلة حلان حقيقيان متمايزان.';
      solutions = [`x₁ = ${x1.toFixed(3)}`, `x₂ = ${x2.toFixed(3)}`];
      steps.push(`بما أن Δ > 0، فإن للمعادلة حلين:`);
      steps.push(`x₁ = (-b - √Δ) / 2a = (-${numB} - √${delta}) / (2 * ${numA}) = ${x1.toFixed(3)}`);
      steps.push(`x₂ = (-b + √Δ) / 2a = (-${numB} + √${delta}) / (2 * ${numA}) = ${x2.toFixed(3)}`);
    } else if (delta === 0) {
      const x0 = -numB / (2 * numA);
      message = 'Δ = 0، للمعادلة حل حقيقي مضاعف.';
      solutions = [`x₀ = ${x0.toFixed(3)}`];
      steps.push(`بما أن Δ = 0، فإن للمعادلة حل مضاعف:`);
      steps.push(`x₀ = -b / 2a = -(${numB}) / (2 * ${numA}) = ${x0.toFixed(3)}`);
    } else {
      message = 'Δ < 0، المعادلة ليس لها حلول حقيقية.';
      solutions = [];
      steps.push(`بما أن Δ < 0، فإن المعادلة لا تقبل حلولاً في مجموعة الأعداد الحقيقية.`);
    }

    setSolution({ delta, message, solutions, steps });
  };

  return (
    <>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">حل معادلة من الدرجة الثانية</CardTitle>
        <CardDescription>أدخل معاملات المعادلة <code>ax² + bx + c = 0</code> للحصول على الحلول خطوة بخطوة.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="space-y-2">
            <Label htmlFor="a">المعامل a</Label>
            <Input dir="ltr" id="a" value={a} onChange={(e) => setA(e.target.value)} placeholder="e.g., 1" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="b">المعامل b</Label>
            <Input dir="ltr" id="b" value={b} onChange={(e) => setB(e.target.value)} placeholder="e.g., -3" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="c">المعامل c</Label>
            <Input dir="ltr" id="c" value={c} onChange={(e) => setC(e.target.value)} placeholder="e.g., 2" />
          </div>
          <Button onClick={solveEquation} className="w-full">حل المعادلة</Button>
        </div>

        {solution && (
          <div className="space-y-6 pt-6 border-t border-white/10">
            <div>
              <h3 className="font-headline text-xl text-primary mb-2">النتائج</h3>
              <p className="text-lg">{solution.message}</p>
              <div className="flex gap-4 mt-2">
                {solution.solutions.map((sol, index) => (
                  <div key={index} className="bg-primary/20 text-primary-foreground font-mono text-lg p-3 rounded-md">
                    {sol}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-headline text-xl text-primary mb-2">خطوات الحل</h3>
              <div className="space-y-2 bg-gray-900/50 p-4 rounded-md">
                {solution.steps.map((step, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-400 mt-1 flex-shrink-0"/>
                    <p className="text-slate-300">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </>
  );
};

export default DeltaSolver;
