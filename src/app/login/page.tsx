"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useUser } from "@/components/UserContext";
import { getSupabaseClient } from "@/lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();
  const { setUser } = useUser();
  const supabase = getSupabaseClient();

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      const user = data.user;
      if (user) {
        // Fetch corresponding app user
        let { data: tofilUser } = await supabase
          .from("User")
          .select("*")
          .eq("id", user.id)
          .single();
        if (!tofilUser) {
          // If not found, create user in app DB
          const { data: inserted } = await supabase.from("User").insert({ id: user.id, email: user.email, type: "OWNER" }).select().single();
          tofilUser = inserted;
        }
        setUser({ supabaseUser: user, tofilUser });
        const userType = tofilUser?.type || "OWNER";
        if (userType === "OWNER") router.replace("/owner");
        else if (userType === "CONTRACTOR") router.replace("/contractor");
        else if (userType === "ADMIN") router.replace("/admin");
      } else {
        setLoading(false);
      }
    });
  }, [router, setUser, supabase]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setMessage("");
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) setMessage(error.message);
    else setMessage("Check your email for the magic link!");
    setFormLoading(false);
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
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Card className="w-full max-w-sm p-6 space-y-6">
        <div className="flex justify-center mb-2">
          <Image src="/logo.png" alt="Tofil Logo" width={64} height={64} />
        </div>
        <h1 className="text-2xl font-bold text-center">Login</h1>
        <p className="text-center text-muted-foreground">Login to your account</p>
        <form className="space-y-4" onSubmit={handleLogin}>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <Button className="w-full" type="submit" disabled={formLoading}>{formLoading ? "Sending..." : "Login"}</Button>
        </form>
        {message && <p className="text-center text-sm text-muted-foreground">{message}</p>}
        <div className="text-center">
          <a href="/signup" className="text-sm underline">Sign up</a>
        </div>
      </Card>
    </div>
  );
} 