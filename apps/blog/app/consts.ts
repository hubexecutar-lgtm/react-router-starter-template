// Dados globais do site. Importe de qualquer lugar com `import { … } from "@/consts"`.
import { DEFAULT_BASE_URL } from "@/data/routes";

export const SITE_NAME = "Risco Cognitivo";
export const SITE_TAGLINE = "Conhecimento que vira estrutura.";
export const SITE_TITLE = "Risco Cognitivo — fatores, exposição e controles do trabalho cognitivo";
export const SITE_DESCRIPTION =
  "Blog e framework sobre risco cognitivo: como atenção, memória e julgamento participam da formação do risco no trabalho, e como identificar, controlar e acompanhar.";
export const SITE_URL = DEFAULT_BASE_URL;

/** Imagem padrão de compartilhamento: a ilustração do binóculo (banco de imagens, ADR-12). */
const OG_IMAGE = {
  url: "/images/binoculo.webp",
  width: 593,
  height: 720,
  alt: "Ilustração de uma mulher sentada em um banquinho observando com um binóculo azul.",
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
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE.url],
  },
};
