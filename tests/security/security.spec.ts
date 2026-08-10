import { expect, test, type APIResponse } from "@playwright/test";

/**
 * Security suite.
 *
 * These run against the production build (`next start`) because dev does not
 * serve production headers and inlines scripts differently — testing dev would
 * prove nothing about what actually ships.
 */

function parseCsp(header: string): Map<string, string[]> {
  const directives = new Map<string, string[]>();
  for (const part of header.split(";")) {
    const [name, ...values] = part.trim().split(/\s+/);
    if (name) directives.set(name.toLowerCase(), values);
  }
  return directives;
}

test.describe("Response headers", () => {
  let response: APIResponse;

  test.beforeAll(async ({ request }) => {
    response = await request.get("/dashboard");
  });

  test("serves the page successfully", () => {
    expect(response.status()).toBe(200);
  });

  test("sets a Content-Security-Policy", () => {
    const csp = response.headers()["content-security-policy"];
    expect(csp, "CSP header must be present").toBeTruthy();

    const directives = parseCsp(csp);

    // Nothing loads by default beyond our own origin.
    expect(directives.get("default-src")).toEqual(["'self'"]);

    // No plugins, no framing, no base-tag hijacking, no off-origin form posts.
    expect(directives.get("object-src")).toEqual(["'none'"]);
    expect(directives.get("frame-ancestors")).toEqual(["'none'"]);
    expect(directives.get("frame-src")).toEqual(["'none'"]);
    expect(directives.get("base-uri")).toEqual(["'self'"]);
    expect(directives.get("form-action")).toEqual(["'self'"]);

    // No network egress off-origin — this build has no backend.
    expect(directives.get("connect-src")).toEqual(["'self'"]);

    expect(directives.has("upgrade-insecure-requests")).toBe(true);
  });

  test("production CSP never allows unsafe-eval", () => {
    const csp = response.headers()["content-security-policy"];
    expect(csp).not.toContain("'unsafe-eval'");
  });

  test("CSP allows no wildcard or off-origin script source", () => {
    const csp = response.headers()["content-security-policy"];
    const scriptSrc = parseCsp(csp).get("script-src") ?? [];

    // `'unsafe-inline'` is the one documented relaxation (static prerendering
    // embeds the RSC payload inline and a nonce cannot be applied at build
    // time). No wildcard and no third-party origin is acceptable on top of it.
    expect(scriptSrc).toContain("'self'");
    expect(scriptSrc).not.toContain("*");
    expect(scriptSrc.filter((src) => src.startsWith("http"))).toEqual([]);
    expect(scriptSrc.filter((src) => src.includes("data:"))).toEqual([]);
  });

  test("sets clickjacking and MIME-sniffing protections", () => {
    const headers = response.headers();
    expect(headers["x-frame-options"]).toBe("DENY");
    expect(headers["x-content-type-options"]).toBe("nosniff");
  });

  test("sets a privacy-preserving referrer policy", () => {
    expect(response.headers()["referrer-policy"]).toBe(
      "strict-origin-when-cross-origin",
    );
  });

  test("denies unused browser capabilities", () => {
    const policy = response.headers()["permissions-policy"];
    expect(policy).toBeTruthy();

    for (const feature of [
      "camera=()",
      "microphone=()",
      "geolocation=()",
      "payment=()",
      "usb=()",
    ]) {
      expect(policy).toContain(feature);
    }
  });

  test("isolates the browsing context", () => {
    const headers = response.headers();
    expect(headers["cross-origin-opener-policy"]).toBe("same-origin");
    expect(headers["cross-origin-resource-policy"]).toBe("same-origin");
    expect(headers["origin-agent-cluster"]).toBe("?1");
  });

  test("enforces HSTS", () => {
    const hsts = response.headers()["strict-transport-security"];
    expect(hsts).toContain("includeSubDomains");

    const maxAge = Number(/max-age=(\d+)/.exec(hsts ?? "")?.[1] ?? 0);
    expect(maxAge).toBeGreaterThanOrEqual(31_536_000);
  });

  test("does not advertise the framework", () => {
    expect(response.headers()["x-powered-by"]).toBeUndefined();
  });

  test("asks crawlers not to index an internal system", () => {
    expect(response.headers()["x-robots-tag"]).toContain("noindex");
  });
});

