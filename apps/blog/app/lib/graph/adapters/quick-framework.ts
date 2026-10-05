// Adapter do Quick Framework para a Teia (LANC-001 PR-L, RQ-120; ADAPTER-QF-001, MIGRATION_PLAN N2).
// Lê o markdown do template de 12 seções (tools/executar-block-quick-frameworks) sem alterá-lo e devolve o bloco
// correlation_refs + solution_candidates. Regras:
// - só referencia nós que já existem no grafo; nunca cria SOLUTION (candidatas vêm de IMPLEMENTS existentes);
// - nome de nó encontrado no texto = E_INFERRED (correspondência, não afirmação);
// - fonte citada pela URL de um nó EVIDENCE = D_INTERNAL, com a linha citada como trecho.
import type { CorrelationGraph, GraphNode } from "../types";
import { FIELD_BY_TYPE, solutionCandidates, type CorrelationRef, type CorrelationRefs, type SolutionCandidate } from "./correlation-refs";

/** As 12 seções do template, na ordem. */
export const QF_SECTIONS = [
  "Contexto",
  "5W2H",
  "Referência padrão-ouro",
  "Problema existente",
  "Problema solucionado",
  "Processo",
  "Visão do sistema",
  "Progresso esperado",
  "Aviso",
  "Next 01-02-03",
  "Fontes e aprofundamento",
  "Infográfico 16:9",
] as const;

/** Que tipos de nó cada seção pode referenciar por nome (field_map do ADAPTER-QF-001). */
const SECTION_TYPES: Partial<Record<(typeof QF_SECTIONS)[number], string[]>> = {
  Contexto: ["RISK_FACTOR", "COGNITIVE_CAPACITY"],
  "Problema existente": ["RISK_FACTOR", "COGNITIVE_CAPACITY", "OPERATIONAL_IMPACT"],
  "Problema solucionado": ["COMPENSATION", "METHOD", "CONTROL"],
  Processo: ["METHOD", "CONTROL"],
};

export type QfSection = { n: number; title: string; body: string };
export type QfAdapterResult = {
  title: string;
  sections: QfSection[];
  errors: string[];
  correlation_refs: CorrelationRefs;
  solution_candidates: SolutionCandidate[];
};

const fold = (s: string) => s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLocaleLowerCase("pt-BR");
const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export function parseQuickFramework(markdown: string): { title: string; sections: QfSection[]; errors: string[] } {
  const title = /^#\s+(.+)$/m.exec(markdown)?.[1].trim() ?? "";
  const parts = markdown.split(/^##\s+(\d+)\.\s+(.+)$/m);
  const sections: QfSection[] = [];
  for (let i = 1; i < parts.length; i += 3) sections.push({ n: Number(parts[i]), title: parts[i + 1].trim(), body: parts[i + 2].trim() });
  const errors: string[] = [];
  if (!title) errors.push("sem título (# …)");
  if (sections.length !== 12) errors.push(`esperadas 12 seções, encontradas ${sections.length}`);
  sections.forEach((s, i) => {
    if (s.n !== i + 1 || s.title !== QF_SECTIONS[i]) errors.push(`seção ${i + 1} deveria ser "${QF_SECTIONS[i]}", veio "${s.n}. ${s.title}"`);
  });
  return { title, sections, errors };
}

function push(refs: CorrelationRefs, node: GraphNode, ref: Omit<CorrelationRef, "ref">) {
  const field = FIELD_BY_TYPE[node.type];
  if (!field) return;
  const list = (refs[field] ??= []);
  if (!list.some((r) => r.ref === node.id)) list.push({ ref: node.id, ...ref });
}

export function adaptQuickFramework(markdown: string, graph: CorrelationGraph): QfAdapterResult {
  const { title, sections, errors } = parseQuickFramework(markdown);
  const refs: CorrelationRefs = {};
  for (const s of sections) {
    const types = SECTION_TYPES[s.title as (typeof QF_SECTIONS)[number]];
    if (!types) continue;
    const text = fold(s.body);
    for (const node of graph.nodes.filter((n) => types.includes(n.type))) {
      if (new RegExp(`(^|[^\\p{L}])${escape(fold(node.label))}([^\\p{L}]|$)`, "u").test(text)) push(refs, node, { provenance_class: "E_INFERRED", via: `${s.n}. ${s.title}` });
    }
  }
  const sources = sections.find((s) => s.title === "Fontes e aprofundamento");
  for (const line of sources?.body.split("\n") ?? []) {
    for (const node of graph.nodes.filter((n) => n.type === "EVIDENCE" && n.url)) {
      if (line.includes(node.url!)) push(refs, node, { provenance_class: "D_INTERNAL", via: "11. Fontes e aprofundamento", quote: line.replace(/^-\s*/, "").trim() });
    }
  }
  return { title, sections, errors, correlation_refs: refs, solution_candidates: solutionCandidates(graph, refs) };
}
