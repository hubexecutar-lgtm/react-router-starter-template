import { AREAS } from "../area-tokens";
import type { AreaId } from "../types/store";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";


/** Area marker: coloured icon + text label (colour is never the only cue). */
export function AreaBadge({ area, className }: { area: AreaId; className?: string }) {
  const def = AREAS[area];
  const Icon = def.icon;
  return (
    <Badge variant="outline" className={cn("gap-1.5", className)}>
      <Icon className={def.text} aria-hidden="true" />
      {def.label}
    </Badge>
  );
}
