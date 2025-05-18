import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getSupabaseClient } from '@/lib/supabase';
import { JobStatus } from '@prisma/client';
// import { jobSchema } from '@/lib/validators/job'; // To be created

const prisma = new PrismaClient();

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const job = await prisma.job.findUnique({ where: { id: params.id } });
    if (!job) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(job);
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = getSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { status } = body;

    if (!status || !Object.values(JobStatus).includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    // Get the current job to check permissions
    const { data: currentJob } = await supabase
      .from('Job')
      .select('*')
      .eq('id', params.id)
      .single();

    if (!currentJob) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    // Check if user has permission to update status
    const { data: userData } = await supabase
      .from('User')
      .select('type')
      .eq('id', user.id)
      .single();

    const canUpdate = 
      userData?.type === 'ADMIN' ||
      currentJob.ownerId === user.id ||
      (userData?.type === 'CONTRACTOR' && 
       currentJob.contractorId === user.id && 
       ['CLAIMED', 'IN_PROGRESS'].includes(currentJob.status));

    if (!canUpdate) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Update the job status
    const { data: updatedJob, error } = await supabase
      .from('Job')
      .update({ status })
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Create job history entry
    await supabase
      .from('JobHistory')
      .insert({
        jobId: params.id,
        userId: user.id,
        action: 'JOB_STATUS_CHANGED',
        details: `Status changed from ${currentJob.status} to ${status}`,
      });

    return NextResponse.json(updatedJob);
  } catch (error) {
    console.error('Error updating job:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Archive logic: set status to ARCHIVED
    const job = await prisma.job.update({ 
      where: { id: params.id }, 
      data: { status: 'ARCHIVED' } 
    });
    return NextResponse.json(job);
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Duplicate logic: copy job by id
    const job = await prisma.job.findUnique({ where: { id: params.id } });
    if (!job) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: _unused, ...jobData } = job;
    const newJob = await prisma.job.create({ 
      data: { ...jobData, status: 'PENDING_REVIEW' } 
    });
    
    return NextResponse.json(newJob);
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 