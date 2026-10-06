# Auditoria de identidade visual

**ID:** AUD-IDENTIDADE-VISUAL-001  
**Versão:** 1.0.0  
**Área:** Design System / Blog Risco Cognitivo  
**Status:** AUDITADO NO CÓDIGO; VALIDAÇÃO VISUAL PUBLICADA PENDENTE  
**Escopo:** Auditoria informativa, sem alteração de código.

## Conclusão

Há um conflito real entre a identidade global azul e a identidade laranja criada para a home. A separação foi intencional no código, mas produz a mistura apontada. A auditoria foi feita no código local; não houve alterações nem validação visual do site publicado.

| Prioridade | Achado | Evidência no código |
| --- | --- | --- |
| Alta | Ações, links, foco e navegação usam `--primary: #2563eb`; a home define `--home-accent: #ff5b0a` e `--home-accent-strong: #c2410c`. As duas cores aparecem inclusive dentro da própria home. | `apps/blog/app/styles/global.css`; `apps/blog/app/styles/home.css` |
| Alta | O hero é um grande cartão laranja com texto branco, raio de 20 px e botão de 14 px. O restante do sistema usa superfícies neutras, cartões de 2 px e controles de 8 px. Isso rompe a linguagem de composição da referência branca apresentada. | `apps/blog/app/styles/home.css`; `apps/blog/app/styles/global.css` |
| Alta | O cérebro não é o hero inicial: aparece depois das seções “Hero”, “Dados” e “Risco”. Além disso, a arte é uma nuvem de pontos, não um modelo volumétrico com os sulcos visíveis nas imagens de referência. O pôster local confirma essa diferença de forma. | `apps/blog/app/components/landing/Landing.tsx`; `apps/blog/app/features/home-brain/brain-renderer.client.ts`; `apps/blog/public/models/home-brain/brain-poster.webp` |
| Média | Há camadas de medidas sobrepostas: `--ref-*`, `--hy-*`, `--radius-*` e `--home-*`. Algumas são aliases úteis; outras estabelecem raios e dimensões diferentes para a mesma função visual. | `apps/blog/app/styles/global.css`; `apps/blog/app/styles/home.css` |
| Média | A documentação diverge do código: um documento registra primário `#306DD4`, o CSS usa `#2563eb`, e a regra atual proíbe laranja fora da home. Portanto, uma identidade laranja transversal exige atualizar também a decisão documentada e as verificações que a impõem. | `apps/blog/docs/design-system/DS-SURFACE-UNIFICATION-001.md`; `apps/blog/CLAUDE.md`; `apps/blog/tests/tokens.spec.ts` |
| Média | O tema escuro está identificado no próprio CSS como provisório e usa primário azul, enquanto a home define outro laranja para o escuro. Falta uma decisão única para os dois temas. | `apps/blog/app/styles/global.css`; `apps/blog/app/styles/home.css` |

## O que não constitui conflito por si só

As cores de categorias da loja, séries de gráficos, estados críticos e ilustrações têm funções semânticas específicas. Unificar a identidade não requer pintar todos esses dados de laranja. Os três CSS dos componentes `plain` também consomem, em geral, aliases globais em vez de criar outra paleta.

## Direção recomendada para implementação futura

Definir uma única fonte para cor de ação, superfícies, tipografia, raios e foco; fazer home, navegação, artigos, mapas e componentes compartilhados consumirem esses papéis; reservar cores adicionais para dados e estados com significado. A composição inicial deve colocar o cérebro no hero se a intenção continua sendo a referência enviada. Essa mudança precisa incluir documentação e testes que hoje fixam o azul e a exceção da home.

## Limites e rastreabilidade

Foram examinados os cinco arquivos CSS da aplicação, os usos relevantes em rotas e componentes e os contratos documentados. Não foram executados testes nem auditoria visual das 21 rotas em navegador; portanto, a conclusão sobre consistência publicada permanece limitada à evidência do código e ao pôster local. Nenhum arquivo do repositório foi alterado nesta solicitação.
