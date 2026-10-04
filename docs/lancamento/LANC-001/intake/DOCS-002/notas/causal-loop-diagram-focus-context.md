Sim. Para mobile first, eu mudaria a recomendação para um modelo mais específico:



O CLD é um modelo público e estabelecido em Systems Thinking/System Dynamics: variáveis são conectadas por relações causais direcionadas, normalmente com polaridade positiva/negativa e ciclos de feedback. Ele continua sendo usado em trabalhos atuais de System Dynamics para representar sistemas complexos e identificar pontos de intervenção. 

A referência de experiência que mais combina com o que você descreve é o Kumu. Ele trabalha justamente com system maps e causal loop diagrams e, mais importante, usa um padrão de “focus”: começar por um elemento e revelar o mapa progressivamente, em vez de despejar a rede inteira na tela. 

Eu estruturaria o seu mobile assim:

┌──────────────────────────────┐

│ ← Risco Cognitivo       ⋯    │

├──────────────────────────────┤

│                              │

│          SOBRECARGA          │

│              ●               │

│         ↙    ↓    ↘          │

│       ●      ●      ●        │

│  Atenção  Memória  Decisão   │

│                              │

│      Mostrar mais causas     │

│                              │

├──────────────────────────────┤

│ Explorar │ Impactos │ Soluções│

└──────────────────────────────┘

Ao tocar em Memória:

ANTES

        Sobrecarga

             ↓

           Memória

  

  

DEPOIS

  

       Interrupção

            ↓

       Sobrecarga

            ↓

   ┌─── Memória ───┐

   ↓                ↓

Perda de        Retrabalho

contexto

Ou seja: o nó tocado vira o centro. Esse padrão resolve boa parte do problema de grafos no celular.

Na prática, eu usaria cinco regras.

1. Nunca mostrar o grafo inteiro inicialmente. Começar com 1 nó central e aproximadamente 3–6 relações próximas.
2. Tap = navegar. Nada importante pode depender de hover, porque hover não existe de forma confiável no mobile.
3. Pinch/drag são secundários. O usuário deve conseguir compreender o mapa apenas tocando nos nós e usando voltar/avançar.
4. Detalhes em bottom sheet. Ao selecionar um nó, abre uma folha inferior:

                ● SOBRECARGA

               ↙    ↓    ↘

              ●     ●     ●

  

  

┌──────────────────────────────┐

│ ─────────                    │

│ SOBRECARGA                   │

│                              │

│ Demanda cognitiva acima da   │

│ capacidade disponível...     │

│                              │

│ 4 causas                     │

│ 3 impactos                   │

│ 5 compensações               │

│                              │

│ [ Explorar relações ]        │

└──────────────────────────────┘

Esse padrão também está alinhado às interfaces móveis convencionais. A Apple, por exemplo, trata sheets como uma forma de apresentar uma tarefa ou informação relacionada ao contexto atual sem necessariamente retirar o usuário da visualização principal. 

5. Progressive disclosure. O mapa cresce conforme a pessoa demonstra interesse.

Eu evitaria no mobile:

●──●────●──●────●

│ ╲│╲  ╱│╲ │╲  ╱

●──●─●──●──●─●──●

╲╱│╲│ ╱╲│╱ │╲╱│

●─●──●──●─●──●──●

Mesmo sendo tecnicamente um grafo excelente, isso rapidamente vira uma visualização para especialistas, não para público geral.

Há ainda uma segunda referência pública muito interessante: LOOPY, de Nicky Case. Ele transforma relações causais em uma “explorable explanation”: a pessoa manipula o sistema e observa como uma mudança se propaga. O projeto é aberto e foi criado justamente para ajudar pessoas a entender sistemas por interação, em vez de apenas ler diagramas. 

Isso sugere uma evolução muito boa para o seu mapa.

Primeiro nível:

EXPLORE

  

Interrupção

     ↓

Sobrecarga

     ↓

Perda de contexto

Depois:

SIMULE

  

[ diminuir interrupções ]

  

        ↓

  

Interrupções  ─40%

      ↓

Sobrecarga    ─25%

      ↓

Perda contexto

Não significa afirmar matematicamente que existe uma redução de 40% ou 25%; esses números só poderiam existir quando sustentados pelo seu modelo/dados. A ideia é o padrão de interação “o que acontece se…”.

Para o seu produto, portanto, eu separaria claramente modelo científico de modelo de interface:

|   |   |
|---|---|
|Camada|Escolha|
|Modelo conceitual|Causal Loop Diagram|
|Estrutura de dados|Directed causal graph|
|UX|Focus + Context|
|Navegação|Progressive disclosure|
|Mobile|Tap → recenter → expand|
|Detalhes|Bottom sheet|
|Orientação|Breadcrumb / voltar|
|Explicação|Guided story|
|Simulação futura|padrão tipo LOOPY|
|Referência pública|Kumu + LOOPY|

A Home do mapa poderia inclusive ser extremamente simples:

       O que torna uma tarefa

       cognitivamente difícil?

  

               ↓

  

          [ EXPLORAR ]

  

  

  

          ┌─────────┐

          │ ATENÇÃO │

          └────┬────┘

        ↙      ↓      ↘

     Memória  Tempo  Contexto

E, conforme a pessoa toca:

RISCO COGNITIVO

      ↓

ATENÇÃO

      ↓

INTERRUPÇÕES

      ↓

PERDA DE CONTEXTO

      ↓

RETRABALHO

      ↓

COMPENSAÇÕES

Isso fica muito mais próximo de Google Maps/Apple Maps em comportamento mental: existe um espaço maior que a tela, mas o usuário trabalha sempre com um foco local, seleciona algo e recebe detalhes contextuais. A Apple inclusive recomenda que mapas sejam interativos e mantenham comportamentos familiares como zoom e pan. 

Minha escolha, portanto, seria:

CLD interativo estilo Kumu, mas com navegação mobile inspirada em Maps: Focus → Tap → Recenter → Expand → Bottom Sheet.

E não um force-directed graph convencional como interface principal.

Isso casa particularmente bem com a arquitetura Story → Explore → Personalize que você já definiu para o Mapa de Risco Cognitivo: Story ensina o sistema; Explore usa o CLD progressivo; Personalize recalcula quais nós e caminhos devem aparecer primeiro.