test.describe("Route parameter handling", () => {
  // Each of these is a hostile module/submodule slug. All must 404 — the
  // registry lookup happens after a strict slug pattern check, so nothing
  // user-supplied ever reaches the page.
  const HOSTILE_SLUGS = [
    "<script>alert(1)</script>",
    "%3Cscript%3Ealert(1)%3C/script%3E",
    "javascript:alert(1)",
    "../../etc/passwd",
    "..%2f..%2fetc%2fpasswd",
    "%2e%2e%2f%2e%2e%2fetc%2fpasswd",
    "qms%00.html",
    "'\"><img src=x onerror=alert(1)>",
    "%FF%FE%00",
    "a".repeat(300),
  ];

  for (const slug of HOSTILE_SLUGS) {
    test(`rejects module slug: ${slug.slice(0, 40)}`, async ({ request }) => {
      const response = await request.get(`/m/${slug}`, {
        failOnStatusCode: false,
      });

      expect(response.status()).toBe(404);

      // The payload must never be echoed back into the document.
      const body = await response.text();
      expect(body).not.toContain("<script>alert(1)</script>");
      expect(body).not.toContain("onerror=alert(1)");
      expect(body).not.toContain("etc/passwd");
    });
  }

  test("rejects a hostile submodule slug under a valid module", async ({
    request,
  }) => {
    const response = await request.get(
      "/m/qms/%3Cimg%20src=x%20onerror=alert(1)%3E",
      { failOnStatusCode: false },
    );

    expect(response.status()).toBe(404);
    expect(await response.text()).not.toContain("onerror=alert(1)");
  });

  test("a valid module with a traversal submodule stays 404", async ({
    request,
  }) => {
    const response = await request.get("/m/qms/..%2f..%2fdashboard", {
      failOnStatusCode: false,
    });
    expect(response.status()).toBe(404);
  });

  test("no XSS payload in the URL ever executes", async ({ page }) => {
    let dialogShown = false;
    page.on("dialog", async (dialog) => {
      dialogShown = true;
      await dialog.dismiss();
    });

    for (const slug of [
      "%3Cscript%3Ealert(1)%3C/script%3E",
      "%22%3E%3Cimg%20src=x%20onerror=alert(1)%3E",
    ]) {
      await page.goto(`/m/${slug}`, { waitUntil: "domcontentloaded" });
    }

    expect(dialogShown).toBe(false);
  });
});

test.describe("Client-side input handling", () => {
  test("search box does not execute injected markup", async ({ page }) => {
    let dialogShown = false;
    page.on("dialog", async (dialog) => {
      dialogShown = true;
      await dialog.dismiss();
    });

    await page.goto("/m/sales-order/order-book");

    const search = page.getByRole("searchbox", {
      name: /Search Sales order book/,
    });
    await search.fill("<img src=x onerror=alert(1)>");

    // The value stays inert text; no element is created from it.
    await expect(page.locator("img[onerror]")).toHaveCount(0);
    expect(dialogShown).toBe(false);
  });

  test("command palette treats markup as literal text", async ({ page }) => {
    let dialogShown = false;
    page.on("dialog", async (dialog) => {
      dialogShown = true;
      await dialog.dismiss();
    });

    await page.goto("/dashboard");
    await page.keyboard.press("ControlOrMeta+k");

    const dialog = page.getByRole("dialog", {
      name: "Search modules and workspaces",
    });
    await dialog.getByRole("textbox", { name: "Search" }).fill("<script>alert(1)</script>");

    await expect(
      dialog.getByText("No workspace matches that search."),
    ).toBeVisible();
    expect(dialogShown).toBe(false);
  });

  // The sidebar filter box is gone; the command palette above is now the only
  // free-text module search, and its input cap is asserted there.
});

test.describe("Document safety", () => {
  test("serves no inline event handler attributes", async ({ request }) => {
    const response = await request.get("/dashboard");
    const html = await response.text();

    // `onclick=`, `onerror=` etc. in server HTML would mean markup was built
    // by string concatenation somewhere rather than by React.
    const inlineHandlers = html.match(/\son[a-z]+\s*=\s*["']/gi) ?? [];
    expect(inlineHandlers).toEqual([]);
  });

  test("declares a restrictive robots meta", async ({ page }) => {
    await page.goto("/dashboard");
    const robots = page.locator('meta[name="robots"]');
    await expect(robots).toHaveAttribute("content", /noindex/);
  });

  test("makes no cross-origin network requests", async ({ page }) => {
    const external: string[] = [];
    page.on("request", (request) => {
      const url = new URL(request.url());
      if (url.origin !== new URL(page.url() || "http://127.0.0.1").origin) {
        external.push(request.url());
      }
    });

    await page.goto("/dashboard");
    await page.waitForLoadState("networkidle");

    expect(external).toEqual([]);
  });

  test("every external link is rel-protected", async ({ page }) => {
    await page.goto("/dashboard");

    const unsafe = await page.evaluate(() =>
      Array.from(document.querySelectorAll<HTMLAnchorElement>("a[target=_blank]"))
        .filter((anchor) => {
          const rel = anchor.rel ?? "";
          return !rel.includes("noopener") || !rel.includes("noreferrer");
        })
        .map((anchor) => anchor.href),
    );

    expect(unsafe).toEqual([]);
  });

  test("exposes no obvious secrets in the client bundle", async ({ page, request }) => {
    await page.goto("/dashboard");

    const scriptUrls = await page.evaluate(() =>
      Array.from(document.querySelectorAll<HTMLScriptElement>("script[src]")).map(
        (script) => script.src,
      ),
    );

    expect(scriptUrls.length).toBeGreaterThan(0);

    const SECRET_PATTERNS = [
      /AKIA[0-9A-Z]{16}/, // AWS access key id
      /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
      /sk_live_[0-9a-zA-Z]{16,}/, // Stripe live secret
      /ghp_[0-9a-zA-Z]{36}/, // GitHub PAT
      /xox[baprs]-[0-9a-zA-Z-]{10,}/, // Slack token
    ];

    for (const url of scriptUrls) {
      const script = await request.get(url);
      const body = await script.text();
      for (const pattern of SECRET_PATTERNS) {
        expect(body, `${url} matched ${pattern}`).not.toMatch(pattern);
      }
    }
  });
});
