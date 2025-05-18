import React from "react";
import { cn } from "@/lib/utils";

export type JobStatus =
  | "PENDING_REVIEW"
  | "AVAILABLE"
  | "CLAIMED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "ARCHIVED";

const statusStyles: Record<JobStatus, string> = {
  PENDING_REVIEW: "bg-accent-yellow text-black",
  AVAILABLE: "bg-accent-green text-black",
  CLAIMED: "bg-accent-blue text-white",
  IN_PROGRESS: "bg-accent-orange text-white",
  COMPLETED: "bg-accent-green text-white",
  ARCHIVED: "bg-muted text-muted-foreground",
};

const statusLabels: Record<JobStatus, string> = {
  PENDING_REVIEW: "Pending Review",
  AVAILABLE: "Available",
  CLAIMED: "Claimed",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
  ARCHIVED: "Archived",
};

export function StatusBadge({ status, className }: { status: JobStatus; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
        statusStyles[status],
        className
      )}
    >
      {statusLabels[status]}
    </span>
  );
} 