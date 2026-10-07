# Handoff: cérebro oco na Landing e no Mapa (BRAIN-NOCT-001)

Para o time de arte e o de código. Feito com a skill Design 1.2.0 (`/design-handoff` e `/ux-copy`).

- **Fonte do objeto:** projeto Claude Design "Claude Design Brain 3D Model" (`343a6542…`), sincronizado em
  `fonte-design/` (ver `fonte-design/SYNC.md`).
- **Fonte da estrutura:** design system Nocturne (`02c4ffae…`).
- **Paleta:** Coliseu (decisão do usuário, 2026-10-07).
- **Escopo:** este pacote só especifica. O site muda no PR seguinte (`RESET-PLAN.md`).

## Visão geral

O site passa a ter **duas rotas**:

| Rota | O que mostra | Cérebro |
|---|---|---|
| `/` (Landing) | Hero assimétrico, cérebro em prévia, Entenda / Estruture / Execute | Painel com o link "Abrir … no Mapa ›", que leva a `/mapas/?foco=` |
| `/mapas/` (Mapa) | O cérebro como peça principal | `?foco=` nos dois sentidos, paginador no celular, link para as relações |

Mockups navegáveis em `prototype/landing.html` e `prototype/mapa.html`. As capturas estão em `mockups/` (6 estados × 1440 e 390 px):

| # | Estado | Arquivo |
|---|---|---|
| 01 | Landing em repouso, girando (página inteira) | `01-landing-repouso-{1440,390}.webp` |
| 02 | Callout que entra com o giro | `02-landing-callout-giro-*.webp` |
| 03 | Mapa com pin selecionado e detalhe aberto (`?foco=COG-MEMORIA-TRABALHO`) | `03-mapa-selecao-*.webp` |
| 04 | Movimento reduzido: parado, chave ligada | `04-mapa-movimento-reduzido-*.webp` |
| 05 | Foco por teclado no pin | `05-mapa-foco-teclado-*.webp` |
| 06 | Sem WebGL (fallback) | `06-mapa-sem-webgl-*.webp` |

## Tokens

Fonte única: `prototype/tokens.css`. Os nomes vêm do Nocturne e os valores, do Coliseu. O único hex fora dele está nas
cores de cena do `brain-hollow.js`, listadas abaixo.

| Token | Valor | Uso |
|---|---|---|
| `--color-bg` | #FFFFFF | Página e palco |
| `--color-surface` | #F5F5F5 | Ícone dos passos 01–03 e hover |
| `--color-text` | #212121 | Texto (16,10:1) e o "preto do botão" do Coliseu |
| `--color-neutral-600` | #5F6068 | Texto secundário e a primeira palavra do h1 (6,25:1) |
| `--color-neutral-500` | #8A8B93 | Chave desligada e ponto do paginador (3,39:1, não texto) |
| `--color-neutral-300` / `-200` | #CBCBCB / #E6E6EA | Contorno de botão secundário, borda do painel |
| `--color-accent` | #6E72F0 | Traço, pin, contorno do primário, cantos do callout. **Nunca texto pequeno** (3,94:1) |
| `--color-accent-text` (= `-600`) | #4F53D9 | Link, rótulo, botão primário e pin selecionado (5,88:1) |
| `--color-accent-100/200` | #F3F4FF / #E4E6FF | Hover e anel de hover do pin |
| `--color-accent-400` | #A3A8F5 | Tracejado do callout |
| `--brain-wire-front/back` | #C4C5CE / #DCDDE3 | Malha de contornos (frente/verso) |
| `--brain-point-light/deep` | #BFC2F8 / #5A5FE8 | Pontos (borda do campo → centro do campo/giro) |
| `--brain-grid-dot` | #DCDCE1 | Retícula do Coliseu (22 px) |
| `--radius-md` | 8 px | Botão, painel, palco. O callout fica com **2 px** (assinatura do globo) |
| `--space-*` | 2,8 … 67,2 px | Escala do Nocturne (densidade 0,7×) |
| `--target` | 44 px | Altura mínima de todo controle (desvio do `.btn` do Nocturne, A11Y-07) |
| Tipo | Inter 500; corpo 16 px; display `clamp(40px, 6vw, 72px)`; rótulo 12 px com +0,12em | Nocturne. O corpo sobe de 15 para 16 px (piso de leitura HIG) |

## Camadas da cena (para a arte)

Os parâmetros vêm de `fonte-design/brain-hollow.js` (`HOLLOW_DEFAULTS`). A malha **não** é desenhada.

