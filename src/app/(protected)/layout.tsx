"use client";

import { ReactNode, useEffect, useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { supabase } from "@/lib/supabase";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) {
        router.replace("/login");
      } else {
        // Fetch user type
        const { data: profile } = await supabase
          .from("User")
          .select("type")
          .eq("id", data.user.id)
          .single();
        setUserType(profile?.type || null);
        setLoading(false);
      }
    });
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/login");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-6">
          <Image src="/logo.png" alt="Tofil Logo" width={64} height={64} className="mx-auto" />
          <div className="text-lg animate-pulse">Checking authentication…</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex items-center justify-between px-4 py-2 border-b">
        <div className="flex items-center gap-4">
          <Image src="/logo.png" alt="Tofil Logo" width={40} height={40} className="h-10 w-auto" />
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <button onClick={handleLogout} className="px-3 py-1 rounded bg-accent text-foreground-dark font-semibold hover:bg-primary transition">Logout</button>
        </div>
      </header>
      <div className="flex flex-1">
        <aside className="hidden md:block w-48 border-r p-4">
          <div className="mb-4 font-semibold">Sidebar</div>
          <ul className="space-y-2">
            <li className="font-medium">Dashboard</li>
            {userType === "MANAGER" && (
              <li>
                <a href="/manager" className="font-medium hover:underline text-accent">Manager</a>
              </li>
            )}
            {/* Future items */}
          </ul>
        </aside>
        <main className="flex-1 p-4">{children}</main>
      </div>
    </div>
  );
} 