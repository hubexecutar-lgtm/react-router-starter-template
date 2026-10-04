import { ArrowRight } from "lucide-react";

import { AREAS } from "../area-tokens";
import { itemHref, typeDef } from "../data/item-types";
import type { StoreItem } from "../types/store";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";


/** CONNECTOR-LIKE card: cover + name + description + tags + action (E-books, PDFs, Workbooks…). */
export function VisualProductCard({ item }: { item: StoreItem }) {
  const area = AREAS[item.area];
  const type = typeDef(item.type);
  const TypeIcon = type.icon;
  return (
    <a
      href={itemHref(item)}
      data-testid="store-item"
      data-type={item.type}
      className="group focus-visible:ring-ring/50 block rounded-xl outline-none focus-visible:ring-[3px]"
    >
      <Card className="group-hover:border-foreground/30 h-full gap-4 overflow-hidden py-0 transition-colors">
        <AspectRatio ratio={4 / 3} className="bg-muted relative flex items-center justify-center">
          <span className={cn("absolute inset-x-0 top-0 h-1", area.bar)} aria-hidden="true" />
          <span className={cn("flex size-14 items-center justify-center rounded-xl", area.subtle, area.text)}>
            <TypeIcon className="size-7" aria-hidden="true" />
          </span>
          <span className="text-muted-foreground absolute bottom-2 left-3 text-xs font-medium">
            Capa de exemplo
          </span>
        </AspectRatio>
        <CardHeader className="gap-1">
          <CardTitle className="leading-snug">{item.name}</CardTitle>
          <CardDescription className="line-clamp-2">{item.description}</CardDescription>
        </CardHeader>
        <CardContent className="mt-auto flex items-center justify-between gap-2 pb-5">
          <div className="flex flex-wrap gap-1.5">
            <Badge variant="secondary">{type.label}</Badge>
            {item.tags.slice(0, 1).map((t) => (
              <Badge key={t} variant="outline">
                {t}
              </Badge>
            ))}
          </div>
          <ArrowRight className="text-muted-foreground size-4 shrink-0" aria-hidden="true" />
          <span className="sr-only">Abrir {item.name}</span>
        </CardContent>
      </Card>
    </a>
  );
}
