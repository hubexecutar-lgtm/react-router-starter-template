import { ChevronRight } from "lucide-react";

import { AREAS } from "../area-tokens";
import { itemHref, typeDef } from "../data/item-types";
import type { StoreItem } from "../types/store";

import { Badge } from "@/components/ui/badge";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { cn } from "@/lib/utils";


/** PLUGIN-LIKE row: icon + name + short description + tags + action (Skills, Agents, Prompts). */
export function SkillCard({ item }: { item: StoreItem }) {
  const area = AREAS[item.area];
  const type = typeDef(item.type);
  const TypeIcon = type.icon;
  return (
    <Item
      asChild
      variant="outline"
      className={cn("border-l-4 bg-card", area.border)}
    >
      <a href={itemHref(item)} data-testid="store-item" data-type={item.type}>
        <ItemMedia variant="icon" className={cn(area.subtle, area.text)}>
          <TypeIcon aria-hidden="true" />
        </ItemMedia>
        <ItemContent className="min-w-0">
          <ItemTitle>{item.name}</ItemTitle>
          <ItemDescription>{item.description}</ItemDescription>
          <div className="mt-1 flex flex-wrap gap-1.5">
            <Badge variant="secondary">{type.label}</Badge>
            {item.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        </ItemContent>
        <ItemActions>
          <ChevronRight className="text-muted-foreground size-4" aria-hidden="true" />
          <span className="sr-only">Abrir {item.name}</span>
        </ItemActions>
      </a>
    </Item>
  );
}
