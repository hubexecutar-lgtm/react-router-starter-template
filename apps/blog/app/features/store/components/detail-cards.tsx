import type { ReactNode } from "react";

import { ArrowDown, ChevronDown } from "lucide-react";

import type { StoreItem } from "../types/store";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";


/** Long text stays inside a bounded, keyboard-reachable scroll area instead of growing the card. */
export function BoundedText({ label, children }: { label: string; children: ReactNode }) {
  return (
    <ScrollArea
      className="[&_[data-slot=scroll-area-viewport]]:max-h-48"
      viewportProps={{ tabIndex: 0, role: "region", "aria-label": label }}
    >
      <div className="pr-3 text-sm leading-relaxed">{children}</div>
    </ScrollArea>
  );
}

function Panel({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section aria-labelledby={id}>
      <h2 id={id} className="text-muted-foreground mb-2 text-sm font-medium tracking-wide uppercase">
        {title}
      </h2>
      <Card className="gap-0 py-0">
        <CardContent className="p-4">{children}</CardContent>
      </Card>
    </section>
  );
}

export function ProblemCard({ item }: { item: StoreItem }) {
  return (
    <Panel id="problema" title="Problema">
      <BoundedText label="Texto do problema">{item.problem}</BoundedText>
    </Panel>
  );
}

export function ProcessCard({ item }: { item: StoreItem }) {
  return (
    <Panel id="processo" title="Processo">
      <ol className="space-y-2" data-testid="process-steps">
        {item.process.map((step, i) => (
          <li key={step.index}>
            <div className="flex items-center gap-3">
              <span className="bg-muted flex size-7 shrink-0 items-center justify-center rounded-full text-sm font-medium">
                {step.index}
              </span>
              <span className="text-sm font-medium">{step.label}</span>
            </div>
            {i < item.process.length - 1 && (
              <ArrowDown className="text-muted-foreground mt-2 ml-1.5 size-4" aria-hidden="true" />
            )}
          </li>
        ))}
      </ol>
    </Panel>
  );
}

const PDCA: { key: keyof StoreItem["progress"]; label: string }[] = [
  { key: "plan", label: "Plan" },
  { key: "do", label: "Do" },
  { key: "check", label: "Check" },
  { key: "act", label: "Act" },
];

export function ProgressCard({ item }: { item: StoreItem }) {
  return (
    <Panel id="progresso" title="Progresso">
      <dl className="divide-border divide-y">
        {PDCA.map(({ key, label }) => (
          <div key={key} className="grid grid-cols-[4.5rem_1fr] gap-3 py-2 first:pt-0 last:pb-0 text-sm">
            <dt className="font-medium">{label}</dt>
            <dd className="text-muted-foreground">{item.progress[key]}</dd>
          </div>
        ))}
      </dl>
    </Panel>
  );
}

/** Vertical flowchart derived from the SAME three process steps (input → 1 → 2 → 3 → output). */
export function ItemFlowchart({ item }: { item: StoreItem }) {
  const nodes = [
    { key: "in", label: item.input, kind: "io" as const },
    ...item.process.map((s) => ({ key: `s${s.index}`, label: s.label, kind: "step" as const, n: s.index })),
    { key: "out", label: item.output, kind: "io" as const },
  ];
  return (
    <section aria-labelledby="como-funciona">
      <h2 id="como-funciona" className="mb-3 text-lg font-medium">
        Como funciona
      </h2>
      <ol aria-label="Fluxo de uso" className="flex flex-col items-start" data-testid="flowchart">
        {nodes.map((node, i) => (
          <li key={node.key} className="flex flex-col items-start" data-node={node.key}>
            <span
              className={cn(
                "inline-flex min-h-9 items-center gap-2 rounded-md border px-3 text-sm",
                node.kind === "io" ? "bg-muted font-medium" : "bg-card",
              )}
            >
              {"n" in node && (
                <span className="bg-muted flex size-5 items-center justify-center rounded-full text-xs font-medium">
                  {node.n}
                </span>
              )}
              {node.kind === "io" && (
                <span className="text-muted-foreground text-xs uppercase">
                  {node.key === "in" ? "Input" : "Output"}
                </span>
              )}
              {node.label}
            </span>
            {i < nodes.length - 1 && (
              <span className="flex h-6 w-full items-center pl-5" aria-hidden="true">
                <span className="bg-border h-full w-px" />
              </span>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}

export function ReferenceDisclosure({ item }: { item: StoreItem }) {
  return (
    <Collapsible className="rc-cell rc-surface">
      <CollapsibleTrigger className="group focus-visible:ring-ring/50 flex min-h-11 w-full items-center justify-between rounded-lg px-4 text-sm font-medium outline-none focus-visible:ring-[3px]">
        Referências
        <ChevronDown className="size-4 transition-transform group-data-[state=open]:rotate-180" aria-hidden="true" />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <Separator />
        <ul className="space-y-2 p-4 text-sm">
          {item.references.map((r) => (
            <li key={r.label}>
              <span className="font-medium">{r.label}</span>
              <span className="text-muted-foreground"> — {r.note}</span>
            </li>
          ))}
        </ul>
      </CollapsibleContent>
    </Collapsible>
  );
}

export function PrimaryCTA({ item }: { item: StoreItem }) {
  const pending = item.cta.target === "#";
  return (
    <div className="flex flex-col items-stretch gap-2 sm:items-end">
      {pending ? (
        <>
          <Button size="lg" disabled aria-describedby="cta-note">
            {item.cta.label}
          </Button>
          <p id="cta-note" className="text-muted-foreground-subtle text-xs">
            Destino ainda não conectado (dados de exemplo).
          </p>
        </>
      ) : (
        <Button size="lg" asChild>
          <a href={item.cta.target}>{item.cta.label}</a>
        </Button>
      )}
    </div>
  );
}

