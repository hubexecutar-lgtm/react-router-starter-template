---
id: ADR-BLOG-JORNADA-ROTAS-001
version: 1.0.0
area: Produto / Arquitetura da Informação / UX / Blog Risco Cognitivo
workflow: Home → Blog → Artigos → Mapa Cognitivo → Ferramentas → Resultado → Próxima ação
owner: A DEFINIR
status: ACEITO (2026-10-06, ADR-26 em apps/blog/CLAUDE.md)
automation_level: A1
depends_on:
  - ADR-M04 (grafo canônico)
  - ADR-06 (registro de rotas)
  - decisão sobre design system transversal
blocks:
  - reconstrução das páginas públicas por rota
  - publicação de categorias editoriais e ferramentas definitivas
evidence:
  - instrução do usuário nesta conversa, 2026-10-06
  - apps/blog/app/routes.ts
  - apps/blog/app/data/routes.ts
  - apps/blog/app/components/site/nav.ts
  - apps/blog/app/lib/articles.ts
  - apps/blog/app/features/store/data/repository.ts
  - apps/blog/CLAUDE.md (ADR-13, ADR-14, ADR-16, ADR-18, ADR-23)
---

# ADR-BLOG-JORNADA-ROTAS-001 — Uma home por área e uma jornada contínua

## 1. Estado da decisão

**Proposta documentada, ainda não implementada nem aceita no repositório.** O usuário definiu a intenção de simplificar o site, manter as rotas necessárias e deixar em cada rota um único layout demonstrativo enquanto as páginas são reconstruídas com um novo design. Este ADR registra essa intenção e o contrato para implementação posterior. Não altera código, conteúdo publicado ou URLs.

**Contexto.** O projeto hoje tem páginas públicas, rotas administrativas, artigos, mapa e catálogo, com vários padrões visuais, dados de exemplo e caminhos paralelos. A home atual contém narrativa longa e o cérebro como seção interna; o catálogo exibe itens temporários. O visitante precisa compreender onde está, escolher um assunto, aprofundar a leitura, explorar o mapa e chegar a uma ferramenta ou próxima ação sem perder o contexto.

**Resultado esperado.** Uma arquitetura com quatro homes e páginas de detalhe distintas: home geral (`/`), home editorial (`/artigos/`), home de Mapa Cognitivo (`/mapas/`) e home de Ferramentas e Soluções (`/ferramentas/`). Todas usam um design system transversal, mas cada home apresenta a função da sua área. A fase de reconstrução expõe somente um exemplo de layout por rota ou família de rotas dinâmicas, claramente identificado como demonstração.

## 2. Decisão de arquitetura da informação

### 2.1 Jornada principal

| Etapa | Pergunta do visitante | Resposta da interface | Saída principal |
| --- | --- | --- | --- |
| Home | “O que é e por onde começo?” | Problema reconhecível, orientação, prévia de Blog, Mapa e Ferramentas | Blog ou Mapa; ferramenta quando a intenção já é prática |
| Blog | “Qual tema se aplica a mim?” | Índice editorial com temas, destaques e contextos | Artigo específico |
| Artigo | “Como isso funciona e qual a evidência?” | Explicação do problema, mecanismos, limites, fontes e aplicação | Foco relacionado do Mapa; conteúdo relacionado |
| Mapa Cognitivo | “Como os fatores se conectam no meu caso?” | Cérebro 3D interativo, cards e relações entre risco, demanda, vulnerabilidade, função e solução | Explorar, personalizar ou abrir ferramenta relacionada |
| Ferramentas e Soluções | “O que posso aplicar?” | Índice por tipo, problema, função executiva e contexto | Ferramenta utilizável ou material disponível |
| Resultado | “O que este exercício mostrou?” | Resultado da ferramenta, interpretação e limites | Próxima ação contextual |
| Próxima ação | “O que faço agora?” | Guia, método, produto, serviço ou conteúdo relacionado, conforme o resultado | Ação acessível e verificável |

A sequência é a **espinha dorsal**, não um funil obrigatório: links diretos da Home para Mapa, Artigos, Ferramentas ou uma experiência prática permanecem. Cada saída contextual deve carregar o assunto selecionado por URL ou outro mecanismo explicitamente documentado.

### 2.2 Contrato das rotas

