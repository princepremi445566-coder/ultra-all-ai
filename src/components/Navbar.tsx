
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Zap, LayoutDashboard, LogOut, User as UserIcon, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useUser, useAuth } from "@/firebase";
import { initiateGoogleSignIn } from "@/firebase/non-blocking-login";
import { signOut } from "firebase/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, isUserLoading } = useUser();
  const auth = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignIn = () => {
    initiateGoogleSignIn(auth);
  };

  const handleSignOut = () => {
    signOut(auth);
  };

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
          {isUserLoading ? (
            <div className="w-10 h-10 rounded-full bg-muted animate-pulse" />
          ) : user ? (
            <>
              <Link href="/dashboard" className="hidden sm:block">
                <Button variant="outline" className="border-primary/20 hover:bg-primary/5 text-primary">
                  <LayoutDashboard size={18} className="mr-2" />
                  Dashboard
                </Button>
              </Link>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 overflow-hidden ring-offset-background transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.photoURL || ""} alt={user.displayName || "User"} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {user.displayName?.charAt(0) || <UserIcon size={18} />}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.displayName}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="cursor-pointer">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button onClick={handleSignIn} className="gradient-bg gradient-bg-hover text-white rounded-full px-6">
              Get Started
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
