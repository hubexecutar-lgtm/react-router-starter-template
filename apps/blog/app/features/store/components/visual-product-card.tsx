import { AREAS } from "../area-tokens";
import { itemHref, typeDef } from "../data/item-types";
import type { StoreItem } from "../types/store";

import { cn } from "@/lib/utils";

/** Card de item (E-books, PDFs, Workbooks…) como tile do Editorial Hybrid v4 (ADR-22): capa, tipo, nome, descrição e ação. */
export function VisualProductCard({ item }: { item: StoreItem }) {
  const area = AREAS[item.area];
  const type = typeDef(item.type);
  const TypeIcon = type.icon;
  return (
    <a
      href={itemHref(item)}
      data-testid="store-item"
      data-type={item.type}
      className="group hy-tile hy-tile--compact h-full !p-0 overflow-hidden no-underline focus-visible:ring-ring/50 outline-none focus-visible:ring-[3px]"
    >
      <span className="relative flex aspect-[4/3] w-full items-center justify-center bg-[var(--surface-tabular)]">
        <span className={cn("absolute inset-x-0 top-0 h-1", area.bar)} aria-hidden="true" />
        <span className={cn("flex size-14 items-center justify-center rounded-xl", area.subtle, area.text)}>
          <TypeIcon className="size-7" aria-hidden="true" />
        </span>
        <span className="text-foreground absolute bottom-2 left-3 text-xs font-medium">Capa de exemplo</span>
      </span>
      <span className="flex flex-1 flex-col p-8">
        <span className="hy-eyebrow">
          {type.label}
          {item.tags[0] ? ` · ${item.tags[0]}` : ""}
        </span>
        <span className="text-foreground mt-2 text-[length:var(--hy-card-title)] leading-[1.15] font-medium tracking-[-0.02em]">{item.name}</span>
        <span className="text-muted-foreground mt-3 line-clamp-2 text-[17px] leading-[1.647]">{item.description}</span>
        <span className="hy-more mt-auto pt-6 group-hover:underline" aria-hidden="true">
          Abrir ↗
        </span>
        <span className="sr-only">Abrir {item.name}</span>
      </span>
    </a>
  );
}
