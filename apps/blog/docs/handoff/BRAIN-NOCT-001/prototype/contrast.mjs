// BRAIN-NOCT-001 · tabela de contraste dos tokens dos mockups (WCAG 2.x, luminância relativa sRGB).
// Uso: node apps/blog/docs/handoff/BRAIN-NOCT-001/prototype/contrast.mjs  → imprime a tabela Markdown do A11Y.md.
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const css = readFileSync(join(dirname(fileURLToPath(import.meta.url)), "tokens.css"), "utf8");
const tok = (name) => {
	const m = css.match(new RegExp(`${name}:\\s*(#[0-9a-f]{6})`, "i"));
	if (!m) throw new Error(`token sem hex: ${name}`);
	return m[1].toLowerCase();
};
const lum = (hex) => {
	const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
	return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const ratio = (a, b) => {
	const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
	return (x + 0.05) / (y + 0.05);
};
// [uso, primeiro plano, fundo, mínimo]
const PAIRS = [
	["Texto", "--color-text", "--color-bg", 4.5],
	["Texto em superfície", "--color-text", "--color-surface", 4.5],
	["Texto secundário", "--color-neutral-600", "--color-bg", 4.5],
	["Texto secundário em superfície", "--color-neutral-600", "--color-surface", 4.5],
	["Texto em acento (link, rótulo, botão primário)", "--color-accent-text", "--color-bg", 4.5],
	["Texto em acento sobre tinta (hover)", "--color-accent-text", "--color-accent-100", 4.5],
	["Acento como texto pequeno (proibido)", "--color-accent", "--color-bg", 4.5],
	["Contorno do pin e do botão primário (não texto)", "--color-accent", "--color-bg", 3],
	["Ícone branco no pin ativo", "--color-bg", "--color-accent", 3],
	["Ícone branco no pin selecionado", "--color-bg", "--color-accent-600", 4.5],
	["Chave ligada (trilho)", "--color-accent-600", "--color-bg", 3],
	["Chave desligada (trilho, não texto)", "--color-neutral-500", "--color-bg", 3],
	["Contorno do botão secundário (identificado pelo rótulo; 1.4.11 não exige)", "--color-neutral-300", "--color-bg", 0],
	["Ponto inativo do paginador", "--color-neutral-500", "--color-bg", 3],
	["Traço da malha (decorativo)", "--brain-wire-front", "--color-bg", 0],
	["Ponto claro do cérebro (decorativo)", "--brain-point-light", "--color-bg", 0],
];
console.log("| Uso | Primeiro plano | Fundo | Razão | Mínimo | Passa? |\n|---|---|---|---|---|---|");
for (const [use, fg, bg, min] of PAIRS) {
	const r = ratio(tok(fg), tok(bg));
	const ok = min === 0 ? "não exigido" : r >= min ? "✅" : "❌";
	console.log(`| ${use} | \`${fg}\` ${tok(fg).toUpperCase()} | \`${bg}\` ${tok(bg).toUpperCase()} | ${r.toFixed(2).replace(".", ",")}:1 | ${min ? `${String(min).replace(".", ",")}:1` : "—"} | ${ok} |`);
}
