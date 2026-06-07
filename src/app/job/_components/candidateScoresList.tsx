import { Loader2 } from "lucide-react";

import type { CandidateInfo, ResumeScore } from "@/shared/job_type";

/** The subset of a Scores row this list needs to render. */
export type ScoreRow = {
  id: string;
  fileName: string | null;
  status: string;
  error: string | null;
  candidateInfo: unknown;
  score: unknown;
};

const RECOMMENDATION_LABEL: Record<string, string> = {
  strong: "Strong fit",
  consider: "Consider",
  reject: "Reject",
};

const RECOMMENDATION_CLASS: Record<string, string> = {
  strong: "bg-green-100 text-green-800",
  consider: "bg-amber-100 text-amber-800",
  reject: "bg-red-100 text-red-800",
};

/** Renders the scored / in-progress candidates for a job. */
export function CandidateScoresList({ scores }: { scores: ScoreRow[] }) {
  return (
    <div className="space-y-3">
      {scores.map((row) => (
        <CandidateCard key={row.id} row={row} />
      ))}
    </div>
  );
}

function CandidateCard({ row }: { row: ScoreRow }) {
  const candidate = row.candidateInfo as CandidateInfo | null;
  const result = row.score as ResumeScore | null;

  if (row.status === "pending" || row.status === "processing") {
    return (
      <div className="flex items-center gap-3 rounded-lg border bg-card p-4">
        <Loader2 className="text-muted-foreground size-4 animate-spin" />
        <div className="min-w-0">
          <p className="truncate font-medium">{row.fileName ?? "Resume"}</p>
          <p className="text-muted-foreground text-sm">
            {row.status === "processing" ? "Scoring…" : "Queued"}
          </p>
        </div>
      </div>
    );
  }

  if (row.status === "failed") {
    return (
      <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
        <p className="truncate font-medium">{row.fileName ?? "Resume"}</p>
        <p className="text-destructive mt-1 text-sm">
          {row.error ?? "Scoring failed."}
        </p>
      </div>
    );
  }

  // completed
  return (
    <details className="group rounded-lg border bg-card p-4 [&_summary]:cursor-pointer">
      <summary className="flex items-start justify-between gap-3 list-none">
        <div className="min-w-0">
          <h3 className="truncate font-medium">
            {candidate?.name || row.fileName || "Candidate"}
          </h3>
          {candidate?.title ? (
            <p className="text-muted-foreground truncate text-sm">
              {candidate.title}
            </p>
          ) : null}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {result ? (
            <span
              className={`rounded px-1.5 py-0.5 text-xs font-medium ${
                RECOMMENDATION_CLASS[result.recommendation] ??
                "bg-muted text-foreground"
              }`}
            >
              {RECOMMENDATION_LABEL[result.recommendation] ??
                result.recommendation}
            </span>
          ) : null}
          <span className="text-lg font-semibold tabular-nums">
            {result?.overall_score ?? 0}
          </span>
        </div>
      </summary>

      {result ? (
        <div className="mt-3 space-y-3 border-t pt-3">
          <p className="text-muted-foreground text-sm">{result.summary}</p>
          <div className="space-y-2">
            {result.parameter_scores.map((p, i) => (
              <div key={i} className="text-sm">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-medium">{p.name}</span>
                  <span className="tabular-nums">{p.score}</span>
                </div>
                <p className="text-muted-foreground">{p.reasoning}</p>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </details>
  );
}