| Rota atual | Papel decidido | Layout demonstrativo único durante a reconstrução | Próximo passo contextual |
| --- | --- | --- | --- |
| `/` | Home geral e landing: apresenta problema, orienta e mostra prévia de todas as áreas; inclui prévia do **mesmo cérebro** usado no mapa. | Um hero e blocos de prévia de Blog, Mapa e Ferramentas, com CTAs válidos. | `/artigos/`, `/mapas/` ou ferramenta publicada |
| `/artigos/` | **Home do Blog**: temas organizados, destaques, busca/filtros editoriais e caminhos de leitura. O nome público pode ser “Blog”; a URL atual é preservada. | Um índice editorial com ao menos um card de artigo real ou demonstração rotulada. | `/artigos/:slug/` |
| `/artigos/:slug/` | Aprofunda um problema específico, causas, evidências, aplicações e limites. | Um único template de artigo; durante a fase demonstrativa, publicar somente o exemplo autorizado. | Foco do mapa + leituras relacionadas |
| `/mapas/` | **Home do Mapa Cognitivo**: cérebro 3D reutilizado em tamanho principal, com rotação, seleção de conceitos, cards explicativos e orientação de uso. | Uma composição interativa com fallback estático, sem afirmar localização anatômica isolada de funções. | Explorar um foco ou personalizar |
| `/mapas/explorar/` | Relações causais, modos, filtros e evidências do grafo canônico. | Um estado de exploração representativo. | Fator, solução relacionada ou personalização |
| `/mapas/explorar/:fatorId/` | Detalhe de um fator e suas relações rastreáveis. | Um template de detalhe, com exemplo válido do grafo. | Voltar ao mapa preservando o foco; ir a solução existente |
| `/mapas/personalizar/` | Seleciona interesses e prioridades, sem produzir diagnóstico clínico. | Um fluxo curto funcional com estado local e opção de limpar. | Explorar o mapa com foco escolhido |
| `/ferramentas/` | **Home de Ferramentas e Soluções**: tipos, exemplos reais e descoberta por problema, função executiva e contexto. | Um catálogo reduzido, sem itens fictícios apresentados como disponíveis. | Categoria ou item publicado |
| `/ferramentas/:type/` | Índice de um tipo publicado. | Um template de categoria; categoria sem item real apresenta estado vazio honesto. | Item válido |
| `/ferramentas/:type/:slug/` | Detalhe da solução: propósito, entrada, etapas, saída, fontes e modo de acesso. | Um template de item. | Usar, baixar ou abrir o destino real; caso contrário, indicar indisponibilidade sem CTA falso |
| `/prisma/` | Exemplo de ferramenta interativa que já produz resultado local e exportável. | Fluxo próprio de entrada → resultado → próxima ação. | Resultado e recomendação relacionada |
| `/sobre/` | Autor, projeto, princípios e limites. | Uma página institucional simples. | Blog ou Fontes |
| `/fontes/` | Evidências, origem e escopo de cada afirmação. | Um índice de fontes verificáveis. | Voltar ao artigo ou fator de origem quando possível |
| `/comece/` | Preserva a página canônica RC-LP-001 nesta fase. | Um único layout de orientação; decidir consolidação com a Home em ADR posterior, sem apagar o texto canônico. | Conteúdo ou Mapa |
| `/admin/*` | Ferramentas internas de operação e showroom. | Fora da jornada pública. | Acesso e indexação definidos por contrato próprio |

**Resultados e próxima ação são estados semânticos de ferramentas e páginas de detalhe**, não novas URLs obrigatórias. Uma rota de resultado só será criada se houver contrato aprovado para persistência, privacidade, expiração, compartilhamento e recuperação. O Prisma pode continuar com resultado local em `/prisma/`.

## 3. Taxonomia única, com facetas distintas

O mesmo vocabulário classifica artigos, itens do catálogo e entradas do mapa. Um conteúdo pode ter várias tags, mas cada faceta tem significado próprio. O rótulo “Neurodivergência” funciona como tema guarda-chuva, sem supor que todas as pessoas compartilhem a mesma condição ou necessidade.

