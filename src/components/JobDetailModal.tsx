import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Job, User } from '@prisma/client';
import { format } from 'date-fns';

type JobHistoryLite = {
  id: string;
  jobId: string;
  userId: string;
  action: string;
  createdAt: Date | string;
  user: User;
};

type JobWithHistory = Job & {
  jobHistories: JobHistoryLite[];
};

interface JobDetailModalProps {
  job: JobWithHistory | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function JobDetailModal({ job, open, onOpenChange }: JobDetailModalProps) {
  if (!job) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{job.title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
            <p className="mt-1">{job.description}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
            <p className="mt-1">
              <span className="px-2 py-1 rounded bg-accent text-foreground-dark text-xs font-semibold uppercase tracking-wide">
                {job.status.replace(/_/g, ' ')}
              </span>
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Location</h3>
            <p className="mt-1">{job.locationId}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Contractor</h3>
            <p className="mt-1">{job.contractorId ? job.contractorId : "Not assigned"}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">History</h3>
            <div className="mt-2 space-y-2">
              {job.jobHistories.map((history) => (
                <div key={history.id} className="flex items-start space-x-2 text-sm">
                  <div className="flex-1">
                    <p>
                      <span className="font-medium">{history.user.email}</span>
                      {" "}
                      <span className="text-muted-foreground">
                        {history.action.toLowerCase()}d the job
                      </span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(history.createdAt), 'PPp')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 