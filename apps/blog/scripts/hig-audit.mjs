// Consolida a auditoria UX-GOV-HIG-001 (ADR-M03) em docs/audit/HIG-WEB-AUDIT.{json,md}.
// Entradas: achados automatizados de `HIG_AUDIT=1 npx playwright test tests/hig.spec.ts`
// (test-results/hig/*.json = reteste), a linha de base (docs/audit/baseline/*.json, mesma forma)
// e a checklist manual dos domínios não automatizáveis (docs/audit/hig-manual.json).
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const read = (dir) =>
  existsSync(dir) ? readdirSync(dir).filter((f) => f.endsWith(".json")).flatMap((f) => JSON.parse(readFileSync(join(dir, f), "utf8"))) : [];

const REMEDIATION = {
  "AUD-HIG-05|página": "PageHero: colunas com min-w-0 e display com clamp() a partir de 320 px",
  "AUD-HIG-06|texto": "Regra transversal de medida: p/li/dd em main com max-width: var(--measure) (68ch)",
  "AUD-HIG-07|page": "h2 (visível ou sr-only) antes dos cards h3 da página",
  "AUD-HIG-07|axe-core": "Slider: aria-label repassado ao thumb; ScrollArea: viewport focável com aria-label",
};
const remediationFor = (f) => REMEDIATION[`${f.RULE_ID}|${f.COMPONENT.split("@")[0]}`] ?? "Ver EVIDENCE";

const auto = (list, phase) =>
  list.map((f) => ({
    ...f,
    REMEDIATION: f.STATUS === "PASS" ? "—" : remediationFor(f),
    OWNER: "A DEFINIR",
    VERIFICATION: `tests/hig.spec.ts — ${phase} (Chromium 1440/390/320)`,
  }));

const baseline = auto(read("docs/audit/baseline"), "linha de base");
const retest = auto(read("test-results/hig"), "reteste");
const manual = JSON.parse(readFileSync("docs/audit/hig-manual.json", "utf8"));
if (!retest.length) throw new Error("rode antes: HIG_AUDIT=1 npx playwright test tests/hig.spec.ts");

const count = (list) => {
  const out = { total: list.length, PASS: 0, PARTIAL: 0, FAIL: 0, "N/A": 0, P0: 0, P1: 0, P2: 0, P3: 0 };
  for (const f of list) {
    out[f.STATUS] += 1;
    if (f.STATUS !== "PASS") out[f.SEVERITY] += 1;
  }
  return out;
};
const routes = [...new Set(retest.map((f) => f.ROUTE))].sort();
const open = [...retest, ...manual].filter((f) => f.STATUS !== "PASS");
const blocking = open.filter((f) => f.STATUS === "FAIL" && (f.SEVERITY === "P0" || f.SEVERITY === "P1"));

const report = {
  id: "HIG-WEB-AUDIT-BLOG",
  rule: "UX-GOV-HIG-001 (ADR-M03)",
  app: "apps/blog",
  date: new Date().toISOString().slice(0, 10),
  baseline_ref: "main @ ab685e2 (antes do RC-UX-HIG-002 PR D)",
  routes,
  summary: { baseline: count(baseline), retest: count(retest), manual: count(manual) },
  release: blocking.length ? "BLOCKED" : "PASS",
  findings: { baseline_failures: baseline.filter((f) => f.STATUS !== "PASS"), open, manual, automated: retest },
};
writeFileSync("docs/audit/HIG-WEB-AUDIT.json", JSON.stringify(report, null, 2) + "\n");

const row = (f) =>
  `| ${f.RULE_ID} | \`${f.ROUTE}\` | ${f.COMPONENT} | ${f.STATUS} | ${f.SEVERITY} | ${String(f.EVIDENCE).replace(/\|/g, "\\|").slice(0, 160)} | ${f.REMEDIATION} |`;
const head = "| Regra | Rota | Componente | Status | Sev. | Evidência | Correção |\n|---|---|---|---|---|---|---|";
const s = (c) => `${c.total} verificações · ${c.PASS} PASS · ${c.PARTIAL} PARTIAL · ${c.FAIL} FAIL (P0 ${c.P0}, P1 ${c.P1}, P2 ${c.P2}, P3 ${c.P3})`;
const md = `# HIG-WEB-AUDIT — apps/blog

Gerado por \`scripts/hig-audit.mjs\` em ${report.date}. Regra: **UX-GOV-HIG-001** (\`docs/governance/UX-GOV-HIG-001.md\`,
ADR-M03). Gate automatizado: \`tests/hig.spec.ts\` (axe WCAG 2.0/2.1/2.2 A+AA, títulos, landmarks, alvos ≥ 24 px,
reflow 320 px, medida ≤ 75 caracteres, sem prosa mono, \`alt\`, halftone fora do texto, foco visível) em
${routes.length} rotas, a 1440, 390 e 320 px, mais amostra no tema escuro.

**Release: ${report.release}** — P0/P1 abertos: ${blocking.length}.

## Resumo

| Fase | Resultado |
|---|---|
| Linha de base (${report.baseline_ref}) | ${s(report.summary.baseline)} |
| Reteste (automatizado) | ${s(report.summary.retest)} |
| Checklist manual | ${s(report.summary.manual)} |

## Falhas da linha de base e correção

${head}
${report.findings.baseline_failures.map(row).join("\n") || "| — | — | — | — | — | nenhuma | — |"}

## Itens abertos (reteste + manual)

${head}
${open.map(row).join("\n") || "| — | — | — | — | — | nenhum | — |"}

## Checklist manual (domínios não automatizáveis)

${head}
${manual.map(row).join("\n")}

## Rotas cobertas

${routes.map((r) => `\`${r}\``).join(" · ")}

O detalhe completo (todas as ${report.summary.retest.total} verificações automatizadas, inclusive PASS) está em
\`HIG-WEB-AUDIT.json\`. Para atualizar: \`HIG_AUDIT=1 npx playwright test tests/hig.spec.ts && node scripts/hig-audit.mjs\`.
`;
writeFileSync("docs/audit/HIG-WEB-AUDIT.md", md);
console.log(`HIG-WEB-AUDIT: ${report.release} · ${routes.length} rotas · baseline ${report.summary.baseline.FAIL} FAIL → reteste ${report.summary.retest.FAIL} FAIL`);
