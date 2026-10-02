
import { cloudflare } from "@cloudflare/vite-plugin";
import mdx from "@mdx-js/rollup";
import { reactRouter } from "@react-router/dev/vite";
import rehypeShiki from "@shikijs/rehype";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "node:url";
import rehypeSlug from "rehype-slug";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import remarkSmartypants from "remark-smartypants";
import { defineConfig, type Plugin } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

import remarkPlain from "./app/lib/plain/remarkPlain";

// Markdown/MDX content (replaces astro:content). The remark/rehype set mirrors Astro's
// defaults (GFM, smartypants, heading ids, Shiki github-dark) plus the plain text plugin
// of ADR-05. @mdx-js/rollup ignores the query string, so it would also compile `?raw`
// imports (used for reading time): only plain module ids are compiled.
function mdxContent(): Plugin {
	const plugin = mdx({
		format: "detect",
		remarkPlugins: [
			remarkFrontmatter,
			remarkMdxFrontmatter,
			remarkGfm,
			remarkSmartypants,
			remarkPlain,
		],
		rehypePlugins: [rehypeSlug, [rehypeShiki, { theme: "github-dark" }]],
	});
	const transform = plugin.transform as (code: string, id: string) => Promise<unknown>;
	return {
		...(plugin as Plugin),
		enforce: "pre",
		transform(code, id) {
			if (process.env.DEBUG_MDX && /\.mdx?($|\?)/.test(id)) {
				console.log("[mdx]", this.environment?.name, id);
			}
			if (id.includes("?")) return;
			return transform.call(this, code, id) as ReturnType<typeof transform> as never;
		},
	};
}

export default defineConfig({
	// `@/*` also inside Markdown/MDX content (vite-tsconfig-paths only covers TS/JS files).
	resolve: { alias: { "@": fileURLToPath(new URL("./app", import.meta.url)) } },
	plugins: [
		cloudflare({ viteEnvironment: { name: "ssr" } }),
		tailwindcss(),
		mdxContent(),
		reactRouter(),
		tsconfigPaths(),
	],
});
