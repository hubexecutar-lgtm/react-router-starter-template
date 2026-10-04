# LANC-001 — Pacote de lançamento (intake)

- **Status:** INTAKE ABERTO — recebendo arquivos; especificações finais ainda não passadas
- **Recebido em:** 2026-10-04 (upload `lancamento_.zip`, sha256 `f1cbfcb2ab326909366b3c180ff5d30da0095f3480758b02a1756b87db59a7e6`)
- **Workflow de engenharia:** [`WORKFLOW.md`](./WORKFLOW.md)

Esta pasta guarda os arquivos **como recebidos**, sem alteração, para servirem de fonte de verdade
das implementações. Nada aqui é lido pelo build dos apps. A implementação acontece em PRs separados
(ADR-M02), que copiam ou derivam destes arquivos e citam o caminho e o hash daqui.

## Conteúdo recebido

| Pacote | Caminho | Versão / status declarado | Destino provável |
|---|---|---|---|
| Logo + favicon | `intake/LOGO_FAVICON_PACKAGE_v1.0.0/` | BRAND-ASSET-LOGO-001 1.0.0 · VERIFIED | `apps/blog/public/favicon/`, `root.tsx`, OG |
| Editorial Hybrid (mockups) | `intake/editorial-hybrid-apple-v6.html`, `intake/Risco_Cognitivo_Editorial_Hybrid_v4.html`, `intake/risco-cognitivo-brand-local-v7.html` | v4, v6, v7 | `apps/blog` (identidade, nav, layouts) |
| Tokens do Editorial Hybrid | `intake/tokens-hybrid.css`, `intake/tokens-hybrid.json`, `intake/README.md` | v6 | `apps/blog/app/styles/global.css` |
| Teia Única de Correlação | `intake/EXECUTAR-TEIA-UNICA-CORRELACAO-v0.1.0/` | ARCH-EXEC-CORRELATION-GRAPH-001 0.1.0 · PROPOSED_FOR_APPROVAL | `packages/` (registries), blog (QF, Loja), workflow (analytics) |

Integridade: `intake/MANIFEST.sha256` (`sha256sum -c MANIFEST.sha256` dentro de `intake/`).
O `manifest.json` da Teia Única confere com os 11 arquivos (verificado no recebimento).

## Como acrescentar arquivos

1. Copiar para `intake/` mantendo os nomes originais (sem `__MACOSX`/`._*`).
2. Regenerar o manifesto: `cd intake && find . -type f ! -name MANIFEST.sha256 | sort | xargs sha256sum > MANIFEST.sha256`.
3. Registrar a linha na tabela acima e, se mudar escopo ou decisão, atualizar `WORKFLOW.md`.
