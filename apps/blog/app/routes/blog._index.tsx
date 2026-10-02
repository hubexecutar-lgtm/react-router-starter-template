import { useState } from "react";

import type { Route } from "./+types/blog._index";

import { buttonVariants } from "@/components/ui/button";
import DefaultLayout from "@/layouts/DefaultLayout";
import { getPostsWithBody } from "@/lib/content.server";
import { seo } from "@/lib/seo";
import { cn } from "@/lib/utils";

const ARTICLE = "/blog/do-risco-cognitivo-a-execucao-assistida/";

const readingTime = (body = "") =>
	Math.max(1, Math.ceil(body.replace(/<[^>]+>/g, " ").trim().split(/\s+/).length / 200));

export function loader() {
	const posts = getPostsWithBody()
		.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
		.map(({ body, ...post }) => ({ ...post, minutes: readingTime(body) }));
	return { posts };
}

export const meta: Route.MetaFunction = ({ location }) =>
	seo({
		title: "Risco Cognitivo",
		description: "Compreender riscos. Redesenhar processos. Apoiar a execução.",
		pathname: location.pathname,
	});

const dateFmt = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric" });

const filters = [
	{ id: "todos", label: "Todos" },
	{ id: "riscos", label: "Riscos" },
	{ id: "processos", label: "Processos" },
	{ id: "ferramentas", label: "Ferramentas" },
	{ id: "metodo", label: "Método" },
];

const territories = [
	{ title: "Riscos Cognitivos", subtitle: "Reconhecer a exposição", href: `${ARTICLE}#riscos`, image: "/about/1.webp", category: "riscos" },
	{ title: "Processos Neuroadaptativos", subtitle: "Redesenhar o trabalho", href: `${ARTICLE}#processos`, image: "/about/2.webp", category: "processos" },
	{ title: "Ferramentas & Execução", subtitle: "Demonstrar a aplicação", href: `${ARTICLE}#ferramentas`, image: "/about/3.webp", category: "ferramentas" },
	{ title: "Níveis de consciência", subtitle: "Descoberta, compreensão e decisão", href: `${ARTICLE}#consciencia`, image: "/about/4.webp", category: "metodo" },
];

