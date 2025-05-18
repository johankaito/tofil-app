import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Job, User, Location } from '@prisma/client';
import { JobHistory } from "./JobHistory";
import { Button } from "@/components/ui/button";

type JobHistoryLite = {
  id: string;
  action: string;
  createdAt: Date;
  user: {
    email: string;
  };
};

type JobWithHistory = Job & {
  jobHistories: JobHistoryLite[];
  owner: User;
  contractor?: User;
  location?: Location;
};

type JobDetailModalProps = {
  job: JobWithHistory;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function JobDetailModal({ job, open, onOpenChange }: JobDetailModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{job.title}</DialogTitle>
          <DialogDescription>{job.description}</DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold mb-2">Job Details</h3>
            <div className="space-y-2">
              <div>
                <span className="text-muted-foreground">Status:</span>{" "}
                <span className="font-medium">{job.status}</span>
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
      </DialogContent>
    </Dialog>
  );
} 