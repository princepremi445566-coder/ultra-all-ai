"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, QrCode, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function QRGeneratorForm() {
  const [text, setText] = useState("");
  const [qrUrl, setQrUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerate = () => {
    if (!text) {
      toast({ title: "Input Required", description: "Please enter a URL or text.", variant: "destructive" });
      return;
    }
    setLoading(true);
    // Using a reliable public QR API for this utility tool
    const url = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(text)}`;
    setQrUrl(url);
    setLoading(false);
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(qrUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `qr-code-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      toast({ title: "Download Failed", description: "Failed to download QR code.", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-8 text-center">
      <div className="max-w-md mx-auto space-y-6 text-left">
        <div className="space-y-2">
          <Label htmlFor="qr-input">URL or Text</Label>
          <Input 
            id="qr-input"
            placeholder="Enter website link or text message..." 
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="h-12"
          />
        </div>
        <Button onClick={handleGenerate} className="w-full gradient-bg text-white h-12" disabled={loading}>
          {loading ? <RefreshCw className="animate-spin mr-2" /> : <QrCode className="mr-2" />}
          Generate QR Code
        </Button>
      </div>

      {qrUrl && (
        <div className="space-y-6 animate-in zoom-in-95 duration-500">
          <div className="inline-block p-6 bg-white rounded-3xl shadow-2xl border border-primary/10">
            <img src={qrUrl} alt="Generated QR Code" className="w-64 h-64 mx-auto" />
          </div>
          <div className="flex gap-4 justify-center">
            <Button variant="outline" onClick={handleDownload} className="rounded-full px-8 border-primary/20 text-primary">
              <Download size={18} className="mr-2" /> Download PNG
            </Button>
            <Button variant="ghost" onClick={() => setText("")} className="rounded-full px-8">
              Reset
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
