import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

import { expectTheme, useTheme } from "./theme";
import { isValidPlainText, normalizeText } from "../app/lib/plain/normalizeText";
import { parseFence } from "../app/lib/plain/remarkPlain";
import { renderTree } from "../app/lib/plain/renderTree";

const SHOWROOM = "/admin/design-system/";
const REPORT = "/admin/relatorio-exemplo/";

// ------------------------------------------------------------------ unit

test.describe("plain lib", () => {
  test("renderTree draws the canonical box-drawing tree", () => {
    const out = renderTree({
      label: "ROOT",
      children: [
        { label: "a", children: [{ label: "a1" }, { label: "a2" }] },
        { label: "b", children: [{ label: "b1" }] },
      ],
    });
    expect(out).toBe(["ROOT", "├── a", "│   ├── a1", "│   └── a2", "└── b", "    └── b1"].join("\n"));
    expect(renderTree([{ label: "X" }, { label: "Y" }])).toBe("X\n\nY");
  });

  test("normalizeText keeps internal whitespace and trims only outer blank lines", () => {
    const src = "\r\n\n  \nA0  ORIENTAR\r\n    nenhuma ação\t externa\n\n│   └── fim  \n \n";
    expect(normalizeText(src)).toBe("A0  ORIENTAR\n    nenhuma ação\t externa\n\n│   └── fim  ");
    expect(normalizeText("﻿x")).toBe("x");
    expect(isValidPlainText("├── ok\n\tok")).toBe(true);
    expect(isValidPlainText("bad\u0007")).toBe(false);
    expect(isValidPlainText("lone \ud800")).toBe(false);
  });

  test("fenced ```ascii header lines become props", () => {
    const { props, source } = parseFence("id: FLOW-1\nkind: orgchart\ntitle: Org\nFASE 01\n│\n└── fim");
    expect(props).toEqual({ id: "FLOW-1", kind: "orgchart", title: "Org" });
    expect(source).toBe("FASE 01\n│\n└── fim");
  });
});

// ------------------------------------------------------------------ AC

const ORG = `FASE 01
│
├── 01. ENTRADA / PLANEJAMENTO
│   │
│   ├── 01.01 Plano / Campanha
│   │   ├── definir tema
│   │   ├── definir estrutura
│   │   ├── definir objetivo
│   │   └── definir diretrizes
│   │
│   └── 01.02 Pesquisa de Insumos
│       ├── documentos
│       ├── artigos
│       ├── referências
│       ├── imagens
│       └── vídeos
│
└── 02. PESQUISA / COLETA
    ├── 02.01 Executar pesquisa
    └── 02.02 Registrar na base`;

test("AC-01/02: text is identical to the source and box characters stay aligned", async ({ page }) => {
  await page.goto(SHOWROOM);
  const pre = page.locator("#FLOW-OPS-001 pre");
  expect(await pre.textContent()).toBe(ORG);
  // every "│" that starts a line sits at the same x as the "├"/"└" in column 0
  const xs = await pre.evaluate((el) => {
    const code = el.querySelector("code")!.firstChild as Text;
    const text = code.data;
    const out: number[] = [];
    let offset = 0;
    for (const line of text.split("\n")) {
      if (/^[│├└]/.test(line)) {
        const r = document.createRange();
        r.setStart(code, offset);
        r.setEnd(code, offset + 1);
        out.push(Math.round(r.getBoundingClientRect().left));
      }
      // column 4 connectors of nested levels
      if (/^│   [│├└]/.test(line)) {
        const r = document.createRange();
        r.setStart(code, offset + 4);
        r.setEnd(code, offset + 5);
        out.push(Math.round(r.getBoundingClientRect().left) - 1000);
      }
      offset += line.length + 1;
    }
    return out;
  });
  const col0 = xs.filter((x) => x >= 0);
  const col4 = xs.filter((x) => x < 0);
  expect(new Set(col0).size).toBe(1);
  expect(new Set(col4).size).toBe(1);
});

