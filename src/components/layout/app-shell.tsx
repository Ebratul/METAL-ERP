"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useStoredFlag } from "@/lib/hooks/use-stored-state";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import { AppFooter } from "./app-footer";
import { CommandPalette } from "./command-palette";

const COLLAPSE_KEY = "smart-erp-sidebar-collapsed";

export function AppShell({ children }: { children: ReactNode }) {
  // The rail preference lives in localStorage and is read during render, not
  // restored by an effect — the expanded state is what SSR emits.
  const [collapsed, setCollapsed] = useStoredFlag(COLLAPSE_KEY, false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const toggleCollapse = useCallback(() => {
    setCollapsed(!collapsed);
  }, [collapsed, setCollapsed]);

  // ⌘K / Ctrl+K opens search; Escape closes the mobile drawer.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen((open) => !open);
      }
      if (event.key === "Escape") setMobileOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className="bg-base flex h-dvh overflow-hidden">
      {/* ── Desktop sidebar ───────────────────────────────────────────── */}
      <aside
        className={cn(
          "hidden shrink-0 transition-[width] duration-200 lg:block",
          collapsed ? "w-[4.5rem]" : "w-[17rem]",
        )}
      >
        <Sidebar collapsed={collapsed} />
      </aside>

      {/* ── Mobile drawer ─────────────────────────────────────────────── */}
      {mobileOpen ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setMobileOpen(false)}
            className="bg-overlay absolute inset-0 backdrop-blur-sm"
          />
          <div className="animate-rise absolute inset-y-0 left-0 w-[17rem] max-w-[85vw]">
            <Sidebar collapsed={false} onNavigate={() => setMobileOpen(false)} />
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label="Close navigation"
              className="bg-surface border-line text-ink-2 absolute top-4 -right-11 rounded-lg border p-2"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      ) : null}

      {/* ── Main column ───────────────────────────────────────────────── */}
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          onOpenSearch={() => setSearchOpen(true)}
          onOpenMobileNav={() => setMobileOpen(true)}
          collapsed={collapsed}
          onToggleCollapse={toggleCollapse}
        />
        <main
          id="main-content"
          className="scroll-thin min-h-0 flex-1 overflow-y-auto"
        >
          {children}
        </main>
        <AppFooter />
      </div>

      <CommandPalette open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}
