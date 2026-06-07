"use server";

import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { jobAnalysisSchema } from "@/shared/job_type";

/**
 * Persists a reviewed job analysis as a Job + its ScreeningParameters, then
 * redirects to the job page. The analysis travels from the preview UI as a JSON
 * string in a hidden field so the user only saves what they've seen.
 */
export async function saveJob(formData: FormData) {
  const raw = String(formData.get("analysis") ?? "");

  const parsed = jobAnalysisSchema.safeParse(JSON.parse(raw || "null"));
  if (!parsed.success) {
    throw new Error("Invalid job analysis payload.");
  }
  const analysis = parsed.data;

  const job = await prisma.job.create({
    data: {
      title: analysis.job_title,
      description: analysis.job_summary,
      screeningParameters: {
        create: { parameters: analysis.parameters },
      },
    },
  });

  // redirect throws, so keep it last.
  redirect(`/job/${job.id}`);
}
