import type { ReactNode } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { ModuleIcon } from "@/components/icons/module-icon";

export interface Crumb {
  label: string;
  href?: string;
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="text-ink-3 flex flex-wrap items-center gap-1 text-xs">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1">
              {item.href && !isLast ? (
                <Link href={item.href} className="hover:text-ink-2 transition-colors">
                  {item.label}
                </Link>
              ) : (
                <span className={isLast ? "text-ink-2" : undefined}>
                  {item.label}
                </span>
              )}
              {!isLast ? (
                <ChevronRight size={12} className="shrink-0 opacity-60" aria-hidden="true" />
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: string;
  /** Categorical slot 1–8 for the icon chip. */
  tone?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  crumbs?: Crumb[];
  /** Buttons / filters. This is the one filter row that scopes the page. */
  action?: ReactNode;
  badge?: ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  subtitle,
  icon,
  tone = 1,
  crumbs,
  action,
  badge,
  className,
}: PageHeaderProps) {
  const color = `var(--series-${tone})`;

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {crumbs?.length ? <Breadcrumbs items={crumbs} /> : null}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          {icon ? (
            <span
              className="flex size-11 shrink-0 items-center justify-center rounded-xl"
              style={{
                backgroundColor: `color-mix(in oklab, ${color} 16%, transparent)`,
                color,
              }}
            >
              <ModuleIcon name={icon} size={22} />
            </span>
          ) : null}
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-ink truncate text-xl font-bold tracking-tight sm:text-2xl">
                {title}
              </h1>
              {badge}
            </div>
            {subtitle ? (
              <p className="text-ink-3 mt-1 text-sm">{subtitle}</p>
            ) : null}
          </div>
        </div>
        {action ? (
          <div className="flex shrink-0 flex-wrap items-center gap-2">{action}</div>
        ) : null}
      </div>
    </div>
  );
}

/** Standard page container: consistent gutters and vertical rhythm. */
export function PageShell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-[110rem] p-4 sm:p-5 lg:p-6", className)}>
      {children}
    </div>
  );
}
