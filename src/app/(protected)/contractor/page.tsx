"use client";

import { Card } from "@/components/ui/card";
import type { Job } from '@prisma/client';
import { useState, useEffect } from 'react';
import { applyForJob, startJob, completeJob } from '@/app/actions/job';
import { useToast } from "@/components/ui/use-toast";
import { useRBAC } from '@/hooks/use-rbac';
import { useUser } from '@/components/UserContext';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/StatusBadge';

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
    <Button
      variant="secondary"
      size="sm"
      className="w-full"
      disabled={loading}
      onClick={handleAction}
    >
      {loading ? '...' : label}
    </Button>
  );
}

export default function ContractorDashboard() {
  const { canViewJob } = useRBAC();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchJobs() {
      try {
        const response = await fetch('/api/job');
        if (!response.ok) throw new Error('Failed to fetch jobs');
        const data = await response.json();
        setJobs(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load jobs');
      } finally {
        setLoading(false);
      }
    }
    fetchJobs();
  }, []);

  const visibleJobs = jobs.filter(canViewJob);

  return (
    <div className="bg-background min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-white">Contractor Dashboard</h1>
        {loading && (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}
        {error && (
          <div className="mb-4 p-4 bg-destructive/10 text-destructive rounded-lg">
            {error}
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {visibleJobs.map(job => (
            <Card key={job.id} className="p-4 flex flex-col gap-4 bg-surface border border-border">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2 text-white">{job.title}</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <StatusBadge status={job.status} />
                    <span className="text-sm text-muted-foreground">{job.locationId}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">{job.description}</p>
                  <StatusButton job={job} onAction={() => {}} />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
      <footer className="text-sm text-muted text-center mt-6">Powered by Tofil Group</footer>
    </div>
  );
} 