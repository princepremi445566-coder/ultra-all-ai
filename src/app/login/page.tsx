"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth, useUser } from "@/firebase";
import { 
  initiateGoogleSignIn, 
  initiateEmailSignIn, 
  initiateEmailSignUp, 
  setupRecaptcha, 
  initiatePhoneSignIn 
} from "@/firebase/non-blocking-login";
import { useRouter } from "next/navigation";
import { Mail, Phone, Lock, Chrome, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ConfirmationResult } from "firebase/auth";

export default function LoginPage() {
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  
  const [phone, setPhone] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && !isUserLoading) {
      router.push("/dashboard");
    }
  }, [user, isUserLoading, router]);

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await initiateGoogleSignIn(auth);
      toast({ title: "Success", description: "Logged in with Google!" });
    } catch (error: any) {
      toast({ title: "Login Failed", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isSignUp) {
        await initiateEmailSignUp(auth, email, password);
        toast({ title: "Account Created", description: "Welcome!" });
      } else {
        await initiateEmailSignIn(auth, email, password);
        toast({ title: "Welcome Back", description: "Successfully logged in." });
      }
    } catch (error: any) {
      toast({ title: "Authentication Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const appVerifier = setupRecaptcha(auth, 'recaptcha-container');
      const result = await initiatePhoneSignIn(auth, phone, appVerifier);
      setConfirmationResult(result);
      toast({ title: "Code Sent", description: "Check your phone for the code." });
    } catch (error: any) {
      toast({ title: "Phone Auth Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmationResult) return;
    setLoading(true);
    try {
      await confirmationResult.confirm(verificationCode);
      toast({ title: "Success", description: "Phone verified!" });
    } catch (error: any) {
      toast({ title: "Verification Failed", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (isUserLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F0F8]">
      <Navbar />
      <main className="container mx-auto px-4 pt-32 pb-20 flex justify-center">
        <Card className="w-full max-w-md glass-card">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">Get Started</CardTitle>
            <CardDescription>Join Ultra All AI</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="google" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="google">Google</TabsTrigger>
                <TabsTrigger value="email">Email</TabsTrigger>
                <TabsTrigger value="phone">Phone</TabsTrigger>
              </TabsList>

              <TabsContent value="google" className="py-4 text-center">
                <Button 
                  onClick={handleGoogleLogin} 
                  disabled={loading}
                  className="w-full gradient-bg text-white h-12 text-lg"
                >
                  {loading ? <Loader2 className="animate-spin mr-2" /> : <Chrome className="mr-2" />}
                  Continue with Google
                </Button>
              </TabsContent>

              <TabsContent value="email">
                <form onSubmit={handleEmailAuth} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                      <Input id="email" type="email" placeholder="name@example.com" className="pl-10" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                      <Input id="password" type="password" className="pl-10" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                  </div>
                  <Button type="submit" disabled={loading} className="w-full gradient-bg text-white h-12">
                    {loading && <Loader2 className="animate-spin mr-2" />}
                    {isSignUp ? "Create Account" : "Sign In"}
                  </Button>
                  <Button type="button" variant="link" className="w-full" onClick={() => setIsSignUp(!isSignUp)}>
                    {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="phone">
                {!confirmationResult ? (
                  <form onSubmit={handlePhoneSignIn} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                        <Input id="phone" type="tel" placeholder="+1234567890" className="pl-10" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                      </div>
                    </div>
                    <div id="recaptcha-container"></div>
                    <Button type="submit" disabled={loading} className="w-full gradient-bg text-white h-12">
                      {loading ? <Loader2 className="animate-spin mr-2" /> : "Send Code"}
                    </Button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyCode} className="space-y-4">
                    <Label htmlFor="code">Verification Code</Label>
                    <Input id="code" placeholder="123456" value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} required />
                    <Button type="submit" disabled={loading} className="w-full gradient-bg text-white h-12">
                      {loading ? <Loader2 className="animate-spin mr-2" /> : "Verify Code"}
                    </Button>
                  </form>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
