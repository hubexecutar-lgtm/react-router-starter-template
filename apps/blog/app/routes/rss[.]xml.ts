// RSS feed (port of src/pages/rss.xml.js / @astrojs/rss; same markup).
import { SITE_DESCRIPTION, SITE_TITLE, SITE_URL } from "@/consts";
import { getPosts } from "@/lib/content";
import { escapeXml, xmlResponse } from "@/lib/xml";

export function loader() {
	const site = new URL("/", SITE_URL).href;
	const items = getPosts()
		.map((post) => {
			const link = new URL(`/blog/${post.id}/`, SITE_URL).href;
			return (
				`<item><title>${escapeXml(post.data.title)}</title><link>${link}</link>` +
				`<guid isPermaLink="true">${link}</guid>` +
				`<description>${escapeXml(post.data.description)}</description>` +
				`<pubDate>${post.data.pubDate.toUTCString()}</pubDate></item>`
			);
		})
		.join("");
	return xmlResponse(
		`<rss version="2.0"><channel><title>${escapeXml(SITE_TITLE)}</title>` +
			`<description>${escapeXml(SITE_DESCRIPTION)}</description><link>${site}</link>` +
			`${items}</channel></rss>`,
	);
}
