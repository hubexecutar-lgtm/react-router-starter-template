# RC-PWA-PRISMA — status da implementação (V1)

Pacote de origem: `RC-PWA-PRISMA-SPECS v1.0.0` (ADR-001, PRD-001, FRD-001, README) e `RC-A4-PACK-001`
(`base-a4-pack/`), enviados pelo OWNER em 2026-10-04. Decisão do repositório: ADR-14 em `apps/blog/CLAUDE.md`.

| Pasta | Conteúdo |
|---|---|
| (raiz) | ADR, PRD e FRD da rota, como recebidos |
| `base-a4-pack/` | Pack A4 de origem (tokens, Status Report, Plano Semanal), como recebido |
| `intake/areas-gestao/` | 6 áreas de gestão (projetos, processos, riscos, análise de riscos, risco cognitivo, compensação e design de solução) |
| `intake/areas-funcoes-executivas/` | 12 funções executivas em ordem operacional (INIBIR … CONCLUIR) |
| `intake/externalizacao-cognitiva-evidencias.txt` | Matriz de evidências de externalização cognitiva (base do texto "Por que tirar da cabeça ajuda") |
| `intake/uix-requerimento-pwa.html` | Requerimento de UX para virar PWA |

## Requisitos funcionais → código → teste

| FR | Onde | Teste (`tests/prisma.spec.ts`) |
|---|---|---|
| 001, 002, 015, 016 | `PrismaIntro.tsx` | introdução: três passos, CTA, privacidade e aviso de escopo |
| 003 | CTA `#formulario` | campos obrigatórios (foco no título do formulário) |
| 004, 005 | `schema.ts` (`FIELDS`, `validate`), `PrismaApp.tsx` | campos obrigatórios: erro textual, foco no primeiro inválido |
| 006, 007 | `PrismaApp.tsx` (`#prisma`), `PrismaSheet.tsx` | preview a partir do formulário; editar preserva; `#prisma` sem dados volta ao formulário |
| 008, 009, 010 | `window.print()`, `@media print` + `@page prisma` | Exportar PDF aciona `window.print()`; a impressão leva só a folha, em uma página A4 (PDF 595 × 842 pt) |
| 011, 012 | `schema.ts` (`load/save/clear`) | sem opt-in nada no localStorage; com opt-in grava e recarrega; limpar remove; storage indisponível |
| 013, 014 | `public/prisma/{manifest.webmanifest,sw.js}`, `root.tsx` | manifest válido; service worker; abre offline e o fluxo continua |
| 017 | tokens `--ps-*` em `global.css` (valores do pack) | a folha é clara também no tema escuro |
| 018 | layout responsivo, folha escalada | preview cabe no celular (390 px) |
| 019 | texto como texto React | texto digitado nunca vira HTML |
| 020 | `formatGenerated` | preview traz "Gerado em …" |
| PRD §16 | — | nenhuma requisição leva o conteúdo; nenhum método não-GET em `/prisma*` |

## Desvios e decisões (para o OWNER)

1. **Fontes.** O site carrega Inter e IBM Plex Mono do Google Fonts (ADR-11). O Prisma não depende delas: sem rede
   cai nos fallbacks locais. O pack original pedia zero recurso externo; para isso seria preciso empacotar as fontes.
   Nenhuma requisição de fonte leva dados do formulário.
2. **Limites por campo** (FRD §5 pede limites sem números): contexto 240, objetivo 180, demanda 200, atrito 200,
   compensação 200, bloqueios 200, próxima ação 180, prioridades 90, nome e tempo 60. São o máximo que cabe na
   folha com margem (medido com todos os campos no limite).
3. **Ícones** são os da marca (`/favicon/`), não ícones próprios do Prisma.
4. **Cabeçalho do site dentro do app instalado.** O PWA abre em `/prisma/`; os links do cabeçalho levam a páginas
   fora do escopo e abrem no navegador.
5. **Estado PRINT** do FRD §7: a impressão é feita direto do PREVIEW por CSS (`@media print`), sem um estado extra.
6. **Áreas da Loja** (18): importadas, sem rota. Ver ADR-14.

## Fora do escopo da V1 (como no PRD)

Conta, backend, sincronização, PDF no servidor, IA gerando conteúdo, compartilhamento por link, analytics do conteúdo.
