"use client";

import { useState, useEffect } from 'react';
import { Job } from '@prisma/client';
import { useRBAC } from '@/hooks/use-rbac';
import { Card } from '@/components/ui/card';
import { StatusBadge } from '@/components/StatusBadge';

export default function ManagerDashboard() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { canViewJob } = useRBAC();

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
        <h1 className="text-2xl font-bold mb-6 text-white">Manager Dashboard</h1>
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
                  {job.contractorId && (
                    <div className="text-sm text-muted-foreground">
                      Contractor: {job.contractorId}
                    </div>
                  )}
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