"use client";

import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TOOLS } from "@/lib/tools";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Sparkles, Zap, Shield, Cpu } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_70%)] from-primary/10 blur-3xl opacity-50 -z-10" />
        
        <div className="container mx-auto px-4 text-center">
          <Badge variant="secondary" className="mb-6 py-1.5 px-4 bg-primary/10 text-primary border-primary/20 animate-fade-in">
            <Sparkles size={14} className="mr-2" />
            Empowering Creators with AI
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 max-w-4xl mx-auto leading-tight">
            Everything You Need to <span className="gradient-text">Create Better</span> Content
          </h1>
          
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            Ultra All AI is your premium hub for generative AI tools and essential utilities. Fast, secure, and production-ready.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/dashboard">
              <Button size="lg" className="gradient-bg gradient-bg-hover text-white px-8 py-6 rounded-full text-lg shadow-xl shadow-primary/20">
                Explore All Tools <ArrowRight className="ml-2" size={20} />
              </Button>
            </Link>
            <Button size="lg" variant="ghost" className="px-8 py-6 rounded-full text-lg hover:bg-primary/5">
              Watch Demo
            </Button>
          </div>
          
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto opacity-70 grayscale hover:grayscale-0 transition-all">
            <div className="flex items-center justify-center gap-2 font-semibold">
              <Shield className="text-primary" /> Enterprise Security
            </div>
            <div className="flex items-center justify-center gap-2 font-semibold">
              <Zap className="text-primary" /> Ultra Fast
            </div>
            <div className="flex items-center justify-center gap-2 font-semibold">
              <Cpu className="text-primary" /> Gemini Powered
            </div>
            <div className="flex items-center justify-center gap-2 font-semibold">
              <CheckCircle2 className="text-primary" /> No Hidden Fees
            </div>
          </div>
        </div>
      </section>

      {/* Tools Preview */}
      <section id="tools" className="py-24 bg-white/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Our Premium Toolkit</h2>
            <p className="text-muted-foreground text-lg">10+ powerful tools built for the modern creator.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {TOOLS.map((tool) => (
              <Link href={`/tools/${tool.id}`} key={tool.id}>
                <Card className="group glass-card h-full hover:scale-[1.02] transition-all cursor-pointer overflow-hidden border-transparent hover:border-primary/20">
                  <CardContent className="p-8">
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-14 h-14 bg-primary/5 rounded-2xl flex items-center justify-center text-primary group-hover:gradient-bg group-hover:text-white transition-all">
                        <tool.icon size={28} />
                      </div>
                      {tool.isNew && <Badge className="bg-accent text-white border-none">New</Badge>}
                    </div>
                    <h3 className="text-xl font-bold mb-3 group-hover:gradient-text transition-all">{tool.name}</h3>
                    <p className="text-muted-foreground mb-6 line-clamp-2">{tool.description}</p>
                    <div className="flex items-center text-sm font-semibold text-primary">
                      Try Tool <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <Link href="/dashboard">
              <Button variant="outline" size="lg" className="rounded-full px-8">
                View Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-8 leading-tight">Designed for <span className="gradient-text">Speed and Simplicity</span></h2>
              <ul className="space-y-6">
                {[
                  "One-click generation for bios and captions",
                  "Secure results storage with Firebase Firestore",
                  "Optimized for all devices with mobile-first design",
                  "Privacy-first utility tools that run locally",
                  "Professional-grade PDF and Image processing"
                ].map((feature, i) => (
                  <li key={i} className="flex gap-4 items-start">
                    <div className="mt-1 w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-primary flex-shrink-0">
                      <CheckCircle2 size={16} />
                    </div>
                    <p className="text-lg text-muted-foreground">{feature}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-tr from-primary/20 to-accent/20 blur-2xl -z-10 rounded-[3rem]" />
              <img 
                src="https://picsum.photos/seed/tool/800/600" 
                alt="Dashboard Preview" 
                className="rounded-2xl shadow-2xl border border-white/20 animate-float"
                data-ai-hint="dashboard design"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="gradient-bg rounded-[3rem] p-12 md:p-24 text-center text-white relative overflow-hidden shadow-2xl shadow-primary/30">
            <div className="absolute top-0 right-0 p-10 opacity-10">
              <Sparkles size={120} />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-8">Ready to supercharge your workflow?</h2>
            <p className="text-xl opacity-90 mb-12 max-w-2xl mx-auto">Join thousands of creators using Ultra All AI to build their digital presence faster.</p>
            <Link href="/dashboard">
              <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90 rounded-full px-12 py-8 text-xl font-bold">
                Get Started for Free
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="bg-white border-t py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center text-white">
                <Zap size={16} className="fill-current" />
              </div>
              <span className="text-lg font-bold">Ultra All AI</span>
            </div>
            <div className="flex gap-8 text-sm text-muted-foreground font-medium">
              <Link href="#" className="hover:text-primary">Terms</Link>
              <Link href="#" className="hover:text-primary">Privacy</Link>
              <Link href="#" className="hover:text-primary">Contact</Link>
            </div>
            <p className="text-sm text-muted-foreground">© 2024 Ultra All AI. Built with ❤️ for the AI Era.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
