"use server";

import { extractTextFromPdf } from "@/utils/extract_text_from_pdf";
import { generateScreeningParameters } from "@/app/job/_pipeline/generateScreeningParameters";
import type { JobAnalysis } from "@/shared/job_type";

export type AnalyzeJobState = {
  error?: string;
  analysis?: JobAnalysis;
};

/**
 * Server action (useActionState-compatible) that turns a pasted or uploaded job
 * description into screening parameters. This does NOT persist anything — the
 * user reviews the result and confirms before we save it (see `saveJob`).
 */
export async function analyzeJob(
  _prevState: AnalyzeJobState,
  formData: FormData,
): Promise<AnalyzeJobState> {
  // Resolve the JD text from either the pasted text or an uploaded file.
  let jdText = String(formData.get("jdText") ?? "").trim();

  const file = formData.get("jdFile");
  if (!jdText && file instanceof File && file.size > 0) {
    try {
      if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
        jdText = await extractTextFromPdf(await file.arrayBuffer());
      } else {
        jdText = (await file.text()).trim();
      }
    } catch {
      return { error: "Could not read the uploaded file. Try pasting the JD instead." };
    }
  }

  if (!jdText) {
    return { error: "Please paste a job description or upload a file." };
  }

  try {
    const analysis = await generateScreeningParameters(jdText);
    return { analysis };
  } catch (err) {
    console.error("generateScreeningParameters failed:", err);
    const message = err instanceof Error ? err.message : String(err);
    return { error: `Failed to generate screening parameters: ${message}` };
  }
}
