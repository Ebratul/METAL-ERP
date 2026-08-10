"use client";

import { useId, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const CONTROL =
  "bg-surface-2 border-line text-ink placeholder:text-ink-3 w-full rounded-lg border px-3 text-sm outline-none transition-colors focus:border-[var(--border-accent)] disabled:opacity-60";

/* ── Labelled wrapper ──────────────────────────────────────────────────── */

export function FieldShell({
  label,
  htmlFor,
  required,
  error,
  hint,
  className,
  children,
}: {
  label: string;
  htmlFor?: string;
  required?: boolean;
  error?: string;
  hint?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <label
        htmlFor={htmlFor}
        className="text-ink-2 mb-1.5 block text-xs font-medium"
      >
        {label}
        {required ? (
          <span className="text-critical ml-0.5" aria-hidden="true">
            *
          </span>
        ) : null}
      </label>
      {children}
      {error ? (
        <p className="text-critical mt-1 text-[0.6875rem]" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="text-ink-3 mt-1 text-[0.6875rem]">{hint}</p>
      ) : null}
    </div>
  );
}

/* ── Controls ──────────────────────────────────────────────────────────── */

export function TextField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required,
  error,
  hint,
  suffix,
  className,
  step,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "number" | "date";
  placeholder?: string;
  required?: boolean;
  error?: string;
  hint?: string;
  /** Unit rendered inside the trailing edge of the input — "hrs", "USD", "%". */
  suffix?: string;
  className?: string;
  step?: string;
  disabled?: boolean;
}) {
  const id = useId();
  return (
    <FieldShell
      label={label}
      htmlFor={id}
      required={required}
      error={error}
      hint={hint}
      className={className}
    >
      <div className="relative">
        <input
          id={id}
          type={type}
          value={value}
          step={step}
          disabled={disabled}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          maxLength={200}
          autoComplete="off"
          aria-invalid={error ? true : undefined}
          className={cn(
            CONTROL,
            "h-9",
            suffix && "pr-12",
            error && "border-[var(--status-critical)]",
          )}
        />
        {suffix ? (
          <span className="text-ink-3 pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-[0.6875rem]">
            {suffix}
          </span>
        ) : null}
      </div>
    </FieldShell>
  );
}

export function SelectField({
  label,
  value,
  onChange,
  options,
  required,
  error,
  hint,
  className,
  placeholder = "Select…",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly string[];
  required?: boolean;
  error?: string;
  hint?: string;
  className?: string;
  placeholder?: string;
}) {
  const id = useId();
  return (
    <FieldShell
      label={label}
      htmlFor={id}
      required={required}
      error={error}
      hint={hint}
      className={className}
    >
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-invalid={error ? true : undefined}
          className={cn(
            CONTROL,
            "h-9 appearance-none pr-8",
            error && "border-[var(--status-critical)]",
          )}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <ChevronDown
          size={14}
          className="text-ink-3 pointer-events-none absolute top-1/2 right-3 -translate-y-1/2"
          aria-hidden="true"
        />
      </div>
    </FieldShell>
  );
}

export function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
  className,
  hint,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  className?: string;
  hint?: string;
}) {
  const id = useId();
  return (
    <FieldShell label={label} htmlFor={id} hint={hint} className={className}>
      <textarea
        id={id}
        value={value}
        rows={rows}
        maxLength={2_000}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={cn(CONTROL, "py-2 leading-relaxed")}
      />
    </FieldShell>
  );
}

/** Compact select used in filter bars — no label block, fixed height. */
export function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly string[];
}) {
  const id = useId();
  return (
    <div className="relative">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={cn(
          "bg-surface-2 border-line text-ink-2 h-8 appearance-none rounded-lg border pr-7 pl-3 text-xs outline-none focus:border-[var(--border-accent)]",
          value !== "all" && "text-ink border-[var(--border-accent)]",
        )}
      >
        <option value="all">{label}: All</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <ChevronDown
        size={13}
        className="text-ink-3 pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2"
        aria-hidden="true"
      />
    </div>
  );
}

/** An accessible on/off switch. */
export function Switch({
  checked,
  onChange,
  label,
  className,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors",
        checked ? "bg-accent" : "bg-surface-3",
        className,
      )}
    >
      <span
        className={cn(
          "inline-block size-3.5 rounded-full bg-white transition-transform",
          checked ? "translate-x-[1.15rem]" : "translate-x-[0.15rem]",
        )}
      />
    </button>
  );
}

/** A labelled slider for numeric preferences. */
export function SliderField({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  suffix,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
}) {
  const id = useId();
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between gap-3">
        <label htmlFor={id} className="text-ink-2 text-xs font-medium">
          {label}
        </label>
        <span className="text-ink tabular text-xs font-semibold">
          {value}
          {suffix ? ` ${suffix}` : ""}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="accent-accent h-1.5 w-full cursor-pointer"
      />
    </div>
  );
}
