# EXECUTAR Mini App — Processo de Trabalho + Prisma

**ID:** EXEC-MINIAPP-001 · **Versão:** 1.0.0 · **Área:** Ferramentas

A rota independente `/ferramentas/processo-de-trabalho/` implementa intake progressivo, prévia Processo/Prisma, ações editáveis e reordenáveis, estados explícitos, importação/exportação MiniAppPlan v1, migração do JSON legado, QR local, impressão A4, persistência opt-in e limpeza confirmada. O contrato canônico está versionado neste diretório em `miniapp-plan.schema.json`.

O formulário coleta tipo e título de trabalho, nome opcional, janela do dia, horário personalizado, dias, duração, preferência/contexto, objetivo, ações e URL de QR. O Prisma projeta três faces de 99 mm. Nenhum dado do plano é enviado a serviços externos; o QR é criado no navegador. Manifest e service worker têm escopo exclusivo da rota.

A tela inicial permite iniciar um plano, carregar a demonstração embutida ou abrir o template vazio sem intake. O exemplo fictício está versionado em `app/features/miniapp/demoPlan.ts` e disponível para baixar em `public/ferramentas/processo-de-trabalho/exemplo-miniapp-plan-v1.json`; ambos usam `mode: demo` e `source_kind: demo_fixture`. Importações aceitam o contrato v1 e o formato legado reconhecido; erros são mostrados sem substituir silenciosamente o plano atual. A aplicação anterior em `/prisma/` e o preview HTML original permanecem preservados.

## Verificação

CI do PR executa typecheck, build, `wrangler deploy --dry-run`, testes de registro de rota e Playwright de interação/exportação. Permanecem como verificações manuais finais o scan do QR com leitor externo, revisão de impressão física A4, QA em dispositivo móvel e confirmação de cache offline após primeira carga. A rota de produção atual está protegida por Cloudflare Access; a política de acesso não foi alterada.

O deploy em produção ocorre após merge na branch principal, condicionado à configuração de Workers Builds no Cloudflare para `apps/blog`. A publicação deve ser conferida no Worker após o merge.
