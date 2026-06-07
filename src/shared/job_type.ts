import { z } from "zod";

/**
 * A single screening parameter used to evaluate candidates for a role. The
 * model produces a list of these from a job description; they are stored
 * verbatim in `ScreeningParameters.parameters` (Json).
 */
export const screeningParameterSchema = z.object({
  name: z.string().describe("Short name of the parameter, e.g. 'React experience'"),
  description: z
    .string()
    .describe("What a candidate must demonstrate to satisfy this parameter."),
  weightage: z
    .number()
    .min(0)
    .max(100)
    .describe("Relative importance of this parameter as a percentage (0-100)."),
  is_mandatory: z
    .boolean()
    .describe("True if a candidate must satisfy this to be considered at all."),
});

/** The full structured output we ask the model for when analyzing a JD. */
export const jobAnalysisSchema = z.object({
  job_title: z.string().describe("A concise title for the role."),
  job_summary: z
    .string()
    .describe("A 1-2 sentence summary of the role and its focus."),
  parameters: z
    .array(screeningParameterSchema)
    .min(3)
    .max(12)
    .describe("The screening parameters derived from the job description."),
});

export type ScreeningParameter = z.infer<typeof screeningParameterSchema>;
export type JobAnalysis = z.infer<typeof jobAnalysisSchema>;

/** Identity details the scorer extracts from a resume. */
export const candidateInfoSchema = z.object({
  name: z.string().describe("The candidate's full name, or 'Unknown' if absent."),
  email: z.string().describe("The candidate's email, or empty string if absent."),
  title: z
    .string()
    .describe("The candidate's current or most recent role/title, if any."),
});

/** How a candidate scored against one screening parameter. */
export const parameterScoreSchema = z.object({
  name: z.string().describe("The screening parameter name being scored."),
  score: z
    .number()
    .min(0)
    .max(100)
    .describe("How well the candidate satisfies this parameter (0-100)."),
  reasoning: z
    .string()
    .describe("One short sentence justifying the score, citing resume evidence."),
});

/** The full structured evaluation of one resume against a job's parameters. */
export const resumeScoreSchema = z.object({
  candidate: candidateInfoSchema,
  overall_score: z
    .number()
    .min(0)
    .max(100)
    .describe("Weighted overall fit for the role (0-100)."),
  recommendation: z
    .enum(["strong", "consider", "reject"])
    .describe("Hiring recommendation based on the overall fit and must-haves."),
  summary: z
    .string()
    .describe("A 1-2 sentence verdict on the candidate's fit for this role."),
  parameter_scores: z
    .array(parameterScoreSchema)
    .describe("One entry per screening parameter, in the same order given."),
});

export type CandidateInfo = z.infer<typeof candidateInfoSchema>;
export type ParameterScore = z.infer<typeof parameterScoreSchema>;
export type ResumeScore = z.infer<typeof resumeScoreSchema>;
