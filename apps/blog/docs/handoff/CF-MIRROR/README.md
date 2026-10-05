# CF-MIRROR — home e shell no padrão da cloudflare.com (ADR-25)

Pedido de 2026-10-05: espelhar a cloudflare.com, com as decisões registradas no ADR-25 (`apps/blog/CLAUDE.md`).

## Referência medida

Render real da cloudflare.com a 1440 e a 390 px, com estilos computados. As capturas da referência não estão neste
repositório.

| Elemento | Referência | Aqui |
|---|---|---|
| Cabeçalho | 72 px; menu 16/500; pílulas de 38 px, borda #F0F0F0 | `.cf-header` (`global.css`) |
| Hero | cartão #FF5E1F, 8 px da borda, raio 16, 760 px; pílula de 42 px; h1 56/55 500; botão branco de 50 px | `.cfh-hero` (`home.css`) |
| Títulos de seção | 48/48 (56/56 nos destaques) −0,025em; subtítulo 19,2/23 a 70 % | `.cfh-head` |
| Quadros | borda 1 px #F0F0F0, quadradinhos de 10 px nos cantos, células com padding 32 | `.cfh-frame` |
| Cards | h3 18/21,6 500; p 16/19,2 cinza | `.cfh-col`, `.cfh-plan-col` |
| CTA | cartão laranja, padding 128/112, h2 56 branco, botões branco e #FF7038, letreiro | `.cfh-cta` |
| Rodapé | marca, colunas com título 13/500 #727272, links 16, © 14 | `.cf-footer` |

## Diferenças intencionais

- Fonte: Hanken Grotesk (OFL) no lugar da FT Kunst Grotesk, que é comercial.
- Texto pequeno sobre o laranja é #262626, não branco: branco sobre #FF5E1F dá 3,05:1, o que só passa em texto grande
  (WCAG 2.2 AA).
- O conteúdo é o RC-HOME-002 sem reescrita. Cada seção da referência recebe a parte da home que cumpre o mesmo papel.

## Verificação

- `npm run typecheck`, `npm run build`, `npx playwright test` (suíte inteira) e `npm run test:brain`.
- Gate HIG regenerado (`docs/audit/HIG-WEB-AUDIT.*`): PASS, 0 FAIL.
- Capturas desta versão: `light-1440.webp`, `light-390.webp`, `dark-1440.webp`, `dark-390.webp`.
