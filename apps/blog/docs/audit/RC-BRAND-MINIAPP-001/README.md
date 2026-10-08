# RC-BRAND-MINIAPP-001 — correção visual do Mini App

ID: RC-BRAND-MINIAPP-001 · VERSION: 1.0.0 · AREA: Ferramentas · WORKFLOW: corrigir UI → verificar → PR → deploy · OWNER: A DEFINIR.

Resultado esperado: `/ferramentas/processo-de-trabalho/` aplica o pacote de marca enviado, preservando MiniAppPlan v1 e suas funções. Inclui abertura, intake, resultado, shell desta rota, folha A4, manifest e fontes locais. Exclui migração visual das demais rotas e alteração de dados/contrato.

## Fontes e decisão

- `risco-cognitivo-brand.plugin.zip`, `skills/rc-brand/assets/tokens/tokens.json`: SHA-256 `85a5e14c2351b4e654693a8cc327fd942532e7beb2fa11080af97f9d3cf4fbb4`.
- `rc-brand.skill.zip`: JSON e CSS idênticos aos do plugin; 123 declarações CSS têm paridade com a fonte.
- `IMG_3767(2).jpeg`: referência de composição; cabeçalho em duas colunas, cards neutros, prévias internas, espaçamento amplo. Valores visuais vêm da marca, sem inferir tokens da imagem.
- `EXECUTAR — Visual Prototype (React + Tailwind).html`: paleta `#0071E3`/Public Sans diverge do pacote de marca. O pacote `rc-brand` prevalece para esta correção solicitada; o protótipo não foi usado como fonte de tokens.
- Base: main `06a89a94fff6b05b432f11017495db7bb398636d`. Pré-voo: somente PR de dependências #2 aberto, sem mudança de shell/DS/base.

## Alteração

A implementação anterior dependia de `--cf-*` (laranja), CSS inline e cores avulsas no papel. Agora tokens e primitivos são cópias rastreáveis da fonte enviada, com escopo `.miniapp-brand`. O shell dessa rota herda aliases para a mesma marca; nenhuma regra de token vaza para outras rotas.

Marca: CTA `#2D5CE6`/branco, papel `#FFFDFA`, texto preto e secundário `#545454`; DM Sans 600 nos títulos, Inter 400/500/600 na UI e DM Mono 400/500 nos metadados. As fontes são servidas localmente e pré-cacheadas para offline; licenças OFL preservadas. O modo escuro reutiliza os valores Noite do pacote. A folha mantém papel claro.

Abertura com dois Panels e demonstrações textuais reais da anatomia do fluxo. Um CTA primário por card, utilitários separados, alvos ≥44px, foco explícito, estados selecionados em texto/ARIA. A folha Prisma desconta cabeçalho e padding da altura A4; elementos do shell e espaçador móvel não imprimem. Verbos deixam de aparecer duplicados nas ações.

## Verificação e evidências

- `python .../rc-brand/scripts/validate_tokens.py`: OK; 48 pares em três temas; menor 3,22:1 nos controles.
- `python .../rc-audit/scripts/audit_html.py .../miniapp.css`: zero bloqueantes/avisos.
- Auditoria independente de marca: paridade, contraste, escopo e tema aprovados. Achado de dimensão A4 corrigido e reavaliado.
- Typecheck, build e Worker dry-run: aprovados.
- Playwright: 12 testes aprovados (3 do Mini App, 9 do registro de rotas), incluindo intake, QR, JSON, exemplo, dois temas, reflow320 e shell oculto na impressão.
- `desktop.png`, `mobile.png`: capturas do build real, não mockups.
- `prisma-a4.pdf`: impressão do exemplo preenchido via Chromium; uma página A4 (594,96 × 841,92 pt), DM Sans/Inter/DM Mono embutidas, render Poppler conferido.
- Ambiente de verificação: o runtime local não fornece `os.networkInterfaces`; preview testado com fallback de loopback exclusivamente no processo local de teste. Esse ajuste não faz parte do código entregue.

DEPENDS_ON: pacotes de marca + base main. BLOCKS: publicação até CI verde. AUTOMATION_LEVEL: A4 para código e evidências locais. HANDOFF: PR pronto e deploy pelo Workers Builds após CI verde.

## Limites

Selects nativos preexistentes permanecem; divergem da D-36, fora desta correção de tokens. Planos longos podem exigir mais de uma página; nenhuma ação é cortada via overflow:hidden. A impressão física e a validação visual da produção protegida por Cloudflare Access dependem de acesso autenticado. O símbolo já presente no shell não foi substituído nem tratado como símbolo aprovado no pacote.
