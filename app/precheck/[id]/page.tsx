import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PrintButton } from "@/components/PrintButton";
import { PrecheckReport, PrintHeader, ProjectSummary } from "@/components/PrecheckReport";
import { safe } from "@/lib/db";
import type { PrecheckProject, PrecheckResult } from "@/lib/types";

export const metadata: Metadata = { title: "Saved pre-check", robots: { index: false } };

export default async function SavedPrecheck({ params }: PageProps<"/precheck/[id]">) {
  const { id } = await params;
  if (!/^[A-Za-z0-9_-]{6,16}$/.test(id)) notFound();
  const row = await safe(async (sql) => {
    const [r] = await sql`select project, result, address, created_at from prechecks where id = ${id}`;
    return r ?? null;
  }, null);
  if (!row) notFound();
  const project = row.project as PrecheckProject;
  const result = row.result as PrecheckResult;

  return (
    <div className="mx-auto max-w-3xl px-4 pt-12 pb-8 sm:px-6 sm:pt-16">
      <PrintHeader />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between print:hidden">
        <div>
          <p className="text-[12.5px] font-medium tracking-wider text-forest uppercase">Saved pre-check</p>
          <h1 className="mt-3 font-serif text-[38px] leading-[1] tracking-[-0.02em] sm:text-[48px]">{project.type} project</h1>
        </div>
        <PrintButton />
      </div>
      <div className="mt-8 space-y-5">
        <ProjectSummary project={project} address={row.address} />
        <PrecheckReport result={result} />
        <p className="text-[13.5px] text-muted print:hidden">
          Rules may have changed since this was saved. <Link className="text-forest hover:underline" href="/precheck">Run a fresh pre-check →</Link>
        </p>
      </div>
    </div>
  );
}
