## Crítica de design: layouts demonstrativos (ADR-BLOG-JORNADA-ROTAS-001)

Feita com a skill Design 1.2.0 (`/design-critique`) sobre capturas reais do build, a 1440 e a 390 px, nos dois temas. As
capturas estão em `capturas/` (`<rota>-<tema>-<largura>.webp`). Estágio: **refinamento**, com layouts demonstrativos
sobre conteúdo real.

### Impressão geral

O site responde a uma identidade só. Laranja #FF5E1F, Hanken Grotesk, quadros com cantos, botões pílula e
neutros CF aparecem do cabeçalho ao rodapé em todas as rotas, inclusive no admin. Cada área continua com a sua
composição: a Home apresenta, o Blog organiza, o Mapa interage e as Ferramentas catalogam. A maior oportunidade estava na
leitura do artigo: o sumário vinha fechado no desktop e foi corrigido.

### Usabilidade

| Achado | Severidade | Recomendação / estado |
|---|---|---|
| Artigo: o sumário "Nesta página" vinha recolhido no desktop, então a coluna lateral ficava vazia | 🟡 Moderado | **Corrigido:** aberto no HTML; recolhe só abaixo de 1100 px |
| Blog sem próxima ação no topo (a primeira ação ficava abaixo das facetas) | 🟡 Moderado | **Corrigido:** "Ler o guia de riscos cognitivos" no `PageHead` |
| Facetas sem artigo pareciam clicáveis | 🟢 Menor | Já tratado: borda tracejada, rótulo "em preparação" e nenhum link |
| Home e Mapa: espaço vazio acima do cérebro (palco 4:3 com a figura mais baixa) | 🟢 Menor | **Aberto.** O enquadramento é do renderer e vale para os dois usos. Proposta: reduzir o palco para 16:10 no desktop num PR do cérebro, com novo `test:brain` |
| Trilha do artigo no celular quebra o título longo em duas linhas | 🟢 Menor | **Aberto.** Aceitável; truncar o item atual com reticências é opção futura |

### Hierarquia visual

- **O que atrai o olhar primeiro:**
  - Home: o cartão laranja com o h1. Correto, é o problema reconhecível.
  - Mapa: o cérebro. Correto.
  - Blog, Ferramentas e artigo: o h1 e o botão laranja. Correto.
- **Fluxo de leitura:** aviso de demonstração → rótulo → h1 → lead → ação → seções com cabeçalho à esquerda nas páginas
  internas e centralizado nas homes de área.
- **Ênfase:** o laranja aparece só onde há ação ou seleção: botão primário, aba ativa, marcador selecionado, rótulos e
  links. Os neutros ocupam o resto.

### Consistência

| Elemento | Problema | Estado |
|---|---|---|
| Cabeçalhos de seção | Dois alinhamentos: centralizado nas homes, à esquerda nas internas | Intencional (variação de composição registrada no HANDOFF) |
| Cards | Uma implementação só (`ds-card`) em Home, Blog, Ferramentas, Comece, admin e 404 | ✅ |
| Tabelas e painéis | Mesma pele (`ds-table`, `plain-surface` sobre `--cf-*`) no artigo, na solução e no admin | ✅ |
| Folha A4 do Prisma | Mantém as cores `--ps-*` (exceção 1); a tipografia passou para Hanken, em 9,25 pt / 1,3 para caber na página | ✅ registrado no ADR-26 |
| Ilustrações azuis | Fora de todas as telas | ✅ (`editorial.spec`) |

### Acessibilidade

- **Contraste de cor:** todos os pares de texto passam AA. O branco sobre o acento fica só em títulos grandes. Detalhes
  em `A11Y.md`.
- **Alvos de toque:** os controles do DS têm ≥ 44 px (`ds.spec`); os links de fonte, ≥ 24 px.
- **Legibilidade do texto:** corpo de 18 px / 1,6 no artigo, medida de 68ch e mono só em IDs, passos e diagramas.

### O que funciona bem

- A jornada fecha: Home → Blog → artigo → foco no Mapa (`/mapas/?foco=`) → solução → resultado → próxima ação.
- O cérebro é o mesmo nas duas rotas. Na Home é prévia e leva ao Mapa com o foco; no Mapa é completo, e o foco vai e
  volta pela URL.
- O catálogo mostra o real: as 6 soluções e o Prisma. Os 8 tipos vazios trazem estado honesto, sem CTA falso.

### Recomendações prioritárias

1. **Enquadramento do cérebro:** reduzir o espaço acima da figura, com teste do cérebro, num PR próprio.
2. **Republicar artigos:** cada artigo volta incluindo o slug em `PUBLIC_ARTICLES` e tirando o 302. O template já está
   pronto e os testes (hash, 302) mostram o que muda.
3. **Pontos principais e FAQ:** os slots existem no template; só aparecem quando o texto canônico do artigo trouxer esse
   conteúdo, porque nada é inventado.