| Faceta | Valores iniciais propostos | Regra |
| --- | --- | --- |
| Neurodivergências e perfis | Neurodivergência, TDAH, dislexia, altas habilidades e outras neurodivergências | Tema editorial; afirmações específicas exigem fonte e escopo apropriado |
| Funções cognitivas | Funções executivas e seus subtemas documentados no grafo | Relacionar ao conceito canônico, sem equivaler condição a função |
| Domínios de conhecimento | Gestão de projetos, gestão de processos, tecnologia e inteligência artificial | Classificam disciplina/aplicação; podem coexistir com uma condição |
| Contextos | Rotina, trabalho e estudos | Classificam onde o problema ou solução aparece |
| Problemas e soluções | IDs do grafo canônico e compensações existentes | Criar vínculo somente quando há relação e proveniência registradas |
| Formato de recurso | Automação/IA, e-book/PDF, ferramenta interativa, app, tutorial/guia | Um tipo de item primário e tags adicionais; evitar duplicar o mesmo item em várias URLs |

**Blog.** A home editorial oferece entrada por tema, destaque e contexto; `/artigos/:slug/` guarda o texto único do artigo. O filtro de tema pode começar por parâmetro de busca em `/artigos/`; páginas próprias de tema (`/artigos/temas/:slug/`) só entram após conteúdo suficiente, taxonomia e requisito de SEO definidos. Não criar rotas vazias para todos os rótulos.

**Ferramentas.** O grupo Automação e IA inclui skills, agentes, prompts e fluxos automatizados. Materiais incluem e-books, PDFs e workbooks. Ferramentas interativas incluem scanner, checklist, avaliação, calculadora e mapa quando forem experiências executáveis. Apps e tutoriais podem ter tipos próprios no catálogo quando houver itens publicados. Cada item declara `type`, `topics`, `contexts`, `cognitiveFunctions`, `problemRefs`, `solutionRefs`, `deliveryMode` (`use`, `download`, `external`), `href`, `status` e evidência/proveniência aplicável. O schema exato e a migração dos oito tipos atuais ficam para implementação.

## 4. Regra de simplificação por rota

1. **Uma composição demonstrativa por rota fixa e um template por família dinâmica**, com um exemplo válido por família. Evitar galerias de variações e misturas de layouts no site público.
2. Um exemplo pode ser visualmente completo, mas deve ser rotulado como demonstração quando o conteúdo ou a ação não for real. Itens de catálogo mock não devem parecer produtos publicados; CTAs `#` não são ações válidas.
3. Conteúdo MDX, fontes, grafo, IDs canônicos, mídias licenciadas, contratos e histórico de decisões permanecem preservados. A limpeza é de **apresentação pública e indexação**, não exclusão irreversível de fontes. Antes de ocultar páginas, inventariar URL, ID, status e destino de cada uma.
4. URL pública existente continua respondendo com conteúdo real, redirecionamento apropriado ou estado explícito. Não deixar links da Home, dos artigos, do mapa e do rodapé apontarem para itens demonstrativos indisponíveis.
5. O mesmo asset/controlador 3D alimenta prévia na Home e experiência completa em `/mapas/`, com configuração de enquadramento e interações por contexto, poster/fallback, teclado, rotação controlável e movimento reduzido.
6. O design system transversal governa tokens e componentes; cada home pode ter composição própria sem redefinir uma paleta de identidade concorrente. **Cores, tipografia e formas finais: A DEFINIR** por decisão visual separada.

## 5. Conflitos e dependências

| Contrato existente | Conflito ou emenda necessária | Tratamento |
| --- | --- | --- |
| ADR-13/14 (site do zero e frontend Stories) | A nova arquitetura reconstrói a apresentação sem necessariamente substituir as fontes editoriais. | Registrar emenda após aceite; preservar conteúdo e URLs canônicas. |
| ADR-18 e ADR-23 (RC-LP-001 em `/comece/`; RC-HOME-002 na `/`) | Home geral passa a ser hub de todas as áreas e prévia do cérebro; Mapa recebe a interação principal. | Manter RC-LP-001 em `/comece/`; qualquer alteração da copy RC-HOME-002 segue a cadeia canônica e seus testes. |
| ADR-16 (catálogo em `/ferramentas/`) | Tipos novos e itens definitivos substituem dados de exemplo, sem criar segunda loja. | Preservar `/ferramentas/` e redirecionamentos existentes de `/loja/*`; migrar schema de forma versionada. |
| ADR-06 (hub de rotas) | Toda mudança de caminho, slug ou exposição precisa estar no registro. | Atualizar `app/routes.ts`, `app/data/routes.ts`, navegação, sitemap, links e redirect no mesmo trabalho. |
| ADR-M04 (grafo canônico) | Cérebro e recomendações não podem inventar relações anatômicas ou causais. | Reutilizar IDs e relações com proveniência; distinguir inferência de evidência. |
| Decisão visual anterior (azul global; laranja isolado na Home) | Não há ainda identidade transversal aprovada. | Design system novo é dependência; este ADR decide arquitetura, não hexadecimal. |

