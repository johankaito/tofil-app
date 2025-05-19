"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/components/UserContext";
import { getSupabaseClient } from "@/lib/supabase";
import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();
  const { setUser } = useUser();
  const supabase = getSupabaseClient();

  // Handle email submit (send OTP)
  const onEmailSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormLoading(true);
    setMessage("");
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) {
      setMessage(error.message);
      setFormLoading(false);
      return;
    }
    setShowOtpInput(true);
    setMessage("OTP sent! Please check your email.");
    setFormLoading(false);
  };

  // Handle OTP submit (verify OTP)
  const onOtpSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormLoading(true);
    setMessage("");
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: "email",
    });
    if (error) {
      setMessage(error.message);
      setFormLoading(false);
      return;
    }
    // Fetch or create app user
    let { data: tofilUser } = await supabase
      .from("User")
      .select("*")
      .eq("id", data.user?.id)
      .single();
    if (!tofilUser && data.user) {
      const { data: inserted } = await supabase.from("User").insert({ id: data.user.id, email: data.user.email, type: "OWNER" }).select().single();
      tofilUser = inserted;
    }
    setUser({ supabaseUser: data.user, tofilUser });
    const userType = tofilUser?.type || "OWNER";
    if (userType === "OWNER") router.replace("/owner");
    else if (userType === "CONTRACTOR") router.replace("/contractor");
    else if (userType === "ADMIN") router.replace("/admin");
    setFormLoading(false);
  };

  const onBackToEmail = () => {
    setShowOtpInput(false);
    setOtp("");
    setMessage("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <LoginForm
        email={email}
        setEmail={setEmail}
        otp={otp}
        setOtp={setOtp}
        showOtpInput={showOtpInput}
        formLoading={formLoading}
        onEmailSubmit={onEmailSubmit}
        onOtpSubmit={onOtpSubmit}
        onBackToEmail={onBackToEmail}
        logoSrc="/logo.png"
        appName="Tofil"
      />
      {message && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-card border border-border px-4 py-2 rounded shadow text-center z-50">
          <span className="text-sm text-muted-foreground">{message}</span>
        </div>
      )}
    </div>
  );
}
