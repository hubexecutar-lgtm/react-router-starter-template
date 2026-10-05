// RC-PUB-PACK-003: gera app/features/solutions/data.ts do YAML canônico das 6 soluções, sem reescrita.
//   node scripts/solutions-from-yaml.mjs
// Fonte: docs/lancamento/LANC-001/intake/RC-PUB-PACK-003/03-data/RC_SCHEMA_6_SOLUCOES_v3.0.0.yaml
// As regras do schema (12 palavras no amarelo, 3 funções, 3 passos, refs no RC-SRC-002) são travadas em
// tests/solutions.spec.ts; aqui só se converte o formato.
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { parse } from "yaml";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = "docs/lancamento/LANC-001/intake/RC-PUB-PACK-003/03-data/RC_SCHEMA_6_SOLUCOES_v3.0.0.yaml";
const doc = parse(readFileSync(join(ROOT, "../..", SRC), "utf8"));

const solutions = doc.solutions.map((s) => ({
	id: s.id,
	name: s.name,
	slug: s.slug,
	pain: s.pain,
	yellow12: s.yellow12,
	study: s.study,
	work: s.work,
	functions: s.functions.map((f) => {
		const [name, ...rest] = f.split(" — ");
		return { name, detail: rest.join(" — ") };
	}),
	vulnerability: s.vulnerability,
	risk: s.risk,
	technique: s.technique,
	steps: s.steps,
	metrics: s.metrics.map((m) => ({ label: m.replace(/\s*[↑↓]$/, ""), direction: m.trim().endsWith("↓") ? "down" : "up" })),
	evidenceStatus: s.evidence_status,
	refs: s.refs,
}));

const out = `// Gerado por scripts/solutions-from-yaml.mjs de ${SRC.split("/").pop()} (RC-SCHEMA-001 v${doc.metadata.version}).
// Não editar à mão: altere o YAML no intake e rode o script.
export type SolutionMetric = { label: string; direction: "up" | "down" };
export type Solution = {
	id: string;
	name: string;
	slug: string;
	pain: string;
	/** Quadrante amarelo: exatamente 12 palavras (card_rule.yellow). */
	yellow12: string;
	study: string;
	work: string;
	functions: { name: string; detail: string }[];
	vulnerability: string;
	risk: string;
	technique: string;
	steps: string[];
	metrics: SolutionMetric[];
	evidenceStatus: string;
	/** Chaves do RC-SRC-002 (app/data/sources-scientific.ts). */
	refs: string[];
};

export const SCHEMA_WORKFLOW = ${JSON.stringify(doc.metadata.workflow)};
export const SCIENTIFIC_GUARDRAIL = ${JSON.stringify(doc.metadata.scientific_guardrail)};

export const SOLUTIONS: Solution[] = ${JSON.stringify(solutions, null, "\t")};

export const solutionBySlug = (slug: string) => SOLUTIONS.find((s) => s.slug === slug);
`;
writeFileSync(join(ROOT, "app/features/solutions/data.ts"), out);
console.log(`${solutions.length} soluções`);
