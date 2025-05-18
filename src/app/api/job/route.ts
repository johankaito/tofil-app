import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { jobSchema } from '@/lib/validators/job';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const data = await req.json();
  const parsed = jobSchema.safeParse(data);
  if (!parsed.success) return NextResponse.json({ error: parsed.error }, { status: 400 });
  const job = await prisma.job.create({ data: parsed.data });
  return NextResponse.json(job);
} 