import React, { useState, useEffect } from 'react';
import { Job } from '@prisma/client';
import { useToast } from "@/components/ui/use-toast";
import { useRBAC } from '@/hooks/use-rbac';
import { useUser } from '@/components/UserContext';
import { archiveJob, duplicateJob } from '@/app/actions/job';
import { CreateJobModal } from './CreateJobModal';
import { Button } from '@/components/ui/button';
import { StatusBadge } from './StatusBadge';
import { Card } from '@/components/ui/card';

const mockJobs: Job[] = [
  { id: "1", title: "Job 1", description: "", status: "PENDING_REVIEW", ownerId: "", contractorId: null, locationId: "NYC" },
  { id: "2", title: "Job 2", description: "", status: "IN_PROGRESS", ownerId: "", contractorId: null, locationId: "SF" },
];

function RowActions({ job, onArchive, onDuplicate }: { job: Job; onArchive: () => void; onDuplicate: () => void }) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { canArchiveJob, canDuplicateJob } = useRBAC();
  const { tofilUser } = useUser();

  const handleArchive = async () => {
    if (!tofilUser || !tofilUser.id) {
      toast({
        title: "Error",
        description: "You must be logged in to perform this action",
        variant: "destructive",
      });
      return;
    }

    if (!canArchiveJob(job)) {
      toast({
        title: "Error",
        description: "You don't have permission to archive this job",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const result = await archiveJob(job.id, tofilUser.id);
      if (result.success) {
        toast({
          title: "Success",
          description: "Job archived successfully",
        });
        onArchive();
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to archive job",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to archive job",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDuplicate = async () => {
    if (!tofilUser || !tofilUser.id) {
      toast({
        title: "Error",
        description: "You must be logged in to perform this action",
        variant: "destructive",
      });
      return;
    }

    if (!canDuplicateJob(job)) {
      toast({
        title: "Error",
        description: "You don't have permission to duplicate this job",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const result = await duplicateJob(job.id, tofilUser.id);
      if (result.success) {
        toast({
          title: "Success",
          description: "Job duplicated successfully",
        });
        onDuplicate();
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to duplicate job",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to duplicate job",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {canDuplicateJob(job) && (
        <Button
          variant="ghost"
          size="sm"
          className="text-accent hover:text-primary disabled:opacity-50"
          disabled={loading}
          onClick={handleDuplicate}
        >
          Duplicate
        </Button>
      )}
      {canArchiveJob(job) && (
        <Button
          variant="ghost"
          size="sm"
          className="text-accent hover:text-primary disabled:opacity-50"
          disabled={loading}
          onClick={handleArchive}
        >
          Archive
        </Button>
      )}
    </div>
  );
}

export default function OwnerDashboard() {
  const { canViewJob } = useRBAC();
  const [jobs, setJobs] = useState<Job[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/job');
      if (!res.ok) throw new Error('Failed to fetch jobs');
      const data = await res.json();
      if (Array.isArray(data)) {
        setJobs(data);
      } else {
        setJobs(mockJobs);
      }
    } catch {
      setError('Could not load jobs, showing mock data.');
      setJobs(mockJobs);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const visibleJobs = (jobs || mockJobs).filter(canViewJob);

  return (
    <div className="bg-background min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-white">Owner Dashboard</h1>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <Button onClick={() => setCreateModalOpen(true)}>
            Create Job
          </Button>
        </div>
        
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

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {visibleJobs.map(job => (
            <Card key={job.id} className="p-4 flex flex-col gap-4 bg-background-table">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">{job.title}</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <StatusBadge status={job.status} />
                    <span className="text-sm text-muted-foreground">{job.locationId}</span>
                  </div>
                  {job.contractorId && (
                    <div className="text-sm text-muted-foreground">
                      Contractor: {job.contractorId}
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-auto">
                <RowActions job={job} onArchive={fetchJobs} onDuplicate={fetchJobs} />
              </div>
            </Card>
          ))}
        </div>

        <CreateJobModal
          open={createModalOpen}
          onOpenChange={setCreateModalOpen}
          onJobCreated={fetchJobs}
        />
      </div>
      <footer className="text-sm text-muted text-center mt-6">Powered by Tofil Group</footer>
    </div>
  );
} 