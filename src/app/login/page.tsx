import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) setMessage(error.message);
    else setMessage("Check your email for the magic link!");
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Card className="w-full max-w-sm p-6 space-y-6">
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
          <Button className="w-full" type="submit" disabled={loading}>{loading ? "Sending..." : "Login"}</Button>
        </form>
        {message && <p className="text-center text-sm text-muted-foreground">{message}</p>}
        <div className="text-center">
          <a href="/signup" className="text-sm underline">Sign up</a>
        </div>
      </Card>
    </div>
  );
} 