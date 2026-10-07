## Crítica de design: cérebro atual × globo da Cloudflare × protótipo do Claude Design

Feita com a skill Design 1.2.0 (`/design-critique`). Estágio: **refinamento**. O objeto (o cérebro oco) já existe no
protótipo do Claude Design e precisa virar especificação para a arte e para o código.

As imagens citadas estão nas pastas `referencias/`, `atual/` e `mockups/`. Os mockups foram gerados do protótipo real
(`prototype/`), com o asset regenerado byte a byte a partir do OpenNeuro (ver `fonte-design/SYNC.md`).

| Fonte | O que é | Papel nesta crítica |
|---|---|---|
| `referencias/cf-globo-*.webp` | Globo "Region: Earth" da cloudflare.com, 11 capturas no celular | Referência de **comportamento**: globo oco, pins, callouts que aparecem com o giro |
| `referencias/coliseu-paleta.webp` | Gravura do Coliseu | Referência de **paleta**: fundo branco com retícula, traço cinza, índigo, botão #212121 |
| `referencias/mockup-usuario.webp` | Mockup do usuário (desktop e celular) | Referência de **composição**: card ao lado no desktop e abaixo no celular, paginador, chave de movimento |
| `atual/{home,mapas}-light-*.webp` | O site hoje (PR #39, RC-DS-CF laranja) | Ponto de partida |
| `mockups/*.webp` | Landing e Mapa no Nocturne claro com o cérebro oco | Proposta |

### Impressão geral

O cérebro atual é uma **nuvem de pontos chapada**: laranja, sem casca, sem verso visível e sem linhas. Ele lê como
mancha, não como volume. Os seletores ficam em posições fixas sobre a imagem e não acompanham o giro, e o card fica
fora do objeto.

O globo da Cloudflare funciona por quatro coisas que o cérebro atual não tem:
1. uma **casca oca** de linhas cinza finas, com o lado de trás aparecendo através da frente;
2. **campos pontilhados** alternados com vazios;
3. **pins presos à superfície**, que giram junto;
4. **callouts** que entram e saem conforme a face gira.

O protótipo do Claude Design (`Brain Home v2.html` + `brain-hollow.js`) resolve as quatro. Ele fatia a malha anatômica
real em contornos (13 latitudes + 9 meridianos), mascara os pontos com ruído e projeta os pins a cada quadro.

A maior oportunidade agora não é visual, e sim de **leitura e controle no celular**: o callout automático cobre o
centro do cérebro numa tela de 390 px (C-08).

### Comparativo lado a lado

| Aspecto | Globo da Cloudflare (referência) | Cérebro atual (site) | Protótipo + mockup (proposta) |
|---|---|---|---|
| Volume | Esfera oca: grade cinza, verso visível | Nuvem de pontos sem casca, o verso se confunde com a frente | Contornos da anatomia real; o verso cai para 14–18 % de opacidade |
| Pontos | Laranja só nos continentes, com oceano vazio | Pontos em toda a superfície, densos e uniformes | Campos com máscara de ruído; fundo dos sulcos e tronco ficam abertos |
| Paleta | Laranja e cinza sobre branco | Laranja #FF5E1F sobre branco | **Coliseu:** índigo #6E72F0/#5A5FE8, cinza de gravura #C4C5CE, retícula #DCDCE1 |
| Pins | Círculos com ícone, presos à superfície | Botões HTML em posição fixa (`--mx`/`--my`), sem giro | Âncora no vértice mais externo, projetada a cada quadro; esmaece no verso |
| Callouts | Caixa tracejada com cantos sólidos, entra e sai com o giro | Não existem; o card fica sempre fora | Contorno tracejado e cantos índigo; por orientação, com histerese e permanência de 6 s |
| Card de leitura | Não há (só callout) | Card fixo abaixo do cérebro, com Demanda, Dificuldade e Estratégia | Painel estável ao lado (≥ 1100 px) ou abaixo, lista → detalhe |
| Giro | Lento e contínuo | 0,12 rad/s (≈ 52 s por volta), sem chave visível de movimento | 0,03 rad/s (≈ 3,5 min por volta); "Pausar/Girar" e a chave "Movimento reduzido" visíveis |
| Toque | Rolagem preservada | `pan-y` presente, mas qualquer toque pausa o giro na hora | Limiar de 8 px; o deslize vertical rola a página sem pausar |

### Achados de usabilidade

| ID | Achado | Severidade | Recomendação / estado |
|---|---|---|---|
| C-01 | Sem volume: a nuvem chapada não lê como cérebro em 3D, e frente e verso se misturam | 🔴 Crítico | Adotar a representação oca do protótipo: contornos e pontos mascarados, verso a 14–18 % |
| C-02 | Os seletores não acompanham o giro: o pin "Planejamento" continua na frente mesmo com o lobo frontal virado | 🔴 Crítico | Âncoras do protótipo (`anchor(dir)`), projeção a cada quadro e pin desativado no verso (`facing < −0,05`) |
| C-03 | O giro não tem controle visível equivalente ao do mockup. O "Pausar" existe, mas a pessoa não acha a chave de movimento | 🟡 Moderado | Chave "Movimento reduzido" (`role="switch"`) persistida, e "Pausar/Girar" ao lado |
| C-04 | Todo toque pausa: o `pointerdown` do renderer atual já chama `onDrag` e captura o ponteiro. Rolar a página sobre o cérebro no celular (o `touch-action: pan-y` existe) pausa o giro sem querer, e não há limiar entre toque e arraste | 🟡 Moderado | Limiar de 8 px antes de virar arraste; deslize vertical abandona o gesto (protótipo) |
| C-05 | O conteúdo não aparece com o giro, como nos callouts do globo | 🟡 Moderado | Callouts por orientação: entram com `facing > 0,32`, saem `< 0,12`, permanência de 6 s; 2 vagas no desktop e 1 no celular |
| C-06 | Giro de 0,12 rad/s é rápido para um objeto de leitura | 🟢 Menor | 0,03 rad/s (protótipo); o callout precisa de tempo para ser lido antes de sair |
| C-07 | **Protótipo:** em palco estreito, o callout do pin selecionado cobria o próprio pin (o clamp lateral o empurrava para cima dele) | 🟡 Moderado | **Corrigido no porte** (`prototype/brain-stage.js`, `[BRAIN-NOCT]`): se cobrir o alvo de 44 px, o callout vai para cima ou para baixo do pin. Levar ao Claude Design |
| C-08 | **Protótipo:** a 390 px o callout automático (220 px) ocupa o centro do cérebro (`mockups/02-landing-callout-giro-390.webp`) | 🟡 Moderado | **Aberto.** Proposta: abaixo de 600 px, callout com no máximo 180 px e só o título (o resumo já está no painel logo abaixo). Decidir com a arte |
| C-09 | **Protótipo:** sem pôster oco; sem WebGL, o palco fica vazio com uma frase (`mockups/06-mapa-sem-webgl-*.webp`) | 🟡 Moderado | **Aberto** (pendência do HANDOFF do Claude Design). Gerar o pôster PNG/WebP da composição oca no ângulo `HOME` |
| C-10 | **Protótipo:** a tabela de hashes do `PROVENIENCIA.md` traz partículas `1da8e10d…` e atributos `ceb2f0e3…`, mas o `build-report.json` e a regeneração dão `c6822ba5…` e `6a64659f…` | 🟢 Menor | O GLB confere (`ce97da58…`). Corrigir a tabela do PROVENIENCIA no Claude Design |
| C-11 | GLB de 9,47 MB + 0,34 MB de partículas só para a Home | 🟡 Moderado | meshopt/Draco (≈ 2–3 MB) ou grade de 1,6 mm para a Home (recomendação do próprio protótipo). O contorno pode ser pré-calculado no build e entregue como `.bin` de segmentos (ver HANDOFF §Código) |

### Hierarquia visual

- **O que atrai o olhar primeiro:**
  - Landing: o h1 em dois tons ("Entenda" em cinza, "sua execução." em #212121, como "Build lasting" no Coliseu), depois
    o cérebro. Correto: a pergunta vem antes do objeto.
  - Mapa: o cérebro e o painel juntos. Correto.
- **Fluxo de leitura:** rótulo → h1 → lead → ação com contorno → cérebro (callouts) → painel → controles →
  Entenda / Estruture / Execute.
- **Ênfase:** o índigo aparece só em traço, pin, callout, rótulo e link. Não há área cheia de índigo, o que segue a regra
  "accent as a line, never a flood" do Nocturne. A única área cheia é o pin selecionado (36 px).

### Consistência e divergências entre as fontes

| Elemento | Nocturne | Coliseu / protótipo | Mockup do usuário | Prevalece | Por quê |
|---|---|---|---|---|---|
| Fundo e paleta | Escuro #161826, acento #9184D9 | Branco, índigo #6E72F0 | Branco, violeta | **Coliseu** | Decisão do usuário ("Coliseu manda") |
| Botão primário | Contorno em acento | Preto #212121 sólido (Coliseu); contorno índigo (protótipo) | Preto sólido "Começar agora" | **Contorno (Nocturne)** | O Nocturne manda na estrutura; o preto vira cor de texto. Revisar com a arte se a landing quiser um CTA sólido |
| Raio | 8 px | 12–24 px (tokens do protótipo); 2 px no callout | ~12 px no card | **8 px**; o callout fica com 2 px | Estrutura do Nocturne; o canto vivo do callout é a assinatura do globo |
| Tipo | Inter 500, corpo 15 px | Inter 700 no h1 | Grotesca negrito | **Inter 500**, corpo 16 px | Nocturne: "do not bolden headings past 500". O corpo de 16 px é o piso de leitura do gate HIG |
| Layout | À esquerda, assimétrico | Centralizado | Centralizado | **À esquerda** | Nocturne |
| Linhas | Regras esmaecem 48 px nas pontas | Linha cheia | — | **Esmaecem** | Nocturne |
| Alvos | `.btn` ≈ 29 px de altura | 44 px | — | **44 px** | accessibility-review; o `.btn` do Nocturne fica abaixo (ver A11Y) |
| Ícones | Phosphor | SVG próprios | Ícones de linha | **Phosphor na implementação** | Os mockups usam os SVG do protótipo até a troca |

### O que funciona bem

- **Anatomia com procedência:** malha FreeSurfer do OpenNeuro ds006128 (CC0), gerador determinístico, e o hash do GLB
  confere na regeneração.
- **Callouts com histerese e permanência:** não piscam quando a face fica na borda, e cada um fica pelo menos 6 s na tela.
- **Seleção manual trava o automático:** só o "Girar" retoma o giro, e fechar o painel não retoma.
- **O painel estável** leva o conteúdo para HTML legível e anunciado (`aria-live`). O callout é atalho visual.

### Recomendações prioritárias

1. **Aprovar o objeto (G2 do ACEITE)** com a paleta Coliseu: a malha #C4C5CE e os pontos #BFC2F8 → #5A5FE8.
2. **Resolver o C-08** (callout no celular) e o **C-09** (pôster oco) no Claude Design, antes da integração.
3. **Implementar no PR seguinte** (RESET-PLAN), com o contrato de motion e eventos do HANDOFF e os testes do
   `home-brain.spec` adaptados.
