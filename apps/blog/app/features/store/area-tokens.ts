import {
  BarChart3,
  Cog,
  Landmark,
  Newspaper,
  Sparkles,
  LayoutGrid,
  Wrench,
  type LucideIcon,
} from "lucide-react";

import type { AreaId } from "./types/store";

/**
 * Area registry (ADR-STORE-ROUTES-UI-001). Colour is only a marker: it always ships with the
 * label and icon. Class names are literal so Tailwind can see them; values live in
 * `--area-*` tokens (src/styles/global.css) — never hex here.
 */
export interface AreaDef {
  id: AreaId;
  label: string;
  icon: LucideIcon;
  /** text/icon colour */
  text: string;
  /** icon-container background */
  subtle: string;
  /** 2px accent bar / dot */
  bar: string;
  /** border-left marker */
  border: string;
}

export const AREAS: Record<AreaId, AreaDef> = {
  institutional: {
    id: "institutional",
    label: "Institucional",
    icon: Landmark,
    text: "text-area-institutional",
    subtle: "bg-area-institutional-subtle",
    bar: "bg-area-institutional",
    border: "border-l-area-institutional",
  },
  editorial: {
    id: "editorial",
    label: "Artigos",
    icon: Newspaper,
    text: "text-area-editorial",
    subtle: "bg-area-editorial-subtle",
    bar: "bg-area-editorial",
    border: "border-l-area-editorial",
  },
  skills: {
    id: "skills",
    label: "Skills",
    icon: Sparkles,
    text: "text-area-skills",
    subtle: "bg-area-skills-subtle",
    bar: "bg-area-skills",
    border: "border-l-area-skills",
  },
  operations: {
    id: "operations",
    label: "Operações",
    icon: Cog,
    text: "text-area-operations",
    subtle: "bg-area-operations-subtle",
    bar: "bg-area-operations",
    border: "border-l-area-operations",
  },
  tools: {
    id: "tools",
    label: "Ferramentas",
    icon: Wrench,
    text: "text-area-tools",
    subtle: "bg-area-tools-subtle",
    bar: "bg-area-tools",
    border: "border-l-area-tools",
  },
  data: {
    id: "data",
    label: "Dados",
    icon: BarChart3,
    text: "text-area-data",
    subtle: "bg-area-data-subtle",
    bar: "bg-area-data",
    border: "border-l-area-data",
  },
  store: {
    id: "store",
    label: "Catálogo",
    icon: LayoutGrid,
    text: "text-area-store",
    subtle: "bg-area-store-subtle",
    bar: "bg-area-store",
    border: "border-l-area-store",
  },
};

export const AREA_ORDER: AreaId[] = [
  "institutional",
  "editorial",
  "skills",
  "operations",
  "tools",
  "data",
];
