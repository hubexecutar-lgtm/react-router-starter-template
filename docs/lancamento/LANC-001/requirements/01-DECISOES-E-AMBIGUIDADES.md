# LANC-001 — Decisões, conflitos e lacunas

- **ID:** RC-LANC-001-DEC · **Versão:** 0.2.0 · **Data:** 2026-10-04 (respostas Q1–Q8 registradas)
- **Classes:** FACT (verificado no material), DECISION (decidido pelo usuário ou por regra vigente),
  CONFLICT (fontes divergem → resolução registrada), ASSUMPTION (adotado até confirmação), GAP (falta dado; bloqueia o que depende)
- Os requisitos em `requisitos.json` citam estes IDs no campo `fonte`.

## 1. Decisões do usuário (2026-10-04)

| ID | Decisão | Efeito |
|---|---|---|
| DEC-U1 | (restrita pela DEC-U14 a motion) Arquitetura, interatividade e disposição das páginas seguem **v6 e v7**; o **motion do v7** é mantido | Fecha D1 (estrutural). Nav desktop visível, drawer + barra inferior no mobile, chrome que esconde no scroll, hero com `heroReveal` |
| DEC-U2 | (restrita pela DEC-U14 a cores) **Brand Local (v7)** em tudo, incluindo artigos e blog | Paleta e tipografia de interface continuam as do ADR-11 (`#2563EB`, `#202124`, Inter + IBM Plex Mono). O amarelo/preto do v6 sai; D2 deixa de existir |
| DEC-U3 | O pacote DOCS-002 traz os tokens de **gráficos, vetores e imagens** (RC-BRAND-STYLING-001) | Vira a camada de ilustração; não substitui a paleta de interface (ver CF-01) |
| DEC-U4 | Os insumos viram PRD, FRD, specs e UIX | Este diretório |
| DEC-U5 | Papel do agente: priorizar, reduzir ambiguidade e converter em requisitos importáveis | `00-PLANO-DE-IMPORTANCIA.md` + `requisitos.{json,csv}` |

### Respostas às perguntas (2026-10-04, segunda rodada)

As respostas vieram numeradas R1–R9 sem R5; R6–R9 respondem Q5–Q8.

| ID | Pergunta | Resposta do usuário | Efeito |
|---|---|---|---|
| DEC-U6 | Q1 menu | "Sim" | Topo Artigos · Mapa · Ferramentas · Sobre; barra inferior Início · Mapa · Ferramentas. CF-12 fechado |
| DEC-U7 | Q2 imagem | "Todo artigo deve ter uma imagem" | Bloco 100vh em todo artigo, com a ilustração do pilar como reserva; emenda ao ADR-12. CF-11 fechado |
| DEC-U8 | (substituída pela DEC-U14) Q3 URLs | "Mantém" | `/blog`, `/mapas`, `/about` mantidas, só os rótulos mudam. CF-13 fechado |
| DEC-U9 | Q4 Ferramentas × Loja | "Ferramentas cognitivas. Loja não existe." | A seção chama-se **Ferramentas cognitivas** e substitui a Loja: `/loja/*` → `/ferramentas/*` com 301, catálogo reaproveitado, ADR-08 substituído (RQ-103). GAP-06 fechada |
| DEC-U10 | Q5 Teia | "Teia aprovada, responsável Leonardo" | ADR-TEIA-UNICA-001 **Aceita**, OWNER **Leonardo**; registrado como ADR-M04 no `CLAUDE.md` da raiz. GAP-01 fechada para a Teia |
| DEC-U11 | Q6 analytics | "Usar a disponível no stack" | Cloudflare Web Analytics (páginas e Core Web Vitals de campo) + Workers Analytics Engine (eventos próprios). GAP-03 fechada |
| DEC-U12 | Q7 conteúdo | "Sim" | RC-LP-001 vira a home; os 4 artigos canônicos entram como artigos novos, sem apagar os existentes. CF-14 confirmado |
| DEC-U13 | Q8 cadeia | "Sim" | Cadeia canônica do CF-05 confirmada |
| DEC-U14 | Base do site (2026-10-04, AUD-ORDEM-001) | "O design system certo é o do PR #19 … todo o seu trabalho deve ser implementado a partir do PR 19 inteiro" | A base é o PR #19 (`chore/site-do-zero`): reset do site (ADR-13) + front-end Stories (ADR-14, `--ref-*`). Layout, tipografia e anatomia de Home e artigo = Stories; cores = ADR-11; ilustração, grafo e motion = ADR-15. **Restringe** DEC-U1/DEC-U2 a cores, ilustração e motion; **substitui** DEC-U8: artigos em `/artigos/:slug/`, rotas antigas removidas sem 301. RQ-010, 020…026, 100 e 103 reabertos |

