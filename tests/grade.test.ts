import initSqlJs, { type SqlJsStatic } from "sql.js";
import { beforeAll, describe, expect, it } from "vitest";
import { BOOKSHOP_SEED } from "../lib/content/datasets/bookshop";
import { whereLesson } from "../lib/content/courses/sql-from-zero/lesson-where";
import type { SqlExercise } from "../lib/content/types";
import { compareResults, gradeSql } from "../lib/sql/grade";
import { readyLessons } from "../lib/content";
import { sqlFromZero } from "../lib/content/courses/sql-from-zero";

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

  it("says 'no rows' for an empty result instead of counting columns", () => {
    const v = compareResults({ columns: [], values: [] }, r([[1, "x"], [2, "y"]]), false);
    expect("reason" in v && v.reason).toMatch(/returned no rows, but the right answer has 2/);
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

describe("gradeSql for exercises that change structure or data", () => {
  const lesson = (slug: string) => readyLessons(sqlFromZero).find((l) => l.slug === slug)!;
  const grade = (slug: string, id: string, sql: string) => {
    const l = lesson(slug);
    const e = l.exercises.find((x) => x.id === id) as SqlExercise;
    return gradeSql(SQL, l.practiceDb!.seed, e, sql);
  };

  it("accepts lowercase types and different spacing", () => {
    expect(grade("create-table", "create-authors", "create table authors(id integer,name text,country text)")).toEqual({ ok: true });
  });

  it("rejects a wrong type with the exercise's own explanation", () => {
    const v = grade("create-table", "create-authors", "CREATE TABLE authors (id TEXT, name TEXT, country TEXT)");
    expect(v.ok).toBe(false);
    expect("reason" in v && v.reason).toMatch(/authors table doesn't match/);
  });

  it("accepts the long FOREIGN KEY form", () => {
    const sql =
      "CREATE TABLE books (id INTEGER PRIMARY KEY, title TEXT NOT NULL, author_id INTEGER, FOREIGN KEY (author_id) REFERENCES authors(id))";
    expect(grade("foreign-keys", "books-reference-authors", sql)).toEqual({ ok: true });
  });

  it("rejects a missing link", () => {
    const sql = "CREATE TABLE books (id INTEGER PRIMARY KEY, title TEXT NOT NULL, author_id INTEGER)";
    expect(grade("foreign-keys", "books-reference-authors", sql).ok).toBe(false);
  });

  it("rejects a missing UNIQUE rule", () => {
    const sql =
      "CREATE TABLE customers (id INTEGER PRIMARY KEY, name TEXT NOT NULL, email TEXT, country TEXT DEFAULT 'Unknown')";
    expect(grade("constraints", "customers-with-rules", sql).ok).toBe(false);
  });

  it("accepts an UPDATE that targets the row by id instead of title", () => {
    expect(grade("update", "new-price", "UPDATE books SET price = 19.99 WHERE id = 12")).toEqual({ ok: true });
  });

  it("rejects an UPDATE without WHERE", () => {
    expect(grade("update", "new-price", "UPDATE books SET price = 19.99").ok).toBe(false);
  });

  it("accepts an INSERT that gives the next id explicitly", () => {
    const sql =
      "INSERT INTO books VALUES (21, 'The Mysterious Affair at Styles', 6, 'Mystery', 8.99, 1920, 20)";
    expect(grade("insert", "add-book", sql)).toEqual({ ok: true });
  });

  it("reports the constraint error from a broken INSERT", () => {
    const l = lesson("when-rules-are-broken");
    const e = l.exercises.find((x) => x.id === "fix-missing-author") as SqlExercise;
    const v = gradeSql(SQL, l.practiceDb!.seed, e, e.starter);
    expect("error" in v && v.error).toMatch(/FOREIGN KEY constraint failed/);
  });

  it("rejects dropping the wrong table", () => {
    expect(grade("alter-and-drop", "drop-promotions", "DROP TABLE books").ok).toBe(false);
  });
});
