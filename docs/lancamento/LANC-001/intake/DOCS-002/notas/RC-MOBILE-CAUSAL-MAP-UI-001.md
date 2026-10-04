document:

  id: RC-MOBILE-CAUSAL-MAP-UI-001

  version: 1.0.0

  area: UX_UI

  product: Risco Cognitivo

  artifact_type: mobile_first_ui_spec

  source:

    type: visual_reference

    file: 6949DF5D-88EB-4FBA-BBF2-D7DDEF32A92A.PNG

  workflow:

    - Story

    - Explore

    - Detail

    - Personalize

  status: PREPARED

  automation_level: A1

  owner: A_DEFINIR

  

objective:

  primary: >

    Traduzir a referência visual para uma especificação estruturada

    reutilizável na implementação de uma experiência mobile-first

    para exploração de relações causais de risco cognitivo.

  interaction_model:

    base: causal_graph

    presentation: focus_context

    disclosure: progressive

    primary_action: tap

    secondary_actions:

      - pan

      - zoom

      - filter

      - recenter

      - bottom_sheet

  experience_model:

    - Story

    - Explore

    - Personalize

  

information_architecture:

  routes:

    - id: ROUTE-HOME

      path: "/"

      screen: SCR-01

      label: Início

  

    - id: ROUTE-EXPLORE

      path: "/explorar"

      screen: SCR-02

      label: Explorar

  

    - id: ROUTE-FACTOR

      path: "/explorar/:factor_id"

      screen: SCR-03

      label: Detalhe do fator

  

    - id: ROUTE-PERSONALIZE

      path: "/personalizar"

      screen: SCR-04

      label: Personalizar

  

design_system:

  

  visual_direction:

    style:

      - editorial

      - data_storytelling

      - minimal

      - scientific

      - mobile_first

    principles:

      - white_canvas

      - restrained_blue_palette

      - high_whitespace

      - thin_borders

      - low_visual_noise

      - data_as_visual_language

      - progressive_disclosure

  

  colors:

    canvas:

      value: "#FFFFFF"

      role: primary_background

  

    surface:

      value: "#F7F8FA"

      role: secondary_background

  

    surface_blue:

      value: "#EEF3FC"

      role: selected_or_information_surface

  

    text_primary:

      value: "#15213A"

      role: primary_text

  

    text_secondary:

      value: "#667085"

      role: supporting_text

  

    border:

      value: "#E1E5EC"

      role: component_boundary

  

    accent:

      value: "#3659B7"

      role:

        - action

        - selected

        - active_navigation

        - causal_emphasis

  

    accent_light:

      value: "#AFC4EE"

      role:

        - data_visualization

        - secondary_node

  

    accent_muted:

      value: "#D8E2F5"

      role:

        - graph_node_background

        - chart_background

  

  typography:

    family:

      category: sans_serif

      exact_font: A_DEFINIR

  

    hierarchy:

      display:

        weight: 400

        size_mobile: 32

        line_height: 1.1

  

      h1:

        weight: 500

        size_mobile: 28

        line_height: 1.15

  

      h2:

        weight: 500

        size_mobile: 20

  

      body:

        weight: 400

        size_mobile: 16

        line_height: 1.45

  

      body_small:

        weight: 400

        size_mobile: 14

  

      caption:

        weight: 400

        size_mobile: 12

  

      label:

        weight: 500

        size_mobile: 12

  

  spacing:

    base_unit: 4

    page_horizontal: 20

    section_gap: 24

    component_gap: 12

    compact_gap: 8

  

  radius:

    card: 12

    button: 10

    chip: 10

    node: 999

    bottom_sheet_top: 20

  

  border:

    width: 1

    style: solid

  

  shadows:

    default: subtle

    usage:

      - bottom_sheet

      - elevated_graph_node

    avoid:

      - heavy_card_shadows

      - decorative_glows

  

mobile_first:

  

  viewport:

    minimum_width: 320

    reference_width: 390

  

  touch:

    minimum_target: 44

  

  interaction_rules:

    - id: INT-001

      rule: >

        Toda função essencial deve estar disponível por toque.

        Hover não pode ser requisito funcional.

  

    - id: INT-002

      rule: >

        O mapa deve iniciar com foco local e não apresentar

        o grafo completo na primeira visualização.

  

    - id: INT-003

      rule: >

        Selecionar um nó deve persistir seu estado e apresentar

        detalhes contextuais.

  

    - id: INT-004

      rule: >

        Gestos de pan e zoom complementam a navegação,

        mas não substituem ações explícitas.

  

    - id: INT-005

      rule: >

        Informações detalhadas devem utilizar bottom sheet

        ou rota dedicada, evitando sobrecarregar o canvas.

  

