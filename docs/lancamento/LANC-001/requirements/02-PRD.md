# LANC-001 — PRD · Risco Cognitivo: lançamento editorial + mapa causal

- **ID:** RC-PRD-001 · **Versão:** 0.1.0 · **Data:** 2026-10-04 · **Status:** PREPARED (aguarda Q1–Q8)
- **Owner:** A DEFINIR (GAP-01) · **App:** `apps/blog` (Risco Cognitivo) · **Produção:** `main` → Workers Builds
- **Fontes:** `intake/` (LANC-001 e DOCS-002), decisões DEC-U1…U5, conflitos CF-01…15 (`01-DECISOES-E-AMBIGUIDADES.md`)

## 1. Problema

O site já publica conteúdo editorial sobre risco cognitivo, mas:

- a identidade e a navegação ainda não seguem os mockups aprovados (v6/v7);
- o conteúdo canônico novo (3 pilares, 4 artigos, fontes) ainda não está publicado;
- não existe ponte entre ler e investigar: o mapa (`/mapas`) é estático e não há ferramenta nem resultado;
- o conhecimento (fatores, compensações, evidências) não está num modelo de dados, então artigos, mapa, Loja e
  analytics não se correlacionam (Teia Única).

## 2. Objetivo

Transformar o site numa jornada **Descobrir → Entender → Explorar → Resultado → Próxima ação**, com identidade
Brand Local, conteúdo canônico e um mapa causal mobile-first alimentado por um grafo único e rastreável.

## 3. Público

Profissionais e gestores que executam trabalho do conhecimento, incluindo pessoas neurodivergentes, que querem
entender onde o desenho do trabalho cria demanda cognitiva evitável. O foco é sempre o **sistema de trabalho**,
nunca a característica individual como risco (RC-LP-001, CF-06).

## 4. Escopo

| Dentro (esta onda) | Fora (backlog ou bloqueado) |
|---|---|
| Logo e favicon (EP-01) | Simulação "e se…" estilo LOOPY (RQ-081) |
| Tokens Brand Local + ilustração + motion (EP-02) | Ferramentas, Resultado e conteúdo do scanner (EP-10, GAP-02) |
| Shell e navegação v6/v7 (EP-03) | Analytics de eventos (RQ-111, GAP-03) |
| Imagens RC e bloco 100vh do artigo (EP-04) | Adapters da Teia na Loja e no Quick Framework (EP-12, GAP-01) |
| Home e 4 artigos canônicos + fontes (EP-05) | Contas de usuário, persistência em servidor |
| Menu, jornada e CTAs (EP-06) | Supabase (CF-08) |
| Schema do grafo + grafo inicial (EP-07) | |
| Mapa Explorar + Detalhe + Lista (EP-08); Personalizar (EP-09, P2) | |

## 5. Princípios de produto

1. **Uma decisão por região:** um CTA primário; escada de compromisso (RQ-053).
2. **Progressive disclosure:** no celular, nunca o grafo inteiro; no máximo 8 nós na abertura (RQ-070).
3. **Tocar = navegar:** nada essencial depende de hover, pan ou zoom (RQ-075).
4. **Evidência antes de número:** nenhum valor sem `evidence_id` (RQ-063); hipótese é rotulada como hipótese.
5. **Conceito próprio é rotulado como próprio** (RQ-043).
6. **Acessível por padrão:** WCAG 2.2 AA + Apple HIG (ADR-M03); cor nunca é o único sinal (RQ-012, RQ-076).
7. **Uma marca:** Brand Local v7 em tudo (DEC-U2); a camada de ilustração só ilustra (RQ-011).

## 6. Métricas de sucesso

| Métrica | Meta | Como medir |
|---|---|---|
| Core Web Vitals p75 (mobile e desktop) | LCP ≤ 2,5s · INP ≤ 200ms · CLS ≤ 0,1 | RQ-110 |
| Gate HIG | 0 P0/P1 em todas as rotas | `tests/hig.spec.ts` |
| Artigo → mapa ou ferramenta | taxa de clique no CTA final (linha de base na 1ª semana) | RQ-111 (quando GAP-03 fechar) |
| Mapa: sessões com ≥ 2 nós explorados | linha de base na 1ª semana | idem |
| Rastreabilidade | 100% dos nós com artigo de origem; 0 números sem evidência | testes do RQ-062/RQ-063 |

## 7. Riscos

| Risco | Mitigação |
|---|---|
| React Flow pesa no bundle e no INP | Carregado só em `/mapas/explorar`, client-only (RQ-079) |
| Mapa vira grafo ilegível no celular | Foco local, ≤ 8 nós, lista alternativa (RQ-070, RQ-073) |
| Enquadramento clínico (saúde, idade) entra pelo mockup | Nós de exemplo descartados (CF-06) |
| Coral e azul claro sem contraste | Só decorativos (RQ-012) |
| Mudar URLs derruba SEO | Manter URLs, mudar rótulos (CF-13) |
| Decisões em aberto travam a onda | P0 e P1 READY podem começar; NEEDS_CONFIRMATION esperam Q1–Q8 |

## 8. Entregáveis por PR (ordem em `00-PLANO-DE-IMPORTANCIA.md`)

PR-A logo · PR-B tokens + ADR-13 · PR-C shell · PR-D imagens · PR-E conteúdo · PR-F jornada · PR-G grafo ·
PR-H mapa · PR-I personalizar · PR-J ferramentas · PR-K medição · PR-L adapters da Teia.

Especificações: `03-FRD.md` (requisitos), `04-UIX-SPEC.md` (telas e interação), `05-TOKENS-SPEC.md`
(tokens), `06-DATA-SPEC-GRAFO-CAUSAL.md` (dados).
