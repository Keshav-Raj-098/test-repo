import "server-only";

import { prisma } from "@/lib/prisma";
import type { ScreeningParameter } from "@/shared/job_type";

import { scoreResume } from "./scoreResume";

/**
 * Drains the queue of pending resume scores for a job, processing them one at a
 * time. Intended to be scheduled with `after()` so it runs in the background
 * once the upload response has been sent. Each resume is marked `processing`
 * while it runs, then `completed` (with its score) or `failed` (with an error).
 *
 * Claims rows one-by-one via a conditional update so overlapping runs can't
 * double-process the same resume.
 */
export async function processPendingScores(jobId: string): Promise<void> {
  const job = await prisma.job.findUnique({
    where: { id: jobId },
    include: { screeningParameters: true },
  });

  const parameters = (job?.screeningParameters?.parameters ??
    []) as ScreeningParameter[];

  // Process until no pending rows remain for this job.
  for (;;) {
    const next = await prisma.scores.findFirst({
      where: { jobId, status: "pending" },
      orderBy: { createdAt: "asc" },
    });
    if (!next) break;

    // Claim this row: only proceed if it's still pending (guards against a
    // concurrent processor having grabbed it first).
    const claimed = await prisma.scores.updateMany({
      where: { id: next.id, status: "pending" },
      data: { status: "processing", stage: "scoring" },
    });
    if (claimed.count === 0) continue;

    try {
      const result = await scoreResume(next.resumeText ?? "", parameters);
      await prisma.scores.update({
        where: { id: next.id },
        data: {
          status: "completed",
          stage: "scored",
          candidateInfo: result.candidate,
          score: result,
          error: null,
        },
      });
    } catch (err) {
      console.error(`Failed to score resume ${next.id}:`, err);
      await prisma.scores.update({
        where: { id: next.id },
        data: {
          status: "failed",
          stage: "scored",
          error: err instanceof Error ? err.message : "Scoring failed.",
        },
      });
    }
  }
}