export default function BlogIndex({ loaderData }: Route.ComponentProps) {
	const [featured, ...rest] = loaderData.posts;
	const more = rest.slice(0, 3);
	const older = rest.slice(3);
	const [filter, setFilter] = useState("todos");

	return (
		<DefaultLayout>
			{/* Hero */}
			<section className="container max-w-5xl pt-32 pb-16 lg:pt-44 lg:pb-24">
				<div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
					<div className="max-w-xl">
						<h1 className="text-3xl tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
							Compreender riscos, redesenhar o{" "}
							<span className="text-primary decoration-primary/40 underline decoration-wavy decoration-2 underline-offset-8">trabalho</span>
						</h1>
						<p className="text-muted-foreground mt-6 text-lg font-medium">
							Compreender o problema. Redesenhar o trabalho. Criar condições para executar.
							Os três pilares do Risco Cognitivo.
						</p>
						<a href={ARTICLE} className={cn(buttonVariants({ size: "lg" }), "mt-8")}>
							Conhecer a tese
						</a>
					</div>

					<div className="grid grid-cols-5 grid-rows-2 gap-3 sm:gap-4">
						<img
							src="/blog/do-risco-cognitivo-a-execucao-assistida/hero.jpg"
							alt="Uma pessoa sustenta uma enorme tecla Ctrl amarela."
							className="col-span-3 row-span-2 aspect-[4/5] w-full rounded-2xl border object-cover"
							width="1080"
							height="1350"
						/>
						<img src="/about/1.webp" alt="" className="col-span-2 h-full w-full rounded-2xl border object-cover" loading="lazy" />
						<img src="/about/2.webp" alt="" className="col-span-2 h-full w-full rounded-2xl border object-cover" loading="lazy" />
					</div>
				</div>
			</section>

			{/* Territórios */}
			<section className="container max-w-5xl py-12 lg:py-16" aria-labelledby="territorios-title">
				<h2 id="territorios-title" className="text-primary text-4xl font-medium">Territórios</h2>

				<div className="mt-6 flex flex-wrap items-center justify-between gap-4">
					<div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar territórios">
						{filters.map((f) => (
							<button
								key={f.id}
								type="button"
								data-filter={f.id}
								aria-pressed={filter === f.id ? "true" : "false"}
								onClick={() => setFilter(f.id)}
								className={cn(buttonVariants({ variant: "outline", size: "sm" }), "aria-pressed:border-foreground aria-pressed:bg-foreground aria-pressed:text-background aria-pressed:hover:bg-foreground/90 aria-pressed:hover:text-background")}
							>
								{f.label}
							</button>
						))}
					</div>
					<a href={ARTICLE} className={cn(buttonVariants({ variant: "outline" }), "hidden md:inline-flex")}>
						Explorar todos os territórios
					</a>
				</div>

				<div className="-mx-6 mt-8 flex snap-x snap-mandatory scroll-px-6 gap-4 overflow-x-auto px-6 pb-2 md:mx-0 md:grid md:grid-cols-4 md:overflow-visible md:px-0">
					{territories.map((t) => (
						<a
							key={t.category}
							href={t.href}
							data-category={t.category}
							hidden={filter !== "todos" && t.category !== filter}
							className="group w-[75%] shrink-0 snap-start md:w-auto"
						>
							<div className="overflow-hidden rounded-2xl border">
								<img
									src={t.image}
									alt=""
									loading="lazy"
									className="aspect-[4/5] w-full object-cover transition-transform duration-300 group-hover:scale-105"
								/>
							</div>
							<p className="mt-3 text-lg font-medium">{t.title}</p>
							<p className="text-muted-foreground text-sm">{t.subtitle}</p>
						</a>
					))}
				</div>

				<a href={ARTICLE} className={cn(buttonVariants({ variant: "outline" }), "mx-auto mt-8 flex w-fit md:hidden")}>
					Explorar todos os territórios
				</a>
			</section>

			{/* Últimos artigos */}
			{featured && (
				<section className="container max-w-5xl py-12 lg:py-16" aria-labelledby="artigos-title">
					<div className="flex items-center justify-between gap-4">
						<h2 id="artigos-title" className="text-primary text-4xl font-medium">Últimos artigos</h2>
						{older.length > 0 && (
							<a href="#mais-artigos" className={cn(buttonVariants({ variant: "outline" }), "hidden md:inline-flex")}>
								Ver todos os artigos
							</a>
						)}
					</div>

					<div className="mt-8 grid gap-8 lg:grid-cols-12">
						<a href={`/blog/${featured.id}/`} className="group lg:col-span-7">
							{featured.data.image && (
								<div className="overflow-hidden rounded-2xl border">
									<img src={featured.data.image} alt="" className="aspect-video w-full object-cover transition-transform duration-300 group-hover:scale-105" />
								</div>
							)}
							<p className="text-primary mt-4 text-sm font-medium">{featured.data.authorName ?? "Artigo"}</p>
							<h3 className="mt-1 text-2xl font-medium tracking-tight group-hover:underline">{featured.data.title}</h3>
							<p className="text-muted-foreground mt-2 text-sm">
								{dateFmt.format(featured.data.pubDate)} · {featured.minutes} min de leitura
							</p>
							<p className="text-muted-foreground mt-3 line-clamp-3 text-lg font-medium">{featured.data.description}</p>
						</a>

						<ul className="flex flex-col gap-6 lg:col-span-5">
							{more.map((post) => (
								<li key={post.id}>
									<a href={`/blog/${post.id}/`} className="group flex gap-4">
										{post.data.image && (
											<img src={post.data.image} alt="" loading="lazy" className="size-24 shrink-0 rounded-2xl border object-cover" />
										)}
										<div>
											<p className="text-primary text-xs font-medium">{post.data.authorName ?? "Artigo"}</p>
											<h3 className="mt-1 line-clamp-3 text-lg leading-snug font-medium group-hover:underline">{post.data.title}</h3>
											<p className="text-muted-foreground mt-1 text-xs">
												{dateFmt.format(post.data.pubDate)} · {post.minutes} min de leitura
											</p>
										</div>
									</a>
								</li>
							))}
						</ul>
					</div>

					{older.length > 0 && (
						<a href="#mais-artigos" className={cn(buttonVariants({ variant: "outline" }), "mx-auto mt-8 flex w-fit md:hidden")}>
							Ver todos os artigos
						</a>
					)}
				</section>
			)}

			{older.length > 0 && (
				<section id="mais-artigos" className="container max-w-5xl scroll-mt-24 py-12 lg:py-16" aria-labelledby="mais-artigos-title">
					<h2 id="mais-artigos-title" className="text-primary text-4xl font-medium">Mais artigos</h2>
					<ul className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
						{older.map((post) => (
							<li key={post.id}>
								<a href={`/blog/${post.id}/`} className="group block">
									{post.data.image && (
										<div className="overflow-hidden rounded-2xl border">
											<img src={post.data.image} alt="" loading="lazy" className="aspect-video w-full object-cover transition-transform duration-300 group-hover:scale-105" />
										</div>
									)}
									<p className="text-primary mt-4 text-xs font-medium">{post.data.authorName ?? "Artigo"}</p>
									<h3 className="mt-1 text-lg font-medium group-hover:underline">{post.data.title}</h3>
									<p className="text-muted-foreground mt-1 text-xs">
										{dateFmt.format(post.data.pubDate)} · {post.minutes} min de leitura
									</p>
								</a>
							</li>
						))}
					</ul>
				</section>
			)}

			{/* Destaques */}
			<section className="container max-w-5xl py-12 lg:py-16" aria-labelledby="destaques-title">
				<h2 id="destaques-title" className="text-primary text-4xl font-medium">Destaques</h2>

				<div className="mt-8 grid gap-6 lg:grid-cols-12">
					<figure className="bg-card rounded-2xl border p-6 lg:col-span-5">
						<div className="flex items-center gap-3">
							<span className="bg-foreground text-background flex size-10 items-center justify-center rounded-full font-semibold">R</span>
							<div>
								<p className="font-medium">Risco Cognitivo</p>
								<p className="text-muted-foreground text-sm">Manifesto editorial</p>
							</div>
						</div>
						<blockquote className="text-primary mt-6 text-2xl leading-snug font-medium">
							“A adaptação também precisa acontecer no sistema de trabalho.”
						</blockquote>
						<p className="text-muted-foreground mt-4 text-lg font-medium">
							Quando o trabalho exige que alguém sustente sozinho toda a complexidade, pedir mais esforço pode deixar
							o problema intacto.
						</p>
						<a href={ARTICLE} className="text-primary mt-4 inline-block text-sm font-medium hover:underline">Ler o manifesto</a>
					</figure>

					<a href="/hub-editorial/" className="group relative overflow-hidden rounded-2xl border lg:col-span-4">
						<img src="/about/3.webp" alt="" loading="lazy" className="h-full min-h-64 w-full object-cover transition-transform duration-300 group-hover:scale-105" />
						<span className="bg-background/85 absolute inset-x-3 bottom-3 rounded-xl px-4 py-3 text-sm font-medium backdrop-blur">
							Hub Editorial
						</span>
					</a>

					<div className="flex flex-col gap-4 lg:col-span-3">
						<a href="/skills/" className="group relative flex-1 overflow-hidden rounded-2xl border">
							<img src="/about/4.webp" alt="" loading="lazy" className="h-full min-h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105" />
							<span className="bg-background/85 absolute inset-x-3 bottom-3 rounded-xl px-4 py-3 text-sm font-medium backdrop-blur">
								Catálogo de Skills EXECUTAR
							</span>
						</a>
						<a href="/admin" className={cn(buttonVariants({ variant: "outline" }), "self-end")}>
							Ver todos os destaques
						</a>
					</div>
				</div>
			</section>

			{/* Chamada: acompanhar novos artigos */}
			<section className="relative mt-12 overflow-hidden">
				<img src="/about/2.webp" alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
				<div className="absolute inset-0 bg-black/60"></div>
				<div className="relative container max-w-5xl py-20 text-center text-white lg:py-28">
					<h2 className="mx-auto max-w-2xl text-4xl font-medium text-balance">
						Acompanhe os novos artigos do Risco Cognitivo
					</h2>
					<p className="mx-auto mt-4 max-w-xl text-lg font-medium text-white/80">
						Assine o feed RSS no seu leitor ou fale com a gente para receber novidades.
					</p>
					<div className="mt-8 flex flex-wrap justify-center gap-3">
						<a href="/rss.xml" className={buttonVariants({ size: "lg" })}>
							Assinar via RSS
						</a>
						<a href="/contact" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "text-foreground")}>
							Fale conosco
						</a>
					</div>
				</div>
			</section>
		</DefaultLayout>
	);
}
