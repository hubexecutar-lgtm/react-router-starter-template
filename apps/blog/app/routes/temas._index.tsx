// Mapa de temas (mood board 09): os 8 territórios TAX-RC do banco editorial.
import type { Route } from "./+types/temas._index";

import { PageHero } from "@/components/editorial/PageHero";
import { SectionHeader } from "@/components/editorial/SectionHeader";
import { TerritoryCard } from "@/components/editorial/TerritoryCard";
import { AsciiDiagram } from "@/components/plain";
import { TERRITORY_TREE } from "@/data/editorial/framework";
import DefaultLayout from "@/layouts/DefaultLayout";
import { TERRITORIES } from "@/lib/editorial";
import { getPosts } from "@/lib/posts.server";
import { seo } from "@/lib/seo";

export function loader() {
	const posts = getPosts();
	return {
		counts: Object.fromEntries(
			TERRITORIES.map((t) => [t.slug, posts.filter((p) => p.territory.slug === t.slug).length]),
		),
	};
}

export const meta: Route.MetaFunction = ({ location }) =>
	seo({
		title: "Temas",
		description:
			"Os oito territórios do Risco Cognitivo: fenômeno, fatores, exposição, eventos, controles, indicadores, gestão e framework.",
		pathname: location.pathname,
	});

export default function Page({ loaderData }: Route.ComponentProps) {
	const { counts } = loaderData;
	return (
		<DefaultLayout>
			<PageHero
				id="temas-title"
				eyebrow="Explorar"
				title="Mapa de temas"
				lead="Navegue pelos territórios do blog e veja como eles se conectam. Cada tema responde a uma pergunta e reúne os artigos que tratam dela."
				seed={13}
			/>

			<section className="container grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-14 [&>*]:min-w-0" aria-labelledby="territorios-title">
				<h2 id="territorios-title" className="sr-only">
					Territórios
				</h2>
				<div>
					<AsciiDiagram id="MAP-TERRITORIES-001" kind="tree" title="Territórios do Risco Cognitivo" source={TERRITORY_TREE} />
				</div>
				<div className="grid gap-4 sm:grid-cols-2">
					{TERRITORIES.map((t) => (
						<TerritoryCard key={t.id} territory={t} count={counts[t.slug]} />
					))}
				</div>
			</section>

			<section className="container mt-16" aria-labelledby="conexoes">
				<SectionHeader
					id="conexoes"
					eyebrow="Conexões"
					title="Do fator ao indicador"
					href="/mapas/"
					linkLabel="Ver o mapa do framework"
				/>
				<p className="text-muted-foreground mt-4 max-w-3xl">
					Os territórios seguem uma cadeia: fatores aumentam a probabilidade, a exposição diz quando eles passam a
					importar, eventos registram o que aconteceu, controles reduzem probabilidade ou impacto, indicadores
					mostram se os controles funcionam e a gestão fecha o ciclo.
				</p>
			</section>
		</DefaultLayout>
	);
}
