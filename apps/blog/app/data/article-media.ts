// Mídia dos artigos (RC-FRONT-001). Os .mdx em content/artigos ficam como o autor enviou, sem campos de
// imagem no frontmatter, então a ilustração de cada artigo é registrada aqui, por slug.
// Imagem nova: webp em public/images/ nas duas larguras (836 e 1672), `alt` descritivo e uso registrado.
export type Media = {
	src: string;
	srcSet: string;
	sizes: string;
	width: number;
	height: number;
	alt: string;
};

const cerebro: Media = {
	src: "/images/cerebro-fio-1672.webp",
	srcSet: "/images/cerebro-fio-836.webp 836w, /images/cerebro-fio-1672.webp 1672w",
	sizes: "(min-width: 1024px) 1078px, 100vw",
	width: 1672,
	height: 941,
	alt: "Ilustração de um cérebro desenhado por um fio azul emaranhado, com uma mão puxando a ponta do fio.",
};

export const ARTICLE_MEDIA: Record<string, { hero: Media; card: Media }> = {
	"risco-cognitivo": { hero: cerebro, card: cerebro },
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
