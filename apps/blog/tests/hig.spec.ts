import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { useTheme } from "./theme";
import { scanPages } from "../app/lib/routes/scan";

// Gate UX-GOV-HIG-001 (ADR-M03 do monorepo, ADR-12 do blog): Apple HIG + WCAG 2.2 AA + HTML
// semântico + responsivo, em toda rota pré-renderizada. P0/P1 bloqueiam o merge.
// Com HIG_AUDIT=1 os achados (inclusive PASS) vão para test-results/hig/*.json, que
// scripts/hig-audit.mjs consolida em docs/audit/HIG-WEB-AUDIT.{json,md}.

type Status = "PASS" | "FAIL";
type Severity = "P0" | "P1" | "P2" | "P3";
type Finding = {
  RULE_ID: string;
  ROUTE: string;
  COMPONENT: string;
  REQUIREMENT: string;
  SOURCE: string;
  STATUS: Status;
  SEVERITY: Severity;
  EVIDENCE: string;
};

const PAGES = scanPages().filter((p) => p.endsWith("/"));
export const HIG_ROUTES = [...new Set([...PAGES, "/rota-inexistente-hig/"])];

const RULES = {
  axe: ["AUD-HIG-07", "Sem violação séria ou crítica do axe (WCAG 2.0/2.1/2.2 A e AA)", "WCAG 2.2 AA"],
  h1: ["AUD-HIG-07", "Exatamente um h1 e níveis de título sem salto", "WCAG 1.3.1 / HIG Typography"],
  landmarks: ["AUD-HIG-07", "banner, main e contentinfo; skip link; lang pt-BR", "WCAG 1.3.1, 2.4.1, 3.1.1"],
  target: ["AUD-HIG-05", "Alvos de controles com no mínimo 24×24 px (exceto links dentro de frases)", "WCAG 2.5.8 / HIG Layout"],
  reflow: ["AUD-HIG-05", "Sem rolagem horizontal em 320 px", "WCAG 1.4.10 / HIG Layout"],
  tables: ["AUD-HIG-05", "Tabelas não ficam cortadas no celular (empilham em células rotuladas)", "ADR-12 / HIG Layout"],
  measure: ["AUD-HIG-06", "Linhas de leitura com no máximo 75 caracteres", "HIG Typography / --measure"],
  mono: ["AUD-HIG-06", "Nenhum texto corrido em fonte mono (p/li/dd com mais de 12 palavras)", "ADR-12 / HIG Typography"],
  alt: ["AUD-HIG-07", "Toda imagem tem alt; decorativos com aria-hidden", "WCAG 1.1.1"],
  dots: ["AUD-HIG-09", "Halftone decorativo (aria-hidden) e nunca sobre texto", "ADR-12 / HIG Craft"],
  focus: ["AUD-HIG-07", "Foco visível em todo controle alcançado por teclado", "WCAG 2.4.7 / 2.4.11"],
} as const;
const SEVERITY: Record<keyof typeof RULES, Severity> = {
  axe: "P1",
  h1: "P1",
  landmarks: "P1",
  target: "P1",
  reflow: "P0",
  tables: "P1",
  measure: "P1",
  mono: "P1",
  alt: "P0",
  dots: "P1",
  focus: "P0",
};

function finding(rule: keyof typeof RULES, route: string, component: string, fail: boolean, evidence: string, severity?: Severity): Finding {
  const [id, req, src] = RULES[rule];
  return {
    RULE_ID: id,
    ROUTE: route,
    COMPONENT: component,
    REQUIREMENT: req,
    SOURCE: src,
    STATUS: fail ? "FAIL" : "PASS",
    SEVERITY: severity ?? SEVERITY[rule],
    EVIDENCE: evidence,
  };
}

