import "server-only";

import { generateText, Output } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

import { jobAnalysisSchema, type JobAnalysis } from "@/shared/job_type";

// The provider reads GOOGLE_GENERATIVE_AI_API_KEY by default, but this project
// stores the key as GEMINI_API_KEY, so we wire it in explicitly.
const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const model = google("gemini-2.5-flash");

const SYSTEM_PROMPT = `You are an expert technical recruiter. Given a job description, \
produce a structured set of screening parameters a hiring team can use to score candidate resumes.

Guidelines:
- Derive 4-8 parameters that genuinely differentiate strong candidates for THIS role.
- Cover hard skills, relevant experience, and any explicit must-haves in the JD.
- Mark a parameter as mandatory only when the JD states it as a hard requirement.
- weightage values across all parameters should sum to roughly 100.
- Keep names short and descriptions specific and measurable.`;

/**
 * Analyzes a raw job description into a title, summary, and screening
 * parameters. Throws if the JD is empty or the model fails to return a valid
 * object.
 */
export async function generateScreeningParameters(
  jobDescription: string,
): Promise<JobAnalysis> {
  const jd = jobDescription.trim();
  if (!jd) {
    throw new Error("Job description is empty.");
  }

  const { output } = await generateText({
    model,
    output: Output.object({ schema: jobAnalysisSchema }),
    system: SYSTEM_PROMPT,
    prompt: `Job description:\n\n${jd}`,
  });

  return output;
}
