"use client";

import { Card } from "@/components/ui/card";
import { Job } from '@prisma/client';

const jobs: Job[] = [
  { id: "1", title: "Job 1", description: "Description of the job...", status: "PENDING_REVIEW", ownerId: "", contractorId: null, locationId: "NYC" },
  { id: "2", title: "Job 2", description: "Description of the job...", status: "PENDING_REVIEW", ownerId: "", contractorId: null, locationId: "SF" },
];

function applyToJob(jobId: number) {
  alert(`Apply to job ${jobId} (stub)`);
}

export default function ContractorDashboard() {
  // const { resolvedTheme } = useTheme();
  // Example: you can use resolvedTheme for custom logic
  // console.log('Current theme:', resolvedTheme);
  return (
    <div className="bg-background min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Contractor Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {jobs.map(job => (
          <Card key={job.id} className="p-4 flex flex-col gap-2 bg-background-table text-foreground">
            <div className="font-semibold text-lg">{job.title}</div>
            <div className="text-sm text-muted-foreground">{job.locationId}</div>
            <div className="text-sm">{job.description}</div>
            <button className="mt-2 underline text-xs self-end text-accent hover:text-primary" onClick={() => applyToJob(Number(job.id))}>Apply</button>
          </Card>
        ))}
      </div>
    </div>
  );
} 