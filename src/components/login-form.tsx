'use client';

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import Link from "next/link"

interface LoginFormProps extends React.HTMLAttributes<HTMLDivElement> {
  email: string;
  setEmail: (email: string) => void;
  otp: string;
  setOtp: (otp: string) => void;
  showOtpInput: boolean;
  formLoading: boolean;
  onEmailSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onOtpSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onBackToEmail: () => void;
  logoSrc: string;
  appName: string;
}

export function LoginForm({
  className,
  email,
  setEmail,
  otp,
  setOtp,
  showOtpInput,
  formLoading,
  onEmailSubmit,
  onOtpSubmit,
  onBackToEmail,
  logoSrc,
  appName,
  ...props
}: LoginFormProps) {
  return (
    <div className={cn("flex flex-col", className)} {...props}>
      <Card className="w-full shadow-xl">
        <CardHeader className="text-center items-center flex flex-col">
          <Image src={logoSrc} alt={`${appName} Logo`} width={48} height={48} className="mb-4" />
          <CardTitle className="text-3xl font-bold">
            {showOtpInput ? "Enter OTP" : "Login"}
          </CardTitle>
          <CardDescription className="pt-1">
            {showOtpInput ? `An OTP was sent to ${email}.` : `Login to your ${appName} account`}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {!showOtpInput ? (
            <form onSubmit={onEmailSubmit} className="flex flex-col gap-4">
              <div className="grid gap-1.5">
                <Label htmlFor="email" className="sr-only">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john.g.keto@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={formLoading}
                  autoComplete="email"
                />
              </div>
              <Button
                type="submit"
                className="w-full h-10 font-semibold"
                disabled={formLoading}
              >
                {formLoading ? "Sending..." : "Login"}
              </Button>
            </form>
          ) : (
            <form onSubmit={onOtpSubmit} className="flex flex-col gap-4">
              <p className="text-center text-sm text-muted-foreground">
                Check your email for the magic link! 
              </p>
              <div className="grid gap-1.5">
                <Label htmlFor="otp" className="sr-only">
                  OTP
                </Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  className="text-center tracking-[0.3em]"
                  disabled={formLoading}
                  autoComplete="one-time-code"
                  maxLength={6}
                />
              </div>
              <Button
                type="submit"
                className="w-full h-10 font-semibold"
                disabled={formLoading || otp.length < 6}
              >
                {formLoading ? "Verifying..." : "Verify OTP"}
              </Button>
              <Button
                type="button"
                variant="secondary"
                className="w-full h-10" 
                onClick={onBackToEmail}
                disabled={formLoading}
              >
                Back to Email
              </Button>
            </form>
          )}
          <div className="mt-2 text-center text-sm">
            <span className="text-muted-foreground">Don&apos;t have an account? </span>
            <Link href="/signup" className="underline underline-offset-4 text-primary hover:text-primary/90">
                Sign up
            </Link>
            </div>
        </CardContent>
      </Card>
    </div>
  )
}
