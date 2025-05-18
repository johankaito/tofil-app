import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { jobSchema } from '@/lib/validators/job';
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

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = await req.json();
    const parsed = jobSchema.safeParse(data);
    if (!parsed.success) return NextResponse.json({ error: parsed.error }, { status: 400 });
    
    const job = await prisma.job.update({ where: { id: params.id }, data: parsed.data });
    
    // Insert JobHistory record
    if (data.userId && data.action) {
      await prisma.jobHistory.create({
        data: {
          jobId: params.id,
          userId: data.userId,
          action: data.action,
        },
      });
    }
    
    return NextResponse.json(job);
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
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