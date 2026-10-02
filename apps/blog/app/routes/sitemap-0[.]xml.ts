// Sitemap of every page and article (replaces @astrojs/sitemap; same markup and order).
import { SITE_URL } from "@/consts";
import { PAGES } from "@/data/pages";
import { getPosts } from "@/lib/content";
import { xmlResponse } from "@/lib/xml";

export function loader() {
	const paths = [...PAGES, ...getPosts().map((p) => `/blog/${p.id}/`)].sort();
	const urls = paths.map((p) => `<url><loc>${new URL(p, SITE_URL).href}</loc></url>`).join("");
	return xmlResponse(
		`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">${urls}</urlset>`,
	);
}
