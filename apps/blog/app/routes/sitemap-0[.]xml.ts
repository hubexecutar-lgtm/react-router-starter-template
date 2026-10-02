// Sitemap of every page, territory and published article (replaces @astrojs/sitemap; same markup).
import { SITE_URL } from "@/consts";
import { PAGES, TERRITORY_PATHS } from "@/data/pages";
import { STORE_PATHS } from "@/features/store/data/paths";
import { getPosts } from "@/lib/posts.server";
import { xmlResponse } from "@/lib/xml";

export function loader() {
	const paths = [
		...new Set([...PAGES, ...TERRITORY_PATHS, ...STORE_PATHS, ...getPosts().map((p) => p.href)]),
	].sort();
	const urls = paths.map((p) => `<url><loc>${new URL(p, SITE_URL).href}</loc></url>`).join("");
	return xmlResponse(
		`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">${urls}</urlset>`,
	);
}
