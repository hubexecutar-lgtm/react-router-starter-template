// Coleção de artigos (RC-FRONT-001): MDX em content/artigos, compilado por @mdx-js/rollup (vite.config.ts).
// O frontmatter é validado aqui; só `status: "ready"` é publicado (rascunho não entra em listagem,
// rota nem prerender).
import type { ComponentType } from "react";

import { z } from "zod";

import { ARTICLE_MEDIA, type Media } from "@/data/article-media";

const schema = z.object({
	title: z.string().min(1),
	description: z.string().min(1),
	slug: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/),
	status: z.enum(["draft", "ready"]),
	contentType: z.enum(["article"]),
});

export type ArticleData = z.infer<typeof schema>;
export type MDXContent = ComponentType<{ components?: Record<string, ComponentType<any>> }>;
type MDXModule = { default: MDXContent; frontmatter?: unknown };

const modules = import.meta.glob<MDXModule>("/content/artigos/*.mdx", { eager: true });

const CATEGORY_LABEL: Record<ArticleData["contentType"], string> = { article: "Artigo" };

/** Visão enxuta que a Home e os cards consomem (nunca o módulo MDX). */
export type StoryView = {
	slug: string;
	href: string;
	title: string;
	description: string;
	category: string;
	/** AAAA-MM-DD; o frontmatter atual não tem data, então fica nulo (nada de data inventada). */
	date: string | null;
	card: Media | null;
	hero: Media | null;
};

function load() {
	return Object.entries(modules).map(([file, mod]) => {
		const parsed = schema.safeParse(mod.frontmatter ?? {});
		if (!parsed.success) throw new Error(`${file}: frontmatter inválido\n${parsed.error.message}`);
		const expected = file.replace(/^\/content\/artigos\//, "").replace(/\.mdx$/, "");
		if (parsed.data.slug !== expected) throw new Error(`${file}: slug "${parsed.data.slug}" difere do nome do arquivo`);
		return { data: parsed.data, Content: mod.default };
	});
}

const all = load();

/** Artigos publicados, na ordem dos arquivos. */
export function getStories(): StoryView[] {
	return all
		.filter((a) => a.data.status === "ready")
		.map(({ data }) => ({
			slug: data.slug,
			href: `/artigos/${data.slug}/`,
			title: data.title,
			description: data.description,
			category: CATEGORY_LABEL[data.contentType],
			date: null,
			card: ARTICLE_MEDIA[data.slug]?.card ?? null,
			hero: ARTICLE_MEDIA[data.slug]?.hero ?? null,
		}));
}

export function getStory(slug: string): StoryView | undefined {
	return getStories().find((s) => s.slug === slug);
}

export function getArticleContent(slug: string): MDXContent | undefined {
	return all.find((a) => a.data.slug === slug && a.data.status === "ready")?.Content;
}

export function publishedSlugs(): string[] {
	return getStories().map((s) => s.slug);
}
