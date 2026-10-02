// Tabela de evidências do banco (padrão STORE-WIREFRAMES / ADR-09). Sem dados ilustrativos.
import { ArrowUpRight } from "lucide-react";

import { type Evidence, evidenceYear } from "@/lib/editorial";

export function EvidenceTable({
	items,
	caption,
	compact = false,
}: {
	items: Evidence[];
	caption: string;
	compact?: boolean;
}) {
	return (
		<div className="overflow-x-auto" role="region" aria-label={caption} tabIndex={0}>
			<table className="ds-table w-full min-w-[40rem] text-left text-sm">
				<caption className="sr-only">{caption}</caption>
				<thead>
					<tr>
						<th scope="col">ID</th>
						<th scope="col">Fonte</th>
						{!compact && <th scope="col">Tipo</th>}
						<th scope="col">Ano</th>
						{!compact && <th scope="col">O que sustenta</th>}
					</tr>
				</thead>
				<tbody>
					{items.map((e) => (
						<tr key={e.id} id={e.id}>
							<td className="whitespace-nowrap">
								<code>{e.id}</code>
							</td>
							<td>
								<a href={e.url} rel="noopener" className="inline-flex items-start gap-1 font-medium">
									<span>{e.title}</span>
									<ArrowUpRight className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
								</a>
								<span className="text-muted-foreground mt-1 block">
									{e.author} · {e.institution}
								</span>
							</td>
							{!compact && (
								<td>
									{e.type}
									<span className="text-muted-foreground block text-xs">{e.epistemicClass}</span>
								</td>
							)}
							<td>
								<code>{evidenceYear(e)}</code>
							</td>
							{!compact && <td className="text-muted-foreground">{e.supports}</td>}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
