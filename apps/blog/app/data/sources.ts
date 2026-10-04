// Fontes do RC-SRC-001 (LANC-001 RQ-042), geradas do arquivo do intake sem reescrita:
// docs/lancamento/LANC-001/intake/DOCS-002/RC_EDITORIAL_PLAIN_TXT_v1.0.0/02_REFERENCIAS/01_FONTES_WEB.txt
// `id` é o nó EVIDENCE do grafo canônico (app/data/graph/rc-graph.json). Não editar à mão.
export type Source = { id: string; topic: string; label: string; url: string };

export const SOURCES: Source[] = [
  {
    "id": "EVD-AEVO-GP",
    "topic": "ARQUITETURA EDITORIAL",
    "label": "AEVO — Gestão de Projetos",
    "url": "https://blog.aevo.com.br/gestao-de-projetos/"
  },
  {
    "id": "EVD-CLYM-COGNITIVE",
    "topic": "REFERÊNCIA DE ESTRUTURA EDITORIAL ANTERIOR",
    "label": "Clym — Web Accessibility for Cognitive Disabilities",
    "url": "https://www.clym.io/blog/web-accessibility-for-cognitive-disabilities"
  },
  {
    "id": "EVD-PMI-PM",
    "topic": "GESTÃO DE PROJETOS",
    "label": "Project Management Institute — What is Project Management?",
    "url": "https://www.pmi.org/about/what-is-project-management"
  },
  {
    "id": "EVD-ISO-31000",
    "topic": "GESTÃO DE RISCOS",
    "label": "ISO 31000:2018 — Risk management — Guidelines",
    "url": "https://www.iso.org/standard/65694.html"
  },
  {
    "id": "EVD-ISO-10075-2",
    "topic": "CARGA MENTAL E DESIGN DO TRABALHO",
    "label": "ISO 10075-2:2024",
    "url": "https://www.iso.org/standard/76686.html"
  },
  {
    "id": "EVD-IBM-BPM",
    "topic": "BPM",
    "label": "IBM — Business Process Management",
    "url": "https://www.ibm.com/think/topics/business-process-management"
  },
  {
    "id": "EVD-OMG-BPMN",
    "topic": "BPMN",
    "label": "Object Management Group — BPMN",
    "url": "https://www.omg.org/bpmn/"
  },
  {
    "id": "EVD-W3C-COGA",
    "topic": "ACESSIBILIDADE COGNITIVA / TAREFAS / INTERRUPÇÕES",
    "label": "W3C — Cognitive Accessibility Guidance",
    "url": "https://www.w3.org/WAI/WCAG2/supplemental/"
  },
  {
    "id": "EVD-AWS-RUNBOOKS",
    "topic": "RUNBOOKS",
    "label": "AWS Systems Manager Automation",
    "url": "https://docs.aws.amazon.com/systems-manager/latest/userguide/automation-documents.html"
  },
  {
    "id": "EVD-ALTMANN-TRAFTON",
    "topic": "INTERRUPÇÕES E RETOMADA",
    "label": "Altmann & Trafton — Task interruption / resumption research",
    "url": "https://escholarship.org/uc/item/18b4r661"
  },
  {
    "id": "EVD-GILBERT-OFFLOADING",
    "topic": "EXTERNALIZAÇÃO COGNITIVA / LEMBRETES",
    "label": "Gilbert — Strategic use of reminders / cognitive offloading",
    "url": "https://journals.sagepub.com/doi/10.1080/17470218.2014.972963"
  }
];

/** Nota de governança do RC-SRC-001 (RQ-043): conceitos próprios do projeto não são normas externas. */
export const GOVERNANCE_NOTE: string[] = [
  "As fontes externas sustentam conceitos como gestão de riscos, carga mental, BPM/BPMN, acessibilidade cognitiva, gerenciamento de projetos, runbooks, interrupções e externalização cognitiva.",
  "\"Processo neuroadaptativo\" e a cadeia específica \"Risco Cognitivo → Compensação → Solução\" permanecem conceitos metodológicos próprios do projeto e não devem ser apresentados como normas externas estabelecidas."
];
