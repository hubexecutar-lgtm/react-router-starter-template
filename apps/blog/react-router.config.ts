import type { Config } from "@react-router/dev/config";
import { readdirSync } from "node:fs";


import { ENDPOINTS, PAGES } from "./app/data/pages";
import { STORE_PATHS } from "./app/features/store/data/paths";

// Every page of the blog is static: prerender them all at build time (the Worker still
// serves SSR for anything else, including the 404 page).
function blogPaths(): string[] {
	return readdirSync(new URL("./content/blog", import.meta.url))
		.filter((f) => /\.(md|mdx)$/.test(f))
		.map((f) => `/blog/${f.replace(/\.(md|mdx)$/, "")}/`);
}

export default {
	ssr: true,
	prerender: () => [...PAGES, ...ENDPOINTS, ...blogPaths(), ...STORE_PATHS],
	future: {
		unstable_viteEnvironmentApi: true,
	},
} satisfies Config;
