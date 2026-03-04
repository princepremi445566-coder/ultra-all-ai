"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { generateHashtags } from "@/ai/flows/generate-hashtags-flow";
import { Loader2, Copy, Hash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { useUser, useFirestore } from "@/firebase";
import { addDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { collection } from "firebase/firestore";

export function HashtagGeneratorForm() {
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const [numHashtags, setNumHashtags] = useState([10]);
  const [results, setResults] = useState<string[]>([]);
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();

  const handleGenerate = async () => {
    if (!content) {
      toast({ title: "Input Required", description: "Please enter your post content.", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const { hashtags } = await generateHashtags({ 
        postContent: content, 
        numHashtags: numHashtags[0] 
      });
      setResults(hashtags);

      if (user && firestore) {
        addDocumentNonBlocking(collection(firestore, 'users', user.uid, 'toolUsageLogs'), {
          id: Math.random().toString(36).substring(7),
          userId: user.uid,
          toolName: "Hashtag Generator",
          timestamp: new Date().toISOString(),
          inputData: JSON.stringify({ postContent: content, numHashtags: numHashtags[0] }),
          outputResult: JSON.stringify({ hashtags }),
        });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to generate hashtags", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const copyAll = () => {
    navigator.clipboard.writeText(results.join(" "));
    toast({ title: "Copied!", description: "All hashtags copied to clipboard." });
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-6">
        <div className="space-y-2">
          <Label htmlFor="content">Post Content / Context</Label>
          <Textarea 
            id="content"
            placeholder="What is your post about? Describe the topic or paste your caption..."
            className="min-h-[150px]"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        <div className="space-y-4">
          <div className="flex justify-between">
            <Label>Number of Hashtags</Label>
            <span className="font-bold text-primary">{numHashtags[0]}</span>
          </div>
          <Slider 
            value={numHashtags} 
            onValueChange={setNumHashtags} 
            max={20} 
            min={5} 
            step={1} 
          />
        </div>

        <Button onClick={handleGenerate} disabled={loading} className="w-full gradient-bg text-white h-12 text-lg">
          {loading ? <Loader2 className="animate-spin mr-2" /> : <Hash className="mr-2" />}
          Generate Trending Hashtags
        </Button>
      </div>

      {results.length > 0 && (
        <div className="mt-8 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold">Generated Results</h3>
            <Button variant="outline" size="sm" onClick={copyAll} className="text-primary border-primary/20">
              <Copy size={16} className="mr-2" /> Copy All
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 p-6 bg-white border rounded-2xl shadow-sm">
            {results.map((tag, i) => (
              <Badge key={i} className="px-4 py-2 text-md bg-primary/5 text-primary border-primary/10 hover:bg-primary hover:text-white transition-all cursor-default">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
