// Landing (mood boards 01 e 02). Copy da marca + artigos, territórios e evidências do banco.
import { ArrowRight, Search } from "lucide-react";

import type { Route } from "./+types/home";

import { ArticleCard } from "@/components/editorial/ArticleCard";
import { SectionHeader } from "@/components/editorial/SectionHeader";
import { SURFACE } from "@/components/editorial/surface";
import { TerritoryCard } from "@/components/editorial/TerritoryCard";
import { AsciiDiagram, PlainTextPanel } from "@/components/plain";
import { buttonVariants } from "@/components/ui/button";
import { SITE_DESCRIPTION, SITE_TAGLINE } from "@/consts";
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
			{/* Hero */}
			<section className="container pt-12 pb-12 lg:pt-20 lg:pb-16" aria-labelledby="hero-title">
				<div className="grid gap-10 lg:grid-cols-[1.5fr_1fr] lg:gap-16 [&>*]:min-w-0">
					<div>
						<h1 id="hero-title" className="rc-display text-[clamp(3.25rem,11vw,8.5rem)] leading-[0.86] uppercase">
							Risco
							<br />
							Cognitivo
						</h1>
						<p className="rc-lead mt-6 text-[clamp(1.5rem,3.2vw,2.5rem)] leading-tight">{SITE_TAGLINE}</p>
					</div>
					<div className="flex flex-col justify-end gap-6">
						<p className="rc-lead text-lg sm:text-xl">
							Como atenção, memória e julgamento participam da formação do risco no trabalho — e como
							identificar, controlar e acompanhar esse risco antes do erro.
						</p>
						<div className="flex flex-wrap items-center gap-x-6 gap-y-3">
							<a href="/blog/" className={cn(buttonVariants({ size: "lg" }), "gap-2")}>
								Explorar artigos <ArrowRight className="size-4" aria-hidden="true" />
							</a>
							<a href="/about/" className="rc-link">
								Sobre o projeto
							</a>
						</div>
						<form action="/buscar/" method="get" role="search" className="relative">
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
								className="border-input bg-background focus-visible:ring-ring/50 focus-visible:border-ring h-11 w-full rounded-md border pr-3 pl-10 text-base outline-none focus-visible:ring-[3px]"
							/>
						</form>
					</div>
				</div>
			</section>

			{/* Destaque + missão */}
			<section className="container grid gap-10 pb-16 lg:grid-cols-[1.5fr_1fr] lg:gap-16 [&>*]:min-w-0" aria-label="Destaque">
				{featured && <ArticleCard post={featured} variant="feature" headingLevel={2} />}
				<aside className="flex flex-col gap-6">
					<div className={cn(SURFACE, "p-6")}>
						<p className="rc-eyebrow flex items-center justify-between">
							<span>Missão</span>
							<span>01</span>
						</p>
						<p className="rc-title mt-4 text-2xl font-medium">
							Transformar conhecimento aplicado em estrutura para decisões melhores.
						</p>
					</div>
					<div>
						<p className="rc-eyebrow mb-3 flex items-center justify-between">
							<span>Modelo em destaque</span>
							<span>02</span>
						</p>
						<PlainTextPanel
							id="MODEL-RISK-ANALYSIS-001"
							kind="instruction"
							title="Modelo"
							source={ANALYSIS_TEMPLATE}
							density="compact"
							fontSize="sm"
						/>
					</div>
				</aside>
			</section>

			{/* Recentes */}
			<section className="container pb-16" aria-labelledby="recentes">
				<SectionHeader
					id="recentes"
					eyebrow="Artigos recentes"
					title="Continue pelo framework"
					href="/blog/"
					linkLabel="Ver todos os artigos"
				/>
				<div className="mt-8 grid gap-4 md:grid-cols-3">
					{recent.map((post) => (
						<ArticleCard key={post.id} post={post} variant="compact" />
					))}
				</div>
			</section>

			{/* Territórios */}
			<section className="container pb-16" aria-labelledby="territorios">
				<SectionHeader
					id="territorios"
					eyebrow="Temas"
					title="Oito territórios, um só modelo"
					href="/temas/"
					linkLabel="Ver mapa de temas"
				/>
				<div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
					{TERRITORIES.map((t) => (
						<TerritoryCard key={t.id} territory={t} count={countBy(t.slug)} />
					))}
				</div>
			</section>

			{/* Framework + referências */}
			<section
				className="container grid gap-10 pb-8 lg:grid-cols-[1.2fr_1fr] lg:gap-16 [&>*]:min-w-0"
				aria-labelledby="framework"
			>
				<div>
					<SectionHeader
						id="framework"
						eyebrow="Mapa conceitual"
						title="Como os elementos se conectam"
						href="/mapas/"
						linkLabel="Explorar o mapa"
					/>
					<div className="mt-8">
						<AsciiDiagram
							id="MAP-FRAMEWORK-001"
							kind="flowchart"
							title="Framework de Risco Cognitivo"
							source={FRAMEWORK_DIAGRAM}
						/>
					</div>
				</div>
				<div>
					<SectionHeader
						id="referencias"
						eyebrow="Referências-chave"
						title="Fontes que sustentam o método"
						href="/evidencias/"
						linkLabel="Todas as evidências"
						level={2}
					/>
					<div className="mt-8 overflow-x-auto" role="region" aria-labelledby="referencias" tabIndex={0}>
						<table className="ds-table w-full min-w-[28rem] text-left text-sm">
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
											<td>{t ? <a href={t.href}>{t.territory.name}</a> : e.contentId}</td>
											<td>
												<a href={e.url} rel="noopener">
													{e.author}
												</a>
											</td>
											<td>
												<code>{evidenceYear(e)}</code>
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>
				</div>
			</section>
		</DefaultLayout>
	);
}
