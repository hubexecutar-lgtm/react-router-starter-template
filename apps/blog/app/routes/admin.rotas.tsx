import { useState } from "react";

import QRCode from "qrcode";

import type { Route } from "./+types/admin.rotas";

import { Badge, Button, Field, Input, PageHead, SectionHead, Select, Table } from "@/components/ds";
import { ROUTE_GROUPS, ROUTES, absoluteUrl, baseUrl, type HubEntry } from "@/data/routes";
import DefaultLayout from "@/layouts/DefaultLayout";
import { getStories } from "@/lib/articles";
import { seo } from "@/lib/seo";

// Hub de rotas e links (ADR-06) no RC-DS-CF (ADR-26, DS-CF-001-admin §2.3/§2.4). A fonte é app/data/routes.ts; os artigos
// vêm de content/artigos. Contrato de teste (tests/routes.spec.ts): .route-card com data-*, QR role=img, a URL é o
// primeiro link do card, um só botão (Copiar URL) por card, [data-hub-empty], [data-count=total].
export async function loader({ context }: Route.LoaderArgs) {
	const env = (context.cloudflare?.env ?? {}) as { PUBLIC_ROUTES_BASE_URL?: string };
	const base = baseUrl(env.PUBLIC_ROUTES_BASE_URL);
	const articleEntries: HubEntry[] = getStories().map((st) => ({
		id: `artigo-${st.slug}`,
		title: st.title,
		group: "Artigos" as const,
		kind: "route" as const,
		path: st.href,
		exposure: "public" as const,
		addedAt: "2026-10-03",
		source: "content/artigos",
	}));

	const entries = [...ROUTES, ...articleEntries].sort((a, b) => ROUTE_GROUPS.indexOf(a.group) - ROUTE_GROUPS.indexOf(b.group));

	// QR com contraste máximo para leitura por câmera: o padrão da biblioteca (preto sobre branco), fora do tema.
	const withQr = await Promise.all(
		entries.map(async (e) => {
			const url = absoluteUrl(e, base);
			const svg = await QRCode.toString(url, { type: "svg", margin: 2, errorCorrectionLevel: "M" });
			return { ...e, url, svg };
		}),
	);
	return { base, withQr };
}

export const meta: Route.MetaFunction = ({ location }) =>
	seo({
		title: "Rotas e links",
		description: "Hub de rotas e links do Risco Cognitivo, com QR Code de cada endereço.",
		pathname: location.pathname,
		noindex: true,
	});

const exposureLabel = { public: "Pública", internal: "Interno exposto", test: "Estado de teste" } as const;
const exposureBadge = { public: "neutral", internal: "accent", test: "demo" } as const;

const PRINT_CSS = `@media print {
  [data-hub-hide-print], nav[aria-label='Main'], footer, .fixed { display: none !important; }
  .route-card { break-inside: avoid; box-shadow: none; }
}`;