navigation:

  

  bottom_navigation:

    visible_on:

      - SCR-01

      - SCR-02

  

    items:

      - id: NAV-HOME

        label: Início

        icon: home

        route: ROUTE-HOME

  

      - id: NAV-EXPLORE

        label: Explorar

        icon: graph

        route: ROUTE-EXPLORE

  

      - id: NAV-LEARN

        label: Aprender

        icon: book

        route: A_DEFINIR

  

      - id: NAV-PROFILE

        label: Perfil

        icon: user

        route: A_DEFINIR

  

screens:

  

  - id: SCR-01

    name: Home / Story

    route: ROUTE-HOME

  

    purpose: >

      Introduzir o conceito de risco cognitivo e fornecer

      uma entrada simples para exploração, evidências e soluções.

  

    layout:

      type: vertical_scroll

      sections:

  

        - id: HERO

          type: editorial_hero

          content:

            title:

              text: "Entenda o que influencia seu risco cognitivo"

              emphasis:

                text: "risco cognitivo"

                token: accent

  

            description: >

              Explore como fatores do seu dia a dia se conectam

              e descubra caminhos baseados em evidências.

  

        - id: OVERVIEW

          type: insight_card

          eyebrow: "VISÃO GERAL"

  

          content:

            text: >

              Seu risco é o resultado de múltiplos fatores

              em interação.

  

            visualization:

              type: mini_network_graph

  

        - id: PRIMARY-ACTIONS

          type: card_grid

          columns_mobile: 3

  

          cards:

            - id: CARD-EXPLORE

              title: Explorar

              icon: graph

              description: >

                Veja como os fatores se conectam.

              action:

                route: ROUTE-EXPLORE

  

            - id: CARD-EVIDENCE

              title: Evidências

              icon: bar_chart

              description: >

                Dados de estudos e fontes confiáveis.

  

            - id: CARD-SOLUTIONS

              title: Soluções

              icon: lightbulb

              description: >

                Estratégias práticas e compensações.

  

        - id: DATA-STORY

          type: horizontal_bar_chart

  

          title: >

            Fatores que mais se associam ao risco cognitivo

  

          disclaimer: >

            Valores apresentados no mockup são ilustrativos.

            Dados finais devem possuir fonte verificável.

  

  - id: SCR-02

    name: Explorar / Mapa Causal

    route: ROUTE-EXPLORE

  

    purpose: >

      Permitir que o usuário explore relações causais

      progressivamente a partir de um nó de foco.

  

    header:

      title: Explorar

      actions:

        - search

  

    tabs:

      - id: TAB-MAP

        label: Mapa causal

        default: true

  

      - id: TAB-LIST

        label: Lista

  

      - id: TAB-CATEGORIES

        label: Categorias

  

    introduction:

      title: Mapa causal

      description: >

        Veja como os fatores se conectam e influenciam

        o risco cognitivo.

  

    filters:

      type: horizontal_chips

  

      options:

        - id: FILTER-ALL

          label: Todos

          selected: true

  

        - id: FILTER-LIFESTYLE

          label: Estilo de vida

  

        - id: FILTER-HEALTH

          label: Saúde

  

        - id: FILTER-ENVIRONMENT

          label: Ambiente

  

    graph:

      id: GRAPH-RC-001

      type: directed_causal_graph

      presentation: radial_focus_context

  

      central_node:

        id: NODE-RISK

        label: Risco cognitivo

        icon: brain

        role: focal

  

      initial_visible_nodes:

        max: 7

  

      nodes:

        - id: NODE-SLEEP

          label: Sono

          icon: moon

          category: lifestyle

  

        - id: NODE-STRESS

          label: Estresse

          icon: lightning

          category: psychological

  

        - id: NODE-NUTRITION

          label: Alimentação

          icon: utensils

          category: lifestyle

  

        - id: NODE-CARDIO

          label: Saúde cardiovascular

          icon: heart

          category: health

  

        - id: NODE-SOCIAL

          label: Conexões sociais

          icon: users

          category: social

  

        - id: NODE-PHYSICAL

          label: Atividade física

          icon: activity

          category: lifestyle

  

        - id: NODE-AGE

          label: Idade

          icon: calendar

          category: contextual

  

      edge_types:

  

        - id: EDGE-TYPE-INCREASE

          label: Aumenta o risco

          rendering:

            line: solid

            arrow: true

            emphasis: strong

  

        - id: EDGE-TYPE-REDUCE

          label: Reduz o risco

          rendering:

            line: solid

            arrow: true

            emphasis: medium

  

        - id: EDGE-TYPE-INDIRECT

          label: Relação indireta

          rendering:

            line: dashed

            arrow: true

            emphasis: low

  

      behaviors:

  

        on_node_tap:

          - select_node

          - highlight_connected_edges

          - dim_unrelated_nodes

          - recenter_graph

          - expose_neighbors

          - enable_detail_action

  

        on_background_tap:

          - clear_selection

  

        on_pinch:

          - zoom

  

        on_drag:

          - pan

  

      helper:

        type: info_bar

        text: >

          Toque em um fator para ver detalhes,

          evidências e estratégias.

  

  - id: SCR-03

    name: Detalhe do fator

    route: ROUTE-FACTOR

  

    purpose: >

      Explicar o fator selecionado por meio de contexto,

      relações, dados, causas, impactos, soluções e evidências.

  

    example_entity:

      id: NODE-SLEEP

      category: Estilo de vida

      title: Qualidade do sono

      icon: moon

  

    header:

      actions:

        - back

        - bookmark

        - overflow_menu

  

    summary:

      title: Qualidade do sono

      description: >

        Explicação curta da relação do fator com

        memória, atenção e risco cognitivo.

  

    evidence_card:

      id: EVIDENCE-SUMMARY

  

      title: Associação com o risco cognitivo

  

      metric:

        value: "+42%"

        status: illustrative

        validation_required: true

  

      visualization:

        type: column_chart

        x_axis:

          type: ordinal

          examples:

            - "<5h"

            - "5–6h"

            - "6–7h"

            - "7–8h"

            - ">8h"

  

        y_axis:

          label: Risco relativo

  

      evidence:

        source: A_DEFINIR

        evidence_id: A_DEFINIR

  

    bottom_sheet:

      id: FACTOR-DETAIL-SHEET

  

      snap_points:

        - collapsed

        - medium

        - expanded

  

      tabs:

  

        - id: FACTOR-CAUSES

          label: Causas

          default: true

  

        - id: FACTOR-IMPACTS

          label: Impactos

  

        - id: FACTOR-SOLUTIONS

          label: Soluções

  

        - id: FACTOR-EVIDENCE

          label: Evidências

  

      causes:

        title: Principais causas

  

        items:

          - id: CAUSE-STRESS

            label: Estresse crônico

            icon: lightning

  

          - id: CAUSE-SCREEN

            label: Uso de telas à noite

            icon: smartphone

  

          - id: CAUSE-CAFFEINE

            label: Consumo de cafeína

            icon: cup

  

  - id: SCR-04

    name: Personalizar

    route: ROUTE-PERSONALIZE

  

    purpose: >

      Ajustar a ordem, visibilidade e relevância dos elementos

      apresentados no mapa sem alterar os fatos científicos.

  

    progress:

      current_step: 1

      total_steps: 3

  

    introduction:

      title: Adapte a experiência ao seu perfil

      description: >

        Selecione fatores relevantes para personalizar

        a exploração e a ordem das recomendações.

  

    focus_selection:

      type: selectable_card_grid

      multiple: true

  

      options:

        - id: FOCUS-MEMORY

          label: Memória

          icon: brain

  

        - id: FOCUS-ATTENTION

          label: Atenção

          icon: target

  

        - id: FOCUS-MOOD

          label: Humor

          icon: smile

  

        - id: FOCUS-PRODUCTIVITY

          label: Produtividade

          icon: chart

  

        - id: FOCUS-AGING

          label: Envelhecimento saudável

          icon: heart

  

        - id: FOCUS-OTHER

          label: Outro

          icon: more

  

    interests:

      type: selectable_chips

      multiple: true

  

      options:

        - NODE-SLEEP

        - NODE-PHYSICAL

        - NODE-NUTRITION

        - NODE-STRESS

        - NODE-SOCIAL

        - NODE-CARDIO

  

    preferences:

  

      - id: PREF-EVIDENCE

        type: toggle

        label: Mostrar evidências

        description: >

          Exibir dados e referências no mapa

          e nas recomendações.

        default: true

  

    primary_action:

      label: Continuar

      action: personalization_next_step

  

