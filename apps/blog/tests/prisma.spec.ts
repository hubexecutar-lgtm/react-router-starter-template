import { expect, test, type Page } from "@playwright/test";

import { FIELDS, STORAGE_KEY } from "../app/features/prisma/schema";

// Aceite da rota /prisma (RC-PWA-PRISMA-FRD-001 §13, PRD §17): fluxo completo, nenhum dado na rede,
// folha A4 sem estouro, impressão só da folha, rascunho local, PWA instalável e abertura offline.

const FILLED: Record<string, string> = {
  nome: "Marina Souza",
  contexto: "Entrega do relatório trimestral com três pessoas dependendo dele.",
  objetivo: "Enviar o relatório revisado até sexta.",
  horizonte: "Esta semana",
  tempo_disponivel: "2 horas por dia",
  demanda_principal: "Consolidar os números das três áreas e escrever a análise.",
  atrito_principal: "Perco o fio quando as mensagens chegam e esqueço a etapa de revisão.",
  compensacao: "Lista de etapas na tela e alarme para a revisão.",
  prioridade_1: "Fechar os números",
  prioridade_2: "Escrever a análise",
  prioridade_3: "Revisar",
  bloqueios: "Aguardando dados da área financeira.",
  proxima_acao: "Abrir a planilha e conferir a primeira aba.",
};

async function fill(page: Page, values: Record<string, string> = FILLED) {
  for (const f of FIELDS) {
    const v = values[f.key];
    if (v === undefined) continue;
    const el = page.locator(`#prisma-${f.key}`);
    if (f.kind === "select") await el.selectOption(v);
    else await el.fill(v);
  }
}

