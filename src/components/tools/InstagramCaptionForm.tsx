"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { generateInstagramCaption } from "@/ai/flows/generate-instagram-caption-flow";
import { Loader2, Copy, Sparkles, Hash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function InstagramCaptionForm() {
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState("");
  const [tone, setTone] = useState("casual");
  const [keywords, setKeywords] = useState("");
  const [result, setResult] = useState<{ caption: string, hashtags: string[] } | null>(null);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!description) {
      toast({ title: "Error", description: "Please provide a post description.", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const keywordArray = keywords ? keywords.split(",").map(k => k.trim()) : [];
      const output = await generateInstagramCaption({ description, tone, keywords: keywordArray });
      setResult(output);
    } catch (error) {
      toast({ title: "Error", description: "Failed to generate caption", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: "Content copied to clipboard." });
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-6">
        <div className="space-y-2">
          <Label htmlFor="desc">Post Description</Label>
          <Textarea 
            id="desc"
            placeholder="e.g. coffee shop morning vibes, sunset at the beach..."
            className="min-h-[120px]"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="tone">Tone</Label>
            <Select value={tone} onValueChange={setTone}>
              <SelectTrigger id="tone">
                <SelectValue placeholder="Select tone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="casual">Casual</SelectItem>
                <SelectItem value="funny">Funny</SelectItem>
                <SelectItem value="inspiring">Inspiring</SelectItem>
                <SelectItem value="professional">Professional</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="keywords">Specific Keywords (Optional)</Label>
            <Input 
              id="keywords"
              placeholder="e.g. latte art, summer, relax" 
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
            />
          </div>
        </div>

        <Button onClick={handleGenerate} disabled={loading} className="w-full gradient-bg text-white h-12 text-lg">
          {loading ? <Loader2 className="animate-spin mr-2" /> : <Sparkles className="mr-2" />}
          Generate Caption
        </Button>
      </div>

      {result && (
        <div className="mt-8 space-y-6 animate-in fade-in duration-500">
          <div className="p-6 bg-white border border-primary/10 rounded-2xl shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b pb-4">
              <h3 className="font-bold text-lg">Caption Result</h3>
              <Button variant="ghost" size="sm" onClick={() => copyToClipboard(result.caption)}>
                <Copy size={16} className="mr-2" /> Copy
              </Button>
            </div>
            <p className="text-lg leading-relaxed">{result.caption}</p>
          </div>

          <div className="p-6 bg-primary/5 border border-primary/10 rounded-2xl">
            <h3 className="font-bold mb-4 flex items-center gap-2"><Hash size={18} /> Recommended Hashtags</h3>
            <div className="flex flex-wrap gap-2">
              {result.hashtags.map((tag, i) => (
                <Badge key={i} variant="secondary" className="bg-white hover:bg-primary hover:text-white cursor-pointer transition-colors px-3 py-1">
                  {tag}
                </Badge>
              ))}
            </div>
            <Button variant="link" className="mt-4 p-0 h-auto text-primary" onClick={() => copyToClipboard(result.hashtags.join(" "))}>
              Copy all hashtags
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
