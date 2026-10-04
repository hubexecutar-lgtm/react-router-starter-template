import { type RouteConfig, index, route } from "@react-router/dev/routes";

// Site do zero (ADR-13/14): home, artigos, painel interno (/admin) e 404.
// ADR-06: nova rota também entra em app/data/routes.ts.
export default [
	index("routes/home.tsx"),
	route("artigos/:slug", "routes/artigos.$slug.tsx"),
	route("prisma", "routes/prisma.tsx"),
	route("admin", "routes/admin._index.tsx"),
	route("admin/design-system", "routes/admin.design-system.tsx"),
	route("admin/handoff", "routes/admin.handoff.tsx"),
	route("admin/relatorio-exemplo", "routes/admin.relatorio-exemplo.tsx"),
	route("admin/rotas", "routes/admin.rotas.tsx"),
	route("admin/stories-fixtures", "routes/admin.stories-fixtures.tsx"),
	route("*", "routes/$.tsx"),
] satisfies RouteConfig;
