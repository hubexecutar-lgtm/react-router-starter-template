import { typeDef } from "./item-types";
import { MOCK_ITEMS } from "./mock-items";
import { sourceByKey } from "../../../data/sources-scientific";
import { SOLUTIONS, type Solution } from "../../solutions/data";
import type { ItemType, StoreItem } from "../types/store";


/**
 * As 6 soluções publicadas (RC-PUB-PACK-003) no formato do catálogo. A página delas é SolutionDetail; este
 * adaptador só alimenta cards, listas e caminhos. Nada é inventado: cada campo vem do YAML do schema.
 */
const fromSolution = (s: Solution): StoreItem => ({
  id: s.id,
  slug: s.slug,
  type: "solution",
  name: s.name,
  area: "operations",
  description: s.yellow12,
  context: s.pain,
  tags: s.functions.map((f) => f.name),
  problem: s.risk,
  process: [
    { index: 1, label: s.steps[0] },
    { index: 2, label: s.steps[1] },
    { index: 3, label: s.steps[2] },
  ],
  progress: { plan: s.technique, do: s.work, check: s.metrics.map((m) => m.label).join(", "), act: s.evidenceStatus },
  input: s.vulnerability,
  output: s.metrics.map((m) => m.label).join(", "),
  references: s.refs.flatMap((key) => {
    const ref = sourceByKey(key);
    return ref ? [{ label: ref.label, note: ref.pmid ? `PMID ${ref.pmid}` : ref.journal }] : [];
  }),
  cta: { label: "Ver a solução", target: `/ferramentas/solucoes/${s.slug}/` },
});

/**
 * Single access point to catalog data. Swap the body of these functions when the real
 * backend/schemas exist; components and routes must not import mock-items directly.
 */
export const listItems = (): StoreItem[] => SOLUTIONS.map(fromSolution);

/**
 * Itens de exemplo (mock-items.ts) ficam no repositório, fora do catálogo (ADR-BLOG-JORNADA-ROTAS-001 §4.2, ADR-26):
 * nenhum item fictício aparece como disponível. As URLs que já foram publicadas respondem 302 para /ferramentas/.
 */
export const RETIRED_ITEM_PATHS: string[] = MOCK_ITEMS.map((item) => `/ferramentas/${typeDef(item.type).segment}/${item.slug}/`);

export const listItemsByType = (type: ItemType): StoreItem[] =>
  listItems().filter((item) => item.type === type);

export const getItem = (type: ItemType, slug: string): StoreItem | undefined =>
  listItems().find((item) => item.type === type && item.slug === slug);

export const featuredItem = (): StoreItem | undefined =>
  listItems().find((item) => item.featured);

export const typeLabel = (type: ItemType) => typeDef(type).label;
