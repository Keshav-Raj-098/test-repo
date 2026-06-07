import type { ScreeningParameter } from "@/shared/job_type";

/**
 * Presentational list of screening parameters rendered as cards. Used both in
 * the create-job preview and in the job page's side sheet.
 */
export function ScreeningParametersView({
  parameters,
}: {
  parameters: ScreeningParameter[];
}) {
  if (!parameters || parameters.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">No screening parameters.</p>
    );
  }

  return (
    <div className="space-y-3">
      {parameters.map((p, i) => (
        <div key={i} className="rounded-lg border bg-card p-4">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-medium">{p.name}</h3>
            <div className="flex shrink-0 items-center gap-2">
              {p.is_mandatory ? (
                <span className="rounded bg-primary/10 px-1.5 py-0.5 text-xs font-medium text-primary">
                  Required
                </span>
              ) : null}
              <span className="text-muted-foreground text-sm tabular-nums">
                {p.weightage}%
              </span>
            </div>
          </div>
          <p className="text-muted-foreground mt-1.5 text-sm">{p.description}</p>
        </div>
      ))}
    </div>
  );
}
