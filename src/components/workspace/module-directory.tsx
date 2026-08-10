"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { LayoutGrid, List, Search, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { PageHeader, PageShell } from "@/components/layout/page-header";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge, LivePill } from "@/components/ui/badge";
import { Segmented } from "@/components/ui/tabs";
import { EmptyState } from "@/components/ui/feedback";
import { ModuleIcon } from "@/components/icons/module-icon";
import { ChartFrame } from "@/components/charts/chart-frame";
import { SeriesBarChart } from "@/components/charts/cartesian";
import { sanitizeQuery } from "@/lib/security/sanitize";
import {
  groupedModules,
  MODULE_GROUPS,
  MODULES,
  TOTAL_MODULES,
  TOTAL_SUBMODULES,
} from "@/lib/modules";
import { number } from "@/lib/utils/format";

const VIEW_OPTIONS = [
  { value: "grid" as const, label: "Grid", icon: <LayoutGrid size={13} /> },
  { value: "list" as const, label: "List", icon: <List size={13} /> },
];

export function ModuleDirectory() {
  const [query, setQuery] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");

  const sections = useMemo(() => {
    const q = sanitizeQuery(query).toLowerCase();
    const all = groupedModules();
    if (!q) return all;

    return all
      .map((section) => ({
        ...section,
        modules: section.modules.filter(
          (module) =>
            module.name.toLowerCase().includes(q) ||
            module.description.toLowerCase().includes(q) ||
            module.submodules.some((sub) => sub.name.toLowerCase().includes(q)),
        ),
      }))
      .filter((section) => section.modules.length > 0);
  }, [query]);

  const matchCount = sections.reduce(
    (sum, section) => sum + section.modules.length,
    0,
  );

  const groupChart = MODULE_GROUPS.map((group) => ({
    group: group.label,
    modules: MODULES.filter((module) => module.group === group.id).length,
    workspaces: MODULES.filter((module) => module.group === group.id).reduce(
      (sum, module) => sum + module.submodules.length,
      0,
    ),
  })).filter((row) => row.modules > 0);

  return (
    <PageShell className="flex flex-col gap-5">
      <PageHeader
        title="All Modules"
        subtitle={`${TOTAL_MODULES} core modules · ${TOTAL_SUBMODULES} workspaces across the enterprise`}
        icon="BarChart3"
        tone={7}
        badge={<LivePill />}
        crumbs={[{ label: "Home", href: "/dashboard" }, { label: "Modules" }]}
        action={
          <Segmented
            options={VIEW_OPTIONS}
            value={view}
            onChange={setView}
            ariaLabel="Directory view"
            size="md"
          />
        }
      />

      <ChartFrame
        title="Module Coverage by Domain"
        subtitle={`How the ${TOTAL_MODULES} modules and their workspaces distribute across the business`}
        series={[
          { key: "modules", label: "Modules" },
          { key: "workspaces", label: "Workspaces" },
        ]}
        data={groupChart}
        categoryKey="group"
        categoryLabel="Domain"
        format={(value) => number(value)}
      >
        <SeriesBarChart
          data={groupChart}
          categoryKey="group"
          series={[
            { key: "modules", label: "Modules" },
            { key: "workspaces", label: "Workspaces" },
          ]}
          height={340}
          layout="horizontal"
          format={(value) => number(value)}
        />
      </ChartFrame>

      {/* One filter row scoping everything below it. */}
      <div className="relative max-w-md">
        <Search
          size={15}
          className="text-ink-3 pointer-events-none absolute top-1/2 left-3 -translate-y-1/2"
          aria-hidden="true"
        />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search modules and workspaces…"
          aria-label="Search modules"
          maxLength={120}
          autoComplete="off"
          spellCheck={false}
          className="bg-surface border-line text-ink placeholder:text-ink-3 h-10 w-full rounded-lg border pr-9 pl-9 text-sm outline-none focus:border-[var(--border-accent)]"
        />
        {query ? (
          <button
            type="button"
            onClick={() => setQuery("")}
            aria-label="Clear search"
            className="text-ink-3 hover:text-ink absolute top-1/2 right-3 -translate-y-1/2"
          >
            <X size={14} />
          </button>
        ) : null}
      </div>

      {query ? (
        <p className="text-ink-3 -mt-2 text-xs" aria-live="polite">
          {matchCount} of {TOTAL_MODULES} modules match.
        </p>
      ) : null}

      {sections.length === 0 ? (
        <Card>
          <EmptyState
            icon={<Search size={20} />}
            title="No module matches that search"
            description="Try a product family, a process step, or a document type."
          />
        </Card>
      ) : (
        sections.map((section) => (
          <section key={section.group.id} aria-label={section.group.label}>
            <Card>
              <CardHeader
                title={section.group.label}
                subtitle={`${section.modules.length} modules · ${section.modules.reduce(
                  (sum, module) => sum + module.submodules.length,
                  0,
                )} workspaces`}
              />
              <div className="px-4 pb-4 sm:px-5">
                {view === "grid" ? (
                  <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                    {section.modules.map((module) => (
                      <li key={module.slug}>
                        <Link
                          href={`/m/${module.slug}`}
                          className="card-surface hover:border-line-strong flex h-full flex-col gap-2.5 p-4 transition-colors"
                        >
                          <div className="flex items-start gap-2.5">
                            <span
                              className="flex size-9 shrink-0 items-center justify-center rounded-lg"
                              style={{
                                backgroundColor: `color-mix(in oklab, var(--series-${module.tone}) 16%, transparent)`,
                                color: `var(--series-${module.tone})`,
                              }}
                            >
                              <ModuleIcon name={module.icon} size={17} />
                            </span>
                            <div className="min-w-0 flex-1">
                              <p className="text-ink text-sm leading-snug font-semibold">
                                {module.short}
                              </p>
                              <p className="text-ink-3 text-[0.625rem]">
                                Module {module.id}
                              </p>
                            </div>
                            {module.live ? <LivePill /> : null}
                          </div>
                          <p className="text-ink-3 line-clamp-2 text-xs leading-relaxed">
                            {module.description}
                          </p>
                          <div className="mt-auto flex items-center justify-between gap-2 pt-1">
                            <Badge tone="neutral">
                              {module.submodules.length} workspaces
                            </Badge>
                            {module.badge ? (
                              <Badge tone="critical" withIcon>
                                {module.badge}
                              </Badge>
                            ) : null}
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <ul className="flex flex-col">
                    {section.modules.map((module) => (
                      <li key={module.slug}>
                        <Link
                          href={`/m/${module.slug}`}
                          className="border-line hover:bg-surface-2 flex items-center gap-3 border-b py-3 transition-colors last:border-b-0"
                        >
                          <span
                            className="flex size-8 shrink-0 items-center justify-center rounded-lg"
                            style={{
                              backgroundColor: `color-mix(in oklab, var(--series-${module.tone}) 16%, transparent)`,
                              color: `var(--series-${module.tone})`,
                            }}
                          >
                            <ModuleIcon name={module.icon} size={15} />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="text-ink block truncate text-sm font-medium">
                              {module.name}
                            </span>
                            <span className="text-ink-3 block truncate text-xs">
                              {module.description}
                            </span>
                          </span>
                          <span
                            className={cn(
                              "text-ink-3 tabular hidden shrink-0 text-xs sm:block",
                            )}
                          >
                            {module.submodules.length} workspaces
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </Card>
          </section>
        ))
      )}
    </PageShell>
  );
}