### Decisões do HOME-BRAIN-001 (2026-10-05)

| ID | Decisão do usuário | Efeito |
|---|---|---|
| DEC-U15 | Base: "Esperar #34 e partir dele" (AUD-ORDEM-001) | Branch `feat/home-brain-3d` a partir de `main` @ 5f1cb05 |
| DEC-U16 | "Home do esboço completa" | A home passa a ser o RC-HOME-002 (`intake/HOME-002`). **Emenda o RQ-040 e a DEC-U12:** o RC-LP-001 sai da `/` |
| DEC-U17 | RC-LP-001 em "Nova rota /comece/" | `/comece/` mostra o RC-LP-001 sem reescrita, e o teste do RQ-040 passa a verificar essa rota |
| DEC-U18 | "Criar 3 nós novos no grafo" (aval do OWNER, ADR-M04) | `COG-MEMORIA-TRABALHO`, `COG-CONTROLE-INIBITORIO`, `COG-FLEXIBILIDADE` (DRAFT, fonte RC-HOME-002) e `REL-056`/`REL-057` (E_INFERRED + PROPOSED) |
| DEC-U19 | Estatísticas: "Manter com fonte linkada" | IBGE Censo 2022 e Song et al. 2021 (*J Glob Health* 11:04009), conferidas e listadas em `/fontes/` |

## 2. Fatos verificados

| ID | Fato |
|---|---|
| FT-01 | v7 tem a mesma estrutura do v6 (`global-nav`, `drawer`, `bottom-bar`, hero, carrossel com scroll-snap, `article-shell`) e a paleta do ADR-11 |
| FT-02 | Motion do v7: `--ease: cubic-bezier(.22,1,.36,1)`; `@keyframes heroReveal` (opacity 0→1, translateY 18px→0); desligado em `prefers-reduced-motion` |
| FT-03 | Raios do v7: card 2px, filtro 4px, controle 8px, pílula 40px; sombras `raised` 0 1px 2px /4% e `overlay` 0 8px 28px /10% (iguais ao ADR-12) |
| FT-04 | Navegação do v7: topo = Artigo · Sistemas · Ferramentas · Sobre; trilha = Risco Cognitivo · Processos · Produtividade · Sistemas · Ferramentas; barra inferior = Início · Sistemas · Ferramentas |
| FT-05 | RC-EDITORIAL-PACK-001 (5 textos + fontes) e RC_IMAGENS (9 imagens) conferem com os próprios SHA256 |
| FT-06 | As 6 imagens `RC_*` não têm palavras (só marcadores numéricos 1–3); as 3 `REF_*` são de terceiros e uma tem texto e a marca "#2268" |
| FT-07 | Contraste sobre `#FFFFFF`: coral `#F28F83` 2,33:1; azul claro `#A9BFF4` 1,83:1; `#748094` 3,99:1; `#3155E7` 5,86:1; `#18346F` 11,93:1 |
| FT-08 | O blog não emite JSON-LD hoje; `/mapas` é uma página editorial estática (diagrama plain text + modelos), sem grafo interativo |
| FT-09 | Todos os pacotes declaram `OWNER: A DEFINIR`; Teia Única está `PROPOSED_FOR_APPROVAL`; o mapa causal está `PREPARED`, implementação `NOT_STARTED` |

## 3. Conflitos e resolução

