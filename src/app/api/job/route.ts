import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { jobSchema } from '@/lib/validators/job';
import { createJobHistory } from '@/lib/services/jobHistory';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const parsed = jobSchema.safeParse(data);
    if (!parsed.success) return NextResponse.json({ error: parsed.error }, { status: 400 });

    const job = await prisma.job.create({ data: parsed.data });
    
    // Create history entry
    await createJobHistory(
      job.id,
      job.ownerId,
      "JOB_CREATED",
      `Job "${job.title}" was created`
    );

    return NextResponse.json(job);
  } catch (error) {
    console.error('Error creating job:', error);
    return NextResponse.json(
      { error: 'Failed to create job' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const data = await req.json();
    const parsed = jobSchema.safeParse(data);
    if (!parsed.success) return NextResponse.json({ error: parsed.error }, { status: 400 });

    const { id, ...updateData } = parsed.data;
    const oldJob = await prisma.job.findUnique({ where: { id } });
    
    if (!oldJob) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }

    const job = await prisma.job.update({
      where: { id },
      data: updateData
    });

    // Track status changes
    if (oldJob.status !== job.status) {
      await createJobHistory(
        job.id,
        job.ownerId,
        "JOB_STATUS_CHANGED",
        `Status changed from ${oldJob.status} to ${job.status}`
      );
    }

    // Track contractor assignments
    if (oldJob.contractorId !== job.contractorId) {
      if (job.contractorId) {
        await createJobHistory(
          job.id,
          job.ownerId,
          "JOB_ASSIGNED",
          `Job assigned to contractor`
        );
      } else {
        await createJobHistory(
          job.id,
          job.ownerId,
          "JOB_UNASSIGNED",
          `Contractor unassigned from job`
        );
      }
    }

    // Track other updates
    if (oldJob.title !== job.title || oldJob.description !== job.description) {
      await createJobHistory(
        job.id,
        job.ownerId,
        "JOB_UPDATED",
        `Job details updated`
      );
    }

    return NextResponse.json(job);
  } catch (error) {
    console.error('Error updating job:', error);
    return NextResponse.json(
      { error: 'Failed to update job' },
      { status: 500 }
    );
  }
} 