import { ITEM_TYPES, itemHref, typeHref } from "./item-types";
import { listItems } from "./repository";

/** Every static Ferramentas URL (ex-Loja, ADR-14) (prerender + sitemap): hub, one catalog per type, one detail per item. */
export const STORE_PATHS: string[] = [
  "/ferramentas/",
  ...ITEM_TYPES.map((t) => typeHref(t.type)),
  ...listItems().map(itemHref),
];
