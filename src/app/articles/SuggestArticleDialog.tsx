'use client';
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useFirestore } from "@/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Loader2 } from "lucide-react";
import type { User } from "firebase/auth";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";

type SuggestArticleDialogProps = {
  children: React.ReactNode;
  user: User | null;
}

const SuggestArticleDialog = ({ children, user }: SuggestArticleDialogProps) => {
  const [open, setOpen] = useState(false);
  const [suggestion, setSuggestion] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const firestore = useFirestore();

  const handleSubmit = async () => {
    if (!suggestion.trim() || !user || !firestore) {
      toast({
        variant: "destructive",
        title: "خطأ",
        description: "لا يمكن أن يكون الاقتراح فارغًا.",
      });
      return;
    }

    setLoading(true);
    
    const suggestionData = {
      userId: user.uid,
      userEmail: user.email,
      suggestion: suggestion,
      createdAt: serverTimestamp(),
    };
    
    const suggestionsCollection = collection(firestore, 'suggestions');

    addDoc(suggestionsCollection, suggestionData)
      .then(() => {
        toast({
          title: "تم إرسال اقتراحك بنجاح!",
          description: "شكرًا لك على مساهمتك في تطوير المحتوى.",
        });
        setSuggestion("");
        setOpen(false);
      })
      .catch((serverError) => {
        const permissionError = new FirestorePermissionError({
          path: suggestionsCollection.path,
          operation: 'create',
          requestResourceData: suggestionData,
        });
        errorEmitter.emit('permission-error', permissionError);
        toast({
            variant: "destructive",
            title: "فشل الإرسال",
            description: "حدث خطأ أثناء إرسال اقتراحك. يرجى المحاولة مرة أخرى.",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild disabled={!user}>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>اقتراح مقال جديد</DialogTitle>
          <DialogDescription>
            هل لديك فكرة لمقال تود رؤيته في التطبيق؟ شاركنا بها!
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Textarea
            id="suggestion"
            value={suggestion}
            onChange={(e) => setSuggestion(e.target.value)}
            placeholder="اكتب فكرة المقال أو الموضوع هنا..."
            className="min-h-[120px]"
          />
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={loading || !suggestion.trim()}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? 'جاري الإرسال...' : 'إرسال الاقتراح'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default SuggestArticleDialog;
