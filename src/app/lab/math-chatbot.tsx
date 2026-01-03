'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SendHorizonal, Loader2, Bot, User, CornerDownLeft } from 'lucide-react';
import { askMathChatbot, type ChatMessage } from '@/ai/flows/math-chatbot';
import { cn } from '@/lib/utils';
import Textarea from 'react-textarea-autosize';

const MathChatbot = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const botResponse = await askMathChatbot({ messages: newMessages });
      setMessages([...newMessages, botResponse]);
    } catch (error) {
      const errorMessage: ChatMessage = { role: 'bot', content: 'عذراً، حدث خطأ أثناء التواصل مع رفيقك الذكي. يرجى المحاولة مرة أخرى.' };
      setMessages([...newMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center gap-2">
          <Bot className="w-7 h-7 text-primary"/>
          رفيقك الذكي في الرياضيات
        </CardTitle>
        <CardDescription>اطرح أي سؤال يتعلق بالرياضيات واحصل على إجابة فورية.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[500px] flex flex-col">
          <div className="flex-1 overflow-y-auto pr-4 space-y-6">
            {messages.length === 0 ? (
                <div className="h-full flex flex-col justify-center items-center text-center text-slate-400">
                    <Bot size={48} className="mb-4" />
                    <p className="text-lg">مرحباً! أنا هنا لمساعدتك في الرياضيات.</p>
                    <p>يمكنك أن تسألني عن تعريف، أو تطلب مني شرح مثال، أو أي شيء آخر!</p>
                </div>
            ) : (
                messages.map((message, index) => (
              <div key={index} className={cn('flex items-start gap-4', message.role === 'user' ? 'justify-end' : 'justify-start')}>
                {message.role === 'bot' && <Bot className="w-8 h-8 text-primary flex-shrink-0 mt-1" />}
                <div className={cn('max-w-xl p-4 rounded-2xl', message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-background')}>
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
                {message.role === 'user' && <User className="w-8 h-8 text-slate-400 flex-shrink-0 mt-1" />}
              </div>
            ))
            )}
             {isLoading && (
                <div className="flex items-start gap-4 justify-start">
                    <Bot className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
                    <div className="max-w-xl p-4 rounded-2xl bg-background">
                        <Loader2 className="w-5 h-5 animate-spin" />
                    </div>
                </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={handleSendMessage} className="mt-4 flex items-center gap-2 border-t border-white/10 pt-4">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="اكتب سؤالك هنا..."
              className="flex-1 resize-none bg-background/50 text-lg p-3"
              minRows={1}
              maxRows={5}
            />
            <Button type="submit" disabled={isLoading || !input.trim()} size="icon" className="h-12 w-12 flex-shrink-0">
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <SendHorizonal className="w-5 h-5" />}
            </Button>
          </form>
        </div>
      </CardContent>
    </>
  );
};

export default MathChatbot;
