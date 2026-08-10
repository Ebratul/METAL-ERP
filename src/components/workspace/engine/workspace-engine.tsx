"use client";

import { useMemo, useState } from "react";
import {
  CalendarDays,
  ChartColumn,
  ClipboardList,
  Columns3,
  Download,
  FileText,
  Plus,
  RotateCcw,
  Settings2,
  Table2,
} from "lucide-react";
import { PageHeader, PageShell } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Badge, LivePill } from "@/components/ui/badge";
import { StatTile } from "@/components/ui/stat-tile";
import { Segmented } from "@/components/ui/tabs";
import { ToastProvider, useToast } from "@/components/ui/toast";
import type { ErpModule, SubModule } from "@/lib/modules";
import { resolveDataset } from "@/lib/data/datasets";
import { blankRow, computeMetrics, toCsv } from "@/lib/data/collection";
import { AnalyticsSurface } from "./analytics-surface";
import { BoardSurface } from "./board-surface";
import { CalendarSurface } from "./calendar-surface";
import { CollectionTable } from "./collection-table";
import { FormSurface } from "./form-surface";
import { SettingsSurface } from "./settings-surface";
import { RecordForm } from "./record-form";
import { useCollection } from "./use-collection";

type ViewId = "records" | "board" | "calendar" | "insights" | "entry" | "config";

const VIEW_META: Record<ViewId, { label: string; icon: React.ReactNode }> = {
  records: { label: "Records", icon: <Table2 size={14} /> },
  board: { label: "Board", icon: <Columns3 size={14} /> },
  calendar: { label: "Calendar", icon: <CalendarDays size={14} /> },
  insights: { label: "Insights", icon: <ChartColumn size={14} /> },
  entry: { label: "Entry Form", icon: <FileText size={14} /> },
  config: { label: "Configuration", icon: <Settings2 size={14} /> },
};

const WINDOWS = [
  { value: "30" as const, label: "30 days" },
  { value: "90" as const, label: "90 days" },
  { value: "all" as const, label: "All" },
];

function viewsForKind(kind: SubModule["kind"]): ViewId[] {
  switch (kind) {
    case "form":
      return ["entry", "records", "insights"];
    case "settings":
      return ["config", "records", "insights"];
    case "board":
      return ["board", "records", "insights"];
    case "calendar":
      return ["calendar", "records", "insights"];
    case "analytics":
    case "overview":
      return ["insights", "records", "board"];
    default:
      return ["records", "board", "calendar", "insights"];
  }
}

/**
 * The generated workspace.
 *
 * Every submodule in the registry resolves to a dataset, and this component
 * turns that dataset into a working ERP screen: a KPI band computed from the
 * live rows, a primary surface chosen by the submodule's kind, alternative
 * views of the same records, and analytics that follow the current filters.
 */
export function WorkspaceEngine({
  module,
  sub,
}: {
  module: ErpModule;
  sub: SubModule;
}) {
  return (
    <ToastProvider>
      <WorkspaceBody module={module} sub={sub} />
    </ToastProvider>
  );
}

