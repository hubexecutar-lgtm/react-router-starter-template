
import { AREAS } from "../area-tokens";
import { typeDef, typeHref } from "../data/item-types";
import type { ItemType } from "../types/store";

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function CategoryCard({ type, count }: { type: ItemType; count: number }) {
  const def = typeDef(type);
  const area = AREAS[def.defaultArea];
  return (
    <a
      href={typeHref(type)}
      className="group focus-visible:ring-ring/50 block rounded-xl outline-none focus-visible:ring-[3px]"
    >
      <Card className="group-hover:border-foreground/30 h-full gap-2 py-4 transition-colors">
        <CardHeader className="gap-1 px-4">
          <CardTitle className="flex items-center gap-2">
            <span className={cn("size-2.5 shrink-0 rounded-full", area.bar)} aria-hidden="true" />
            {def.plural}
          </CardTitle>
          <CardDescription className="line-clamp-2">{def.description}</CardDescription>
          <p className="text-muted-foreground-subtle mt-1 text-xs">
            {count} {count === 1 ? "item de exemplo" : "itens de exemplo"}
          </p>
        </CardHeader>
      </Card>
    </a>
  );
}
