// Estado do shell v6/v7 (LANC-001 RQ-021…023): drawer do mobile e chrome que esconde no scroll.
// O cabeçalho e a barra inferior leem o mesmo estado, então escondem e voltam juntos (RQ-022).
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";

/** Abaixo disto o shell é mobile: drawer + barra inferior (UIX §2). */
export const DESKTOP_QUERY = "(min-width: 900px)";
/** Deslocamento mínimo, em px, para mudar o estado do chrome (evita tremer com o trackpad). */
const SCROLL_DELTA = 8;

type Shell = {
	drawerOpen: boolean;
	openDrawer: () => void;
	closeDrawer: (opts?: { restoreFocus?: boolean }) => void;
	chromeHidden: boolean;
};

const ShellContext = createContext<Shell>({ drawerOpen: false, openDrawer: () => {}, closeDrawer: () => {}, chromeHidden: false });

export const useShell = () => useContext(ShellContext);

export function ShellProvider({ children }: { children: ReactNode }) {
	const [drawerOpen, setDrawerOpen] = useState(false);
	const [scrolledAway, setScrolledAway] = useState(false);
	const [chromeFocused, setChromeFocused] = useState(false);

	const openDrawer = useCallback(() => setDrawerOpen(true), []);
	const closeDrawer = useCallback(({ restoreFocus = true } = {}) => {
		setDrawerOpen(false);
		if (restoreFocus) requestAnimationFrame(() => document.querySelector<HTMLElement>("[data-menu-toggle]")?.focus());
	}, []);

	// Esconde ao descer e mostra ao subir; perto do topo fica sempre visível.
	const last = useRef(0);
	useEffect(() => {
		last.current = window.scrollY;
		let frame = 0;
		const onScroll = () => {
			if (frame) return;
			frame = requestAnimationFrame(() => {
				frame = 0;
				const y = Math.max(0, window.scrollY);
				const delta = y - last.current;
				const header = document.querySelector<HTMLElement>("[data-site-header]")?.offsetHeight ?? 64;
				if (y <= header) setScrolledAway(false);
				else if (delta > SCROLL_DELTA) setScrolledAway(true);
				else if (delta < -SCROLL_DELTA) setScrolledAway(false);
				if (Math.abs(delta) > SCROLL_DELTA || y <= header) last.current = y;
			});
		};
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => {
			window.removeEventListener("scroll", onScroll);
			cancelAnimationFrame(frame);
		};
	}, []);

	// Foco do teclado dentro do chrome o mantém visível (RQ-022).
	useEffect(() => {
		const inChrome = (t: EventTarget | null) => t instanceof Element && !!t.closest("[data-chrome]");
		const onIn = (e: FocusEvent) => setChromeFocused(inChrome(e.target));
		const onOut = (e: FocusEvent) => {
			if (!inChrome(e.relatedTarget)) setChromeFocused(false);
		};
		document.addEventListener("focusin", onIn);
		document.addEventListener("focusout", onOut);
		return () => {
			document.removeEventListener("focusin", onIn);
			document.removeEventListener("focusout", onOut);
		};
	}, []);

	// Ao passar para o desktop, o drawer deixa de existir.
	useEffect(() => {
		const mq = window.matchMedia(DESKTOP_QUERY);
		const onChange = () => mq.matches && setDrawerOpen(false);
		mq.addEventListener("change", onChange);
		return () => mq.removeEventListener("change", onChange);
	}, []);

	const chromeHidden = scrolledAway && !drawerOpen && !chromeFocused;
	const value = useMemo(() => ({ drawerOpen, openDrawer, closeDrawer, chromeHidden }), [drawerOpen, openDrawer, closeDrawer, chromeHidden]);
	return <ShellContext.Provider value={value}>{children}</ShellContext.Provider>;
}
