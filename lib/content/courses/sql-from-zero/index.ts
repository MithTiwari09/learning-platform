import type { Course, PlannedLesson } from "../../types";
import { module1Lessons } from "./module-1";
import { module2Lessons } from "./module-2";
import { whereLesson } from "./lesson-where";

function planned(number: number, slug: string, title: string): PlannedLesson {
  return { status: "planned", number, slug, title };
}

export const sqlFromZero: Course = {
  slug: "sql-from-zero",
  title: "SQL from Zero",
  tagline: "Understand how databases think, then build and query your own.",
  description:
    "Start with plain-words intuition for how a database engine works. Then build an online bookshop's database yourself: design its tables, fill them, ask them questions, keep changes safe and control who can do what.",
  audience: "Complete beginners, from students to working professionals. No coding needed.",
  hours: "8 to 10 hours",
  modules: [
    {
      number: 1,
      title: "How a database thinks",
      description: "Intuition first, with everyday comparisons and no code.",
      lessons: module1Lessons,
    },
    {
      number: 2,
      title: "DDL: building the structure",
      description: "Create the bookshop's tables, with keys and rules.",
      lessons: module2Lessons,
    },
    {
      number: 3,
      title: "DML: filling and changing data",
      description: "Add, change and remove rows safely.",
      lessons: [
        planned(13, "insert", "Adding rows with INSERT"),
        planned(14, "update", "Changing rows with UPDATE"),
        planned(15, "delete", "Removing rows with DELETE"),
        planned(16, "when-rules-are-broken", "When rules are broken"),
      ],
    },
    {
      number: 4,
      title: "DQL: asking questions",
      description: "SELECT, filtering, sorting and summarising.",
      lessons: [
        planned(17, "select", "SELECT and choosing columns"),
        planned(18, "order-by-and-limit", "Sorting and limiting"),
        whereLesson,
        planned(20, "and-or-in-like", "AND, OR, IN, BETWEEN and LIKE"),
        planned(21, "null", "Missing values: NULL"),
        planned(22, "aggregates", "Counting and totals"),
        planned(23, "group-by", "GROUP BY and HAVING"),
      ],
    },
    {
      number: 5,
      title: "Combining tables",
      description: "Joins and subqueries.",
      lessons: [
        planned(24, "why-several-tables", "Why data lives in several tables"),
        planned(25, "inner-join", "INNER JOIN"),
        planned(26, "left-join", "LEFT JOIN"),
        planned(27, "subqueries-and-case", "Subqueries and CASE WHEN"),
      ],
    },
    {
      number: 6,
      title: "TCL: keeping changes safe",
      description: "BEGIN, COMMIT, ROLLBACK and SAVEPOINT in practice.",
      lessons: [
        planned(28, "begin-and-commit", "BEGIN and COMMIT"),
        planned(29, "rollback", "Undoing with ROLLBACK"),
        planned(30, "savepoints-and-concurrency", "SAVEPOINT and changes at the same time"),
      ],
    },
    {
      number: 7,
      title: "DCL: who can do what",
      description: "Users, roles and permissions.",
      lessons: [planned(31, "grant-and-revoke", "GRANT and REVOKE")],
    },
    {
      number: 8,
      title: "Final project",
      description: "Build the bookshop end to end and write a business report.",
      lessons: [
        planned(32, "build-the-bookshop", "Build the bookshop database"),
        planned(33, "business-report", "Bookshop business report"),
      ],
    },
  ],
};
