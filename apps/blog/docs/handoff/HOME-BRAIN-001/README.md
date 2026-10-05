---
ID: HOME-BRAIN-001
VERSION: 1.1.0
AREA: Home · Experiência interativa
WORKFLOW: Referência → Design → Modelo 3D → Integração → Testes → Release
OWNER: Leonardo (OWNER da Teia, ADR-M04, para os nós novos); produto A DEFINIR
STATUS: VERIFIED_LOCAL — release pelo merge do PR (Workers Builds)
DEPENDS_ON: PR #34 (Editorial Hybrid v4) em main; grafo RC (rc-graph.json)
---

# Home com cérebro 3D (RC-HOME-002)

A home passa a ser o esboço `risco-cognitivo-home-css-v4.html` enviado pelo usuário, com o tratamento da seção
"Region: Earth" da cloudflare.com: hero em cartão laranja com retícula, mapa interativo com um cérebro 3D pontilhado
no lugar do globo, marcadores circulares, explicação com cantos e cards separados por linhas finas. O RC-LP-001, que
era a home, foi para `/comece/` sem reescrita.

## Decisões do usuário (2026-10-05)

| Pergunta | Decisão |
|---|---|
| Base (AUD-ORDEM-001) | Esperar o PR #34 e partir de `main` atualizada (5f1cb05) |
| Conteúdo | A home do esboço completa substitui o RC-LP-001 na `/` |
| RC-LP-001 | Nova rota `/comece/` |
| Seletores | 3 nós novos no grafo (Memória de trabalho, Controle inibitório, Flexibilidade cognitiva) |
| Estatísticas | Ficam, com a fonte primária linkada e listada em `/fontes/` |

## O que entrou

| Camada | Arquivo | Papel |
|---|---|---|
| Texto | `docs/lancamento/LANC-001/intake/HOME-002/RC_HOME_002.txt` → `app/data/home.ts` | Canônico da home, sem reescrita |
| Página | `app/components/landing/Landing.tsx`, `app/routes/home.tsx` | 10 seções na ordem do esboço; loader SSR/prerender |
| Cena | `app/features/home-brain/BrainHero.tsx`, `brain-renderer.client.ts` | Seletores, painel, controles; Three.js só após a hidratação |
| Dados | `app/features/home-brain/topics.server.ts`, `app/data/graph/rc-graph.json` | Relações do grafo e link `?foco=` |
| Rota | `app/routes/comece.tsx`, `app/components/landing/CanonicalLanding.tsx` | RC-LP-001 (RQ-040) em `/comece/` |
| Estilo | `app/styles/global.css`, bloco `HOME-BRAIN-001` | Tokens `--home-*`/`--brain-particle` (claro e escuro) e layout |
| Asset | `public/models/home-brain/` e `scripts/prepare-home-brain.mjs` | Pontos, poster, manifest e avisos (CC0) |
| Testes | `tests/home-brain.spec.ts` (`npm run test:brain`), `tests/editorial.spec.ts`, `tests/graph.spec.ts` | Gate da cena, texto e grafo |

## Modelo 3D e licença

O pacote original (ZIP v1.0.0) amostrava um GLB do repositório `StarKnightt/brain-explorer`, que **não declara
licença**: só os dados de origem do OpenNeuro são CC0. Para não depender dessa malha, os pontos foram regerados direto
das superfícies FreeSurfer do OpenNeuro **ds006128** (sub-01, snapshot 1.0.11, CC0-1.0). O gerador
`scripts/prepare-home-brain.mjs` não tem dependências, confere o SHA-256 de cada arquivo de origem e é determinístico:

- 36.000 pontos nas superfícies pial, por área × profundidade do sulco (cristas cheias, vales esvaziados: é o que
  desenha os giros); 5.000 na casca do cerebelo e 1.000 no tronco (rótulos do `aseg.mgz`).
- Centralizado, escalado e quantizado em int16: 42.000 pontos em 252.000 bytes.
- O poster `brain-poster.webp` (1200 × 900, com transparência) é um render da própria cena e serve de fallback e de
  imagem antes do 3D.

Os marcadores são conceituais: a página diz isso e eles não indicam localização anatômica das funções.

## Experiência

- Sem movimento reduzido, a cena gira devagar. Com movimento reduzido, começa parada. "Pausar" e "Girar" alternam.
- Arrastar gira, e no mouse também inclina. No toque, `touch-action: pan-y` mantém a rolagem vertical.
- Selecionar uma função pausa a rotação, mostra Demanda, Dificuldade possível, Estratégia de apoio e as relações do
  grafo, e linka `/mapas/explorar/?foco=<ID>`. O mapa já preserva esse foco, e um ID inválido cai no foco padrão.
- Setas percorrem os seletores (roving tabindex); os botões de girar e "Restaurar vista" funcionam por teclado.
- Fora da tela ou com a aba oculta, os quadros param. Ao desmontar, a cena libera listeners, observers, RAF e GPU.
- Falha do asset ou perda de contexto: o poster, os seletores e o mapa continuam, e há um botão de nova tentativa.
- Sem JS: poster e links diretos para as 4 funções no mapa.
- Eventos `TOOL/select` e `TOOL/cta` no endpoint `/api/eventos` existente (ADR-20), com o ID canônico.

## Fidelidade visual

As cores laranja vêm do esboço. As medidas da Cloudflare foram reconstruídas das capturas (`Home_.zip`); a fonte e
os tokens internos dela não foram comprovados, e nenhum texto, número ou marca da Cloudflare foi usado. Desvio de
acessibilidade: o hero usa `#C2410C` (branco 5,18:1) no lugar do `#FF5A08` do esboço, que daria 3,1:1 e reprovaria AA.

## Release e reversão

O merge do PR em `main` publica pelo Workers Builds. Para reverter, faça o revert do merge commit: a home volta a ser
o RC-LP-001, e os nós novos do grafo saem juntos.
