"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CornerDownLeft, Search, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { safeInternalPath, sanitizeQuery } from "@/lib/security/sanitize";
import { searchModules, TOTAL_MODULES, TOTAL_SUBMODULES, type SearchEntry } from "@/lib/modules";
import { ModuleIcon } from "@/components/icons/module-icon";

const QUICK_LINKS: SearchEntry[] = [
  {
    id: "dashboard",
    label: "CEO Command Center",
    moduleName: "Executive Dashboard",
    moduleSlug: "executive-dashboard",
    href: "/dashboard",
    icon: "LayoutDashboard",
    group: "intelligence",
    summary: "Live company-wide pulse",
    kind: "module",
  },
  {
    id: "modules",
    label: "All Modules",
    moduleName: "Directory",
    moduleSlug: "modules",
    href: "/modules",
    icon: "BarChart3",
    group: "intelligence",
    summary: `Browse all ${TOTAL_MODULES} modules`,
    kind: "module",
  },
  {
    id: "order-book",
    label: "Order Book",
    moduleName: "Sales Orders",
    moduleSlug: "sales-order",
    subSlug: "order-book",
    href: "/m/sales-order/order-book",
    icon: "ClipboardList",
    group: "sales",
    summary: "Every live sales order",
    kind: "list",
  },
  {
    id: "shop-floor",
    label: "Shop Floor Control",
    moduleName: "MES",
    moduleSlug: "mes",
    subSlug: "shop-floor",
    href: "/m/mes/shop-floor",
    icon: "Factory",
    group: "manufacturing",
    summary: "Live floor status",
    kind: "overview",
  },
  {
    id: "stock-summary",
    label: "Stock Summary",
    moduleName: "Inventory & Store",
    moduleSlug: "inventory-store",
    subSlug: "stock-summary",
    href: "/m/inventory-store/stock-summary",
    icon: "Boxes",
    group: "inventory",
    summary: "Value, coverage and ageing",
    kind: "analytics",
  },
];

/**
 * The outer component is a pure gate. All palette state lives in the dialog
 * below, which mounts fresh each time it opens — so there is nothing to reset
 * and no state-syncing effect.
 */
export function CommandPalette({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;
  return <PaletteDialog onClose={onClose} />;
}

function PaletteDialog({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const results = useMemo(() => {
    const clean = sanitizeQuery(query);
    if (!clean) return QUICK_LINKS;
    return searchModules(clean, 14);
  }, [query]);

  // Focus and scroll-lock are external-system work, which is what effects are
  // for. Neither sets React state.
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  useEffect(() => {
    const item = listRef.current?.children[activeIndex] as HTMLElement | undefined;
    item?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  const go = useCallback(
    (entry: SearchEntry) => {
      onClose();
      // Every href here is registry-derived, but the guard keeps a future data
      // change from turning this into an open redirect.
      router.push(safeInternalPath(entry.href));
    },
    [onClose, router],
  );

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key === "ArrowDown") {
        event.preventDefault();
        setActiveIndex((index) => (index + 1) % Math.max(1, results.length));
        return;
      }
      if (event.key === "ArrowUp") {
        event.preventDefault();
        setActiveIndex(
          (index) => (index - 1 + results.length) % Math.max(1, results.length),
        );
        return;
      }
      if (event.key === "Enter") {
        event.preventDefault();
        const entry = results[activeIndex];
        if (entry) go(entry);
      }
    },
    [results, activeIndex, go, onClose],
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[12vh]"
      role="presentation"
      onKeyDown={onKeyDown}
    >
      <button
        type="button"
        aria-label="Close search"
        onClick={onClose}
        className="bg-overlay absolute inset-0 backdrop-blur-sm"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search modules and workspaces"
        className="bg-surface border-line shadow-float animate-rise relative w-full max-w-xl overflow-hidden rounded-xl border"
      >
        <div className="border-line flex items-center gap-2.5 border-b px-4">
          <Search size={16} className="text-ink-3 shrink-0" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              // Reset the highlight where the change happens, not in an effect.
              setActiveIndex(0);
            }}
            placeholder={`Search ${TOTAL_MODULES} modules and ${TOTAL_SUBMODULES} workspaces…`}
            aria-label="Search"
            maxLength={120}
            autoComplete="off"
            spellCheck={false}
            className="text-ink placeholder:text-ink-3 h-12 flex-1 bg-transparent text-sm outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-ink-3 hover:text-ink shrink-0 rounded-md p-1"
          >
            <X size={15} />
          </button>
        </div>

        <ul
          ref={listRef}
          role="listbox"
          aria-label="Search results"
          className="scroll-thin max-h-[22rem] overflow-y-auto p-1.5"
        >
          {results.length === 0 ? (
            <li className="text-ink-3 px-3 py-10 text-center text-sm">
              No workspace matches that search.
            </li>
          ) : (
            results.map((entry, index) => (
              <li key={entry.id} role="option" aria-selected={index === activeIndex}>
                <button
                  type="button"
                  onClick={() => go(entry)}
                  onMouseEnter={() => setActiveIndex(index)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors",
                    index === activeIndex ? "bg-surface-2" : "",
                  )}
                >
                  <span className="text-ink-3 shrink-0">
                    <ModuleIcon name={entry.icon} size={16} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="text-ink block truncate text-sm font-medium">
                      {entry.label}
                    </span>
                    <span className="text-ink-3 block truncate text-xs">
                      {entry.moduleName}
                      {entry.summary ? ` · ${entry.summary}` : ""}
                    </span>
                  </span>
                  {index === activeIndex ? (
                    <CornerDownLeft
                      size={13}
                      className="text-ink-3 shrink-0"
                      aria-hidden="true"
                    />
                  ) : null}
                </button>
              </li>
            ))
          )}
        </ul>

        <div className="border-line text-ink-3 flex items-center gap-4 border-t px-4 py-2 text-[0.6875rem]">
          <span className="flex items-center gap-1">
            <Kbd>↑</Kbd>
            <Kbd>↓</Kbd> navigate
          </span>
          <span className="flex items-center gap-1">
            <Kbd>↵</Kbd> open
          </span>
          <span className="flex items-center gap-1">
            <Kbd>esc</Kbd> close
          </span>
        </div>
      </div>
    </div>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="bg-surface-2 border-line text-ink-2 rounded border px-1.5 py-0.5 font-sans text-[0.625rem]">
      {children}
    </kbd>
  );
}