causal_data_model:

  

  node:

    required:

      - id

      - label

      - type

      - category

  

    schema:

      id: string

      label: string

  

      type:

        enum:

          - context

          - demand

          - capacity

          - vulnerability

          - risk

          - event

          - impact

          - compensation

          - evidence

  

      category: string

      description: string

      icon: string

  

      evidence_ids:

        type: array

  

      metadata:

        type: object

  

  edge:

    required:

      - id

      - source

      - target

      - relation

  

    schema:

      id: string

      source: node_id

      target: node_id

  

      relation:

        enum:

          - increases

          - decreases

          - contributes_to

          - moderates

          - mediates

          - associated_with

  

      direction: directed

  

      polarity:

        enum:

          - positive

          - negative

          - neutral

          - unknown

  

      evidence_level:

        enum:

          - strong

          - moderate

          - weak

          - hypothesis

          - unknown

  

      evidence_ids:

        type: array

  

graph_progressive_disclosure:

  

  level_0:

    content:

      - NODE-RISK

  

  level_1:

    content:

      - direct_neighbors

  

  level_2:

    trigger: node_selection

    content:

      - selected_node

      - first_degree_causes

      - first_degree_impacts

  

  level_3:

    trigger: explore_more

    content:

      - second_degree_relations

      - compensations

      - evidence

  

  rule:

    initial_graph_density: low

    maximum_recommended_visible_nodes_mobile: 8

    hide_unrelated_nodes_on_focus: true

  

