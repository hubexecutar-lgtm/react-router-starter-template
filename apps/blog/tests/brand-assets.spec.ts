import { expect, test } from "@playwright/test";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { scanPages } from "../app/lib/routes/scan";

// LANC-001 · PR-A (RQ-001, RQ-002): logo e favicon do pacote BRAND-ASSET-LOGO-001.
const INTAKE = join(process.cwd(), "../../docs/lancamento/LANC-001/intake");
const PACKAGE = "./LOGO_FAVICON_PACKAGE_v1.0.0";

// Arquivo publicado em public/ → caminho no pacote do intake (cópia byte a byte).
const COPIES: Record<string, string> = {
  "favicon/favicon.ico": "favicon/favicon.ico",
  "favicon/favicon-16x16.png": "favicon/favicon-16x16.png",
  "favicon/favicon-32x32.png": "favicon/favicon-32x32.png",
  "favicon/favicon-96x96.png": "favicon/favicon-96x96.png",
  "favicon/apple-touch-icon.png": "apple/apple-touch-icon.png",
  "favicon/android-chrome-192x192.png": "pwa/android-chrome-192x192.png",
  "favicon/android-chrome-512x512.png": "pwa/android-chrome-512x512.png",
  "favicon/maskable-icon-512x512.png": "pwa/maskable-icon-512x512.png",
  "images/logo-512.png": "logo/logo-transparent-512.png",
  "images/logo-1024.png": "logo/logo-transparent-1024.png",
};

// Os 5 <link> do README do pacote, servidos de /favicon/.
const LINKS = [
  { rel: "icon", href: "/favicon/favicon.ico", sizes: "any" },
  { rel: "icon", href: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
  { rel: "icon", href: "/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
  { rel: "apple-touch-icon", href: "/favicon/apple-touch-icon.png" },
  { rel: "manifest", href: "/favicon/site.webmanifest" },
];

test("public icons match the sha256 of the intake MANIFEST", () => {
  const manifest = new Map(
    readFileSync(join(INTAKE, "MANIFEST.sha256"), "utf8")
      .trim()
      .split("\n")
      .map((line) => line.split(/\s+/).reverse() as [string, string]),
  );
  for (const [published, source] of Object.entries(COPIES)) {
    const expected = manifest.get(`${PACKAGE}/${source}`);
    expect(expected, `${source} no MANIFEST`).toBeTruthy();
    const actual = createHash("sha256").update(readFileSync(join("public", published))).digest("hex");
    expect(actual, published).toBe(expected);
  }
});

test("every page has the 5 icon links and no legacy icon", async ({ request }) => {
  for (const path of scanPages().filter((p) => p.endsWith("/"))) {
    const html = await (await request.get(path)).text();
    // /prisma/ declara o próprio Web App Manifest (start_url e scope em /prisma/); os outros 4 links são os do site.
    const links = path === "/prisma/" ? LINKS.map((l) => (l.rel === "manifest" ? { ...l, href: "/prisma/manifest.webmanifest" } : l)) : LINKS;
    for (const link of links) {
      const attrs = Object.entries(link).map(([k, v]) => `(?=[^>]*\\b${k}="${v.replace(/[.+]/g, "\\$&")}")`).join("");
      expect(html, `${path}: <link ${JSON.stringify(link)}>`).toMatch(new RegExp(`<link${attrs}[^>]*>`));
    }
    expect(html, `${path}: ícone antigo`).not.toMatch(/favicon\.svg|web-app-manifest/);
  }
});

test("web manifest is valid and its icons resolve", async ({ request }) => {
  const res = await request.get("/favicon/site.webmanifest");
  expect(res.status()).toBe(200);
  const manifest = await res.json();
  expect(manifest.name).toBe("Risco Cognitivo");
  expect(manifest.icons.map((i: { sizes: string }) => i.sizes)).toEqual(["192x192", "512x512", "512x512"]);
  expect(manifest.icons.some((i: { purpose?: string }) => i.purpose === "maskable")).toBe(true);
  for (const icon of manifest.icons) {
    const img = await request.get(icon.src);
    expect(img.status(), icon.src).toBe(200);
    expect(img.headers()["content-type"], icon.src).toContain("image/png");
  }
  for (const link of LINKS) expect((await request.get(link.href)).status(), link.href).toBe(200);
});

test("Organization JSON-LD points to the published logo", async ({ request }) => {
  const html = await (await request.get("/")).text();
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => JSON.parse(m[1]));
  const org = blocks.find((b) => b["@type"] === "Organization");
  expect(org, "Organization").toBeTruthy();
  expect(org["@context"]).toBe("https://schema.org");
  expect(org.name).toBe("Risco Cognitivo");
  const logo = new URL(org.logo.url);
  expect(logo.pathname).toBe("/images/logo-512.png");
  const img = await request.get(logo.pathname);
  expect(img.status()).toBe(200);
  expect(img.headers()["content-type"]).toContain("image/png");
});
