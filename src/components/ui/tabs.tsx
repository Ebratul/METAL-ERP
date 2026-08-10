"use client";

import { useId, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export interface TabItem {
  id: string;
  label: string;
  badge?: number | string;
  content: ReactNode;
}

interface TabsProps {
  items: TabItem[];
  defaultTab?: string;
  className?: string;
  /** Right-hand slot in the tab strip (filters, range picker). */
  action?: ReactNode;
  ariaLabel: string;
}

export function Tabs({
  items,
  defaultTab,
  className,
  action,
  ariaLabel,
}: TabsProps) {
  const [active, setActive] = useState(defaultTab ?? items[0]?.id);
  const baseId = useId();
  const current = items.find((item) => item.id === active) ?? items[0];

  return (
    <div className={className}>
      <div className="border-line flex items-center justify-between gap-3 border-b">
        <div
          role="tablist"
          aria-label={ariaLabel}
          className="scroll-thin -mb-px flex gap-1 overflow-x-auto"
        >
          {items.map((item) => {
            const selected = item.id === current?.id;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                id={`${baseId}-tab-${item.id}`}
                aria-selected={selected}
                aria-controls={`${baseId}-panel-${item.id}`}
                onClick={() => setActive(item.id)}
                className={cn(
                  "relative flex shrink-0 items-center gap-2 border-b-2 px-3 py-2.5 text-sm font-medium whitespace-nowrap transition-colors",
                  selected
                    ? "border-[var(--accent)] text-[var(--text-primary)]"
                    : "text-ink-3 hover:text-ink-2 border-transparent",
                )}
              >
                {item.label}
                {item.badge !== undefined ? (
                  <span
                    className={cn(
                      "tabular rounded-full px-1.5 py-0.5 text-[0.625rem] font-semibold",
                      selected
                        ? "bg-accent-soft text-accent-ink"
                        : "bg-surface-3 text-ink-3",
                    )}
                  >
                    {item.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
        {action ? <div className="shrink-0 pb-2">{action}</div> : null}
      </div>

      {current ? (
        <div
          role="tabpanel"
          id={`${baseId}-panel-${current.id}`}
          aria-labelledby={`${baseId}-tab-${current.id}`}
          className="pt-4"
        >
          {current.content}
        </div>
      ) : null}
    </div>
  );
}

interface SegmentedProps<T extends string> {
  options: Array<{ value: T; label: string; icon?: ReactNode }>;
  value: T;
  onChange: (value: T) => void;
  ariaLabel: string;
  size?: "sm" | "md";
  className?: string;
}

/**
 * A compact view/range switch. Lives in the filter row above the charts it
 * scopes — never inside an individual chart card.
 */
export function Segmented<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
  size = "sm",
  className,
}: SegmentedProps<T>) {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={cn(
        "bg-surface-2 border-line inline-flex items-center gap-0.5 rounded-lg border p-0.5",
        className,
      )}
    >
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(option.value)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md font-medium transition-colors",
              size === "sm" ? "px-2.5 py-1 text-xs" : "px-3 py-1.5 text-sm",
              selected
                ? "bg-surface text-ink shadow-card"
                : "text-ink-3 hover:text-ink-2",
            )}
          >
            {option.icon}
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
