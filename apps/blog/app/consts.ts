// Dados globais do site. Importe de qualquer lugar com `import { … } from "@/consts"`.
import { DEFAULT_BASE_URL } from "@/data/routes";

export const SITE_NAME = "Risco Cognitivo";
export const SITE_TAGLINE = "Conhecimento que vira estrutura.";
export const SITE_TITLE = "Risco Cognitivo";
export const SITE_DESCRIPTION = "Artigos do projeto Risco Cognitivo.";
export const SITE_URL = DEFAULT_BASE_URL;

/**
 * Cloudflare Web Analytics (LANC-001 RQ-110/111, DEC-U11): páginas e Core Web Vitals de campo, sem cookies.
 * O token do site é público (vai no HTML) e vem do painel da Cloudflare (Web Analytics → Add a site). Vazio = sem
 * beacon. Os eventos próprios da jornada não dependem dele: vão para o Workers Analytics Engine (/api/eventos).
 */
export const CF_WEB_ANALYTICS_TOKEN = "";

export const SITE_METADATA = {
  title: {
    default: SITE_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  robots: {
    index: true,
    follow: true,
  },
  // Pacote BRAND-ASSET-LOGO-001 (LANC-001, RQ-001): os 5 <link> do README do pacote, servidos de /favicon/.
  icons: {
    icon: [
      { url: "/favicon/favicon.ico", sizes: "any" },
      { url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/favicon/apple-touch-icon.png", sizes: "180x180" }],
    manifest: "/favicon/site.webmanifest",
  },
  /** Logo publicado para Organization.logo (LANC-001, RQ-002). */
  logo: { url: "/images/logo-512.png", width: 512, height: 512 },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    siteName: SITE_NAME,
  },
  twitter: {
    card: "summary",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
};
