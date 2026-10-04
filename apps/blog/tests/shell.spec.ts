import { expect, test, type Page } from "@playwright/test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

// LANC-001 PR-C (RQ-020…026) sobre o Stories (AUD-ORDEM-001): nav desktop + trilha, drawer e barra inferior no
// mobile, chrome que esconde junto no scroll, heroReveal e carrossel com scroll-snap. O menu só tem destinos que
// existem (nav.ts): Mapa e Sobre entram quando as páginas voltarem.
const DESKTOP = { width: 1280, height: 900 };
const MOBILE = { width: 390, height: 844 };
const LONG = "/artigos/risco-cognitivo/";

const box = (page: Page, sel: string) => page.locator(sel).evaluateAll((els) => els.map((e) => e.getBoundingClientRect().toJSON() as DOMRect));
const hidden = (page: Page, sel: string) => page.locator(sel).evaluate((e) => e.hasAttribute("data-hidden"));

test.describe("desktop ≥ 900px (RQ-020)", () => {
  test.use({ viewport: DESKTOP });

  test("menu links and the pillar trail are visible; no menu button nor drawer", async ({ page }) => {
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Principal", exact: true });
    for (const label of ["Artigos", "Ferramentas", "Sobre"]) await expect(nav.getByRole("link", { name: label, exact: true })).toBeVisible();
    const trail = page.getByRole("navigation", { name: "Pilares", exact: true });
    for (const label of ["Riscos Cognitivos", "Processos Neuroadaptativos", "Ferramentas e Soluções"]) {
      await expect(trail.getByRole("link", { name: label })).toBeVisible();
    }
    await expect(page.locator("[data-menu-toggle]")).toBeHidden();
    await expect(page.locator("[data-bottom-bar]")).toBeHidden();
    await expect(page.getByRole("dialog")).toHaveCount(0);
  });

  test("Ferramentas is current on /ferramentas/", async ({ page }) => {
    await page.goto("/ferramentas/skills/");
    await expect(page.locator('header nav[aria-label="Principal"] a[aria-current="page"]')).toHaveText("Ferramentas");
  });
});

test.describe("mobile < 900px (RQ-021, RQ-023, RQ-025)", () => {
  test.use({ viewport: MOBILE, hasTouch: true, isMobile: true });

  test("bottom bar has the 3 destinations with ≥ 44px targets", async ({ page }) => {
    await page.goto("/");
    const bar = page.getByRole("navigation", { name: "Navegação inferior" });
    await expect(bar.getByRole("link")).toHaveText(["Início", "Ferramentas"]);
    await expect(bar.getByRole("link", { name: "Início" })).toHaveAttribute("aria-current", "page");
    for (const r of await box(page, "[data-bottom-bar] a")) expect(Math.min(r.width, r.height)).toBeGreaterThanOrEqual(44);
    await expect(page.getByRole("navigation", { name: "Principal", exact: true })).toBeHidden();
  });

  test("drawer opens and closes by touch, min(84vw,360px), ≥ 44px items", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.locator("[data-menu-toggle]").tap();
    const dialog = page.getByRole("dialog", { name: "Menu" });
    await expect(dialog).toBeVisible();
    await expect(page.locator("[data-menu-toggle]")).toHaveAttribute("aria-expanded", "true");
    const [panel] = await box(page, "#site-menu");
    expect(Math.round(panel.width)).toBe(Math.round(Math.min(0.84 * MOBILE.width, 360)));
    for (const label of ["Início", "Artigos", "Ferramentas", "Sobre", "Fontes", "Prisma de execução"]) {
      await expect(dialog.getByRole("link", { name: label, exact: true })).toBeVisible();
    }
    for (const r of await box(page, "#site-menu a, #site-menu button")) expect(Math.min(r.width, r.height)).toBeGreaterThanOrEqual(44);
    await dialog.getByRole("button", { name: "Fechar menu" }).tap();
    await expect(dialog).toHaveCount(0);
  });

  test("drawer by keyboard: focus trapped, Esc closes, focus returns, page inert", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    const toggle = page.locator("[data-menu-toggle]");
    await toggle.focus();
    await page.keyboard.press("Enter");
    const dialog = page.getByRole("dialog", { name: "Menu" });
    await expect(dialog).toBeVisible();
    for (const sel of ["main", "body > header", "body > footer", "[data-bottom-bar]"]) {
      expect(await page.locator(sel).first().evaluate((e) => (e as HTMLElement).inert), sel).toBe(true);
    }
    const count = await dialog.locator("a, button").count();
    for (let i = 0; i < count + 2; i++) {
      await page.keyboard.press("Tab");
      expect(await page.evaluate(() => !!document.activeElement?.closest("#site-menu")), `Tab ${i}`).toBe(true);
    }
    await page.keyboard.press("Shift+Tab");
    expect(await page.evaluate(() => !!document.activeElement?.closest("#site-menu"))).toBe(true);
    await page.keyboard.press("Escape");
    await expect(dialog).toHaveCount(0);
    await expect(toggle).toBeFocused();
    expect(await page.locator("main").evaluate((e) => (e as HTMLElement).inert)).toBe(false);
  });
});

