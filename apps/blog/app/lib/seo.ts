// Head metadata shared by every page (port of the Astro BaseHead component).
import type { MetaDescriptor } from "react-router";

import { SITE_METADATA, SITE_TITLE, SITE_URL } from "@/consts";

type SeoInput = {
	title?: string;
	description?: string;
	image?: string;
	pathname: string;
};

export function seo({ title, description, image, pathname }: SeoInput): MetaDescriptor[] {
	const url = new URL(pathname, SITE_URL).href;
	const finalTitle = title || SITE_METADATA.title.default;
	const finalDescription = description || SITE_METADATA.description;
	const og = SITE_METADATA.openGraph.images[0];
	const imageURL = new URL(image || og.url, url).href;
	const { robots } = SITE_METADATA;

	return [
		{ title: finalTitle },
		{ name: "robots", content: `${robots.index ? "index" : "noindex"}, ${robots.follow ? "follow" : "nofollow"}` },
		{ name: "keywords", content: SITE_METADATA.keywords.join(", ") },
		{ name: "author", content: SITE_METADATA.authors[0].name },
		{ name: "creator", content: SITE_METADATA.creator },
		{ name: "publisher", content: SITE_METADATA.publisher },
		{ tagName: "link", rel: "alternate", type: "application/rss+xml", title: SITE_TITLE, href: new URL("rss.xml", SITE_URL).href },
		{ tagName: "link", rel: "canonical", href: url },
		{ name: "title", content: finalTitle },
		{ name: "description", content: finalDescription },
		{ property: "og:type", content: "website" },
		{ property: "og:url", content: url },
		{ property: "og:site_name", content: SITE_METADATA.openGraph.siteName },
		{ property: "og:title", content: finalTitle },
		{ property: "og:description", content: finalDescription },
		{ property: "og:image", content: imageURL },
		{ property: "og:image:width", content: og.width.toString() },
		{ property: "og:image:height", content: og.height.toString() },
		{ property: "og:image:alt", content: og.alt },
		{ property: "twitter:card", content: SITE_METADATA.twitter.card },
		{ property: "twitter:url", content: url },
		{ property: "twitter:title", content: finalTitle },
		{ property: "twitter:description", content: finalDescription },
		{ property: "twitter:image", content: imageURL },
		{ property: "twitter:creator", content: SITE_METADATA.twitter.creator },
	];
}
