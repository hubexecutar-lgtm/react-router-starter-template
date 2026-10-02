// RSS feed (port of src/pages/rss.xml.js / @astrojs/rss): published articles, newest first.
import { SITE_DESCRIPTION, SITE_TITLE, SITE_URL } from "@/consts";
import { getPosts } from "@/lib/posts.server";
import { escapeXml, xmlResponse } from "@/lib/xml";

export function loader() {
	const site = new URL("/", SITE_URL).href;
	const items = getPosts()
		.map((post) => {
			const link = new URL(post.href, SITE_URL).href;
			return (
				`<item><title>${escapeXml(post.title)}</title><link>${link}</link>` +
				`<guid isPermaLink="true">${link}</guid>` +
				`<description>${escapeXml(post.description)}</description>` +
				`<pubDate>${post.pubDate.toUTCString()}</pubDate>` +
				post.tags.map((t) => `<category>${escapeXml(t)}</category>`).join("") +
				`</item>`
			);
		})
		.join("");
	return xmlResponse(
		`<rss version="2.0"><channel><title>${escapeXml(SITE_TITLE)}</title>` +
			`<description>${escapeXml(SITE_DESCRIPTION)}</description><link>${site}</link>` +
			`<language>pt-BR</language>${items}</channel></rss>`,
	);
}