| Camada | O que é | Parâmetros | Dica de arte |
|---|---|---|---|
| Fundo | Branco + retícula de pontos | `--brain-grid-dot`, passo de 22 px | A retícula fica só no palco e no hero, nunca atrás do texto do painel |
| Malha (contornos) | 13 latitudes + 9 meridianos fatiados do córtex; só faces voltadas para fora (sem parede medial nem paredes de sulco) | `front` #C4C5CE, `back` #DCDDE3, opacidade 0,85, verso × 0,18 | É o "globo oco": linha fina de 1 px, sem sombra |
| Pontos | 42 000 partículas do córtex e cerebelo, mascaradas por ruído fbm em campos e vazios; fundo de sulco e tronco abertos | `light` #BFC2F8 → `deep` #5A5FE8, 1,9 px, verso × 0,14, máscara 1,7/0,55/0,07 | Os campos fazem o papel dos "continentes" do globo |
| Pins | Círculo de 36 px em alvo de 44 px; ícone de 18 px | Borda de 1,5 px `--color-accent`; ativo = fundo `--color-accent`; selecionado = `--color-accent-600` + anel branco de 4 px + anel índigo de 1,5 px | Opacidade = 0,35 + facing × 1,6; some no verso |
| Callouts | 220 × auto, fundo branco a 92 %, tracejado de 1 px `--color-accent-400`, cantos sólidos de 12 px e 2 px de espessura | Título 15/600, resumo 13,5 px `--color-neutral-600` | Afastado 30 px do pin, no lado aberto do palco |
| Painel | Borda de 1 px `--color-neutral-200`, raio 8, 360 px de largura ≥ 1100 px | Lista: ícone de 32 px, título 15/600, resumo 13,5. Detalhe: h2 22/500 + ícone de 28, linhas com regra que esmaece | — |

**Pendências de arte** (vindas do protótipo):
- pôster oco do fallback (C-09);
- tamanho do callout no celular (C-08);
- coordenadas editoriais das âncoras: hoje `dir` em espaço do objeto (+x anterior, +y superior, +z direita), com
  Planejamento [1, 0,25, 0,3], Memória [0,2, 0,85, 0,5], Controle [0,55, −0,55, 0,65] e Flexibilidade [−0,65, 0,55, 0,55].

## Layout e responsivo

| Faixa | Palco | Painel | Controles |
|---|---|---|---|
| ≥ 1100 px | `minmax(0,1fr)`, altura `clamp(360px, 52vw, 600px)` | Coluna de 360 px ao lado | Uma linha: Pausar/Girar · Restaurar · dica · chave |
| 600–1099 px | Largura total, mesma altura | Abaixo, com o paginador acima | Quebram em linhas |
| < 600 px | 320 px de altura; 1 vaga de callout | Abaixo, com paginador de 5 pontos (visão geral + 4 funções) | Empilham; a dica ocupa a linha inteira |

Landing: hero à esquerda (rótulo, h1 em dois tons, lead de 46ch, primário com contorno + secundário), cérebro, passos
01–03 em 3 colunas (1 coluna < 900 px) e rodapé mínimo com as duas rotas.

## Motion e interação (contrato do protótipo, que não muda)

| Item | Valor | Regra |
|---|---|---|
| Giro automático | 0,03 rad/s | Só na visão geral, sem seleção, sem pausa e fora do movimento reduzido |
| Arraste | 0,003 rad/px | Começa depois de **8 px**. Vertical no toque = rolagem (o gesto é abandonado). Vertical com mouse/caneta inclina de −0,5 a 1,1 rad |
| Pausa | Persistente na sessão | Arrastar, selecionar ou focar o painel ou um pin pausa. **Só "Girar" retoma.** Fechar o painel não retoma |
| Suspensão | IntersectionObserver e aba oculta | Suspende sem mexer na pausa |
| Callout automático | Entra com `facing > 0,32`, sai com `< 0,12` | Permanência mínima de 6 s antes de trocar; 2 vagas ≥ 600 px, 1 vaga abaixo; colisão descarta o de menor prioridade; acomodação de 300 ms depois de arraste |
| Selecionar pela lista | Traz a âncora escondida | 0,9 s ease-out cúbico (corte com movimento reduzido); clicar em pin visível nunca move o objeto |
| Restaurar vista | x 0,16, y −0,42 | Volta à visão geral e pausa |
| Movimento reduzido | `prefers-reduced-motion` ou a chave | Começa parado; transições de 0 ms; chave persistida em `localStorage` (`rc-home-brain`) |
| Fade | 180 ms | Callouts e pins |

### Mapa de eventos (para o código)

| Evento | Efeito | Analytics (ADR-20) |
|---|---|---|
| Clique ou Enter no pin / no callout / no item da lista | `select(i)`: painel em detalhe; no Mapa, `?foco=` via `replaceState` | `TOOL · select · capability_id` (igual ao atual) |
| Clique no link do painel | Landing → `/mapas/?foco=ID`; Mapa → relações | `TOOL · cta · capability_id` |
| × ou Esc | Volta à lista; remove `?foco=` | — |
| Botão do paginador | Seleciona a função ou volta à visão geral | `TOOL · select` |
| `?foco=ID` ao abrir o Mapa | Seleciona depois da hidratação e traz a âncora | — |

