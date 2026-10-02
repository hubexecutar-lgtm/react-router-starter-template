// Monta PostView a partir da coleção (servidor/prerender): precisa do corpo bruto para o tempo de leitura.
import { getPostsWithBody } from "@/lib/content.server";
import { territoryBySlug } from "@/lib/editorial";
import type { PostView } from "@/lib/posts";
import { readingTime } from "@/lib/reading-time";

export type PostWithBody = PostView & { body: string };

export function getPostViewsWithBody(): PostWithBody[] {
	return getPostsWithBody()
		.filter(({ data }) => !data.draft)
		.map(({ id, data, body }) => {
			const territory = territoryBySlug(data.territory);
			if (!territory) throw new Error(`${id}: território desconhecido "${data.territory}"`);
			return {
				id,
				href: `/blog/${id}/`,
				title: data.title,
				seoTitle: data.seoTitle,
				description: data.description,
				pubDate: data.pubDate,
				updatedDate: data.updatedDate,
				minutes: readingTime(body),
				image: data.image,
				imageAlt: data.imageAlt,
				contentId: data.contentId,
				type: data.type,
				tags: data.tags,
				evidence: data.evidence,
				territory,
				body,
			};
		})
		.sort((a, b) => b.pubDate.valueOf() - a.pubDate.valueOf() || a.territory.order - b.territory.order);
}

/** Artigos publicados, mais recentes primeiro (sem o corpo, para enviar ao cliente). */
export function getPosts(): PostView[] {
	return getPostViewsWithBody().map(({ body: _body, ...post }) => post);
}