## 6. Plano de execução em nós verificáveis (WIP = 1)

| Nó | Entrada e pré-condição | Entrega | Verificação objetiva |
| --- | --- | --- | --- |
| N1 — inventário | `app/routes.ts`, `app/data/routes.ts`, MDX, grafo, links e catálogo atuais | Tabela URL → finalidade → fonte → destino → status | Nenhuma URL/ID público ou fonte canônica omitida |
| N2 — contratos de conteúdo | N1; facetas deste ADR | Schema editorial e de ferramentas, tags e referências do grafo | Um conteúdo pertence a uma fonte; filtros não duplicam URL canônica |
| N3 — design system | Decisão visual transversal e auditoria de tokens | Tokens e modelos de página aprovados | Home, Blog, Mapa e Ferramentas compartilham papéis semânticos |
| N4 — esqueleto de rotas | N1–N3 | Um layout exemplar por rota/família; menu e links válidos | Rotas 200/404/redirect corretas em desktop e mobile |
| N5 — cérebro compartilhado | N3–N4; asset e grafo | Prévia na Home e versão completa no Mapa | Giro, seleção, cards, deep links, fallback e movimento reduzido |
| N6 — cadeia editorial | N2–N4; artigos prontos | Índice por facetas, artigo e ponte para mapa | Tema → artigo → fator preserva contexto e fonte |
| N7 — aplicação e resultado | N2, N4–N6; item real | Ferramentas publicadas e resultado contextual | Mapa/artigo → ferramenta → resultado → ação acessível |
| N8 — medição e revisão | N4–N7 | Eventos mínimos por etapa e auditoria de navegação | Cada transição e abandono pode ser observado sem dados pessoais desnecessários |

Os nós acima são **pendências de implementação**, não estados concluídos por este ADR.

## 7. Critérios de aceite da futura implementação

- Cada entrada pública fixa tem uma função distinta e somente uma composição exemplar durante a transição.
- A Home apresenta problema, orientação, prévia das áreas e links funcionais; o cérebro da Home e o de `/mapas/` partem do mesmo modelo e dos mesmos IDs.
- `/artigos/` organiza os temas declarados neste ADR; um artigo pode ter facetas de condição, domínio, função e contexto simultaneamente, sem taxonomia ambígua.
- Um leitor consegue percorrer **Home → Blog → artigo → foco no Mapa → ferramenta real → resultado → próxima ação**, inclusive em largura móvel e com teclado; atalhos diretos não perdem contexto.
- Todos os itens publicados têm destino utilizável, modo de entrega explícito e estado verdadeiro; placeholders não aparecem como ofertas prontas.
- Informações científicas e relações do mapa mostram fonte, limite e inferência quando aplicável; a interface não transforma a exploração em diagnóstico clínico.
- Preferências locais e resultados informam claramente onde os dados ficam; não se publica rota de resultado compartilhável sem contrato de privacidade e persistência.
- IDs, textos canônicos e URLs legadas são inventariados antes de ocultação ou redirecionamento; `routes:check`, testes de navegação e verificação visual cobrem os caminhos principais.
- Rotas administrativas são separadas da jornada pública; exposição e indexação são verificadas por regra própria.

## 8. Fora do escopo e handoff

Este documento não escolhe a paleta final, não substitui o MDX existente, não publica novas ferramentas, não define diagnóstico clínico e não implementa telas. O detalhe de armazenamento, compartilhamento e autenticação de resultados permanece **A DEFINIR**. O responsável pela aprovação e implantação também permanece **A DEFINIR**.

**Handoff:** após aceite, começar por N1 e formalizar a decisão de design system antes de reconstruir telas. Registrar cada mudança de rota e de fonte no repositório; concluir somente após verificação no domínio publicado. O estado deste documento é `PROPOSTO_PARA_ADOCAO`, pois apenas o ADR foi produzido e revisado contra o código local.
