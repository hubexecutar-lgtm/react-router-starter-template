// Páginas estáticas do site (prerender). Os artigos entram por react-router.config.ts (content/artigos).
export const PAGES = [
	"/",
	"/artigos/",
	"/fontes/",
	"/sobre/",
	"/mapas/",
	"/mapas/explorar/",
	"/mapas/personalizar/",
	"/admin/",
	"/admin/design-system/",
	"/admin/handoff/",
	"/admin/relatorio-exemplo/",
	"/admin/rotas/",
	"/admin/stories-fixtures/",
	"/prisma/",
	"/ferramentas/",
] as const;
