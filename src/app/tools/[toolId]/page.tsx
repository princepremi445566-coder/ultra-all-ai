"use client";

import { use } from "react";
import { Navbar } from "@/components/Navbar";
import { TOOLS } from "@/lib/tools";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, Send, Copy, CheckCircle2, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { InstagramBioForm } from "@/components/tools/InstagramBioForm";
import { YoutubeTitleForm } from "@/components/tools/YoutubeTitleForm";
import { InstagramCaptionForm } from "@/components/tools/InstagramCaptionForm";
import { HashtagGeneratorForm } from "@/components/tools/HashtagGeneratorForm";
import { QRGeneratorForm } from "@/components/tools/QRGeneratorForm";
import { useToast } from "@/hooks/use-toast";

export default function ToolPage({ params }: { params: Promise<{ toolId: string }> }) {
  const { toolId } = use(params);
  const tool = TOOLS.find((t) => t.id === toolId);
  const { toast } = useToast();
  
  if (!tool) {
    return <div>Tool not found</div>;
  }

  const renderToolInterface = () => {
    switch (toolId) {
      case "instagram-bio":
        return <InstagramBioForm />;
      case "youtube-title":
        return <YoutubeTitleForm />;
      case "instagram-caption":
        return <InstagramCaptionForm />;
      case "hashtag-generator":
        return <HashtagGeneratorForm />;
      case "qr-generator":
        return <QRGeneratorForm />;
      default:
        return (
          <div className="text-center py-12">
            <div className="w-16 h-16 gradient-bg rounded-2xl flex items-center justify-center text-white mx-auto mb-6">
              <tool.icon size={32} />
            </div>
            <h3 className="text-2xl font-bold mb-2">{tool.name}</h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-8">
              This tool is currently being optimized for the best user experience. Check back soon!
            </p>
            <Link href="/dashboard">
              <Button className="gradient-bg text-white rounded-full px-8">Return to Dashboard</Button>
            </Link>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F0F8]">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-32 pb-20">
        <Link href="/dashboard" className="inline-flex items-center text-primary font-medium mb-8 hover:underline">
          <ArrowLeft size={18} className="mr-2" /> Back to Dashboard
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto">
          <div className="lg:col-span-4">
            <Card className="glass-card sticky top-32">
              <CardHeader>
                <div className="w-12 h-12 gradient-bg text-white rounded-xl flex items-center justify-center mb-4 shadow-lg">
                  <tool.icon size={24} />
                </div>
                <CardTitle className="text-2xl">{tool.name}</CardTitle>
                <CardDescription>{tool.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-sm">
                  <div className="p-3 bg-primary/5 rounded-lg border border-primary/10">
                    <p className="font-semibold text-primary mb-1">How to use:</p>
                    <p className="text-muted-foreground">Fill in the required fields and click generate to get your {tool.category.toLowerCase()} results.</p>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle2 size={16} className="text-green-500" /> AI-Powered Accuracy
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle2 size={16} className="text-green-500" /> Export Ready
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-8">
            <Card className="glass-card min-h-[500px]">
              <CardContent className="p-8">
                {renderToolInterface()}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
