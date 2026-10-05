# HOME-BRAIN-001 — Verificação

Data: 2026-10-05. Base: `main` @ 5f1cb05 (merge do PR #34).

| Verificação | Comando | Resultado |
|---|---|---|
| typegen + TypeScript | `npm run typecheck` | PASS |
| Build de produção, SSR e prerender (inclui `/comece/`) | `npm run build -w apps/blog` | PASS |
| Suíte do blog (graph, editorial, hig, surfaces, routes, mapa, tokens…) | `npm test -w apps/blog` | 327/327 PASS |
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

## v1.0.1 — correção mobile (2026-10-05)

O patch `HOME_BRAIN_MOBILE_FIX_v1.0.1` (proveniência em `v1.0.1-README.md`) foi aplicado sobre `main` @ 4c17b67:
- a câmera encaixa pela largura (FOV horizontal);
- no mobile, o palco é quadrado e os marcadores ficam nas laterais em alturas alternadas, com rótulo de 44 px;
- o teste de regressão confere que, em 320/390 px, os marcadores ficam dentro da viewport e não se sobrepõem.

**Um ajuste no patch:** o material dele (ponto 0.014 com `transparent`, `opacity` 0.78 e `depthWrite: false`) deixava
a nuvem invisível no render, tanto no celular quanto no desktop; as capturas do teste mostravam o palco vazio. Fica o
ponto opaco recortado (`alphaTest`), como na v1.0.0, em 0.02: mais fino que os 0.03 de antes, que era a intenção do
patch.

| Verificação | Resultado |
|---|---|
| `npm run test:brain` (inclui o teste novo de 320/390 px) | 10/10 PASS |
| `surfaces`, `hig`, `editorial`, `tokens` | 107/107 PASS, snapshots inalterados |
| Capturas 390/1440, claro e escuro | atualizadas (`*.webp`) |