story_explore_personalize:

  

  story:

    screen: SCR-01

    objective: >

      Ensinar o modelo e fornecer contexto antes da

      exposição ao grafo.

  

  explore:

    screen: SCR-02

    objective: >

      Navegar pelas relações causais progressivamente.

  

  detail:

    screen: SCR-03

    objective: >

      Transformar cada nó em uma unidade explicativa

      com evidência rastreável.

  

  personalize:

    screen: SCR-04

    objective: >

      Priorizar conteúdo e caminhos de exploração

      conforme os interesses selecionados.

  

accessibility:

  

  color:

    rule: >

      Cor não pode ser o único indicador de tipo,

      estado ou causalidade.

  

  graph:

    requirements:

      - node_label_always_available

      - edge_semantics_available_as_text

      - keyboard_navigation_desktop

      - alternative_list_view

      - selected_state_programmatically_exposed

  

  touch:

    minimum_target_px: 44

  

  text:

    minimum_body_px: 16

  

  reduced_motion:

    supported: true

  

validation:

  

  visual_reference:

    status: VERIFIED_FROM_IMAGE

  

  implementation:

    status: NOT_STARTED

  

  scientific_content:

    status: REQUIRES_VALIDATION

  

  quantitative_values:

    status: MOCKUP_ONLY

  

  acceptance_criteria:

  

    - id: AC-001

      condition: >

        Interface funciona em viewport de 320 px sem

        rolagem horizontal da página.

  

    - id: AC-002

      condition: >

        Usuário consegue abrir um fator e retornar ao mapa

        usando somente tap.

  

    - id: AC-003

      condition: >

        Estado selecionado permanece evidente sem depender

        de hover.

  

    - id: AC-004

      condition: >

        Tela inicial do mapa apresenta no máximo oito nós.

  

    - id: AC-005

      condition: >

        Todo valor quantitativo publicado possui evidence_id

        e fonte verificável.

  

    - id: AC-006

      condition: >

        Existe alternativa em lista para navegar pelo conteúdo

        representado no grafo.

  

handoff:

  

  recommended_frontend:

    framework: React

    graph_layer: React Flow

    graph_analysis: Cytoscape.js

    layout_engine:

      primary: Dagre

      optional: ELK

  

  persistence:

    recommended: Supabase_Postgres

  

  implementation_priority:

    - SCR-02

    - SCR-03

    - causal_data_model

    - progressive_disclosure

    - SCR-01

    - SCR-04

  

  next_artifacts:

    - RC-MAP-PRD-001

    - RC-MAP-FRD-001

    - RC-MAP-SPEC-001

    - RC-MAP-DATA-SCHEMA-001

    - RC-MAP-INTERACTION-SPEC-001

    - RC-MAP-AC-001

A parte mais importante para a implementação é manter separados três níveis: screens define a interface, causal_data_model define o conhecimento e graph_progressive_disclosure determina quanto desse conhecimento aparece no celular em cada momento. Assim, o mapa pode crescer para centenas de relações sem transformar a experiência mobile em um grafo ilegível.