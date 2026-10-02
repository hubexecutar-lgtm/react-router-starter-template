// Filtro por território (mood board 04): botões aria-pressed que escondem itens com
// [data-territory] dentro de [data-filter-scope]. Também lê ?tema=<slug> da URL.
// Sem JavaScript, todos os itens ficam visíveis e cada chip leva à página do tema.
import { useEffect, useRef } from "react";

const chip =
	"inline-flex h-10 shrink-0 items-center rounded-full px-4 text-sm font-medium whitespace-nowrap transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 " +
	"bg-[var(--surface-hover)] text-foreground hover:bg-[var(--surface-selected)] " +
	"aria-pressed:bg-primary aria-pressed:text-primary-foreground aria-pressed:hover:bg-primary/90";

export function FilterChips({ options, label }: { options: { slug: string; label: string }[]; label: string }) {
	const rootRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const root = rootRef.current;
		const scope = document.querySelector<HTMLElement>("[data-filter-scope]");
		if (!root || !scope) return;
		const chips = root.querySelectorAll<HTMLAnchorElement>("[data-chip]");
		const status = root.querySelector("[data-filter-status]");
		const apply = (slug: string, push: boolean) => {
			let shown = 0;
			chips.forEach((c) => c.setAttribute("aria-pressed", String(c.dataset.chip === slug)));
			scope.querySelectorAll<HTMLElement>("[data-territory]").forEach((item) => {
				const show = slug === "todos" || item.dataset.territory === slug;
				item.hidden = !show;
				if (show) shown += 1;
			});
			scope.querySelectorAll<HTMLElement>("[data-filter-empty]").forEach((el) => (el.hidden = shown > 0));
			if (status) status.textContent = `${shown} ${shown === 1 ? "artigo" : "artigos"}`;
			if (push) {
				const url = new URL(location.href);
				if (slug === "todos") url.searchParams.delete("tema");
				else url.searchParams.set("tema", slug);
				history.replaceState(history.state, "", url);
			}
		};
		const onClick = (e: Event) => {
			const c = (e.target as Element).closest<HTMLAnchorElement>("[data-chip]");
			if (!c) return;
			e.preventDefault();
			apply(c.dataset.chip!, true);
		};
		const onKey = (e: KeyboardEvent) => {
			const target = e.target as HTMLElement;
			if (target.matches("[data-chip]") && e.key === " ") {
				e.preventDefault();
				target.click();
			}
		};
		root.addEventListener("click", onClick);
		root.addEventListener("keydown", onKey);
		const initial = new URL(location.href).searchParams.get("tema");
		if (initial && [...chips].some((c) => c.dataset.chip === initial)) apply(initial, false);
		return () => {
			root.removeEventListener("click", onClick);
			root.removeEventListener("keydown", onKey);
		};
	}, []);

	return (
		<div ref={rootRef} className="-mx-4 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0" data-filter-chips>
			<div className="flex gap-2 sm:flex-wrap" role="group" aria-label={label}>
				<a href="?" data-chip="todos" aria-pressed="true" role="button" className={chip}>
					Todos
				</a>
				{options.map((o) => (
					<a key={o.slug} href={`/temas/${o.slug}/`} data-chip={o.slug} aria-pressed="false" role="button" className={chip}>
						{o.label}
					</a>
				))}
			</div>
			<p className="sr-only" aria-live="polite" data-filter-status></p>
		</div>
	);
}
