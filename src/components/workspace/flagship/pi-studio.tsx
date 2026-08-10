"use client";

import { PageHeader, PageShell } from "@/components/layout/page-header";
import { LivePill } from "@/components/ui/badge";
import { PiBuilder } from "@/components/pi/pi-builder";
import type { FlagshipProps } from "./types";

/**
 * Print, Preview & Export — the hand-built surface for the PI document itself.
 *
 * The generated workspace behind this route could only ever list print *jobs*.
 * What the desk actually needs is the sheet: a full editor over every field the
 * printed proforma invoice carries, a live A4 preview beside it, and the print
 * dialog — and therefore "Save as PDF" — one click away.
 */
export function PiStudioWorkspace({ module, sub }: FlagshipProps) {
  return (
    <PageShell className="space-y-4">
      <PageHeader
        title={sub.name}
        subtitle="Compose the proforma invoice field by field, restyle it for the buyer, the bank or the file, and print it straight to PDF."
        icon={module.icon}
        tone={module.tone}
        crumbs={[
          { label: "Modules", href: "/modules" },
          { label: module.short, href: `/m/${module.slug}` },
          { label: sub.name },
        ]}
        badge={<LivePill label="Live preview" />}
      />

      <PiBuilder />
    </PageShell>
  );
}