| ID | Conflito | Resolução | Classe |
|---|---|---|---|
| CF-01 | Três paletas: v7/ADR-11 (`#2563EB`, texto `#202124`); RC-BRAND-STYLING (`#3155E7`, tinta `#18346F`, coral, azul claro); spec do mapa (`#3659B7`, `#15213A`) | Interface = v7 (DEC-U2). RC-BRAND-STYLING vira só a camada `--illu-*` de ilustração e vetor. A paleta do mapa é traduzida para tokens v7 (accent → `--primary`; surface_blue → `--surface-model`; border → `--border-default`) | DECISION |
| CF-02 | Coral e azul claro não chegam a 3:1 (FT-07) | Nunca como texto nem como único marcador de significado; só preenchimento decorativo ou com contorno ≥ 3:1 (WCAG 1.4.11) | DECISION (regra ADR-M03) |
| CF-03 | Tipografia: v7 Inter + IBM Plex Mono; RC-BRAND-STYLING Inter/Arial; spec do mapa "A_DEFINIR" | Inter + IBM Plex Mono (ADR-11) | DECISION |
| CF-04 | Raios: v7/ADR-12 card 2px; spec do mapa card 12, chip 10, sheet 20; RC-BRAND-STYLING 8–16 | Cards seguem ADR-12 (2px). Componentes novos ganham tokens próprios: nó em pílula, bottom sheet com topo 20px | DECISION |
| CF-05 | Cadeia causal em 4 versões (RC-LP-001, Causal Knowledge Graph, spec do mapa, Teia Única) | Canônica = RC-LP-001 (status CANÔNICO) estendida pela cauda do P3/Teia: Objetivo → Contexto → Demanda → Vulnerabilidade → Exposição → Risco → Evento → Impacto → Compensação → Controle/Solução → Resultado → Medição → Aprendizado | DECISION (DEC-U13) |
| CF-06 | Nós de exemplo do mapa (Sono, Alimentação, Saúde cardiovascular, Idade, "+42%") têm enquadramento clínico/individual; o RC-LP-001 diz que o objetivo "não é transformar características individuais em risco" | Nós de exemplo descartados. O grafo inicial vem do vocabulário dos artigos canônicos (interrupção, sobrecarga, perda de contexto…). Valor numérico só com `evidence_id` | DECISION |
| CF-07 | Focos do Personalizar (Humor, Envelhecimento saudável) fora do conceito | Trocar por focos de trabalho (Atenção, Memória, Decisão, Organização, Interrupções, Sobrecarga) | ASSUMPTION |
| CF-08 | Stack sugerida React Flow + Dagre + Cytoscape + **Supabase** × stack do repo (Cloudflare Workers, ADR-07) | React Flow + Dagre carregados só na rota do mapa. Cytoscape fica para depois (análise pode rodar no build). Dados versionados no repo; D1 se o CMS precisar editar. Supabase fora | DECISION (proposta) |
| CF-09 | Teia Única (T3) e grafo do mapa descrevem o mesmo grafo | Um schema só (`06-DATA-SPEC-GRAFO-CAUSAL.md`); T3 vira a camada de dados do mapa | DECISION |
| CF-10 | Logo: RC-BRAND-STYLING diz "A DEFINIR"; BRAND-ASSET-LOGO-001 entrega logo VERIFIED | O pacote de logo é o logo oficial; regras de uso (tamanho mínimo, área de respiro) continuam GAP-04 | DECISION |
| CF-11 | Imagem 100vh em todo artigo (v6) × ADR-12 ("artigo sem ilustração fica sem imagem") | Bloco 100vh em todo artigo; artigo sem ilustração própria usa a do seu pilar. Exige emenda ao ADR-12 | DECISION (DEC-U7) |
| CF-12 | Menu: v7 (Artigo, Sistemas, Ferramentas, Sobre) × Índex de rotas (Home, Artigos, Mapa, Ferramentas, Sobre) × spec do mapa (Início, Explorar, Aprender, Perfil) | Topo: Artigos · Mapa · Ferramentas · Sobre. Barra inferior: Início · Mapa · Ferramentas (+ menu). "Sistemas", "Aprender" e "Perfil" saem | DECISION (DEC-U6) |
| CF-13 | URLs: Índex propõe `/artigos`, `/mapa`, `/sobre`; spec do mapa `/explorar`, `/personalizar`; o site tem `/blog`, `/mapas`, `/about` | Manter URLs existentes (SEO, hub ADR-06, sitemaps) e mudar só rótulos. Mapa novo em `/mapas/explorar`, `/mapas/explorar/:fatorId`, `/mapas/personalizar`. Ferramentas em `/ferramentas` (nova) | DECISION (DEC-U8; exceção `/loja`, DEC-U9) |
| CF-14 | Headline da home: SCR-01 "Entenda o que influencia seu risco cognitivo"; Índex "Entenda onde o trabalho está exigindo mais do que deveria"; RC-LP-001 título canônico | Texto = RC-LP-001 (canônico); ordem das seções = Índex (Problema → Conhecimento → Ferramenta → Ação) | DECISION (DEC-U12) |
| CF-15 | "Processo neuroadaptativo" pode ser lido como norma ou constructo científico | Sempre rotulado como conceito metodológico do projeto (regra do próprio pacote editorial) | DECISION |
| CF-16 | Na Teia, `EVENT` = evento observável de analytics; na cadeia causal, "Evento" = evento operacional (erro, omissão) | Armazenar como `OPERATIONAL_IMPACT` + tag `stage:event`, sem mudar o schema; alternativa: tipo novo na Teia v0.2.0 | ASSUMPTION (aguarda o OWNER Leonardo; não bloqueia) |
| CF-17 | Schema do mapa (`causal_data_model`, 9 tipos) × schema da Teia (`CORRELATION_RECORD`, 28 tipos, proveniência) | Teia = armazenamento; os 9 tipos do mapa são projeção (`06-DATA-SPEC-GRAFO-CAUSAL.md`) | DECISION |

