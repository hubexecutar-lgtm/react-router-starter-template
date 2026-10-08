# Mini App EXECUTAR — Processo de Trabalho + Prisma

**ID:** EXEC-MINIAPP-001  
**Version:** 1.0.0  
**Area:** Ferramentas  
**Workflow:** Importação de handoff e preview  
**Owner:** A DEFINIR  
**Status:** PREVIEW DEMONSTRATIVO IMPORTADO; implementação PWA pendente  
**Automation level:** A2 (integração no código preparada; validação de produção bloqueada pelo Cloudflare Access)

## Contexto e escopo

A rota integra o preview interativo fornecido e mantém separado o Prisma já existente. Inclui entrada no catálogo de Ferramentas e uma tela com aviso de limites do protótipo.

Fontes recebidas: `EXECUTAR-MINIAPP-PRISMA-01-DOCUMENTOS-v1.0.0(1).zip`, `EXECUTAR-MINIAPP-PRISMA-02-UX-E-DADOS-v1.0.0(1).zip`, `EXECUTAR-MINIAPP-PRISMA-03-HANDOFF-E-PREVIEW-v1.0.0(1).zip`, `EXECUTAR-MINIAPP-PRISMA-04-ORIGINAIS-v1.0.0(1).zip` e `preview-app.html`.

## Localização

- Rota: `/ferramentas/processo-de-trabalho/`
- Preview independente: `/miniapp-prisma/preview-app.html`
- Catálogo: `apps/blog/app/routes/ferramentas._index.tsx`
- Rota: `apps/blog/app/routes/ferramentas.processo-de-trabalho.tsx`

## Limites verificados

O preview executa em iframe e não carrega scripts, fontes ou recursos remotos. Nesta versão, o estado do formulário não persiste após sair/recarregar; há download do JSON atual, mas não importação de JSON. Não há QR real nem modo offline/PWA completo. Não apresentar este preview como versão final ou como implementação dos critérios pendentes dos pacotes.

## Aceite desta importação

- A rota está declarada no roteador e ligada ao catálogo.
- A página identifica o conteúdo como protótipo demonstrativo.
- O HTML original do preview foi preservado sem alterações.
- Build, testes e visualização da rota em produção: pendentes de execução no ambiente do repositório. A rota hospedada redireciona para Cloudflare Access neste momento.

## Dependências e handoff

Depende do workspace `apps/blog` e dos componentes de design system existentes. Próxima etapa: implementar os requisitos P0/P1 do PRD/FRD, comparar o modelo de dados recebido com `apps/blog/app/features/prisma/schema.ts` e validar localmente antes de liberar a rota.
