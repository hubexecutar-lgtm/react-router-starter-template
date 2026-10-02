// Blog collection (port of src/content.config.ts + astro:content).
// Markdown/MDX files in content/blog are compiled by @mdx-js/rollup; the frontmatter is
// validated with the same schema the Astro collection used.
import type { ComponentType } from "react";

import { z } from "zod";

const schema = z.object({
	title: z.string(),
	description: z.string(),
	// Transform string to Date object
	pubDate: z.coerce.date(),
	updatedDate: z.coerce.date().optional(),
	image: z.string().optional(),
	/** Texto alternativo da ilustração (ADR-12): obrigatório quando houver `image`. */
	imageAlt: z.string().optional(),
	authorImage: z.string().optional(),
	authorName: z.string().optional(),
	// Banco editorial (app/data/editorial/seed.json) — HANDOFF-RC-GLOBAL-DESIGN-CONTENT-001
	/** ID do registro de conteúdo no banco (CNT-RC-0001). Ausente em peças sem registro. */
	contentId: z.string().regex(/^CNT-RC-\d{4}$/).optional(),
	/** Slug do território (TAX-RC-*), sem barras: `risco-cognitivo`. */
	territory: z.string(),
	type: z.enum(["artigo", "guia", "mapa", "ensaio"]).default("artigo"),
	tags: z.array(z.string()).default([]),
	/** IDs EVD-RC-* citados no texto. */
	evidence: z.array(z.string().regex(/^EVD-RC-\d{4}$/)).default([]),
	seoTitle: z.string().optional(),
	draft: z.boolean().default(false),
});

export type PostData = z.infer<typeof schema>;
export type MDXContent = ComponentType<{ components?: Record<string, ComponentType<any>> }>;
type MDXModule = { default: MDXContent; frontmatter?: unknown };

export type Post = { id: string; data: PostData };

const modules = import.meta.glob<MDXModule>("/content/blog/**/*.{md,mdx}", { eager: true });

export const idOf = (file: string) =>
	file.replace(/^\/content\/blog\//, "").replace(/\.(md|mdx)$/, "");

/** All posts in file order (like Astro's getCollection). */
export function getPosts(): Post[] {
	return Object.entries(modules).map(([file, mod]) => {
		const id = idOf(file);
		const parsed = schema.safeParse(mod.frontmatter ?? {});
		if (!parsed.success) {
			throw new Error(`content/blog/${id}: invalid frontmatter\n${parsed.error.message}`);
		}
		return { id, data: parsed.data };
	});
}

export function getPost(id: string): Post | undefined {
	return getPosts().find((p) => p.id === id);
}

export function getPostContent(id: string): MDXContent | undefined {
	const file = Object.keys(modules).find((f) => idOf(f) === id);
	return file ? modules[file].default : undefined;
}
