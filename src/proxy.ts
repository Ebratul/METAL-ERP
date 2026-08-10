import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/session";

/**
 * Route gate: every page requires the demo session cookie. Visitors without
 * one land on `/login`, carrying the path they wanted in `?next=` so the form
 * can return them there. See `lib/session.ts` for what this cookie is (and is
 * not).
 */
export function proxy(request: NextRequest) {
  const signedIn = request.cookies.has(SESSION_COOKIE);
  const { pathname, search } = request.nextUrl;
  const isLoginRoute = pathname === "/login";

  if (!signedIn && !isLoginRoute) {
    const url = new URL("/login", request.url);
    if (pathname !== "/") url.searchParams.set("next", `${pathname}${search}`);
    return NextResponse.redirect(url);
  }

  // Already signed in — the login screen has nothing to offer.
  if (signedIn && isLoginRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Skip Next internals, the generated icons and anything with a file
  // extension — only page navigations are gated.
  matcher: ["/((?!_next/|icon|apple-icon|.*\\.[\\w]+$).*)"],
};
