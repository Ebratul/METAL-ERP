/**
 * Organisation identity — the single source of truth for the company block
 * that appears in the footer, the login page and the sidebar account card.
 * Change it here and every surface follows.
 */
export const ORG = {
  product: "Metal ERP",
  company: "Smart Global IT",
  director: "Mohammad Sayem",
  /** Super-admin hotline. */
  mobile: "+8801711-772407",
  address: "Chittagong South Kulshi, Bangladesh",
} as const;

/**
 * Demo credentials pre-filled on the login form. This build ships without a
 * backend identity provider, so the sign-in screen is a gated demo entry
 * point rather than a real authentication boundary.
 */
export const DEMO_ACCOUNT = {
  email: "admin@smartglobalit.net",
  password: "admin123",
  name: "Mohammad Sayem",
  role: "Super-Admin",
} as const;
