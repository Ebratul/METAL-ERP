import Link from "next/link";
import {
  ArrowUpRight,
  CircleAlert,
  CircleCheck,
  Info,
  Sparkles,
  TriangleAlert,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Card, CardHeader } from "@/components/ui/card";
import { LivePill } from "@/components/ui/badge";
import { ModuleIcon } from "@/components/icons/module-icon";
import {
  AI_INSIGHTS,
  LIVE_ALERTS,
  SYSTEM_SERVICES,
} from "@/lib/data/notifications";
import { PENDING_APPROVALS } from "@/lib/data/dashboard";

const TONE_ICON = {
  good: CircleCheck,
  warning: TriangleAlert,
  serious: CircleAlert,
  critical: CircleAlert,
  info: Info,
} as const;

const TONE_CLASS = {
  good: "text-good bg-good-soft",
  warning: "text-warning bg-warning-soft",
  serious: "text-serious bg-serious-soft",
  critical: "text-critical bg-critical-soft",
  info: "text-info bg-info-soft",
} as const;

/* ── Live alerts ───────────────────────────────────────────────────────── */

export function LiveAlertsPanel() {
  return (
    <Card className="flex flex-col">
      <CardHeader
        title="Live Alerts"
        action={<LivePill />}
        icon={<CircleAlert size={16} />}
      />
      <ul className="flex flex-col">
        {LIVE_ALERTS.map((alert) => {
          const Icon = TONE_ICON[alert.tone];
          return (
            <li key={alert.id}>
              <Link
                href={alert.href}
                className="hover:bg-surface-2 border-line flex items-start gap-3 border-t px-4 py-3 transition-colors sm:px-5"
              >
                <span
                  className={cn(
                    "mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg",
                    TONE_CLASS[alert.tone],
                  )}
                >
                  <Icon size={14} strokeWidth={2.25} aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="text-ink block truncate text-xs font-semibold">
                    {alert.title}
                  </span>
                  <span className="text-ink-3 block truncate text-[0.6875rem]">
                    {alert.detail}
                  </span>
                </span>
                <span className="text-ink-3 shrink-0 text-[0.625rem] whitespace-nowrap">
                  {alert.age}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}

/* ── AI insights ───────────────────────────────────────────────────────── */

export function AiInsightsPanel() {
  return (
    <Card className="flex flex-col">
      <CardHeader
        title="AI Business Insights"
        subtitle="Ranked by revenue impact"
        icon={<Sparkles size={16} />}
        action={
          <Link
            href="/m/ai-center/insight-feed"
            className="text-accent-ink inline-flex items-center gap-1 text-xs font-medium"
          >
            View all
            <ArrowUpRight size={12} />
          </Link>
        }
      />
      <ul className="flex flex-col gap-2 px-4 pb-4 sm:px-5">
        {AI_INSIGHTS.map((insight) => {
          const Icon = TONE_ICON[insight.tone];
          return (
            <li key={insight.id}>
              <Link
                href={insight.href}
                className="bg-surface-2 hover:bg-surface-3 flex items-start gap-3 rounded-lg p-3 transition-colors"
              >
                <span
                  className={cn(
                    "flex size-7 shrink-0 items-center justify-center rounded-lg",
                    TONE_CLASS[insight.tone],
                  )}
                >
                  <Icon size={14} strokeWidth={2.25} aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="text-ink block text-xs font-semibold">
                    {insight.title}
                  </span>
                  <span className="text-ink-3 mt-0.5 block text-[0.6875rem] leading-snug">
                    {insight.detail}
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}

/* ── System status ─────────────────────────────────────────────────────── */

export function SystemStatusPanel() {
  const degraded = SYSTEM_SERVICES.filter(
    (service) => service.status !== "operational",
  ).length;

  return (
    <Card className="flex flex-col">
      <CardHeader
        title="System Status"
        subtitle={
          degraded === 0
            ? "All systems operational"
            : `${degraded} service${degraded > 1 ? "s" : ""} degraded`
        }
        icon={<CircleCheck size={16} />}
        action={<LivePill />}
      />
      <ul className="flex flex-col gap-1.5 px-4 pb-4 sm:px-5">
        {SYSTEM_SERVICES.map((service) => (
          <li
            key={service.name}
            className="flex items-center justify-between gap-3 py-1"
          >
            <span className="text-ink-2 flex min-w-0 items-center gap-2 text-xs">
              <span
                className={cn(
                  "size-1.5 shrink-0 rounded-full",
                  service.status === "operational" && "bg-good",
                  service.status === "degraded" && "bg-warning",
                  service.status === "down" && "bg-critical",
                )}
                aria-hidden="true"
              />
              <span className="truncate">{service.name}</span>
            </span>
            <span className="flex shrink-0 items-center gap-2">
              <span className="text-ink-3 tabular text-[0.625rem]">
                {service.uptime}
              </span>
              <span
                className={cn(
                  "text-[0.625rem] font-medium capitalize",
                  service.status === "operational" && "text-good",
                  service.status === "degraded" && "text-warning",
                  service.status === "down" && "text-critical",
                )}
              >
                {service.status}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

/* ── Pending approvals ─────────────────────────────────────────────────── */

export function ApprovalsPanel() {
  const total = PENDING_APPROVALS.reduce((sum, item) => sum + item.count, 0);

  return (
    <Card className="flex flex-col">
      <CardHeader
        title="Waiting on You"
        subtitle={`${total} approvals pending`}
        icon={<ModuleIcon name="GitBranch" size={16} />}
        action={
          <Link
            href="/m/workflow-approval/my-approvals"
            className="text-accent-ink inline-flex items-center gap-1 text-xs font-medium"
          >
            Open queue
            <ArrowUpRight size={12} />
          </Link>
        }
      />
      <ul className="grid grid-cols-2 gap-2 px-4 pb-4 sm:px-5">
        {PENDING_APPROVALS.map((item) => (
          <li key={item.label}>
            <Link
              href={item.href}
              className="bg-surface-2 hover:bg-surface-3 flex items-center justify-between gap-2 rounded-lg p-3 transition-colors"
            >
              <span className="text-ink-2 min-w-0 truncate text-[0.6875rem]">
                {item.label}
              </span>
              <span
                className="tabular shrink-0 rounded-md px-1.5 py-0.5 text-xs font-bold"
                style={{
                  backgroundColor: `color-mix(in oklab, var(--series-${item.tone}) 16%, transparent)`,
                  color: `var(--series-${item.tone})`,
                }}
              >
                {item.count}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </Card>
  );
}

/* ── Quick actions ─────────────────────────────────────────────────────── */

const QUICK_ACTIONS = [
  { label: "New Sales Order", href: "/m/sales-order/create-order", icon: "ClipboardList", tone: 1 },
  { label: "Create Quotation", href: "/m/quotation-costing/new-quotation", icon: "Calculator", tone: 2 },
  { label: "Raise Purchase Order", href: "/m/purchase-order/create-po", icon: "FileCheck2", tone: 3 },
  { label: "Log Production", href: "/m/production/output-entry", icon: "Factory", tone: 4 },
  { label: "Sample Request", href: "/m/sample-management/sample-requests", icon: "Shirt", tone: 5 },
  { label: "Stock Transfer", href: "/m/inventory-store/transfers", icon: "Boxes", tone: 7 },
] as const;

export function QuickActionsPanel() {
  return (
    <Card>
      <CardHeader title="Quick Actions" icon={<Sparkles size={16} />} />
      <div className="grid grid-cols-2 gap-2 px-4 pb-4 sm:grid-cols-3 sm:px-5">
        {QUICK_ACTIONS.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="bg-surface-2 hover:bg-surface-3 flex flex-col items-center gap-2 rounded-lg p-3 text-center transition-colors"
          >
            <span
              className="flex size-9 items-center justify-center rounded-lg"
              style={{
                backgroundColor: `color-mix(in oklab, var(--series-${action.tone}) 16%, transparent)`,
                color: `var(--series-${action.tone})`,
              }}
            >
              <ModuleIcon name={action.icon} size={17} />
            </span>
            <span className="text-ink-2 text-[0.6875rem] leading-tight font-medium">
              {action.label}
            </span>
          </Link>
        ))}
      </div>
    </Card>
  );
}
