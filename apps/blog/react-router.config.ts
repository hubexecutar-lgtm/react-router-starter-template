import type { Config } from "@react-router/dev/config";

import { STORE_PATHS } from "./app/features/store/data/paths";
import { PAGES } from "./app/data/pages";
import { readyArticleSlugs } from "./app/lib/articles-fs";

// Todas as páginas são estáticas: prerender em build (o Worker segue servindo SSR para o resto,
// inclusive o 404).
export default {
	ssr: true,
	prerender: () => [...new Set([...PAGES, ...STORE_PATHS, ...readyArticleSlugs().map((slug) => `/artigos/${slug}/`)])],
	future: {
		unstable_viteEnvironmentApi: true,
	},
} satisfies Config;
