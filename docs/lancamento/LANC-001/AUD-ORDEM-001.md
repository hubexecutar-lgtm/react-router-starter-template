# AUD-ORDEM-001 — Auditoria de ordem: o LANC-001 passa a partir do PR #19 (Stories)

- **Data:** 2026-10-04 · **Responsável:** agente de implementação do LANC-001 · **Decisão:** DEC-U14
  (`requirements/01-DECISOES-E-AMBIGUIDADES.md`)
- **Resumo:** o design system certo é o do PR #19 (`chore/site-do-zero`). O trabalho do LANC-001 foi feito sobre a
  `main` antiga, com o #19 aberto. Esta auditoria lista o que existia, para onde foi e o que falta refazer, e
  registra a regra que impede a repetição.

## 1. Linha do tempo

| Quando (UTC) | Fato |
|---|---|
| 2026-10-03 16:32 | Outra sessão abre o **PR #19**: reset do site (ADR-13) e front-end Stories (ADR-14, tokens `--ref-*`). Base `24108cd`; não mesclado |
| 2026-10-04 manhã | O PR #20 (docs do LANC-001) é mesclado. O kickoff manda partir de `origin/main` |
| 2026-10-04 | PRs #21, #22, #23, #25 e #26 do LANC-001 são mesclados na `main`, sobre o site antigo. O #24 (outra sessão, só docs) também |
| 2026-10-04 | O usuário aponta o preview do #19 como o design system certo e pede esta auditoria |

## 2. Causa-raiz
1. **O pré-voo não olhava os PRs abertos.** O kickoff e o ADR-M02 mandavam criar a branch de `origin/main`, e nada
   obrigava a checar um PR aberto que mudasse a base.
2. **Duas sessões em paralelo, sem cruzamento.** O #19 e o LANC-001 numeraram ADRs iguais (13 e 14) com conteúdos
   diferentes.
3. **O preview fica atrás do Cloudflare Access**, então o agente não via o site que o usuário via.

## 3. Correção aplicada (Fase 1, neste PR)
- `git merge origin/main` dentro da branch do PR #19, **com merge commit, sem rebase nem force-push**. Todo commit de
  hoje continua no histórico.
- Resolução: o #19 prevalece em rotas, páginas, shell, home, layout e tokens `--ref-*`. Da `main` entra o que é
  independente do site.

## 4. Inventário: cada entrega de hoje e onde ela ficou

| PR (merge na `main`) | Entrega | Destino | Onde está agora |
|---|---|---|---|
| #20 `3ed47a4` | Docs do LANC-001 (intake, requisitos, kickoff, entregáveis) | **Mantido** | `docs/lancamento/LANC-001/` |
| #21 `8c28211` | Favicon, manifest, logo, `<link>`s, JSON-LD Organization (RQ-001/002) | **Mantido** | `public/favicon/`, `public/images/logo-*.png`, `app/root.tsx`, `app/consts.ts`, `tests/brand-assets.spec.ts` |
| #22 `c630ff1` | Tokens `--illu-*`, `--graph-*`, motion, geometria; showroom; ADR "13" Brand Local v7 (RQ-010…015) | **Mantido**, ADR renumerado e reescrito | `app/styles/global.css`, `/admin/design-system`, **ADR-15**, `tests/tokens.spec.ts` e `tests/surfaces.spec.ts` |
| #23 `926328d` | Grafo canônico da Teia (RQ-060…065), ajv | **Mantido** | `app/data/graph/`, `app/lib/graph/`, `tests/graph.spec.ts` |
| #24 `a955cf5` | Guia "Funções executivas" v8 (docs, outra sessão) | **Mantido** | `apps/blog/docs/editorial/funcoes-executivas/` |
| #25 `b9c80c0` | `/ferramentas/*` no lugar da Loja, 301 de `/loja/*`, ADR "14" (RQ-100/103) | **A reimplementar** sobre o Stories (Fase 2) | Código no histórico (`b9c80c0`); **ADR-16** registra a decisão |
| #26 `59342e6` | Shell: menu, trilha dos pilares, drawer, barra inferior, chrome no scroll, heroReveal, carrossel (RQ-020…026) | **A reimplementar** sobre o cabeçalho de 64px do Stories (Fase 2) | Código no histórico (`59342e6`); a classe `rc-hero-reveal` do `PageHero` foi mantida |

Arquivos que saíram nesta integração porque testam o que o #19 removeu, e que voltam adaptados na Fase 2:
- `tests/shell.spec.ts` e `tests/store.spec.ts`;
- `app/components/site/{shell.tsx,MobileDrawer.tsx,BottomBar.tsx}` e `app/components/layout/Carousel.tsx`;
- as baselines `surface-ferramentas-*`.

Já tinham saído no #19, e a `main` só os editava:
- `tests/content.spec.ts`, `tests/parity.spec.ts` e o código da Loja.

## 5. Requisitos
- **Continuam `DONE`:** RQ-001, 002, 011…015 e 060…065.
- **Reabertos** (`READY`, com a entrega anterior em `historico`):
  - RQ-010: a identidade agora é o Stories (ADR-15);
  - RQ-020…026: o shell;
  - RQ-100 e RQ-103: Ferramentas.

## 6. Decisões
- **DEC-U14** (nova): a base é o PR #19.
  - Restringe a DEC-U1 a motion e a DEC-U2 a cores.
  - Substitui a DEC-U8: artigos em `/artigos/:slug/`; as rotas antigas foram removidas sem 301, como o #19 decidiu.
- **ADRs do blog:** 13 (reset) e 14 (Stories) são os do #19; o 15 é a camada de ilustração, grafo e motion; o 16
  são as Ferramentas (pendente); o 08 está substituído.

## 7. Prevenção
- `CLAUDE.md` (raiz), ADR-M02: novo **pré-voo de base**. Antes de criar a branch, listar os PRs abertos. Se algum
  muda a base, parar e perguntar.
- `KICKOFF-PROXIMA-SESSAO.md`: passo 0 com o mesmo pré-voo e a base atual (DEC-U14).

## 8. Próximos passos (Fase 2 e replanejamento)
1. **PR-C′ shell** sobre o Stories: `nav.ts` só com destinos que existem, drawer, barra inferior, chrome no scroll e
   trilha, no cabeçalho de 64px (`--ref-header-h`, `--ref-gutter`); `shell.spec` adaptado.
2. **PR-J1′ Ferramentas**: `/ferramentas/*` no layout Stories, 301 de `/loja/*`, `store.spec` e os testes "sem Loja".
3. **Resto do LANC-001 sobre as rotas novas:**
   - PR-D: imagens via `app/data/article-media.ts`;
   - PR-E: RC-LP-001 dentro da Home Stories e os artigos canônicos em `content/artigos/`;
   - PR-F, PR-H (recriar `/mapas` e `/mapas/explorar`), PR-I, PR-K e PR-L.
   - Cada PR passa pelo pré-voo de base.
