import { expect, test, type Page } from "@playwright/test";

import { ROUTES } from "../app/data/routes";
import { scanBlogSlugs } from "../app/lib/routes/scan";

// Migration parity (EXECUTAR-MONOREPO-BLOG-001): every route of this build is compared with
// the reference deployment of the original Astro site. Run with `npm run parity`.
// PARITY_BASE_URL overrides the reference host.
const REFERENCE = (
  process.env.PARITY_BASE_URL ?? "https://risco-cognitivo-blog.executar-rotina-8b7.workers.dev"
).replace(/\/+$/, "");

const PAGES = [
  ...ROUTES.filter((r) => r.kind === "route" && r.path!.endsWith("/")).map((r) => r.path!),
  ...scanBlogSlugs(process.cwd()).map((s) => `/blog/${s}/`),
];

// Intentional differences, documented in docs/migrations/BLOG-001.md.
const EXTRA_LINKS: Record<string, string[]> = {
  // /sitemap-0.xml is now a declared route, so ADR-06 requires it in the hub.
  "/admin/rotas/": ["/sitemap-0.xml"],
};

type Snapshot = {
  status: number;
  title: string;
  description: string | null;
  canonical: string | null;
  h1: string[];
  links: string[];
  images: string[];
};

// Links to the reference host (e.g. the QR targets of /admin/rotas/) count as same-site.
const normalizeHref = (href: string, origin: string) => {
  const url = new URL(href, origin);
  if (url.origin !== origin && url.origin !== new URL(REFERENCE).origin) return url.href;
  return url.pathname.replace(/\/+$/, "") + url.hash || "/";
};

// HTTPS requests of the browser (reference site, fonts, images) are fetched by Playwright's
// Node side, which trusts the environment's CA store (TLS stays verified), and fulfilled.
async function viaNode(page: Page) {
  await page.route(/^https:\/\//, async (route) => {
    try {
      await route.fulfill({ response: await route.fetch() });
    } catch {
      await route.abort();
    }
  });
}

async function snapshot(page: Page, url: string, errors?: string[]): Promise<Snapshot> {
  await viaNode(page);
  if (errors) {
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  }
  const res = await page.goto(url, { waitUntil: "networkidle" });
  // Scroll through the page (Astro `client:visible` islands hydrate only when visible), then
  // wait until the DOM stops changing (client-rendered tools such as /skills/).
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += innerHeight) {
      scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 250));
    }
    scrollTo(0, 0);
  });
  let last = -1;
  for (let i = 0; i < 40; i++) {
    const size = await page.evaluate(() => document.body.innerHTML.length);
    if (size === last) break;
    last = size;
    await page.waitForTimeout(500);
  }
  await page.waitForLoadState("networkidle");
  const origin = new URL(url).origin;
  const raw = await page.evaluate(() => ({
    title: document.title,
    description: document.querySelector('meta[name="description"]')?.getAttribute("content") ?? null,
    canonical: document.querySelector('link[rel="canonical"]')?.getAttribute("href") ?? null,
    h1: [...document.querySelectorAll("h1")].map((h) => h.textContent?.replace(/\s+/g, " ").trim() ?? ""),
    links: [...document.querySelectorAll("a[href]")].map((a) => a.getAttribute("href")!),
    images: [...document.querySelectorAll("img[src]")].map((i) => i.getAttribute("src")!),
  }));
  return {
    status: res?.status() ?? 0,
    title: raw.title,
    description: raw.description,
    canonical: raw.canonical,
    h1: raw.h1,
    links: [...new Set(raw.links.map((h) => normalizeHref(h, origin)))].sort(),
    images: [...new Set(raw.images)].sort(),
  };
}

test.describe("parity with the original Astro site", () => {
  test.describe.configure({ mode: "parallel" });

  for (const path of PAGES) {
    test(path, async ({ browser, baseURL }) => {
      const ref = await browser.newPage();
      const cur = await browser.newPage();
      const errors: string[] = [];
      const [a, b] = await Promise.all([
        snapshot(ref, `${REFERENCE}${path}`),
        snapshot(cur, `${baseURL}${path}`, errors),
      ]);
      expect(b.status, "status").toBe(a.status);
      expect(b.title, "title").toBe(a.title);
      expect(b.description, "meta description").toBe(a.description);
      expect(b.canonical, "canonical").toBe(a.canonical);
      expect(b.h1, "h1").toEqual(a.h1);
      const extra = EXTRA_LINKS[path] ?? [];
      expect(b.links.filter((l) => !extra.includes(l)), "links").toEqual(a.links);
      for (const l of extra) expect(b.links, `intentional extra link ${l}`).toContain(l);
      expect(b.images, "images").toEqual(a.images);
      expect(errors, "console errors").toEqual([]);
      await Promise.all([ref.close(), cur.close()]);
    });
  }

  test("404 for unknown paths", async ({ request, baseURL }) => {
    const [a, b] = await Promise.all([
      request.get(`${REFERENCE}/nao-existe-parity`),
      request.get(`${baseURL}/nao-existe-parity`),
    ]);
    expect(b.status()).toBe(a.status());
    expect(await b.text()).toContain("Page Not Found");
  });

  test("trailing slash redirect", async ({ request, baseURL }) => {
    const opts = { maxRedirects: 0 };
    const [a, b] = await Promise.all([
      request.get(`${REFERENCE}/about`, opts),
      request.get(`${baseURL}/about`, opts),
    ]);
    expect(b.status()).toBe(a.status());
    expect(new URL(b.headers().location, baseURL).pathname).toBe("/about/");
  });

  for (const path of ["/sitemap-index.xml", "/sitemap-0.xml"]) {
    test(`${path} is identical`, async ({ request, baseURL }) => {
      const [a, b] = await Promise.all([request.get(`${REFERENCE}${path}`), request.get(`${baseURL}${path}`)]);
      expect(b.headers()["content-type"]).toContain("xml");
      expect(await b.text()).toBe(await a.text());
    });
  }

  test("/rss.xml has the same channel and items", async ({ request, baseURL }) => {
    const [a, b] = await Promise.all([request.get(`${REFERENCE}/rss.xml`), request.get(`${baseURL}/rss.xml`)]);
    const [ra, rb] = [await a.text(), await b.text()];
    const items = (s: string) => (s.match(/<item>.*?<\/item>/g) ?? []).sort();
    expect(rb.split("<item>")[0]).toBe(ra.split("<item>")[0]);
    expect(items(rb)).toEqual(items(ra));
  });

  for (const path of ["/hub-editorial/", "/skills/", "/catalogo-offline/", "/admin/tools/qr-python.zip"]) {
    test(`static asset ${path} is byte-identical`, async ({ request, baseURL }) => {
      const [a, b] = await Promise.all([request.get(`${REFERENCE}${path}`), request.get(`${baseURL}${path}`)]);
      expect(b.status()).toBe(200);
      expect(Buffer.compare(await b.body(), await a.body())).toBe(0);
    });
  }
});
