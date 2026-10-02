// Gera public/hub-editorial/seed.js a partir de app/data/editorial/seed.json (fonte única).
// Roda no prebuild; tests/content.spec.ts falha se o arquivo gerado estiver defasado.
import { readFileSync, writeFileSync } from "node:fs";

export const SEED_JSON = "app/data/editorial/seed.json";
export const SEED_JS = "public/hub-editorial/seed.js";

export function renderSeedJs(json = readFileSync(SEED_JSON, "utf8")) {
  const seed = JSON.parse(json);
  return (
    "// Gerado por scripts/sync-editorial-seed.mjs a partir de app/data/editorial/seed.json.\n" +
    "// Não edite à mão: altere o JSON e rode `npm run build` (ou `node scripts/sync-editorial-seed.mjs`).\n" +
    `window.__SEED__ = ${JSON.stringify(seed)};\n`
  );
}

if (import.meta.url === `file://${process.argv[1]}`) {
  writeFileSync(SEED_JS, renderSeedJs());
  console.log(`${SEED_JS} atualizado`);
}
