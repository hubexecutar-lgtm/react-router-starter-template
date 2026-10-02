## Resumo

<!-- O que muda e por quê. -->

## Testes

<!-- npm run build, npx eslint ., npx playwright test -->

## Hub de rotas (ADR-06)

- [ ] Nenhuma rota nem link novo, **ou** cada nova rota (`app/routes.ts`), ferramenta (`public/*/index.html`) e link gerado/compartilhado está em `app/data/routes.ts`
- [ ] `npm run routes:check` passa
- [ ] Os QRs de `/admin/rotas/` apontam para o host de produção, nunca para preview de branch
