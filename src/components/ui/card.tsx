import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

interface CardProps {
  children: ReactNode;
  className?: string;
  /** Adds the hairline top sheen used on hero cards. */
  sheen?: boolean;
  as?: "div" | "section" | "article";
}

export function Card({
  children,
  className,
  sheen = false,
  as: Tag = "div",
}: CardProps) {
  return (
    <Tag
      className={cn(
        "card-surface shadow-card overflow-hidden",
        sheen && "card-sheen",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

interface CardHeaderProps {
  title: ReactNode;
  subtitle?: ReactNode;
  /** Right-hand slot: filters, range pickers, view toggles. */
  action?: ReactNode;
  icon?: ReactNode;
  className?: string;
  /** Renders the title as an h2 (default) or h3 for nested cards. */
  level?: 2 | 3;
}

export function CardHeader({
  title,
  subtitle,
  action,
  icon,
  className,
  level = 2,
}: CardHeaderProps) {
  const Heading = level === 2 ? "h2" : "h3";
  return (
    <div
      className={cn(
        "flex items-start justify-between gap-3 px-4 pt-4 pb-3 sm:px-5",
        className,
      )}
    >
      <div className="flex min-w-0 items-start gap-2.5">
        {icon ? (
          <span className="text-ink-3 mt-0.5 shrink-0" aria-hidden="true">
            {icon}
          </span>
        ) : null}
        <div className="min-w-0">
          <Heading className="text-ink truncate text-[0.9375rem] leading-tight font-semibold">
            {title}
          </Heading>
          {subtitle ? (
            <p className="text-ink-3 mt-1 text-xs leading-snug">{subtitle}</p>
          ) : null}
        </div>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function CardBody({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("px-4 pb-4 sm:px-5 sm:pb-5", className)}>{children}</div>;
}

export function CardFooter({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "border-line bg-surface-2/50 border-t px-4 py-3 sm:px-5",
        className,
      )}
    >
      {children}
    </div>
  );
}