/** Structural checks that run in the page (one evaluate per viewport). */
async function domChecks(page: Page) {
  return page.evaluate(() => {
    const visible = (el: Element) => {
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      return r.width > 0 && r.height > 0 && cs.visibility !== "hidden" && cs.display !== "none" && !el.closest("[hidden],[aria-hidden=true],.sr-only");
    };
    const sel = (el: Element) => {
      const id = el.id ? `#${el.id}` : "";
      const cls = typeof el.className === "string" ? el.className.split(/\s+/).filter(Boolean).slice(0, 2).map((c) => `.${c.replace(/[^\w-]/g, "\\$&")}`).join("") : "";
      return `${el.tagName.toLowerCase()}${id}${cls}`;
    };
    const text = (el: Element) => (el.textContent ?? "").replace(/\s+/g, " ").trim();

    // headings: what assistive tech exposes (sr-only headings count, hidden ones do not)
    const exposed = (el: Element) => getComputedStyle(el).display !== "none" && !el.closest("[hidden],[aria-hidden=true]");
    const hs = [...document.querySelectorAll("h1,h2,h3,h4,h5,h6")].filter(exposed);
    const h1 = hs.filter((h) => h.tagName === "H1").length;
    const skips: string[] = [];
    let prev = 0;
    for (const h of hs) {
      const lvl = Number(h.tagName[1]);
      if (prev && lvl > prev + 1) skips.push(`${h.tagName} "${text(h).slice(0, 40)}" depois de H${prev}`);
      prev = lvl;
    }

    // landmarks
    const landmarks = {
      lang: document.documentElement.lang,
      banner: !!document.querySelector("body > header, [role=banner]"),
      main: document.querySelectorAll("main").length,
      contentinfo: !!document.querySelector("body > footer, footer:not(main footer), [role=contentinfo]"),
      skip: !!document.querySelector('a[href="#conteudo"]'),
    };

    // targets (WCAG 2.5.8): ≥ 24×24 CSS px, with the norm's exceptions — links inside running
    // text, stretched links (the ::after covers the card) and the spacing exception (a 24 px
    // circle centred on the target touches no other target).
    const small: string[] = [];
    const targets = [...document.querySelectorAll('a[href], button, input:not([type=hidden]), select, textarea, summary, [role=button], [role=tab], [role=slider]')].filter(visible);
    const rects = targets.map((t) => t.getBoundingClientRect());
    targets.forEach((el, i) => {
      const parent = el.parentElement;
      const inline = el.tagName === "A" && getComputedStyle(el).display === "inline" && parent && text(parent).length > text(el).length + 3;
      const stretched = getComputedStyle(el, "::after").position === "absolute";
      const r = rects[i];
      if (inline || stretched || (r.width >= 24 && r.height >= 24)) return;
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const crowded = rects.some((q, j) => {
        if (j === i || targets[j].contains(el) || el.contains(targets[j])) return false;
        const dx = Math.max(q.left - cx, 0, cx - q.right);
        const dy = Math.max(q.top - cy, 0, cy - q.bottom);
        return Math.hypot(dx, dy) < 12;
      });
      if (crowded) small.push(`${sel(el)} "${text(el).slice(0, 30)}" ${Math.round(r.width)}×${Math.round(r.height)}`);
    });

    // measure: longest line of reading text in main
    const canvas = document.createElement("canvas").getContext("2d")!;
    const long: string[] = [];
    for (const el of document.querySelectorAll("main p, main li, main dd")) {
      if (!visible(el) || el.closest("table, pre, [data-plain=diagram], nav")) continue;
      const cs = getComputedStyle(el);
      canvas.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
      const ch = canvas.measureText("0").width || parseFloat(cs.fontSize) * 0.55;
      const width = el.getBoundingClientRect().width - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      if (text(el).length > 80 && width / ch > 75.5) long.push(`${sel(el)} ${Math.round(width / ch)}ch`);
    }

    // monospaced running text
    const mono: string[] = [];
    for (const el of document.querySelectorAll("main p, main li, main dd")) {
      if (!visible(el) || el.closest("pre, code, [data-plain=diagram]")) continue;
      if (/monospace/.test(getComputedStyle(el).fontFamily) && text(el).split(" ").length > 12) mono.push(`${sel(el)} "${text(el).slice(0, 40)}"`);
    }

    // images
    const noAlt = [...document.querySelectorAll("img")].filter((i) => !i.hasAttribute("alt")).map((i) => i.getAttribute("src") ?? "?");

    // halftone: decorative and never over text
    const dots = [...document.querySelectorAll("svg[data-dot-field]")];
    const dotIssues: string[] = [];
    const textEls = [...document.querySelectorAll("h1,h2,h3,p,li,dt,dd,a,button,label,input,figcaption")].filter((e) => visible(e) && text(e));
    for (const d of dots) {
      if (d.getAttribute("aria-hidden") !== "true") dotIssues.push("svg sem aria-hidden");
      if (!visible(d)) continue;
      const r = d.getBoundingClientRect();
      for (const t of textEls) {
        if (d.contains(t)) continue;
        const q = t.getBoundingClientRect();
        const ix = Math.max(0, Math.min(r.right, q.right) - Math.max(r.left, q.left));
        const iy = Math.max(0, Math.min(r.bottom, q.bottom) - Math.max(r.top, q.top));
        if (ix * iy > 16) dotIssues.push(`sobre ${sel(t)} "${text(t).slice(0, 30)}"`);
      }
    }

    // tables wider than their column (cut, behind a horizontal scroll) on this viewport
    const cut = [...document.querySelectorAll("main table")]
      // exempt: component specimens, diagrams and declared data grids (keyboard-scrollable region)
      .filter((t) => visible(t) && !t.closest('#componentes, [data-plain=diagram], [data-wide-table][role=region][tabindex="0"]'))
      .filter((t) => (t.parentElement?.clientWidth ?? 0) + 1 < t.getBoundingClientRect().width)
      .map((t) => `${sel(t)} ${Math.round(t.getBoundingClientRect().width)}px em ${t.parentElement?.clientWidth}px`);

    const overflow = document.documentElement.scrollWidth - window.innerWidth;
    return { h1, skips, landmarks, small, long, mono, noAlt, dots: dots.length, dotIssues, cut, overflow };
  });
}

