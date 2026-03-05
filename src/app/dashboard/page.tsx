"use client";

import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { TOOLS } from "@/lib/tools";
import { AdBanner } from "@/components/AdBanner";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { Search, Grid, Sparkles, Clock, Star, Zap, ArrowRight, History, Loader2 } from "lucide-react";
import { collection, query, orderBy, limit } from "firebase/firestore";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "ai" | "utility">("all");
  const [greeting, setGreeting] = useState("Creator");
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();

  // STRICT AUTH GUARD: Immediately redirect to login if not authenticated
  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push("/login");
    }
  }, [user, isUserLoading, router]);

  useEffect(() => {
    if (user?.displayName) {
      setGreeting(user.displayName.split(' ')[0]);
    } else if (user?.email) {
      setGreeting(user.email.split('@')[0]);
    } else {
      setGreeting("Creator");
    }
  }, [user]);

  const filteredTools = TOOLS.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "all" || tool.category.toLowerCase() === activeTab;
    return matchesSearch && matchesTab;
  });

  const recentLogsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(
      collection(firestore, 'users', user.uid, 'toolUsageLogs'),
      orderBy('timestamp', 'desc'),
      limit(5)
    );
  }, [firestore, user]);

  const { data: recentLogs, isLoading: isLogsLoading } = useCollection(recentLogsQuery);

  if (isUserLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F0F8]">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F0F8]">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 md:pt-32 pb-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Welcome back, <span className="gradient-text">{greeting}</span></h1>
            <p className="text-muted-foreground">Everything is ready for your next project.</p>
          </div>
          
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
            <Input 
              placeholder="Search tools (e.g. Resume, Image...)" 
              className="pl-10 h-12 bg-white border-primary/10 rounded-xl focus-visible:ring-primary shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1 space-y-6">
            <Card className="glass-card shadow-sm border-white/40">
              <CardContent className="p-4 flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible no-scrollbar">
                <Button 
                  variant={activeTab === "all" ? "default" : "ghost"} 
                  className={`flex-shrink-0 lg:w-full justify-start gap-3 rounded-lg transition-all ${activeTab === "all" ? "gradient-bg text-white shadow-lg shadow-primary/20" : "hover:bg-primary/5"}`}
                  onClick={() => setActiveTab("all")}
                >
                  <Grid size={18} /> All Tools
                </Button>
                <Button 
                  variant={activeTab === "ai" ? "default" : "ghost"} 
                  className={`flex-shrink-0 lg:w-full justify-start gap-3 rounded-lg transition-all ${activeTab === "ai" ? "gradient-bg text-white shadow-lg shadow-primary/20" : "hover:bg-primary/5"}`}
                  onClick={() => setActiveTab("ai")}
                >
                  <Sparkles size={18} /> AI Tools
                </Button>
                <Button 
                  variant={activeTab === "utility" ? "default" : "ghost"} 
                  className={`flex-shrink-0 lg:w-full justify-start gap-3 rounded-lg transition-all ${activeTab === "utility" ? "gradient-bg text-white shadow-lg shadow-primary/20" : "hover:bg-primary/5"}`}
                  onClick={() => setActiveTab("utility")}
                >
                  <Zap size={18} /> Utilities
                </Button>
              </CardContent>
            </Card>

            <Card className="glass-card hidden lg:block border-white/40">
              <CardHeader className="p-4 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Recent Activity</CardTitle>
                <History size={16} className="text-muted-foreground" />
              </CardHeader>
              <CardContent className="p-4 pt-0 space-y-4">
                {isLogsLoading ? (
                  <div className="flex items-center gap-2 py-2">
                    <Loader2 className="animate-spin text-primary" size={14} />
                    <p className="text-xs text-muted-foreground">Fetching activity...</p>
                  </div>
                ) : recentLogs && recentLogs.length > 0 ? (
                  recentLogs.map((log) => (
                    <div key={log.id} className="flex items-center gap-3 text-sm animate-in fade-in duration-300">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <Clock size={14} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{log.toolName}</p>
                        <p className="text-[10px] text-muted-foreground">
                          {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground italic py-2">No activity recorded yet.</p>
                )}
                <Button variant="link" className="w-full text-xs text-primary p-0 h-auto justify-start" asChild>
                  <Link href="/history">View full history <ArrowRight size={10} className="ml-1" /></Link>
                </Button>
              </CardContent>
            </Card>

            <div className="sticky top-32">
              <AdBanner />
            </div>
          </aside>

          <div className="lg:col-span-3 space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredTools.map((tool) => (
                <Link href={`/tools/${tool.id}`} key={tool.id} className="block group">
                  <Card className="glass-card h-full hover:shadow-2xl transition-all duration-300 border-white/20 hover:border-primary/40 overflow-hidden flex flex-col">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start mb-2">
                        <div className="w-12 h-12 gradient-bg text-white rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-primary/20">
                          <tool.icon size={24} />
                        </div>
                        <div className="flex gap-1">
                          {tool.isNew && <Badge className="bg-accent text-white border-none text-[10px] animate-pulse">NEW</Badge>}
                        </div>
                      </div>
                      <CardTitle className="text-xl group-hover:gradient-text transition-all">{tool.name}</CardTitle>
                      <CardDescription className="line-clamp-2 text-sm">{tool.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="mt-auto pt-4">
                      <div className="pt-4 border-t border-primary/5">
                        <span className="text-sm font-semibold text-primary inline-flex items-center group-hover:translate-x-1 transition-transform">
                          Launch Tool <ArrowRight size={14} className="ml-1" />
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            {filteredTools.length === 0 && (
              <div className="text-center py-20 glass-card rounded-2xl">
                <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4 text-muted-foreground">
                  <Search size={32} />
                </div>
                <h3 className="text-xl font-bold mb-2">No tools match your search</h3>
                <p className="text-muted-foreground">Try using different keywords or reset filters.</p>
                <Button variant="outline" className="mt-6 rounded-full" onClick={() => {setSearchQuery(""); setActiveTab("all");}}>
                  Reset All Filters
                </Button>
              </div>
            )}
            
            <AdBanner />
          </div>
        </div>
      </main>
    </div>
  );
}
