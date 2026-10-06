// Coleção de artigos (RC-FRONT-001): MDX em content/artigos, compilado por @mdx-js/rollup (vite.config.ts).
// O frontmatter é validado aqui; só `status: "ready"` é publicado (rascunho não entra em listagem,
// rota nem prerender).
import type { ComponentType } from "react";

import { z } from "zod";

import { ARTICLE_MEDIA, PILLAR_MEDIA, type ArtDirected, type Media, type Pillar } from "@/data/article-media";
import { ARTICLE_META, isPublicArticle, type NextStep, type ProblemId } from "@/data/article-meta";

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
	/** AAAA-MM-DD: data de publicação no site (app/data/article-meta.ts). */
	date: string | null;
	card: Media | null;
	/** Imagem do artigo com art direction; todo artigo tem (DEC-U7): a própria ou a do pilar. */
	hero: ArtDirected;
	pillar: Pillar;
	problems: ProblemId[];
	sources: string[];
	contentId: string;
	next: NextStep;
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
		.filter((a) => a.data.status === "ready" && isPublicArticle(a.data.slug))
		.map(({ data }) => {
			const meta = ARTICLE_META[data.slug];
			if (!meta) throw new Error(`content/artigos/${data.slug}.mdx: sem entrada em app/data/article-meta.ts`);
			const hero = ARTICLE_MEDIA[data.slug] ?? PILLAR_MEDIA[meta.pillar];
			return {
				slug: data.slug,
				href: `/artigos/${data.slug}/`,
				title: data.title,
				description: data.description,
				category: CATEGORY_LABEL[data.contentType],
				date: meta.published,
				card: hero.landscape,
				hero,
				pillar: meta.pillar,
				problems: meta.problems,
				sources: meta.sources,
				contentId: meta.contentId,
				next: meta.next,
			};
		});
}

export function getStory(slug: string): StoryView | undefined {
	return getStories().find((s) => s.slug === slug);
}

export function getArticleContent(slug: string): MDXContent | undefined {
	return all.find((a) => a.data.slug === slug && a.data.status === "ready" && isPublicArticle(slug))?.Content;
}

export function publishedSlugs(): string[] {
	return getStories().map((s) => s.slug);
}

// Template de artigo (ADR-26, DS-CF-001 §4.5–4.6): tempo de leitura e sumário de H2 saem do próprio MDX, sem texto novo.
const raw = import.meta.glob<string>("/content/artigos/*.mdx", { eager: true, query: "?raw", import: "default" });
const rawOf = (slug: string) => raw[`/content/artigos/${slug}.mdx`] ?? "";

/** Mesmo algoritmo do rehype-slug (github-slugger) para os títulos do conteúdo: minúsculas, sem pontuação, espaço → hífen. */
export function headingId(text: string, seen = new Map<string, number>()): string {
	const base = text
		.trim()
		.toLowerCase()
		.replace(/[^\p{L}\p{N}\p{M}\s_-]/gu, "")
		.replace(/ /g, "-");
	const n = seen.get(base) ?? 0;
	seen.set(base, n + 1);
	return n ? `${base}-${n}` : base;
}

/** Sumário: os `## ` do MDX (fora de blocos de código e de JSX), com o id que o rehype-slug gera. */
export function articleToc(slug: string): { id: string; label: string }[] {
	const seen = new Map<string, number>();
	let fenced = false;
	return rawOf(slug)
		.split("\n")
		.flatMap((line) => {
			if (/^(```|~~~)/.test(line)) fenced = !fenced;
			if (fenced) return [];
			const m = /^(#{1,6})\s+(.+?)\s*$/.exec(line);
			if (!m) return [];
			const label = m[2].replace(/[*_`]/g, "");
			const id = headingId(label, seen);
			return m[1].length === 2 ? [{ id, label }] : [];
		});
}

/** Minutos de leitura: palavras do texto (sem frontmatter, comentários, imports e marcação) ÷ 200, mínimo 1. */
export function readingMinutes(slug: string): number {
	const text = rawOf(slug)
		.replace(/^---[\s\S]*?---/, "")
		.replace(/\{\/\*[\s\S]*?\*\/\}/g, "")
		.replace(/^import .*$/gm, "")
		.replace(/<[^>]+>/g, " ")
		.replace(/[#>*_`|[\](){}=-]/g, " ");
	const words = text.split(/\s+/).filter((w) => /\p{L}/u.test(w)).length;
	return Math.max(1, Math.round(words / 200));
}

/** Slug de um MDX pronto que não é público na reconstrução: a rota responde 302 para /artigos/ (ADR-26). */
export function isRetiredArticle(slug: string): boolean {
	return all.some((a) => a.data.slug === slug && a.data.status === "ready") && !isPublicArticle(slug);
}
