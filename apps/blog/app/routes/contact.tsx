// Contato: ainda não há canal público definido (pendência registrada). Sem formulário falso.
// Anatomia (ADR-12): hero, aviso de estado e caminhos como blocos de recurso.
import { BookOpen, HelpCircle, Rss } from "lucide-react";

import type { Route } from "./+types/contact";

import { PageHero } from "@/components/editorial/PageHero";
import { FeatureBlock } from "@/components/layout/FeatureBlock";
import { Section } from "@/components/layout/Section";
import { Callout } from "@/components/ui/callout";
import DefaultLayout from "@/layouts/DefaultLayout";
import { seo } from "@/lib/seo";

export const meta: Route.MetaFunction = ({ location }) =>
	seo({ title: "Contato", description: "Como falar com o Risco Cognitivo e acompanhar o projeto.", pathname: location.pathname });

const ROUTES = [
	{ icon: HelpCircle, title: "Dúvidas sobre o framework", text: "Respostas curtas, com link para o artigo.", href: "/faq/", label: "Abrir as perguntas" },
	{ icon: Rss, title: "Acompanhar publicações", text: "Feed RSS com todos os artigos.", href: "/rss.xml", label: "Assinar o RSS" },
	{ icon: BookOpen, title: "Fontes e evidências", text: "O banco com autor, ano e link de cada fonte.", href: "/evidencias/", label: "Ver as evidências" },
];

export default function Page() {
	return (
		<DefaultLayout>
			<PageHero
				eyebrow="Contato"
				title="Fale com o projeto"
				lead="O canal público de contato ainda está sendo definido. Enquanto isso, estes caminhos respondem às dúvidas mais comuns."
			/>
			<Section id="canal" title="Estado do canal de contato" srTitle>
				<Callout
					variant="pending"
					subject="Canal de contato"
					message="a definir"
					description="Não publicamos um e-mail ou formulário antes de existir alguém responsável por responder. Esta página será atualizada quando o canal estiver ativo."
				/>
			</Section>
			<Section id="caminhos" eyebrow="Enquanto isso" title="Caminhos que já respondem">
				<div className="grid gap-[var(--table-gap)] md:grid-cols-3">
					{ROUTES.map((r) => (
						<FeatureBlock key={r.href} icon={r.icon} title={r.title} link={{ href: r.href, label: r.label }}>
							<p>{r.text}</p>
						</FeatureBlock>
					))}
				</div>
			</Section>
		</DefaultLayout>
	);
}
