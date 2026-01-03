'use client';

import { useState, useMemo } from 'react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';

const NeonGrapher = () => {
  const [expression, setExpression] = useState('x^2');
  const [inputError, setInputError] = useState('');
  const [currentExpression, setCurrentExpression] = useState('x^2');
  const { toast } = useToast();

  const data = useMemo(() => {
    const points = [];
    setInputError('');
    if (!currentExpression) return [];

    try {
      // Note: Using a more robust math parsing library would be better for production.
      // This is a simplified implementation.
      const sanitizedExpression = currentExpression
        .replace(/\^/g, '**')
        .replace(/sin/g, 'Math.sin')
        .replace(/cos/g, 'Math.cos')
        .replace(/tan/g, 'Math.tan')
        .replace(/sqrt/g, 'Math.sqrt')
        .replace(/pi/g, 'Math.PI');

      for (let i = -100; i <= 100; i++) {
        const x = i / 10;
        // Using new Function for safer evaluation than eval()
        const y = new Function('x', `return ${sanitizedExpression}`)(x);
        if (isFinite(y)) {
          points.push({ x, y });
        }
      }
    } catch (error) {
      setInputError('الدالة المدخلة غير صحيحة. يرجى التحقق من الصيغة.');
      return [];
    }
    return points;
  }, [currentExpression]);
  
  const handlePlot = () => {
    if (!expression) {
       toast({
        variant: "destructive",
        title: "خطأ",
        description: "الرجاء إدخال دالة لرسمها.",
      });
      return;
    }
    setCurrentExpression(expression);
  };

  return (
    <>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">راسم الدوال النيوني</CardTitle>
        <CardDescription>أدخل دالة للمتغير x لرسم بيانها. مثال: <code>2*x^3 - x^2 + 5</code> أو <code>sin(x)</code></CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex w-full max-w-lg mx-auto items-center space-x-2 space-x-reverse">
          <Input 
            dir="ltr"
            type="text" 
            value={expression}
            onChange={(e) => setExpression(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handlePlot()}
            placeholder="e.g., x^3 - 2*x"
            className="text-left"
          />
          <Button onClick={handlePlot}>ارسم</Button>
        </div>

        {inputError && (
          <Alert variant="destructive">
            <Terminal className="h-4 w-4" />
            <AlertTitle>خطأ في الصيغة</AlertTitle>
            <AlertDescription>{inputError}</AlertDescription>
          </Alert>
        )}

        <div className="w-full h-[400px] bg-gray-900/50 rounded-lg p-4 border border-blue-900">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid stroke="hsl(220, 40%, 20%)" />
              <XAxis dataKey="x" stroke="hsl(220, 40%, 70%)" type="number" domain={['auto', 'auto']} />
              <YAxis stroke="hsl(220, 40%, 70%)" domain={['auto', 'auto']} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--background) / 0.8)',
                  borderColor: 'hsl(var(--primary))',
                  color: 'hsl(var(--foreground))',
                }}
                labelStyle={{ fontWeight: 'bold' }}
              />
              <Line 
                type="monotone" 
                dataKey="y" 
                stroke="hsl(var(--primary))" 
                strokeWidth={3} 
                dot={false}
                isAnimationActive={true}
                animationDuration={1000}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </>
  );
};

export default NeonGrapher;
