// Arte do hero (ADR-12): ilustração sem texto do banco + halftone orgânico ao lado.
// O halftone fica mascarado fora da área da ilustração (que tem fundo branco opaco),
// então nunca recorta a figura nem passa por trás de texto. `wide` é a faixa sob o hero centralizado
// da home (AUD-WEB-001-03).
import { DotField } from "./DotField";

import { cn } from "@/lib/utils";

export type HeroImage = { src: string; alt: string; width: number; height: number };

export function HeroArt({
  image,
  seed = 11,
  wide = false,
  className,
}: {
  image?: HeroImage;
  seed?: number;
  /** Faixa larga sob o texto centralizado (AUD-WEB-001-03): figura no centro, halftone nas laterais. */
  wide?: boolean;
  className?: string;
}) {
  if (wide) {
    return (
      <div className={cn("relative isolate aspect-[4/3] sm:aspect-[16/9] lg:aspect-[2/1]", className)} data-hero-art>
        <DotField
          cols={48}
          rows={24}
          seed={seed}
          fade="none"
          className="absolute inset-0 -z-10 h-full w-full [mask-image:radial-gradient(ellipse_at_center,transparent_0%,transparent_30%,black_62%)]"
        />
        {image && (
          <img
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            className="absolute inset-y-0 left-1/2 h-full w-auto max-w-[70%] -translate-x-1/2 object-contain"
            fetchPriority="high"
          />
        )}
      </div>
    );
  }
  return (
    <div className={cn("relative isolate", image ? "aspect-[5/4]" : "aspect-[4/3]", className)} data-hero-art>
      <DotField
        cols={26}
        rows={20}
        seed={seed}
        fade={image ? "right" : "none"}
        className={cn(
          "absolute inset-0 -z-10 h-full w-full",
          image && "[mask-image:linear-gradient(to_right,transparent_0%,transparent_60%,black_84%)]",
        )}
      />
      {image && (
        <img
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          className="absolute top-1/2 left-0 h-[92%] w-auto max-w-[62%] -translate-y-1/2 object-contain"
          fetchPriority="high"
        />
      )}
    </div>
  );
}

/** Ilustrações sem texto em uso no site (docs/banco-imagens/manifest.json). */
export const IMAGES = {
  binoculo: {
    src: "/images/binoculo.webp",
    alt: "Ilustração de uma mulher sentada em um banquinho observando com um binóculo azul.",
    width: 593,
    height: 720,
  },
  equipeTablet: {
    src: "/images/equipe-tablet.webp",
    alt: "Ilustração de três pessoas conversando em torno de um tablet, com formas geométricas azuis.",
    width: 954,
    height: 748,
  },
  maoChaves: {
    src: "/images/mao-chaves.webp",
    alt: "Ilustração de uma mão azul segurando chaves e um chaveiro.",
    width: 640,
    height: 1136,
  },
} satisfies Record<string, HeroImage>;
