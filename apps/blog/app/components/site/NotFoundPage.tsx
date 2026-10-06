// Conteúdo do 404 no RC-DS-CF (ADR-26, DS-CF-001-prisma §3): usado pela rota catch-all e pelos artigos com slug
// inexistente. É estado de erro, não layout em reconstrução: PageHead sem aviso de demonstração e sem ilustração.
// Copy (ux-copy): o quê (h1), por quê (lead) e como resolver (ação + caminhos reais).
import { Button, Card, CardGrid, PageHead, SectionHead } from "@/components/ds";
import DefaultLayout from "@/layouts/DefaultLayout";

const PATHS = [
	{ href: "/", eyebrow: "Início", title: "Página inicial", text: "Comece pela apresentação do projeto." },
	{ href: "/artigos/", eyebrow: "Blog", title: "Artigos publicados", text: "Leia os artigos sobre riscos cognitivos." },
	{ href: "/mapas/", eyebrow: "Mapa", title: "Mapa Cognitivo", text: "Explore fatores, compensações e relações." },
	{ href: "/ferramentas/", eyebrow: "Ferramentas", title: "Ferramentas e Soluções", text: "Use as ferramentas e soluções publicadas." },
] as const;

export function NotFoundPage() {
	return (
		<DefaultLayout>
			<div className="ds-page" data-not-found>
				<PageHead
					eyebrow="Erro 404"
					title="Página não encontrada"
					lead="O endereço não existe ou mudou de lugar. Confira o link ou siga por um dos caminhos abaixo."
					notice={false}
					actions={
						<Button href="/" size="lg" data-cta="primary">
							Ir para a página inicial
						</Button>
					}
				/>
				<section className="ds-section" style={{ paddingTop: 0, paddingBottom: "var(--cf-section-gap)" }} aria-labelledby="caminhos">
					<SectionHead id="caminhos" heading="Para onde ir agora" align="left" />
					<CardGrid cols={4} data-tablet="2">
						{PATHS.map((p) => (
							<Card key={p.href} href={p.href} eyebrow={p.eyebrow} title={p.title} text={p.text} cta="Abrir" />
						))}
					</CardGrid>
				</section>
			</div>
		</DefaultLayout>
	);
}
