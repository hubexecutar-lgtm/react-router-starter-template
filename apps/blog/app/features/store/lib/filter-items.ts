import { AREAS } from "../area-tokens";
import { typeDef } from "../data/item-types";
import type { AreaId, ItemType, StoreItem } from "../types/store";

export interface CatalogFilters {
  q: string;
  type: ItemType | null;
  area: AreaId | null;
}

const normalize = (s: string) =>
  s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

const haystack = (item: StoreItem) =>
  normalize(
    [
      item.name,
      item.description,
      item.tags.join(" "),
      typeDef(item.type).label,
      typeDef(item.type).plural,
      AREAS[item.area].label,
    ].join(" "),
  );

/** name, description, tags, type and area — every term must match (AND). */
export function filterItems(items: StoreItem[], f: CatalogFilters): StoreItem[] {
  const terms = normalize(f.q).split(/\s+/).filter(Boolean);
  return items.filter(
    (item) =>
      (!f.type || item.type === f.type) &&
      (!f.area || item.area === f.area) &&
      terms.every((t) => haystack(item).includes(t)),
  );
}
