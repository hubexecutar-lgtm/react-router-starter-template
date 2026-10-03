# Medidas do handoff OPENAI-STORIES-DESIGN-001

Registro **só de números** extraídos de `OPENAI_STORIES_CAPTURE_HANDOFF_v1.0.0` (README, `design/tokens.desktop.css`,
`design/HANDOFF_DESIGN.md` e os JSON de medidas). Capturas, textos, marca e links da referência **não** são
versionados: a referência é de terceiros e serve de alvo de composição, nunca de conteúdo do site.

- **Viewport:** 1363 × 936 CSS px, DPR 1. Home em página inteira 1363 × 4170; artigo 1348 × 10192.
- **Estado:** MEDIDO no handoff (estilos computados). Só há desktop. 390 e 768 **não** foram medidos: a referência
  responde 403 ao container (BLOCKED) e o handoff trata o responsivo como hipótese.
- **Fonte da referência:** "OpenAI Sans", ausente do handoff; aqui se usa a Inter (ADR-11) com os mesmos tamanhos,
  pesos, entrelinhas e tracking.

## Tipografia (tokens `--ref-*` em `app/styles/global.css`)

| Papel | Tamanho / entrelinha | Peso | Tracking |
|---|---|---|---|
| h1 do artigo | 61,6864 / 62,0103 px | 500 | −1,85059 px |
| h2 (título "Histórias" e seções do artigo) | 46,8432 / 54,2918 px | 500 | −1,38216 px |
| Corpo | 17 / 27,999 px | 400 | −0,17 px |
| Citação | 29,5662 / 39,0274 px | 500 | −0,739155 px |
| Legenda | 14 / 22,96 px | 400 | normal |
| Data do card | 14 / 19,6 px | 500 | normal |
| Título de painel de demonstração | 17,8554 / 23,4881 px | 500 | −0,178554 px |
| Botão (Filtro, Classificar, Carregar mais) | 14 / 14 px | 500 | normal |

## Geometria (desktop, 1363 px)

| Elemento | Medida |
|---|---|
| Cabeçalho | 64 px de altura |
| Gutter da Home / área útil | 32 px / 1299 px |
| Gap horizontal da grade | 24 px |
| Título "Histórias" | topo em y = 152 |
| Barra de categorias e controles | y = 222; botões de 40 px (raio 4 px) |
| Destaque da Home | x = 32, y = 326, 968,25 × 544,64 px (16:9) = 3 colunas de card + 2 gaps |
| Pilha lateral | 3 cards de 307 × 307 px na 4ª coluna, passo vertical ≈ 470–492 px (≈ 64 px entre cards) |
| Card pequeno | 306,75 px de largura, imagem quadrada |
| Grade inferior | 4 colunas em x = 32, 363, 694, 1024; linhas a cada 508 px |
| "Carregar mais" | 131 × 40 px, raio 40 px, preto com texto branco |
| Hero do artigo | 1363 × 694 px logo abaixo do cabeçalho; caixa do h1 802 px; caixa do subtítulo 596 px |
| Coluna de texto do artigo | 637,5 px, centralizada (x = 363) |
| Imagem larga | 1078,5 px (x = 142) |
| Carrossel | slide de 1136 × 639 px; setas de 32 px |
| Citação | caixa de 826 px |
| Espaço entre blocos do artigo | ≈ 120 px (legenda → h2); 24 px entre parágrafos e entre h2 e 1º parágrafo |

## O que o handoff não cobre

Cabeçalho e rodapé em outros estados, menu global, busca, lista/playback, capturas mobile e tablet, e o
comportamento de rolagem do destaque. Nada disso foi inventado aqui.
