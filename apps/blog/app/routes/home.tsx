// Landing (mood boards 01 e 02). Copy da marca + artigos, territórios e evidências do banco.
// Composição AUD-WEB-001 (referência developer.apple.com/programs): abertura centralizada com a arte
// abaixo → painel da missão → destaque em duas colunas → faixas alternadas → comparação final com
// ações. Matriz e medidas em docs/audit/aud-web-001/.
import { ArrowRight, Search } from "lucide-react";

import type { Route } from "./+types/home";

import { ArticleCard } from "@/components/editorial/ArticleCard";
import { HeroArt, IMAGES } from "@/components/editorial/HeroArt";
import { TerritoryCard } from "@/components/editorial/TerritoryCard";
import { ChevronLink } from "@/components/layout/ChevronLink";
import { CompareCards } from "@/components/layout/CompareCards";
import { Section } from "@/components/layout/Section";
import { AsciiDiagram, PlainTextPanel } from "@/components/plain";
import { buttonVariants } from "@/components/ui/button";
import { SITE_DESCRIPTION, SITE_TAGLINE } from "@/consts";
import { ACCESS_OPTIONS } from "@/data/access";
import { ANALYSIS_TEMPLATE, FRAMEWORK_DIAGRAM } from "@/data/editorial/framework";
import DefaultLayout from "@/layouts/DefaultLayout";
import { EVIDENCE, TERRITORIES, evidenceYear } from "@/lib/editorial";
import { getPosts } from "@/lib/posts.server";
import { seo } from "@/lib/seo";
import { cn } from "@/lib/utils";

export function loader() {
	return { posts: getPosts() };
}

export const meta: Route.MetaFunction = ({ location }) =>
	seo({ description: SITE_DESCRIPTION, pathname: location.pathname });

/** Referências-padrão-ouro dos Quick Frameworks (notas do banco). */
const keyRefs = EVIDENCE.filter((e) => e.notes.startsWith("Referência padrão-ouro"));

