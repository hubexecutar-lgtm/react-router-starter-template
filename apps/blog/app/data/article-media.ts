// Mídia dos artigos (RC-FRONT-001, LANC-001 RQ-030…033). Os .mdx em content/artigos ficam como o autor enviou,
// sem campos de imagem no frontmatter, então a ilustração de cada artigo é registrada aqui, por slug.
// Imagem nova: webp em public/images/ (scripts/rc-images.mjs gera paisagem 16:9 em 836/1672 e retrato 9:16 em
// 470/941, sem cortar), `alt` descritivo e entrada em docs/banco-imagens/manifest.json.
// Todo artigo tem imagem (DEC-U7): sem ilustração própria, usa a do seu pilar (PILLAR_MEDIA).
export type Media = {
	src: string;
	srcSet: string;
	sizes: string;
	width: number;
	height: number;
	alt: string;
};

/** Ilustração com as duas composições: paisagem 16:9 (desktop) e retrato 9:16 (mobile), RQ-032. */
export type ArtDirected = { landscape: Media; portrait: Media };

const landscape = (base: string, alt: string): Media => ({
	src: `/images/${base}-16x9-1672.webp`,
	srcSet: `/images/${base}-16x9-836.webp 836w, /images/${base}-16x9-1672.webp 1672w`,
	sizes: "(min-width: 1024px) 1078px, 100vw",
	width: 1672,
	height: 941,
	alt,
});
const portrait = (base: string, alt: string): Media => ({
	src: `/images/${base}-retrato-941.webp`,
	srcSet: `/images/${base}-retrato-470.webp 470w, /images/${base}-retrato-941.webp 941w`,
	sizes: "100vw",
	width: 941,
	height: 1672,
	alt,
});
const rc = (base: string, alt: string): ArtDirected => ({ landscape: landscape(base, alt), portrait: portrait(base, alt) });

const cerebroFio: ArtDirected = {
	landscape: {
		src: "/images/cerebro-fio-1672.webp",
		srcSet: "/images/cerebro-fio-836.webp 836w, /images/cerebro-fio-1672.webp 1672w",
		sizes: "(min-width: 1024px) 1078px, 100vw",
		width: 1672,
		height: 941,
		alt: "Ilustração de um cérebro desenhado por um fio azul emaranhado, com uma mão puxando a ponta do fio.",
	},
	portrait: portrait(
		"cerebro-fio",
		"Ilustração de um cérebro desenhado por um fio azul emaranhado, com uma mão puxando a ponta do fio.",
	),
};

/** As 6 ilustrações RC_* do banco (DOCS-002), sem texto (tem_texto: false). */
export const RC_IMAGES = {
	binoculosCidade: rc(
		"rc-binoculos-cidade",
		"Ilustração isométrica de uma pessoa sentada no alto de um prédio observando a cidade com binóculos.",
	),
	cerebroUrbanoMao: rc(
		"rc-cerebro-urbano-mao",
		"Ilustração de um cérebro formado por ruas, árvores e prédios, suspenso por um fio preso a uma mão.",
	),
	pistaLargada: rc(
		"rc-pista-largada",
		"Ilustração isométrica de três pessoas em posição de largada numa pista de corrida cercada de árvores.",
	),
	binoculosCerebroUrbano: rc(
		"rc-binoculos-cerebro-urbano",
		"Ilustração de uma pessoa com binóculos, sentada num prédio, observando um cérebro formado por ruas e árvores.",
	),
	binoculosMapaCerebral: rc(
		"rc-binoculos-mapa-cerebral",
		"Ilustração de uma pessoa com binóculos observando um mapa de cidade que se abre a partir de um pequeno cérebro.",
	),
	cerebroUrbanoMaoB: rc(
		"rc-cerebro-urbano-mao-b",
		"Ilustração de um cérebro urbano com ruas e lagos, sustentado por um fio que uma mão segura por baixo.",
	),
} as const;

export type Pillar = "p1" | "p2" | "p3";

/** Ilustração de cada pilar (RC-LP-001): reserva de todo artigo sem ilustração própria (DEC-U7, RQ-032). */
export const PILLAR_MEDIA: Record<Pillar, ArtDirected> = {
	p1: RC_IMAGES.binoculosCidade,
	p2: RC_IMAGES.cerebroUrbanoMao,
	p3: RC_IMAGES.pistaLargada,
};

/** Ilustração própria de cada artigo, por slug. */
export const ARTICLE_MEDIA: Record<string, ArtDirected> = {
	"risco-cognitivo": cerebroFio,
	"riscos-cognitivos": RC_IMAGES.binoculosCidade,
	"processos-neuroadaptativos": RC_IMAGES.cerebroUrbanoMao,
	"compensacao-cognitiva": RC_IMAGES.pistaLargada,
	"tres-pilares-riscos-cognitivos": RC_IMAGES.binoculosCerebroUrbano,
};

/** Ilustração do binóculo (banco de imagens): imagem padrão de compartilhamento. */
export const SHARE_IMAGE: Media = {
	src: "/images/binoculo-observacao-1672.webp",
	srcSet: "/images/binoculo-observacao-836.webp 836w, /images/binoculo-observacao-1672.webp 1672w",
	sizes: "100vw",
	width: 1672,
	height: 941,
	alt: "Ilustração de uma mulher sentada em um banquinho observando com um binóculo azul.",
};
