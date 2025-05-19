import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function OnboardingPage() {
  // Placeholder: Replace with actual user context logic
  const user = { type: 'OWNER' };

  return (
    <div className="bg-background text-white min-h-screen flex items-center justify-center px-4">
      <Card className="bg-surface border border-border shadow-lg rounded-lg max-w-md w-full mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold mb-2 text-white">Onboarding</h1>
        {user.type === 'OWNER' && (
          <form className="w-full flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="company" className="text-white">Company Name</Label>
              <Input id="company" placeholder="Enter your company name" className="bg-[#111111] border border-[#333] text-white placeholder-muted" />
            </div>
            <Button type="submit" className="w-full bg-primary text-white hover:bg-primary-light rounded-md py-2 font-semibold text-base">Complete Onboarding</Button>
          </form>
        )}
        {user.type === 'CONTRACTOR' && (
          <form className="w-full flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="skills" className="text-white">Skills</Label>
              <Input id="skills" placeholder="List your skills" className="bg-[#111111] border border-[#333] text-white placeholder-muted" />
            </div>
            <Button type="submit" className="w-full bg-primary text-white hover:bg-primary-light rounded-md py-2 font-semibold text-base">Complete Onboarding</Button>
          </form>
        )}
        {user.type === 'MANAGER' && (
          <form className="w-full flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="department" className="text-white">Department</Label>
              <Input id="department" placeholder="Enter your department" className="bg-[#111111] border border-[#333] text-white placeholder-muted" />
            </div>
            <Button type="submit" className="w-full bg-primary text-white hover:bg-primary-light rounded-md py-2 font-semibold text-base">Complete Onboarding</Button>
          </form>
        )}
      </Card>
      <footer className="text-sm text-muted text-center mt-6">Powered by Tofil Group</footer>
    </div>
  );
} 