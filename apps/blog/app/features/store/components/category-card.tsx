import { AREAS } from "../area-tokens";
import { typeDef, typeHref } from "../data/item-types";
import type { ItemType } from "../types/store";

import { cn } from "@/lib/utils";

/** Categoria do catálogo como tile compacto do Editorial Hybrid v4 (ADR-22). */
export function CategoryCard({ type, count }: { type: ItemType; count: number }) {
  const def = typeDef(type);
  const area = AREAS[def.defaultArea];
  return (
    <a href={typeHref(type)} className="group hy-tile hy-tile--compact h-full no-underline focus-visible:ring-ring/50 outline-none focus-visible:ring-[3px]">
      <span className="hy-eyebrow flex items-center gap-2">
        <span className={cn("size-2.5 shrink-0 rounded-full", area.bar)} aria-hidden="true" />
        {count} {count === 1 ? "item de exemplo" : "itens de exemplo"}
      </span>
      <span className="text-foreground mt-2 text-[length:var(--hy-card-title)] leading-[1.15] font-medium tracking-[-0.02em]">{def.plural}</span>
      <span className="text-muted-foreground mt-3 line-clamp-2 text-[17px] leading-[1.647]">{def.description}</span>
      <span className="hy-more mt-auto pt-6 group-hover:underline" aria-hidden="true">
        Ver categoria ↗
      </span>
    </a>
  );
}
