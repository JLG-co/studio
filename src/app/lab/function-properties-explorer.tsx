'use client'

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, BrainCircuit, LineChart, CheckCircle2 } from "lucide-react";
import { analyzeFunctionProperties, FunctionAnalysisInput, FunctionAnalysisOutput } from "@/ai/flows/function-properties-flow";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";

const FunctionPropertiesExplorer = () => {
    const [func, setFunc] = useState('x^2 - 4*x + 3');
    const [domain, setDomain] = useState('[-10, 10]');
    const [result, setResult] = useState<FunctionAnalysisOutput | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleAnalyze = async () => {
        setLoading(true);
        setError('');
        setResult(null);

        const input: FunctionAnalysisInput = {
            functionStr: func,
            domainStr: domain
        }

        try {
            const analysis = await analyzeFunctionProperties(input);
            setResult(analysis);
        } catch (err) {
            console.error(err);
            setError("حدث خطأ أثناء تحليل الدالة. يرجى التحقق من الصيغة والمجال والمحاولة مرة أخرى.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <CardHeader className="text-center">
                 <div className="flex justify-center items-center mb-4">
                    <LineChart className="w-12 h-12 text-primary" />
                </div>
                <CardTitle className="font-headline text-2xl">مستكشف خواص الدوال</CardTitle>
                <CardDescription>
                    أدخل دالة رياضية ومجال تعريفها، وسيقوم الذكاء الاصطناعي بتحليلها وتوفير جدول التغيرات.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <div className="space-y-2">
                        <Label htmlFor="function-input">الدالة f(x)</Label>
                        <Input 
                            id="function-input"
                            dir="ltr" 
                            value={func} 
                            onChange={(e) => setFunc(e.target.value)} 
                            placeholder="e.g., x^3 - 3*x"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="domain-input">المجال</Label>
                        <Input 
                            id="domain-input"
                            dir="ltr" 
                            value={domain} 
                            onChange={(e) => setDomain(e.target.value)} 
                            placeholder="e.g., [-5, 5]"
                        />
                    </div>
                    <Button onClick={handleAnalyze} disabled={loading} className="w-full">
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <BrainCircuit className="mr-2 h-4 w-4" />}
                        حلل الدالة
                    </Button>
                </div>

                {error && <Alert variant="destructive"><AlertTitle>خطأ</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}

                {loading && (
                    <div className="space-y-4">
                        <Skeleton className="h-8 w-1/3" />
                        <Skeleton className="h-32 w-full" />
                        <Skeleton className="h-8 w-1/4" />
                        <Skeleton className="h-24 w-full" />
                    </div>
                )}

                {result && (
                    <div className="space-y-6 pt-6 border-t border-white/10">
                        <div>
                            <h3 className="font-headline text-xl text-primary mb-2">التحليل</h3>
                            <div className="space-y-2 bg-gray-900/50 p-4 rounded-md">
                                {result.analysis.map((item, index) => (
                                <div key={index} className="flex items-start gap-2">
                                    <CheckCircle2 className="h-5 w-5 text-green-400 mt-1 flex-shrink-0"/>
                                    <p className="text-slate-300">{item}</p>
                                </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="font-headline text-xl text-primary mb-2">جدول التغيرات</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-center border-collapse">
                                    <thead>
                                        <tr className="bg-muted/30">
                                            {result.variationTable.headers.map((header, index) => (
                                                <th key={index} className="p-2 border border-cyan-300/20">{header}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {result.variationTable.rows.map((row, rowIndex) => (
                                            <tr key={rowIndex}>
                                                {row.map((cell, cellIndex) => (
                                                    <td key={cellIndex} className="p-2 border border-cyan-300/20 font-mono">{cell}</td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </>
    );
};

export default FunctionPropertiesExplorer;