test("AC-01: MDX report preserves template-literal indentation", async ({ page }) => {
  await page.goto(REPORT);
  const flow = await page.locator("#AUTONOMY-FLOW-001 pre").textContent();
  expect(flow).toContain("\nA4\n    ├── executar\n    ├── verificar\n    └── evidenciar");
  const model = await page.locator("#AUTONOMY-MODEL-001 [data-plain-content]").textContent();
  expect(model?.startsWith("A0  ORIENTAR\n    nenhuma ação externa\n")).toBe(true);
  // fenced ```ascii block was converted by remarkPlain
  const fenced = page.locator('[data-plain="diagram"][data-kind="architecture"]');
  await expect(fenced).toHaveCount(1);
  expect(await fenced.locator("pre").textContent()).toContain("ASCII NORMALIZER\n      │\n      ├── valida UTF-8");
});

for (const width of [320, 375, 768, 1440]) {
  test(`AC-03/04: no page overflow, wide diagram scrolls inside @${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const url of [SHOWROOM, REPORT]) {
      await page.goto(url);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow, url).toBeLessThanOrEqual(0);
    }
    await page.goto(SHOWROOM);
    const wide = await page.locator("#FLOW-WIDE-001 pre").evaluate((el) => el.scrollWidth > el.clientWidth);
    expect(wide).toBe(true);
    // readable floor on mobile (rule 9)
    const size = await page.locator("#FLOW-OPS-001 pre").evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
    expect(size).toBeGreaterThanOrEqual(14);
  });
}

test("AC-05: copy returns exactly the source and confirms", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto(SHOWROOM);
  const block = page.locator("#FLOW-OPS-001");
  const button = block.getByRole("button", { name: "Copiar diagrama" });
  await button.click();
  await expect(button).toContainText("Copiado");
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(ORG);
  await expect(button).toContainText("Copiar", { timeout: 3000 });

  await page.goto(REPORT);
  await page.locator("#AUTONOMY-RULE-001").getByRole("button", { name: "Copiar conteúdo" }).click();
  const copied = await page.evaluate(() => navigator.clipboard.readText());
  expect(copied.startsWith("Não iniciar workflows novos")).toBe(true);
  expect(copied).not.toContain("Plain text");
  expect(copied).not.toContain("Copiar");
});

test("AC-06/07 + annex AC-04: both components share the token-driven surface", async ({ page }) => {
  await page.goto(SHOWROOM);
  const style = (sel: string) =>
    page.locator(sel).evaluate((el) => {
      const cs = getComputedStyle(el);
      return { bg: cs.backgroundColor, border: cs.borderTopColor, radius: cs.borderTopLeftRadius, color: cs.color };
    });
  const diagram = await style("#FLOW-OPS-001");
  const panel = await style("#PANEL-INSTRUCTION-001");
  expect(diagram).toEqual({ bg: "rgb(248, 248, 248)", border: "rgb(235, 235, 235)", radius: "28px", color: "rgb(0, 0, 0)" });
  expect(panel).toEqual(diagram);
  const fonts = await page.locator("#FLOW-OPS-001 pre, #PANEL-INSTRUCTION-001 [data-plain-content]").evaluateAll((els) =>
    els.map((e) => getComputedStyle(e).fontFamily),
  );
  expect(fonts.every((f) => /ui-monospace|monospace/.test(f))).toBe(true);

  await page.setViewportSize({ width: 375, height: 800 });
  expect((await style("#FLOW-OPS-001")).radius).toBe("22px");
});

test("annex AC-06/07: panel text wraps on mobile, diagram keeps geometry", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto(SHOWROOM);
  const panel = await page
    .locator("#PANEL-LONG-001 [data-plain-content]")
    .evaluate((el) => ({ ws: getComputedStyle(el).whiteSpace, fits: el.scrollWidth <= el.clientWidth }));
  expect(panel).toEqual({ ws: "pre-wrap", fits: true });
  expect(await page.locator("#FLOW-WIDE-001 pre").evaluate((el) => getComputedStyle(el).whiteSpace)).toBe("pre");
});

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });
  test("AC-08: content is readable and identical without JS", async ({ page }) => {
    await page.goto(SHOWROOM);
    expect(await page.locator("#FLOW-OPS-001 pre").textContent()).toBe(ORG);
    await page.goto(REPORT);
    await expect(page.locator("[data-plain]")).toHaveCount(5);
  });
});

test("annex AC-09: report composes Markdown, panels and diagrams", async ({ page }) => {
  await page.goto(REPORT);
  await expect(page.getByRole("heading", { level: 1, name: "Relatório de Governança de Agentes" })).toBeVisible();
  await expect(page.locator("[data-report] h2")).toHaveCount(5);
  await expect(page.locator('[data-plain="panel"]')).toHaveCount(3);
  await expect(page.locator('[data-plain="diagram"]')).toHaveCount(2);
  const kinds = await page.locator("[data-plain]").evaluateAll((els) => els.map((e) => e.getAttribute("data-kind")));
  expect(kinds).toEqual(["definition", "flowchart", "instruction", "architecture", "status"]);
});

test("AC-10: axe finds no serious or critical issues", async ({ page }) => {
  for (const [url, include] of [
    [SHOWROOM, "#plain"],
    [REPORT, "main"],
  ] as const) {
    await page.goto(url);
    const { violations } = await new AxeBuilder({ page }).include(include).analyze();
    const blocking = violations.filter((v) => v.impact === "serious" || v.impact === "critical");
    expect(blocking, JSON.stringify(blocking.map((v) => [v.id, v.nodes.map((n) => n.target)]))).toEqual([]);
  }
});

for (const theme of ["light", "dark"] as const) {
  test(`plain text contrast is AAA (${theme})`, async ({ page }) => {
    await useTheme(page, theme);
    await page.goto(SHOWROOM);
    await expectTheme(page, theme);
    const ratio = await page.locator("#FLOW-OPS-001").evaluate((el) => {
      const ctx = document.createElement("canvas").getContext("2d")!;
      const lum = (c: string) => {
        ctx.clearRect(0, 0, 1, 1);
        ctx.fillStyle = c;
        ctx.fillRect(0, 0, 1, 1);
        const [r, g, b] = Array.from(ctx.getImageData(0, 0, 1, 1).data.slice(0, 3)).map((v) => {
          const s = v / 255;
          return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
        });
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
      };
      const cs = getComputedStyle(el);
      const [a, b] = [lum(cs.color), lum(cs.backgroundColor)];
      return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
    });
    expect(ratio).toBeGreaterThanOrEqual(7);
  });
}

for (const width of [375, 1440]) {
  test(`visual: plain showroom @${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(SHOWROOM);
    await expect(page.getByTestId("plain-diagrams")).toHaveScreenshot(`plain-diagrams-${width}.png`);
    await expect(page.getByTestId("plain-panels")).toHaveScreenshot(`plain-panels-${width}.png`);
  });
}

test("tables follow the STORE-WIREFRAMES style everywhere", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  for (const [url, sel] of [
    [SHOWROOM, "[data-testid=table-reference] table"],
    [SHOWROOM, "[data-testid=data-table] table"],
    ["/blog/do-risco-cognitivo-a-execucao-assistida/", ".prose table"],
  ] as const) {
    await page.goto(url);
    const t = page.locator(sel).first();
    await t.scrollIntoViewIfNeeded();
    const s = await t.evaluate((el) => {
      const th = getComputedStyle(el.querySelector("th")!);
      const td = getComputedStyle(el.querySelector("td")!);
      const cs = getComputedStyle(el);
      return { collapse: cs.borderCollapse, spacing: cs.borderSpacing.split(" ")[0], th: th.backgroundColor, upper: th.textTransform, td: td.backgroundColor };
    });
    expect(s, `${url} ${sel}`).toEqual({ collapse: "separate", spacing: "3px", th: "rgb(235, 235, 235)", upper: "uppercase", td: "rgb(248, 248, 248)" });
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(0);
  }
});
