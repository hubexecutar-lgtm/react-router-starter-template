import { useState } from "react";

import QRCode from "qrcode";

import type { Route } from "./+types/admin.rotas";

import { buttonVariants } from "@/components/ui/button";
import { ROUTE_GROUPS, ROUTES, absoluteUrl, baseUrl, type HubEntry } from "@/data/routes";
import DefaultLayout from "@/layouts/DefaultLayout";
import { getPosts } from "@/lib/content";
import { seo } from "@/lib/seo";
import { cn } from "@/lib/utils";

// Hub de rotas e links (ADR-06). A fonte é app/data/routes.ts; os artigos vêm da coleção do blog.
export async function loader({ context }: Route.LoaderArgs) {
  const env = (context.cloudflare?.env ?? {}) as { PUBLIC_ROUTES_BASE_URL?: string };
  const base = baseUrl(env.PUBLIC_ROUTES_BASE_URL);
  const blogEntries: HubEntry[] = getPosts()
    .map((p) => ({
      id: `blog-${p.id}`,
      title: p.data.title,
      group: "Blog" as const,
      kind: "route" as const,
      path: `/blog/${p.id}/`,
      exposure: "public" as const,
      addedAt: p.data.pubDate.toISOString().slice(0, 10),
      source: "content/blog",
    }))
    .sort((a, b) => a.path.localeCompare(b.path));

  const entries = [...ROUTES, ...blogEntries].sort(
    (a, b) => ROUTE_GROUPS.indexOf(a.group) - ROUTE_GROUPS.indexOf(b.group),
  );

  // QR precisa de contraste máximo para leitura por câmera: preto sobre branco, fora dos tokens de tema.
  const withQr = await Promise.all(
    entries.map(async (e) => {
      const url = absoluteUrl(e, base);
      const svg = await QRCode.toString(url, {
        type: "svg",
        margin: 2,
        errorCorrectionLevel: "M",
        color: { dark: "#000000", light: "#ffffff" },
      });
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
  });

const exposureLabel = { public: "Pública", internal: "Interno exposto", test: "Estado de teste" } as const;
const exposureTone = {
  public: "border-[color:var(--color-brand-soft)] bg-[var(--color-brand-subtle)] text-[var(--color-brand-default)]",
  internal: "border-[color:var(--color-attention-soft)] bg-[var(--color-attention-subtle)] text-[var(--color-attention-default)]",
  test: "bg-muted text-muted-foreground",
} as const;
const h2 = "text-primary scroll-mt-28 text-4xl font-medium";

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
    (!query || `${e.title} ${e.path ?? ""} ${e.url}`.toLowerCase().includes(query)) &&
    (!group || e.group === group) &&
    (!exposure || e.exposure === exposure);
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
      <div className="container max-w-5xl pt-12 pb-24 lg:pt-20">
        <p className="text-muted-foreground text-sm font-medium" data-hub-hide-print><a href="/admin" className="hover:underline">Painel</a> / Rotas e links</p>
        <h1 className="mt-2 text-3xl tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">Rotas e links</h1>
        <p className="text-muted-foreground mt-3 max-w-2xl text-lg font-medium">
          Catálogo de todas as rotas e links do projeto, com QR Code. Toda nova rota ou link gerado entra aqui, no
          mesmo PR: o registro fica em <code>app/data/routes.ts</code> e o teste <code>npm run routes:check</code> bloqueia o que faltar.
        </p>

        <dl className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4" data-testid="hub-summary">
          <div className="rc-cell p-4"><dt className="text-muted-foreground text-sm">Entradas</dt><dd className="text-3xl font-medium tabular-nums" data-count="total">{counts.total}</dd></div>
          <div className="rc-cell p-4"><dt className="text-muted-foreground text-sm">Grupos</dt><dd className="text-3xl font-medium tabular-nums">{counts.groups}</dd></div>
          <div className="rc-cell p-4"><dt className="text-muted-foreground text-sm">Internas expostas</dt><dd className="text-3xl font-medium tabular-nums">{counts.internal}</dd></div>
          <div className="rc-cell p-4"><dt className="text-muted-foreground text-sm">Links gerados</dt><dd className="text-3xl font-medium tabular-nums">{counts.links}</dd></div>
        </dl>
        <p className="text-muted-foreground-subtle mt-3 text-sm" data-testid="hub-base"><strong className="text-muted-foreground">Base dos QRs:</strong> <code>{base}</code></p>

        <div className="mt-8 flex flex-wrap items-center gap-3" data-hub-hide-print>
          <label className="sr-only" htmlFor="hub-search">Filtrar por nome, rota ou URL</label>
          <input id="hub-search" type="search" value={q} onChange={(ev) => setQ(ev.target.value)} placeholder="Filtrar por nome, rota ou URL…" className="border-input bg-background h-10 min-w-0 flex-1 basis-64 rounded-lg border px-3 text-base" />
          <label className="sr-only" htmlFor="hub-group">Grupo</label>
          <select id="hub-group" value={group} onChange={(ev) => setGroup(ev.target.value)} className="border-input bg-background h-10 rounded-lg border px-3 text-base">
            <option value="">Todos os grupos</option>
            {ROUTE_GROUPS.map((g, i) => <option key={i} value={g}>{g}</option>)}
          </select>
          <label className="sr-only" htmlFor="hub-exposure">Exposição</label>
          <select id="hub-exposure" value={exposure} onChange={(ev) => setExposure(ev.target.value)} className="border-input bg-background h-10 rounded-lg border px-3 text-base">
            <option value="">Toda exposição</option>
            <option value="public">Pública</option>
            <option value="internal">Interno exposto</option>
            <option value="test">Estado de teste</option>
          </select>
          <button type="button" data-print onClick={() => window.print()} className={buttonVariants({ variant: 'outline' })}>Imprimir / PDF</button>
        </div>
        <p className="text-muted-foreground mt-3 text-sm" role="status" aria-live="polite" data-hub-status data-hub-hide-print>{status}</p>

        <section id="catalogo" className="mt-10" aria-labelledby="catalogo-title">
          <h2 id="catalogo-title" className="sr-only">Catálogo</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2" id="hub-grid" data-testid="hub-grid">
            {withQr.map((e, i) => (
              <article key={i}
                className={cn("route-card rc-cell flex min-w-0 gap-4 p-4", !matches(e) && "hidden")}
                data-id={e.id}
                data-kind={e.kind}
                data-group={e.group}
                data-exposure={e.exposure}
                data-search={`${e.title} ${e.path ?? ''} ${e.url}`.toLowerCase()}
              >
                <div
                  role="img"
                  aria-label={`QR Code para ${e.title}`}
                  className="size-28 shrink-0 self-start overflow-hidden rounded-lg border bg-white [&>svg]:size-full"
                  dangerouslySetInnerHTML={{ __html: e.svg }}
                />
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <p className="text-muted-foreground-subtle text-xs font-medium tracking-wide uppercase">{e.group}</p>
                  <h3 className="text-lg font-medium leading-snug">{e.title}</h3>
                  {e.kind === 'route' && <code className="text-sm break-all">{e.path}</code>}
                  <a className="text-primary text-sm break-all underline-offset-4 hover:underline" href={e.url} target="_blank" rel="noopener noreferrer">{e.url}</a>
                  {e.description && <p className="text-muted-foreground text-sm">{e.description}</p>}
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className={cn('inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium', exposureTone[e.exposure])}>{exposureLabel[e.exposure]}</span>
                    <a className={buttonVariants({ size: 'sm' })} href={e.url} target="_blank" rel="noopener noreferrer">Abrir</a>
                    <button type="button" className={buttonVariants({ variant: 'outline', size: 'sm' })} data-copy={e.url} onClick={() => copy(e.id, e.url)}><span data-copy-label>{copied === e.id ? 'Copiado' : 'Copiar URL'}</span></button>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <p className={cn("text-muted-foreground mt-4 text-base", shown > 0 && "hidden")} data-hub-empty>Nenhuma entrada corresponde ao filtro.</p>
        </section>

        <section id="registro" className="mt-20" aria-labelledby="registro-title" data-hub-hide-print>
          <h2 id="registro-title" className={h2}>Registro</h2>
          <p className="text-muted-foreground mt-3 max-w-2xl text-lg font-medium">Auditoria de cada entrada: origem, responsável e data de inclusão.</p>
          <div className="mt-6 overflow-x-auto" data-testid="hub-registry">
            <table className="ds-table">
              <caption className="sr-only">Registro de rotas e links</caption>
              <thead><tr><th scope="col">Id</th><th scope="col">Título</th><th scope="col">Endereço</th><th scope="col">Exposição</th><th scope="col">Incluída em</th><th scope="col">Origem</th></tr></thead>
              <tbody>
                {withQr.map((e, i) => (
                  <tr key={i}>
                    <td><code>{e.id}</code></td>
                    <td>{e.title}</td>
                    <td>{e.kind === 'route' ? <code>{e.path}</code> : <a href={e.url} rel="noopener noreferrer">{e.url}</a>}</td>
                    <td>{exposureLabel[e.exposure]}</td>
                    <td>{e.addedAt}</td>
                    <td>{e.source ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="workflow" className="mt-20" aria-labelledby="workflow-title" data-hub-hide-print>
          <h2 id="workflow-title" className={h2}>Como registrar</h2>
          <ol className="text-muted-foreground mt-6 max-w-2xl list-decimal space-y-2 pl-5 text-lg font-medium">
            <li>Crie a rota em <code>app/routes.ts</code> + <code>app/routes/</code>, a ferramenta em <code>public/&lt;pasta&gt;/index.html</code> ou gere o link.</li>
            <li>Acrescente a entrada em <code>app/data/routes.ts</code> (rota: <code>path</code>; link: <code>url</code> https).</li>
            <li>Rode <code>npm run routes:check</code>: ele lista o que faltar.</li>
            <li>Confira o QR e a URL neste catálogo; artigos do blog entram sozinhos.</li>
            <li>Marque o item no checklist do PR.</li>
          </ol>
          <p className="text-muted-foreground mt-4 max-w-2xl text-base font-medium">Detalhes em <code>docs/design-system/ROUTES-HUB-WORKFLOW-001.md</code> e no ADR-06 do <code>CLAUDE.md</code>.</p>
          <p className="mt-6"><a className={buttonVariants({ variant: 'outline' })} href="/admin/tools/qr-python.zip" download>Baixar módulos Python (tools/qr-python)</a></p>
          <p className="text-muted-foreground-subtle mt-2 max-w-2xl text-sm">Arquivo de referência do gerador DESK-OS Sprint; está incompleto (veja o README dentro do zip) e não gera este catálogo.</p>
        </section>
      </div>
    </DefaultLayout>
  );
}
