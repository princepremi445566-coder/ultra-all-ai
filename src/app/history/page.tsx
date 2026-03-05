"use client";

import { useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy } from "firebase/firestore";
import { format } from "date-fns";
import { History as HistoryIcon, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function HistoryPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push("/login");
    }
  }, [user, isUserLoading, router]);

  const historyQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(
      collection(firestore, 'users', user.uid, 'toolUsageLogs'),
      orderBy('timestamp', 'desc')
    );
  }, [firestore, user]);

  const { data: logs, isLoading } = useCollection(historyQuery);

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
      <main className="container mx-auto px-4 pt-32 pb-20">
        <Link href="/dashboard" className="inline-flex items-center text-primary font-medium mb-8 hover:underline">
          <ArrowLeft size={18} className="mr-2" /> Back to Dashboard
        </Link>

        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 gradient-bg text-white rounded-xl flex items-center justify-center shadow-lg">
            <HistoryIcon size={24} />
          </div>
          <h1 className="text-4xl font-bold">Usage <span className="gradient-text">History</span></h1>
        </div>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Your Activity Records</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="animate-spin text-primary" size={32} />
              </div>
            ) : logs && logs.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Tool Used</TableHead>
                    <TableHead>Input Summary</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-medium whitespace-nowrap">
                        {format(new Date(log.timestamp), "MMM d, yyyy HH:mm")}
                      </TableCell>
                      <TableCell>{log.toolName}</TableCell>
                      <TableCell className="max-w-md truncate text-muted-foreground">
                        {log.inputData.length > 100 ? log.inputData.substring(0, 100) + "..." : log.inputData}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                No activity logs found yet. Start using our tools!
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
