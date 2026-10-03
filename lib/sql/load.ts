"use client";

import type { SqlJsStatic } from "sql.js";

declare global {
  interface Window {
    initSqlJs?: (config: { locateFile: (file: string) => string }) => Promise<SqlJsStatic>;
  }
}

let loading: Promise<SqlJsStatic> | null = null;

/**
 * Load the SQLite engine (sql.js) in the browser. The files are copied into
 * public/sqljs by scripts/copy-sqljs.mjs, so nothing is fetched from another site.
 */
export function loadSqlJs(): Promise<SqlJsStatic> {
  if (loading) return loading;
  loading = new Promise<SqlJsStatic>((resolve, reject) => {
    const init = () =>
      window.initSqlJs!({ locateFile: (file) => `/sqljs/${file}` }).then(resolve, reject);
    if ("initSqlJs" in window) return init();
    const script = document.createElement("script");
    script.src = "/sqljs/sql-wasm.js";
    script.async = true;
    script.onload = init;
    script.onerror = () => reject(new Error("The practice database could not load."));
    document.head.appendChild(script);
  }).catch((err) => {
    loading = null;
    throw err;
  });
  return loading;
}
