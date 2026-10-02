// Contato: ainda não há canal público definido (pendência registrada). Sem formulário falso.
import { ArrowRight } from "lucide-react";

import type { Route } from "./+types/contact";

import { PageHero } from "@/components/editorial/PageHero";
import { SURFACE_LINK } from "@/components/editorial/surface";
import { Callout } from "@/components/ui/callout";
import DefaultLayout from "@/layouts/DefaultLayout";
import { seo } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const meta: Route.MetaFunction = ({ location }) =>
	seo({ title: "Contato", description: "Como falar com o Risco Cognitivo e acompanhar o projeto.", pathname: location.pathname });

const ROUTES = [
	{ title: "Dúvidas sobre o framework", text: "Respostas curtas, com link para o artigo.", href: "/faq/" },
	{ title: "Acompanhar publicações", text: "Feed RSS com todos os artigos.", href: "/rss.xml" },
	{ title: "Fontes e evidências", text: "O banco com autor, ano e link de cada fonte.", href: "/evidencias/" },
];

export default function Page() {
	return (
		<DefaultLayout>
			<PageHero
				eyebrow="Contato"
				title="Fale com o projeto"
				lead="O canal público de contato ainda está sendo definido. Enquanto isso, estes caminhos respondem às dúvidas mais comuns."
			/>
			<section className="container max-w-4xl">
				<Callout
					variant="pending"
					subject="Canal de contato"
					message="a definir"
					description="Não publicamos um e-mail ou formulário antes de existir alguém responsável por responder. Esta página será atualizada quando o canal estiver ativo."
				/>
				<ul className="mt-8 grid gap-4 md:grid-cols-3">
					{ROUTES.map((r) => (
						<li key={r.href}>
							<a href={r.href} className={cn("group flex h-full flex-col p-5", SURFACE_LINK)}>
								<span className="rc-title text-lg">{r.title}</span>
								<span className="text-muted-foreground mt-2 text-sm">{r.text}</span>
								<span className="rc-link mt-auto inline-flex items-center gap-1.5 pt-4 text-sm">
									Abrir <ArrowRight className="size-4" aria-hidden="true" />
								</span>
							</a>
						</li>
					))}
				</ul>
			</section>
		</DefaultLayout>
	);
}
