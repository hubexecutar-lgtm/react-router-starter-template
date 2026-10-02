# HANDOFF-RC-GLOBAL-DESIGN-CONTENT-001 — 00 · Entradas

> **Proveniência (monorepo).** Registro produzido no repositório original do Blog (Astro),
> branch `claude/trusting-gates-go053v` @ `8b567b1`, e portado para `apps/blog` (RC-DESIGN-MOCKUPS-001, PR A).
> Caminhos `src/…` e páginas `.astro` citados abaixo correspondem a `app/…` e às rotas `.tsx`
> (mapa em `docs/migrations/BLOG-001.md` na raiz). Números de ADR já seguem o `CLAUDE.md` deste app.
> As decisões C-02/C-03 de `03-reconciliacao.md` (paleta do mockup recusada) foram revistas pelo
> RC-DESIGN-MOCKUPS-001: o usuário adotou os valores exatos do mockup (aplicados no PR B).

VERSION: 1.0.0 · DATA: 2026-10-01 · OWNER: A DEFINIR · AUTOMATION_LEVEL efetivo: A3 (ver `05-verificacao.md`)

## Arquivos recebidos

| Arquivo | SHA-256 (prefixo) | Conteúdo verificado | Uso |
|---|---|---|---|
| `DS-SURFACE-UNIFICATION-HANDOFF-001-v1.1.0.zip` | `61691e57` | handoff `.md`, mockflow HTML, `spec/surfaces.css`, evidências da auditoria | contrato de superfícies; já implementado na `main` (commit `66d7642`, ADR-09) antes desta entrega |
| `Design-1.2.0-v1.zip` | `867f35d3` | plugin com 7 skills (design-critique, design-system, design-handoff, accessibility-review, ux-copy, user-research, research-synthesis) | workflows aplicados como checklist de crítica, sistema e handoff; nenhum conector instalado |
| `untitled_folder.zip` | `d78ee32d` | 10 PNG 1672×941 (mood boards 01–10) | referência de apresentação e copy visível; cópias comprimidas em `referencias/` |
| `executar-block-quick-frameworks-v1.0.0.zip` | `207d47a3` | skill editorial (contratos, template, validador) | workflow editorial dos artigos; copiada para `tools/executar-block-quick-frameworks/` |
| Captura `1.jpg` (chat) | — | `/admin/design-system/#plain` em produção | confirma tokens Plain e tabela já existentes |
| **Arquivo MySQL** | — | **não recebido** | ver lacuna L-01 |

## Fonte dos registros (decisão do usuário)

Sem o `.sql`, o usuário decidiu usar o **banco embutido no Hub Editorial** (`window.__SEED__` em
`public/hub-editorial/index.html`) como fonte de registros. Estado encontrado:

| Módulo | Registros | Observação |
|---|---|---|
| content (CNT-RC) | 3 | 0001–0003, status ARGUMENTAÇÃO, sem texto |
| brief | 3 | um por CNT |
| arguments (ARG-RC) | 7 | classes D · Interno e E · Inferido |
| evidence (EVD-RC) | 5 | URLs de prior art (APM, ProjectManagement.com) |
| production | 3 | corpo vazio (0 palavras) |
| assets / visuals / shorts / social | 6 / 3 / 3 / 3 | planejados |
| taxonomy (TAX-RC) | 8 | os 8 territórios com slug |
| backlog (IDE-RC) | 2 | |
| decisions (DEC-RC) | 2 | naming e design do CMS |

O banco tinha estrutura e briefing, mas nenhum texto de artigo: os artigos foram **escritos** a partir dele
(ampliação editorial registrada em `04-artigos.md`), não extraídos.

## Precedência aplicada

1. Pedido explícito do usuário e regras do repositório (`CLAUDE.md`, ADR-01…ADR-09).
2. UI e tokens existentes (`src/styles/global.css`, ADR-09) — fonte canônica da implementação visual.
3. Banco editorial (registros, IDs, relações).
4. Handoff de superfícies (contrato de componentes).
5. Mood boards (hierarquia, layout, copy de navegação/CTA).

## Lacunas

| ID | Lacuna | Impacto | Estado |
|---|---|---|---|
| L-01 | `.sql` não recebido | sem conciliação com o banco MySQL original | BLOCKED (só a conciliação); seed do Hub adotado como fonte |
| L-02 | provedor de newsletter | `/signup/` sem coleta | A DEFINIR |
| L-03 | canal de contato | `/contact/` sem formulário | A DEFINIR |
| L-04 | controlador de dados | `/privacy/` descritiva, não jurídica | A DEFINIR |
| L-05 | logotipo/OG definitivos | favicon monograma “RC” provisório; OG = foto do artigo-tese | A DEFINIR |
| L-06 | fotos dos mood boards | não existem como arquivo; imagens reaproveitadas de `public/about/` | decisão do usuário |
| L-07 | owner da implementação | — | A DEFINIR |
