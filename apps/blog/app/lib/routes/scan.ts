// Descobre as rotas reais do repositório (usado por tests/routes.spec.ts).
// Lê a configuração de rotas do React Router (app/routes.ts), public/*/index.html e
// content/blog. Só depende de node:fs e da config — não importa componentes.
import { existsSync, readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

import routes from "../../routes";

type RouteEntry = { path?: string; index?: boolean; children?: RouteEntry[] };

function walk(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

function flatten(entries: RouteEntry[], prefix = ""): string[] {
  return entries.flatMap((r) => {
    const path = r.index ? prefix : [prefix, r.path].filter(Boolean).join("/");
    return [path, ...flatten(r.children ?? [], path)];
  });
}

/** Rotas declaradas em app/routes.ts (sem rotas dinâmicas nem o catch-all 404). */
export function scanPages(_root?: string): string[] {
  return [...new Set(flatten(routes as RouteEntry[]))]
    .filter((p) => !p.split("/").some((s) => s.startsWith(":") || s === "*"))
    .map((p) => {
      if (!p) return "/";
      // Endpoints (rss.xml) não têm barra final; páginas têm (/about/).
      return /\.[a-z]+$/.test(p) ? `/${p}` : `/${p}/`;
    });
}

/** Ferramentas estáticas: public/<pasta>/index.html vira /<pasta>/. */
export function scanPublicTools(root: string): string[] {
  const dir = join(root, "public");
  return walk(dir)
    .filter((f) => f.endsWith(`${sep}index.html`))
    .map((f) => `/${relative(dir, f).split(sep).slice(0, -1).join("/")}/`)
    .filter((p) => p !== "//");
}

/** Slugs de content/blog (viram /blog/<slug>/). */
export function scanBlogSlugs(root: string): string[] {
  const dir = join(root, "content/blog");
  return walk(dir)
    .filter((f) => /\.(md|mdx)$/.test(f))
    .map((f) => relative(dir, f).replace(/\.(md|mdx)$/, "").split(sep).join("/"));
}

/** Rotas que o site gera automaticamente e que não têm entrada própria em app/routes.ts. */
export const GENERATED_ROUTES: string[] = [];
