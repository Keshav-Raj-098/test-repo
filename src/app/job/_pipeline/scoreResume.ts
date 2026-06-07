import "server-only";

import { generateText, Output } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

import {
  resumeScoreSchema,
  type ResumeScore,
  type ScreeningParameter,
} from "@/shared/job_type";

// Same provider wiring as parameter generation: the key lives in GEMINI_API_KEY.
const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const model = google("gemini-2.5-flash");

const SYSTEM_PROMPT = `You are an expert technical recruiter scoring a candidate's resume \
against a fixed set of screening parameters for a specific role.

Guidelines:
- Score each parameter from 0-100 based ONLY on evidence in the resume.
- If a mandatory parameter is clearly unmet, the overall recommendation should be "reject".
- overall_score should reflect the weighted importance of the parameters.
- Be concise and specific in every reasoning string; cite what the resume shows.
- Return one parameter_scores entry for every parameter, using the exact names given.`;

/**
 * Scores a single resume's text against a job's screening parameters. Throws if
 * the resume text is empty or the model fails to return a valid object.
 */
export async function scoreResume(
  resumeText: string,
  parameters: ScreeningParameter[],
): Promise<ResumeScore> {
  const text = resumeText.trim();
  if (!text) {
    throw new Error("Resume text is empty.");
  }

  const parameterBrief = parameters
    .map(
      (p, i) =>
        `${i + 1}. ${p.name} (weight ${p.weightage}%${
          p.is_mandatory ? ", MANDATORY" : ""
        }): ${p.description}`,
    )
    .join("\n");

  const { output } = await generateText({
    model,
    output: Output.object({ schema: resumeScoreSchema }),
    system: SYSTEM_PROMPT,
    prompt: `Screening parameters:\n${parameterBrief}\n\nResume:\n\n${text}`,
  });

  return output;
}
