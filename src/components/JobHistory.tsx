import { useEffect, useState } from "react";
import { getJobHistory, JobHistoryAction } from "@/lib/services/jobHistory";
import { format } from "date-fns";
import { IconClock } from "@tabler/icons-react";

type JobHistoryEntry = {
  id: string;
  action: JobHistoryAction;
  details?: string;
  createdAt: string;
  user: {
    id: string;
    email: string;
    type: string;
  };
};

const actionLabels: Record<JobHistoryAction, string> = {
  JOB_CREATED: "Job Created",
  JOB_UPDATED: "Job Updated",
  JOB_STATUS_CHANGED: "Status Changed",
  JOB_ASSIGNED: "Job Assigned",
  JOB_UNASSIGNED: "Job Unassigned",
  JOB_COMPLETED: "Job Completed",
  JOB_ARCHIVED: "Job Archived",
};

export function JobHistory({ jobId }: { jobId: string }) {
  const [history, setHistory] = useState<JobHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadHistory() {
      try {
        const data = await getJobHistory(jobId);
        setHistory(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load job history");
      } finally {
        setLoading(false);
      }
    }
    loadHistory();
  }, [jobId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500">
        Error: {error}
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="p-4 text-muted-foreground text-center">
        No history available
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-lg font-semibold">
        <IconClock className="h-5 w-5" />
        <span>Job History</span>
      </div>
      <div className="space-y-4">
        {history.map((entry) => (
          <div key={entry.id} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
              <div className="w-0.5 h-full bg-border"></div>
            </div>
            <div className="flex-1 pb-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">{actionLabels[entry.action]}</span>
                <span className="text-sm text-muted-foreground">
                  {format(new Date(entry.createdAt), "MMM d, yyyy h:mm a")}
                </span>
              </div>
              {entry.details && (
                <p className="text-sm text-muted-foreground mt-1">{entry.details}</p>
              )}
              <div className="text-sm text-muted-foreground mt-1">
                by {entry.user.email} ({entry.user.type.toLowerCase()})
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 