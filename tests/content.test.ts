import initSqlJs, { type SqlJsStatic } from "sql.js";
import { beforeAll, describe, expect, it } from "vitest";
import { courses, readyLessons, allLessons } from "../lib/content";
import { DATASETS } from "../lib/content/datasets/bookshop";
import { freshDatabase, gradeSql, runSql } from "../lib/sql/grade";

let SQL: SqlJsStatic;
beforeAll(async () => {
  SQL = await initSqlJs();
});

for (const course of courses) {
  describe(course.title, () => {
    it("has unique lesson slugs and numbers in order", () => {
      const lessons = allLessons(course).map((x) => x.lesson);
      expect(new Set(lessons.map((l) => l.slug)).size).toBe(lessons.length);
      expect(lessons.map((l) => l.number)).toEqual(lessons.map((_, i) => i + 1));
    });

    for (const lesson of readyLessons(course)) {
      describe(lesson.title, () => {
        it("has valid quiz answers", () => {
          for (const q of lesson.quiz) expect(q.answer).toBeLessThan(q.choices.length);
        });

        it("has unique exercise ids and sort groups that exist", () => {
          expect(new Set(lesson.exercises.map((e) => e.id)).size).toBe(lesson.exercises.length);
          for (const e of lesson.exercises) {
            if (e.type === "sort") for (const item of e.items) expect(e.groups).toContain(item.group);
          }
        });

        it("has SQL exercises whose answers run and pass, and whose starters don't", () => {
          for (const e of lesson.exercises) {
            if (e.type !== "sql") continue;
            expect(lesson.dataset, "SQL exercises need a dataset").toBeDefined();
            const seed = DATASETS[lesson.dataset!];
            const db = freshDatabase(SQL, seed);
            expect(runSql(db, e.answer).values.length + (e.checkQuery ? 1 : 0)).toBeGreaterThan(0);
            db.close();
            expect(gradeSql(SQL, seed, e, e.answer)).toEqual({ ok: true });
            if (e.starter.trim()) expect(gradeSql(SQL, seed, e, e.starter).ok).toBe(false);
          }
        });
      });
    }
  });
}
