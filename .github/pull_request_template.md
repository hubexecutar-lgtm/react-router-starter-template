## Resumo

<!-- O que muda e por quê. -->

## Testes

<!-- npm run build, npx eslint ., npx playwright test -->

## Hub de rotas (ADR-06)

- [ ] Nenhuma rota nem link novo, **ou** cada nova rota (`app/routes.ts`), ferramenta (`public/*/index.html`) e link gerado/compartilhado está em `app/data/routes.ts`
- [ ] `npm run routes:check` passa
- [ ] Os QRs de `/admin/rotas/` apontam para o host de produção, nunca para preview de branch

## Gate UX-GOV-HIG-001 (ADR-M03)

- [ ] `tests/hig.spec.ts` passa sem P0/P1 (axe WCAG 2.2 AA, títulos, landmarks, alvos ≥ 24 px, reflow 320 px, medida, sem prosa mono, `alt`, foco visível)
- [ ] Páginas novas ou alteradas seguem a anatomia (hero, seções com "Saiba mais ›", cards-célula) e não têm texto desestruturado
- [ ] Domínios manuais revisados (Purpose, Agency, Responsibility) e auditoria atualizada em `docs/audit/HIG-WEB-AUDIT.*` quando a interface muda

