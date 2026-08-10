"use client";

import Link from "next/link";
import { ArrowUpRight, Download, LayoutGrid, Plus } from "lucide-react";
import { PageHeader, PageShell } from "@/components/layout/page-header";
import { Button, LinkButton } from "@/components/ui/button";
import { Badge, LivePill } from "@/components/ui/badge";
import { StatTile } from "@/components/ui/stat-tile";
import { Card, CardHeader } from "@/components/ui/card";
import { ChartFrame } from "@/components/charts/chart-frame";
import { MultiLineChart, SeriesBarChart } from "@/components/charts/cartesian";
import { DonutChart } from "@/components/charts/radial";
import { RankedBars } from "@/components/charts/specialty";
import type { ErpModule } from "@/lib/modules";
import {
  categoriesForModule,
  workspaceBreakdown,
  workspaceCategories,
  workspaceKpis,
  workspaceTrend,
} from "@/lib/data/workspace";
import {
  compactCurrency,
  compactNumber,
  currency,
  number,
} from "@/lib/utils/format";
import { SubmoduleGrid } from "./views";

export function ModuleLanding({ module }: { module: ErpModule }) {
  const seedKey = module.slug;
  const kpis = workspaceKpis(seedKey, 4);
  const trend = workspaceTrend(seedKey);
  const categories = categoriesForModule(module);
  const categoryData = workspaceCategories(seedKey, categories);
  const breakdown = workspaceBreakdown(seedKey, categories.slice(0, 5));

  const kindCounts = module.submodules.reduce<Record<string, number>>(
    (acc, sub) => {
      acc[sub.kind] = (acc[sub.kind] ?? 0) + 1;
      return acc;
    },
    {},
  );

  return (
    <PageShell className="flex flex-col gap-5">
      <PageHeader
        title={module.name}
        subtitle={module.description}
        icon={module.icon}
        tone={module.tone}
        badge={
          <>
            <Badge tone="accent">Module {module.id}</Badge>
            {module.live ? <LivePill /> : null}
            {module.badge ? (
              <Badge tone="critical" withIcon>
                {module.badge} pending
              </Badge>
            ) : null}
          </>
        }
        crumbs={[
          { label: "Home", href: "/dashboard" },
          { label: "Modules", href: "/modules" },
          { label: module.short },
        ]}
        action={
          <>
            <Button variant="secondary" size="md">
              <Download size={15} />
              <span className="hidden sm:inline">Export</span>
            </Button>
            <LinkButton
              href={`/m/${module.slug}/${module.submodules[0]?.slug ?? ""}`}
              variant="primary"
              size="md"
            >
              <Plus size={15} />
              <span className="hidden sm:inline">
                Open {module.submodules[0]?.name ?? "Workspace"}
              </span>
            </LinkButton>
          </>
        }
      />

      <section aria-label="Module indicators">
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

      <section
        aria-label="Module analytics"
        className="grid grid-cols-1 gap-4 xl:grid-cols-12"
      >
        <ChartFrame
          className="xl:col-span-7"
          title="Twelve-Month Activity"
          subtitle={`Volume and completions across ${module.short.toLowerCase()}`}
          series={[
            { key: "primary", label: "Volume" },
            { key: "secondary", label: "Completed" },
            { key: "tertiary", label: "Exceptions" },
          ]}
          data={trend}
          categoryKey="month"
          categoryLabel="Month"
          format={(value) => number(value)}
        >
          <MultiLineChart
            data={trend}
            categoryKey="month"
            series={[
              { key: "primary", label: "Volume" },
              { key: "secondary", label: "Completed" },
              { key: "tertiary", label: "Exceptions" },
            ]}
            height={280}
            format={(value) => number(value)}
            tickFormat={(value) => compactNumber(value)}
          />
        </ChartFrame>

        <ChartFrame
          className="xl:col-span-5"
          title="Value by Category"
          subtitle="Where the value sits"
          series={breakdown.map((item) => ({ key: item.label, label: item.label }))}
          data={breakdown.map((item) => ({
            category: item.label,
            ...Object.fromEntries(
              breakdown.map((inner) => [
                inner.label,
                inner.label === item.label ? inner.value : 0,
              ]),
            ),
          }))}
          categoryKey="category"
          categoryLabel="Category"
          format={(value) => currency(value)}
          hideLegend
        >
          <div className="px-3 pb-3">
            <DonutChart
              slices={breakdown}
              height={230}
              format={(value) => compactCurrency(value)}
              centerLabel="Total value"
              centerValue={compactCurrency(
                breakdown.reduce((sum, item) => sum + item.value, 0),
              )}
            />
          </div>
        </ChartFrame>
      </section>

      <section
        aria-label="Module distribution"
        className="grid grid-cols-1 gap-4 xl:grid-cols-12"
      >
        <ChartFrame
          className="xl:col-span-7"
          title="Records by Category"
          subtitle="Distribution across the business"
          series={[{ key: "value", label: "Records" }]}
          data={categoryData}
          categoryKey="category"
          categoryLabel="Category"
          format={(value) => number(value)}
        >
          <SeriesBarChart
            data={categoryData}
            categoryKey="category"
            series={[{ key: "value", label: "Records" }]}
            height={260}
            format={(value) => number(value)}
            tickFormat={(value) => compactNumber(value)}
          />
        </ChartFrame>

        <ChartFrame
          className="xl:col-span-5"
          title="Workspace Mix"
          subtitle="How this module's workspaces are composed"
          series={[{ key: "value", label: "Workspaces" }]}
          data={Object.entries(kindCounts).map(([kind, count]) => ({
            kind,
            value: count,
          }))}
          categoryKey="kind"
          categoryLabel="Workspace kind"
          format={(value) => number(value)}
        >
          <div className="px-3 pt-1 pb-3">
            <RankedBars
              items={Object.entries(kindCounts)
                .sort((a, b) => b[1] - a[1])
                .map(([kind, count]) => ({
                  label: kind.charAt(0).toUpperCase() + kind.slice(1),
                  value: count,
                }))}
              format={(value) => `${value}`}
            />
          </div>
        </ChartFrame>
      </section>

      <section aria-label="Workspaces">
        <Card>
          <CardHeader
            title={`${module.submodules.length} Workspaces`}
            subtitle={`Everything ${module.short} covers`}
            icon={<LayoutGrid size={16} />}
            action={
              <Link
                href="/modules"
                className="text-accent-ink inline-flex items-center gap-1 text-xs font-medium"
              >
                All modules
                <ArrowUpRight size={12} />
              </Link>
            }
          />
          <div className="px-4 pb-4 sm:px-5">
            <SubmoduleGrid
              moduleSlug={module.slug}
              moduleTone={module.tone}
              submodules={module.submodules}
            />
          </div>
        </Card>
      </section>
    </PageShell>
  );
}
