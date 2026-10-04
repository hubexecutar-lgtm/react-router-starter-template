# Funções executivas: revisão de acessibilidade e UX copy (v7 → v8)

- **Peça:** `funcoes-executivas-v7.html` (guia + 16 reportagens num único HTML), enviada pelo usuário em 2026-10-04.
- **Saída:** `funcoes-executivas-v8.html`, gerada por `python3 build-v8.py` (a v7 fica na pasta como origem).
- **Objetivo:** corrigir acessibilidade (WCAG 2.2 AA, gate UX-GOV-HIG-001 / ADR-M03) e o texto, para que cada
  reportagem leve o leitor às ferramentas da Loja que aplicam o que ele acabou de ler.

## Resultado medido

Chromium (Playwright) + axe-core, tags `wcag2a/2aa/21a/21aa/22aa` + `best-practice`, viewport 390 × 844.

| Medida | v7 | v8 |
|---|---|---|
| Violações axe (guia, 2 artigos, índice) | 1 (`landmark-unique`) | 0 |
| Controles focáveis invisíveis na tela inicial | 51 | 0 (os 4 links do menu desktop ficam com `display:none` no celular e não recebem foco) |
| Rolagem horizontal a 390 px | não | não |
| Foco ao abrir um artigo | fica no botão clicado, que sumiu | vai para o `h1` do artigo |
| Título da aba por artigo | sempre "Funções executivas" | título do artigo |
| Voltar do navegador / link direto para um artigo | não funciona | funciona (`#controle-inibitorio` etc.) |
| Sem JavaScript | só a tela inicial; os 16 artigos ficam inacessíveis | os 17 textos legíveis em sequência, com âncoras |
| Caminhos para a Loja | 0 | 16 × 3 (um por formato, em cada artigo) + faixa na tela inicial + menu, barra e rodapé |

## Achados de acessibilidade

| RULE_ID | COMPONENT | REQUIREMENT | SEVERITY | EVIDENCE (v7) | REMEDIATION (v8) | STATUS |
|---|---|---|---|---|---|---|
| A11Y-01 | Visões dos artigos | WCAG 2.4.3, 2.4.7, 2.4.11 | P0 | Artigos ocultos com `left:-99999px`: 48 links e botões continuavam no Tab e no leitor de tela, com foco fora da tela | Visões com `hidden` (fora da árvore de acessibilidade e do Tab) | VERIFIED |
| A11Y-02 | Troca de visão | WCAG 2.4.3, 4.1.3 | P0 | Ao abrir um artigo o foco ficava num botão oculto; o leitor de tela não anunciava nada | Foco no `h1` (`tabindex=-1`) e `document.title` atualizado | VERIFIED |
| A11Y-03 | Navegação | WCAG 2.4.5, 2.1.1; HIG Familiarity | P1 | Navegação feita com `<button>` + JS: sem URL por artigo, sem "voltar", sem abrir em nova aba, nada sem JS | Links `<a href="#slug">`; roteamento por `hashchange`; sem JS as âncoras funcionam | VERIFIED |
| A11Y-04 | Cabeçalho | WCAG 2.4.1 | P1 | Sem link para pular o menu fixo | "Pular para o conteúdo" → `main#conteudo` | VERIFIED |
| A11Y-05 | Menus | WCAG 1.3.1, 4.1.2 (`landmark-unique`) | P1 | Dois `<nav>` sem rótulo; glifos ⌂ ◆ ▤ e o "RC" lidos em voz alta | `aria-label` (Principal, Atalhos, Rodapé, Próxima leitura); glifos e logo com `aria-hidden` | VERIFIED |
| A11Y-06 | Barra inferior | WCAG 1.3.1 | P2 | "Início" marcado como ativo para sempre (`.on` nunca mudava) | Estado falso removido | VERIFIED |
| A11Y-07 | Menu que some ao rolar | WCAG 2.4.11 | P1 | Menu e barra escondiam mesmo com o foco dentro deles | `:focus-within` mantém visíveis; `scroll-padding` em cima e embaixo | VERIFIED |
| A11Y-08 | Tabela das 16 funções | WCAG 1.3.1, 2.1.1 | P1 | Sem `caption`, `th` sem `scope`; região com rolagem não alcançável pelo teclado; 1ª coluna `nowrap` | `caption`, `thead`/`scope="col"`, região focável rotulada; quebra de linha abaixo de 620 px | VERIFIED |
| A11Y-09 | Fontes | WCAG 2.4.4 | P2 | 36 links "Abrir" idênticos, sem destino | "Ler a fonte" + título da fonte e aviso "site externo, em inglês" só para leitor de tela | VERIFIED |
| A11Y-10 | Hierarquia de títulos | WCAG 1.3.1; HIG anatomia | P2 | Frase de efeito do banner como `h2`, antes da reportagem | Vira parágrafo; banner como região rotulada | VERIFIED |
| A11Y-11 | Alvos de toque | WCAG 2.5.8; HIG 44 pt | P2 | "← Todas as funções" com ~16 px de altura; links do menu sem área mínima | Mínimo de 44 px de altura nos links de navegação, Loja e rodapé | VERIFIED |
| A11Y-12 | Movimento | WCAG 2.3.3 | P2 | `scroll-behavior:smooth` ignorava `prefers-reduced-motion` | Rolagem instantânea com movimento reduzido | VERIFIED |
| A11Y-13 | Contraste | WCAG 1.4.3 | P2 | Rótulo do banner em `#2563EB` sobre gradiente azul claro (≈ 4,5:1, no limite) | `--brand-hover` `#1D4ED8` (≥ 6:1) nos rótulos sobre superfície | VERIFIED |

