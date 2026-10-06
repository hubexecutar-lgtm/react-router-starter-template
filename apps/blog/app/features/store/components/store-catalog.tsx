// Catálogo das Ferramentas no RC-DS-CF (ADR-26, DS-CF-001-ferramentas §1–2). Uma ilha para /ferramentas/ e
// /ferramentas/{tipo}/: a rota só decide `lockedType`. Estado na URL, lido depois da hidratação (a página é
// pré-renderizada): ?q= (busca), ?tipo= (só na home), ?area= e ?estado=carregando|erro (pré-visualização dos estados).
// Só itens reais (repository.listItems()); tipo sem item aparece como "em preparação", sem botão nem link.
import { useCallback, useEffect, useMemo, useState } from "react";

import { CatalogEmpty, CatalogError, CatalogSkeleton } from "./catalog-states";
import { AREA_ORDER, AREAS } from "../area-tokens";
import { ITEM_TYPES, itemHref, typeBySegment, typeDef } from "../data/item-types";
import { filterItems } from "../lib/filter-items";
import type { AreaId, CatalogStatus, ItemType, StoreItem } from "../types/store";

import { Card, CardGrid, Field, Input, Select } from "@/components/ds";

/** Card de item: o título é o link (DS-CF-001 §4.3); tipo e ID no eyebrow, funções nas tags. */
export function StoreItemCard({ item }: { item: StoreItem }) {
	const def = typeDef(item.type);
	return (
		<Card
			href={itemHref(item)}
			eyebrow={`${def.label} · ${item.id}`}
			title={item.name}
			text={item.description}
			meta={item.tags.join(" · ")}
			cta={item.type === "solution" ? "Ver a solução" : "Abrir"}
			data-testid="store-item"
			data-type={item.type}
		/>
	);
}

export function StoreCatalog({ items, lockedType }: { items: StoreItem[]; lockedType?: ItemType }) {
	const [q, setQ] = useState("");
	const [type, setType] = useState<ItemType | null>(lockedType ?? null);
	const [area, setArea] = useState<AreaId | null>(null);
	const [status, setStatus] = useState<CatalogStatus>("ready");
	const [hydrated, setHydrated] = useState(false);

	// Lê os filtros da URL uma vez, no cliente.
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

	// Espelha os filtros na URL (compartilhável; replaceState não suja o histórico).
	useEffect(() => {
		if (!hydrated) return;
		const p = new URLSearchParams(window.location.search);
		const set = (k: string, v: string | null) => (v ? p.set(k, v) : p.delete(k));
		set("q", q.trim() || null);
		set("tipo", !lockedType && type ? typeDef(type).segment : null);
		set("area", area);
		const qs = p.toString();
		window.history.replaceState(null, "", window.location.pathname + (qs ? `?${qs}` : "") + window.location.hash);
	}, [q, type, area, lockedType, hydrated]);

	const scoped = useMemo(() => (lockedType ? items.filter((i) => i.type === lockedType) : items), [items, lockedType]);
	const results = useMemo(() => filterItems(scoped, { q, type, area }), [scoped, q, type, area]);
	const filtered = Boolean(q.trim() || area || (!lockedType && type));

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

	const def = lockedType ? typeDef(lockedType) : null;
	const searchLabel = def ? `Buscar em ${def.plural}` : "Buscar ferramentas";
	const count = (t: ItemType) => items.filter((i) => i.type === t).length;
	// Só as áreas que têm item: um seletor com uma opção só não ajuda ninguém (?area= continua valendo).
	const areas = AREA_ORDER.filter((id) => scoped.some((i) => i.area === id));

	return (
		<div data-store-catalog>
			<form role="search" className="ds-filters" onSubmit={(e) => e.preventDefault()}>
				<div className="ds-filters-row" data-cols={areas.length > 1 ? "2" : "1"}>
					<Field label={searchLabel}>
						{({ id, describedBy }) => <Input id={id} aria-describedby={describedBy} type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Nome, função ou tipo" />}
					</Field>
					{areas.length > 1 && (
						<Field label="Filtrar por área">
							{({ id }) => (
								<Select id={id} value={area ?? ""} onChange={(e) => setArea((e.target.value || null) as AreaId | null)}>
									<option value="">Todas as áreas</option>
									{areas.map((a) => (
										<option key={a} value={a}>
											{AREAS[a].label}
										</option>
									))}
								</Select>
							)}
						</Field>
					)}
				</div>
				{!lockedType && (
					<div role="group" aria-label="Tipo de item" className="ds-filters-types" data-store-types>
						<button type="button" className="ds-chip" aria-pressed={type === null} onClick={() => setType(null)}>
							Todos <span className="ds-chip-count">{items.length}</span>
						</button>
						{ITEM_TYPES.map((t) =>
							count(t.type) ? (
								<button key={t.type} type="button" className="ds-chip" aria-pressed={type === t.type} onClick={() => setType(type === t.type ? null : t.type)}>
									{t.plural} <span className="ds-chip-count">{count(t.type)}</span>
								</button>
							) : (
								<span key={t.type} className="ds-chip" data-state="soon">
									{t.plural} <span className="ds-chip-count">em preparação</span>
								</span>
							),
						)}
					</div>
				)}
			</form>

			{status === "loading" && <CatalogSkeleton />}
			{status === "error" && <CatalogError onRetry={retry} />}
			{status === "ready" && (
				<>
					<p className="ds-filters-count" role="status" aria-live="polite" style={{ marginBottom: 16 }}>
						{results.length} {results.length === 1 ? "item publicado" : "itens publicados"}
					</p>
					{results.length === 0 ? (
						<CatalogEmpty filtered={filtered} onClear={clear} />
					) : (
						<CardGrid cols={3} label={def ? def.plural : "Itens publicados"} data-tablet="2">
							{results.map((i) => (
								<StoreItemCard key={i.id} item={i} />
							))}
						</CardGrid>
					)}
				</>
			)}
		</div>
	);
}
