/**
 * Demo session gate.
 *
 * There is no backend identity provider in this build, so "being signed in"
 * is a browser cookie the login screen sets and the sign-out control clears.
 * `proxy.ts` reads it to keep unauthenticated visitors on `/login`. It is a
 * routing gate, not an authorisation boundary — nothing behind it is secret,
 * and it must be replaced with a signed, httpOnly server session when a real
 * auth backend lands.
 */
export const SESSION_COOKIE = "metal-erp-session";

/** "Remember me for 30 days"; otherwise the cookie dies with the tab. */
const REMEMBER_MAX_AGE = 60 * 60 * 24 * 30;

export function startSession(remember: boolean) {
  const lifetime = remember ? `; max-age=${REMEMBER_MAX_AGE}` : "";
  document.cookie = `${SESSION_COOKIE}=active; path=/; samesite=lax${lifetime}`;
}

export function endSession() {
  document.cookie = `${SESSION_COOKIE}=; path=/; max-age=0; samesite=lax`;
}