test.describe("chrome hides together on scroll (RQ-022)", () => {
  test.use({ viewport: MOBILE });

  test("scrolling down hides header and bottom bar; scrolling up shows both", async ({ page }) => {
    await page.goto(LONG);
    await page.waitForLoadState("networkidle");
    await page.mouse.move(200, 400);
    await page.mouse.wheel(0, 600);
    await expect.poll(() => hidden(page, "[data-site-header]")).toBe(true);
    await expect.poll(() => hidden(page, "[data-bottom-bar]")).toBe(true);
    const [header] = await box(page, "[data-site-header]");
    await expect.poll(async () => (await box(page, "[data-site-header]"))[0].bottom).toBeLessThanOrEqual(1);
    expect(header).toBeTruthy();
    await page.mouse.wheel(0, -100);
    await expect.poll(() => hidden(page, "[data-site-header]")).toBe(false);
    await expect.poll(() => hidden(page, "[data-bottom-bar]")).toBe(false);
  });

  test("keyboard focus on the chrome brings it back (desktop)", async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto(LONG);
    await page.waitForLoadState("networkidle");
    await page.mouse.move(600, 500);
    await page.mouse.wheel(0, 900);
    await expect.poll(() => hidden(page, "[data-site-header]")).toBe(true);
    await page.locator('header nav[aria-label="Principal"] a').first().focus();
    await expect.poll(() => hidden(page, "[data-site-header]")).toBe(false);
  });
});

test.describe("hero and carousel (RQ-024, RQ-026)", () => {
  test("article hero uses heroReveal and is static and visible with reduced motion", async ({ page }) => {
    await page.goto(LONG);
    expect(await page.locator(".rc-hero-reveal").first().evaluate((e) => getComputedStyle(e).animationName)).toBe("heroReveal");
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(LONG);
    const hero = page.locator(".rc-hero-reveal").first();
    expect(await hero.evaluate((e) => getComputedStyle(e).animationName)).toBe("none");
    expect(await hero.evaluate((e) => getComputedStyle(e).opacity)).toBe("1");
    await expect(page.locator("h1")).toBeVisible();
  });

  test("hero keeps LCP under 2.5s on a mobile profile", async ({ page }) => {
    await page.setViewportSize(MOBILE);
    await page.goto(LONG);
    const lcp = await page.evaluate(
      () =>
        new Promise<number>((resolve) => {
          new PerformanceObserver((list) => {
            const entries = list.getEntries();
            resolve(entries[entries.length - 1].startTime);
          }).observe({ type: "largest-contentful-paint", buffered: true });
          setTimeout(() => resolve(-1), 5000);
        }),
    );
    expect(lcp).toBeGreaterThan(0);
    expect(lcp).toBeLessThan(2500);
  });

  test("Stories carousel: scroll-snap, buttons, keyboard focus, no autoplay", async ({ page }) => {
    await page.goto("/admin/stories-fixtures/");
    await page.waitForLoadState("networkidle");
    const track = page.locator('[aria-roledescription="carrossel"] ul').first();
    expect(await track.evaluate((e) => getComputedStyle(e).scrollSnapType)).toContain("x");
    expect(await track.locator("li").first().evaluate((e) => getComputedStyle(e).scrollSnapAlign)).toContain("center");
    await track.scrollIntoViewIfNeeded();
    const before = await track.evaluate((e) => e.scrollLeft);
    await page.getByRole("button", { name: "Próximo slide" }).first().click();
    await expect.poll(() => track.evaluate((e) => e.scrollLeft)).toBeGreaterThan(before);
    // Teclado: a faixa recebe foco e a seta rola os slides.
    await track.focus();
    await expect(track).toBeFocused();
    const atFocus = await track.evaluate((e) => e.scrollLeft);
    await page.keyboard.press("ArrowRight");
    await expect.poll(() => track.evaluate((e) => e.scrollLeft)).toBeGreaterThan(atFocus);
    // Sem rotação automática: parada a rolagem, a posição não muda sozinha.
    let still = -1;
    await expect
      .poll(async () => {
        const a = await track.evaluate((e) => e.scrollLeft);
        await page.waitForTimeout(300);
        const b = await track.evaluate((e) => e.scrollLeft);
        still = b;
        return a === b;
      })
      .toBe(true);
    await page.waitForTimeout(1500);
    expect(await track.evaluate((e) => e.scrollLeft)).toBe(still);
    const src = readFileSync(join(process.cwd(), "app/components/stories/MediaCarousel.tsx"), "utf8");
    expect(src).not.toMatch(/setInterval|setTimeout|autoplay\s*[:=]/i);
  });
});

// AUD-ORDEM-001: o menu só aponta para destinos que existem (nada de link morto depois do reset do ADR-13).
test("every shell link resolves", async ({ page, request }) => {
  await page.setViewportSize(MOBILE);
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  await page.locator("[data-menu-toggle]").click();
  const hrefs = await page.locator("header a[href^='/'], #site-menu a[href^='/'], [data-bottom-bar] a[href^='/'], footer a[href^='/']").evaluateAll((els) => [
    ...new Set(els.map((e) => (e as HTMLAnchorElement).getAttribute("href")!)),
  ]);
  expect(hrefs.length).toBeGreaterThan(3);
  for (const href of hrefs) expect((await request.get(href)).status(), href).toBe(200);
});
