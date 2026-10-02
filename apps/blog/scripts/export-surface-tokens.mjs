// Exporta o contrato de superfícies (ADR-09) para as ferramentas autônomas em public/
// (Hub Editorial, Catálogo de Skills, Catálogo offline), que não passam pelo Tailwind.
// Fonte única: app/styles/global.css. Saída: public/ds/surfaces.css com valores resolvidos
// e prefixo --ds-*, nos dois temas. Roda no prebuild; `--check` falha se o arquivo estiver
// defasado (tests/content.spec.ts). Não edite public/ds/surfaces.css à mão.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

export const SOURCE = "app/styles/global.css";
export const OUTPUT = "public/ds/surfaces.css";

/** Tokens exportados: nome no global.css → nome público (--ds-*). */
export const EXPORTED = [
  "surface-page",
  "surface-default",
  "surface-subtle",
  "surface-hover",
  "surface-selected",
  "border-subtle",
  "border-default",
  "border-strong",
  "elevation-flat",
  "elevation-raised",
  "elevation-overlay",
  "surface-radius-card",
  "table-radius",
  "table-gap",
  "table-head-surface",
  "foreground",
  "muted-foreground",
  "primary",
  "primary-foreground",
  "ring",
];

function blocks(css, selector) {
  const out = {};
  const re = new RegExp(`(^|\\n)${selector.replace(/[.*]/g, "\\$&")}\\s*\\{([\\s\\S]*?)\\n\\}`, "g");
  for (const m of css.matchAll(re)) {
    const body = m[2].replace(/\/\*[\s\S]*?\*\//g, "");
    for (const d of body.matchAll(/--([\w-]+)\s*:\s*([^;]+);/g)) out[d[1]] = d[2].trim().replace(/\s+/g, " ");
  }
  return out;
}

function resolver(vars) {
  const resolve = (value, depth = 0) => {
    if (depth > 20) throw new Error(`referência circular em ${value}`);
    return value.replace(/var\(--([\w-]+)\)/g, (_, name) => {
      if (!(name in vars)) throw new Error(`token --${name} não encontrado`);
      return resolve(vars[name], depth + 1);
    });
  };
  return resolve;
}

export function render(css = readFileSync(SOURCE, "utf8")) {
  const light = { ...blocks(css, "@theme inline"), ...blocks(css, ":root") };
  const dark = { ...light, ...blocks(css, ".dark") };
  const decl = (vars) => {
    const r = resolver(vars);
    return EXPORTED.map((n) => `  --ds-${n}: ${r(vars[n] ?? (() => { throw new Error(`--${n} ausente`); })())};`).join("\n");
  };
  return `/* Gerado por scripts/export-surface-tokens.mjs a partir de app/styles/global.css (ADR-09).
   Não edite: altere global.css e rode \`npm run build\`. Tema escuro: PROVISIONAL, como no site. */
:root {
${decl(light)}
}
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]):not(.light) {
${decl(dark).replace(/^/gm, "  ")}
  }
}
:root[data-theme="dark"],
:root.dark {
${decl(dark)}
}
`;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const next = render();
  if (process.argv.includes("--check")) {
    const current = existsSync(OUTPUT) ? readFileSync(OUTPUT, "utf8") : "";
    if (current !== next) {
      console.error(`${OUTPUT} defasado: rode node scripts/export-surface-tokens.mjs`);
      process.exit(1);
    }
    console.log(`${OUTPUT} em dia`);
  } else {
    mkdirSync(dirname(OUTPUT), { recursive: true });
    writeFileSync(OUTPUT, next);
    console.log(`${OUTPUT} atualizado`);
  }
}
