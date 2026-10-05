# HOME-BRAIN-001 — Verificação

Data: 2026-10-05. Base: `main` @ 5f1cb05 (merge do PR #34).

| Verificação | Comando | Resultado |
|---|---|---|
| typegen + TypeScript | `npm run typecheck` | PASS |
| Build de produção, SSR e prerender (inclui `/comece/`) | `npm run build -w apps/blog` | PASS |
| Suíte do blog (graph, editorial, hig, surfaces, routes, mapa, tokens…) | `npm test -w apps/blog` | 326/326 PASS |
| Gate do cérebro 3D (WebGL por software) | `npm run test:brain -w apps/blog` | 10/10 PASS |
| Auditoria HIG (ADR-M03) | `HIG_AUDIT=1 … hig.spec.ts` + `scripts/hig-audit.mjs` | PASS, 32 rotas, 0 FAIL |

O `test:brain` cobre: o asset bate com o manifest (CC0, SHA-256); rotação, pausa, arraste e retomada; seleção →
painel → `/mapas/explorar/?foco=` com o nó certo, incluindo os 3 nós novos; foco inválido sem erro; setas entre os
seletores; movimento reduzido; falha do asset com retry; HTML sem JS; `touch-action: pan-y`; e 320/390/1440 px nos
dois temas sem overflow horizontal e sem violações axe sérias ou críticas (WCAG 2.2 AA).

## Evidências

`light-390.webp`, `light-1440.webp`, `dark-390.webp`, `dark-1440.webp`: a seção do mapa interativo.

## Limites

- Safari/iPhone físico e FPS em hardware real não foram medidos. A meta de 30 FPS espera um aparelho de referência
  (A DEFINIR). O WebGL dos testes é SwiftShader, então não serve de medida de desempenho.
- Core Web Vitals de campo: chegam pelo Cloudflare Web Analytics depois da publicação (ADR-20).
- Fidelidade visual: adaptação de capturas; nada de pixel a pixel com a referência.
