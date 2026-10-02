import * as React from "react";

import "./PlainTextPanel.css";
import { type PlainTextPanelProps, toBool } from "./plain.types";
import { PlainBlocks } from "./PlainBlocks";
import { PlainSurface } from "./PlainSurface";


import { normalizeText } from "@/lib/plain/normalizeText";
import { structurePlain } from "@/lib/plain/structure";

/**
 * Operational text on the plain surface (ANX-ADR-BLOG-ASCII-001-A). The plain text is
 * the source and what "Copiar" copies ([data-plain-source]); readers see a structured
 * reading view (ADR-12): definition lists, lists, tables and paragraphs in the text face.
 */
export function PlainTextPanel({
  id,
  title = "Plain text",
  kind = "generic",
  source,
  children,
  copyable,
  collapsible,
  theme,
  density,
  fontSize,
  maxHeight,
  ariaLabel,
  caption,
  className,
}: PlainTextPanelProps) {
  const raw = source ?? (typeof children === "string" ? children : null);
  const text = raw !== null ? normalizeText(raw) : null;
  const scrollable = maxHeight !== undefined;

  return (
    <PlainSurface
      id={id}
      title={title}
      theme={theme}
      density={density}
      fontSize={fontSize}
      caption={caption}
      className={className}
      variant="panel"
      kind={kind}
      copyable={toBool(copyable, true)}
      collapsible={collapsible}
      copyLabel="Copiar conteúdo"
    >
      <div
        className="plain-text-panel__content plain-read"
        data-plain-content
        data-kind={kind}
        role={ariaLabel || scrollable ? "region" : undefined}
        aria-label={ariaLabel ?? (scrollable ? title : undefined)}
        tabIndex={scrollable ? 0 : undefined}
        style={scrollable ? { maxHeight } : undefined}
      >
        {text !== null ? <PlainBlocks blocks={structurePlain(text)} /> : children}
      </div>
      {text !== null && (
        <pre hidden data-plain-source>
          {text}
        </pre>
      )}
    </PlainSurface>
  );
}
