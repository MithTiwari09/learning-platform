import type { Course } from "../../types";
import { module1Lessons } from "./module-1";
import { module2Lessons } from "./module-2";
import { module3Lessons } from "./module-3";
import { module4Lessons } from "./module-4";
import { module5Lessons } from "./module-5";
import { module6Lessons } from "./module-6";
import { module7Lessons } from "./module-7";
import { module8Lessons } from "./module-8";

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
      lessons: module3Lessons,
    },
    {
      number: 4,
      title: "DQL: asking questions",
      description: "SELECT, filtering, sorting and summarising.",
      lessons: module4Lessons,
    },
    {
      number: 5,
      title: "Combining tables",
      description: "Joins and subqueries.",
      lessons: module5Lessons,
    },
    {
      number: 6,
      title: "TCL: keeping changes safe",
      description: "BEGIN, COMMIT, ROLLBACK and SAVEPOINT in practice.",
      lessons: module6Lessons,
    },
    {
      number: 7,
      title: "DCL: who can do what",
      description: "Users, roles and permissions.",
      lessons: module7Lessons,
    },
    {
      number: 8,
      title: "Final project",
      description: "Build the bookshop end to end and write a business report.",
      lessons: module8Lessons,
    },
  ],
};
