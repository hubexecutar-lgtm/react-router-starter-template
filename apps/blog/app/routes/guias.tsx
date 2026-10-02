// Guias e ferramentas (mood board 07): transformar leitura em próxima ação.
// Os passos vêm do "Next 01-02-03" de cada artigo; nada de exemplo fictício.
import { ArrowRight, BookOpen, FileText, HelpCircle, LayoutGrid, ListChecks, Wrench } from "lucide-react";

import type { Route } from "./+types/guias";

import { SURFACE } from "@/components/editorial/surface";
import { PlainTextPanel } from "@/components/plain";
import { buttonVariants } from "@/components/ui/button";
import { ANALYSIS_TEMPLATE } from "@/data/editorial/framework";
import DefaultLayout from "@/layouts/DefaultLayout";
import { getPostViewsWithBody } from "@/lib/posts.server";
import { seo } from "@/lib/seo";
import { cn } from "@/lib/utils";

export function loader() {
	const posts = getPostViewsWithBody();
	const steps = [...posts]
		.sort((a, b) => a.territory.order - b.territory.order)
		.flatMap((p) => {
			const m = p.body.match(/\*\*Next 01 — Entender:\*\*\s*(.+)/);
			return m ? [{ text: m[1].trim(), href: p.href, territory: p.territory.short }] : [];
		});
	return { steps, firstHref: posts.find((p) => p.contentId === "CNT-RC-0001")?.href ?? null };
}

export const meta: Route.MetaFunction = ({ location }) =>
	seo({
		title: "Guias e ferramentas",
		description:
			"Guias e ferramentas para aplicar o framework de risco cognitivo: modelo de análise, primeiros passos e como ler um Quick Framework.",
		pathname: location.pathname,
	});

export default function Page({ loaderData }: Route.ComponentProps) {
	const { steps, firstHref } = loaderData;
	const start = [
		{ label: "O que é risco cognitivo?", href: firstHref ?? "/blog/", icon: FileText },
		{ label: "Mapa de temas", href: "/temas/", icon: LayoutGrid },
		{ label: "Evidências e fontes", href: "/evidencias/", icon: BookOpen },
		{ label: "Perguntas frequentes", href: "/faq/", icon: HelpCircle },
	];

	return (
		<DefaultLayout>
			<section className="container pt-12 pb-10 lg:pt-20" aria-labelledby="guias-title">
				<p className="rc-eyebrow">Guias e ferramentas</p>
				<h1 id="guias-title" className="rc-display mt-4 text-5xl sm:text-6xl lg:text-7xl">
					Transforme leitura em próxima ação.
				</h1>
				<p className="rc-lead mt-5 max-w-3xl text-lg sm:text-xl">
					Cada artigo termina em três passos — Entender, Estruturar, Executar. Aqui eles viram ferramentas para
					aplicar o framework a uma tarefa real.
				</p>
			</section>

			<div className="container grid gap-10 lg:grid-cols-[1fr_20rem] lg:gap-12 [&>*]:min-w-0">
				<div className="grid content-start gap-4 md:grid-cols-2">
					<article className={cn(SURFACE, "flex flex-col p-6")}>
						<p className="rc-eyebrow flex items-center justify-between">
							<span className="flex items-center gap-2">
								<BookOpen className="text-primary size-4" aria-hidden="true" /> Guia
							</span>
							<span>01</span>
						</p>
						<h2 className="rc-title mt-4 text-2xl">Como ler um Quick Framework</h2>
						<p className="text-muted-foreground mt-3 leading-relaxed">
							Os artigos seguem a mesma ordem: contexto, 5W2H, referência, problema existente e solucionado,
							processo, visão do sistema, progresso, aviso, próximos passos e fontes.
						</p>
						{firstHref && (
							<a href={firstHref} className="rc-link mt-auto inline-flex items-center gap-1.5 pt-6">
								Acessar guia <ArrowRight className="size-4" aria-hidden="true" />
							</a>
						)}
					</article>

					<article className={cn(SURFACE, "flex flex-col p-6")}>
						<p className="rc-eyebrow flex items-center justify-between">
							<span className="flex items-center gap-2">
								<ListChecks className="text-primary size-4" aria-hidden="true" /> Guia
							</span>
							<span>02</span>
						</p>
						<h2 className="rc-title mt-4 text-2xl">Primeiros passos por território</h2>
						<p className="text-muted-foreground mt-3 leading-relaxed">O “Next 01 — Entender” de cada artigo.</p>
						<ol className="mt-4 flex flex-col gap-3">
							{steps.map((s) => (
								<li
									key={s.href}
									className="bg-background rounded-[var(--radius-md)] border border-[var(--border-default)] p-3 text-sm"
								>
									<span className="rc-eyebrow text-primary block">{s.territory}</span>
									<a href={s.href} className="mt-1 block hover:underline">
										{s.text}
									</a>
								</li>
							))}
						</ol>
					</article>

					<article className={cn(SURFACE, "flex flex-col p-6 md:col-span-2")}>
						<p className="rc-eyebrow flex items-center justify-between">
							<span className="flex items-center gap-2">
								<Wrench className="text-primary size-4" aria-hidden="true" /> Ferramenta
							</span>
							<span>03</span>
						</p>
						<h2 className="rc-title mt-4 text-2xl">Modelo de análise</h2>
						<p className="text-muted-foreground mt-3 leading-relaxed">Copie e preencha para uma tarefa crítica.</p>
						<div className="mt-4">
							<PlainTextPanel
								id="TOOL-RISK-ANALYSIS-001"
								kind="instruction"
								title="Modelo"
								source={ANALYSIS_TEMPLATE}
								density="compact"
								fontSize="sm"
							/>
						</div>
						<a href="/mapas/" className="rc-link mt-auto inline-flex items-center gap-1.5 pt-6">
							Usar com o mapa <ArrowRight className="size-4" aria-hidden="true" />
						</a>
					</article>
				</div>

				<aside className={cn(SURFACE, "flex flex-col gap-8 self-start p-6")}>
					<div>
						<p className="rc-eyebrow">Receba novos guias</p>
						<p className="rc-title mt-3 text-xl">Conteúdo prático no seu leitor</p>
						<p className="text-muted-foreground mt-2 text-sm">
							A newsletter ainda não tem provedor definido. Enquanto isso, acompanhe pelo feed RSS.
						</p>
						<a href="/rss.xml" className={cn(buttonVariants(), "mt-4 w-full")}>
							Assinar o feed RSS
						</a>
						<a href="/signup/" className="rc-link mt-3 block text-center text-sm">
							Sobre a newsletter
						</a>
					</div>
					<nav aria-labelledby="comece">
						<p id="comece" className="rc-eyebrow">
							Comece por aqui
						</p>
						<ul className="mt-3 divide-y divide-[var(--border-default)]">
							{start.map(({ label, href, icon: Icon }) => (
								<li key={label}>
									<a href={href} className="hover:text-primary flex min-h-12 items-center gap-3 text-[0.95rem]">
										<Icon className="size-4 shrink-0" aria-hidden="true" />
										<span className="flex-1">{label}</span>
										<ArrowRight className="size-4" aria-hidden="true" />
									</a>
								</li>
							))}
						</ul>
					</nav>
				</aside>
			</div>
		</DefaultLayout>
	);
}
