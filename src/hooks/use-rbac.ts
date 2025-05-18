import { useUser } from '@/components/UserContext';
import { Job, UserType } from '@prisma/client';

export function useRBAC() {
  const { tofilUser } = useUser();

  const canViewJob = (job: Job) => {
    if (!tofilUser) return false;
    if (tofilUser.type === UserType.ADMIN) return true;
    if (tofilUser.type === UserType.MANAGER && job.locationId === tofilUser.managerLocationId) return true;
    if (tofilUser.type === UserType.CONTRACTOR && (job.status === 'AVAILABLE' || job.contractorId === tofilUser.id)) return true;
    return false;
  };

  const canEditJob = (job: Job) => {
    if (!tofilUser) return false;
    if (tofilUser.type === UserType.ADMIN) return true;
    if (job.ownerId === tofilUser.id && ['PENDING_REVIEW', 'AVAILABLE'].includes(job.status)) return true;
    if (tofilUser.type === UserType.CONTRACTOR && job.contractorId === tofilUser.id) return true;
    return false;
  };

  const canDeleteJob = () => {
    if (!tofilUser) return false;
    return tofilUser.type === UserType.ADMIN;
  };

  const canApplyForJob = (job: Job) => {
    if (!tofilUser) return false;
    return tofilUser.type === UserType.CONTRACTOR && job.status === 'AVAILABLE';
  };

  const canStartJob = (job: Job) => {
    if (!tofilUser) return false;
    return tofilUser.type === UserType.CONTRACTOR && job.contractorId === tofilUser.id && job.status === 'CLAIMED';
  };

  const canCompleteJob = (job: Job) => {
    if (!tofilUser) return false;
    return tofilUser.type === UserType.CONTRACTOR && job.contractorId === tofilUser.id && job.status === 'IN_PROGRESS';
  };

  const canArchiveJob = (job: Job) => {
    if (!tofilUser) return false;
    return tofilUser.type === UserType.ADMIN || job.ownerId === tofilUser.id;
  };

  const canDuplicateJob = (job: Job) => {
    if (!tofilUser) return false;
    return tofilUser.type === UserType.ADMIN || job.ownerId === tofilUser.id;
  };

  return {
    canViewJob,
    canEditJob,
    canDeleteJob,
    canApplyForJob,
    canStartJob,
    canCompleteJob,
    canArchiveJob,
    canDuplicateJob,
  };
} 