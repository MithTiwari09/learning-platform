// Copies the sql.js browser build into public/sqljs so the practice editor
// loads the SQLite engine from this site. Runs before dev and build.
import { copyFileSync, mkdirSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";

const require = createRequire(import.meta.url);
const dist = dirname(require.resolve("sql.js/dist/sql-wasm.js"));
const out = join(process.cwd(), "public", "sqljs");
mkdirSync(out, { recursive: true });
for (const file of ["sql-wasm.js", "sql-wasm.wasm"]) copyFileSync(join(dist, file), join(out, file));
