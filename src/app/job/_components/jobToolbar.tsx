"use client";

import { ListChecks } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet } from "@/components/ui/sheet";
import type { ScreeningParameter } from "@/shared/job_type";

import { ScreeningParametersView } from "./screeningParametersView";
import { UploadResumesButton } from "./uploadResumesButton";

/** Top-right actions on the job page: upload resumes + view parameters sheet. */
export function JobToolbar({
  jobId,
  parameters,
}: {
  jobId: string;
  parameters: ScreeningParameter[];
}) {
  return (
    <div className="flex shrink-0 items-center gap-2">
      <UploadResumesButton jobId={jobId} />
      <Sheet
        title="Screening parameters"
        description="Criteria derived from the job description."
        trigger={
          <Button variant="outline">
            <ListChecks className="size-4" />
            View screening parameters
          </Button>
        }
      >
        <ScreeningParametersView parameters={parameters} />
      </Sheet>
    </div>
  );
}
