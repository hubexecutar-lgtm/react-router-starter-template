// Sitemap index (replaces @astrojs/sitemap; same markup).
import { SITE_URL } from "@/consts";
import { xmlResponse } from "@/lib/xml";

export function loader() {
	return xmlResponse(
		`<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">` +
			`<sitemap><loc>${new URL("/sitemap-0.xml", SITE_URL).href}</loc></sitemap></sitemapindex>`,
	);
}
