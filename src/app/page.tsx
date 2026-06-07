import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center gap-8 px-4 py-24 text-center">
      <span className="rounded-full border px-3 py-1 text-xs font-medium text-muted-foreground">
        AI-powered hiring
      </span>

      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Hire smarter, not harder.
        </h1>
        <p className="mx-auto max-w-xl text-muted-foreground text-lg">
          Turn any job description into a structured scoring rubric in seconds,
          then evaluate candidates consistently and fairly — no more gut-feel
          screening.
        </p>
      </div>

      <div className="flex flex-col items-center gap-3 sm:flex-row">
        <Button
          size="lg"
          nativeButton={false}
          render={<Link href="/job/create-job" />}
        >
          Start hiring
        </Button>
        <p className="text-muted-foreground text-sm">
          Free to try · No setup required
        </p>
      </div>
    </main>
  );
}