test.describe("fluxo /prisma", () => {
  test("introdução: três passos, CTA, privacidade e aviso de escopo", async ({ page }) => {
    await page.goto("/prisma/");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Organize o que está dificultando sua execução.");
    const steps = page.locator('section[aria-labelledby="como-usar"] ol > li');
    await expect(steps).toHaveCount(3);
    await expect(steps.nth(0)).toContainText("Preencha");
    await expect(steps.nth(1)).toContainText("Revise");
    await expect(steps.nth(2)).toContainText("Exporte");
    await expect(page.getByText("Seus dados ficam neste dispositivo.").first()).toBeVisible();
    await expect(page.getByText("Não é diagnóstico")).toBeVisible();
    await expect(page.getByRole("link", { name: /Criar meu Prisma/ }).first()).toHaveAttribute("href", "#formulario");
  });

  test("campos obrigatórios: erro textual, foco no primeiro inválido, sem preview", async ({ page }) => {
    await page.goto("/prisma/");
    await page.getByRole("link", { name: /Criar meu Prisma/ }).first().click();
    await expect(page.locator("#prisma-view-title")).toBeFocused();
    await page.getByRole("button", { name: "Ver meu Prisma" }).click();
    await expect(page.getByRole("alert")).toContainText("Falta preencher alguns campos.");
    await expect(page.locator("#prisma-contexto")).toBeFocused();
    await expect(page.locator("#prisma-contexto")).toHaveAttribute("aria-invalid", "true");
    await expect(page.locator("#prisma-contexto-error")).toHaveText("Preencha o campo contexto.");
    await expect(page.locator(".prisma-sheet")).toHaveCount(0);
  });

  test("preview a partir do formulário, editar preserva os dados", async ({ page }) => {
    await page.goto("/prisma/#formulario");
    await fill(page);
    await page.getByRole("button", { name: "Ver meu Prisma" }).click();
    await expect(page).toHaveURL(/#prisma$/);
    const sheet = page.locator(".prisma-sheet");
    await expect(sheet).toBeVisible();
    await expect(sheet.getByRole("heading", { name: "Prisma de execução" })).toBeVisible();
    await expect(sheet).toContainText(FILLED.objetivo);
    await expect(sheet).toContainText("Esta semana");
    await expect(sheet).toContainText(FILLED.proxima_acao);
    await expect(sheet.locator(".prisma-sheet__prio li")).toHaveText(["Fechar os números", "Escrever a análise", "Revisar"]);
    await expect(sheet).toContainText(/Gerado em .+\d{4}/);

    await page.getByRole("link", { name: "Editar" }).click();
    await expect(page.locator("#prisma-objetivo")).toHaveValue(FILLED.objetivo);
    await page.goBack();
    await expect(page.locator(".prisma-sheet")).toBeVisible();
  });

  test("campo opcional vazio aparece como A DEFINIR; nada é inventado", async ({ page }) => {
    await page.goto("/prisma/#formulario");
    await fill(page, { ...FILLED, nome: "", tempo_disponivel: "", compensacao: "", bloqueios: "", prioridade_2: "", prioridade_3: "" });
    await page.getByRole("button", { name: "Ver meu Prisma" }).click();
    const sheet = page.locator(".prisma-sheet");
    await expect(sheet.getByText("A DEFINIR")).toHaveCount(3);
    await expect(sheet.locator(".prisma-sheet__name")).toHaveCount(0);
    await expect(sheet.locator(".prisma-sheet__prio li")).toHaveCount(1);
  });

  test("#prisma sem dados válidos volta ao formulário", async ({ page }) => {
    await page.goto("/prisma/#prisma");
    await expect(page.locator("#prisma-contexto")).toBeVisible();
    await expect(page).toHaveURL(/#formulario$/);
    await expect(page.locator(".prisma-sheet")).toHaveCount(0);
  });

  test("texto digitado é tratado como texto, nunca como HTML (FR-019)", async ({ page }) => {
    const dialogs: string[] = [];
    page.on("dialog", (d) => {
      dialogs.push(d.message());
      void d.dismiss();
    });
    await page.goto("/prisma/#formulario");
    const xss = `<img src=x onerror="alert('x')"><b>negrito</b>`;
    await fill(page, { ...FILLED, objetivo: xss });
    await page.getByRole("button", { name: "Ver meu Prisma" }).click();
    const sheet = page.locator(".prisma-sheet");
    await expect(sheet).toContainText(xss);
    await expect(sheet.locator("img, b")).toHaveCount(0);
    expect(dialogs).toEqual([]);
  });
});

test.describe("privacidade e armazenamento", () => {
  test("nenhuma requisição leva o conteúdo preenchido (FR-015, PRD §16)", async ({ page }) => {
    const sent: string[] = [];
    page.on("request", (r) => {
      const hay = `${r.url()} ${r.postData() ?? ""} ${JSON.stringify(r.headers())}`;
      if (Object.values(FILLED).some((v) => v.length > 8 && (hay.includes(v) || hay.includes(encodeURIComponent(v))))) sent.push(`${r.method()} ${r.url()}`);
      if (r.method() !== "GET" && new URL(r.url()).pathname.startsWith("/prisma")) sent.push(`${r.method()} ${r.url()}`);
    });
    await page.goto("/prisma/#formulario");
    await fill(page);
    await page.locator('label:has-text("Salvar neste dispositivo") input').check();
    await page.getByRole("button", { name: "Ver meu Prisma" }).click();
    await expect(page.locator(".prisma-sheet")).toBeVisible();
    await page.waitForLoadState("networkidle");
    expect(sent).toEqual([]);
  });

  test("sem opt-in nada vai ao localStorage; com opt-in grava e recarrega; limpar remove", async ({ page }) => {
    await page.goto("/prisma/#formulario");
    await fill(page);
    expect(await page.evaluate((k) => localStorage.getItem(k), STORAGE_KEY)).toBeNull();

    await page.locator('label:has-text("Salvar neste dispositivo") input').check();
    const stored = JSON.parse((await page.evaluate((k) => localStorage.getItem(k), STORAGE_KEY))!);
    expect(stored.version).toBe("1.0.0");
    expect(stored.data.objetivo).toBe(FILLED.objetivo);
    expect(new Date(stored.updatedAt).toString()).not.toBe("Invalid Date");

    await page.reload();
    await expect(page.locator("#prisma-objetivo")).toHaveValue(FILLED.objetivo);

    await page.getByRole("button", { name: "Limpar dados" }).click();
    await page.getByRole("button", { name: "Apagar dados" }).click();
    await expect(page.locator("#prisma-objetivo")).toHaveValue("");
    expect(await page.evaluate((k) => localStorage.getItem(k), STORAGE_KEY)).toBeNull();
    await page.reload();
    await expect(page.locator("#prisma-objetivo")).toHaveValue("");
  });

  test("storage indisponível não impede o uso", async ({ page }) => {
    // armazenamento cheio ou bloqueado para a chave do Prisma (o resto do site segue funcionando)
    await page.addInitScript((key) => {
      const get = Storage.prototype.getItem;
      const set = Storage.prototype.setItem;
      Storage.prototype.getItem = function (k: string) {
        if (k === key) throw new DOMException("blocked", "SecurityError");
        return get.call(this, k);
      };
      Storage.prototype.setItem = function (k: string, v: string) {
        if (k === key) throw new DOMException("quota", "QuotaExceededError");
        return set.call(this, k, v);
      };
    }, STORAGE_KEY);
    await page.goto("/prisma/#formulario");
    await fill(page);
    // o app desfaz o opt-in quando o storage recusa; por isso click e não check
    await page.locator('label:has-text("Salvar neste dispositivo") input').click();
    await expect(page.getByRole("status")).toContainText("Não foi possível salvar");
    await expect(page.locator('label:has-text("Salvar neste dispositivo") input')).not.toBeChecked();
    await page.getByRole("button", { name: "Ver meu Prisma" }).click();
    await expect(page.locator(".prisma-sheet")).toBeVisible();
  });
});

test.describe("folha A4", () => {
  test("com todos os campos no limite a folha não estoura 297 mm", async ({ page }) => {
    await page.goto("/prisma/#formulario");
    const max: Record<string, string> = {};
    for (const f of FIELDS) {
      if (f.kind === "select") max[f.key] = "Este trimestre";
      else max[f.key] = Array.from({ length: Math.ceil(f.max / 9) }, () => "palavrões").join(" ").slice(0, f.max);
    }
    await fill(page, max);
    await page.getByRole("button", { name: "Ver meu Prisma" }).click();
    const box = await page.locator(".prisma-sheet").evaluate((el) => ({ sh: el.scrollHeight, ch: el.clientHeight, sw: el.scrollWidth, cw: el.clientWidth }));
    expect(box.sh, "conteúdo da folha maior que a página").toBeLessThanOrEqual(box.ch);
    expect(box.sw).toBeLessThanOrEqual(box.cw);
    // 297 mm a 96 dpi
    expect(Math.round(box.ch / 3.7795)).toBe(297);
  });

  test("quebras de linha do usuário são preservadas", async ({ page }) => {
    await page.goto("/prisma/#formulario");
    await fill(page, { ...FILLED, contexto: "linha 1\nlinha 2" });
    await page.getByRole("button", { name: "Ver meu Prisma" }).click();
    const html = await page.locator(".prisma-sheet__step").first().locator("p").evaluate((p) => getComputedStyle(p).whiteSpace);
    expect(html).toBe("pre-line");
  });

  test("preview cabe na largura do celular sem rolagem horizontal", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/prisma/#formulario");
    await fill(page);
    await page.getByRole("button", { name: "Ver meu Prisma" }).click();
    await expect(page.locator(".prisma-sheet")).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    const stage = await page.locator(".prisma-stage").boundingBox();
    expect(stage!.width).toBeLessThanOrEqual(390);
  });

  test("Exportar PDF aciona window.print()", async ({ page }) => {
    await page.addInitScript(() => {
      (window as unknown as { __prints: number }).__prints = 0;
      window.print = () => {
        (window as unknown as { __prints: number }).__prints++;
      };
    });
    await page.goto("/prisma/#formulario");
    await fill(page);
    await page.getByRole("button", { name: "Ver meu Prisma" }).click();
    await page.getByRole("button", { name: "Exportar PDF" }).click();
    expect(await page.evaluate(() => (window as unknown as { __prints: number }).__prints)).toBe(1);
  });

  test("a impressão leva só a folha, em uma página A4", async ({ page, browserName }) => {
    test.skip(browserName !== "chromium", "page.pdf só existe no Chromium");
    await page.goto("/prisma/#formulario");
    await fill(page);
    await page.getByRole("button", { name: "Ver meu Prisma" }).click();
    await page.emulateMedia({ media: "print" });
    // nada além da folha fica visível: cabeçalho, rodapé, botões e formulário somem
    const visible = await page.evaluate(() => {
      const shown = (sel: string) => [...document.querySelectorAll(sel)].filter((e) => (e as HTMLElement).offsetParent !== null || getComputedStyle(e).position === "fixed").length;
      return { header: shown("body > header"), footer: shown("body > footer"), noprint: shown(".prisma-noprint"), buttons: shown("main button") };
    });
    expect(visible).toEqual({ header: 0, footer: 0, noprint: 0, buttons: 0 });
    const pdf = await page.pdf({ preferCSSPageSize: true, printBackground: true });
    const pages = (pdf.toString("latin1").match(/\/Type\s*\/Page[^s]/g) ?? []).length;
    expect(pages).toBe(1);
    const media = pdf.toString("latin1").match(/\/MediaBox\s*\[\s*0 0 ([\d.]+) ([\d.]+)\s*\]/);
    expect(Math.round(Number(media![1]))).toBe(595); // A4 em pontos
    expect(Math.round(Number(media![2]))).toBe(842);
  });

  test("a folha é clara também no tema escuro", async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem("theme", "dark"));
    await page.goto("/prisma/#formulario");
    await fill(page);
    await page.getByRole("button", { name: "Ver meu Prisma" }).click();
    const bg = await page.locator(".prisma-sheet").evaluate((el) => getComputedStyle(el).backgroundColor);
    expect(bg).toBe("rgb(255, 255, 255)");
  });
});

