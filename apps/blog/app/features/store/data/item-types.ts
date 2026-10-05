import {
  BookOpen,
  Bot,
  Code2,
  FileText,
  Image as ImageIcon,
  LayoutGrid,
  MessageSquareText,
  NotebookPen,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

import type { AreaId, ItemType } from "../types/store";

export type CardPattern = "list" | "grid";

export interface ItemTypeDef {
  type: ItemType;
  /** URL segment: /ferramentas/{segment} and /ferramentas/{segment}/{slug} */
  segment: string;
  label: string;
  plural: string;
  description: string;
  icon: LucideIcon;
  /** plugin-like row (list) or connector-like card with cover (grid) */
  pattern: CardPattern;
  defaultArea: AreaId;
}

export const ITEM_TYPES: ItemTypeDef[] = [
  { type: "skill", segment: "skills", label: "Skill", plural: "Skills", description: "Ferramentas reutilizáveis para apoiar trabalho e execução.", icon: Sparkles, pattern: "list", defaultArea: "skills" },
  { type: "agent", segment: "agentes", label: "Agente", plural: "Agentes", description: "Fluxos automatizados com objetivo e limites definidos.", icon: Bot, pattern: "list", defaultArea: "skills" },
  { type: "prompt", segment: "prompts", label: "Prompt", plural: "Prompts", description: "Instruções prontas para conduzir uma tarefa com IA.", icon: MessageSquareText, pattern: "list", defaultArea: "skills" },
  { type: "ebook", segment: "ebooks", label: "E-book", plural: "E-books", description: "Material de conhecimento para leitura e consulta.", icon: BookOpen, pattern: "grid", defaultArea: "editorial" },
  { type: "pdf", segment: "pdfs", label: "PDF", plural: "PDFs", description: "Documentos prontos para baixar e imprimir.", icon: FileText, pattern: "grid", defaultArea: "editorial" },
  { type: "html", segment: "html", label: "Ferramenta HTML", plural: "HTML", description: "Ferramentas interativas que rodam no navegador.", icon: Code2, pattern: "grid", defaultArea: "tools" },
  { type: "workbook", segment: "workbooks", label: "Workbook", plural: "Workbooks", description: "Cadernos de trabalho para preencher e aplicar.", icon: NotebookPen, pattern: "grid", defaultArea: "operations" },
  { type: "solution", segment: "solucoes", label: "Solução", plural: "Soluções", description: "Soluções do método Gestão e Controle de Riscos Cognitivos: da dor ao progresso observável.", icon: LayoutGrid, pattern: "list", defaultArea: "operations" },
  { type: "asset", segment: "assets", label: "Asset visual", plural: "Assets", description: "Recursos visuais e modelos de apoio.", icon: ImageIcon, pattern: "grid", defaultArea: "institutional" },
];

const BY_TYPE = new Map(ITEM_TYPES.map((t) => [t.type, t]));
const BY_SEGMENT = new Map(ITEM_TYPES.map((t) => [t.segment, t]));

export const typeDef = (type: ItemType): ItemTypeDef => BY_TYPE.get(type)!;
export const typeBySegment = (segment: string): ItemTypeDef | undefined =>
  BY_SEGMENT.get(segment);
export const itemHref = (item: { type: ItemType; slug: string }) =>
  `/ferramentas/${typeDef(item.type).segment}/${item.slug}/`;
export const typeHref = (type: ItemType) => `/ferramentas/${typeDef(type).segment}/`;
