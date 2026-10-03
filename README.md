# LearnLab

A learning platform for students and professionals: short lessons followed by hands-on practice in the browser.

First course: **SQL from Zero**. It starts with plain-words intuition for how a database engine works, then follows SQL's command families (DDL, DML, DQL, TCL, DCL) as the learner builds an online bookshop's database.

## What's here (stage 1)

- Home page, course page with modules and lesson status, and lesson pages
- Lesson page: video slot, lesson text, key ideas, practice, quick quiz, previous/next
- Practice types: a real SQL editor running SQLite in the browser (sql.js) with automatic answer checking, "sort it" and "put in order" activities, and an animated "follow the query" walk-through
- Progress and XP saved in the learner's browser (accounts come in stage 2)
- Content: Module 1 (6 lessons) and lesson 19, Filtering with WHERE; the other lessons are listed as coming soon

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm test           # answer checking and content checks
npm run lint && npm run typecheck && npm run build
```

## Adding a lesson

Lessons are plain TypeScript data in `lib/content/courses/<course>/`. Each one has a markdown body, key ideas, exercises and quiz questions (see `lib/content/types.ts`). To publish a planned lesson, replace its `planned(...)` entry in the course's `index.ts` with the full lesson.

`npm test` checks every lesson: each SQL exercise's answer must run against the practice database and pass its own check, broken starter queries must fail, quiz answers must exist, and lesson numbers must be in order.

### How SQL answers are checked

The learner's SQL and the reference answer each run on a fresh copy of the practice database, and the results are compared row by row (column names may differ, so aliases are fine). `ordered: true` also checks the row order. For exercises that change data or structure, `checkQuery` is run afterwards and its results are compared instead.

## Stack

Next.js (App Router, TypeScript), plain CSS, sql.js for in-browser SQLite, react-markdown, Vitest. Course content is international: prices in US dollars and a global mix of names and places.
