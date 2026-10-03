import initSqlJs, { type SqlJsStatic } from "sql.js";
import { beforeAll, describe, expect, it } from "vitest";
import { BOOKSHOP_SEED } from "../lib/content/datasets/bookshop";
import { whereLesson } from "../lib/content/courses/sql-from-zero/lesson-where";
import type { SqlExercise } from "../lib/content/types";
import { compareResults, gradeSql } from "../lib/sql/grade";

let SQL: SqlJsStatic;
beforeAll(async () => {
  SQL = await initSqlJs();
});

const ex = (id: string) => whereLesson.exercises.find((e) => e.id === id) as SqlExercise;

describe("compareResults", () => {
  const r = (values: (string | number)[][]) => ({ columns: ["a", "b"], values });

  it("accepts the same rows in any order when order doesn't matter", () => {
    expect(compareResults(r([[1, "x"], [2, "y"]]), r([[2, "y"], [1, "x"]]), false)).toEqual({ ok: true });
  });

  it("rejects a different order when order matters", () => {
    const v = compareResults(r([[1, "x"], [2, "y"]]), r([[2, "y"], [1, "x"]]), true);
    expect(v).toEqual({ ok: false, reason: "The rows are right. Check the sort order." });
  });

  it("explains a wrong column count", () => {
    const v = compareResults({ columns: ["a"], values: [[1]] }, r([[1, "x"]]), false);
    expect(v.ok).toBe(false);
    expect("reason" in v && v.reason).toMatch(/asks for 2 columns \(a, b\)/);
  });

  it("explains a wrong row count", () => {
    const v = compareResults(r([[1, "x"]]), r([[1, "x"], [2, "y"]]), false);
    expect("reason" in v && v.reason).toMatch(/has 1 row, but the right answer has 2/);
  });
});

describe("gradeSql", () => {
  it("accepts a different but correct query, including column aliases", () => {
    const v = gradeSql(SQL, BOOKSHOP_SEED, ex("cheap-books"), "select title as t, price from books where price <= 9.99");
    expect(v).toEqual({ ok: true });
  });

  it("returns the database error for broken SQL", () => {
    const v = gradeSql(SQL, BOOKSHOP_SEED, ex("out-of-stock"), ex("out-of-stock").starter);
    expect(v.ok).toBe(false);
    expect("error" in v && v.error).toMatch(/syntax error/);
  });

  it("checks sort order for the challenge", () => {
    const unsorted = "SELECT name, city FROM customers WHERE city <> 'London' ORDER BY name DESC";
    expect(gradeSql(SQL, BOOKSHOP_SEED, ex("not-london"), unsorted)).toEqual({
      ok: false,
      reason: "The rows are right. Check the sort order.",
    });
  });

  it("is not affected by data changes in the learner's own experiments", () => {
    const v = gradeSql(SQL, BOOKSHOP_SEED, ex("fantasy-books"), "DELETE FROM books; SELECT title FROM books WHERE genre='Fantasy'");
    expect(v.ok).toBe(false);
    expect(gradeSql(SQL, BOOKSHOP_SEED, ex("fantasy-books"), "SELECT title FROM books WHERE genre='Fantasy'")).toEqual({ ok: true });
  });

  it("compares a follow-up query for exercises that change data", () => {
    const update: SqlExercise = {
      type: "sql",
      id: "raise-fantasy",
      kind: "Write a query",
      prompt: "",
      starter: "",
      answer: "UPDATE books SET price = price + 1 WHERE genre = 'Fantasy'",
      checkQuery: "SELECT id, price FROM books ORDER BY id",
      hint: "",
      xp: 0,
    };
    expect(gradeSql(SQL, BOOKSHOP_SEED, update, "UPDATE books SET price = price + 1 WHERE genre = 'Fantasy';").ok).toBe(true);
    expect(gradeSql(SQL, BOOKSHOP_SEED, update, "UPDATE books SET price = price + 1;").ok).toBe(false);
  });
});