export default function Page({ loaderData }: Route.ComponentProps) {
	const { posts } = loaderData;
	const [featured, ...rest] = posts;
	const recent = rest.slice(0, 3);
	const countBy = (slug: string) => posts.filter((p) => p.territory.slug === slug).length;

	return (
		<DefaultLayout>
			{/* Abertura — título, lead curto, ações e arte abaixo, centralizados (AUD-WEB-001-02/03) */}
			<section className="container py-[var(--section-pad-y)]" aria-labelledby="hero-title">
				<div className="flex flex-col items-center gap-6 text-center">
					<h1 id="hero-title" className="rc-display text-[length:var(--text-hero)] leading-[0.92] uppercase">
						Risco Cognitivo
					</h1>
					<p className="rc-title text-[length:var(--text-hero-lead)] leading-snug font-medium">{SITE_TAGLINE}</p>
					<p className="rc-lead mx-auto text-lg">
						Como atenção, memória e julgamento participam da formação do risco no trabalho — e como
						identificar, controlar e acompanhar esse risco antes do erro.
					</p>
					<div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
						<a href="/blog/" className={cn(buttonVariants({ size: "lg" }), "gap-2")}>
							Explorar artigos <ArrowRight className="size-4" aria-hidden="true" />
						</a>
						<ChevronLink href="/about/">Sobre o projeto</ChevronLink>
					</div>
					<form action="/buscar/" method="get" role="search" className="relative w-full max-w-md">
						<label htmlFor="home-search" className="sr-only">
							Buscar no blog
						</label>
						<Search
							className="text-muted-foreground pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2"
							aria-hidden="true"
						/>
						<input
							id="home-search"
							name="q"
							type="search"
							placeholder="Buscar no blog…"
							className="border-input bg-background focus-visible:ring-ring/50 focus-visible:border-ring h-11 w-full rounded-lg border pr-3 pl-10 text-base outline-none focus-visible:ring-[3px]"
						/>
					</form>
				</div>
				<HeroArt image={IMAGES.binoculo} seed={3} wide className="mt-[var(--section-pad-y)] w-full" />
			</section>

			{/* Missão — painel arredondado centralizado (AUD-WEB-001-06) */}
			<section className="container mt-[var(--section-pad-y)]" aria-labelledby="missao">
				<div className="rc-cell rc-surface flex flex-col items-center px-6 py-[var(--section-pad-y)] text-center">
					<p className="rc-eyebrow">Missão</p>
					<h2 id="missao" className="rc-title mt-3 max-w-[24ch] text-[length:var(--text-h2)]">
						Transformar conhecimento aplicado em estrutura para decisões melhores.
					</h2>
					<ChevronLink href="/about/" className="mt-6">
						Conheça o projeto
					</ChevronLink>
				</div>
			</section>

			{/* Destaque — texto e modelo lado a lado (AUD-WEB-001-07) */}
			<section
				className="container mt-[var(--space-section)] grid items-start gap-10 lg:grid-cols-[1.5fr_1fr] lg:gap-16 [&>*]:min-w-0"
				aria-label="Destaque"
			>
				{featured && <ArticleCard post={featured} variant="feature" headingLevel={2} />}
				<aside>
					<p className="rc-eyebrow mb-3 flex items-center justify-between">
						<span>Modelo em destaque</span>
						<span>01</span>
					</p>
					<PlainTextPanel
						id="MODEL-RISK-ANALYSIS-001"
						kind="instruction"
						title="Modelo"
						source={ANALYSIS_TEMPLATE}
						density="compact"
						fontSize="sm"
					/>
				</aside>
			</section>

			{/* Recentes */}
			<Section
				id="recentes"
				eyebrow="Artigos recentes"
				title="Continue pelo framework"
				link={{ href: "/blog/", label: "Ver todos os artigos" }}
				align="center"
				band
			>
				<div className="grid gap-[var(--table-gap)] md:grid-cols-3">
					{recent.map((post) => (
						<ArticleCard key={post.id} post={post} variant="compact" />
					))}
				</div>
			</Section>

			{/* Territórios */}
			<Section
				id="territorios"
				eyebrow="Temas"
				title="Oito territórios, um só modelo"
				link={{ href: "/temas/", label: "Ver mapa de temas" }}
				align="center"
			>
				<div className="grid gap-[var(--table-gap)] sm:grid-cols-2 lg:grid-cols-4">
					{TERRITORIES.map((t) => (
						<TerritoryCard key={t.id} territory={t} count={countBy(t.slug)} />
					))}
				</div>
			</Section>

			{/* Referências — tabela de largura inteira numa faixa (AUD-WEB-001-08) */}
			<Section
				id="referencias"
				eyebrow="Referências-chave"
				title="Fontes que sustentam o método"
				link={{ href: "/evidencias/", label: "Todas as evidências" }}
				align="center"
				band
			>
				<div className="sm:overflow-x-auto" role="region" aria-labelledby="referencias" tabIndex={0}>
					<table className="ds-table ds-table--stack w-full text-left text-sm sm:min-w-[28rem]">
						<caption className="sr-only">Referências-padrão-ouro usadas nos artigos</caption>
						<thead>
							<tr>
								<th scope="col">Tema</th>
								<th scope="col">Autor / fonte</th>
								<th scope="col">Ano</th>
							</tr>
						</thead>
						<tbody>
							{keyRefs.map((e) => {
								const t = posts.find((p) => p.contentId === e.contentId);
								return (
									<tr key={e.id}>
										<td data-label="Tema">
											<div>{t ? <a href={t.href}>{t.territory.name}</a> : e.contentId}</div>
										</td>
										<td data-label="Fonte">
											<div>
												<a href={e.url} rel="noopener">
													{e.author}
												</a>
											</div>
										</td>
										<td data-label="Ano">
											<code>{evidenceYear(e)}</code>
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			</Section>

			{/* Mapa conceitual — diagrama de largura inteira (AUD-WEB-001-08) */}
			<Section
				id="framework"
				eyebrow="Mapa conceitual"
				title="Como os elementos se conectam"
				link={{ href: "/mapas/", label: "Explorar o mapa" }}
				align="center"
			>
				<AsciiDiagram id="MAP-FRAMEWORK-001" kind="flowchart" title="Framework de Risco Cognitivo" source={FRAMEWORK_DIAGRAM} />
			</Section>

			{/* Comparação final com ações (AUD-WEB-001-11) */}
			<Section
				id="acesso"
				eyebrow="Acesso e formatos"
				title="Leitura aberta e produtos do ecossistema"
				lead="Todos os artigos, mapas, guias e evidências do blog são de leitura livre, sem cadastro. Outros formatos derivam dos mesmos artigos."
				link={{ href: "/pricing/", label: "Ver acesso e formatos" }}
				align="center"
				band
			>
				<CompareCards options={ACCESS_OPTIONS} />
			</Section>
		</DefaultLayout>
	);
}
