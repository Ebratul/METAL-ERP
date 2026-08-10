"use client";

import { useCallback, useMemo, useState } from "react";
import { Download, Lightbulb, Plus, Printer, RefreshCw } from "lucide-react";
import { PageHeader, PageShell } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Badge, LivePill } from "@/components/ui/badge";
import { StatTile } from "@/components/ui/stat-tile";
import { Tabs, type TabItem } from "@/components/ui/tabs";
import { Modal, ConfirmDialog } from "@/components/ui/overlay";
import { ToastStack, useToasts } from "@/components/ui/toast";
import { PiPrintOverlay } from "@/components/pi/pi-print-overlay";
import { buildPiDocument } from "@/lib/pi/document";
import { emptyRow, resolveSpec } from "@/lib/workspaces/dsl";
import { deriveKpis, monthlySeries, plural } from "@/lib/workspaces/derive";
import type { RecordRow, WorkspaceSpec } from "@/lib/workspaces/types";
import type { ErpModule, SubModule } from "@/lib/modules";
import { useWorkspaceRecords } from "./use-workspace-records";
import { RecordsPanel } from "./records-panel";
import { BoardPanel } from "./board-panel";
import { SchedulePanel } from "./schedule-panel";
import { AnalyticsPanel } from "./analytics-panel";
import { SettingsPanel } from "./settings-panel";
import { EntryPanel } from "./entry-panel";
import { RecordDrawer } from "./record-drawer";
import { RecordFields, useRecordDraft } from "./record-form";
import { exportRowsToCsv } from "./cells";

/** Which tab a workspace opens on, given its registry `kind`. */
const DEFAULT_TAB: Record<string, string> = {
  overview: "analytics",
  analytics: "analytics",
  list: "records",
  board: "board",
  calendar: "schedule",
  form: "entry",
  settings: "settings",
};