function WorkspaceBody({ module, sub }: { module: ErpModule; sub: SubModule }) {
  const toast = useToast();
  const seedKey = `${module.slug}/${sub.slug}`;

  const dataset = useMemo(
    () =>
      resolveDataset({
        datasetId: sub.dataset,
        group: module.group,
        kind: sub.kind,
      }),
    [sub.dataset, sub.kind, module.group],
  );

  const collection = useCollection(dataset, seedKey);
  const views = useMemo(() => viewsForKind(sub.kind), [sub.kind]);
  const [view, setView] = useState<ViewId>(views[0]);
  const [createOpen, setCreateOpen] = useState(false);

  const metrics = useMemo(
    () => computeMetrics(dataset, collection.filtered, seedKey),
    [dataset, collection.filtered, seedKey],
  );

  const windowValue =
    collection.windowDays === null ? "all" : String(collection.windowDays);

  return (
    <PageShell className="flex flex-col gap-5">
      <PageHeader
        title={sub.name}
        subtitle={sub.summary ?? module.description}
        icon={module.icon}
        tone={module.tone}
        badge={
          <>
            <Badge tone="accent">{dataset.plural}</Badge>
            {module.live ? <LivePill /> : null}
          </>
        }
        crumbs={[
          { label: "Home", href: "/dashboard" },
          { label: "Modules", href: "/modules" },
          { label: module.short, href: `/m/${module.slug}` },
          { label: sub.name },
        ]}
        action={
          <>
            {dataset.dateKey ? (
              <Segmented
                options={WINDOWS}
                value={windowValue as "30" | "90" | "all"}
                onChange={(value) =>
                  collection.setWindowDays(value === "all" ? null : Number(value))
                }
                ariaLabel="Date window"
                size="md"
              />
            ) : null}
            <Button
              variant="ghost"
              size="md"
              aria-label="Reset demo data"
              onClick={() => {
                collection.reset();
                toast.push("Workspace reset", {
                  detail: "Demo records restored",
                  tone: "info",
                });
              }}
            >
              <RotateCcw size={15} />
            </Button>
            <Button
              variant="secondary"
              size="md"
              aria-label="Export workspace data"
              onClick={() => {
                const csv = toCsv(dataset.fields, collection.filtered);
                const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
                const url = URL.createObjectURL(blob);
                const anchor = document.createElement("a");
                anchor.href = url;
                anchor.download = `${module.slug}-${sub.slug}.csv`;
                anchor.click();
                URL.revokeObjectURL(url);
                toast.push("Export ready", {
                  detail: `${collection.filtered.length} rows written to CSV`,
                });
              }}
            >
              <Download size={15} />
              <span className="hidden sm:inline">Export</span>
            </Button>
            <Button
              variant="primary"
              size="md"
              aria-label={`Create ${dataset.entity}`}
              onClick={() => setCreateOpen(true)}
            >
              <Plus size={15} />
              <span className="hidden sm:inline">New {dataset.entity}</span>
            </Button>
          </>
        }
      />

      {/* ── KPI band, computed from the rows currently in view ─────────── */}
      <section aria-label="Key indicators">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => (
            <StatTile
              key={metric.label}
              label={metric.label}
              value={metric.value}
              delta={metric.delta}
              invertDelta={metric.invert}
              caption={metric.caption}
              tone={metric.tone}
              trend={metric.trend}
            />
          ))}
        </div>
      </section>

      {/* ── View switch ────────────────────────────────────────────────── */}
      {views.length > 1 ? (
        <div className="flex flex-wrap items-center gap-3">
          <Segmented
            options={views.map((id) => ({
              value: id,
              label: VIEW_META[id].label,
              icon: VIEW_META[id].icon,
            }))}
            value={view}
            onChange={setView}
            ariaLabel="Workspace view"
            size="md"
          />
          <span className="text-ink-3 flex items-center gap-1.5 text-[0.6875rem]">
            <ClipboardList size={12} aria-hidden="true" />
            {collection.filtered.length} of {collection.rows.length}{" "}
            {dataset.plural.toLowerCase()} in view
          </span>
        </div>
      ) : null}

      {/* ── Primary surface ────────────────────────────────────────────── */}
      <section aria-label={`${sub.name} workspace`}>
        {view === "records" ? (
          <CollectionTable
            dataset={dataset}
            collection={collection}
            caption={`${sub.name} records`}
          />
        ) : view === "board" ? (
          <BoardSurface dataset={dataset} collection={collection} />
        ) : view === "calendar" ? (
          <CalendarSurface dataset={dataset} collection={collection} />
        ) : view === "entry" ? (
          <FormSurface
            dataset={dataset}
            collection={collection}
            title={sub.name}
            description={`Capture a new ${dataset.entity.toLowerCase()} for ${module.short}.`}
          />
        ) : view === "config" ? (
          <SettingsSurface dataset={dataset} seedKey={seedKey} title={sub.name} />
        ) : (
          <AnalyticsSurface
            dataset={dataset}
            rows={collection.filtered}
            tone={module.tone}
          />
        )}
      </section>

      {/* ── Supporting surface ─────────────────────────────────────────── */}
      <section aria-label={`${sub.name} supporting view`}>
        {view === "insights" ? (
          <CollectionTable
            dataset={dataset}
            collection={collection}
            caption={`${sub.name} records`}
            pageSize={5}
            compact
          />
        ) : (
          <AnalyticsSurface
            dataset={dataset}
            rows={collection.filtered}
            tone={module.tone}
            variant={view === "records" ? "compact" : "full"}
          />
        )}
      </section>

      <RecordForm
        open={createOpen}
        mode="create"
        dataset={dataset}
        initial={blankRow(dataset, collection.rows)}
        onClose={() => setCreateOpen(false)}
        onSubmit={(row) => {
          collection.create(row);
          toast.push(`${dataset.entity} created`, {
            detail: String(row.code ?? ""),
          });
        }}
      />

      <footer className="text-ink-3 flex flex-wrap items-center justify-between gap-2 pb-4 text-[0.6875rem]">
        <span>
          Module {module.id} · {module.name} — {sub.name}
        </span>
        <span>Demo data — changes live in this browser session only</span>
      </footer>
    </PageShell>
  );
}
