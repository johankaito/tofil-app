import { z } from 'zod';

export const jobSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  status: z.enum([
    'PENDING_REVIEW',
    'AVAILABLE',
    'CLAIMED',
    'IN_PROGRESS',
    'COMPLETED',
    'ARCHIVED',
  ]),
  ownerId: z.string().uuid(),
  contractorId: z.string().uuid().nullable().optional(),
  locationId: z.string().nullable().optional(),
}); 