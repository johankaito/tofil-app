import { getSupabaseClient } from "@/lib/supabase";

export type JobHistoryAction = 
  | "JOB_CREATED"
  | "JOB_UPDATED"
  | "JOB_STATUS_CHANGED"
  | "JOB_ASSIGNED"
  | "JOB_UNASSIGNED"
  | "JOB_COMPLETED"
  | "JOB_ARCHIVED";

export async function createJobHistory(
  jobId: string,
  userId: string,
  action: JobHistoryAction,
  details?: string
) {
  const supabase = getSupabaseClient();
  
  const { data, error } = await supabase
    .from("JobHistory")
    .insert({
      jobId,
      userId,
      action,
      details
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getJobHistory(jobId: string) {
  const supabase = getSupabaseClient();
  
  const { data, error } = await supabase
    .from("JobHistory")
    .select(`
      *,
      user:User (
        id,
        email,
        type
      )
    `)
    .eq("jobId", jobId)
    .order("createdAt", { ascending: false });

  if (error) throw error;
  return data;
} 