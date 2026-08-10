import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { TOTAL_MODULES } from "@/lib/modules";
import { ORG } from "@/lib/org";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${ORG.product} — ${ORG.company}`,
    template: `%s · ${ORG.product}`,
  },
  description: `AI-powered world-class ERP for metal garments accessories manufacturing — ${TOTAL_MODULES} core modules covering people, sales, planning, manufacturing, quality, logistics and finance.`,
  applicationName: ORG.product,
  robots: { index: false, follow: false },
  referrer: "strict-origin-when-cross-origin",
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#080c16" },
    { media: "(prefers-color-scheme: light)", color: "#f6f7fb" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // The app is dark-first: the server renders `data-theme="dark"` and the
    // ThemeProvider reconciles with the stored preference after mount. No
    // inline bootstrap script is used, which keeps script-src free of
    // `unsafe-inline`.
    <html
      lang="en"
      data-theme="dark"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full">
        <a
          href="#main-content"
          className="bg-accent text-accent-fg sr-only rounded-lg px-4 py-2 text-sm font-medium focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[60]"
        >
          Skip to main content
        </a>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
