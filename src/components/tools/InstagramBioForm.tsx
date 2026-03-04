"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { generateInstagramBio } from "@/ai/flows/generate-instagram-bio-flow";
import { Loader2, Copy, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUser, useFirestore } from "@/firebase";
import { addDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { collection } from "firebase/firestore";

export function InstagramBioForm() {
  const [loading, setLoading] = useState(false);
  const [keywords, setKeywords] = useState("");
  const [tone, setTone] = useState("creative");
  const [context, setContext] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();

  const handleGenerate = async () => {
    if (!keywords) {
      toast({ title: "Error", description: "Please enter some keywords", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const { bio } = await generateInstagramBio({ keywords, tone, context });
      setResult(bio);

      if (user && firestore) {
        addDocumentNonBlocking(collection(firestore, 'users', user.uid, 'toolUsageLogs'), {
          id: Math.random().toString(36).substring(7),
          userId: user.uid,
          toolName: "Instagram Bio Generator",
          timestamp: new Date().toISOString(),
          inputData: JSON.stringify({ keywords, tone, context }),
          outputResult: JSON.stringify({ bio }),
        });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to generate bio", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      toast({ title: "Copied!", description: "Bio copied to clipboard." });
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid gap-6">
        <div className="space-y-2">
          <Label htmlFor="keywords">Profile Focus / Keywords</Label>
          <Input 
            id="keywords"
            placeholder="e.g. digital artist, traveler, tech enthusiast" 
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="tone">Desired Tone</Label>
          <Select value={tone} onValueChange={setTone}>
            <SelectTrigger id="tone">
              <SelectValue placeholder="Select tone" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="witty">Witty</SelectItem>
              <SelectItem value="professional">Professional</SelectItem>
              <SelectItem value="inspiring">Inspiring</SelectItem>
              <SelectItem value="minimalist">Minimalist</SelectItem>
              <SelectItem value="creative">Creative</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="context">Additional Context (Optional)</Label>
          <Textarea 
            id="context"
            placeholder="Mention hobbies, locations, or your specific niche..."
            value={context}
            onChange={(e) => setContext(e.target.value)}
          />
        </div>

        <Button 
          onClick={handleGenerate} 
          disabled={loading}
          className="w-full gradient-bg text-white h-12 text-lg shadow-lg hover:opacity-90"
        >
          {loading ? <Loader2 className="animate-spin mr-2" /> : <Sparkles className="mr-2" />}
          Generate Bio
        </Button>
      </div>

      {result && (
        <div className="mt-8 space-y-4 animate-in zoom-in-95 duration-300">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold">Your Generated Bio</h3>
            <Button variant="outline" size="sm" onClick={copyToClipboard} className="text-primary border-primary/20">
              <Copy size={16} className="mr-2" /> Copy Bio
            </Button>
          </div>
          <div className="p-6 bg-primary/5 rounded-2xl border border-primary/10 whitespace-pre-wrap text-lg leading-relaxed relative">
            {result}
            <div className="absolute top-2 right-2 opacity-10">
              <Sparkles size={40} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
