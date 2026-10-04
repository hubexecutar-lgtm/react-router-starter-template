import { ArrowLeft } from "lucide-react";


import { AreaBadge } from "./area-badge";
import {
  BoundedText,
  ItemFlowchart,
  PrimaryCTA,
  ProblemCard,
  ProcessCard,
  ProgressCard,
  ReferenceDisclosure,
} from "./detail-cards";
import { AREAS } from "../area-tokens";
import { typeDef, typeHref } from "../data/item-types";
import type { StoreItem } from "../types/store";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

/** REPORT-LIKE detail: identity + how it works (left); Problem, Process, Progress (right). */
export function ItemDetail({ item }: { item: StoreItem }) {
  const area = AREAS[item.area];
  const type = typeDef(item.type);
  const TypeIcon = type.icon;
  return (
    <article>
      <Button asChild variant="ghost" size="sm" className="-ml-3">
        <a href={typeHref(item.type)}>
          <ArrowLeft aria-hidden="true" />
          Voltar para {type.plural}
        </a>
      </Button>

      <header className="mt-4">
        <h1 className="text-3xl tracking-tight sm:text-4xl">{item.name}</h1>
        <div className="mt-3 flex flex-wrap gap-1.5">
          <AreaBadge area={item.area} />
          <Badge variant="secondary">{type.label}</Badge>
          {item.tags.map((t) => (
            <Badge key={t} variant="outline">
              {t}
            </Badge>
          ))}
        </div>
      </header>

      <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-12">
        <div className="min-w-0 space-y-8">
          <div
            className={cn("flex size-20 items-center justify-center rounded-2xl", area.subtle, area.text)}
            data-testid="item-symbol"
          >
            <TypeIcon className="size-10" aria-hidden="true" />
          </div>
          <div className="space-y-3">
            <p className="text-lg">{item.description}</p>
            <BoundedText label="Contexto">{item.context}</BoundedText>
          </div>
          <Separator />
          <ItemFlowchart item={item} />
        </div>

        <div className="min-w-0 space-y-8 lg:col-start-2 lg:row-span-2 lg:row-start-1">
          <ProblemCard item={item} />
          <ProcessCard item={item} />
          <ProgressCard item={item} />
        </div>

        {/* mobile: after Progress (DETAIL_MOBILE); desktop: bottom of the left column */}
        <div className="min-w-0 lg:col-start-1 lg:row-start-2">
          <ReferenceDisclosure item={item} />
        </div>
      </div>

      <Separator className="mt-10" />
      <div className="mt-6 flex justify-end">
        <PrimaryCTA item={item} />
      </div>
    </article>
  );
}
