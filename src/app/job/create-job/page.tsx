"use client";

import { useActionState, useEffect, useState } from "react";

import { analyzeJob, type AnalyzeJobState } from "@/app/job/_lib/analyzeJob";
import { saveJob } from "@/app/job/_lib/saveJob";
import { ScreeningParametersView } from "@/app/job/_components/screeningParametersView";
import type { JobAnalysis } from "@/shared/job_type";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const initialState: AnalyzeJobState = {};

type Mode = "paste" | "upload";

export default function CreateJobPage() {
  const [mode, setMode] = useState<Mode>("paste");
  const [analysis, setAnalysis] = useState<JobAnalysis | null>(null);
  const [state, formAction, pending] = useActionState(analyzeJob, initialState);

  // Once the JD has been analyzed, move to the review step.
  useEffect(() => {
    if (state.analysis) setAnalysis(state.analysis);
  }, [state]);

  if (analysis) {
    return (
      <ReviewStep analysis={analysis} onBack={() => setAnalysis(null)} />
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-4 py-12">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">New job</h1>
        <p className="text-muted-foreground text-sm">
          Paste or upload a job description and we&apos;ll generate screening
          parameters for it.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Job description</CardTitle>
          <CardDescription>
            Review the generated parameters before anything is saved.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            <div className="flex gap-2">
              <Button
                type="button"
                size="sm"
                variant={mode === "paste" ? "default" : "outline"}
                onClick={() => setMode("paste")}
              >
                Paste JD
              </Button>
              <Button
                type="button"
                size="sm"
                variant={mode === "upload" ? "default" : "outline"}
                onClick={() => setMode("upload")}
              >
                Upload file
              </Button>
            </div>

            {mode === "paste" ? (
              <div className="space-y-2">
                <Label htmlFor="jdText">Paste the job description</Label>
                <Textarea
                  id="jdText"
                  name="jdText"
                  rows={12}
                  placeholder="Paste the full job description here…"
                />
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="jdFile">Upload a file (PDF or .txt)</Label>
                <input
                  id="jdFile"
                  name="jdFile"
                  type="file"
                  accept=".pdf,.txt,.md,text/plain,application/pdf"
                  className="block w-full text-sm file:mr-3 file:rounded-md file:border file:border-input file:bg-transparent file:px-3 file:py-1.5 file:text-sm file:font-medium"
                />
              </div>
            )}

            {state.error ? (
              <p className="text-destructive text-sm" aria-live="polite">
                {state.error}
              </p>
            ) : null}

            <Button type="submit" disabled={pending}>
              {pending ? "Generating…" : "Generate screening parameters"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

/** Review step: shows generated details + parameters before saving. */
function ReviewStep({
  analysis,
  onBack,
}: {
  analysis: JobAnalysis;
  onBack: () => void;
}) {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-4 py-12">
      <header className="space-y-1">
        <p className="text-muted-foreground text-xs uppercase tracking-wide">
          Review
        </p>
        <h1 className="text-3xl font-bold tracking-tight">
          {analysis.job_title}
        </h1>
        <p className="text-muted-foreground text-sm">{analysis.job_summary}</p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Screening parameters</CardTitle>
          <CardDescription>
            {analysis.parameters.length} parameters generated. Continue to save
            this job.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScreeningParametersView parameters={analysis.parameters} />
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <form action={saveJob}>
          <input type="hidden" name="analysis" value={JSON.stringify(analysis)} />
          <Button type="submit">Continue</Button>
        </form>
      </div>
    </div>
  );
}
