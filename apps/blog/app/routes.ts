import { type RouteConfig, index, route } from "@react-router/dev/routes";

// Site do zero (ADR-13/14): home, artigos, painel interno (/admin) e 404.
// ADR-06: nova rota também entra em app/data/routes.ts.
export default [
	index("routes/home.tsx"),
	route("artigos", "routes/artigos._index.tsx"),
	route("fontes", "routes/fontes.tsx"),
	route("sobre", "routes/sobre.tsx"),
	route("artigos/:slug", "routes/artigos.$slug.tsx"),
	route("mapas", "routes/mapas._index.tsx"),
	route("mapas/explorar", "routes/mapas.explorar._index.tsx"),
	route("mapas/personalizar", "routes/mapas.personalizar.tsx"),
	route("mapas/explorar/:fatorId", "routes/mapas.explorar.$fatorId.tsx"),
	route("prisma", "routes/prisma.tsx"),
	route("ferramentas", "routes/ferramentas._index.tsx"),
	route("ferramentas/:type", "routes/ferramentas.$type._index.tsx"),
	route("ferramentas/:type/:slug", "routes/ferramentas.$type.$slug.tsx"),
	route("admin", "routes/admin._index.tsx"),
	route("admin/design-system", "routes/admin.design-system.tsx"),
	route("admin/handoff", "routes/admin.handoff.tsx"),
	route("admin/relatorio-exemplo", "routes/admin.relatorio-exemplo.tsx"),
	route("admin/rotas", "routes/admin.rotas.tsx"),
	route("admin/stories-fixtures", "routes/admin.stories-fixtures.tsx"),
	route("*", "routes/$.tsx"),
] satisfies RouteConfig;
