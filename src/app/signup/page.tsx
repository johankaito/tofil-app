"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useUser } from "@/components/UserContext";
import { supabase } from "@/lib/supabase";

export default function SignupPage() {
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
  }, []);

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
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Card className="w-full max-w-sm p-6 space-y-6">
        <div className="flex justify-center mb-2">
          <Image src="/logo.png" alt="Tofil Logo" width={64} height={64} />
        </div>
        <h1 className="text-2xl font-bold text-center">Sign Up</h1>
        <p className="text-center text-muted-foreground">Create a new account</p>
        <form className="space-y-4" onSubmit={handleSignup}>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <Button className="w-full" type="submit" disabled={loading}>{loading ? "Sending..." : "Sign Up"}</Button>
        </form>
        {message && <p className="text-center text-sm text-muted-foreground">{message}</p>}
        <div className="text-center">
          <a href="/login" className="text-sm underline">Back to login</a>
        </div>
      </Card>
    </div>
  );
} 