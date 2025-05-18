'use server';

import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

export async function applyForJob(jobId: string, userId: string) {
  try {
    const job = await prisma.job.update({
      where: { id: jobId },
      data: {
        status: 'CLAIMED',
        contractorId: userId,
      },
    });

    await prisma.jobHistory.create({
      data: {
        jobId,
        userId,
        action: 'APPLY',
      },
    });

    revalidatePath('/contractor');
    return { success: true, job };
  } catch {
    return { success: false, error: 'Failed to apply for job' };
  }
}

export async function startJob(jobId: string, userId: string) {
  try {
    const job = await prisma.job.update({
      where: { id: jobId },
      data: { status: 'IN_PROGRESS' },
    });

    await prisma.jobHistory.create({
      data: {
        jobId,
        userId,
        action: 'START',
      },
    });

    revalidatePath('/contractor');
    return { success: true, job };
  } catch {
    return { success: false, error: 'Failed to start job' };
  }
}

export async function completeJob(jobId: string, userId: string) {
  try {
    const job = await prisma.job.update({
      where: { id: jobId },
      data: { status: 'COMPLETED' },
    });

    await prisma.jobHistory.create({
      data: {
        jobId,
        userId,
        action: 'COMPLETE',
      },
    });

    revalidatePath('/contractor');
    return { success: true, job };
  } catch {
    return { success: false, error: 'Failed to complete job' };
  }
}

export async function archiveJob(jobId: string, userId: string) {
  try {
    const job = await prisma.job.update({
      where: { id: jobId },
      data: { status: 'ARCHIVED' },
    });

    await prisma.jobHistory.create({
      data: {
        jobId,
        userId,
        action: 'ARCHIVE',
      },
    });

    revalidatePath('/owner');
    return { success: true, job };
  } catch {
    return { success: false, error: 'Failed to archive job' };
  }
}

export async function duplicateJob(jobId: string, userId: string) {
  try {
    const originalJob = await prisma.job.findUnique({
      where: { id: jobId },
    });

    if (!originalJob) {
      return { success: false, error: 'Job not found' };
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: _unused, ...jobData } = originalJob;
    const newJob = await prisma.job.create({
      data: {
        ...jobData,
        status: 'PENDING_REVIEW',
      },
    });

    await prisma.jobHistory.create({
      data: {
        jobId: newJob.id,
        userId,
        action: 'DUPLICATE',
      },
    });

    revalidatePath('/owner');
    return { success: true, job: newJob };
  } catch {
    return { success: false, error: 'Failed to duplicate job' };
  }
} 