## Código (para o PR de implementação)

Reaproveitar do site atual:
- o ciclo de vida do `brain-renderer.client.ts` (import só depois da hidratação, `AbortSignal`, Resize, Intersection,
  `visibilitychange`, perda de contexto e `dispose` completo);
- o `BrainHero.tsx` (status `loading/ready/fallback`, retry, `noscript`, roving tabindex, `track`);
- os IDs do grafo.

| Arquivo | Mudança |
|---|---|
| `app/features/home-brain/brain-renderer.client.ts` | Troca `brain-points.bin` + `PointsMaterial` por `createHollowBrain` (contornos `LineSegments` + `ShaderMaterial` dos pontos). A câmera passa a caber por largura **e** altura (`frame()` do protótipo). O controller ganha `project(): { id, sx, sy, facing, inside }[]` a cada quadro e `aimAt(id)` |
| `app/features/home-brain/BrainHero.tsx` | Os pins deixam de usar `--mx/--my` fixos e passam a ser posicionados pelo `project()`. Entra a camada de callouts (`aria-hidden`), o painel lista → detalhe e o paginador. Mantém o roving tabindex (A11Y-06). Foco num pin pausa (A11Y-04). Limiar de 8 px (C-04) |
| `app/data/mapa-brain.ts`, `app/data/home.ts` | Cada função ganha `dir`, `priority`, `summary`, `lead`, `demand`, `risk` e `help`. Os textos de Planejamento, Controle e Flexibilidade são **rascunho do protótipo**: passam pelo canônico antes de publicar |
| `public/models/home-brain/` | Sai `brain-points.bin`. Entram `brain-particles.bin`, `brain-particles-attr.bin` e o asset de contornos (abaixo) |
| `scripts/` | O gerador `fonte-design/build/build-brain-assets.js` (via `run-node.mjs`) roda no `prebuild` ou fica versionado com o hash |

**Orçamento de asset (C-11).** O GLB de 9,47 MB só serve para fatiar os contornos e achar as âncoras. Proposta:
- o build pré-calcula os segmentos dos contornos (`contours()`) e as 4 âncoras (`anchor(dir)`);
- grava `brain-wire.bin` e `brain-anchors.json`. Medido no protótipo: 32.679 segmentos, que dão ≈ 392 kB em Int16
  com o mesmo encoding das partículas, ou ≈ 784 kB em Float32. Das 42.000 partículas, a máscara mantém 14.020;
- o navegador não baixa o GLB.

Estimativa de download no navegador: ≈ 0,7 MB, contra 9,8 MB.

**Edge cases.**

| Caso | O que acontece |
|---|---|
| Sem JS | Lista das 4 funções com links (`noscript`, como hoje) |
| Sem WebGL ou falha do asset | Pôster oco (pendente, C-09), mensagem, painel com lista e "Tentar carregar o 3D novamente" |
| Contexto WebGL perdido | Fallback (já existe) |
| `?foco=` inválido | Ignorado; visão geral |
| Âncora no verso selecionada pela lista ou pelo `?foco=` | `aimAt` traz para a frente |

**Testes que mudam.** O `home-brain.spec.ts` mantém os contratos de status, teclado, `?foco=` e movimento reduzido, e
ganha:
- o pin some no verso;
- o callout entra com o giro;
- o limiar de 8 px;
- o foco pausa;
- 1 vaga de callout abaixo de 600 px.

## Texto da interface (ux-copy)

| Lugar | Texto | Nota |
|---|---|---|
| Dica abaixo do palco | "Arraste para explorar · Toque em um marcador para ler" | No desktop pode ser "Clique em um marcador" (o mockup do usuário usa "Clique para ver detalhes") |
| Botão de motion | "Pausar" / "Girar" | O verbo descreve a ação, não o estado |
| Chave | "Movimento reduzido" | Igual ao mockup do usuário |
| Painel, lista | "Funções executivas" + "Quatro capacidades que sustentam a execução. Escolha uma para ver demanda, dificuldade e apoio." | — |
| Painel, detalhe | Rótulos "Demanda", "Dificuldade possível", "Estratégia de apoio" | Iguais ao site e ao mockup |
| Link do painel | Landing: "Abrir {função} no Mapa ›"; Mapa: "Explorar as relações de {função} ›" | — |
| Nota | "Os marcadores indicam acessos a redes distribuídas, não regiões clínicas exatas." | Mantém a ressalva anatômica do site |
| Fallback | "A visualização 3D não está disponível neste navegador. As quatro funções continuam na lista." | O que aconteceu e onde continuar |

## Pendências antes de implementar

1. G2 do ACEITE: aprovar a paleta índigo e os textos dos cards.
2. C-08 (callout no celular) e C-09 (pôster oco) no Claude Design.
3. Corrigir a tabela de hashes do PROVENIENCIA (C-10).
4. Decisões do RESET-PLAN (sub-rotas do Mapa).
