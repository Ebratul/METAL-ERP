import Link from "next/link";
import { Compass, LayoutDashboard } from "lucide-react";
import { TOTAL_MODULES } from "@/lib/modules";

/**
 * Rendered for unknown routes and for any module/workspace slug that fails
 * validation. It deliberately echoes nothing from the URL.
 */
export default function NotFound() {
  return (
    <div className="bg-base flex min-h-dvh items-center justify-center p-6">
      <div className="card-surface shadow-float w-full max-w-md p-8 text-center">
        <span className="bg-accent-soft text-accent-ink mx-auto flex size-14 items-center justify-center rounded-2xl">
          <Compass size={26} />
        </span>
        <h1 className="text-ink mt-5 text-xl font-bold">Workspace not found</h1>
        <p className="text-ink-3 mt-2 text-sm leading-relaxed">
          That module or workspace does not exist in this ERP. It may have been
          renamed, or the address may be mistyped.
        </p>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Link
            href="/dashboard"
            className="bg-accent text-accent-fg hover:bg-accent-hover inline-flex h-10 items-center justify-center gap-2 rounded-lg px-4 text-sm font-medium transition-colors"
          >
            <LayoutDashboard size={15} />
            Command Center
          </Link>
          <Link
            href="/modules"
            className="bg-surface-2 border-line text-ink hover:bg-surface-3 inline-flex h-10 items-center justify-center gap-2 rounded-lg border px-4 text-sm font-medium transition-colors"
          >
            Browse all {TOTAL_MODULES} modules
          </Link>
        </div>
      </div>
    </div>
  );
}
