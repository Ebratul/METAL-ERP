"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { LayoutGrid, Search, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/feedback";
import { sanitizeQuery } from "@/lib/security/sanitize";
import type { SubModule } from "@/lib/modules";

const KIND_LABEL: Record<string, string> = {
  overview: "Overview",
  list: "Register",
  board: "Board",
  analytics: "Analytics",
  calendar: "Calendar",
  form: "Entry",
  settings: "Settings",
};

/**
 * The module landing grid.
 *
 * With twenty workspaces per module the grid needs its own way in, so it
 * carries a filter box and a kind switch rather than making the user scan.
 */
export function SubmoduleGrid({
  moduleSlug,
  moduleTone,
  submodules,
}: {
  moduleSlug: string;
  moduleTone: number;
  submodules: SubModule[];
}) {
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState<string>("all");

  const kinds = useMemo(() => {
    const seen = new Map<string, number>();
    for (const sub of submodules) {
      seen.set(sub.kind, (seen.get(sub.kind) ?? 0) + 1);
    }
    return [...seen.entries()];
  }, [submodules]);

  const visible = useMemo(() => {
    const clean = sanitizeQuery(query).toLowerCase();
    return submodules.filter((sub) => {
      if (kind !== "all" && sub.kind !== kind) return false;
      if (!clean) return true;
      return `${sub.name} ${sub.summary ?? ""}`.toLowerCase().includes(clean);
    });
  }, [submodules, query, kind]);

  if (submodules.length === 0) {
    return <EmptyState title="No workspaces configured" />;
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-[12rem] flex-1 sm:max-w-xs">
          <Search
            size={15}
            className="text-ink-3 pointer-events-none absolute top-1/2 left-3 -translate-y-1/2"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={`Filter ${submodules.length} workspaces…`}
            aria-label="Filter workspaces"
            maxLength={80}
            autoComplete="off"
            spellCheck={false}
            className="bg-surface-2 border-line text-ink placeholder:text-ink-3 h-9 w-full rounded-lg border pr-3 pl-9 text-sm outline-none focus:border-[var(--border-accent)]"
          />
        </div>

        <div
          role="group"
          aria-label="Filter by workspace type"
          className="scroll-thin flex items-center gap-1.5 overflow-x-auto"
        >
          <KindChip
            active={kind === "all"}
            label={`All (${submodules.length})`}
            onClick={() => setKind("all")}
          />
          {kinds.map(([id, count]) => (
            <KindChip
              key={id}
              active={kind === id}
              label={`${KIND_LABEL[id] ?? id} (${count})`}
              onClick={() => setKind(id)}
            />
          ))}
        </div>

        {query || kind !== "all" ? (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              setQuery("");
              setKind("all");
            }}
          >
            <X size={13} />
            Clear
          </Button>
        ) : null}
      </div>

      {visible.length === 0 ? (
        <EmptyState
          icon={<LayoutGrid size={20} />}
          title="No workspace matches that filter"
          description="Try a different word, or switch back to all workspace types."
        />
      ) : (
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visible.map((sub) => (
            <li key={sub.slug}>
              <Link
                href={`/m/${moduleSlug}/${sub.slug}`}
                className="card-surface shadow-card hover:border-line-strong group flex h-full flex-col gap-2 p-4 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-ink text-sm leading-snug font-semibold">
                    {sub.name}
                  </span>
                  <span
                    className="mt-0.5 size-2 shrink-0 rounded-full"
                    style={{ backgroundColor: `var(--series-${moduleTone})` }}
                    aria-hidden="true"
                  />
                </div>
                {sub.summary ? (
                  <p className="text-ink-3 text-xs leading-relaxed">{sub.summary}</p>
                ) : null}
                <span className="text-ink-3 mt-auto pt-2 text-[0.625rem] tracking-wide uppercase">
                  {KIND_LABEL[sub.kind] ?? sub.kind}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function KindChip({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "shrink-0 rounded-full border px-2.5 py-1 text-[0.6875rem] font-medium whitespace-nowrap transition-colors",
        active
          ? "border-[var(--border-accent)] bg-accent-soft text-accent-ink"
          : "border-line text-ink-3 hover:text-ink-2",
      )}
    >
      {label}
    </button>
  );
}
