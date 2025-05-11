"use client";

import { Card } from "@/components/ui/card";

const jobs = [
  { id: 1, title: "Job 1", location: "NYC", description: "Description of the job..." },
  { id: 2, title: "Job 2", location: "SF", description: "Description of the job..." },
];

function applyToJob(jobId: number) {
  alert(`Apply to job ${jobId} (stub)`);
}

export default function ContractorDashboard() {
  return (
    <div className="bg-background min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Contractor Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {jobs.map(job => (
          <Card key={job.id} className="p-4 flex flex-col gap-2 bg-background-table text-foreground">
            <div className="font-semibold text-lg">{job.title}</div>
            <div className="text-sm text-muted-foreground">{job.location}</div>
            <div className="text-sm">{job.description}</div>
            <button className="mt-2 underline text-xs self-end text-accent hover:text-primary" onClick={() => applyToJob(job.id)}>Apply</button>
          </Card>
        ))}
      </div>
    </div>
  );
} 