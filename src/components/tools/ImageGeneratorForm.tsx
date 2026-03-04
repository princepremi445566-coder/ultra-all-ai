"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { generateImage } from "@/ai/flows/generate-image-flow";
import { Loader2, Download, Sparkles, ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function ImageGeneratorForm() {
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!prompt) {
      toast({ title: "Prompt Required", description: "Please enter a description for the image.", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const { imageUrl } = await generateImage({ prompt });
      setImageUrl(imageUrl);
      toast({ title: "Success", description: "Your image has been generated!" });
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "Failed to generate image. Please try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = () => {
    if (!imageUrl) return;
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = `generated-ai-image-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-6">
        <div className="space-y-2">
          <Label htmlFor="prompt">Image Description (Prompt)</Label>
          <Textarea 
            id="prompt"
            placeholder="e.g. A futuristic city with neon lights, cinematic lighting, 8k resolution, cyberpunk aesthetic..."
            className="min-h-[120px] text-lg"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </div>

        <Button onClick={handleGenerate} disabled={loading} className="w-full gradient-bg text-white h-12 text-lg">
          {loading ? <Loader2 className="animate-spin mr-2" /> : <Sparkles className="mr-2" />}
          Generate Masterpiece
        </Button>
      </div>

      {imageUrl && (
        <div className="mt-8 space-y-6 animate-in zoom-in-95 duration-500">
          <div className="relative group overflow-hidden rounded-2xl shadow-2xl border border-primary/10">
            <img src={imageUrl} alt="Generated AI Masterpiece" className="w-full h-auto object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
               <Button onClick={downloadImage} variant="secondary" className="rounded-full">
                 <Download className="mr-2" size={18} /> Download High-Res
               </Button>
            </div>
          </div>
          <p className="text-center text-sm text-muted-foreground italic">
            "Propelled by Gemini Imagen 4"
          </p>
        </div>
      )}
    </div>
  );
}
