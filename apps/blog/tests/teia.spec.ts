import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { PROBLEMS } from "../app/data/article-meta";
import { MOCK_ITEMS } from "../app/features/store/data/mock-items";
import { danglingRefs } from "../app/lib/graph/adapters/correlation-refs";
import { adaptQuickFramework, parseQuickFramework } from "../app/lib/graph/adapters/quick-framework";
import { problemsReached } from "../app/lib/graph/discovery";
import { REGISTRY_TYPES, buildRegistries } from "../app/lib/graph/registries";
import { RC_GRAPH_FOR_TESTS as graph } from "./graph-data";

// LANC-001 PR-L (RQ-120…122): adapters da Teia Única (ADR-M04). Todo correlation_ref aponta para nó existente; nada
// é criado nem inventado: o que não tem nó fica pendente, e correspondência de texto é sempre E_INFERRED.
const read = (p: string) => readFileSync(join(process.cwd(), p), "utf8");
// correlations.ts usa o alias "@/": lido como texto para não depender do bundler no teste.
const TOOLS_SRC = read("app/features/store/data/correlations.ts");

test.describe("registries canônicos (RQ-122)", () => {
  const reg = buildRegistries(graph, PROBLEMS);

  test("os 8 registries do N1 existem", () => {
    expect(Object.keys(reg).sort()).toEqual(Object.keys(REGISTRY_TYPES).sort());
  });

  test("cada entrada é um nó do grafo do tipo do registry, sem repetição", () => {
    const byId = new Map(graph.nodes.map((n) => [n.id, n]));
    for (const [name, r] of Object.entries(reg)) {
      const ids = r.entries.map((e) => e.id);
      expect(new Set(ids).size, name).toBe(ids.length);
      for (const e of r.entries) {
        expect(byId.has(e.id), `${name}: ${e.id}`).toBe(true);
        if (name !== "problems") expect(r.node_types, `${name}: ${e.id}`).toContain(byId.get(e.id)!.type);
      }
    }
  });

  test("problemas = os 6 do índice editorial, cada um no seu nó", () => {
    expect(reg.problems.entries.map((e) => e.id)).toEqual(PROBLEMS.map((p) => p.node));
  });

  test("registry sem nó no grafo fica vazio e pendente com o OWNER, nunca preenchido à mão", () => {
    for (const name of ["operational_functions", "capabilities", "app_features"] as const) {
      expect(reg[name].entries, name).toEqual([]);
      expect(reg[name].pending, name).toContain("OWNER");
    }
    for (const name of ["cognitive_capacities", "factors", "compensations", "controls"] as const) expect(reg[name].entries.length, name).toBeGreaterThan(0);
  });
});

test.describe("adapter do Quick Framework (RQ-120)", () => {
  const md = read("tests/fixtures/quick-framework-exemplo.md");
  const r = adaptQuickFramework(md, graph);

  test("lê as 12 seções sem alterá-las", () => {
    expect(r.errors).toEqual([]);
    expect(r.sections.map((s) => s.n)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
    for (const s of r.sections) expect(md).toContain(s.body);
  });

  test("registro fora do template é recusado", () => {
    const broken = md.replace(/## 12\. Infográfico 16:9[\s\S]*$/, "");
    expect(parseQuickFramework(broken).errors.join(" ")).toContain("12 seções");
  });

  test("nomes de nós no texto viram referências E_INFERRED; fonte pela URL vira D_INTERNAL com o trecho", () => {
    const ids = (f: keyof typeof r.correlation_refs) => (r.correlation_refs[f] ?? []).map((x) => x.ref);
    expect(ids("factor_refs")).toContain("FRC-INTERRUPCOES");
    expect(ids("problem_refs")).toEqual(expect.arrayContaining(["EVT-PERDA-CONTEXTO", "EVT-ETAPA-ESQUECIDA"]));
    expect(ids("compensation_refs")).toContain("CMP-EXTERNALIZACAO");
    expect(ids("control_refs")).toEqual(expect.arrayContaining(["CTL-CHECKPOINT", "CTL-CHECKLIST"]));
    for (const f of ["factor_refs", "problem_refs", "compensation_refs", "control_refs"] as const) {
      for (const x of r.correlation_refs[f]!) expect(x.provenance_class, x.ref).toBe("E_INFERRED");
    }
    expect(r.correlation_refs.evidence_refs).toEqual([
      {
        ref: "EVD-ALTMANN-TRAFTON",
        provenance_class: "D_INTERNAL",
        via: "11. Fontes e aprofundamento",
        quote: "Task interruption and resumption — Altmann & Trafton — https://escholarship.org/uc/item/18b4r661",
      },
    ]);
  });

  test("solution_candidates só com soluções que já existem no grafo; todo ref aponta para nó", () => {
    expect(r.solution_candidates).toContainEqual({ solution_id: "SOL-LEMBRETE-CONTEXTUAL", via_compensation: "CMP-EXTERNALIZACAO" });
    expect(danglingRefs(graph, r.correlation_refs, r.solution_candidates)).toEqual([]);
  });
});

test.describe("Ferramentas na Teia (RQ-121)", () => {
  test("os itens de exemplo do catálogo não recebem correlação inventada", () => {
    for (const item of MOCK_ITEMS) expect("correlation_refs" in item, item.id).toBe(false);
  });

  test("a referência do Prisma cita o texto da própria ferramenta e aponta para nó existente", () => {
    expect(TOOLS_SRC).toContain('ref: "CMP-EXTERNALIZACAO"');
    const quote = /quote: "([^"]+)"/.exec(TOOLS_SRC)![1];
    expect(read("app/features/prisma/PrismaIntro.tsx")).toContain(quote);
    expect(danglingRefs(graph, { compensation_refs: [{ ref: "CMP-EXTERNALIZACAO", provenance_class: "D_INTERNAL", via: "x" }] })).toEqual([]);
  });

  test("o problema sai do grafo e herda a inferência das relações", () => {
    const reached = problemsReached(graph, { compensation_refs: [{ ref: "CMP-EXTERNALIZACAO", provenance_class: "D_INTERNAL", via: "x" }] }, PROBLEMS.map((p) => p.node));
    expect(reached).toEqual([{ node: "COG-MEMORIA", inferred: true }]);
  });

  test("filtro em /ferramentas/ por problema e compensação", async ({ page }) => {
    await page.goto("/ferramentas/");
    const section = page.locator("[data-tool-discovery]");
    await section.locator("[data-discovery-problems]").getByRole("button", { name: "Memória" }).click();
    await expect(section.locator('[data-tool="prisma"]')).toBeVisible();
    await expect(section.locator('[data-tool="prisma"]')).toContainText("Memória (inferido)");
    expect(new URL(page.url()).searchParams.get("problema")).toBe("memoria");
    await section.locator("[data-discovery-problems]").getByRole("button", { name: "Decisão" }).click();
    await expect(section.locator("[data-discovery-empty]")).toBeVisible();
    await section.locator("[data-discovery-problems]").getByRole("button", { name: "Decisão" }).click();
    await section.locator("[data-discovery-compensations]").getByRole("button", { name: "Externalização" }).click();
    await expect(section.locator('[data-tool="prisma"]')).toBeVisible();
    await page.reload();
    await expect(section.locator("[data-discovery-compensations]").getByRole("button", { name: "Externalização" })).toHaveAttribute("aria-pressed", "true");
  });
});
