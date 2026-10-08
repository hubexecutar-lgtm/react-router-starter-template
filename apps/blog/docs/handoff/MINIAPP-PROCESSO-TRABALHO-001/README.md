# EXECUTAR Mini App — Processo de Trabalho + Prisma

**ID:** EXEC-MINIAPP-001 · **Version:** 1.0.0 · **Area:** Ferramentas · **Owner:** A DEFINIR

**Status:** IMPLEMENTAÇÃO INTEGRADA NA BRANCH; verificação e preview de deploy pendentes. **Automation:** A2.

A nova rota `/ferramentas/processo-de-trabalho/` tem intake por etapas, prévia Processo/Prisma, ações editáveis com aceite explícito, geração de QR local, impressão A4, JSON versionado de importação/exportação, persistência opt-in e limpeza confirmada. Manifest e service worker são limitados à rota.

O payload simplificado ainda precisa ser comparado e alinhado ao schema canônico entregue em `miniapp-plan.schema.json`; o HTML original de preview foi preservado separadamente como referência em `/miniapp-prisma/preview-app.html`.

## Verificação e gates

Integridade dos ZIPs, sintaxe JSON/CSV e JavaScript do preview original verificados. Este ambiente não tem checkout nem dependências do repo, então build, typecheck, Playwright, QR scan, impressão, acessibilidade e QA de dispositivos continuam pendentes. A publicação da rota no hostname atual também herda Cloudflare Access; não alterei essa política.

Deploy de produção não será considerado concluído sem build verde, teste de fluxo/QR/print/offline e validação de um Worker de preview isolado.