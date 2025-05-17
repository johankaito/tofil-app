import React from 'react';
import { Job } from '@prisma/client';

const jobs: Job[] = [
  { id: "1", title: "Job 1", description: "", status: "PENDING_REVIEW", ownerId: "", contractorId: null, locationId: "NYC" },
  { id: "2", title: "Job 2", description: "", status: "IN_PROGRESS", ownerId: "", contractorId: null, locationId: "SF" },
];

function OwnerDashboard() {
  return (
    <div className="bg-background min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Owner Dashboard</h1>
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
            {jobs.map(job => (
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
                  <button className="mr-2 underline text-xs text-accent hover:text-primary" onClick={() => alert('Duplicate stub')}>Duplicate</button>
                  <button className="underline text-xs text-accent hover:text-primary" onClick={() => alert('Archive stub')}>Archive</button>
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