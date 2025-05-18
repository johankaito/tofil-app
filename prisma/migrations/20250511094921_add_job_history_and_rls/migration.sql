-- CreateTable
CREATE TABLE "JobHistory" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "JobHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "JobHistory_jobId_idx" ON "JobHistory"("jobId");
CREATE INDEX "JobHistory_userId_idx" ON "JobHistory"("userId");

-- AddForeignKey
ALTER TABLE "JobHistory" ADD CONSTRAINT "JobHistory_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "JobHistory" ADD CONSTRAINT "JobHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Enable RLS
ALTER TABLE "JobHistory" ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
CREATE POLICY "job_history_select" ON "JobHistory" FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM "Job" j
        WHERE j.id = "JobHistory"."jobId"
        AND (
            j."ownerId" = auth.uid()::text
            OR j."contractorId" = auth.uid()::text
            OR EXISTS (
                SELECT 1 FROM "User" u
                WHERE u.id = auth.uid()::text
                AND u.type = 'ADMIN'
            )
        )
    )
);

CREATE POLICY "job_history_insert" ON "JobHistory" FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM "Job" j
        WHERE j.id = "JobHistory"."jobId"
        AND (
            j."ownerId" = auth.uid()::text
            OR j."contractorId" = auth.uid()::text
            OR EXISTS (
                SELECT 1 FROM "User" u
                WHERE u.id = auth.uid()::text
                AND u.type = 'ADMIN'
            )
        )
    )
); 