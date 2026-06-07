import Link from "next/link";
import { Plus } from "lucide-react";

import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";

// Always read fresh data from the database on each request.
export const dynamic = "force-dynamic";

export default async function JobsPage() {
  const jobs = await prisma.job.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { scores: true } } },
  });

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-4 py-10">
      <header className="flex items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Jobs</h1>
          <p className="text-muted-foreground text-sm">
            Every role you&apos;ve set up for screening.
          </p>
        </div>
        <Button nativeButton={false} render={<Link href="/job/create-job" />}>
          <Plus className="size-4" />
          New job
        </Button>
      </header>

      {jobs.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-lg border border-dashed py-20 text-center">
          <div className="space-y-1">
            <p className="font-medium">No jobs yet</p>
            <p className="text-muted-foreground text-sm">
              Create your first job to start screening candidates.
            </p>
          </div>
          <Button
            size="lg"
            nativeButton={false}
            render={<Link href="/job/create-job" />}
          >
            <Plus className="size-4" />
            New job
          </Button>
        </div>
      ) : (
        <ul className="space-y-3">
          {jobs.map((job) => (
            <li key={job.id}>
              <Link
                href={`/job/${job.id}`}
                className="block rounded-lg border bg-card p-4 transition-colors hover:bg-muted/50"
              >
                <div className="flex items-start justify-between gap-3">
                  <h2 className="truncate font-medium">{job.title}</h2>
                  <span className="text-muted-foreground shrink-0 text-sm tabular-nums">
                    {job._count.scores}{" "}
                    {job._count.scores === 1 ? "resume" : "resumes"}
                  </span>
                </div>
                {job.description ? (
                  <p className="text-muted-foreground mt-1 line-clamp-2 text-sm">
                    {job.description}
                  </p>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
