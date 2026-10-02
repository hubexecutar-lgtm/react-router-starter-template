// Acesso e formatos (URL /pricing/ preservada): o conteúdo é aberto; formatos e status
// vêm do banco editorial (vocab.canal e ativos derivados). Nenhum preço inventado.
import type { Route } from "./+types/pricing";

import { PageHero } from "@/components/editorial/PageHero";
import { SURFACE } from "@/components/editorial/surface";
import seed from "@/data/editorial/seed.json";
import DefaultLayout from "@/layouts/DefaultLayout";
import { getPosts } from "@/lib/posts.server";
import { seo } from "@/lib/seo";
import { cn } from "@/lib/utils";

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
			<section className="container grid gap-10 lg:grid-cols-[1fr_20rem] lg:gap-14 [&>*]:min-w-0">
				<div className="overflow-x-auto" role="region" aria-label="Canais e formatos" tabIndex={0}>
					<table className="ds-table w-full min-w-[34rem] text-left text-sm">
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
									<td className="font-medium">{c.canal}</td>
									<td>{c.formatos}</td>
									<td className="text-muted-foreground">{c.status}</td>
								</tr>
							))}
						</tbody>
					</table>
					<p className="text-muted-foreground mt-3 text-sm">Fonte: banco editorial (Hub Editorial), canais e ativos derivados.</p>
				</div>
				<aside className={cn(SURFACE, "p-6")}>
					<p className="rc-eyebrow">Produtos</p>
					<p className="rc-title mt-3 text-xl">Skills, modelos e ferramentas</p>
					<p className="text-muted-foreground mt-2 text-sm">Materiais do ecossistema EXECUTAR ficam no catálogo da loja.</p>
					<a href="/loja/" className="rc-link mt-4 inline-block">
						Ver a loja
					</a>
				</aside>
			</section>
		</DefaultLayout>
	);
}
