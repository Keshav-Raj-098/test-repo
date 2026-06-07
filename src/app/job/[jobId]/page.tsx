import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { JobToolbar } from "@/app/job/_components/jobToolbar";
import { UploadResumesButton } from "@/app/job/_components/uploadResumesButton";
import {
  CandidateScoresList,
  type ScoreRow,
} from "@/app/job/_components/candidateScoresList";
import { ScoresAutoRefresh } from "@/app/job/_components/scoresAutoRefresh";
import type { ScreeningParameter } from "@/shared/job_type";

// Always read fresh data from the database on each request.
export const dynamic = "force-dynamic";

export default async function JobPage({
  params,
}: {
  params: Promise<{ jobId: string }>;
}) {
  const { jobId } = await params;

  const job = await prisma.job.findUnique({
    where: { id: jobId },
    include: {
      screeningParameters: true,
      scores: {
        orderBy: { createdAt: "asc" },
        select: {
          id: true,
          fileName: true,
          status: true,
          error: true,
          candidateInfo: true,
          score: true,
        },
      },
    },
  });

  if (!job) {
    notFound();
  }

  const parameters = (job.screeningParameters?.parameters ??
    []) as ScreeningParameter[];
  const scores = job.scores as ScoreRow[];
  const hasScores = scores.length > 0;
  const inProgress = scores.some(
    (s) => s.status === "pending" || s.status === "processing",
  );

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-8 px-4 py-10">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <p className="text-muted-foreground text-xs uppercase tracking-wide">
            Job
          </p>
          <h1 className="text-3xl font-bold tracking-tight">{job.title}</h1>
          {job.description ? (
            <p className="text-muted-foreground max-w-xl text-sm">
              {job.description}
            </p>
          ) : null}
        </div>

        <JobToolbar jobId={job.id} parameters={parameters} />
      </header>

      {hasScores ? (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Candidates</h2>
            <span className="text-muted-foreground text-sm">
              {scores.length} {scores.length === 1 ? "resume" : "resumes"}
            </span>
          </div>
          <CandidateScoresList scores={scores} />
        </section>
      ) : (
        <div className="flex flex-col items-center gap-4 rounded-lg border border-dashed py-20 text-center">
          <div className="space-y-1">
            <p className="font-medium">Nothing scored yet</p>
            <p className="text-muted-foreground text-sm">
              Upload resumes to start screening candidates against this job.
            </p>
          </div>
          <UploadResumesButton jobId={job.id} size="lg" />
        </div>
      )}

      {/* While anything is queued or scoring, poll for fresh statuses. */}
      <ScoresAutoRefresh active={inProgress} />
    </main>
  );
}
