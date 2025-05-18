"use client";

import { Card } from "@/components/ui/card";
import { Job } from '@prisma/client';
import { useState } from 'react';
import { applyForJob, startJob, completeJob } from '@/app/actions/job';
import { useToast } from "@/components/ui/use-toast";
import { useRBAC } from '@/hooks/use-rbac';
import { useUser } from '@/components/UserContext';

const jobs: Job[] = [
  { id: "1", title: "Job 1", description: "Description of the job...", status: "PENDING_REVIEW", ownerId: "", contractorId: null, locationId: "NYC" },
  { id: "2", title: "Job 2", description: "Description of the job...", status: "PENDING_REVIEW", ownerId: "", contractorId: null, locationId: "SF" },
];

function StatusButton({ job, onAction }: { job: Job; onAction: (action: string) => void }) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { canApplyForJob, canStartJob, canCompleteJob } = useRBAC();
  const { tofilUser } = useUser();
  
  let label = '';
  let action = '';
  let canPerformAction = false;

  if (job.status === 'AVAILABLE') {
    label = 'Apply';
    action = 'apply';
    canPerformAction = canApplyForJob(job);
  } else if (job.status === 'CLAIMED') {
    label = 'Start';
    action = 'start';
    canPerformAction = canStartJob(job);
  } else if (job.status === 'IN_PROGRESS') {
    label = 'Complete';
    action = 'complete';
    canPerformAction = canCompleteJob(job);
  } else {
    return null;
  }

  if (!canPerformAction) {
    return null;
  }

  const handleAction = async () => {
    if (!tofilUser || !tofilUser.id) {
      toast({
        title: "Error",
        description: "You must be logged in to perform this action",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      let result;
      switch (action) {
        case 'apply':
          result = await applyForJob(job.id, tofilUser.id);
          break;
        case 'start':
          result = await startJob(job.id, tofilUser.id);
          break;
        case 'complete':
          result = await completeJob(job.id, tofilUser.id);
          break;
      }
      
      if (result?.success) {
        toast({
          title: "Success",
          description: `Job ${action}ed successfully`,
        });
        onAction(action);
      } else {
        toast({
          title: "Error",
          description: result?.error || `Failed to ${action} job`,
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Error",
        description: `Failed to ${action} job`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className="mt-2 underline text-xs self-end text-accent hover:text-primary disabled:opacity-50"
      disabled={loading}
      onClick={handleAction}
    >
      {loading ? '...' : label}
    </button>
  );
}

export default function ContractorDashboard() {
  const { canViewJob } = useRBAC();
  const visibleJobs = jobs.filter(canViewJob);

  return (
    <div className="bg-background min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Contractor Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {visibleJobs.map(job => (
          <Card key={job.id} className="p-4 flex flex-col gap-2 bg-background-table text-foreground">
            <div className="font-semibold text-lg">{job.title}</div>
            <div className="text-sm text-muted-foreground">{job.locationId}</div>
            <div className="text-sm">{job.description}</div>
            <StatusButton job={job} onAction={() => {
              // Action handled in StatusButton component
            }} />
          </Card>
        ))}
      </div>
    </div>
  );
} 