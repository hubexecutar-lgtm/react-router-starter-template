import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

// LANC-001 PR-I (RQ-090, SCR-04): personalizar em 3 passos. Muda só a ordem e o destaque do mapa, fica no
// localStorage deste navegador e nunca vai para a rede.
const KEY = "rc.mapa.prefs.v1";
const MOBILE = { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true };
const ready = (page: Page) => page.locator("[data-map-canvas][data-map-ready]").waitFor();
const mapNodes = (page: Page) => page.locator("[data-map-canvas] [data-map-node]");
const stored = (page: Page) => page.evaluate((k) => window.localStorage.getItem(k), KEY);

async function personalize(page: Page) {
  await page.goto("/mapas/personalizar/");
  await expect(page.locator("[data-personalize]")).toHaveAttribute("data-step", "0");
  await page.getByLabel("Interrupções").tap();
  await page.getByRole("button", { name: "Continuar" }).tap();
  await expect(page.locator("[data-personalize]")).toHaveAttribute("data-step", "1");
  await page.locator("[data-interest-options]").getByLabel(/Atenção/).tap();
  await page.getByRole("button", { name: "Continuar" }).tap();
  await page.getByLabel("Mostrar evidências no mapa").tap();
  await page.getByRole("button", { name: "Salvar e abrir o mapa" }).tap();
}

test.describe("Personalizar no celular, só por toque (RQ-090)", () => {
  test.use(MOBILE);

  test("3 passos salvam no navegador e o mapa abre no primeiro foco, com destaque e evidências", async ({ page }) => {
    const requests: { method: string; url: string; body: string }[] = [];
    page.on("request", (r) => requests.push({ method: r.method(), url: r.url(), body: r.postData() ?? "" }));
    await personalize(page);
    await expect(page).toHaveURL(/\/mapas\/explorar\/\?foco=FRC-INTERRUPCOES$/);
    await ready(page);
    expect(JSON.parse((await stored(page))!)).toEqual({ focos: ["interrupcoes"], interesses: ["COG-ATENCAO"], evidencias: true });

    // Destaque: o interesse tem marca e nome acessível próprios, e vem logo depois do foco.
    const atencao = page.locator('[data-map-canvas] [data-map-node="COG-ATENCAO"]');
    await expect(atencao).toHaveAttribute("data-preferred", "true");
    await expect(atencao).toHaveAccessibleName(/seu interesse/);
    const order = await mapNodes(page).evaluateAll((els) => els.map((e) => e.getAttribute("data-map-node")));
    expect(order.slice(0, 2)).toEqual(["FRC-INTERRUPCOES", "COG-ATENCAO"]);
    // "Mostrar evidências": as fontes do foco entram no mapa.
    expect(await page.locator('[data-map-canvas] [data-node-type="evidence"]').count()).toBeGreaterThan(0);

    // Nada sai do dispositivo: só GET, e nenhuma URL leva as escolhas.
    expect(requests.filter((r) => r.method !== "GET")).toEqual([]);
    expect(requests.filter((r) => /interesse|evidencias|COG-ATENCAO/i.test(r.url + r.body))).toEqual([]);
  });

  test("Restaurar padrão no mapa apaga a personalização", async ({ page }) => {
    await personalize(page);
    await ready(page);
    await page.locator("[data-prefs-bar] [data-reset-prefs]").tap();
    expect(await stored(page)).toBeNull();
    await expect(page.locator("[data-map-canvas] [data-preferred]")).toHaveCount(0);
  });
});

test("limpar os dados do navegador volta ao padrão (RQ-090)", async ({ browser }) => {
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  await page.goto("/mapas/explorar/");
  await page.evaluate(([k]) => window.localStorage.setItem(k, JSON.stringify({ focos: ["memoria"], interesses: [], evidencias: false })), [KEY]);
  await page.reload();
  await ready(page);
  await expect(page.locator('[data-map-canvas] [data-map-node="COG-MEMORIA"]')).toHaveCount(1);
  await ctx.clearCookies();
  await page.evaluate(() => window.localStorage.clear());
  await page.reload();
  await ready(page);
  await expect(page.locator('[data-map-canvas] [data-map-node="EVT-PERDA-CONTEXTO"]')).toHaveCount(1);
  await expect(page.locator("[data-prefs-bar]")).toContainText("Personalizar por onde começar");
  await ctx.close();
});

test("os fatos não mudam: a Lista tem as mesmas relações com e sem personalização (RQ-090)", async ({ page }) => {
  const relations = async () => (await page.locator("[data-all-relations] [data-edge-sentence]").evaluateAll((els) => els.map((e) => e.getAttribute("data-edge-sentence")))).sort();
  await page.goto("/mapas/explorar/");
  const before = await relations();
  await page.evaluate(([k]) => window.localStorage.setItem(k, JSON.stringify({ focos: ["decisao"], interesses: ["FRC-MUITAS-OPCOES"], evidencias: true })), [KEY]);
  await page.reload();
  await ready(page);
  expect(await relations()).toEqual(before);
});

test("preferência inválida no storage é ignorada", async ({ page }) => {
  await page.goto("/mapas/explorar/");
  await page.evaluate(([k]) => window.localStorage.setItem(k, '{"focos":["xss<script>"],"interesses":["NAO-EXISTE"],"evidencias":"sim"}'), [KEY]);
  await page.reload();
  await ready(page);
  await expect(page.locator('[data-map-canvas] [data-map-node="EVT-PERDA-CONTEXTO"]')).toHaveCount(1);
  await expect(page.locator("[data-map-canvas] [data-preferred]")).toHaveCount(0);
});

test.describe("Personalizar no desktop, só por teclado", () => {
  test.use({ viewport: { width: 1280, height: 900 } });

  test("Espaço marca, Enter avança, o foco vai ao título de cada passo; axe sem violação séria", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/mapas/personalizar/");
    const axe = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
    expect(axe.violations.filter((v) => v.impact === "serious" || v.impact === "critical").map((v) => v.id)).toEqual([]);
    await page.getByLabel("Memória").focus();
    await page.keyboard.press("Space");
    await page.keyboard.press("Enter");
    await expect(page.getByRole("heading", { name: "O que você quer acompanhar?" })).toBeFocused();
    await page.getByRole("button", { name: "Continuar" }).focus();
    await page.keyboard.press("Enter");
    await expect(page.getByRole("heading", { name: "Mostrar evidências?" })).toBeFocused();
    await page.getByRole("button", { name: "Salvar e abrir o mapa" }).focus();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/foco=COG-MEMORIA/);
  });
});
