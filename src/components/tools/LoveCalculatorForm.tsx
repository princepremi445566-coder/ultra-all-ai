"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart, RefreshCcw, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

export function LoveCalculatorForm() {
  const [name1, setName1] = useState("");
  const [name2, setName2] = useState("");
  const [score, setScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const calculateLove = () => {
    if (!name1 || !name2) {
      toast({ title: "Names Required", description: "Please enter both names.", variant: "destructive" });
      return;
    }

    setLoading(true);
    setScore(null);

    // Simulate calculation
    setTimeout(() => {
      // Deterministic but random-looking algorithm based on name strings
      const combined = (name1 + name2).toLowerCase().replace(/\s/g, "");
      let hash = 0;
      for (let i = 0; i < combined.length; i++) {
        hash = ((hash << 5) - hash) + combined.charCodeAt(i);
        hash |= 0;
      }
      const calculatedScore = Math.abs(hash % 101);
      
      setScore(calculatedScore);
      setLoading(false);
    }, 1500);
  };

  const getMessage = (s: number) => {
    if (s > 85) return "A match made in heaven! ❤️";
    if (s > 70) return "Very strong compatibility! ✨";
    if (s > 50) return "There's definitely a spark! 🔥";
    if (s > 30) return "Possible, with some effort! 💪";
    return "Maybe just friends for now? ☕";
  };

  return (
    <div className="space-y-8 max-w-md mx-auto text-center">
      <div className="grid grid-cols-1 gap-6 text-left">
        <div className="space-y-2">
          <Label htmlFor="name1">First Person's Name</Label>
          <Input 
            id="name1"
            placeholder="e.g. Romeo" 
            value={name1}
            onChange={(e) => setName1(e.target.value)}
            className="h-12 text-lg"
          />
        </div>
        <div className="flex justify-center text-primary">
          <Heart className="animate-pulse fill-current" size={32} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="name2">Second Person's Name</Label>
          <Input 
            id="name2"
            placeholder="e.g. Juliet" 
            value={name2}
            onChange={(e) => setName2(e.target.value)}
            className="h-12 text-lg"
          />
        </div>

        <Button 
          onClick={calculateLove} 
          disabled={loading} 
          className="w-full gradient-bg text-white h-12 text-lg shadow-lg"
        >
          {loading ? <RefreshCcw className="animate-spin mr-2" /> : <Heart className="mr-2" />}
          {loading ? "Calculating..." : "Calculate Compatibility"}
        </Button>
      </div>

      {score !== null && (
        <div className="space-y-6 animate-in zoom-in-95 duration-500">
          <div className="p-8 bg-white rounded-3xl shadow-xl border border-primary/10">
            <h3 className="text-4xl font-black gradient-text mb-2">{score}%</h3>
            <p className="text-lg font-medium text-muted-foreground mb-4">{getMessage(score)}</p>
            <Progress value={score} className="h-3 mb-2" />
          </div>
          <Button variant="ghost" onClick={() => { setName1(""); setName2(""); setScore(null); }}>
            Try Another Pair
          </Button>
        </div>
      )}
    </div>
  );
}
