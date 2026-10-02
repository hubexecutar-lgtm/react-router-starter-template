import { Fragment } from "react";

import type { PlainBlock } from "@/lib/plain/structure";

/** "..." in a template is a field to fill in, not literal text. */
function Value({ text }: { text: string }) {
  if (text === "..." || text === "…") return <span className="plain-read__slot">a preencher</span>;
  return <>{text}</>;
}

/** Reading view of a plain-text panel (ADR-12): semantic HTML for every block. */
export function PlainBlocks({ blocks }: { blocks: PlainBlock[] }) {
  return (
    <>
      {blocks.map((b, i) => {
        switch (b.type) {
          case "heading":
            return (
              <p key={i} className="plain-read__heading">
                {b.text}
              </p>
            );
          case "pairs":
            return (
              <dl key={i} className="plain-read__pairs">
                {b.items.map((it, j) => (
                  <div key={j} className="plain-read__pair">
                    <dt data-code={it.code ? "" : undefined}>{it.term}</dt>
                    <dd>
                      {it.lead && (
                        <span className={it.details.length ? "plain-read__lead" : undefined}>
                          <Value text={it.lead} />
                        </span>
                      )}
                      {it.details.length > 0 && (
                        <ul>
                          {it.details.map((d, k) => (
                            <li key={k}>
                              <Value text={d} />
                            </li>
                          ))}
                        </ul>
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            );
          case "list": {
            const List = b.ordered ? "ol" : "ul";
            return (
              <Fragment key={i}>
                {b.intro && <p className="plain-read__intro">{b.intro}</p>}
                <List className="plain-read__list">
                  {b.items.map((it, j) => (
                    <li key={j}>
                      <Value text={it} />
                    </li>
                  ))}
                </List>
              </Fragment>
            );
          }
          case "table":
            return (
              <div key={i} className="plain-read__table" role="region" aria-label="Tabela" tabIndex={0}>
                <table className="ds-table">
                  {b.head && (
                    <thead>
                      <tr>
                        {b.head.map((h, j) => (
                          <th key={j} scope="col">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                  )}
                  <tbody>
                    {b.rows.map((r, j) => (
                      <tr key={j}>
                        {r.map((c, k) => (
                          <td key={k}>{c}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          default:
            return (
              <p key={i} className="plain-read__paragraph">
                {b.lines.map((l, j) => (
                  <Fragment key={j}>
                    {j > 0 && <br />}
                    {l}
                  </Fragment>
                ))}
              </p>
            );
        }
      })}
    </>
  );
}
