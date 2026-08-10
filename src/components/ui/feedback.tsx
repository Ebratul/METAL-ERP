import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";
import { initials } from "@/lib/utils/format";

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 px-6 py-14 text-center",
        className,
      )}
    >
      {icon ? (
        <span className="bg-surface-2 text-ink-3 flex size-12 items-center justify-center rounded-xl">
          {icon}
        </span>
      ) : null}
      <div>
        <p className="text-ink text-sm font-semibold">{title}</p>
        {description ? (
          <p className="text-ink-3 mt-1 max-w-sm text-xs leading-relaxed">
            {description}
          </p>
        ) : null}
      </div>
      {action}
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("skeleton rounded-md", className)} aria-hidden="true" />;
}

export function ChartSkeleton({ height = 220 }: { height?: number }) {
  return (
    <div className="flex flex-col gap-3 p-4" aria-hidden="true">
      <Skeleton className="h-3 w-28" />
      <div className="skeleton w-full rounded-lg" style={{ height }} />
    </div>
  );
}

const AVATAR_TONE = [1, 3, 5, 7, 2, 4] as const;

export function Avatar({
  name,
  size = 32,
  className,
  seed,
}: {
  name: string;
  size?: number;
  className?: string;
  /** Stable index into the tone list; defaults to the name's length. */
  seed?: number;
}) {
  const tone = AVATAR_TONE[(seed ?? name.length) % AVATAR_TONE.length];
  const color = `var(--series-${tone})`;
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full font-semibold",
        className,
      )}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.36,
        backgroundColor: `color-mix(in oklab, ${color} 18%, transparent)`,
        color,
      }}
      title={name}
      aria-hidden="true"
    >
      {initials(name)}
    </span>
  );
}

/** A labelled key/value row used inside detail panels. */
export function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-baseline justify-between gap-4 py-2", className)}>
      <dt className="text-ink-3 shrink-0 text-xs">{label}</dt>
      <dd className="text-ink text-right text-sm font-medium">{children}</dd>
    </div>
  );
}
