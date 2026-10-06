import type { Config } from "@react-router/dev/config";

import { MAP_PATHS } from "./app/features/mapa/paths";
import { STORE_PATHS } from "./app/features/store/data/paths";
import { PUBLIC_ARTICLES } from "./app/data/article-meta";
import { PAGES } from "./app/data/pages";
import { readyArticleSlugs } from "./app/lib/articles-fs";

// Todas as páginas são estáticas: prerender em build (o Worker segue servindo SSR para o resto,
// inclusive o 404). Na reconstrução (ADR-26) só os artigos de PUBLIC_ARTICLES são pré-renderizados; os outros respondem 302.
export default {
	ssr: true,
	prerender: () => [...new Set([...PAGES, ...STORE_PATHS, ...MAP_PATHS, ...readyArticleSlugs()
				.filter((slug) => (PUBLIC_ARTICLES as readonly string[]).includes(slug))
				.map((slug) => `/artigos/${slug}/`)])],
	future: {
		unstable_viteEnvironmentApi: true,
	},
} satisfies Config;
