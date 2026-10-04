// Carrossel com scroll-snap do v7 (LANC-001 RQ-026): rolagem horizontal nativa, botões anterior/próximo
// (≥ 44px) e itens alcançáveis por Tab. Sem rotação automática: só o leitor move o carrossel.
import { Children, useRef, type ReactNode } from "react";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

const control =
	"inline-flex size-11 items-center justify-center rounded-full border border-[var(--input)] bg-background transition-colors hover:bg-[var(--surface-hover)] focus-visible:ring-ring/50 outline-none focus-visible:ring-[3px]";

export function Carousel({ id, label, children, className }: { id: string; label: string; children: ReactNode; className?: string }) {
	const track = useRef<HTMLDivElement>(null);
	const step = (dir: 1 | -1) => {
		const el = track.current;
		if (!el) return;
		const list = el.querySelector("ul")!;
		const item = list.querySelector<HTMLElement>(":scope > li");
		const gap = parseFloat(getComputedStyle(list).columnGap) || 0;
		el.scrollBy({ left: dir * ((item?.offsetWidth ?? el.clientWidth) + gap), behavior: "smooth" });
	};

	return (
		<div className={cn("min-w-0", className)} data-carousel>
			<div
				ref={track}
				id={id}
				role="region"
				aria-label={label}
				tabIndex={0}
				className="snap-x snap-mandatory overflow-x-auto scroll-smooth pb-2 outline-none [scrollbar-width:none] focus-visible:ring-ring/50 focus-visible:ring-[3px] [&::-webkit-scrollbar]:hidden"
			>
				<ul className="flex w-max gap-[var(--table-gap)]">
					{Children.map(children, (child) => (
						<li className="w-[min(80vw,18rem)] shrink-0 snap-start">{child}</li>
					))}
				</ul>
			</div>
			<div className="mt-4 flex justify-end gap-2">
				<button type="button" className={control} aria-controls={id} onClick={() => step(-1)}>
					<ChevronLeft className="size-5" aria-hidden="true" />
					<span className="sr-only">Anterior</span>
				</button>
				<button type="button" className={control} aria-controls={id} onClick={() => step(1)}>
					<ChevronRight className="size-5" aria-hidden="true" />
					<span className="sr-only">Próximo</span>
				</button>
			</div>
		</div>
	);
}
