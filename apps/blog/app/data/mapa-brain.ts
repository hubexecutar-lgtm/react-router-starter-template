// Copy do cérebro no Mapa Cognitivo (/mapas/, ADR-26). As 4 funções, os textos de demanda, dificuldade e estratégia e a
// nota sobre localização vêm do RC-HOME-002 (HOME_MAP, sem reescrita); só o cabeçalho é texto de interface (ux-copy).
import { HOME_MAP } from "@/data/home";
import type { BrainCopy } from "@/features/home-brain/BrainHero";


export const MAP_BRAIN: BrainCopy = {
	...HOME_MAP,
	eyebrow: "Cérebro interativo",
	heading: "Selecione uma função executiva",
	lead: "Gire o cérebro, escolha um dos quatro seletores e veja demanda, dificuldade possível, estratégia de apoio, relações e fontes registradas no grafo.",
};
