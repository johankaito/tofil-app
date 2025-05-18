import { DialogFooter } from "@/components/ui/dialog";
import { Job, User, Location, JobStatus } from '@prisma/client';
import { JobHistory } from "./JobHistory";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from "@/components/UserContext";
import { useRBAC } from "@/hooks/use-rbac";
import { BaseModal } from "@/components/BaseModal";

type JobWithHistory = Job & {
  jobHistories: {
    id: string;
    action: string;
    createdAt: Date;
    user: {
      email: string;
    };
  }[];
  owner: User;
  contractor?: User;
  location?: Location;
};

type JobDetailModalProps = {
  job: JobWithHistory;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onJobUpdate: () => void;
};

const JOB_STATUSES: { value: JobStatus; label: string }[] = [
  { value: "PENDING_REVIEW", label: "Pending Review" },
  { value: "AVAILABLE", label: "Available" },
  { value: "CLAIMED", label: "Claimed" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "COMPLETED", label: "Completed" },
  { value: "ARCHIVED", label: "Archived" },
];

export function JobDetailModal({ job, open, onOpenChange, onJobUpdate }: JobDetailModalProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { tofilUser } = useUser();
  const { canUpdateJobStatus } = useRBAC();

  const handleStatusChange = async (newStatus: JobStatus) => {
    if (!tofilUser?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to perform this action",
        variant: "destructive",
      });
      return;
    }

    if (!canUpdateJobStatus(job)) {
      toast({
        title: "Error",
        description: "You don't have permission to update this job's status",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/job/${job.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...job,
          status: newStatus,
        }),
      });

      if (!response.ok) throw new Error('Failed to update job status');

      toast({
        title: "Success",
        description: "Job status updated successfully",
      });
      onJobUpdate();
    } catch {
      toast({
        title: "Error",
        description: "Failed to update job status",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <BaseModal
      open={open}
      onOpenChange={onOpenChange}
      title={job.title}
      description={job.description}
    >
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="font-semibold mb-2">Job Details</h3>
          <div className="space-y-2">
            <div>
              <span className="text-muted-foreground">Status:</span>{" "}
              {canUpdateJobStatus(job) ? (
                <Select
                  defaultValue={job.status}
                  onValueChange={handleStatusChange}
                  disabled={loading}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {JOB_STATUSES.map(status => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <span className="font-medium">{job.status}</span>
              )}
            </div>
            <div>
              <span className="text-muted-foreground">Owner:</span>{" "}
              <span className="font-medium">{job.owner.email}</span>
            </div>
            {job.contractor && (
              <div>
                <span className="text-muted-foreground">Contractor:</span>{" "}
                <span className="font-medium">{job.contractor.email}</span>
              </div>
            )}
            {job.location && (
              <div>
                <span className="text-muted-foreground">Location:</span>{" "}
                <span className="font-medium">{job.location.name}</span>
              </div>
            )}
          </div>
        </div>
        <div>
          <JobHistory jobId={job.id} />
        </div>
      </div>
      <DialogFooter>
        <Button onClick={() => onOpenChange(false)}>
          Close
        </Button>
      </DialogFooter>
    </BaseModal>
  );
} 