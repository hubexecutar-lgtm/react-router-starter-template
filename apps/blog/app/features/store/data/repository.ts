import { typeDef } from "./item-types";
import { MOCK_ITEMS } from "./mock-items";
import type { ItemType, StoreItem } from "../types/store";

/**
 * Single access point to catalog data. Swap the body of these functions when the real
 * backend/schemas exist; components and routes must not import mock-items directly.
 */
export const listItems = (): StoreItem[] => MOCK_ITEMS;

export const listItemsByType = (type: ItemType): StoreItem[] =>
  listItems().filter((item) => item.type === type);

export const getItem = (type: ItemType, slug: string): StoreItem | undefined =>
  listItems().find((item) => item.type === type && item.slug === slug);

export const featuredItem = (): StoreItem | undefined =>
  listItems().find((item) => item.featured);

export const typeLabel = (type: ItemType) => typeDef(type).label;
