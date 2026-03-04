"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { generateYoutubeTitle } from "@/ai/flows/generate-youtube-title-flow";
import { Loader2, Copy, Sparkles, Layout } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function YoutubeTitleForm() {
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState("");
  const [keywords, setKeywords] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [results, setResults] = useState<string[]>([]);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!description || !keywords) {
      toast({ title: "Missing Information", description: "Please provide both description and keywords.", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const { titles } = await generateYoutubeTitle({ 
        videoDescription: description, 
        keywords, 
        targetAudience 
      });
      setResults(titles);
    } catch (error) {
      toast({ title: "Error", description: "Failed to generate titles", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: "Title copied to clipboard." });
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-6">
        <div className="space-y-2">
          <Label htmlFor="description">Video Description</Label>
          <Textarea 
            id="description"
            placeholder="Describe what happens in your video..."
            className="min-h-[100px]"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="keywords">Main Keywords</Label>
          <Input 
            id="keywords"
            placeholder="e.g. tutorial, vlog, tech review" 
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="audience">Target Audience (Optional)</Label>
          <Input 
            id="audience"
            placeholder="e.g. beginners, pro gamers" 
            value={targetAudience}
            onChange={(e) => setTargetAudience(e.target.value)}
          />
        </div>

        <Button onClick={handleGenerate} disabled={loading} className="w-full gradient-bg text-white h-12 text-lg">
          {loading ? <Loader2 className="animate-spin mr-2" /> : <Sparkles className="mr-2" />}
          Generate Titles
        </Button>
      </div>

      {results.length > 0 && (
        <div className="mt-8 space-y-4">
          <h3 className="text-xl font-bold">SEO-Optimized Titles</h3>
          <div className="grid gap-3">
            {results.map((title, i) => (
              <div key={i} className="group p-4 bg-white border border-primary/10 rounded-xl flex items-center justify-between hover:border-primary/30 transition-all shadow-sm">
                <p className="flex-1 font-medium pr-4">{title}</p>
                <Button variant="ghost" size="sm" onClick={() => copyToClipboard(title)} className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <Copy size={16} />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
