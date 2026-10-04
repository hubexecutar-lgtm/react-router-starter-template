export type AreaId =
  | "institutional"
  | "editorial"
  | "skills"
  | "store"
  | "data"
  | "operations"
  | "tools";

export type ItemType =
  | "skill"
  | "agent"
  | "prompt"
  | "ebook"
  | "pdf"
  | "html"
  | "workbook"
  | "asset";

/** Provisional contract (DEV-STORE-ROUTES-001); replaced when final schemas exist. */
export interface StoreItem {
  id: string;
  slug: string;
  type: ItemType;
  name: string;
  area: AreaId;
  description: string;
  /** Longer context shown in the detail view. */
  context: string;
  tags: string[];
  problem: string;
  /** Exactly three steps. */
  process: [ProcessStep, ProcessStep, ProcessStep];
  progress: { plan: string; do: string; check: string; act: string };
  input: string;
  output: string;
  references: { label: string; note: string }[];
  cta: { label: string; target: string };
  featured?: boolean;
}

export interface ProcessStep {
  index: 1 | 2 | 3;
  label: string;
}

export type CatalogStatus = "loading" | "ready" | "error";
