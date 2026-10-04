// URLs estáticas do mapa causal (prerender e sitemap): as duas páginas e uma por fator do mapa público.
// Imports relativos: este arquivo é lido pelo react-router.config.ts, fora do alias "@/".
import data from "../../data/graph/rc-graph.json";
import { factorHref, factorIds } from "../../lib/graph/explore";
import type { CorrelationGraph } from "../../lib/graph/types";

export const MAP_PATHS: string[] = ["/mapas/", "/mapas/explorar/", ...factorIds(data as CorrelationGraph).map(factorHref)];
