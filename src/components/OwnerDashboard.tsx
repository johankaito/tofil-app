import React, { useState, useEffect } from 'react';
import { Job } from '@prisma/client';
import { useToast } from "@/components/ui/use-toast";
import { useRBAC } from '@/hooks/use-rbac';
import { useUser } from '@/components/UserContext';
import { archiveJob, duplicateJob } from '@/app/actions/job';

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
    <>
      {canDuplicateJob(job) && (
        <button
          className="mr-2 underline text-xs text-accent hover:text-primary disabled:opacity-50"
          disabled={loading}
          onClick={handleDuplicate}
        >
          Duplicate
        </button>
      )}
      {canArchiveJob(job) && (
        <button
          className="underline text-xs text-accent hover:text-primary disabled:opacity-50"
          disabled={loading}
          onClick={handleArchive}
        >
          Archive
        </button>
      )}
    </>
  );
}

function OwnerDashboard() {
  const { canViewJob } = useRBAC();
  const [jobs, setJobs] = useState<Job[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    <div className="bg-background min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Owner Dashboard</h1>
      {loading && <div className="mb-4">Loading jobs...</div>}
      {error && <div className="mb-4 text-red-500">{error}</div>}
      <div className="overflow-x-auto">
        <table className="min-w-full border text-sm">
          <thead>
            <tr className="bg-background-table text-foreground">
              <th className="p-2 border">Title</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Location</th>
              <th className="p-2 border">Contractor</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {visibleJobs.map(job => (
              <tr key={job.id} className="border-b bg-background-table text-foreground">
                <td className="p-2 border">{job.title}</td>
                <td className="p-2 border">
                  <span className="px-2 py-1 rounded bg-accent text-foreground-dark text-xs font-semibold uppercase tracking-wide">
                    {job.status.replace(/_/g, ' ')}
                  </span>
                </td>
                <td className="p-2 border">{job.locationId}</td>
                <td className="p-2 border">{job.contractorId ? job.contractorId : "N/A"}</td>
                <td className="p-2 border">
                  <RowActions job={job} onArchive={fetchJobs} onDuplicate={fetchJobs} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default OwnerDashboard; 