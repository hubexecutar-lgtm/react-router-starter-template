import { Search } from "lucide-react";

import { AREA_ORDER, AREAS } from "../area-tokens";
import type { AreaId } from "../types/store";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


const ALL = "todas";

export function StoreHeader({
  title,
  description,
  query,
  onQuery,
  area,
  onArea,
  searchLabel,
  sample = true,
}: {
  title: string;
  description: string;
  query: string;
  onQuery: (q: string) => void;
  area: AreaId | null;
  onArea: (a: AreaId | null) => void;
  searchLabel: string;
  /** Catálogo com dados de exemplo (mock-items). As Soluções (RC-PUB-PACK-003) são conteúdo publicado. */
  sample?: boolean;
}) {
  return (
    <header>
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="stories-h2">{title}</h1>
        {sample && <Badge variant="outline">Catálogo de exemplo</Badge>}
      </div>
      <p className="text-muted-foreground mt-3 max-w-xl text-lg font-medium">{description}</p>

      <form
        role="search"
        onSubmit={(e) => e.preventDefault()}
        className="mt-8 flex flex-col gap-3 sm:flex-row"
      >
        <div className="relative flex-1">
          <Search
            className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
            aria-hidden="true"
          />
          <Input
            type="search"
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            placeholder={searchLabel}
            aria-label={searchLabel}
            className="h-10 pl-9"
          />
        </div>
        <Select
          value={area ?? ALL}
          onValueChange={(v) => onArea(v === ALL ? null : (v as AreaId))}
        >
          <SelectTrigger aria-label="Filtrar por área" className="h-10 w-full sm:w-52">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>Todas as áreas</SelectItem>
            {AREA_ORDER.map((id) => (
              <SelectItem key={id} value={id}>
                {AREAS[id].label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </form>
    </header>
  );
}
