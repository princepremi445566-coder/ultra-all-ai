"use client";

import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { TOOLS } from "@/lib/tools";
import Link from "next/link";
import { useState } from "react";
import { Search, Grid, List, Sparkles, Clock, Star, Zap, ArrowRight } from "lucide-react";

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "ai" | "utility">("all");

  const filteredTools = TOOLS.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "all" || tool.category.toLowerCase() === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <div className="min-h-screen bg-[#F4F0F8]">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-32 pb-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-bold mb-2">Welcome back, <span className="gradient-text">Creator</span></h1>
            <p className="text-muted-foreground">What would you like to build today?</p>
          </div>
          
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
            <Input 
              placeholder="Search for tools..." 
              className="pl-10 h-12 bg-white border-primary/10 rounded-xl focus-visible:ring-primary shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar / Filters */}
          <aside className="lg:col-span-1 space-y-6">
            <Card className="glass-card">
              <CardContent className="p-4 space-y-2">
                <Button 
                  variant={activeTab === "all" ? "default" : "ghost"} 
                  className={`w-full justify-start gap-3 rounded-lg ${activeTab === "all" ? "gradient-bg text-white shadow-lg shadow-primary/20" : ""}`}
                  onClick={() => setActiveTab("all")}
                >
                  <Grid size={18} /> All Tools
                </Button>
                <Button 
                  variant={activeTab === "ai" ? "default" : "ghost"} 
                  className={`w-full justify-start gap-3 rounded-lg ${activeTab === "ai" ? "gradient-bg text-white shadow-lg shadow-primary/20" : ""}`}
                  onClick={() => setActiveTab("ai")}
                >
                  <Sparkles size={18} /> AI Tools
                </Button>
                <Button 
                  variant={activeTab === "utility" ? "default" : "ghost"} 
                  className={`w-full justify-start gap-3 rounded-lg ${activeTab === "utility" ? "gradient-bg text-white shadow-lg shadow-primary/20" : ""}`}
                  onClick={() => setActiveTab("utility")}
                >
                  <Zap size={18} /> Utilities
                </Button>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader className="p-4">
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Clock size={14} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">QR Generated</p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Clock size={14} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Caption Created</p>
                    <p className="text-xs text-muted-foreground">Yesterday</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Tools Grid */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredTools.map((tool) => (
                <Link href={`/tools/${tool.id}`} key={tool.id} className="block group">
                  <Card className="glass-card h-full hover:shadow-2xl transition-all duration-300 border-transparent hover:border-primary/30 overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start mb-2">
                        <div className="w-12 h-12 gradient-bg text-white rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-primary/20">
                          <tool.icon size={24} />
                        </div>
                        <div className="flex gap-1">
                          {tool.isNew && <Badge className="bg-accent text-white border-none text-[10px]">NEW</Badge>}
                          <Button variant="ghost" size="icon" className="w-8 h-8 text-muted-foreground hover:text-yellow-500">
                            <Star size={16} />
                          </Button>
                        </div>
                      </div>
                      <CardTitle className="text-xl group-hover:gradient-text transition-all">{tool.name}</CardTitle>
                      <CardDescription className="line-clamp-2">{tool.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="pt-4 mt-auto border-t border-primary/5">
                        <span className="text-sm font-semibold text-primary inline-flex items-center group-hover:translate-x-1 transition-transform">
                          Open Tool <ArrowRight size={14} className="ml-1" />
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            {filteredTools.length === 0 && (
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4 text-muted-foreground">
                  <Search size={32} />
                </div>
                <h3 className="text-xl font-bold mb-2">No tools found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filters.</p>
                <Button variant="outline" className="mt-6" onClick={() => {setSearchQuery(""); setActiveTab("all");}}>
                  Clear all filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
