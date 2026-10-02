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
	authorImage: z.string().optional(),
	authorName: z.string().optional(),
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
