"use server";

import { after } from "next/server";
import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { extractTextFromPdf } from "@/utils/extract_text_from_pdf";
import { processPendingScores } from "@/app/job/_pipeline/processPendingScores";

export type UploadResumesState = {
  error?: string;
  queued?: number;
};

const MAX_FILES = 5;

/**
 * Accepts up to 5 resume PDFs for a job. Text is extracted in-request (the file
 * bytes only exist here), a `pending` Scores row is created per resume, and the
 * actual AI scoring is handed off to a background processor via `after()` so the
 * upload returns immediately. The job page polls for status while it runs.
 *
 * Bound with the jobId, so the form-action signature is (prevState, formData).
 */
export async function uploadResumes(
  jobId: string,
  _prevState: UploadResumesState,
  formData: FormData,
): Promise<UploadResumesState> {
  const files = formData
    .getAll("resumes")
    .filter((f): f is File => f instanceof File && f.size > 0);

  if (files.length === 0) {
    return { error: "Select at least one PDF resume." };
  }
  if (files.length > MAX_FILES) {
    return { error: `Upload at most ${MAX_FILES} resumes at a time.` };
  }

  const job = await prisma.job.findUnique({ where: { id: jobId } });
  if (!job) {
    return { error: "Job not found." };
  }

  let queued = 0;
  for (const file of files) {
    let resumeText = "";
    try {
      resumeText = await extractTextFromPdf(await file.arrayBuffer());
    } catch (err) {
      console.error(`Failed to read ${file.name}:`, err);
    }

    if (!resumeText) {
      // Record the failure so the user sees which file couldn't be read.
      await prisma.scores.create({
        data: {
          jobId,
          fileName: file.name,
          status: "failed",
          stage: "scored",
          error: "Could not extract text from this file.",
        },
      });
      continue;
    }

    await prisma.scores.create({
      data: {
        jobId,
        fileName: file.name,
        resumeText,
        status: "pending",
        stage: "queued",
      },
    });
    queued += 1;
  }

  // Refresh the job page so the new rows show immediately as "queued".
  revalidatePath(`/job/${jobId}`);

  // Score the queued resumes one-by-one after the response is sent.
  if (queued > 0) {
    after(() => processPendingScores(jobId));
  }

  return { queued };
}