## 4. Lacunas (GAP)

| ID | Falta | Bloqueia |
|---|---|---|
| GAP-01 | ~~OWNER de cada pacote~~ **Fechada para a Teia** (Leonardo, DEC-U10); demais pacotes assumem o mesmo OWNER até dito o contrário (ASSUMPTION) | — |
| GAP-02 | Conteúdo das ferramentas piloto (perguntas do scanner, regra de resultado) | RQ-101 |
| GAP-03 | ~~Fornecedor de analytics~~ **Fechada** (DEC-U11) | — |
| GAP-04 | Regras de uso do logo (tamanho mínimo, área de respiro, fundos) | RQ-003 |
| GAP-05 | Evidências com fonte para as relações do grafo (`evidence_ids`) | Publicar `evidence_level` acima de `hypothesis` |
| GAP-06 | ~~Ferramentas × Loja~~ **Fechada** (DEC-U9) | — |
| GAP-07 | Política de dados do Resultado (salvar? conta? anônimo?) | RQ-102 |

## 5. Perguntas ao usuário — **todas respondidas** (ver DEC-U6…U13)

| ID | Pergunta | Recomendação |
|---|---|---|
| Q1 | Menu topo Artigos · Mapa · Ferramentas · Sobre e barra inferior Início · Mapa · Ferramentas? | Sim |
| Q2 | Bloco 100vh em todo artigo, com a ilustração do pilar como reserva (emenda ao ADR-12)? | Sim |
| Q3 | Manter `/blog`, `/mapas`, `/about` com rótulos novos, ou renomear com redirect 301? | Manter |
| Q4 | Ferramentas é uma seção nova, separada da Loja? | Sim; a Loja continua sendo a vitrine de soluções |
| Q5 | Quem é o OWNER e a Teia Única está aprovada? | — |
| Q6 | Qual analytics? | Cloudflare Web Analytics + eventos próprios no Worker |
| Q7 | Os 5 textos canônicos substituem a home atual e entram como artigos novos (sem apagar os existentes)? | Sim |
| Q8 | A cadeia canônica do CF-05 está correta? | Sim |
