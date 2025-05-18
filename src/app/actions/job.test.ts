import { describe, it, expect, vi, beforeEach } from 'vitest';
import { applyForJob, startJob, completeJob, archiveJob, duplicateJob } from './job';
import { PrismaClient, Job, JobStatus, UserType } from '@prisma/client';

type MockFn = ReturnType<typeof vi.fn>;
interface MockPrisma {
  job: {
    update: MockFn;
    findUnique: MockFn;
    create: MockFn;
  };
  jobHistory: {
    create: MockFn;
  };
}

// Mock PrismaClient
vi.mock('@prisma/client', async (importActual) => {
  const actual = await importActual<typeof import('@prisma/client')>();
  const mockJob = {
    update: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
  };
  const mockJobHistory = {
    create: vi.fn(),
  };
  const PrismaClient = vi.fn(() => ({
    job: mockJob,
    jobHistory: mockJobHistory,
  }));
  return {
    ...actual,
    PrismaClient,
  };
});

// Mock next/cache
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

describe('Job Actions', () => {
  const mockJob = {
    id: '1',
    title: 'Test Job',
    description: 'Test Description',
    status: JobStatus.AVAILABLE,
    ownerId: 'owner1',
    contractorId: null,
    locationId: 'location1',
  } as Job;

  const mockUser = {
    id: 'user1',
    email: 'test@example.com',
    type: UserType.CONTRACTOR,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('applyForJob', () => {
    it('should update job status and create history', async () => {
      const prisma = new PrismaClient() as unknown as MockPrisma;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (prisma.job.update as MockFn).mockResolvedValue({ ...mockJob, status: JobStatus.CLAIMED, contractorId: mockUser.id });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (prisma.jobHistory.create as MockFn).mockResolvedValue({ id: '1', jobId: mockJob.id, userId: mockUser.id, action: 'APPLY' });

      const result = await applyForJob(mockJob.id, mockUser.id);

      expect(result.success).toBe(true);
      expect(prisma.job.update).toHaveBeenCalledWith({
        where: { id: mockJob.id },
        data: {
          status: JobStatus.CLAIMED,
          contractorId: mockUser.id,
        },
      });
      expect(prisma.jobHistory.create).toHaveBeenCalledWith({
        data: {
          jobId: mockJob.id,
          userId: mockUser.id,
          action: 'APPLY',
        },
      });
    });

    it('should handle errors', async () => {
      const prisma = new PrismaClient() as unknown as MockPrisma;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (prisma.job.update as MockFn).mockRejectedValue(new Error('Update failed'));

      const result = await applyForJob(mockJob.id, mockUser.id);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Failed to apply for job');
    });
  });

  describe('startJob', () => {
    it('should update job status and create history', async () => {
      const prisma = new PrismaClient() as unknown as MockPrisma;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (prisma.job.update as MockFn).mockResolvedValue({ ...mockJob, status: JobStatus.IN_PROGRESS });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (prisma.jobHistory.create as MockFn).mockResolvedValue({ id: '1', jobId: mockJob.id, userId: mockUser.id, action: 'START' });

      const result = await startJob(mockJob.id, mockUser.id);

      expect(result.success).toBe(true);
      expect(prisma.job.update).toHaveBeenCalledWith({
        where: { id: mockJob.id },
        data: { status: JobStatus.IN_PROGRESS },
      });
      expect(prisma.jobHistory.create).toHaveBeenCalledWith({
        data: {
          jobId: mockJob.id,
          userId: mockUser.id,
          action: 'START',
        },
      });
    });
  });

  describe('completeJob', () => {
    it('should update job status and create history', async () => {
      const prisma = new PrismaClient() as unknown as MockPrisma;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (prisma.job.update as MockFn).mockResolvedValue({ ...mockJob, status: JobStatus.COMPLETED });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (prisma.jobHistory.create as MockFn).mockResolvedValue({ id: '1', jobId: mockJob.id, userId: mockUser.id, action: 'COMPLETE' });

      const result = await completeJob(mockJob.id, mockUser.id);

      expect(result.success).toBe(true);
      expect(prisma.job.update).toHaveBeenCalledWith({
        where: { id: mockJob.id },
        data: { status: JobStatus.COMPLETED },
      });
      expect(prisma.jobHistory.create).toHaveBeenCalledWith({
        data: {
          jobId: mockJob.id,
          userId: mockUser.id,
          action: 'COMPLETE',
        },
      });
    });
  });

  describe('archiveJob', () => {
    it('should update job status and create history', async () => {
      const prisma = new PrismaClient() as unknown as MockPrisma;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (prisma.job.update as MockFn).mockResolvedValue({ ...mockJob, status: JobStatus.ARCHIVED });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (prisma.jobHistory.create as MockFn).mockResolvedValue({ id: '1', jobId: mockJob.id, userId: mockUser.id, action: 'ARCHIVE' });

      const result = await archiveJob(mockJob.id, mockUser.id);

      expect(result.success).toBe(true);
      expect(prisma.job.update).toHaveBeenCalledWith({
        where: { id: mockJob.id },
        data: { status: JobStatus.ARCHIVED },
      });
      expect(prisma.jobHistory.create).toHaveBeenCalledWith({
        data: {
          jobId: mockJob.id,
          userId: mockUser.id,
          action: 'ARCHIVE',
        },
      });
    });
  });

  describe('duplicateJob', () => {
    it('should create new job and history', async () => {
      const prisma = new PrismaClient() as unknown as MockPrisma;
      const newJob = { ...mockJob, id: '2', status: JobStatus.PENDING_REVIEW };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (prisma.job.findUnique as MockFn).mockResolvedValue(mockJob);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (prisma.job.create as MockFn).mockResolvedValue(newJob);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (prisma.jobHistory.create as MockFn).mockResolvedValue({ id: '1', jobId: newJob.id, userId: mockUser.id, action: 'DUPLICATE' });

      const result = await duplicateJob(mockJob.id, mockUser.id);

      expect(result.success).toBe(true);
      expect(prisma.job.create).toHaveBeenCalledWith({
        data: {
          ...mockJob,
          id: undefined,
          status: JobStatus.PENDING_REVIEW,
        },
      });
      expect(prisma.jobHistory.create).toHaveBeenCalledWith({
        data: {
          jobId: newJob.id,
          userId: mockUser.id,
          action: 'DUPLICATE',
        },
      });
    });

    it('should handle non-existent job', async () => {
      const prisma = new PrismaClient() as unknown as MockPrisma;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (prisma.job.findUnique as MockFn).mockResolvedValue(null);

      const result = await duplicateJob(mockJob.id, mockUser.id);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Job not found');
    });
  });
}); 