export default function RoutesHub({ loaderData }: Route.ComponentProps) {
	const { base, withQr } = loaderData;
	const links = withQr.filter((e) => e.kind === "link");
	const counts = {
		total: withQr.length,
		groups: new Set(withQr.map((e) => e.group)).size,
		internal: withQr.filter((e) => e.exposure === "internal").length,
		links: links.length,
	};

	const [q, setQ] = useState("");
	const [group, setGroup] = useState("");
	const [exposure, setExposure] = useState("");
	const [copied, setCopied] = useState<string | null>(null);

	const query = q.trim().toLowerCase();
	const matches = (e: (typeof withQr)[number]) =>
		(!query || `${e.title} ${e.path ?? ""} ${e.url}`.toLowerCase().includes(query)) && (!group || e.group === group) && (!exposure || e.exposure === exposure);
	const shown = withQr.filter(matches).length;
	const status = query || group || exposure ? `${shown} de ${withQr.length} entradas` : "";

	async function copy(id: string, url: string) {
		try {
			await navigator.clipboard.writeText(url);
			setCopied(id);
			setTimeout(() => setCopied((c) => (c === id ? null : c)), 1400);
		} catch {
			window.prompt("Copie a URL:", url);
		}
	}

	return (
		<DefaultLayout>
			<style dangerouslySetInnerHTML={{ __html: PRINT_CSS }} />
			<div className="ds-page" data-routes-hub>
				<PageHead
					crumbs={[{ label: "Painel", href: "/admin/" }, { label: "Rotas e links" }]}
					eyebrow="Painel · ADR-06"
					title="Rotas e links"
					lead={
						<>
							Catálogo de todas as rotas e links do projeto, com QR Code. Toda nova rota ou link gerado entra aqui, no mesmo PR: o registro fica em{" "}
							<code>app/data/routes.ts</code> e o teste <code>npm run routes:check</code> bloqueia o que faltar.
						</>
					}
					notice="Hub interno no design system novo; as entradas, os QRs e as URLs são reais."
				/>

				<div className="ds-container grid gap-6 pb-24">
					<dl className="ds-stats" data-testid="hub-summary">
						<div>
							<dt>Entradas</dt>
							<dd data-count="total">{counts.total}</dd>
						</div>
						<div>
							<dt>Grupos</dt>
							<dd>{counts.groups}</dd>
						</div>
						<div>
							<dt>Internas expostas</dt>
							<dd>{counts.internal}</dd>
						</div>
						<div>
							<dt>Links gerados</dt>
							<dd>{counts.links}</dd>
						</div>
					</dl>
					<p className="ds-card-meta" data-testid="hub-base">
						<strong>Base dos QRs:</strong> <code>{base}</code>
					</p>

					<div className="ds-hubbar" data-hub-hide-print>
						<Field label="Filtrar por nome, rota ou URL">
							{({ id }) => <Input id={id} type="search" value={q} onChange={(ev) => setQ(ev.target.value)} placeholder="ex.: /artigos/" />}
						</Field>
						<Field label="Grupo">
							{({ id }) => (
								<Select id={id} value={group} onChange={(ev) => setGroup(ev.target.value)}>
									<option value="">Todos os grupos</option>
									{ROUTE_GROUPS.map((g) => (
										<option key={g} value={g}>
											{g}
										</option>
									))}
								</Select>
							)}
						</Field>
						<Field label="Exposição">
							{({ id }) => (
								<Select id={id} value={exposure} onChange={(ev) => setExposure(ev.target.value)}>
									<option value="">Toda exposição</option>
									<option value="public">Pública</option>
									<option value="internal">Interno exposto</option>
									<option value="test">Estado de teste</option>
								</Select>
							)}
						</Field>
						<Button variant="outline" data-print="" onClick={() => window.print()}>
							Imprimir ou salvar PDF
						</Button>
					</div>
					<p className="ds-card-meta" role="status" aria-live="polite" data-hub-status data-hub-hide-print>
						{status}
					</p>

					<section id="catalogo" aria-labelledby="catalogo-title">
						<h2 id="catalogo-title" className="sr-only">
							Catálogo
						</h2>
						<div className="ds-qrgrid" id="hub-grid" data-testid="hub-grid">
							{withQr.map((e) => (
								<article
									key={e.id}
									className={`route-card ds-qrcard${matches(e) ? "" : " hidden"}`}
									data-id={e.id}
									data-kind={e.kind}
									data-group={e.group}
									data-exposure={e.exposure}
									data-search={`${e.title} ${e.path ?? ""} ${e.url}`.toLowerCase()}
								>
									<div role="img" aria-label={`QR Code para ${e.title}`} className="ds-qrcard-qr" dangerouslySetInnerHTML={{ __html: e.svg }} />
									<div className="ds-qrcard-body">
										<p className="ds-card-eyebrow">{e.group}</p>
										<h3>{e.title}</h3>
										{e.kind === "route" && <code>{e.path}</code>}
										<a className="ds-qrcard-url" href={e.url} target="_blank" rel="noopener noreferrer">
											{e.url}
										</a>
										{e.description && <p className="ds-qrcard-desc">{e.description}</p>}
										<div className="ds-qrcard-actions">
											<Badge variant={exposureBadge[e.exposure]}>{exposureLabel[e.exposure]}</Badge>
											<Button href={e.url} target="_blank" rel="noopener noreferrer" aria-label={`Abrir ${e.title}`}>
												Abrir
											</Button>
											<Button variant="outline" data-copy={e.url} onClick={() => copy(e.id, e.url)}>
												<span data-copy-label>{copied === e.id ? "Copiado" : "Copiar URL"}</span>
											</Button>
										</div>
									</div>
								</article>
							))}
						</div>
						<p className={`ds-card-meta mt-4${shown > 0 ? " hidden" : ""}`} data-hub-empty>
							Nenhuma entrada corresponde ao filtro. Limpe a busca ou escolha “Todos os grupos” para ver o catálogo inteiro.
						</p>
					</section>

					<section id="registro" className="ds-showroom-section" aria-labelledby="registro-title" data-hub-hide-print>
						<SectionHead id="registro-title" label="Auditoria" heading="Registro" lead="Origem, responsável e data de inclusão de cada entrada." align="left" />
						<div data-testid="hub-registry">
							<Table
								caption="Registro de rotas e links"
								head={["Id", "Título", "Endereço", "Exposição", "Incluída em", "Origem"]}
								rows={withQr.map((e) => [
									<code key="id">{e.id}</code>,
									e.title,
									e.kind === "route" ? (
										<code key="p">{e.path}</code>
									) : (
										<a key="u" href={e.url} rel="noopener noreferrer">
											{e.url}
										</a>
									),
									exposureLabel[e.exposure],
									e.addedAt,
									e.source ?? "—",
								])}
							/>
						</div>
					</section>

					<section id="workflow" className="ds-showroom-section" aria-labelledby="workflow-title" data-hub-hide-print>
						<SectionHead id="workflow-title" label="ADR-06" heading="Como registrar" align="left" />
						<ol className="ds-prose" style={{ listStyle: "decimal", paddingLeft: "1.3em" }}>
							<li>
								Crie a rota em <code>app/routes.ts</code> + <code>app/routes/</code>, a ferramenta em <code>public/&lt;pasta&gt;/index.html</code> ou gere o
								link.
							</li>
							<li>
								Acrescente a entrada em <code>app/data/routes.ts</code> (rota: <code>path</code>; link: <code>url</code> https).
							</li>
							<li>
								Rode <code>npm run routes:check</code>: ele lista o que faltar.
							</li>
							<li>Confira o QR e a URL neste catálogo; artigos do blog entram sozinhos.</li>
							<li>Marque o item no checklist do PR.</li>
						</ol>
						<p className="ds-prose-block" style={{ marginTop: 16, fontSize: 16 }}>
							Detalhes em <code>docs/design-system/ROUTES-HUB-WORKFLOW-001.md</code> e no ADR-06 do <code>CLAUDE.md</code>.
						</p>
						<p style={{ marginTop: 24 }}>
							<Button variant="outline" href="/admin/tools/qr-python.zip" download="">
								Baixar módulos Python (tools/qr-python)
							</Button>
						</p>
						<p className="ds-card-meta" style={{ marginTop: 8, maxWidth: "var(--cf-measure)" }}>
							Arquivo de referência do gerador DESK-OS Sprint; está incompleto (veja o README dentro do zip) e não gera este catálogo.
						</p>
					</section>
				</div>
			</div>
		</DefaultLayout>
	);
}
