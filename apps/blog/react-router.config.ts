import type { Config } from "@react-router/dev/config";

import { PAGES } from "./app/data/pages";

// Todas as páginas são estáticas: prerender em build (o Worker segue servindo SSR para o resto,
// inclusive o 404).
export default {
	ssr: true,
	prerender: () => [...PAGES],
	future: {
		unstable_viteEnvironmentApi: true,
	},
} satisfies Config;
