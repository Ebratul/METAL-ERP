import type { Metadata } from "next";
import Link from "next/link";
import { AppFooter } from "@/components/layout/app-footer";
import { BrandLockup } from "@/components/layout/brand-mark";
import { ORG } from "@/lib/org";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Sign in",
  description: `Sign in to your ${ORG.product} workspace.`,
};

export default async function LoginPage(props: PageProps<"/login">) {
  const { next } = await props.searchParams;
  const target = typeof next === "string" ? next : undefined;

  return (
    <div className="bg-base flex min-h-dvh flex-col">
      <main
        id="main-content"
        className="flex flex-1 items-center justify-center px-4 py-10"
      >
        <div className="w-full max-w-[26rem]">
          {/* ── Brand ─────────────────────────────────────────────────── */}
          <BrandLockup size={52} align="center" className="mb-7" />

          {/* ── Card ──────────────────────────────────────────────────── */}
          <div className="card-surface shadow-float relative overflow-hidden p-6 sm:p-8">
            <span
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-0.5"
              style={{
                background:
                  "linear-gradient(90deg, var(--series-1), var(--accent), var(--series-7))",
              }}
            />

            <h1
              className="text-center text-2xl font-bold"
              style={{
                background:
                  "linear-gradient(90deg, var(--series-1), var(--series-7))",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              Welcome back
            </h1>
            <p className="text-ink-3 mt-1.5 mb-6 text-center text-xs">
              Sign in to continue to your {ORG.product} workspace
            </p>

            <LoginForm next={target} />

            <div className="hairline-x my-5 h-px" />

            <p className="text-ink-3 text-center text-xs">
              Don&apos;t have an account?{" "}
              <Link href="/login" className="text-good font-medium hover:underline">
                Register
              </Link>
            </p>
          </div>
        </div>
      </main>

      <AppFooter className="justify-center text-center sm:justify-between sm:text-left" />
    </div>
  );
}