## Achados de UX copy

| ID | Onde | Antes (v7) | Depois (v8) | Por quê |
|---|---|---|---|---|
| UX-01 | Fim de cada artigo | Os três passos e mais nada: o leitor termina sem próximo passo | Seção **Ferramentas para aplicar**: Workbook, Prompt e Ferramenta HTML, cada um com uma frase que retoma um dos três passos daquela função e um link "Ver … ›" para a categoria da Loja | Objetivo do pedido: a leitura vira prática no momento de maior intenção |
| UX-02 | Rodapé de cada artigo | "← Todas as funções" no topo, só | **Próxima função ›** na ordem da tabela; no último, **Ver todas as ferramentas na Loja ›** | Mantém o fluxo de leitura e fecha o guia na Loja |
| UX-03 | Tela inicial | Nenhuma menção à Loja | Faixa **Da leitura à prática** (3 formatos + "Visitar a Loja"); "Loja" no menu, na barra e no rodapé | Anatomia HIG: seção com título, parágrafo curto, cards e "Saiba mais ›" |
| UX-04 | Lead do hero | "Guia em 16 reportagens…" | + "Cada uma termina com ferramentas para aplicar o que você leu." | Diz ao leitor o que vem no fim e por que continuar |
| UX-05 | Índice | "**Artigos prontos (16 de 16):** clique no nome…" | "Escolha uma função para ler a reportagem. Cada uma termina com três passos e ferramentas da Loja para aplicá-los." | Status interno de produção não é texto de leitor; "clique" exclui teclado e toque |
| UX-06 | Índice | "A cadeia operacional de 12 dimensões: …" logo abaixo de "As 16 funções" | "O guia cobre 16 funções. A cadeia operacional do EXECUTAR as resume em 12 dimensões: …" | 16 e 12 sem ligação pareciam contradição |
| UX-07 | "Como usar o mapa" | "quatro camadas — controle, memória e representação, direção, execução e adaptação —" | Lista entre parênteses separada por ponto e vírgula | Com vírgulas, não dava para saber se eram 4 ou 6 camadas |
| UX-08 | "Como usar o mapa" | Termina sem ação | "Escolha a função por onde começar ›" | Leva do modelo ao índice |
| UX-09 | 16 artigos | "Os estudos não trazem uma receita única. Uma forma de traduzir os achados em prática, a partir deste material, é seguir três passos:" | "Os estudos não trazem receita única. Uma forma de levar os achados à prática são estes três passos:" | Mesmo sentido e a mesma ressalva, 9 palavras a menos, repetido 16 vezes |
| UX-10 | Fontes | "Abrir" | "Ler a fonte" | Diz o que acontece |
| UX-11 | Botões | "Artigo" no menu | "Reportagem" | Mesmo nome do hero, da meta e dos cartões |

Mantidos de propósito: "O ganho é observável, não garantido." e as ressalvas de cada artigo (limite de
responsabilidade: conteúdo educativo, sem diagnóstico, ADR-M04).

## Pendência: a Loja ainda é mock

Os links vão para categorias reais e pré-renderizadas (`/loja/workbooks/`, `/loja/prompts/`, `/loja/html/` no
host de produção do hub de rotas), mas os itens dessas categorias ainda são dados de exemplo (ADR-08). Por isso
a copy descreve **o que fazer** com cada formato e não promete produto com nome. Quando o catálogo real existir:

1. Criar, por função, um item de cada formato com tag do slug (`controle-inibitorio`, …).
2. Trocar os links do `build-v8.py` por `/loja/<tipo>/<slug>/` ou `/loja/?q=<função>` (o filtro `q` já existe
   no `StoreCatalog`). Hoje `?q=` daria lista vazia, por isso não foi usado.
3. Se o guia virar rota do blog, registrar no hub (ADR-06) e passar pelo `tests/hig.spec.ts`.

## Como reproduzir a verificação

```bash
python3 apps/blog/docs/editorial/funcoes-executivas/build-v8.py
# axe + roteamento: Playwright (Chromium do ambiente) + axe-core da raiz do monorepo
```
