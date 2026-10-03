// Acesso e formatos (URL /pricing/ preservada): o conteúdo é aberto; formatos e status
// vêm do banco editorial (vocab.canal e ativos derivados). Nenhum preço inventado.
import type { Route } from "./+types/pricing";

import { PageHero } from "@/components/editorial/PageHero";
import { CompareCards } from "@/components/layout/CompareCards";
import { Section } from "@/components/layout/Section";
import { ACCESS_OPTIONS } from "@/data/access";
import seed from "@/data/editorial/seed.json";
import DefaultLayout from "@/layouts/DefaultLayout";
import { getPosts } from "@/lib/posts.server";
import { seo } from "@/lib/seo";

export function loader() {
	const published = getPosts().length;
	const assets = seed.seed.assets as { Canal: string; Formato: string; Status: string }[];
	const channels = (seed.vocab.canal as string[]).map((canal) => {
		if (canal === "Blog") return { canal, formatos: "Artigos e ensaios", status: `Ativo · ${published} publicados` };
		const items = assets.filter((a) => a.Canal === canal);
		const formatos = [...new Set(items.map((a) => a.Formato))].join(", ");
		const status = items.length
			? `${items.length} peça(s) em ${[...new Set(items.map((a) => a.Status.toLowerCase()))].join(", ")}`
			: "Sem peças planejadas";
		return { canal, formatos: formatos || "—", status };
	});
	return { channels };
}

export const meta: Route.MetaFunction = ({ location }) =>
	seo({
		title: "Acesso e formatos",
		description: "O conteúdo do Risco Cognitivo é aberto. Veja os canais e formatos previstos no banco editorial.",
		pathname: location.pathname,
	});

export default function Page({ loaderData }: Route.ComponentProps) {
	return (
		<DefaultLayout>
			<PageHero
				eyebrow="Acesso e formatos"
				title="Conteúdo aberto, em vários formatos"
				lead="Todos os artigos, mapas, guias e evidências do blog são de leitura livre, sem cadastro. Outros formatos derivam dos mesmos artigos."
			/>
			<Section id="comparar" eyebrow="Explore os formatos" title="Leitura aberta e produtos do ecossistema">
				<CompareCards options={ACCESS_OPTIONS} />
			</Section>

			<Section id="canais" eyebrow="Canais" title="Formatos previstos no banco editorial" lead="Fonte: banco editorial (Hub Editorial), canais e ativos derivados.">
				<div className="sm:overflow-x-auto" role="region" aria-label="Canais e formatos" tabIndex={0}>
					<table className="ds-table ds-table--stack w-full text-left text-sm sm:min-w-[34rem]">
						<caption className="sr-only">Canais e formatos do banco editorial</caption>
						<thead>
							<tr>
								<th scope="col">Canal</th>
								<th scope="col">Formatos</th>
								<th scope="col">Status</th>
							</tr>
						</thead>
						<tbody>
							{loaderData.channels.map((c) => (
								<tr key={c.canal}>
									<td className="font-medium" data-label="Canal">
										<div>{c.canal}</div>
									</td>
									<td data-label="Formatos">
										<div>{c.formatos}</div>
									</td>
									<td className="text-muted-foreground" data-label="Status">
										<div>{c.status}</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</Section>
		</DefaultLayout>
	);
}
