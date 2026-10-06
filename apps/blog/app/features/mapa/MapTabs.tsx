// MapTabs (DS-CF-001-mapa §1): variante das Abas do DS (§3) com estado controlado, painéis montados (forceMount) e um
// controle ao lado da lista. Mesma pele (ds-tabs/ds-tab/ds-tab-panel); Radix só pelo comportamento (setas, foco, aria).
import type { ReactNode } from "react";

import * as RadixTabs from "@radix-ui/react-tabs";

type DataAttrs = Record<`data-${string}`, string | undefined>;

export type MapTabItem = { value: string; label: ReactNode; content: ReactNode; trigger?: DataAttrs; panel?: DataAttrs };

export function MapTabs({
	label,
	items,
	value,
	defaultValue,
	onValueChange,
	forceMount,
	wrap,
	listEnd,
	...rest
}: {
	label: string;
	items: MapTabItem[];
	value?: string;
	defaultValue?: string;
	onValueChange?: (value: string) => void;
	forceMount?: boolean;
	wrap?: boolean;
	listEnd?: ReactNode;
} & DataAttrs) {
	return (
		<RadixTabs.Root value={value} defaultValue={value === undefined ? (defaultValue ?? items[0]?.value) : undefined} onValueChange={onValueChange} className="ds-maptabs" {...rest}>
			<div className="ds-maptabs-bar">
				<RadixTabs.List className="ds-tabs" aria-label={label} data-wrap={wrap ? "" : undefined}>
					{items.map((t) => (
						<RadixTabs.Trigger key={t.value} value={t.value} className="ds-tab" {...t.trigger}>
							{t.label}
						</RadixTabs.Trigger>
					))}
				</RadixTabs.List>
				{listEnd}
			</div>
			{items.map((t) => (
				<RadixTabs.Content key={t.value} value={t.value} className="ds-tab-panel" forceMount={forceMount || undefined} {...t.panel}>
					{t.content}
				</RadixTabs.Content>
			))}
		</RadixTabs.Root>
	);
}
