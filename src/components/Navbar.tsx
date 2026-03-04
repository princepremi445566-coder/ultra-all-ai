"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Zap, LayoutDashboard, LogOut, User } from "lucide-react";
import { useState, useEffect } from "react";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? "bg-white/80 backdrop-blur-md border-b border-border py-3 shadow-sm" : "bg-transparent py-5"
    }`}>
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
            <Zap className="fill-current" size={20} />
          </div>
          <span className="text-xl font-bold tracking-tight">
            Ultra All <span className="gradient-text">AI</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link href="/#tools" className="hover:text-primary transition-colors">Tools</Link>
          <Link href="/#features" className="hover:text-primary transition-colors">Features</Link>
          <Link href="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/dashboard">
            <Button variant="outline" className="hidden sm:flex border-primary/20 hover:bg-primary/5 text-primary">
              <LayoutDashboard size={18} className="mr-2" />
              Dashboard
            </Button>
          </Link>
          <Button className="gradient-bg gradient-bg-hover text-white rounded-full px-6">
            Get Started
          </Button>
        </div>
      </div>
    </nav>
  );
}
