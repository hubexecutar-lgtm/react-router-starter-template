// Mapas e modelos (mood board 05): o framework como mapa conceitual em plain text.
import { ArrowRight } from "lucide-react";

import type { Route } from "./+types/mapas";

import { SURFACE, SURFACE_LINK } from "@/components/editorial/surface";
import { AsciiDiagram } from "@/components/plain";
import { buttonVariants } from "@/components/ui/button";
import { FRAMEWORK_DIAGRAM } from "@/data/editorial/framework";
import DefaultLayout from "@/layouts/DefaultLayout";
import { getPosts } from "@/lib/posts.server";
import { seo } from "@/lib/seo";
import { cn } from "@/lib/utils";

const MODELS = [
	{ id: "CNT-RC-0008", name: "Bow tie (gravata-borboleta)", text: "Ameaças, evento central, consequências e barreiras dos dois lados." },
	{ id: "CNT-RC-0007", name: "Processo da ISO 31000", text: "Identificar, analisar, avaliar, tratar, monitorar e analisar criticamente." },
	{ id: "CNT-RC-0006", name: "Indicadores antecedentes e de resultado", text: "Um par de indicadores por controle crítico (HSG254)." },
	{ id: "CNT-RC-0004", name: "Tipos de erro de Reason", text: "Deslize, lapso, engano e violação: mecanismos diferentes." },
	{ id: "CNT-RC-0003", name: "Estresse e tensão mental (ISO 10075)", text: "Separar a demanda externa do efeito na pessoa." },
];

export function loader() {
	const posts = getPosts();
	const byId = (id: string) => posts.find((p) => p.contentId === id);
	return {
		models: MODELS.flatMap((m) => {
			const post = byId(m.id);
			return post ? [{ ...m, href: post.href }] : [];
		}),
		frameworkHref: byId("CNT-RC-0008")?.href ?? null,
	};
}

export const meta: Route.MetaFunction = ({ location }) =>
	seo({
		title: "Mapas e modelos",
		description:
			"O framework do Risco Cognitivo como mapa: fatores, exposição, eventos, consequências, controles, indicadores e gestão.",
		pathname: location.pathname,
	});

export default function Page({ loaderData }: Route.ComponentProps) {
	const { models, frameworkHref } = loaderData;
	return (
		<DefaultLayout>
			<section className="container pt-12 pb-10 lg:pt-20" aria-labelledby="mapas-title">
				<p className="rc-eyebrow">Mapas e modelos</p>
				<h1 id="mapas-title" className="rc-display mt-4 text-5xl sm:text-6xl lg:text-7xl">
					Framework de Risco Cognitivo
				</h1>
				<p className="rc-lead mt-5 max-w-3xl text-lg sm:text-xl">
					Um mapa para transformar fatores soltos em uma cadeia analisável: do que aumenta a probabilidade ao que
					reduz, mede e acompanha o risco.
				</p>
			</section>

			<section className="container grid gap-10 lg:grid-cols-[1.6fr_1fr] lg:gap-14 [&>*]:min-w-0" aria-label="Mapa conceitual">
				<div className={cn(SURFACE, "self-start p-5 sm:p-8")}>
					<div className="flex flex-wrap items-start justify-between gap-4">
						<div>
							<p className="rc-eyebrow">Mapa conceitual</p>
							<p className="rc-eyebrow text-foreground mt-1">Framework de Risco Cognitivo</p>
						</div>
						{frameworkHref && (
							<a href={frameworkHref} className={cn(buttonVariants({ size: "lg" }), "gap-2")}>
								Explorar <ArrowRight className="size-4" aria-hidden="true" />
							</a>
						)}
					</div>
					<div className="mt-6">
						<AsciiDiagram id="MAP-FRAMEWORK-002" kind="flowchart" title="Framework de Risco Cognitivo" source={FRAMEWORK_DIAGRAM} />
					</div>
				</div>

				<aside className="lg:border-l lg:border-[var(--border-default)] lg:pl-10">
					<p className="rc-eyebrow">Sobre este mapa</p>
					<p className="mt-4 text-lg leading-relaxed">
						O mapa organiza o vocabulário do blog em uma sequência. Ele adapta à cognição modelos consolidados de
						segurança e gestão de risco; essa adaptação é proposta deste projeto, não consenso científico.
					</p>
					<p className="text-muted-foreground mt-4 leading-relaxed">
						Use-o para localizar uma tarefa crítica: quais fatores incidem, quando a exposição é relevante, que
						evento se quer evitar e qual controle falta.
					</p>

					<p className="rc-eyebrow mt-10">Modelos relacionados</p>
					<ul className="mt-4 flex flex-col gap-3">
						{models.map((m) => (
							<li key={m.id}>
								<a href={m.href} className={cn("group flex items-start justify-between gap-3 p-4", SURFACE_LINK)}>
									<span>
										<span className="rc-title block text-base">{m.name}</span>
										<span className="text-muted-foreground mt-1 block text-sm">{m.text}</span>
									</span>
									<ArrowRight className="text-primary mt-1 size-4 shrink-0" aria-hidden="true" />
								</a>
							</li>
						))}
					</ul>
				</aside>
			</section>
		</DefaultLayout>
	);
}
