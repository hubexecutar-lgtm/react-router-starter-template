# ADR-MINIAPP-BRAND-001 — marca enviada no Processo de Trabalho + Prisma

Status: Aceita pela solicitação de correção visual de 2026-10-08.

A rota `/ferramentas/processo-de-trabalho/` adota o pacote `rc-brand` 1.0.0 fornecido pelo usuário: azul de ação, neutros, DM Sans/Inter/DM Mono, escala de espaçamento e primitivos Panel/Button/Eyebrow. Esta decisão emenda o ADR-26 somente para essa rota e seu shell, manifest e folha; demais rotas continuam com sua base atual.

Tokens e primitivos são copiados com proveniência e escopo local. Fontes são hospedadas no app com OFL. A imagem orienta a composição, sem criar tokens. O protótipo Public Sans/azul Apple não prevalece sobre o pacote de marca. Intake, persistência, JSON, QR e IDs existentes permanecem como contrato funcional.

Verificação e limitações: `docs/audit/RC-BRAND-MINIAPP-001/README.md`.
