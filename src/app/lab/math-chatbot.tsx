'use client';

import { useState, useRef, useEffect, FormEvent } from 'react';
import { useUser } from '@/firebase';
import { mathChat } from '@/ai/flows/math-chat-flow';
import { type MathChatInput } from '@/ai/flows/types';
import { Button } from '@/components/ui/button';
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, User, Bot, CornerDownLeft, BrainCircuit } from 'lucide-react';
import { marked } from 'marked';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Message {
  role: 'user' | 'bot';
  content: string;
}

const MathChatbot = () => {
  const { user } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const chatInput: MathChatInput = {
        history: messages.map(msg => ({ role: msg.role, content: msg.content })),
        query: input,
      };
      
      const response = await mathChat(chatInput);
      
      const botMessage: Message = { role: 'bot', content: response.answer };
      setMessages((prev) => [...prev, botMessage]);

    } catch (error) {
      console.error('Error calling mathChat flow:', error);
      const errorMessage: Message = { role: 'bot', content: 'عذراً، حدث خطأ أثناء محاولة الإجابة على سؤالك. الرجاء المحاولة مرة أخرى.' };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <CardHeader className="text-center">
        <div className="flex justify-center items-center mb-4">
            <BrainCircuit className="w-12 h-12 text-primary" />
        </div>
        <CardTitle className="font-headline text-2xl">رفيقك الذكي في الرياضيات</CardTitle>
        <CardDescription>
            هل لديك سؤال في الرياضيات؟ أو تحتاج مساعدة في فهم مفهوم ما؟ اسألني أي شيء!
            <br />
            <span className="text-xs text-muted-foreground">(ملاحظة: قد تكون الإجابات غير دقيقة أحيانًا. تحقق دائمًا من المعلومات الهامة.)</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[500px] flex flex-col">
            <div className="flex-1 overflow-y-auto pr-4 space-y-6">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex items-start gap-4 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                         {msg.role === 'bot' && (
                             <Avatar className="w-10 h-10 border-2 border-primary/50">
                                <AvatarFallback><Bot /></AvatarFallback>
                            </Avatar>
                         )}
                        <div className={`rounded-2xl p-4 max-w-xl ${
                            msg.role === 'user'
                            ? 'bg-primary text-primary-foreground rounded-br-none'
                            : 'bg-muted/50 rounded-bl-none'
                        }`}>
                            <div 
                                className="prose prose-sm prose-invert max-w-none text-current"
                                dangerouslySetInnerHTML={{ __html: marked(msg.content) }}
                            />
                        </div>
                        {msg.role === 'user' && (
                             <Avatar className="w-10 h-10">
                                <AvatarImage src={user?.photoURL || ''} />
                                <AvatarFallback><User /></AvatarFallback>
                            </Avatar>
                        )}
                    </div>
                ))}
                 {isLoading && (
                    <div className="flex items-start gap-4">
                        <Avatar className="w-10 h-10 border-2 border-primary/50">
                            <AvatarFallback><Bot /></AvatarFallback>
                        </Avatar>
                        <div className="rounded-2xl p-4 bg-muted/50 rounded-bl-none">
                            <Loader2 className="w-5 h-5 animate-spin" />
                        </div>
                    </div>
                 )}
                <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSubmit} className="mt-4 flex items-center gap-2">
                <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="اكتب سؤالك هنا..."
                    className="flex-1 min-h-[40px] resize-none"
                    rows={1}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            handleSubmit(e);
                        }
                    }}
                    disabled={isLoading}
                />
                <Button type="submit" disabled={isLoading || !input.trim()}>
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CornerDownLeft className="w-4 h-4"/>}
                    <span className="sr-only">إرسال</span>
                </Button>
            </form>
        </div>
      </CardContent>
    </>
  );
};

export default MathChatbot;
