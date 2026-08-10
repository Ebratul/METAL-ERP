import { ORG } from "@/lib/org";

/**
 * Slim identity bar pinned under the main column. Two zones: the product /
 * company / director block on the left, the location on the right. It
 * collapses to a single stacked block on narrow viewports.
 */
export function AppFooter({ className }: { className?: string }) {
  return (
    <footer
      className={`bg-surface border-line text-ink-3 flex shrink-0 flex-col gap-1 border-t px-4 py-2.5 text-[0.6875rem] sm:flex-row sm:items-center sm:justify-between sm:px-5 ${className ?? ""}`}
    >
      <p className="min-w-0 truncate">
        {ORG.product} · <span className="text-accent-ink font-medium">{ORG.company}</span> ·
        Director: {ORG.director} · <span className="tabular">{ORG.mobile}</span>
      </p>
      <p className="min-w-0 truncate sm:text-right">{ORG.address}</p>
    </footer>
  );
}
