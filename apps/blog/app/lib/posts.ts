// Artigos publicados, na mesma forma para listagens, cards, temas e busca.
// A coleção `content/blog` é a fonte única; território e evidências vêm do banco editorial.
// Tipos e formatação (cliente e servidor); a montagem está em posts.server.ts.
import type { PostData } from "@/lib/content";
import type { Territory } from "@/lib/editorial";

export interface PostView {
	id: string;
	href: string;
	title: string;
	seoTitle?: string;
	description: string;
	pubDate: Date;
	updatedDate?: Date;
	minutes: number;
	image?: string;
	imageAlt?: string;
	contentId?: string;
	type: PostData["type"];
	tags: string[];
	evidence: string[];
	territory: Territory;
}

const TYPE_LABEL: Record<PostView["type"], string> = {
	artigo: "Artigo",
	guia: "Guia",
	mapa: "Mapa",
	ensaio: "Ensaio",
};
export const typeLabel = (t: PostView["type"]) => TYPE_LABEL[t];

export const dateFmt = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
export const formatDate = (d: Date) => dateFmt.format(d).replace(/\./g, "").replace(/ de /g, " ");
