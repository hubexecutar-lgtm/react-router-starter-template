# LANC-001 — FRD (requisitos funcionais e não funcionais)

- **ID:** RC-FRD-001 · **Versão:** 0.1.0 · **Gerado de:** `requisitos.json` por `render.py` (não editar à mão: editar o JSON e rodar `python3 render.py`)
- **Tipos:** FR funcional · NFR não funcional · RULE regra · CONTENT conteúdo · DATA dados
- **Status:** READY · NEEDS_CONFIRMATION (pergunta Q*) · BLOCKED (lacuna GAP*) · BACKLOG

| Prioridade | READY | NEEDS_CONFIRMATION | BLOCKED | BACKLOG |
|---|---|---|---|---|
| P0 | 13 | 3 | 0 | 0 |
| P1 | 21 | 4 | 0 | 0 |
| P2 | 7 | 1 | 3 | 0 |
| P3 | 1 | 0 | 5 | 1 |

Total: 59 requisitos em 12 épicos.

## EP-01 — Marca e ícones (PR-A)

| ID | Tipo | Prio | Status | Requisito | Critério de aceite | Depende | Fonte |
|---|---|---|---|---|---|---|---|
| RQ-001 | FR | P0 | READY | **Favicon e ícones do pacote BRAND-ASSET-LOGO-001.** Substituir apps/blog/public/favicon/* por favicon.ico (16/32/48/64), PNG 16/32/96, apple-touch-icon 180, PWA 192/512 e maskable 512; links em root.tsx conforme o README do pacote; site.webmanifest com nome Risco Cognitivo. | Os 5 <link> do README presentes no HTML de todas as rotas; manifest válido; arquivos com o sha256 do MANIFEST; npm test verde | — | intake/LOGO_FAVICON_PACKAGE_v1.0.0; CF-10 |
| RQ-002 | FR | P2 | READY | **Logo como identidade em JSON-LD e social.** Usar logo-transparent e social/logo-square-1200x1200 como Organization.logo no JSON-LD e como avatar; OG das páginas continua usando a imagem de hero. | Organization.logo aponta para arquivo publicado; validador de dados estruturados sem erro | RQ-001, RQ-045 | intake/LOGO_FAVICON_PACKAGE_v1.0.0 |
| RQ-003 | RULE | P2 | BLOCKED | **Regras de uso do logo.** Definir tamanho mínimo, área de respiro e fundos permitidos antes de usar o logo em cabeçalho. | Regras registradas no ADR de marca | — | GAP-04; CF-10 |

## EP-02 — Tokens: interface, ilustração, gráficos e motion (PR-B)

| ID | Tipo | Prio | Status | Requisito | Critério de aceite | Depende | Fonte |
|---|---|---|---|---|---|---|---|
| RQ-010 | RULE | P0 | READY | **ADR-13 do blog: Brand Local v7 como identidade única.** Registrar em apps/blog/CLAUDE.md que a paleta e a tipografia de interface são as do v7 (= ADR-11), que o amarelo/preto do v6 foi descartado e que RC-BRAND-STYLING-001 é só a camada de ilustração e vetor. | ADR-13 com status Aceita, citado por PR-B a PR-H | — | DEC-U1; DEC-U2; DEC-U3; CF-01; CF-03 |
| RQ-011 | FR | P0 | READY | **Camada de tokens de ilustração e vetor --illu-*.** Em global.css: --illu-ink #18346F, --illu-blue #3155E7, --illu-coral #F28F83, --illu-blue-soft #A9BFF4, --illu-canvas #F4F6F1. Uso restrito a SVG, ilustrações e fundos decorativos. | tests/surfaces.spec.ts impede esses hex fora de global.css; nenhum seletor de texto usa --illu-coral ou --illu-blue-soft | RQ-010 | DEC-U3; CF-01; RC-BRAND-STYLING-001 |
| RQ-012 | RULE | P0 | READY | **Contraste de objetos gráficos ≥ 3:1.** Marca gráfica com significado (nó, aresta, série, ícone de estado) ≥ 3:1 contra o fundo. Coral (2,33:1) e azul claro (1,83:1) só como preenchimento decorativo ou com contorno ≥ 3:1; nunca como texto nem como único indicador. | Teste de contraste dos tokens de grafo no tokens.spec.ts; axe sem violação de contraste | RQ-011 | CF-02; FT-07; WCAG 2.2 1.4.11 |
| RQ-013 | RULE | P1 | READY | **Gráficos continuam no ADR-04.** Séries de gráfico usam --chart-*; o mapa causal usa --primary para ênfase causal e forma + rótulo para tipo de nó. | Nenhum hex novo em componentes de gráfico | RQ-010 | CF-01; ADR-04 |
| RQ-014 | FR | P0 | READY | **Tokens de motion do v7.** --ease cubic-bezier(.22,1,.36,1); durações nomeadas; keyframes heroReveal (opacity 0→1, translateY 18px→0). Tudo vira 'none' sob prefers-reduced-motion. | Com emulação reduced-motion, nenhuma animação nem transição maior que 0,01s; tokens.spec.ts trava --ease | RQ-010 | DEC-U1; FT-02 |
| RQ-015 | FR | P1 | READY | **Tokens de componentes novos.** --radius-sheet 20px (topo do bottom sheet), --radius-node pílula, --shadow-overlay para drawer e sheet. Cards continuam célula 2px (ADR-12). | surfaces.spec.ts continua exigindo 2px nos cards | RQ-010 | CF-04; FT-03 |

## EP-03 — Shell e navegação v6/v7 (PR-C)

| ID | Tipo | Prio | Status | Requisito | Critério de aceite | Depende | Fonte |
|---|---|---|---|---|---|---|---|
| RQ-020 | FR | P0 | NEEDS_CONFIRMATION | **Nav global no desktop (≥ 900px).** Links visíveis (Artigos · Mapa · Ferramentas · Sobre) e trilha de categorias inline; sem botão de menu. | Em 1280px os links estão visíveis e o drawer não existe no DOM acessível | RQ-010, RQ-050 | DEC-U1; FT-04; CF-12; Q1 |
| RQ-021 | FR | P0 | NEEDS_CONFIRMATION | **Drawer e barra inferior no mobile (< 900px).** Botão de menu abre drawer (largura min(84vw,360px)); barra inferior com 3 itens (Início · Mapa · Ferramentas). | Em 390px: barra inferior com 3 destinos; drawer abre e fecha por toque | RQ-010, RQ-050 | DEC-U1; FT-04; CF-12; Q1 |
| RQ-022 | FR | P1 | READY | **Chrome que esconde junto no scroll.** Nav superior e barra inferior escondem juntas ao rolar para baixo e voltam ao rolar para cima; ficam visíveis com o drawer aberto e quando o foco do teclado está nelas. | Teste Playwright: rolar 600px esconde, rolar -100px mostra; Tab na nav mostra | RQ-020, RQ-021 | intake/README.md (v6 item 1); DEC-U1 |
| RQ-023 | NFR | P0 | READY | **Drawer acessível.** aria-expanded no botão, foco preso, Esc fecha, foco volta ao botão, fundo inert. | hig.spec.ts sem P0/P1; teste de teclado do drawer | RQ-021 | ADR-M03; UX-GOV-HIG-001 |
| RQ-024 | FR | P1 | READY | **Hero com heroReveal.** Hero das páginas aplica heroReveal (RQ-014) sem atrasar o LCP (texto visível no primeiro paint com reduced-motion). | LCP sem regressão em relação a main | RQ-014 | DEC-U1; FT-02 |
| RQ-025 | NFR | P0 | READY | **Alvos de toque de 44px na nav e no mapa.** Itens da barra inferior, do drawer e nós do mapa com alvo ≥ 44×44px (o gate geral continua ≥ 24px). | Teste mede bounding box ≥ 44px | RQ-021 | RC-MOBILE-CAUSAL-MAP-UI-001 (touch.minimum_target) |
| RQ-026 | FR | P1 | READY | **Carrossel com scroll-snap, sem autoplay.** Seção Explorar com scroll-snap (v7), operável por teclado e botões; sem rotação automática. | Sem setInterval/autoplay; setas e Tab percorrem os itens | RQ-010 | FT-01; Índex de rotas §10 |

## EP-04 — Imagens e bloco de imagem do artigo (PR-D)

| ID | Tipo | Prio | Status | Requisito | Critério de aceite | Depende | Fonte |
|---|---|---|---|---|---|---|---|
| RQ-030 | CONTENT | P1 | READY | **Importar as 6 ilustrações RC_* para o banco.** WebP em public/images com variantes 16:9 e retrato; entradas no docs/banco-imagens/manifest.json com tem_texto false, alt descritivo e uso. | manifest com 6 entradas novas; cada uso tem alt; peso ≤ 250 KB por variante | — | FT-05; FT-06; ADR-12 |
| RQ-031 | RULE | P0 | READY | **Imagens REF_* nunca publicadas.** As 3 referências de terceiros (Bauhaus, edifício em corte, mapa urbano) ficam só no intake como referência de estilo. | Nenhum arquivo REF_* em public/ | — | FT-06 |
| RQ-032 | FR | P1 | NEEDS_CONFIRMATION | **Bloco de imagem vertical 100vh em todo artigo.** Art direction: retrato no mobile e 16:9 no desktop, sem cortar pessoa nem cérebro; artigo sem ilustração própria usa a do seu pilar. Exige emenda ao ADR-12. | Todo artigo renderiza o bloco; <picture> com 2 fontes; teste de reflow 320px verde | RQ-030 | DEC-U1; CF-11; Q2 |
| RQ-033 | NFR | P1 | READY | **Imagens sem regressão de LCP/CLS.** Imagem de hero com fetchpriority=high, width/height explícitos, lazy fora da primeira dobra. | CLS ≤ 0,1 nas rotas com imagem | RQ-030 | RQ-110 |

## EP-05 — Conteúdo canônico — 3 pilares (PR-E)

| ID | Tipo | Prio | Status | Requisito | Critério de aceite | Depende | Fonte |
|---|---|---|---|---|---|---|---|
| RQ-040 | CONTENT | P1 | NEEDS_CONFIRMATION | **Home com o texto canônico RC-LP-001.** Texto do RC-LP-001 sem reescrita, na anatomia de página (hero, 3 seções de pilar com 'Saiba mais ›', 'Por onde começar?'), na ordem Problema → Conhecimento → Ferramenta → Ação. | Texto idêntico ao canônico (teste compara parágrafos); hig.spec verde | RQ-020, RQ-030 | CF-14; Q7; RC-LP-001 |
| RQ-041 | CONTENT | P1 | NEEDS_CONFIRMATION | **Publicar os 4 artigos canônicos.** RC-ART-P1-001, RC-ART-P2-001, RC-ART-P3-001 e RC-ART-MASTER-001 como artigos novos pelo pipeline editorial, mantendo IDs e texto. | 4 rotas /blog/:slug novas no hub (ADR-06) e no sitemap | RQ-032 | FT-05; Q7 |
| RQ-042 | CONTENT | P1 | READY | **Fontes RC-SRC-001 como referências.** As 12 fontes viram referências nos artigos e entradas em /evidencias. | Cada fonte com link funcionando | RQ-041 | RC-SRC-001 |
| RQ-043 | RULE | P0 | READY | **Rótulo de conceito metodológico.** 'Processo neuroadaptativo' e a cadeia Risco → Compensação → Solução aparecem como conceitos do projeto, nunca como norma ou constructo científico. | Revisão editorial no PR; nenhum texto atribui o conceito a ISO/W3C | — | CF-15; RC-EDITORIAL-PACK-001 README |
| RQ-044 | FR | P2 | READY | **Bloco 'Próximo passo' no fim de todo artigo.** Artigos terminam com um CTA contextual (mapa ou ferramenta) e conteúdos relacionados; o modelo de 9 partes (Promessa → Próximo passo) vale para artigos novos. | Todo artigo tem exatamente 1 CTA primário no bloco final | RQ-053 | Índex de rotas §3 e §7 |
| RQ-045 | FR | P1 | READY | **JSON-LD BlogPosting nos artigos.** headline, datePublished, dateModified, author, image e publisher (Organization com logo). | Rich Results Test sem erro em 1 artigo de amostra | RQ-041 | FT-08; Índex de rotas §12 |
| RQ-046 | DATA | P1 | READY | **Pilares como taxonomia.** Pilar 1 Riscos Cognitivos, Pilar 2 Processos Neuroadaptativos, Pilar 3 Ferramentas e Soluções mapeados para /temas e para os nós do grafo. | Todo artigo canônico tem pilar | — | RC-LP-001 |

## EP-06 — Arquitetura de informação e jornada (PR-F)

| ID | Tipo | Prio | Status | Requisito | Critério de aceite | Depende | Fonte |
|---|---|---|---|---|---|---|---|
| RQ-050 | FR | P0 | NEEDS_CONFIRMATION | **Menu principal Artigos · Mapa · Ferramentas · Sobre.** Rótulos novos sobre URLs existentes: Artigos → /blog, Mapa → /mapas, Sobre → /about; Ferramentas → /ferramentas (nova). | Menu igual no desktop, no drawer e no rodapé-diretório | — | CF-12; CF-13; Q1; Q3 |
| RQ-051 | RULE | P0 | READY | **Toda rota nova no hub e no sitemap.** Rotas novas (/mapas/explorar, /mapas/explorar/:fatorId, /mapas/personalizar, /ferramentas) entram em app/data/routes.ts. | npm run routes:check verde | — | ADR-06 |
| RQ-052 | FR | P1 | READY | **Quatro perguntas em toda página.** Onde estou (eyebrow ou breadcrumb), o que significa (lead), por que importa (seção) e próxima ação (CTA primário). | hig.spec verifica eyebrow, h1, lead e 1 CTA primário por região | RQ-020 | Índex de rotas (regra transversal) |
| RQ-053 | RULE | P1 | READY | **Escada de CTA e 1 CTA primário por região.** CTA 0 continuar lendo → 1 exemplo → 2 explorar o mapa → 3 usar a ferramenta → 4 salvar resultado → 5 guia → 6 solução. | Nenhuma região com 2 botões primários | — | Índex de rotas §7; neurodesign regra 01 |
| RQ-054 | FR | P2 | READY | **Blog como índice por problemas.** Chips Atenção · Memória · Sobrecarga · Interrupções · Decisão · Organização e 'Explore por' Problemas · Processos · Contextos · Soluções · Ferramentas. | Chips filtram a lista e são links compartilháveis | RQ-062 | Índex de rotas §2 |

## EP-07 — Modelo de dados do grafo causal (Teia Única) (PR-G)

| ID | Tipo | Prio | Status | Requisito | Critério de aceite | Depende | Fonte |
|---|---|---|---|---|---|---|---|
| RQ-060 | DATA | P1 | READY | **Schema canônico único do grafo.** Armazenamento no formato CORRELATION_RECORD da Teia Única (nós e arestas tipados, proveniência, papel epistêmico, status); o mapa é projeção para 9 tipos visuais (06-DATA-SPEC). | npm test valida o grafo contra CORRELATION_RECORD.schema.json e as 7 regras do 06-DATA-SPEC §5 | — | CF-05; CF-09; Teia CORRELATION_RECORD; RC-MOBILE causal_data_model; CF-17 |
| RQ-061 | RULE | P1 | NEEDS_CONFIRMATION | **Cadeia causal canônica.** Objetivo → Contexto → Demanda → Vulnerabilidade → Exposição → Risco → Evento → Impacto → Compensação → Controle/Solução → Resultado → Medição → Aprendizado. | Enum de tipos do schema = esta cadeia + evidence | — | CF-05; Q8 |
| RQ-062 | DATA | P1 | READY | **Grafo inicial a partir dos artigos canônicos.** Nós do vocabulário P1/P3 (interrupção, troca de tarefa, sobrecarga, ambiguidade, pressão temporal, perda de contexto, retrabalho, erro; compensações externalização, redução, explicitação, automação). Relação não explícita no texto = E_INFERRED + PROPOSED. | Todo nó cita o artigo de origem; nenhuma relação inferida aparece como evidência | RQ-060 | CF-06; Teia (regra de fonte de verdade); CF-16 |
| RQ-063 | RULE | P0 | READY | **Nenhum número sem evidência.** Valor quantitativo publicado exige evidence_id e fonte verificável; valores de mockup ('+42%', barras) não entram. | Teste falha se nó ou aresta tiver métrica sem evidence_ids | — | AC-005; CF-06 |
| RQ-064 | RULE | P2 | READY | **Onde vive o código do grafo.** Em apps/blog até o workflow consumir o mesmo grafo; então packages/rc-graph (ADR-M01). | — | RQ-060 | ADR-M01; CF-09 |
| RQ-065 | RULE | P2 | READY | **Persistência sem Supabase.** Grafo versionado no repo na fase 1; Cloudflare D1 se o CMS precisar editar. | Nenhuma dependência @supabase/* | — | CF-08; ADR-07 |

## EP-08 — Mapa causal mobile-first — Explorar e Detalhe (PR-H)

| ID | Tipo | Prio | Status | Requisito | Critério de aceite | Depende | Fonte |
|---|---|---|---|---|---|---|---|
| RQ-070 | FR | P1 | READY | **Explorar: grafo radial focus + context.** /mapas/explorar abre com 1 nó focal e no máximo 8 nós visíveis; tocar um nó seleciona, destaca arestas, esmaece o resto, recentra e expande os vizinhos. | Teste conta ≤ 8 nós na carga; toque recentra | RQ-062, RQ-079 | RC-MOBILE SCR-02; AC-004; INT-002 |
| RQ-071 | FR | P1 | READY | **Bottom sheet de detalhe.** Snap recolhido/médio/expandido; abas Causas · Impactos · Soluções · Evidências; arrastar e botões; Esc fecha no desktop. | Operável só por toque e só por teclado | RQ-070 | RC-MOBILE SCR-03; INT-005 |
| RQ-072 | FR | P1 | READY | **Rota de detalhe do fator.** /mapas/explorar/:fatorId compartilhável; voltar ao mapa preserva a seleção. | Abrir fator e voltar só por toque | RQ-070 | RC-MOBILE ROUTE-FACTOR; AC-002; INT-003 |
| RQ-073 | NFR | P0 | READY | **Alternativa em lista.** Aba Lista com o mesmo conteúdo do grafo (nós, relações em texto), navegável por teclado e leitor de tela. | Toda aresta do grafo aparece como frase na lista | RQ-070 | AC-006; accessibility.graph |
| RQ-074 | FR | P2 | READY | **Filtros por tipo de nó.** Chips por tipo da cadeia canônica (não por estilo de vida/saúde). | Filtro reduz nós sem quebrar o foco | RQ-070 | RC-MOBILE filters; CF-06 |
| RQ-075 | NFR | P1 | READY | **Nada depende de hover; pan/zoom são secundários.** Toda função essencial por toque e teclado; pan e zoom complementam. | Teste sem hover cobre todos os fluxos | RQ-070 | INT-001; INT-004 |
| RQ-076 | NFR | P1 | READY | **Semântica visual além da cor.** Tipo de nó por forma + rótulo (● ◆ ■ ▲ ! ✦ ⬢ ✓ ○); tipo de aresta por traço (sólida/tracejada) + rótulo textual. | Em escala de cinza os tipos continuam distinguíveis | RQ-011, RQ-012 | Causal Knowledge Graph; accessibility.color |
| RQ-077 | NFR | P0 | READY | **Reflow em 320px.** Mapa e sheet funcionam em 320px sem rolagem horizontal da página. | hig.spec reflow verde em /mapas/explorar | RQ-070 | AC-001 |
| RQ-078 | FR | P2 | READY | **Modo 'Por quê?'.** A partir de um nó, mostra a cadeia de causas acima e as compensações abaixo. | Cadeia exibida também em texto | RQ-070 | Causal Knowledge Graph |
| RQ-079 | NFR | P1 | READY | **Stack do mapa carregada só na rota.** React Flow + Dagre client-only e em lazy load em /mapas/explorar; Cytoscape adiado. | Bundle das outras rotas sem crescimento; INP ≤ 200ms no mapa | — | CF-08 |
| RQ-080 | FR | P3 | READY | **Modos Problemas, Soluções, Evidências.** Presets de filtro sobre o mesmo grafo. | — | RQ-074 | Causal Knowledge Graph (4 modos) |
| RQ-081 | FR | P3 | BACKLOG | **Simulação 'e se…' (estilo LOOPY).** Fora desta onda; só com modelo e dados que sustentem os números. | — | RQ-063 | Causal Loop Diagram |

## EP-09 — Personalizar (PR-I)

| ID | Tipo | Prio | Status | Requisito | Critério de aceite | Depende | Fonte |
|---|---|---|---|---|---|---|---|
| RQ-090 | FR | P2 | NEEDS_CONFIRMATION | **Personalizar em 3 passos.** /mapas/personalizar: focos de trabalho, interesses e 'Mostrar evidências'; muda só a ordem e o destaque, nunca os fatos; guardado localmente, sem conta. | Limpar dados do navegador volta ao padrão; nenhum dado sai do dispositivo | RQ-070 | RC-MOBILE SCR-04; CF-07 |

## EP-10 — Ferramentas e Resultado (PR-J)

| ID | Tipo | Prio | Status | Requisito | Critério de aceite | Depende | Fonte |
|---|---|---|---|---|---|---|---|
| RQ-100 | FR | P2 | BLOCKED | **Índice de Ferramentas.** /ferramentas lista scanner, checklists e avaliações com o mesmo card-célula. | — | RQ-050 | GAP-02; GAP-06; Q4 |
| RQ-101 | FR | P3 | BLOCKED | **Ferramenta piloto: interrupções do processo.** 5–8 perguntas → resultado (exposição, interrupções, recuperação de contexto) → 3 ações + 1 artigo + 1 ferramenta + próximo passo. | — | RQ-100 | Índex de rotas §4; GAP-02 |
| RQ-102 | FR | P3 | BLOCKED | **Página de Resultado.** /resultado/:id com explicação e próximos passos. | — | RQ-101 | GAP-07 |

## EP-11 — Medição e performance (PR-K)

| ID | Tipo | Prio | Status | Requisito | Critério de aceite | Depende | Fonte |
|---|---|---|---|---|---|---|---|
| RQ-110 | NFR | P1 | READY | **Gate de Core Web Vitals.** p75 mobile e desktop: LCP ≤ 2,5s, INP ≤ 200ms, CLS ≤ 0,1. | Lighthouse CI ou medição registrada no PR das rotas tocadas | — | Índex de rotas §12 |
| RQ-111 | FR | P2 | BLOCKED | **Eventos por estágio da jornada.** BLOG/ARTICLE/TOOL/RESULT/BUSINESS com problem_id, solution_id, capability_id, asset_id, qfw_id, campaign_id quando houver. | — | RQ-060 | Índex de rotas §11; Teia N8; GAP-03 |

## EP-12 — Adapters da Teia Única (Quick Framework, Loja) (PR-L)

| ID | Tipo | Prio | Status | Requisito | Critério de aceite | Depende | Fonte |
|---|---|---|---|---|---|---|---|
| RQ-120 | DATA | P3 | BLOCKED | **correlation_refs no Quick Framework.** Adapter adiciona correlation_refs e solution_candidates sem mudar as 12 seções. | — | RQ-060 | Teia N2; GAP-01 |
| RQ-121 | DATA | P3 | BLOCKED | **Descoberta na Loja por problema + compensação.** Loja ganha correlation_refs e filtro por problem + operational_function + compensation + fit. | — | RQ-060 | Teia N3/N7; GAP-01 |
| RQ-122 | DATA | P3 | BLOCKED | **Registries canônicos.** problems, operational_functions, cognitive_capacities, factors, compensations, controls, capabilities, app_features. | — | RQ-060 | Teia N1; GAP-01 |
