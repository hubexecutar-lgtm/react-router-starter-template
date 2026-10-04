# Editorial Hybrid — NatGeo × Apple UX v6

v6 responde à validação contra o objetivo do projeto (blog editorial e leitura de
conteúdo) feita em cima da v5, com 3 decisões:

## O que mudou da v5 para a v6
1. **Chrome soma junto no scroll (padrão Safari/Apple)**: a barra superior e a
   barra inferior agora escondem juntas ao rolar para baixo e voltam juntas ao
   rolar para cima — maximiza a área de leitura durante o scroll contínuo, e
   ainda garante que, ao abrir o drawer, o chrome fica visível (não escondido
   no meio da navegação).
2. **Nav visível em desktop, drawer reservado ao mobile**: em telas ≥900px, a
   nav volta a mostrar os links (História, Seleção, Explorar, Sobre) e a
   trilha de categorias inline — como no apple.com, onde o espaço sobra e a
   descoberta de conteúdo não deveria ficar escondida atrás de um menu. O
   botão de menu, o drawer e a barra inferior de 3 itens ficam exclusivos do
   mobile, onde o espaço é curto.
3. **Bloco de imagem vertical de 100vh mantido em todo artigo**, não só na
   home — conforme decisão explícita.

## Por que isso não contradiz os pedidos anteriores
- "Nav lateralizada" segue valendo exatamente onde ela resolve um problema
  real: o mobile, onde não há espaço para uma nav horizontal completa.
- Em desktop, a Apple — a própria referência usada desde a v3 — nunca esconde
  a navegação principal atrás de um menu; ela é sempre visível. Replicar esse
  comportamento não é abandonar a diretriz, é aplicá-la de forma responsiva.

## Importante
Este pacote não contém arquivos de fonte, código-fonte, logotipos, imagens ou
textos da Apple, Microsoft/Outlook ou National Geographic. Os padrões de
interação (drawer, barra inferior, nav translúcida) são convenções genéricas
de UI, não ativos proprietários.

## Arquivos
- `editorial-hybrid-apple-v6.html`
- `tokens-hybrid.css`
- `tokens-hybrid.json`
