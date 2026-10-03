// Dados globais do site. Importe de qualquer lugar com `import { … } from "@/consts"`.
import { DEFAULT_BASE_URL } from "@/data/routes";

export const SITE_NAME = "Risco Cognitivo";
export const SITE_TAGLINE = "Conhecimento que vira estrutura.";
export const SITE_TITLE = "Risco Cognitivo";
export const SITE_DESCRIPTION = "Risco Cognitivo: site em construção.";
export const SITE_URL = DEFAULT_BASE_URL;

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
  icons: {
    icon: [
      { url: "/favicon/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon/favicon.ico", sizes: "48x48" },
    ],
    apple: [{ url: "/favicon/apple-touch-icon.png", sizes: "180x180" }],
    shortcut: [{ url: "/favicon/favicon.ico" }],
  },
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
