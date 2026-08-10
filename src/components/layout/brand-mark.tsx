import Image from "next/image";
import { cn } from "@/lib/utils/cn";
import { ORG } from "@/lib/org";

/**
 * The source asset is a square lock-up: the circular SGI badge sits in the top
 * ~60% and the "Smart Global IT" wordmark below it. The chip shows the badge
 * only, so the wordmark next to it is not duplicated — the transform below
 * scales the badge up to fill the circle and re-centres it.
 * scale = 1 / 0.62 (badge width as a fraction of the asset).
 */
const BADGE_CROP = "scale(1.6) translate(0.6%, 16.3%)";

export function BrandMark({
  size = 36,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "border-line-accent relative inline-flex shrink-0 overflow-hidden rounded-full border bg-black",
        className,
      )}
      style={{ width: size, height: size }}
    >
      <Image
        src="/company_logo.jpeg"
        alt=""
        width={size * 3}
        height={size * 3}
        priority
        className="size-full object-cover"
        style={{ transform: BADGE_CROP }}
      />
    </span>
  );
}

/** Logo badge + the two-line company / product lockup. */
export function BrandLockup({
  size = 36,
  className,
  align = "start",
}: {
  size?: number;
  className?: string;
  align?: "start" | "center";
}) {
  return (
    <span
      className={cn(
        "flex min-w-0 items-center gap-2.5",
        align === "center" && "justify-center",
        className,
      )}
    >
      <BrandMark size={size} />
      <span className="min-w-0">
        <span
          className="block truncate leading-tight font-bold"
          style={{
            fontSize: Math.round(size * 0.44),
            background:
              "linear-gradient(90deg, var(--series-1), var(--series-7))",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          {ORG.company}
        </span>
        <span
          className="text-ink-3 block truncate tracking-[0.22em]"
          style={{ fontSize: Math.max(9, Math.round(size * 0.24)) }}
        >
          {ORG.product.toUpperCase()}
        </span>
      </span>
    </span>
  );
}
