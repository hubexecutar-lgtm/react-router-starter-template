// Acesso ao banco editorial canônico (app/data/editorial/seed.json).
// O mesmo JSON alimenta o Hub Editorial (public/hub-editorial/seed.js, gerado no prebuild),
// as páginas de temas, evidências, busca e os metadados dos artigos.
import data from "@/data/editorial/seed.json";

type Row = Record<string, string | number>;

export interface Territory {
  id: string;
  name: string;
  /** Rótulo curto para filtros e chips: `Fatores`, `Exposição`… */
  short: string;
  /** Slug sem barras: `risco-cognitivo`. Rota pública: `/temas/<slug>/`. */
  slug: string;
  role: string;
  question: string;
  includes: string[];
  notToConfuse: string[];
  notes: string;
  order: number;
}

export interface Evidence {
  id: string;
  contentId: string;
  argumentId: string;
  author: string;
  institution: string;
  date: string;
  title: string;
  type: string;
  url: string;
  supports: string;
  epistemicClass: string;
  status: string;
  notes: string;
}

export interface Argument {
  id: string;
  contentId: string;
  order: number;
  role: string;
  claim: string;
  epistemicClass: string;
  evidenceIds: string[];
  limit: string;
}

const seed = data.seed as unknown as Record<string, Row[]>;
const list = (v: unknown) =>
  String(v ?? "")
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean);

export const TERRITORIES: Territory[] = seed.taxonomy.map((t, i) => ({
  id: String(t.Taxonomy_ID),
  name: String(t.Rota_pilar),
  short: i === 0 ? "Risco cognitivo" : String(t.Rota_pilar).split(" ")[0],
  slug: String(t.Slug).replace(/^\/|\/$/g, ""),
  role: String(t.Funcao),
  question: String(t.Pergunta_central),
  includes: list(t.Inclui),
  notToConfuse: list(t.Nao_confundir),
  notes: String(t.Notas ?? ""),
  order: i + 1,
}));

export const EVIDENCE: Evidence[] = seed.evidence.map((e) => ({
  id: String(e.Evidence_ID),
  contentId: String(e.Content_ID ?? ""),
  argumentId: String(e.Argument_ID ?? ""),
  author: String(e.Autor ?? ""),
  institution: String(e.Instituicao ?? ""),
  date: String(e.Data ?? ""),
  title: String(e.Titulo ?? ""),
  type: String(e.Tipo ?? ""),
  url: String(e.URL ?? ""),
  supports: String(e.O_que_sustenta ?? ""),
  epistemicClass: String(e.Classe ?? ""),
  status: String(e.Status ?? ""),
  notes: String(e.Notas ?? ""),
}));

export const ARGUMENTS: Argument[] = seed.arguments.map((a) => ({
  id: String(a.Argument_ID),
  contentId: String(a.Content_ID),
  order: Number(a.Ordem),
  role: String(a.Secao_funcao ?? ""),
  claim: String(a.Claim ?? ""),
  epistemicClass: String(a.Classe ?? ""),
  evidenceIds: list(a.Evidence_ID),
  limit: String(a.Limite_cautela ?? ""),
}));

export const territoryBySlug = (slug?: string) => TERRITORIES.find((t) => t.slug === slug);
export const territoryHref = (t: Pick<Territory, "slug">) => `/temas/${t.slug}/`;
export const evidenceById = (id: string) => EVIDENCE.find((e) => e.id === id);
export const evidenceFor = (ids: string[] = []) =>
  ids.map(evidenceById).filter((e): e is Evidence => Boolean(e));
export const argumentsFor = (contentId?: string) =>
  ARGUMENTS.filter((a) => a.contentId === contentId).sort((a, b) => a.order - b.order);

/** Ano da evidência (o banco guarda AAAA ou AAAA-MM-DD). */
export const evidenceYear = (e: Evidence) => e.date.slice(0, 4);
