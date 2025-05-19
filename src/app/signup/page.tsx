"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useUser } from "@/components/UserContext";
import { getSupabaseClient } from "@/lib/supabase";

export default function SignupPage() {
  const supabase = getSupabaseClient();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();
  const { setUser } = useUser();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const user = data.user;
      if (user) {
        // TODO: fetch user.type from your DB, here we stub OWNER
        const userType = "OWNER"; // Replace with real fetch
        if (userType === "OWNER") router.replace("/owner");
        else if (userType === "CONTRACTOR") router.replace("/contractor");
        else if (userType === "ADMIN") router.replace("/admin");
      }
    });
  }, [router, supabase.auth]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) setMessage(error.message);
    else {
      setMessage("Check your email for the magic link!");
      // After signup, poll for user and create in app DB
      const pollForUser = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          // Check if user exists in app DB
          const { data: existing } = await supabase
            .from("User")
            .select("*")
            .eq("id", user.id)
            .single();
          let tofilUser = existing;
          if (!existing) {
            const { data: inserted } = await supabase.from("User").insert({ id: user.id, email: user.email, type: "OWNER" }).select().single();
            tofilUser = inserted;
          }
          setUser({ supabaseUser: user, tofilUser });
        } else {
          setTimeout(pollForUser, 1000);
        }
      };
      pollForUser();
    }
    setLoading(false);
  };

  return (
    <div className="bg-background text-white min-h-screen flex items-center justify-center px-4">
      <Card className="bg-surface border border-border shadow-lg rounded-lg max-w-md w-full mx-auto px-6 py-8">
        <Image src="/logo.png" alt="Tofil Logo" width={64} height={64} className="mb-6" />
        <h1 className="text-3xl font-bold mb-2 text-white">Tofil</h1>
        <h2 className="text-2xl font-semibold mb-4 text-white">Sign Up</h2>
        <p className="text-muted mb-6 text-center">Create a new account</p>
        <form className="w-full flex flex-col gap-4" onSubmit={handleSignup}>
          <div className="flex flex-col gap-2">
            <Label htmlFor="email" className="text-white">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="jess....@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="bg-[#111111] border border-[#333] text-white placeholder-muted"
              autoComplete="email"
              disabled={loading}
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-primary text-white hover:bg-primary-light rounded-md py-2 font-semibold text-base"
            disabled={loading}
          >
            {loading ? "Sending..." : "Sign Up"}
          </Button>
        </form>
        {message && <p className="text-center text-sm text-muted-foreground mt-4">{message}</p>}
        <div className="mt-6 text-sm text-muted text-center w-full">
          Already have an account?{' '}
          <a href="/login" className="text-accent hover:underline">Back to login</a>
        </div>
      </Card>
      <footer className="text-sm text-muted text-center mt-6">Powered by Tofil Group</footer>
    </div>
  );
} 