import { AlertCircle, SearchX } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";

export function CatalogSkeleton() {
  return (
    <div aria-busy="true" data-testid="state-loading" className="mt-10 space-y-3">
      <p className="text-muted-foreground flex items-center gap-2 text-sm">
        <Spinner aria-label="Carregando" /> Carregando catálogo…
      </p>
      {Array.from({ length: 4 }, (_, i) => (
        <Skeleton key={i} className="h-24 w-full rounded-md" />
      ))}
    </div>
  );
}

export function CatalogEmpty({
  filtered,
  onClear,
}: {
  filtered: boolean;
  onClear: () => void;
}) {
  return (
    <Empty data-testid="state-empty" className="mt-10 border">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <SearchX aria-hidden="true" />
        </EmptyMedia>
        <EmptyTitle>{filtered ? "Nenhum resultado" : "Nada por aqui ainda"}</EmptyTitle>
        <EmptyDescription>
          {filtered
            ? "Ajuste a busca ou os filtros para ver outros itens."
            : "Esta categoria ainda não tem itens de exemplo."}
        </EmptyDescription>
      </EmptyHeader>
      {filtered && (
        <EmptyContent>
          <Button variant="outline" onClick={onClear}>
            Limpar filtros
          </Button>
        </EmptyContent>
      )}
    </Empty>
  );
}

export function CatalogError({ onRetry }: { onRetry: () => void }) {
  return (
    <Alert variant="destructive" data-testid="state-error" className="mt-10">
      <AlertCircle aria-hidden="true" />
      <AlertTitle>Não foi possível carregar o catálogo</AlertTitle>
      <AlertDescription>
        <p>Tente novamente em instantes.</p>
        <Button variant="outline" size="sm" className="mt-2" onClick={onRetry}>
          Tentar novamente
        </Button>
      </AlertDescription>
    </Alert>
  );
}
