import type { Database, QueryExecResult, SqlJsStatic, SqlValue } from "sql.js";
import type { SqlExercise } from "../content/types";

export type QueryResult = { columns: string[]; values: SqlValue[][] };

export type Verdict =
  | { ok: true }
  | { ok: false; error: string }
  | { ok: false; reason: string };

/** Run one or more statements and return the last result that has columns. */
export function runSql(db: Database, sql: string): QueryResult {
  const results: QueryExecResult[] = db.exec(sql);
  const last = results[results.length - 1];
  return last ? { columns: last.columns, values: last.values } : { columns: [], values: [] };
}

export function freshDatabase(SQL: SqlJsStatic, seed: string): Database {
  const db = new SQL.Database();
  db.run(seed);
  return db;
}

/** Compare a learner's result with the expected one. Column names may differ (aliases are fine). */
export function compareResults(actual: QueryResult, expected: QueryResult, ordered: boolean): Verdict {
  // An empty result comes back with no columns at all, so say "no rows" rather than "0 columns".
  if (actual.values.length === 0 && expected.values.length > 0) {
    const n = expected.values.length;
    return {
      ok: false,
      reason: `Your query returned no rows, but the right answer has ${n}. Check your condition.`,
    };
  }
  if (actual.columns.length !== expected.columns.length) {
    const n = expected.columns.length;
    return {
      ok: false,
      reason: `The question asks for ${n} column${n === 1 ? "" : "s"} (${expected.columns.join(", ")}), and your result has ${actual.columns.length}.`,
    };
  }
  if (actual.values.length !== expected.values.length) {
    return {
      ok: false,
      reason: `Your result has ${actual.values.length} row${actual.values.length === 1 ? "" : "s"}, but the right answer has ${expected.values.length}. Check your condition.`,
    };
  }
  const key = (row: SqlValue[]) => JSON.stringify(row);
  const a = actual.values.map(key);
  const e = expected.values.map(key);
  const aSorted = [...a].sort();
  const eSorted = [...e].sort();
  if (!aSorted.every((v, i) => v === eSorted[i])) {
    return { ok: false, reason: "Some rows differ from the expected answer. Check your condition." };
  }
  if (ordered && !a.every((v, i) => v === e[i])) {
    return { ok: false, reason: "The rows are right. Check the sort order." };
  }
  return { ok: true };
}

/**
 * Grade a learner's SQL against an exercise. Both the learner's SQL and the reference
 * answer run on their own fresh copy of the dataset, so earlier experiments can't
 * affect the result.
 */
export function gradeSql(SQL: SqlJsStatic, seed: string, exercise: SqlExercise, learnerSql: string): Verdict {
  const mine = freshDatabase(SQL, seed);
  const ref = freshDatabase(SQL, seed);
  try {
    let actual: QueryResult;
    try {
      actual = runSql(mine, learnerSql);
      if (exercise.checkQuery) actual = runSql(mine, exercise.checkQuery);
    } catch (err) {
      return { ok: false, error: err instanceof Error ? err.message : String(err) };
    }
    let expected = runSql(ref, exercise.answer);
    if (exercise.checkQuery) expected = runSql(ref, exercise.checkQuery);
    const verdict = compareResults(actual, expected, exercise.ordered ?? false);
    if (!verdict.ok && exercise.checkQuery) {
      return { ok: false, reason: exercise.mismatch ?? "Compare your SQL with the task carefully." };
    }
    return verdict;
  } finally {
    mine.close();
    ref.close();
  }
}