test.describe("PWA", () => {
  test("manifest do /prisma/ é válido e a rota usa o seu, não o do site", async ({ page, request }) => {
    await page.goto("/prisma/");
    expect(await page.locator('link[rel="manifest"]').count()).toBe(1);
    await expect(page.locator('link[rel="manifest"]')).toHaveAttribute("href", "/prisma/manifest.webmanifest");
    const res = await request.get("/prisma/manifest.webmanifest");
    expect(res.ok()).toBe(true);
    const m = await res.json();
    expect(m).toMatchObject({ start_url: "/prisma/", scope: "/prisma/", display: "standalone", background_color: "#FFFFFF", theme_color: "#2563EB", lang: "pt-BR" });
    expect(m.name).toBeTruthy();
    expect(m.short_name).toBeTruthy();
    const sizes = m.icons.map((i: { sizes: string }) => i.sizes);
    expect(sizes).toContain("192x192");
    expect(sizes).toContain("512x512");
    expect(m.icons.some((i: { purpose?: string }) => i.purpose === "maskable")).toBe(true);
    for (const i of m.icons) expect((await request.get(i.src)).ok(), i.src).toBe(true);

    // as demais rotas seguem com o manifest do site
    await page.goto("/about/");
    await expect(page.locator('link[rel="manifest"]')).toHaveAttribute("href", "/favicon/site.webmanifest");
  });

  test("service worker responde com JavaScript e escopo /prisma/", async ({ request }) => {
    const res = await request.get("/prisma/sw.js");
    expect(res.ok()).toBe(true);
    expect(res.headers()["content-type"]).toMatch(/javascript/);
    expect(await res.text()).toContain("rc-prisma-v1");
  });

  test("abre offline depois do primeiro acesso e o fluxo completo continua", async ({ browser }) => {
    const context = await browser.newContext({ serviceWorkers: "allow" });
    const page = await context.newPage();
    await page.goto("/prisma/");
    await page.evaluate(async () => {
      const reg = await navigator.serviceWorker.ready;
      if (!navigator.serviceWorker.controller) await new Promise<void>((r) => navigator.serviceWorker.addEventListener("controllerchange", () => r(), { once: true }));
      return reg.scope;
    });
    // espera o worker guardar os arquivos entregues pela página
    await expect
      .poll(() => page.evaluate(async () => (await (await caches.open("rc-prisma-v1")).keys()).length), { timeout: 15_000 })
      .toBeGreaterThan(5);

    await context.setOffline(true);
    await page.reload();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Organize o que está dificultando sua execução.");
    await page.getByRole("link", { name: /Criar meu Prisma/ }).first().click();
    await fill(page);
    await page.getByRole("button", { name: "Ver meu Prisma" }).click();
    await expect(page.locator(".prisma-sheet")).toContainText(FILLED.objetivo);
    await context.close();
  });
});

test.describe("acessibilidade do formulário", () => {
  test("todo campo tem rótulo, obrigatórios marcados, grupos em fieldset", async ({ page }) => {
    await page.goto("/prisma/#formulario");
    for (const f of FIELDS) {
      const el = page.locator(`#prisma-${f.key}`);
      await expect(el, f.key).toBeVisible();
      await expect(page.locator(`label[for="prisma-${f.key}"]`), f.key).toHaveCount(1);
      if (f.required) await expect(el).toHaveAttribute("aria-required", "true");
      if (f.kind !== "select") await expect(el).toHaveAttribute("maxlength", String(f.max));
    }
    await expect(page.locator("form fieldset")).toHaveCount(3);
  });
});