export function SpecWorkspace({
  module,
  sub,
  spec: source,
}: {
  module: ErpModule;
  sub: SubModule;
  spec: WorkspaceSpec;
}) {
  const seedKey = `${module.slug}/${sub.slug}`;
  const spec = useMemo(() => resolveSpec(source), [source]);

  const store = useWorkspaceRecords(spec, seedKey);
  const { toasts, push, dismiss } = useToasts();

  const [drawerRow, setDrawerRow] = useState<RecordRow | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<RecordRow | null>(null);
  const [pendingDelete, setPendingDelete] = useState<string[]>([]);
  const [printRow, setPrintRow] = useState<RecordRow | null>(null);
  const [printedAt, setPrintedAt] = useState("");

  // The PI document is a proforma invoice — it only means something here.
  const canPrintPi = module.slug === "proforma-invoice";

  const openPrint = useCallback((row: RecordRow) => {
    // Stamped on the click, so the footer time is fixed for this preview and
    // never differs between the server render and the client.
    setPrintedAt(
      new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
        .format(new Date())
        .replace(/(\d{2}) (\w{3}) (\d{4})/, "$1-$2-$3"),
    );
    setPrintRow(row);
  }, []);

  const closePrint = useCallback(() => setPrintRow(null), []);

  const printDoc = useMemo(
    () => (printRow ? buildPiDocument(printRow, spec, { printedAt }) : null),
    [printRow, spec, printedAt],
  );

  const modalDraft = useRecordDraft(spec);
  const entryDraft = useRecordDraft(spec);

  const months = useMemo(
    () => monthlySeries(spec, store.rows, seedKey),
    [spec, store.rows, seedKey],
  );
  const kpis = useMemo(
    () => deriveKpis(spec, store.rows, seedKey, months),
    [spec, store.rows, seedKey, months],
  );

  const openCreate = useCallback(() => {
    modalDraft.reset(emptyRow(spec, store.nextSequence()));
    setEditing(null);
    setModalOpen(true);
  }, [modalDraft, spec, store]);

  const openEdit = useCallback(
    (row: RecordRow) => {
      modalDraft.reset(row);
      setEditing(row);
      setDrawerRow(null);
      setModalOpen(true);
    },
    [modalDraft],
  );

  const saveModal = useCallback(() => {
    if (!modalDraft.validate()) {
      push("Fix the highlighted fields before saving", "warning");
      return;
    }
    if (editing) {
      store.update(editing.id, modalDraft.toRow(editing.id));
      push(`${String(modalDraft.values[spec.codeField.key])} updated`);
    } else {
      const id = `${spec.ref}-new-${store.nextSequence()}-${store.rows.length}`;
      store.create(modalDraft.toRow(id));
      push(`${spec.entity} ${String(modalDraft.values[spec.codeField.key])} created`);
    }
    setModalOpen(false);
    setEditing(null);
  }, [modalDraft, editing, store, spec, push]);

  const submitEntry = useCallback(
    (forApproval: boolean): RecordRow | null => {
      if (!entryDraft.validate()) {
        push("Fix the highlighted fields before saving", "warning");
        return null;
      }
      const id = `${spec.ref}-entry-${store.nextSequence()}-${store.rows.length}`;
      const row = entryDraft.toRow(id);
      if (forApproval && spec.statuses.length > 1) {
        row[spec.statusField.key] = spec.statuses[1];
      }
      store.create(row);
      push(
        forApproval
          ? `${spec.entity} submitted for approval`
          : `${spec.entity} saved to the register`,
      );
      entryDraft.reset(emptyRow(spec, store.nextSequence()));
      return row;
    },
    [entryDraft, spec, store, push],
  );

  const confirmDelete = useCallback(() => {
    store.remove(pendingDelete);
    push(
      `${pendingDelete.length} ${pendingDelete.length === 1 ? "record" : "records"} deleted`,
      "warning",
    );
    setPendingDelete([]);
    setDrawerRow(null);
  }, [pendingDelete, store, push]);

  const changeStatus = useCallback(
    (ids: string[], status: string) => {
      store.setStatus(ids, status);
      push(`${ids.length} moved to ${status}`, "info");
    },
    [store, push],
  );

  const advance = useCallback(
    (row: RecordRow, direction: 1 | -1) => {
      store.advance(row.id, direction);
      const index = spec.statuses.indexOf(String(row[spec.statusField.key]));
      const next =
        spec.statuses[
          Math.min(spec.statuses.length - 1, Math.max(0, index + direction))
        ];
      push(`${String(row[spec.codeField.key])} → ${next}`, "info");
      setDrawerRow((current) =>
        current && current.id === row.id
          ? { ...current, [spec.statusField.key]: next }
          : current,
      );
    },
    [store, spec, push],
  );

  const exportName = `${module.slug}-${sub.slug}`;

  const tabs: TabItem[] = [
    {
      id: "records",
      label: "Records",
      badge: store.rows.length,
      content: (
        <RecordsPanel
          spec={spec}
          rows={store.rows}
          title={`${sub.name} — ${plural(spec.entity).toLowerCase()}`}
          onView={setDrawerRow}
          onEdit={openEdit}
          onDelete={setPendingDelete}
          onStatus={changeStatus}
          onCreate={openCreate}
          exportName={exportName}
          onPrint={canPrintPi ? openPrint : undefined}
        />
      ),
    },
    {
      id: "analytics",
      label: "Analytics",
      content: (
        <AnalyticsPanel
          spec={spec}
          rows={store.rows}
          seedKey={seedKey}
          tone={module.tone}
        />
      ),
    },
    {
      id: "board",
      label: "Board",
      badge: spec.statuses.length,
      content: (
        <BoardPanel
          spec={spec}
          rows={store.rows}
          onView={setDrawerRow}
          onAdvance={advance}
          onCreate={openCreate}
        />
      ),
    },
    {
      id: "schedule",
      label: "Schedule",
      content: <SchedulePanel spec={spec} rows={store.rows} onView={setDrawerRow} />,
    },
    {
      id: "entry",
      label: "Entry Form",
      content: (
        <EntryPanel
          spec={spec}
          draft={entryDraft}
          rows={store.rows}
          onSubmit={submitEntry}
          onView={setDrawerRow}
          onPrint={canPrintPi ? openPrint : undefined}
        />
      ),
    },
    {
      id: "settings",
      label: "Configuration",
      content: (
        <SettingsPanel
          spec={spec}
          seedKey={seedKey}
          onSaved={(message) => push(message)}
        />
      ),
    },
  ];

  return (
    <PageShell className="flex flex-col gap-5">
      <PageHeader
        title={sub.name}
        subtitle={sub.summary ?? module.description}
        icon={module.icon}
        tone={module.tone}
        badge={
          <>
            <Badge tone="accent">{sub.kind}</Badge>
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
            <Button
              variant="ghost"
              size="md"
              aria-label="Reload demo dataset"
              onClick={() => {
                store.reset();
                push("Demo dataset reloaded", "info");
              }}
            >
              <RefreshCw size={15} />
            </Button>
            <Button
              variant="secondary"
              size="md"
              onClick={() => {
                exportRowsToCsv(spec, store.rows, exportName);
                push(`${store.rows.length} rows exported to CSV`);
              }}
            >
              <Download size={15} />
              <span className="hidden sm:inline">Export</span>
            </Button>
            {canPrintPi && store.rows.length > 0 ? (
              <Button
                variant="secondary"
                size="md"
                onClick={() => openPrint(store.rows[0])}
              >
                <Printer size={15} />
                <span className="hidden sm:inline">Print PI</span>
              </Button>
            ) : null}
            <Button variant="primary" size="md" onClick={openCreate}>
              <Plus size={15} />
              <span className="hidden sm:inline">New {spec.entity}</span>
            </Button>
          </>
        }
      />

      <section aria-label="Key indicators">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {kpis.map((kpi) => (
            <StatTile
              key={kpi.label}
              label={kpi.label}
              value={kpi.value}
              delta={kpi.delta}
              invertDelta={kpi.invert}
              caption={kpi.caption}
              tone={kpi.tone}
              trend={kpi.trend}
            />
          ))}
        </div>
      </section>

      {spec.insight ? (
        <p className="bg-surface-2 border-line text-ink-2 flex items-start gap-2 rounded-xl border px-3.5 py-2.5 text-xs">
          <Lightbulb size={14} className="text-accent-ink mt-0.5 shrink-0" aria-hidden="true" />
          {spec.insight}
        </p>
      ) : null}

      <Tabs
        items={tabs}
        defaultTab={DEFAULT_TAB[sub.kind] ?? "records"}
        ariaLabel={`${sub.name} workspace views`}
      />

      <footer className="text-ink-3 flex flex-wrap items-center justify-between gap-2 pb-4 text-[0.6875rem]">
        <span>
          Module {module.id} · {module.name} — {sub.name}
        </span>
        <span>{store.rows.length} records saved in this browser</span>
      </footer>

      <RecordDrawer
        spec={spec}
        row={drawerRow}
        open={drawerRow !== null}
        onClose={() => setDrawerRow(null)}
        onEdit={openEdit}
        onDelete={(row) => setPendingDelete([row.id])}
        onAdvance={advance}
        onPrint={canPrintPi ? openPrint : undefined}
      />

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        size="lg"
        title={editing ? `Edit ${spec.entity}` : `New ${spec.entity}`}
        description={
          editing
            ? `Amending ${String(editing[spec.codeField.key])}`
            : `Create a ${spec.entity.toLowerCase()} in ${sub.name}`
        }
        footer={
          <>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={saveModal}>
              {editing ? "Save changes" : `Create ${spec.entity}`}
            </Button>
          </>
        }
      >
        <RecordFields spec={spec} draft={modalDraft} />
      </Modal>

      <ConfirmDialog
        open={pendingDelete.length > 0}
        title={`Delete ${pendingDelete.length} ${pendingDelete.length === 1 ? "record" : "records"}?`}
        message="This removes the selected rows from this browser's saved data. The demo dataset can be reloaded from the header at any time."
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete([])}
      />

      <PiPrintOverlay
        doc={printDoc}
        open={printDoc !== null}
        onClose={closePrint}
      />

      <ToastStack toasts={toasts} onDismiss={dismiss} />
    </PageShell>
  );
}
