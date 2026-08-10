"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { groupedModules, TOTAL_MODULES, TOTAL_SUBMODULES } from "@/lib/modules";
import type { ErpModule } from "@/lib/modules";
import { ModuleIcon } from "@/components/icons/module-icon";
import { LivePill } from "@/components/ui/badge";
import { BrandLockup, BrandMark } from "./brand-mark";

interface SidebarProps {
  collapsed: boolean;
  /** Mobile drawer: closes the sheet after a navigation. */
  onNavigate?: () => void;
  className?: string;
}

// Module search and the rail toggle live in the topbar (⌘K palette and the
// panel button) — the sidebar is navigation only.
export function Sidebar({ collapsed, onNavigate, className }: SidebarProps) {
  const pathname = usePathname();
  const [openModule, setOpenModule] = useState<string | null>(null);

  const activeModuleSlug = useMemo(() => {
    const match = pathname.match(/^\/m\/([^/]+)/);
    return match?.[1] ?? null;
  }, [pathname]);

  const sections = useMemo(() => groupedModules(), []);

  return (
    <nav
      aria-label="Module navigation"
      className={cn(
        "bg-surface border-line flex h-full flex-col border-r",
        className,
      )}
    >
      {/* ── Brand ─────────────────────────────────────────────────────── */}
      <div className="border-line flex h-16 shrink-0 items-center gap-2.5 border-b px-3">
        <Link
          href="/dashboard"
          onClick={onNavigate}
          className="flex min-w-0 items-center gap-2.5"
        >
          {collapsed ? <BrandMark size={36} /> : <BrandLockup size={36} />}
        </Link>
      </div>

      {/* ── Module tree ───────────────────────────────────────────────── */}
      <div className="scroll-thin min-h-0 flex-1 overflow-y-auto px-2 pt-2 pb-3">
        {sections.map((section) => (
          <div key={section.group.id} className="mb-1">
            {!collapsed && (
              <p className="text-ink-3 px-2 pt-3 pb-1.5 text-[0.625rem] font-semibold tracking-[0.08em]">
                {section.group.caption}
              </p>
            )}
            {collapsed && <div className="hairline-x mx-2 my-2 h-px" />}

            <ul className="flex flex-col gap-0.5">
              {section.modules.map((module) => (
                <SidebarItem
                  key={module.slug}
                  module={module}
                  collapsed={collapsed}
                  isActive={activeModuleSlug === module.slug}
                  isOpen={openModule === module.slug}
                  activePath={pathname}
                  onToggle={() =>
                    setOpenModule((current) =>
                      current === module.slug ? null : module.slug,
                    )
                  }
                  onNavigate={onNavigate}
                />
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* ── Status footer ─────────────────────────────────────────────── */}
      <div className="border-line shrink-0 border-t p-3">
        {collapsed ? (
          <div className="flex justify-center">
            <span className="pulse-dot text-good relative inline-flex size-2 rounded-full bg-current" />
          </div>
        ) : (
          <div className="bg-surface-2 border-line rounded-lg border p-3">
            <div className="flex items-center justify-between">
              <span className="text-ink text-xs font-semibold">System Status</span>
              <LivePill />
            </div>
            <p className="text-good mt-1.5 text-[0.6875rem]">
              All systems operational
            </p>
            <p className="text-ink-3 mt-0.5 text-[0.625rem]">
              {TOTAL_MODULES} modules · {TOTAL_SUBMODULES} workspaces
            </p>
          </div>
        )}
      </div>
    </nav>
  );
}

function SidebarItem({
  module,
  collapsed,
  isActive,
  isOpen,
  activePath,
  onToggle,
  onNavigate,
}: {
  module: ErpModule;
  collapsed: boolean;
  isActive: boolean;
  isOpen: boolean;
  activePath: string;
  onToggle: () => void;
  onNavigate?: () => void;
}) {
  const tone = `var(--series-${module.tone})`;

  if (collapsed) {
    return (
      <li>
        <Link
          href={`/m/${module.slug}`}
          onClick={onNavigate}
          title={module.name}
          aria-label={module.name}
          className={cn(
            "relative flex items-center justify-center rounded-lg p-2.5 transition-colors",
            isActive
              ? "bg-accent-soft text-accent-ink"
              : "text-ink-3 hover:bg-surface-2 hover:text-ink",
          )}
        >
          <ModuleIcon name={module.icon} size={18} />
          {module.badge ? (
            <span className="bg-critical absolute top-1 right-1 size-1.5 rounded-full" />
          ) : null}
        </Link>
      </li>
    );
  }

  return (
    <li>
      <div
        className={cn(
          "group flex items-center rounded-lg transition-colors",
          isActive ? "bg-accent-soft" : "hover:bg-surface-2",
        )}
      >
        <Link
          href={`/m/${module.slug}`}
          onClick={onNavigate}
          className="flex min-w-0 flex-1 items-center gap-2.5 py-2 pl-2.5"
        >
          <span
            className="shrink-0"
            style={{ color: isActive ? "var(--accent-ink)" : tone }}
          >
            <ModuleIcon name={module.icon} size={17} />
          </span>
          <span
            className={cn(
              "min-w-0 flex-1 truncate text-[0.8125rem] font-medium",
              isActive ? "text-ink" : "text-ink-2",
            )}
          >
            {module.short}
          </span>
          {module.live ? (
            <span className="bg-good size-1.5 shrink-0 rounded-full" aria-label="Live data" />
          ) : null}
          {module.badge ? (
            <span className="bg-critical-soft text-critical tabular shrink-0 rounded-full px-1.5 py-0.5 text-[0.625rem] font-semibold">
              {module.badge}
            </span>
          ) : (
            <span className="text-ink-3 tabular shrink-0 text-[0.625rem]">
              {module.submodules.length}
            </span>
          )}
        </Link>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-label={`${isOpen ? "Collapse" : "Expand"} ${module.short} submodules`}
          className="text-ink-3 hover:text-ink shrink-0 px-2 py-2"
        >
          {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </button>
      </div>

      {isOpen ? (
        <ul className="border-line mt-0.5 mb-1 ml-[1.4rem] flex flex-col gap-0.5 border-l pl-2">
          {module.submodules.map((sub) => {
            const href = `/m/${module.slug}/${sub.slug}`;
            const subActive = activePath === href;
            return (
              <li key={sub.slug}>
                <Link
                  href={href}
                  onClick={onNavigate}
                  className={cn(
                    "block truncate rounded-md px-2.5 py-1.5 text-xs transition-colors",
                    subActive
                      ? "bg-accent-soft text-accent-ink font-medium"
                      : "text-ink-3 hover:bg-surface-2 hover:text-ink-2",
                  )}
                >
                  {sub.name}
                </Link>
              </li>
            );
          })}
        </ul>
      ) : null}
    </li>
  );
}
