"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { smartAssistant } from "@/ai/flows/smart-assistant-flow";
import { Loader2, Copy, Send, MessageSquare, Sparkles, Cpu } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUser, useFirestore } from "@/firebase";
import { addDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { collection } from "firebase/firestore";

export function SmartAssistantForm() {
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();

  const handleSend = async () => {
    if (!query) return;

    setLoading(true);
    try {
      const { answer } = await smartAssistant({ query });
      setResult(answer);
      
      if (user && firestore) {
        addDocumentNonBlocking(collection(firestore, 'users', user.uid, 'toolUsageLogs'), {
          id: Math.random().toString(36).substring(7),
          userId: user.uid,
          toolName: "Smart AI Assistant",
          timestamp: new Date().toISOString(),
          inputData: JSON.stringify({ query }),
          outputResult: JSON.stringify({ answer }),
        });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to get an answer.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      toast({ title: "Copied!", description: "Answer copied to clipboard." });
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="p-4 bg-primary/5 rounded-xl border border-primary/10 flex items-start gap-3">
          <Cpu className="text-primary mt-1" size={20} />
          <p className="text-sm text-muted-foreground">
            Our Smart Assistant is an Omni-Model powerhouse capable of high-level reasoning, coding, and analysis—comparable to the latest OpenAI, Grok, and Cohere APIs.
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="query">How can I help you today?</Label>
          <Textarea 
            id="query"
            placeholder="Type your question or request here..."
            className="min-h-[100px] text-lg"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.ctrlKey) handleSend();
            }}
          />
          <p className="text-[10px] text-muted-foreground">Press Ctrl+Enter to send</p>
        </div>

        <Button onClick={handleSend} disabled={loading || !query} className="w-full gradient-bg text-white h-12">
          {loading ? <Loader2 className="animate-spin mr-2" /> : <Send className="mr-2" />}
          {loading ? "Processing..." : "Submit Query"}
        </Button>
      </div>

      {result && (
        <div className="mt-8 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold flex items-center gap-2"><Sparkles className="text-primary" size={18} /> AI Response</h3>
            <Button variant="ghost" size="sm" onClick={copyToClipboard}>
              <Copy size={16} className="mr-2" /> Copy
            </Button>
          </div>
          <div className="p-6 bg-white border border-primary/10 rounded-2xl shadow-sm prose prose-sm max-w-none prose-p:leading-relaxed whitespace-pre-wrap">
            {result}
          </div>
        </div>
      )}
    </div>
  );
}
