# LANC-001 — UIX Spec

- **ID:** RC-UIX-001 · **Versão:** 0.1.0 · **Base:** v6 + v7 (DEC-U1), RC-MOBILE-CAUSAL-MAP-UI-001, Índex de rotas
- **Gate:** UX-GOV-HIG-001 (ADR-M03) e anatomia de página do ADR-12 · Requisitos citados entre parênteses

## 1. Mapa de rotas

| Rótulo | URL | Situação | Tela / origem |
|---|---|---|---|
| Início | `/` | existe; conteúdo novo | Home RC-LP-001 (RQ-040) |
| Artigos | `/blog`, `/blog/:slug` | existe; rótulo novo | índice por problemas (RQ-054); artigo com bloco 100vh (RQ-032) |
| Mapa | `/mapas` | existe | entrada do mapa: story curta + CTA "Explorar" |
| — | `/mapas/explorar` | **nova** | SCR-02 Explorar (RQ-070) |
| — | `/mapas/explorar/:fatorId` | **nova** | SCR-03 Detalhe (RQ-072) |
| — | `/mapas/personalizar` | **nova**, P2 | SCR-04 (RQ-090) |
| Ferramentas cognitivas | `/ferramentas`, `/ferramentas/:tipo`, `/ferramentas/:tipo/:slug` | **nova**, substitui a Loja | catálogo reaproveitado (RQ-100, RQ-103) |
| — | `/loja/*` | **retirada** | 301 para `/ferramentas/*` (DEC-U9) |
| Sobre | `/about` | existe; rótulo novo | — |
| Temas, Guias, Evidências | `/temas`, `/guias`, `/evidencias` | existem | ficam no drawer e no rodapé-diretório |

URLs mantidas e só os rótulos mudam (DEC-U8), exceto a Loja, que deixa de existir (DEC-U9). Toda rota nova entra no hub (RQ-051).

## 2. Shell (todas as rotas)

| Elemento | Desktop ≥ 900px | Mobile < 900px |
|---|---|---|
| Nav superior | marca + Artigos · Mapa · Ferramentas · Sobre + busca; trilha de categorias inline (RQ-020) | marca + busca + botão de menu |
| Drawer | não existe | `min(84vw,360px)`, todos os destinos + Temas, Guias, Evidências (RQ-021, RQ-023) |
| Barra inferior | não existe | Início · Mapa · Ferramentas, alvo ≥ 44px (RQ-021, RQ-025) |
| Scroll | nav esconde ao descer e volta ao subir | nav **e** barra inferior escondem e voltam juntas (RQ-022) |
| Rodapé | rodapé-diretório (ADR-M03) | idem, em coluna |

Estados do chrome: `visível` → (desce > limiar) → `oculto` → (sobe, foco por teclado ou drawer aberto) → `visível`.

## 3. Motion (v7)

| Token | Valor | Uso |
|---|---|---|
| `--ease` | `cubic-bezier(.22,1,.36,1)` | toda transição de UI |
| `heroReveal` | opacity 0→1 · translateY 18px→0 | entrada do hero (RQ-024) |
| chrome | translateY ±100% com `--ease` | esconder e mostrar a nav (RQ-022) |
| sheet | snap entre alturas com `--ease` | bottom sheet do mapa (RQ-071) |
| mapa | recentrar com animação de viewport | toque em nó (RQ-070) |

`prefers-reduced-motion: reduce` → sem animação e sem transição; o estado final aparece direto (RQ-014).

## 4. Anatomia das páginas

**Home (RQ-040, ordem do Índex):** Hero (título RC-LP-001, lead, 2 ações: Explorar riscos · Ler os 3 pilares)
→ "O que você está enfrentando?" (chips de problema) → Entenda (3 pilares, cada um com "Saiba mais ›")
→ Investigue (Mapa, Ferramentas cognitivas) → Aplique (Guias) → Continue (próximo conteúdo).

**Artigo (RQ-032, RQ-044, RQ-045):** eyebrow (pilar) + h1 + lead → bloco de imagem 100vh, **obrigatório em todo artigo** (DEC-U7) (retrato no mobile,
16:9 no desktop) → corpo dentro de `--measure` → referências → bloco "Próximo passo" (1 CTA primário + relacionados).

**Mapa / Explorar (SCR-02):**

```
┌──────────────────────────────┐
│ Explorar                  ⌕  │
│ [Mapa causal] [Lista] [Tipos]│  abas (Lista = RQ-073)
│ (Todos)(Demanda)(Risco)(…)   │  chips por tipo (RQ-074)
│                              │
│        ● Perda de contexto   │  nó focal + ≤ 7 vizinhos
│     ↙        ↓        ↘      │  aresta: traço + rótulo
│  Interrupção  Sobrecarga  …  │
│                              │
│ ⓘ Toque em um fator          │  info bar
├──────────────────────────────┤
│ Início │ Mapa │ Ferramentas  │  barra inferior
└──────────────────────────────┘
```

Toque em nó: selecionar → destacar arestas → esmaecer o resto → recentrar → expandir vizinhos → abrir o sheet
recolhido. Toque no fundo: limpar a seleção. Pinça e arraste: zoom e pan (secundários).

**Detalhe (SCR-03 / bottom sheet, RQ-071/072):** snap recolhido (nome + tipo + "Explorar relações") · médio
(descrição + contagens: causas, impactos, compensações) · expandido (abas Causas · Impactos · Soluções ·
Evidências). Em `/mapas/explorar/:fatorId` o mesmo conteúdo vira página, com voltar.

**Personalizar (SCR-04, RQ-090):** passo 1/3 focos de trabalho · 2/3 interesses (nós) · 3/3 "Mostrar
evidências" → Continuar. Guardado localmente; muda só ordem e destaque.

## 5. Semântica visual do grafo (RQ-076)

| Tipo | Forma | Tipo | Forma |
|---|---|---|---|
| objective / context | ● | event | ✦ |
| demand | ◆ | impact | ⬢ |
| capacity / vulnerability | ■ / ▲ | compensation / control | ✓ |
| exposure / risk | ! | evidence | ○ |

Aresta: `increases` sólida forte · `decreases` sólida média · `contributes_to`/`mediates`/`moderates` sólida fina ·
`associated_with` e relação `E_INFERRED` tracejada. Sempre com rótulo textual ("aumenta o risco de").

## 6. Acessibilidade específica

- Grafo com `role="application"` só no canvas; a aba Lista é a via principal para leitor de tela (RQ-073).
- Seleção exposta (`aria-selected` / anúncio em `aria-live`).
- Teclado no desktop: Tab entre nós vizinhos; Enter seleciona; Esc fecha o sheet.
- Reflow em 320px sem rolagem horizontal (RQ-077); alvos ≥ 44px (RQ-025).
