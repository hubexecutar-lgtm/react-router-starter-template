// Barra da Home (handoff): categorias à esquerda (a ativa em preto, as demais em cinza) e ordenação à direita.
// Estado serializado na URL (?categoria=&ordem=). Filtro por tópicos e alternância grade/lista do handoff
// ficam fora: o conteúdo atual não tem tópicos e o estado de lista não foi validado na referência.
import { cn } from "@/lib/utils";

export type SortKey = "date_desc" | "date_asc" | "title_asc" | "title_desc";

const LABEL: Record<SortKey, string> = {
	date_desc: "Mais recentes",
	date_asc: "Mais antigos",
	title_asc: "A–Z",
	title_desc: "Z–A",
};

export function StoriesToolbar({
	categories,
	active,
	sort,
	sorts,
	onCategory,
	onSort,
}: {
	categories: string[];
	/** Categoria ativa; "" = Tudo. */
	active: string;
	sort: SortKey;
	sorts: SortKey[];
	onCategory: (category: string) => void;
	onSort: (sort: SortKey) => void;
}) {
	const tab = (label: string, value: string) => (
		<button
			key={value || "all"}
			type="button"
			aria-pressed={active === value}
			onClick={() => onCategory(value)}
			className={cn(
				"stories-body focus-visible:ring-ring/50 min-h-8 rounded-[var(--ref-control-radius)] outline-none focus-visible:ring-[3px]",
				active === value ? "text-foreground" : "text-muted-foreground hover:text-foreground",
			)}
		>
			{label}
		</button>
	);
	return (
		<div className="flex min-h-10 flex-wrap items-center justify-between gap-x-6 gap-y-3" data-stories-toolbar>
			<div className="flex flex-wrap items-center gap-x-6">
				{tab("Tudo", "")}
				{categories.map((c) => tab(c, c))}
			</div>
			<label className="text-foreground flex items-center gap-2 text-sm font-medium">
				<span>Classificar</span>
				<select
					value={sort}
					onChange={(e) => onSort(e.target.value as SortKey)}
					className="border-input bg-background focus-visible:ring-ring/50 h-10 rounded-[var(--ref-control-radius)] border px-3 text-sm font-medium outline-none focus-visible:ring-[3px]"
				>
					{sorts.map((k) => (
						<option key={k} value={k}>
							{LABEL[k]}
						</option>
					))}
				</select>
			</label>
		</div>
	);
}
