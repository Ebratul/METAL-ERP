import type { NextConfig } from "next";

/**
 * Content Security Policy.
 *
 * `script-src` carries `'unsafe-inline'`. That is a deliberate, documented
 * trade-off, not an oversight: this app is fully prerendered (640 static
 * pages), and Next.js embeds the RSC payload as inline `self.__next_f.push(...)`
 * scripts in that static HTML. A nonce cannot be applied to markup produced at
 * build time — Next only injects nonces during *server-side* rendering, so
 * switching to a nonce CSP means opting every page into dynamic rendering and
 * giving up static generation.
 *
 * When a backend lands and pages become dynamic, move this policy into a
 * `proxy.ts` that mints a per-request nonce, and drop `'unsafe-inline'` from
 * `script-src` (see `node_modules/next/dist/docs/01-app/02-guides/content-security-policy.md`).
 *
 * Everything else is locked down: no plugins, no framing, no base-tag
 * hijacking, no cross-origin form posts, and no network egress beyond origin.
 */
function contentSecurityPolicy(isDev: boolean): string {
  return [
    "default-src 'self'",
    // 'unsafe-eval' is required by React in development only (error overlays,
    // reconstructed server stacks). Production never needs it.
    `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
    // Tailwind and the chart layer emit inline style attributes.
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self' data:",
    // No backend yet: the app makes no cross-origin requests at all.
    `connect-src 'self'${isDev ? " ws: wss:" : ""}`,
    "media-src 'self'",
    "worker-src 'self' blob:",
    "manifest-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "frame-src 'none'",
    "upgrade-insecure-requests",
  ].join("; ");
}

/**
 * Disable browser features this ERP never uses. An injected script cannot turn
 * a capability back on once the header has denied it.
 */
const PERMISSIONS_POLICY = [
  "accelerometer=()",
  "autoplay=()",
  "camera=()",
  "display-capture=()",
  "encrypted-media=()",
  "fullscreen=(self)",
  "geolocation=()",
  "gyroscope=()",
  "magnetometer=()",
  "microphone=()",
  "midi=()",
  "payment=()",
  "publickey-credentials-get=()",
  "screen-wake-lock=()",
  "usb=()",
  "xr-spatial-tracking=()",
].join(", ");

const nextConfig: NextConfig = {
  // Never advertise the framework or its version.
  poweredByHeader: false,

  reactStrictMode: true,

  async headers() {
    const isDev = process.env.NODE_ENV === "development";

    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: contentSecurityPolicy(isDev),
          },
          // Belt-and-braces with frame-ancestors for older browsers.
          { key: "X-Frame-Options", value: "DENY" },
          // Stop MIME sniffing turning an upload into an executable script.
          { key: "X-Content-Type-Options", value: "nosniff" },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          { key: "Permissions-Policy", value: PERMISSIONS_POLICY },
          // Isolate the browsing context: blocks cross-origin window handles
          // and Spectre-style cross-origin reads.
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
          { key: "Origin-Agent-Cluster", value: "?1" },
          { key: "X-DNS-Prefetch-Control", value: "off" },
          // No production deployment should be indexed — this is internal.
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
