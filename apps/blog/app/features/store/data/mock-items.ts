import type { AreaId, ItemType, StoreItem } from "../types/store";

/**
 * MOCK DATA — layout validation only. Deliberately generic: no evidence, prices, metrics,
 * integrations or downloads. Replaced through data/repository.ts when final schemas exist.
 */
const GENERIC_CONTEXT =
  "Contexto temporário usado para validar a hierarquia e o comportamento de textos longos no detalhe. " +
  "Este parágrafo não descreve um produto real e será substituído pelo conteúdo definitivo. " +
  "Ele existe para exercitar a área com rolagem controlada quando o texto excede a altura prevista.";

const build = (
  seq: number,
  type: ItemType,
  area: AreaId,
  name: string,
  tags: string[],
  extra: Partial<StoreItem> = {},
): StoreItem => {
  const n = String(seq).padStart(3, "0");
  return {
    id: `mock-${type}-${n}`,
    slug: `${type}-${n}`,
    type,
    name,
    area,
    description: "Descrição temporária utilizada para validar o componente.",
    context: GENERIC_CONTEXT,
    tags,
    problem: "Problema temporário para validação visual.",
    process: [
      { index: 1, label: "Preparar" },
      { index: 2, label: "Executar" },
      { index: 3, label: "Verificar" },
    ],
    progress: {
      plan: "Definir objetivo.",
      do: "Executar processo.",
      check: "Verificar resultado.",
      act: "Ajustar próximo ciclo.",
    },
    input: "Entrada",
    output: "Saída",
    references: [
      { label: "Referência de exemplo A", note: "Nota temporária; sem fonte real." },
      { label: "Referência de exemplo B", note: "Nota temporária; sem fonte real." },
    ],
    cta: { label: "Abrir", target: "#" },
    ...extra,
  };
};

const skill = (n: number, name: string, tags: string[], extra?: Partial<StoreItem>) =>
  build(n, "skill", "skills", name, tags, extra);

export const MOCK_ITEMS: StoreItem[] = [
  skill(1, "Roteador de frameworks (exemplo)", ["Gestão", "Skill"], {
    featured: true,
    description:
      "Descrição genérica temporária para teste de layout do destaque da Store.",
    cta: { label: "Abrir", target: "#" },
  }),
  skill(2, "Priorização de tarefas (exemplo)", ["Gestão", "Execução"]),
  skill(3, "Revisão de decisões (exemplo)", ["Gestão", "Verificação"]),
  skill(4, "Síntese de fontes (exemplo)", ["Pesquisa", "Skill"]),
  skill(5, "Mapa de hipóteses (exemplo)", ["Pesquisa", "Estrutura"]),
  skill(6, "Checklist de leitura (exemplo)", ["Pesquisa", "Revisão"]),
  skill(7, "Diagrama de processo (exemplo)", ["Visual", "Skill"]),
  skill(8, "Quadro de resumo visual (exemplo)", ["Visual", "Síntese"]),
  skill(9, "Rotina semanal (exemplo)", ["Operações", "Execução"]),
  skill(10, "Registro de evidências (exemplo)", ["Operações", "Registro"]),

  build(11, "ebook", "editorial", "E-book de exemplo A", ["Conhecimento", "Leitura"]),
  build(12, "ebook", "editorial", "E-book de exemplo B", ["Conhecimento", "Guia"]),
  build(13, "ebook", "editorial", "E-book de exemplo C", ["Conhecimento", "Referência"]),

  build(14, "prompt", "skills", "Prompt de exemplo — planejamento", ["IA", "Gestão"]),
  build(15, "prompt", "skills", "Prompt de exemplo — revisão", ["IA", "Pesquisa"]),
  build(16, "prompt", "skills", "Prompt de exemplo — resumo", ["IA", "Visual"]),

  build(17, "workbook", "operations", "Workbook de exemplo", ["Operações", "Caderno"]),
  build(18, "html", "tools", "Ferramenta HTML de exemplo", ["Ferramenta", "Interativo"]),
  build(19, "asset", "institutional", "Asset visual de exemplo", ["Visual", "Modelo"]),
];
