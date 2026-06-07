import Link from "next/link";

export default function JobLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-full flex-col">
      <nav className="border-b">
        <div className="mx-auto flex w-full max-w-2xl items-center justify-between px-4 py-3">
          <Link href="/job" className="font-semibold">
            Screening
          </Link>
          <Link
            href="/job/create-job"
            className="text-muted-foreground text-sm hover:text-foreground"
          >
            New job
          </Link>
        </div>
      </nav>
      {children}
    </div>
  );
}
