'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { PlusCircle, Trash2, MapPin } from 'lucide-react';

interface Point {
  x: string;
  y: string;
  weight: string;
}

interface Barycenter {
  x: number;
  y: number;
}

const BarycenterCalculator = () => {
  const [points, setPoints] = useState<Point[]>([
    { x: '1', y: '2', weight: '1' },
    { x: '4', y: '1', weight: '2' },
  ]);
  const [barycenter, setBarycenter] = useState<Barycenter | null>(null);

  const handlePointChange = (index: number, field: keyof Point, value: string) => {
    const newPoints = [...points];
    newPoints[index][field] = value;
    setPoints(newPoints);
  };

  const addPoint = () => {
    setPoints([...points, { x: '', y: '', weight: '1' }]);
  };

  const removePoint = (index: number) => {
    const newPoints = points.filter((_, i) => i !== index);
    setPoints(newPoints);
  };

  const calculateBarycenter = () => {
    let sumWeights = 0;
    let sumX = 0;
    let sumY = 0;
    let valid = true;

    points.forEach(p => {
      const x = parseFloat(p.x);
      const y = parseFloat(p.y);
      const w = parseFloat(p.weight);

      if (isNaN(x) || isNaN(y) || isNaN(w)) {
        valid = false;
        return;
      }
      sumWeights += w;
      sumX += x * w;
      sumY += y * w;
    });

    if (!valid || sumWeights === 0) {
      setBarycenter(null);
      // You can add a toast notification here for invalid input
      return;
    }

    setBarycenter({ x: sumX / sumWeights, y: sumY / sumWeights });
  };


  return (
    <>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">حساب المرجح</CardTitle>
        <CardDescription>أدخل إحداثيات النقاط ومعاملاتها لحساب إحداثيات نقطة المرجح.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {points.map((point, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center p-4 bg-gray-900/30 rounded-lg">
              <Label className="md:col-span-1">النقطة {index + 1}</Label>
              <div className="grid grid-cols-3 gap-2 md:col-span-3">
                <Input dir="ltr" value={point.x} onChange={(e) => handlePointChange(index, 'x', e.target.value)} placeholder="x" />
                <Input dir="ltr" value={point.y} onChange={(e) => handlePointChange(index, 'y', e.target.value)} placeholder="y" />
                <Input dir="ltr" value={point.weight} onChange={(e) => handlePointChange(index, 'weight', e.target.value)} placeholder="المعامل" />
              </div>
              {points.length > 2 &&
                <div className="md:col-start-1">
                  <Button variant="destructive" size="sm" onClick={() => removePoint(index)}>
                    <Trash2 className="w-4 h-4 ml-2" />
                    حذف
                  </Button>
                </div>
              }
            </div>
          ))}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
            <Button variant="outline" onClick={addPoint}>
              <PlusCircle className="w-4 h-4 ml-2" />
              إضافة نقطة
            </Button>
            <Button onClick={calculateBarycenter} className="flex-grow">
              احسب المرجح
            </Button>
        </div>


        {barycenter && (
          <div className="pt-6 border-t border-white/10">
            <h3 className="font-headline text-xl text-primary mb-2">إحداثيات المرجح G</h3>
            <div className="flex items-center gap-4 bg-primary/20 text-primary-foreground font-mono text-xl p-4 rounded-md">
              <MapPin className="w-8 h-8"/>
              <span>G = ({barycenter.x.toFixed(3)}, {barycenter.y.toFixed(3)})</span>
            </div>
          </div>
        )}
      </CardContent>
    </>
  );
};

export default BarycenterCalculator;
