import type { Lesson } from "../../types";
import { BOOKSHOP_SEED } from "../../datasets/bookshop";

export const whereLesson: Lesson = {
  status: "ready",
  slug: "filtering-with-where",
  number: 20,
  title: "Filtering rows with WHERE",
  minutes: 15,
  summary: "Keep only the rows you care about, like books under $10 or orders still pending.",
  video: { title: "WHERE in 3 minutes" },
  practiceDb: { seed: BOOKSHOP_SEED, showBookshopTables: true },
  body: `
So far every query has returned every row. \`WHERE\` lets you keep only the rows you care about.

Add \`WHERE\` after \`FROM\`, followed by a condition. The database checks the condition on every row and keeps only the rows where it is true.

\`\`\`sql
SELECT title, price
FROM books
WHERE price < 12;
\`\`\`

Text values go in single quotes: \`WHERE genre = 'Fantasy'\`. Numbers don't need quotes. You can sort the filtered result as usual with \`ORDER BY\`, which always comes after \`WHERE\`.

| Operator | Meaning |
|---|---|
| \`=\` | equal to |
| \`<>\` | not equal to |
| \`<\` and \`>\` | less than, greater than |
| \`<=\` and \`>=\` | less than or equal to, greater than or equal to |
`,
  keyIdeas: [
    "WHERE keeps only the rows where the condition is true.",
    "The order is SELECT, FROM, WHERE, then ORDER BY.",
    "Text goes in single quotes and is case-sensitive; numbers don't need quotes.",
  ],
  exercises: [
    {
      type: "sql",
      id: "cheap-books",
      kind: "Write a query",
      prompt: "Show the title and price of every book that costs less than $10.",
      starter: "SELECT title, price\nFROM books\n",
      answer: "SELECT title, price FROM books WHERE price < 10;",
      hint: "Add a line starting with WHERE, then the condition price < 10.",
      xp: 25,
    },
    {
      type: "sql",
      id: "fantasy-books",
      kind: "Write a query",
      prompt: "List the titles of all books in the 'Fantasy' genre.",
      starter: "SELECT title\nFROM books\n",
      answer: "SELECT title FROM books WHERE genre = 'Fantasy';",
      hint: "Text needs single quotes, and capital letters matter: genre = 'Fantasy'.",
      xp: 25,
    },
    {
      type: "sql",
      id: "out-of-stock",
      kind: "Fix the query",
      prompt: "This should show books that are out of stock, but it returns an error. Fix it.",
      starter: "SELECT title, stock\nWHERE stock = 0\nFROM books;",
      answer: "SELECT title, stock FROM books WHERE stock = 0;",
      hint: "The order of the parts matters: SELECT, then FROM, then WHERE.",
      xp: 25,
    },
    {
      type: "sql",
      id: "not-london",
      kind: "Challenge",
      prompt: "Show the name and city of customers who are not from London, sorted by name from A to Z.",
      starter: "",
      answer: "SELECT name, city FROM customers WHERE city <> 'London' ORDER BY name;",
      ordered: true,
      hint: "Use <> 'London' to mean not equal, then ORDER BY name at the end.",
      xp: 50,
    },
  ],
  quiz: [
    {
      question: "Which query returns books published before 1950?",
      choices: [
        "SELECT * FROM books WHERE published_year < 1950;",
        "SELECT * WHERE published_year < 1950 FROM books;",
        "SELECT * FROM books ORDER BY published_year < 1950;",
      ],
      answer: 0,
      why: "WHERE comes right after FROM. ORDER BY sorts rows but never removes any.",
    },
    {
      question: "How many rows does this return?",
      code: "SELECT * FROM orders WHERE status = 'pending';",
      choices: ["1", "2", "10"],
      answer: 1,
      why: "Two orders, numbers 7 and 9, are still pending. You can run it in the editor to check.",
    },
    {
      question: "What's wrong with WHERE genre = Mystery?",
      choices: [
        "Nothing, it works",
        "Mystery needs single quotes because it is text",
        "WHERE can't be used with text",
      ],
      answer: 1,
      why: "Without quotes the database thinks Mystery is a column name. Write genre = 'Mystery'.",
    },
  ],
};
