"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Polls the server while resumes are still being scored by periodically calling
 * router.refresh(), which re-runs the job page's server component and pulls
 * fresh statuses. Renders nothing; disable by passing active={false}.
 */
export function ScoresAutoRefresh({
  active,
  intervalMs = 2500,
}: {
  active: boolean;
  intervalMs?: number;
}) {
  const router = useRouter();

  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => router.refresh(), intervalMs);
    return () => clearInterval(id);
  }, [active, intervalMs, router]);

  return null;
}
