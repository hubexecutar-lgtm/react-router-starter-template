# STORE-ROUTES-HANDOFF — onde começar

Workflow: [`DEV-STORE-ROUTES-001`](../agent-prompts/DEV-STORE-ROUTES-001.md) ·
ADR: [`ADR-STORE-ROUTES-UI-001`](../adr/ADR-STORE-ROUTES-UI-001.md)

## Ordem de leitura do agente

1. `CLAUDE.md` (ADR-01…ADR-04 — Design System vigente).
2. `docs/adr/ADR-STORE-ROUTES-UI-001.md`.
3. `docs/agent-prompts/DEV-STORE-ROUTES-001.md`.
4. Este handoff.

## Estado real do repositório (inspeção)

| Item | Achado |
|------|--------|
| Framework | Astro 5 estático + React islands (`@astrojs/react`), Tailwind v4, shadcn/ui |
| Router | roteamento por arquivos em `src/pages` (sem router client-side) |
| Layout | `src/layouts/DefaultLayout.astro` (Navbar + Footer) |
| Navegação | `app/components/blocks/navbar.tsx` (`ITEMS`) |
| Tokens | `app/styles/global.css` (`:root`, `.dark`, `@theme inline`) |
| Primitives | `app/components/ui/*` (completo) |
| Showroom | `/admin/design-system` |
| Testes | Playwright + axe em `tests/` (`npm run test:visual`) |

## Arquivos que o workflow toca

```text
src/pages/loja/index.astro
src/pages/loja/[type]/index.astro
src/pages/loja/[type]/[slug].astro
app/features/store/{types,data,components,lib}/…
app/features/store/area-tokens.ts
app/styles/global.css              (camada --area-*)
app/components/blocks/navbar.tsx   (item "Loja")
tests/store.spec.ts
docs/handoff/store-routes/*.md     (mapas, evidências, relatório)
```

## Fluxo (WIP = 1)

```text
inspecionar → Component Map → /loja → verificar
           → /loja/skills → verificar
           → /loja/ebooks → verificar
           → /loja/:type/:slug → verificar → Dev Check → relatório
```

## Documentos gerados

`docs/handoff/store-routes/`: `COMPONENT-MAP.md`, `STORE-ROUTE-MAP.md`, `AREA-COLOR-MAP.md`,
`STORE-WIREFRAMES.md`, `IMPLEMENTATION-REPORT.md`.

## Como versionar

Alterou o comportamento do agente → nova versão em `DEV-STORE-ROUTES-001.md` (histórico ao
final). Alterou a decisão arquitetural → novo ADR ou revisão numerada do ADR.
