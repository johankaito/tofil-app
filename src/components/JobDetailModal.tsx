import { Card } from "@/components/ui/card";
import { useTheme } from "next-themes";
import { Job } from '@prisma/client';

export function JobDetailModal({ job, onClose }: { job: Job; onClose: () => void }) {
  const { resolvedTheme } = useTheme();
  if (!job) return null;
  const overlayBg = resolvedTheme === "dark" ? "bg-black/40" : "bg-black/20";
  const placeholderBg = resolvedTheme === "dark" ? "bg-muted" : "bg-gray-100";
  return (
    <div className={`fixed inset-0 flex items-center justify-center z-50 ${overlayBg}`}>
      <Card className="w-full max-w-md p-6 relative">
        <button className="absolute top-2 right-2 text-lg" onClick={onClose}>&times;</button>
        <div className="font-bold text-xl mb-2">{job.title}</div>
        <div className="text-muted-foreground mb-2">{job.locationId}</div>
        <div className="mb-4">{job.description}</div>
        <div className={`${placeholderBg} h-32 mb-4 flex items-center justify-center`}>Media Placeholder</div>
        <div className="flex gap-2 justify-end">
          <button className="underline text-xs" onClick={() => alert('Options stub')}>Options</button>
          <button className="underline text-xs" onClick={() => alert('Apply stub')}>Apply</button>
        </div>
      </Card>
    </div>
  );
} 