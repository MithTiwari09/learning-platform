import { BOOKSHOP_SCHEMA } from "@/lib/content/datasets/bookshop";

export function SchemaPanel() {
  return (
    <div className="panel schema">
      <div className="eyebrow" style={{ marginBottom: 6 }}>
        Database: bookshop
      </div>
      {BOOKSHOP_SCHEMA.map((t, i) => (
        <details key={t.table} open={i === 0}>
          <summary>
            {t.table}
            <span>{t.rows} rows</span>
          </summary>
          <ul>
            {t.columns.map(([name, type]) => (
              <li key={name}>
                {name}
                <em>{type}</em>
              </li>
            ))}
          </ul>
        </details>
      ))}
      <p className="small" style={{ margin: "8px 0 0" }}>
        Tip: run <code>SELECT * FROM books;</code> to see every row.
      </p>
    </div>
  );
}
