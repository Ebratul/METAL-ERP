"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  ChevronDown,
  Command,
  Globe,
  LogOut,
  Mail,
  Menu,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Sun,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useTheme } from "@/components/providers/theme-provider";
import { Avatar } from "@/components/ui/feedback";
import { ModuleIcon } from "@/components/icons/module-icon";
import { getModule, getSubModule } from "@/lib/modules";
import { DEMO_ACCOUNT, ORG } from "@/lib/org";
import { endSession } from "@/lib/session";
import { NOTIFICATIONS } from "@/lib/data/notifications";
import { BrandMark } from "./brand-mark";

interface TopbarProps {
  onOpenSearch: () => void;
  onOpenMobileNav: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

/** Icon + title + kicker for the current route, resolved from the registry. */
function useRouteIdentity(pathname: string) {
  return useMemo(() => {
    if (pathname.startsWith("/modules")) {
      return {
        icon: "LayoutGrid",
        tone: 7 as const,
        title: "Module Directory",
        kicker: "MODULES",
      };
    }

    const match = pathname.match(/^\/m\/([^/]+)(?:\/([^/]+))?/);
    if (match) {
      const erpModule = getModule(match[1]);
      if (erpModule) {
        const sub = match[2] ? getSubModule(match[1], match[2]) : undefined;
        return {
          icon: erpModule.icon,
          tone: erpModule.tone,
          title: sub ? sub.name : erpModule.short,
          kicker: sub ? erpModule.short.toUpperCase() : "MODULE",
        };
      }
    }

    return {
      icon: "LayoutDashboard",
      tone: 1 as const,
      title: "CEO Command Center",
      kicker: "DASHBOARD",
    };
  }, [pathname]);
}

export function Topbar({
  onOpenSearch,
  onOpenMobileNav,
  collapsed,
  onToggleCollapse,
}: TopbarProps) {
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const route = useRouteIdentity(pathname);
  const [notifOpen, setNotifOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  const unread = NOTIFICATIONS.filter((item) => !item.read).length;
  const routeColor = `var(--series-${route.tone})`;

  return (
    <header className="bg-surface border-line sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 border-b px-3 sm:px-5">
      <button
        type="button"
        onClick={onOpenMobileNav}
        aria-label="Open navigation"
        className="text-ink-2 hover:bg-surface-2 rounded-lg p-2 lg:hidden"
      >
        <Menu size={18} />
      </button>

      {/* ── Rail toggle ───────────────────────────────────────────────── */}
      <button
        type="button"
        onClick={onToggleCollapse}
        aria-label={`${collapsed ? "Expand" : "Collapse"} sidebar`}
        className="text-ink-3 hover:bg-surface-2 hover:text-ink hidden rounded-lg p-2 transition-colors lg:block"
      >
        {collapsed ? <PanelLeftOpen size={17} /> : <PanelLeftClose size={17} />}
      </button>

      {/* ── Route identity ────────────────────────────────────────────── */}
      <div className="hidden min-w-0 items-center gap-2.5 md:flex">
        <span
          className="flex size-9 shrink-0 items-center justify-center rounded-lg"
          style={{
            backgroundColor: `color-mix(in oklab, ${routeColor} 16%, transparent)`,
            color: routeColor,
          }}
          aria-hidden="true"
        >
          <ModuleIcon name={route.icon} size={18} />
        </span>
        <span className="min-w-0">
          <span className="text-ink block truncate text-[0.9375rem] leading-tight font-bold">
            {route.title}
          </span>
          <span className="text-ink-3 block truncate text-[0.5625rem] tracking-[0.18em]">
            {route.kicker}
          </span>
        </span>
      </div>

      {/* ── Search trigger ────────────────────────────────────────────── */}
      <button
        type="button"
        onClick={onOpenSearch}
        className="bg-surface-2 border-line text-ink-3 hover:border-line-strong flex h-9 min-w-0 flex-1 items-center gap-2 rounded-lg border px-3 text-sm transition-colors sm:max-w-sm"
      >
        <Search size={15} className="shrink-0" aria-hidden="true" />
        <span className="truncate">Search modules…</span>
        <span className="ml-auto hidden shrink-0 items-center gap-0.5 sm:flex">
          <kbd className="bg-surface border-line text-ink-3 rounded border px-1 py-0.5 font-sans text-[0.625rem]">
            <Command size={9} className="inline" aria-hidden="true" />
          </kbd>
          <kbd className="bg-surface border-line text-ink-3 rounded border px-1.5 py-0.5 font-sans text-[0.625rem]">
            K
          </kbd>
        </span>
      </button>

      <div className="ml-auto flex items-center gap-1">
        {/* ── Company pill ────────────────────────────────────────────── */}
        <span className="bg-surface-2 border-line text-ink mr-1 hidden items-center gap-2 rounded-full border py-1 pr-3.5 pl-1 text-xs font-semibold xl:inline-flex">
          <BrandMark size={24} />
          {ORG.company}
        </span>

        <button
          type="button"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
          className="text-ink-2 hover:bg-surface-2 hover:text-ink rounded-lg p-2 transition-colors"
        >
          {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
        </button>

        <button
          type="button"
          aria-label="Language"
          className="text-ink-2 hover:bg-surface-2 hover:text-ink hidden rounded-lg p-2 transition-colors sm:block"
        >
          <Globe size={17} />
        </button>

        <Link
          href="/m/crm-marketing/activities"
          aria-label="Messages, 5 unread"
          className="text-ink-2 hover:bg-surface-2 hover:text-ink relative hidden rounded-lg p-2 transition-colors sm:block"
        >
          <Mail size={17} />
          <span className="bg-info text-ink-inverse absolute top-1 right-1 flex size-3.5 items-center justify-center rounded-full text-[0.5rem] font-bold">
            5
          </span>
        </Link>

        {/* ── Notifications ───────────────────────────────────────────── */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setNotifOpen((open) => !open)}
            aria-label={`Notifications, ${unread} unread`}
            aria-expanded={notifOpen}
            className="text-ink-2 hover:bg-surface-2 hover:text-ink relative rounded-lg p-2 transition-colors"
          >
            <Bell size={17} />
            {unread > 0 ? (
              <span className="bg-critical absolute top-1 right-1 flex size-3.5 items-center justify-center rounded-full text-[0.5rem] font-bold text-white">
                {unread}
              </span>
            ) : null}
          </button>

          {notifOpen ? (
            <>
              <button
                type="button"
                aria-label="Close notifications"
                onClick={() => setNotifOpen(false)}
                className="fixed inset-0 z-10 cursor-default"
              />
              <div className="bg-surface border-line shadow-float animate-rise absolute right-0 z-20 mt-2 w-80 overflow-hidden rounded-xl border">
                <div className="border-line flex items-center justify-between border-b px-4 py-3">
                  <span className="text-ink text-sm font-semibold">
                    Notifications
                  </span>
                  <span className="bg-critical-soft text-critical rounded-full px-2 py-0.5 text-[0.625rem] font-semibold">
                    {unread} new
                  </span>
                </div>
                <ul className="scroll-thin max-h-80 overflow-y-auto">
                  {NOTIFICATIONS.map((item) => (
                    <li
                      key={item.id}
                      className="border-line hover:bg-surface-2 border-b px-4 py-3 transition-colors last:border-b-0"
                    >
                      <div className="flex items-start gap-2.5">
                        <span
                          className={cn(
                            "mt-1.5 size-2 shrink-0 rounded-full",
                            item.tone === "critical" && "bg-critical",
                            item.tone === "warning" && "bg-warning",
                            item.tone === "good" && "bg-good",
                            item.tone === "info" && "bg-info",
                          )}
                          aria-hidden="true"
                        />
                        <div className="min-w-0">
                          <p className="text-ink text-xs font-medium">
                            {item.title}
                          </p>
                          <p className="text-ink-3 mt-0.5 text-[0.6875rem] leading-snug">
                            {item.detail}
                          </p>
                          <p className="text-ink-3 mt-1 text-[0.625rem]">
                            {item.age}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/m/executive-dashboard/alert-rules"
                  onClick={() => setNotifOpen(false)}
                  className="text-accent-ink hover:bg-surface-2 block px-4 py-2.5 text-center text-xs font-medium"
                >
                  View all alerts
                </Link>
              </div>
            </>
          ) : null}
        </div>

        {/* ── Identity ────────────────────────────────────────────────── */}
        <div className="border-line relative ml-1.5 border-l pl-3">
          <button
            type="button"
            onClick={() => setAccountOpen((open) => !open)}
            aria-expanded={accountOpen}
            aria-label="Account menu"
            className="hover:bg-surface-2 flex items-center gap-2.5 rounded-lg p-1 transition-colors"
          >
            <Avatar name={DEMO_ACCOUNT.name} size={34} seed={7} />
            <span className="hidden text-left sm:block">
              <span className="text-ink block text-xs font-semibold">
                {DEMO_ACCOUNT.name}
              </span>
              <span className="text-ink-3 block text-[0.625rem]">
                {DEMO_ACCOUNT.role}
              </span>
            </span>
            <ChevronDown size={14} className="text-ink-3 hidden sm:block" />
          </button>

          {accountOpen ? (
            <>
              <button
                type="button"
                aria-label="Close account menu"
                onClick={() => setAccountOpen(false)}
                className="fixed inset-0 z-10 cursor-default"
              />
              <div className="bg-surface border-line shadow-float animate-rise absolute right-0 z-20 mt-2 w-64 overflow-hidden rounded-xl border">
                <div className="border-line border-b px-4 py-3">
                  <p className="text-ink text-sm font-semibold">
                    {DEMO_ACCOUNT.name}
                  </p>
                  <p className="text-ink-3 text-[0.6875rem]">
                    {DEMO_ACCOUNT.email}
                  </p>
                </div>
                <dl className="space-y-1.5 px-4 py-3 text-[0.6875rem]">
                  <div className="flex gap-2">
                    <dt className="text-ink-3">Role:</dt>
                    <dd className="text-critical font-semibold">
                      {DEMO_ACCOUNT.role}
                    </dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="text-ink-3">Director:</dt>
                    <dd className="text-ink-2">{ORG.director}</dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="text-ink-3">Mobile:</dt>
                    <dd className="text-ink-2 tabular">{ORG.mobile}</dd>
                  </div>
                </dl>
                <button
                  type="button"
                  onClick={() => {
                    setAccountOpen(false);
                    endSession();
                    router.replace("/login");
                    router.refresh();
                  }}
                  className="text-critical hover:bg-critical-soft border-line flex w-full items-center gap-2 border-t px-4 py-2.5 text-xs font-medium transition-colors"
                >
                  <LogOut size={14} aria-hidden="true" />
                  Sign Out
                </button>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </header>
  );
}
