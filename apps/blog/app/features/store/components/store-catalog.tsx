import { useCallback, useEffect, useMemo, useState } from "react";


import { CatalogSection } from "./catalog-section";
import { CatalogEmpty, CatalogError, CatalogSkeleton } from "./catalog-states";
import { CategoryCard } from "./category-card";
import { FeaturedItem } from "./featured-item";
import { SkillCard } from "./skill-card";
import { StoreHeader } from "./store-header";
import { VisualProductCard } from "./visual-product-card";
import { AREAS } from "../area-tokens";
import { ITEM_TYPES, typeBySegment, typeDef, typeHref } from "../data/item-types";
import { filterItems } from "../lib/filter-items";
import type { AreaId, CatalogStatus, ItemType, StoreItem } from "../types/store";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ALL_TAB = "todos";

/**
 * Store shell + catalog. One island for /ferramentas and /ferramentas/{type}; the route only decides
 * `lockedType`. `?estado=carregando|erro` previews the LOADING/ERROR states (mock phase).
 */
export function StoreCatalog({
  items,
  lockedType,
}: {
  items: StoreItem[];
  lockedType?: ItemType;
}) {
  const [q, setQ] = useState("");
  const [type, setType] = useState<ItemType | null>(lockedType ?? null);
  const [area, setArea] = useState<AreaId | null>(null);
  const [status, setStatus] = useState<CatalogStatus>("ready");
  const [hydrated, setHydrated] = useState(false);

  // Read filters from the URL once on the client.
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    setQ(p.get("q") ?? "");
    const t = p.get("tipo");
    if (!lockedType && t) setType(typeBySegment(t)?.type ?? null);
    const a = p.get("area");
    if (a && a in AREAS) setArea(a as AreaId);
    const s = p.get("estado");
    setStatus(s === "carregando" ? "loading" : s === "erro" ? "error" : "ready");
    setHydrated(true);
  }, [lockedType]);

  // Mirror filters to the URL (shareable, back-button safe with replaceState).
  useEffect(() => {
    if (!hydrated) return;
    const p = new URLSearchParams(window.location.search);
    const set = (k: string, v: string | null) => (v ? p.set(k, v) : p.delete(k));
    set("q", q.trim() || null);
    set("tipo", !lockedType && type ? typeDef(type).segment : null);
    set("area", area);
    const qs = p.toString();
    window.history.replaceState(null, "", window.location.pathname + (qs ? `?${qs}` : ""));
  }, [q, type, area, lockedType, hydrated]);

  const results = useMemo(() => filterItems(items, { q, type, area }), [items, q, type, area]);
  const isHub = !q.trim() && !type && !area && !lockedType;
  const filtered = Boolean(q.trim() || area);

  const clear = useCallback(() => {
    setQ("");
    setArea(null);
    if (!lockedType) setType(null);
  }, [lockedType]);

  const retry = useCallback(() => {
    const url = new URL(window.location.href);
    url.searchParams.delete("estado");
    window.history.replaceState(null, "", url);
    setStatus("ready");
  }, []);

  const onTab = (value: string) => {
    if (lockedType) {
      window.location.assign(value === ALL_TAB ? "/ferramentas/" : typeHref(value as ItemType));
      return;
    }
    setType(value === ALL_TAB ? null : (value as ItemType));
  };

  const def = lockedType ? typeDef(lockedType) : null;
  const count = (t: ItemType) => items.filter((i) => i.type === t).length;
  const featured = items.find((i) => i.featured);
  const grouped = ITEM_TYPES.map((t) => ({
    def: t,
    list: results.filter((i) => i.type === t.type),
  })).filter((g) => g.list.length > 0);

  const renderList = (list: StoreItem[], pattern: "list" | "grid") =>
    pattern === "list" ? (
      <div className="grid gap-3 md:grid-cols-2">
        {list.map((i) => (
          <SkillCard key={i.id} item={i} />
        ))}
      </div>
    ) : (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((i) => (
          <VisualProductCard key={i.id} item={i} />
        ))}
      </div>
    );

  return (
    <div className="min-w-0">
      <StoreHeader
        title={def ? def.plural : "Ferramentas cognitivas"}
        description={def ? def.description : "Recursos para apoiar a execução do trabalho cognitivo."}
        query={q}
        onQuery={setQ}
        area={area}
        onArea={setArea}
        searchLabel={def ? `Buscar em ${def.plural}` : "Buscar ferramentas"}
      />

      <Tabs value={type ?? ALL_TAB} onValueChange={onTab} className="mt-6">
        <ScrollArea className="w-full">
          <TabsList aria-label="Tipo de item" className="h-auto w-max justify-start">
            <TabsTrigger value={ALL_TAB} className="min-h-9 px-3">
              Todos
            </TabsTrigger>
            {ITEM_TYPES.map((t) => (
              <TabsTrigger key={t.type} value={t.type} className="min-h-9 px-3">
                {t.plural}
              </TabsTrigger>
            ))}
          </TabsList>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        <TabsContent value={type ?? ALL_TAB} className="mt-2">
          {status === "loading" && <CatalogSkeleton />}
          {status === "error" && <CatalogError onRetry={retry} />}
          {status === "ready" && (
            <>
              <p className="sr-only" role="status" aria-live="polite">
                {results.length} {results.length === 1 ? "resultado" : "resultados"}
              </p>

              {isHub ? (
                <>
                  <CatalogSection id="categorias" title="Categorias">
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {ITEM_TYPES.filter((t) => count(t.type) > 0).map((t) => (
                        <CategoryCard key={t.type} type={t.type} count={count(t.type)} />
                      ))}
                    </div>
                  </CatalogSection>

                  {featured && (
                    <CatalogSection id="destaque" title="Destaque">
                      <FeaturedItem item={featured} />
                    </CatalogSection>
                  )}

                  <CatalogSection
                    id="skills"
                    title="Skills"
                    href={typeHref("skill")}
                    hrefLabel="Ver todas"
                  >
                    {renderList(items.filter((i) => i.type === "skill").slice(0, 4), "list")}
                  </CatalogSection>

                  <CatalogSection id="ebooks" title="E-books" href={typeHref("ebook")}>
                    {renderList(items.filter((i) => i.type === "ebook"), "grid")}
                  </CatalogSection>
                </>
              ) : results.length === 0 ? (
                <CatalogEmpty filtered={filtered} onClear={clear} />
              ) : (
                grouped.map((g) => (
                  <CatalogSection
                    key={g.def.type}
                    id={`grupo-${g.def.type}`}
                    title={g.def.plural}
                    href={lockedType ? undefined : typeHref(g.def.type)}
                  >
                    {renderList(g.list, g.def.pattern)}
                  </CatalogSection>
                ))
              )}
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
