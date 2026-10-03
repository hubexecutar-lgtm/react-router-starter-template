import type { Config } from "@react-router/dev/config";

import { PAGES } from "./app/data/pages";
import { readyArticleSlugs } from "./app/lib/articles-fs";

// Todas as páginas são estáticas: prerender em build (o Worker segue servindo SSR para o resto,
// inclusive o 404).
export default {
	ssr: true,
	prerender: () => [...PAGES, ...readyArticleSlugs().map((slug) => `/artigos/${slug}/`)],
	future: {
		unstable_viteEnvironmentApi: true,
	},
} satisfies Config;
