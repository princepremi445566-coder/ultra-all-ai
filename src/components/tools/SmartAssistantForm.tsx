"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { smartAssistant } from "@/ai/flows/smart-assistant-flow";
import { Loader2, Copy, Send, Sparkles, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function SmartAssistantForm() {
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSend = async () => {
    if (!query) return;

    setLoading(true);
    try {
      const { answer } = await smartAssistant({ query });
      setResult(answer);
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
          <MessageSquare className="text-primary mt-1" size={20} />
          <p className="text-sm text-muted-foreground">
            Our Smart Assistant can handle coding tasks, summarize articles, and brainstorm ideas just like top-tier LLMs.
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="query">How can I help you today?</Label>
          <Textarea 
            id="query"
            placeholder="Type your question or request here..."
            className="min-h-[100px]"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.ctrlKey) handleSend();
            }}
          />
        </div>

        <Button onClick={handleSend} disabled={loading || !query} className="w-full gradient-bg text-white h-12">
          {loading ? <Loader2 className="animate-spin mr-2" /> : <Send className="mr-2" />}
          {loading ? "Thinking..." : "Send Request"}
        </Button>
      </div>

      {result && (
        <div className="mt-8 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold">Assistant Response</h3>
            <Button variant="ghost" size="sm" onClick={copyToClipboard}>
              <Copy size={16} className="mr-2" /> Copy
            </Button>
          </div>
          <div className="p-6 bg-white border border-primary/10 rounded-2xl shadow-sm prose prose-sm max-w-none prose-p:leading-relaxed">
            {result.split('\n').map((line, i) => (
              <p key={i} className="mb-2 last:mb-0">{line}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
