'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SendHorizonal, Loader2, Bot, User } from 'lucide-react';
import { askMathChatbot, type ChatMessage } from '@/ai/flows/math-chatbot';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, addDoc, serverTimestamp, query, orderBy, limit, doc } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';


const MathChatbot = () => {
  const { user } = useUser();
  const firestore = useFirestore();

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatId, setChatId] = useState<string | null>(null);

  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const messagesQuery = useMemoFirebase(() => {
    if (!user || !chatId || !firestore) return null;
    return query(
      collection(firestore, `users/${user.uid}/chats/${chatId}/messages`),
      orderBy('createdAt', 'asc'),
      limit(50)
    );
  }, [user, chatId, firestore]);
  
  const { data: messages, isLoading: messagesLoading } = useCollection<ChatMessage & {createdAt: any}>(messagesQuery);
  
  const scrollToBottom = () => {
    messagesContainerRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const saveMessage = (message: ChatMessage) => {
    if (!user || !chatId || !firestore) return;

    const messagesCol = collection(firestore, `users/${user.uid}/chats/${chatId}/messages`);
    const messageData = {
      ...message,
      createdAt: serverTimestamp(),
    };
    
    addDoc(messagesCol, messageData)
        .catch(async (serverError) => {
            const permissionError = new FirestorePermissionError({
                path: messagesCol.path,
                operation: 'create',
                requestResourceData: messageData,
            });
            errorEmitter.emit('permission-error', permissionError);
        });
  };
  
  const handleSendMessage = async (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    if (!input.trim() || isLoading || !user || !firestore) return;

    let currentChatId = chatId;
    // Create a new chat session if one doesn't exist
    if (!currentChatId) {
        const chatRef = await addDoc(collection(firestore, `users/${user.uid}/chats`), {
            startedAt: serverTimestamp(),
            topic: input.substring(0, 30),
        });
        currentChatId = chatRef.id;
        setChatId(currentChatId);
    }
    
    const userMessage: ChatMessage = { role: 'user', content: input };
    saveMessage(userMessage);

    const currentMessages = messages ? [...messages, userMessage] : [userMessage];
    
    setInput('');
    setIsLoading(true);

    try {
      const botResponse = await askMathChatbot({
        messages: currentMessages,
        user: user ? { displayName: user.displayName || 'User' } : undefined,
      });
      saveMessage(botResponse);
    } catch (error) {
      console.error(error);
      const errorMessage: ChatMessage = { role: 'bot', content: 'عذراً، حدث خطأ أثناء التواصل مع رفيقك الذكي. يرجى المحاولة مرة أخرى.' };
      saveMessage(errorMessage);
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
        <CardDescription>اطرح أي سؤال يتعلق بالرياضيات واحصل على إجابة فورية. {user ? `مرحباً بك يا ${user.displayName}!` : 'يرجى تسجيل الدخول لبدء محادثة.'}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[500px] flex flex-col">
          <div className="flex-1 overflow-y-auto pr-4 space-y-6">
            {!user ? (
                 <div className="h-full flex flex-col justify-center items-center text-center text-slate-400">
                    <Bot size={48} className="mb-4" />
                    <p className="text-lg">يجب عليك تسجيل الدخول لحفظ محادثاتك.</p>
                </div>
            ) : messagesLoading && !messages ? (
                 <div className="h-full flex flex-col justify-center items-center text-center text-slate-400">
                    <Loader2 size={48} className="animate-spin mb-4" />
                    <p className="text-lg">جاري تحميل المحادثات...</p>
                </div>
            ): messages && messages.length === 0 ? (
                <div className="h-full flex flex-col justify-center items-center text-center text-slate-400">
                    <Bot size={48} className="mb-4" />
                    <p className="text-lg">مرحباً! أنا هنا لمساعدتك في الرياضيات.</p>
                    <p>يمكنك أن تسألني عن تعريف، أو تطلب مني شرح مثال، أو أي شيء آخر!</p>
                </div>
            ) : (
                messages?.map((message, index) => (
              <div key={index} className={cn('flex items-start gap-4', message.role === 'user' ? 'justify-end' : 'justify-start')}>
                {message.role === 'bot' && <Bot className="w-8 h-8 text-primary flex-shrink-0 mt-1" />}
                <div className={cn('max-w-xl p-4 rounded-2xl', message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-background')}>
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
                {message.role === 'user' && (user?.photoURL ? <Avatar className="w-8 h-8 flex-shrink-0 mt-1"><AvatarImage src={user.photoURL} /></Avatar> : <User className="w-8 h-8 text-slate-400 flex-shrink-0 mt-1" />)}
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
            <div ref={messagesContainerRef} />
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
              placeholder={user ? "اكتب سؤالك هنا..." : "الرجاء تسجيل الدخول أولاً"}
              className="flex-1 resize-none bg-background/50 text-lg p-3 min-h-[48px]"
              rows={1}
              disabled={!user || isLoading}
            />
            <Button type="submit" disabled={!user || isLoading || !input.trim()} size="icon" className="h-12 w-12 flex-shrink-0">
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <SendHorizonal className="w-5 h-5" />}
            </Button>
          </form>
        </div>
      </CardContent>
    </>
  );
};

export default MathChatbot;
