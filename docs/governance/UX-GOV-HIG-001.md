# UX-GOV-HIG-001 — APPLE-HIG-WEB: regra transversal de interface

| Campo | Valor |
|---|---|
| ID | UX-GOV-HIG-001 |
| Versão | 1.0.0 |
| Área | Design System / UX / Frontend / Acessibilidade |
| Workflow | Design → Implementação → Auditoria → Release |
| Owner | A DEFINIR |
| Status | **ACEITA** — vigente para todo app do monorepo (ADR-M03) |
| Automação | A4 (gate automatizado + auditoria registrada + reteste) |
| Data | 2026-10-02 |

## Objetivo

Estabelecer o Apple Human Interface Guidelines como princípio transversal de experiência para todas as
interfaces do ecossistema EXECUTAR, complementado pelos padrões técnicos da Web. Nenhuma página, rota,
template ou componente reutilizável é considerado VERIFIED sem passar pelo gate aplicável.

## Fontes normativas

1. Apple Human Interface Guidelines — https://developer.apple.com/design/human-interface-guidelines/
2. Apple Design Principles (Purpose, Agency, Responsibility, Familiarity, Flexibility, Simplicity, Craft, Delight).
3. WCAG 2.2, nível AA — https://www.w3.org/TR/WCAG22/
4. WAI-ARIA Authoring Practices, quando o HTML nativo não basta — https://www.w3.org/WAI/ARIA/apg/
5. Design System e tokens oficiais de cada produto (no blog: `apps/blog/CLAUDE.md`, ADR-09 a ADR-12).

**Referência de anatomia de página (fonte de verdade de layout):** https://developer.apple.com/programs/ —
hero com título e lead curto; seções empilhadas com ícone ou ilustração, título, parágrafo de 2–3 frases e
link "Saiba mais ›"; cards de comparação; rodapé-diretório. A referência é estrutural: não se copia a
aparência do iOS (Liquid Glass, SF Symbols etc.), e a identidade da marca prevalece.

## Princípios obrigatórios

| Princípio | Regra transversal na Web |
|---|---|
| Purpose | cada tela, componente e CTA justifica sua existência |
| Agency | a pessoa mantém o controle: cancelar, voltar, desfazer; sem caminho forçado |
| Responsibility | privacidade, segurança, transparência; permissões no contexto |
| Familiarity | mesmos elementos = mesmos comportamentos; padrões web reconhecíveis |
| Flexibility | responsivo, teclado, toque, zoom e reflow; diferentes capacidades |
| Simplicity | hierarquia clara, linguagem direta, baixa carga cognitiva |
| Craft | alinhamento, tipografia, estados, desempenho, nenhum detalhe quebrado |
| Delight | qualidade percebida que resulta dos anteriores, nunca decoração gratuita |

## Regra de implementação Web

`APPLE HIG + WCAG 2.2 AA + HTML semântico + ARIA (quando necessária) + Responsive Web Design + Design System`
formam a baseline obrigatória. Para produtos de leitura vale ainda: **nenhum texto desestruturado** — todo
texto ocupa um slot da anatomia (título, lead, parágrafo, lista, definição, tabela), dentro da medida de
leitura, sem texto corrido em fonte mono.

## Gate de auditoria

| Controle | Domínio | Verificação automatizada (blog: `tests/hig.spec.ts`) |
|---|---|---|
| AUD-HIG-01 | Purpose / IA | manual (checklist) |
| AUD-HIG-02 | Agency | manual (checklist) |
| AUD-HIG-03 | Familiarity / Consistency | tokens e componentes únicos (`tokens.spec`, `surfaces.spec`) |
| AUD-HIG-04 | Simplicity / Cognitive load | manual (checklist) |
| AUD-HIG-05 | Layout / Responsive | reflow em 320 px; alvos ≥ 24 px (WCAG 2.5.8); medida ≤ 75 caracteres |
| AUD-HIG-06 | Typography / Color | medida; nada de prosa mono; contraste claro/escuro |
| AUD-HIG-07 | Accessibility | axe WCAG 2.0/2.1/2.2 A+AA; um h1 e níveis sem salto; landmarks, skip link, `lang`; `alt`; foco visível |
| AUD-HIG-08 | Responsibility / Privacy / Safety | manual (checklist) |
| AUD-HIG-09 | Craft / Performance / States | decorativos fora do texto; estados de carregando/vazio/erro (testes do app) |

Cada controle produz: `RULE_ID`, `ROUTE`, `COMPONENT`, `REQUIREMENT`, `SOURCE`, `STATUS`
(PASS | PARTIAL | FAIL | N/A), `SEVERITY` (P0 | P1 | P2 | P3), `EVIDENCE`, `REMEDIATION`, `OWNER`,
`VERIFICATION`.

## Critério de release

- **P0** bloqueia release. **P1** corrige antes de produção, salvo waiver registrado. **P2** backlog
  obrigatório. **P3** melhoria.
- **DONE** somente quando: implementado + testado + evidência registrada + reteste aprovado.
- O gate automatizado roda no `npm test` de cada app: P0/P1 falham o build de testes e bloqueiam o merge
  (ADR-M02: merge só com verificações verdes).

## Fluxo de auditoria de uma página

URL → captura desktop/mobile → DOM/semântica → teclado → acessibilidade → responsivo → estados → mapeamento
HIG → achados → correções → reteste → evidência → VERIFIED.

Navegadores: Safari/iPhone, Safari/macOS e pelo menos um Chromium. Ambientes sem WebKit (como o container de
CI desta sessão) emulam o iPhone por viewport no Chromium; o teste em Safari real é registrado como
VERIFICATION manual.

## Arquitetura documental

`UX-GOV-HIG-001 → DESIGN_SYSTEM → PRD → FRD → SPEC → COMPONENT → PAGE/ROUTE → AUDIT → RELEASE_GATE`.
A regra fica acima dos produtos e é herdada por todos eles; cada app registra sua auditoria em
`apps/<app>/docs/audit/HIG-WEB-AUDIT.{json,md}`.
