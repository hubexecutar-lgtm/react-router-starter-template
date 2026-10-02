// Migração única e idempotente (HANDOFF-RC-GLOBAL-DESIGN-CONTENT-001, Fase 2).
// Tira o banco editorial embutido no Hub (window.__SEED__) e o grava em
// app/data/editorial/seed.json, a fonte única. No Hub, a linha inline vira
// <script src="./seed.js">, gerado por scripts/sync-editorial-seed.mjs.
// Rodar de novo não faz nada: se o Hub já não tem seed inline, só confere o JSON.
import { existsSync, readFileSync, writeFileSync } from "node:fs";

const HUB = "public/hub-editorial/index.html";
const OUT = "app/data/editorial/seed.json";
const LINE = /^window\.__SEED__ = (\{.*\});\r?\n/m;

const html = readFileSync(HUB, "utf8");
const match = html.match(LINE);

if (!match) {
  if (!existsSync(OUT)) throw new Error(`${HUB} sem seed inline e ${OUT} ausente`);
  console.log(`seed já extraído: ${OUT}`);
  process.exit(0);
}

const seed = JSON.parse(match[1]);
if (existsSync(OUT)) {
  const current = JSON.parse(readFileSync(OUT, "utf8"));
  if (JSON.stringify(current) !== JSON.stringify(seed)) {
    throw new Error(`${OUT} já existe e difere do seed inline; resolva manualmente`);
  }
}
writeFileSync(OUT, JSON.stringify(seed, null, 2) + "\n");

const tag = '<script src="./seed.js"></script>\n<script>\n';
writeFileSync(HUB, html.replace(LINE, "").replace(/<script>\n(?=window\.__MODULES__)/, tag));
const counts = Object.fromEntries(Object.entries(seed.seed).map(([k, v]) => [k, v.length]));
console.log(`seed extraído para ${OUT}`, counts);
