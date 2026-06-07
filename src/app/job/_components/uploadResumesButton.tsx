"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Upload } from "lucide-react";

import { uploadResumes } from "@/app/job/_lib/uploadResumes";
import { Button } from "@/components/ui/button";

const MAX_FILES = 5;

/**
 * Opens a file picker for up to 5 PDF resumes and submits them to the
 * `uploadResumes` action for background scoring. Used both in the job toolbar
 * and the empty state, so it carries its own form.
 */
export function UploadResumesButton({
  jobId,
  size = "default",
}: {
  jobId: string;
  size?: "default" | "sm" | "lg";
}) {
  const action = uploadResumes.bind(null, jobId);
  const [state, formAction, pending] = useActionState(action, {});
  const [clientError, setClientError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Clear the input after a submit so the same file can be re-selected.
  useEffect(() => {
    if (!pending && inputRef.current) inputRef.current.value = "";
  }, [pending]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    if (files.length > MAX_FILES) {
      setClientError(`Upload at most ${MAX_FILES} resumes at a time.`);
      e.target.value = "";
      return;
    }
    setClientError(null);
    formRef.current?.requestSubmit();
  }

  const error = clientError ?? state.error;

  return (
    <form ref={formRef} action={formAction} className="flex flex-col items-end gap-1">
      <input
        ref={inputRef}
        type="file"
        name="resumes"
        multiple
        accept=".pdf,application/pdf"
        className="hidden"
        onChange={handleChange}
      />
      <Button
        type="button"
        size={size}
        disabled={pending}
        onClick={() => inputRef.current?.click()}
      >
        <Upload className="size-4" />
        {pending ? "Uploading…" : "Upload resumes"}
      </Button>
      {error ? <p className="text-destructive text-xs">{error}</p> : null}
    </form>
  );
}
