"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { DEMO_ACCOUNT } from "@/lib/org";
import { startSession } from "@/lib/session";

const FIELD =
  "bg-surface-2 border-line text-ink placeholder:text-ink-3 h-11 w-full rounded-lg border pr-3 pl-10 text-sm outline-none transition-colors focus:border-[var(--border-accent)]";

export function LoginForm({ next }: { next?: string }) {
  const router = useRouter();
  // Pre-filled so the demo build can be opened without hunting for credentials.
  const [email, setEmail] = useState<string>(DEMO_ACCOUNT.email);
  const [password, setPassword] = useState<string>(DEMO_ACCOUNT.password);
  const [remember, setRemember] = useState(true);
  const [reveal, setReveal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (
      email.trim().toLowerCase() !== DEMO_ACCOUNT.email ||
      password !== DEMO_ACCOUNT.password
    ) {
      setError("Those credentials don't match the demo account.");
      return;
    }
    setError(null);
    setPending(true);
    startSession(remember);
    // Only same-origin paths are honoured, so `?next=` cannot bounce a signed-in
    // user off to another site.
    const target = next?.startsWith("/") && !next.startsWith("//") ? next : "/dashboard";
    router.replace(target);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
      {/* ── Email ───────────────────────────────────────────────────────── */}
      <div>
        <label
          htmlFor="login-email"
          className="text-ink-2 mb-1.5 block text-xs font-medium"
        >
          Email Address
        </label>
        <div className="relative">
          <Mail
            size={16}
            aria-hidden="true"
            className="text-ink-3 pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2"
          />
          <input
            id="login-email"
            name="email"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className={FIELD}
            placeholder="you@company.com"
          />
        </div>
      </div>

      {/* ── Password ────────────────────────────────────────────────────── */}
      <div>
        <div className="mb-1.5 flex items-baseline justify-between gap-3">
          <label htmlFor="login-password" className="text-ink-2 text-xs font-medium">
            Password
          </label>
          <Link
            href="/login"
            className="text-good text-xs font-medium hover:underline"
          >
            Reset password
          </Link>
        </div>
        <div className="relative">
          <Lock
            size={16}
            aria-hidden="true"
            className="text-ink-3 pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2"
          />
          <input
            id="login-password"
            name="password"
            type={reveal ? "text" : "password"}
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className={cn(FIELD, "pr-11")}
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setReveal((open) => !open)}
            aria-label={reveal ? "Hide password" : "Show password"}
            className="text-ink-3 hover:text-ink absolute top-1/2 right-3 -translate-y-1/2 transition-colors"
          >
            {reveal ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      {/* ── Remember ────────────────────────────────────────────────────── */}
      <label className="text-ink-2 flex cursor-pointer items-center gap-2 text-xs">
        <input
          type="checkbox"
          checked={remember}
          onChange={(event) => setRemember(event.target.checked)}
          className="accent-[var(--accent)] size-4 cursor-pointer rounded"
        />
        Remember me for 30 days
      </label>

      {error ? (
        <p
          role="alert"
          className="bg-critical-soft text-critical rounded-lg px-3 py-2 text-xs"
        >
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="text-accent-fg shadow-pop mt-1 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg text-sm font-semibold transition-opacity hover:opacity-90 disabled:pointer-events-none disabled:opacity-60"
        style={{
          background:
            "linear-gradient(90deg, var(--series-1), var(--accent), var(--series-7))",
        }}
      >
        {pending ? "Signing in…" : "Continue"}
        <ArrowRight size={16} aria-hidden="true" />
      </button>
    </form>
  );
}
