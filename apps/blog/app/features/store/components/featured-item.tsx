import { ArrowRight } from "lucide-react";

import { AreaBadge } from "./area-badge";
import { AREAS } from "../area-tokens";
import { itemHref, typeDef } from "../data/item-types";
import type { StoreItem } from "../types/store";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";


export function FeaturedItem({ item }: { item: StoreItem }) {
  const area = AREAS[item.area];
  const type = typeDef(item.type);
  const TypeIcon = type.icon;
  return (
    <Card className={cn("border-l-4", area.border)}>
      <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <span className={cn("flex size-12 shrink-0 items-center justify-center rounded-xl", area.subtle, area.text)}>
          <TypeIcon className="size-6" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-medium">{item.name}</h3>
          <p className="text-muted-foreground mt-1 text-sm">{item.description}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            <AreaBadge area={item.area} />
            {item.tags.map((t) => (
              <Badge key={t} variant="outline">
                {t}
              </Badge>
            ))}
          </div>
        </div>
        <Button asChild className="sm:self-center">
          <a href={itemHref(item)}>
            Abrir
            <ArrowRight aria-hidden="true" />
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}
