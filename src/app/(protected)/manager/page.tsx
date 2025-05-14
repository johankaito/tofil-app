"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";

export default function ManagerDashboard() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [manager, setManager] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.replace("/login");
        return;
      }
      // Fetch manager profile
      const { data: profile } = await supabase
        .from("User")
        .select("*, managerLocation:managerLocationId")
        .eq("id", user.id)
        .single();
      setManager(profile);
      if (!profile?.managerLocationId) {
        setLoading(false);
        return;
      }
      // Fetch jobs for manager's location
      const { data: jobsData } = await supabase
        .from("Job")
        .select("*")
        .eq("locationId", profile.managerLocationId);
      setJobs(jobsData || []);
      setLoading(false);
    }
    fetchData();
  }, [router]);

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center">Loading…</div>;
  }

  if (!manager?.managerLocationId) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="p-8 max-w-md text-center">
          <div className="text-xl font-bold mb-2">Unassigned</div>
          <div className="text-muted-foreground mb-4">You have not been assigned a location yet.</div>
          <div className="text-sm">Please contact your Admin to be assigned to a location.</div>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Manager Dashboard</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full border text-sm">
          <thead>
            <tr className="bg-background-table text-foreground">
              <th className="p-2 border">Title</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Location</th>
              <th className="p-2 border">Contractor</th>
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
                <td className="p-2 border">{job.contractorId || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 