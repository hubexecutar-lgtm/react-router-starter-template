// Head metadata shared by every page (port of the Astro BaseHead component).
// `title` is the page title; the site template (`%s | Risco Cognitivo`) is applied here.
// Imagem de compartilhamento: só quando a página informa `image` (o site novo ainda não tem uma padrão).
import type { MetaDescriptor } from "react-router";

import { SITE_METADATA, SITE_URL } from "@/consts";

type SeoInput = {
	title?: string;
	description?: string;
	image?: string;
	pathname: string;
	/** Páginas sem valor de busca (ex.: 404, painel interno). */
	noindex?: boolean;
};

export function seo({ title, description, image, pathname, noindex }: SeoInput): MetaDescriptor[] {
	const url = new URL(pathname, SITE_URL).href;
	const finalTitle = title ? SITE_METADATA.title.template.replace("%s", title) : SITE_METADATA.title.default;
	const finalDescription = description || SITE_METADATA.description;
	const { robots } = SITE_METADATA;
	const imageURL = image ? new URL(image, url).href : undefined;

	return [
		{ title: finalTitle },
		{ name: "robots", content: `${robots.index && !noindex ? "index" : "noindex"}, ${robots.follow ? "follow" : "nofollow"}` },
		{ name: "author", content: SITE_METADATA.authors[0].name },
		{ name: "creator", content: SITE_METADATA.creator },
		{ name: "publisher", content: SITE_METADATA.publisher },
		{ tagName: "link", rel: "canonical", href: url },
		{ name: "title", content: finalTitle },
		{ name: "description", content: finalDescription },
		{ property: "og:type", content: "website" },
		{ property: "og:locale", content: "pt_BR" },
		{ property: "og:url", content: url },
		{ property: "og:site_name", content: SITE_METADATA.openGraph.siteName },
		{ property: "og:title", content: finalTitle },
		{ property: "og:description", content: finalDescription },
		...(imageURL ? [{ property: "og:image", content: imageURL }] : []),
		{ property: "twitter:card", content: imageURL ? "summary_large_image" : SITE_METADATA.twitter.card },
		{ property: "twitter:url", content: url },
		{ property: "twitter:title", content: finalTitle },
		{ property: "twitter:description", content: finalDescription },
		...(imageURL ? [{ property: "twitter:image", content: imageURL }] : []),
	];
}