const outDir = join(process.cwd(), "test-results", "hig");
const record = (route: string, findings: Finding[]) => {
  if (!process.env.HIG_AUDIT) return;
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, `${route.replace(/[^\w]+/g, "_") || "_"}.json`), JSON.stringify(findings, null, 2));
};

test.describe("gate UX-GOV-HIG-001", () => {
  test.describe.configure({ mode: "parallel" });

  for (const route of HIG_ROUTES) {
    test(`AUD-HIG ${route}`, async ({ page }) => {
      const findings: Finding[] = [];
      const list = (xs: string[]) => (xs.length ? xs.slice(0, 8).join("; ") + (xs.length > 8 ? ` (+${xs.length - 8})` : "") : "ok");

      for (const [label, width, height] of [["1440", 1440, 900], ["390", 390, 844]] as const) {
        await page.setViewportSize({ width, height });
        await page.goto(route, { waitUntil: "networkidle" });
        const d = await domChecks(page);
        const at = `@${label}`;
        findings.push(finding("h1", route, `page${at}`, d.h1 !== 1 || d.skips.length > 0, `h1=${d.h1}; ${list(d.skips)}`));
        const l = d.landmarks;
        findings.push(
          finding("landmarks", route, `layout${at}`, l.lang !== "pt-BR" || !l.banner || l.main !== 1 || !l.contentinfo || !l.skip, JSON.stringify(l)),
        );
        findings.push(finding("target", route, `controles${at}`, d.small.length > 0, list(d.small)));
        findings.push(finding("measure", route, `texto${at}`, d.long.length > 0, list(d.long)));
        findings.push(finding("mono", route, `texto${at}`, d.mono.length > 0, list(d.mono)));
        findings.push(finding("alt", route, `imagens${at}`, d.noAlt.length > 0, list(d.noAlt)));
        findings.push(finding("dots", route, `DotField${at}`, d.dotIssues.length > 0, `${d.dots} campo(s); ${list(d.dotIssues)}`));
        if (label === "390") findings.push(finding("tables", route, `tabelas${at}`, d.cut.length > 0, list(d.cut)));
        if (label === "390") {
          await page.setViewportSize({ width: 320, height: 800 });
          const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
          findings.push(finding("reflow", route, "página@320", overflow > 0, `overflow=${overflow}px`));
        }
      }

      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(route, { waitUntil: "networkidle" });
      const axe = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
      const blocking = axe.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
      findings.push(
        finding(
          "axe",
          route,
          "axe-core@1440",
          blocking.length > 0,
          blocking.length ? blocking.map((v) => `${v.id}×${v.nodes.length} (${v.nodes[0]?.target.join(" ")})`).join("; ") : `${axe.passes.length} regras ok`,
          blocking.some((v) => v.impact === "critical") ? "P0" : "P1",
        ),
      );

      // keyboard focus is visible on the first controls of the page (transitions off: the ring is
      // read in its final state, not mid-animation)
      await page.addStyleTag({ content: "*,*::before,*::after{transition:none!important;animation:none!important}" });
      const noRing: string[] = [];
      for (let i = 0; i < 12; i++) {
        await page.keyboard.press("Tab");
        const r = await page.evaluate(() => {
          const el = document.activeElement as HTMLElement | null;
          if (!el || el === document.body) return null;
          const cs = getComputedStyle(el);
          // the ring may live on the control's own frame (search form, input group) via :focus-within
          const frame = el.closest("form, [data-focus-frame]");
          const fs = frame ? getComputedStyle(frame) : null;
          // a box-shadow counts only when some layer is painted (visible colour and a blur or spread)
          const painted = (v: string) => {
            if (!v || v === "none") return false;
            // split top-level layers (commas inside color functions do not split)
            const layers: string[] = [];
            let depth = 0;
            let cur = "";
            for (const ch of v) {
              if (ch === "(") depth++;
              if (ch === ")") depth--;
              if (ch === "," && depth === 0) {
                layers.push(cur);
                cur = "";
              } else cur += ch;
            }
            layers.push(cur);
            return layers.some((layer) => {
              const transparent = /transparent|rgba\([^)]*,\s*0\)|\/\s*0\)/.test(layer);
              const lengths = [...layer.replace(/\([^)]*\)/g, "").matchAll(/(-?[\d.]+)px/g)].map((m) => parseFloat(m[1]));
              return !transparent && lengths.length >= 3 && (lengths[2] > 0 || (lengths[3] ?? 0) > 0);
            });
          };
          const ring =
            (cs.outlineStyle !== "none" && parseFloat(cs.outlineWidth) > 0) ||
            painted(cs.boxShadow) ||
            cs.textDecorationLine.includes("underline") ||
            (!!fs && painted(fs.boxShadow));
          return { ring, name: `${el.tagName.toLowerCase()} "${(el.textContent ?? "").trim().slice(0, 30)}"` };
        });
        if (r && !r.ring) noRing.push(r.name);
      }
      findings.push(finding("focus", route, "teclado@1440", noRing.length > 0, list(noRing)));

      record(route, findings);
      const failing = findings.filter((f) => f.STATUS === "FAIL" && (f.SEVERITY === "P0" || f.SEVERITY === "P1"));
      expect(failing.map((f) => `${f.RULE_ID} ${f.COMPONENT}: ${f.EVIDENCE}`)).toEqual([]);
    });
  }

  test("AUD-HIG-06 tema escuro mantém contraste (amostra)", async ({ page }) => {
    await useTheme(page, "dark");
    for (const route of ["/", "/admin/", "/admin/rotas/"]) {
      await page.goto(route, { waitUntil: "networkidle" });
      const axe = await new AxeBuilder({ page }).withRules(["color-contrast"]).analyze();
      expect(axe.violations.map((v) => `${route} ${v.id}×${v.nodes.length}`)).toEqual([]);
    }
  });
});
