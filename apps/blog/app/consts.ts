// Dados globais do site. Importe de qualquer lugar com `import { … } from "@/consts"`.
import { DEFAULT_BASE_URL } from "@/data/routes";

export const SITE_NAME = "Risco Cognitivo";
export const SITE_TAGLINE = "Conhecimento que vira estrutura.";
export const SITE_TITLE = "Risco Cognitivo — fatores, exposição e controles do trabalho cognitivo";
export const SITE_DESCRIPTION =
  "Blog e framework sobre risco cognitivo: como atenção, memória e julgamento participam da formação do risco no trabalho, e como identificar, controlar e acompanhar.";
export const SITE_URL = DEFAULT_BASE_URL;

/** Imagem padrão de compartilhamento: foto do artigo-tese (o og-image do template foi removido). */
const OG_IMAGE = {
  url: "/blog/do-risco-cognitivo-a-execucao-assistida/hero.jpg",
  width: 1080,
  height: 1350,
  alt: "Uma pessoa sustenta uma enorme tecla Ctrl amarela.",
};

export const SITE_METADATA = {
  title: {
    default: SITE_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "risco cognitivo",
    "fatores de risco cognitivo",
    "exposição cognitiva",
    "erro humano",
    "fatores humanos",
    "gestão de risco",
    "carga mental",
    "controles cognitivos",
  ],
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
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE.url],
  },
};
