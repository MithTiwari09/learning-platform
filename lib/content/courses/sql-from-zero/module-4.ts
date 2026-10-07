import type { Lesson } from "../../types";
import { BOOKSHOP_SEED } from "../../datasets/bookshop";
import { whereLesson } from "./lesson-where";

/** Module 4: DQL, asking questions. */

const bookshop = { seed: BOOKSHOP_SEED, showBookshopTables: true };

const select: Lesson = {
  status: "ready",
  slug: "select",
  number: 18,
  title: "SELECT and choosing columns",
  minutes: 12,
  summary: "Ask the bookshop for exactly the columns you want to see.",
  video: {
    title: "Asking your first questions",
    src: "/videos/sql-18-select.mp4",
    poster: "/videos/sql-18-select.jpg",
  },
  practiceDb: bookshop,
  body: `
You've built the bookshop and filled it. Now comes the part people use most: asking it questions. That's **DQL**, and almost all of it is one command, \`SELECT\`.

\`\`\`sql
SELECT title, price
FROM books;
\`\`\`

Reading it out loud: "Show me the title and price, from the books table." The database goes through every row and hands back just those two columns, in the order you named them.

- \`SELECT *\` means "every column". It's handy for a quick look, but naming the columns you need keeps results short and clear.
- Separate column names with commas. A missing comma is the most common mistake.

**Calculate as you go.** A column in the result can be a small sum, and \`AS\` gives it a friendly name:

\`\`\`sql
SELECT title, price * 2 AS price_for_two
FROM books;
\`\`\`

Nothing in the table changes. \`SELECT\` only reads, so you can experiment freely.

**Remove repeats with DISTINCT.** \`SELECT genre FROM books;\` lists a genre for every one of the 20 books, with lots of repeats. \`SELECT DISTINCT genre FROM books;\` lists each genre once.
`,
  keyIdeas: [
    "SELECT columns FROM table reads data without changing it.",
    "SELECT * shows every column; naming columns keeps results focused.",
    "AS renames a result column, and DISTINCT removes repeated rows.",
  ],
  exercises: [
    {
      type: "sql",
      id: "all-authors",
      kind: "Write a query",
      prompt: "Show every column of the authors table.",
      starter: "SELECT \nFROM authors;",
      answer: "SELECT * FROM authors;",
      hint: "The star * means every column.",
      xp: 20,
    },
    {
      type: "sql",
      id: "title-and-price",
      kind: "Write a query",
      prompt: "Show the title and price of every book.",
      starter: "SELECT \nFROM books;",
      answer: "SELECT title, price FROM books;",
      hint: "Name both columns after SELECT, separated by a comma.",
      xp: 25,
    },
    {
      type: "sql",
      id: "missing-comma",
      kind: "Fix the query",
      prompt:
        "This should show each author's name and country, but the result has only one column, and it's labelled country. Fix it.",
      starter: "SELECT name country\nFROM authors;",
      answer: "SELECT name, country FROM authors;",
      hint: "Without a comma, the database reads “name country” as the column name with a new label. Add a comma.",
      xp: 25,
    },
    {
      type: "sql",
      id: "distinct-countries",
      kind: "Write a query",
      prompt: "List each country our authors come from, with no repeats.",
      starter: "SELECT country\nFROM authors;",
      answer: "SELECT DISTINCT country FROM authors;",
      hint: "Put DISTINCT straight after SELECT.",
      xp: 25,
    },
    {
      type: "sql",
      id: "sale-price",
      kind: "Challenge",
      prompt: "There's a $2 sale on every book. Show each title and its sale price, and name the second column sale_price.",
      starter: "",
      answer: "SELECT title, price - 2 AS sale_price FROM books;",
      hint: "Write price - 2 as a column, then AS sale_price.",
      xp: 50,
    },
  ],
  quiz: [
    {
      question: "What does SELECT * FROM customers; show?",
      choices: ["Every column of every customer", "Only the first customer", "The number of customers"],
      answer: 0,
      why: "The star means every column, and with no WHERE every row is returned.",
    },
    {
      question: "After running this, what happens to the prices stored in the books table?",
      code: "SELECT title, price * 0.9 AS discounted FROM books;",
      choices: ["They drop by 10%", "Nothing, SELECT only reads", "A new column called discounted is added"],
      answer: 1,
      why: "SELECT never changes data. The calculation only appears in the result. To change prices you'd use UPDATE.",
    },
    {
      question: "How many rows does SELECT DISTINCT genre FROM books; return?",
      choices: ["6", "20", "1"],
      answer: 0,
      why: "There are 20 books but only 6 different genres: Children, Fiction, Fantasy, Mystery, Non-fiction and Science fiction.",
    },
  ],
};

const orderByAndLimit: Lesson = {
  status: "ready",
  slug: "order-by-and-limit",
  number: 19,
  title: "Sorting and limiting",
  minutes: 12,
  summary: "Put results in order and keep just the top few, like the three newest books.",
  video: {
    title: "Top 3 in one line",
    src: "/videos/sql-19-order-by-and-limit.mp4",
    poster: "/videos/sql-19-order-by-and-limit.jpg",
  },
  practiceDb: bookshop,
  body: `
Without instructions, a database returns rows in whatever order is quickest for it. When order matters, say so with \`ORDER BY\`.

\`\`\`sql
SELECT title, price
FROM books
ORDER BY price;
\`\`\`

- Sorting goes from smallest to largest (A to Z for text) by default. Add \`DESC\` for largest first: \`ORDER BY price DESC\`.
- Sort by more than one column with commas. \`ORDER BY country, name\` sorts by country, and by name within the same country.

**Keep only the first few rows with LIMIT.** It always goes last:

\`\`\`sql
SELECT title, price
FROM books
ORDER BY price DESC
LIMIT 3;
\`\`\`

That's "the three most expensive books". \`ORDER BY\` with \`LIMIT\` is how you answer any "top 5" or "latest 10" question.

The order of the parts is always the same: \`SELECT\`, \`FROM\`, then \`ORDER BY\`, then \`LIMIT\`.
`,
  keyIdeas: [
    "ORDER BY sorts results; add DESC to sort from largest to smallest.",
    "Use commas to sort by a second column when the first is the same.",
    "LIMIT keeps only the first rows, and it always comes last.",
  ],
  exercises: [
    {
      type: "sql",
      id: "authors-a-to-z",
      kind: "Write a query",
      prompt: "Show the name of every author, sorted from A to Z.",
      starter: "SELECT name\nFROM authors\n",
      answer: "SELECT name FROM authors ORDER BY name;",
      ordered: true,
      hint: "Add ORDER BY name at the end.",
      xp: 25,
    },
    {
      type: "sql",
      id: "newest-three",
      kind: "Write a query",
      prompt: "Show the title and published_year of the three most recently published books, newest first.",
      starter: "SELECT title, published_year\nFROM books\n",
      answer: "SELECT title, published_year FROM books ORDER BY published_year DESC LIMIT 3;",
      ordered: true,
      hint: "ORDER BY published_year DESC, then LIMIT 3.",
      xp: 25,
    },
    {
      type: "sql",
      id: "limit-order",
      kind: "Fix the query",
      prompt: "This should show the three most expensive books, but it returns an error. Fix it.",
      starter: "SELECT title, price\nFROM books\nLIMIT 3\nORDER BY price DESC;",
      answer: "SELECT title, price FROM books ORDER BY price DESC LIMIT 3;",
      ordered: true,
      hint: "LIMIT always comes last.",
      xp: 25,
    },
    {
      type: "sql",
      id: "customers-by-country",
      kind: "Challenge",
      prompt: "Show the country and name of every customer, sorted by country from A to Z, and by name within the same country.",
      starter: "",
      answer: "SELECT country, name FROM customers ORDER BY country, name;",
      ordered: true,
      hint: "ORDER BY country, name sorts by country first, then by name.",
      xp: 50,
    },
  ],
  quiz: [
    {
      question: "Which query lists the cheapest book first?",
      choices: [
        "SELECT title FROM books ORDER BY price;",
        "SELECT title FROM books ORDER BY price DESC;",
        "SELECT title FROM books LIMIT price;",
      ],
      answer: 0,
      why: "Sorting is smallest first by default. DESC would put the most expensive first.",
    },
    {
      question: "What does LIMIT 5 do without ORDER BY?",
      choices: [
        "Returns 5 rows, but not any particular 5",
        "Returns the 5 newest rows",
        "Returns an error",
      ],
      answer: 0,
      why: "Without ORDER BY there's no promised order, so you get 5 rows the database happened to find first.",
    },
    {
      question: "Put these in the right order: LIMIT, FROM, ORDER BY, SELECT.",
      choices: [
        "SELECT, FROM, ORDER BY, LIMIT",
        "SELECT, ORDER BY, FROM, LIMIT",
        "FROM, SELECT, LIMIT, ORDER BY",
      ],
      answer: 0,
      why: "SELECT and FROM come first, then ORDER BY, and LIMIT is always last.",
    },
  ],
};

const combiningConditions: Lesson = {
  status: "ready",
  slug: "and-or-in-like",
  number: 21,
  title: "AND, OR, IN, BETWEEN and LIKE",
  minutes: 15,
  summary: "Ask sharper questions by combining conditions and matching patterns.",
  video: { title: "Sharper questions" },
  practiceDb: bookshop,
  body: `
One condition is often not enough. "Fiction books under $13" is two conditions at once.

**AND** keeps a row only when both conditions are true. **OR** keeps it when at least one is true:

\`\`\`sql
SELECT title, genre, price
FROM books
WHERE genre = 'Fiction' AND price < 13;
\`\`\`

**NOT** flips a condition: \`WHERE NOT genre = 'Fiction'\`.

**Use brackets when you mix AND and OR.** The database does \`AND\` before \`OR\`, just like multiplication comes before addition in maths. Brackets make your meaning clear:

\`\`\`sql
WHERE (genre = 'Mystery' OR genre = 'Fantasy') AND price < 12
\`\`\`

**Shortcuts for common conditions:**

| Write | Instead of |
|---|---|
| \`genre IN ('Fantasy', 'Mystery')\` | \`genre = 'Fantasy' OR genre = 'Mystery'\` |
| \`price BETWEEN 10 AND 15\` | \`price >= 10 AND price <= 15\` (both ends included) |

**LIKE matches patterns in text.** \`%\` stands for "any characters, or none":

- \`title LIKE 'The %'\` finds titles starting with "The ".
- \`title LIKE '%Sun'\` finds titles ending in "Sun".
- \`title LIKE '%Small%'\` finds titles containing "Small" anywhere.

In this practice database, \`LIKE\` ignores the difference between capital and small letters. Some databases don't, so it's worth knowing.
`,
  keyIdeas: [
    "AND needs both conditions to be true; OR needs at least one.",
    "AND is done before OR, so use brackets when you mix them.",
    "IN lists allowed values, BETWEEN covers a range including both ends, and LIKE matches text patterns with %.",
  ],
  exercises: [
    {
      type: "sql",
      id: "cheap-fiction",
      kind: "Write a query",
      prompt: "Show the title and price of Fiction books that cost less than $13.",
      starter: "SELECT title, price\nFROM books\nWHERE ",
      answer: "SELECT title, price FROM books WHERE genre = 'Fiction' AND price < 13;",
      hint: "Join two conditions with AND: genre = 'Fiction' AND price < 13.",
      xp: 25,
    },
    {
      type: "sql",
      id: "fantasy-or-scifi",
      kind: "Write a query",
      prompt: "Show the title and genre of every book that is either Fantasy or Science fiction.",
      starter: "SELECT title, genre\nFROM books\nWHERE ",
      answer: "SELECT title, genre FROM books WHERE genre IN ('Fantasy', 'Science fiction');",
      hint: "Use genre IN ('Fantasy', 'Science fiction'), or two conditions joined with OR.",
      xp: 25,
    },
    {
      type: "sql",
      id: "brackets",
      kind: "Fix the query",
      prompt:
        "This should show Mystery or Children's books that cost less than $9. It runs, but the Mystery books it shows cost more than $9. Fix it.",
      starter: "SELECT title, genre, price\nFROM books\nWHERE genre = 'Mystery' OR genre = 'Children' AND price < 9;",
      answer: "SELECT title, genre, price FROM books WHERE (genre = 'Mystery' OR genre = 'Children') AND price < 9;",
      hint: "AND runs before OR. Put brackets around the two genre conditions.",
      xp: 30,
    },
    {
      type: "sql",
      id: "between-years",
      kind: "Write a query",
      prompt: "Show the title and published_year of books published from 1960 to 1999, including both years.",
      starter: "SELECT title, published_year\nFROM books\n",
      answer: "SELECT title, published_year FROM books WHERE published_year BETWEEN 1960 AND 1999;",
      hint: "WHERE published_year BETWEEN 1960 AND 1999.",
      xp: 25,
    },
    {
      type: "sql",
      id: "titles-with-small",
      kind: "Challenge",
      prompt: "Find the title of every book with the word “Small” anywhere in its title.",
      starter: "",
      answer: "SELECT title FROM books WHERE title LIKE '%Small%';",
      hint: "Put % on both sides: LIKE '%Small%'.",
      xp: 50,
    },
  ],
  quiz: [
    {
      question: "Which books does this return?",
      code: "SELECT title FROM books WHERE price < 10 OR stock = 0;",
      choices: [
        "Books that are under $10, plus books that are out of stock",
        "Only books that are both under $10 and out of stock",
        "No books, because a book can't be both",
      ],
      answer: 0,
      why: "OR keeps a row when at least one condition is true.",
    },
    {
      question: "Does price BETWEEN 10 AND 15 include a book that costs exactly $15?",
      choices: ["Yes", "No"],
      answer: 0,
      why: "BETWEEN includes both ends of the range.",
    },
    {
      question: "Which pattern finds titles that start with “A”?",
      choices: ["LIKE 'A%'", "LIKE '%A'", "LIKE 'A'"],
      answer: 0,
      why: "% stands for anything, so 'A%' means A followed by anything. '%A' would mean ending in A.",
    },
  ],
};

const nulls: Lesson = {
  status: "ready",
  slug: "null",
  number: 22,
  title: "Missing values: NULL",
  minutes: 12,
  summary: "Find and handle the blanks, like customers who never told us their city.",
  video: { title: "The empty box" },
  practiceDb: {
    seed: `${BOOKSHOP_SEED}
UPDATE customers SET city = NULL WHERE id IN (6, 8);
UPDATE books SET genre = NULL WHERE id = 20;`,
    showBookshopTables: true,
  },
  body: `
Real data has gaps. A customer skips the "city" box, or a new book hasn't been given a genre yet. The database marks these gaps with **NULL**, which means "unknown" or "missing".

In this lesson's practice database, two customers have no city and one book has no genre.

NULL isn't zero and it isn't empty text. It's "we don't know". That has a surprising effect: **you can't find NULL with =.**

\`\`\`sql
-- Returns nothing, even though two cities are missing!
SELECT name FROM customers WHERE city = NULL;
\`\`\`

Is an unknown city equal to unknown? The database can't say yes, so the row is left out. Use **IS NULL** and **IS NOT NULL** instead:

\`\`\`sql
SELECT name FROM customers WHERE city IS NULL;
SELECT name FROM customers WHERE city IS NOT NULL;
\`\`\`

**Anything combined with NULL is NULL.** \`NULL + 5\` is NULL, because unknown plus five is still unknown.

**Fill the gaps in results with COALESCE.** It returns the first value that isn't NULL:

\`\`\`sql
SELECT name, COALESCE(city, 'Not given') AS city
FROM customers;
\`\`\`

This only changes what you see in the result, not what's stored.
`,
  keyIdeas: [
    "NULL means unknown or missing. It isn't zero or empty text.",
    "Use IS NULL and IS NOT NULL. Comparing with = NULL never matches.",
    "COALESCE(value, fallback) shows a fallback where a value is missing.",
  ],
  exercises: [
    {
      type: "sql",
      id: "no-genre",
      kind: "Write a query",
      prompt: "Find the title of every book that has no genre yet.",
      starter: "SELECT title\nFROM books\n",
      answer: "SELECT title FROM books WHERE genre IS NULL;",
      hint: "WHERE genre IS NULL.",
      xp: 25,
    },
    {
      type: "sql",
      id: "equals-null",
      kind: "Fix the query",
      prompt: "This should list customers with no city, but it returns no rows. Fix it.",
      starter: "SELECT name\nFROM customers\nWHERE city = NULL;",
      answer: "SELECT name FROM customers WHERE city IS NULL;",
      hint: "= never matches NULL. Use IS NULL.",
      xp: 25,
    },
    {
      type: "sql",
      id: "known-city",
      kind: "Write a query",
      prompt: "Show the name and city of every customer whose city we know.",
      starter: "SELECT name, city\nFROM customers\n",
      answer: "SELECT name, city FROM customers WHERE city IS NOT NULL;",
      hint: "WHERE city IS NOT NULL.",
      xp: 25,
    },
    {
      type: "sql",
      id: "coalesce-city",
      kind: "Challenge",
      prompt: "Show every customer's name and city, with the words 'Not given' wherever the city is missing.",
      starter: "",
      answer: "SELECT name, COALESCE(city, 'Not given') AS city FROM customers;",
      hint: "COALESCE(city, 'Not given') shows the city, or 'Not given' when it's NULL.",
      xp: 50,
    },
  ],
  quiz: [
    {
      question: "Which condition finds rows where the phone number is missing?",
      choices: ["phone IS NULL", "phone = NULL", "phone = 0"],
      answer: 0,
      why: "Only IS NULL finds missing values. = NULL never matches, and 0 is a real value.",
    },
    {
      question: "What is NULL + 5?",
      choices: ["5", "NULL", "An error"],
      answer: 1,
      why: "Unknown plus five is still unknown, so the answer is NULL.",
    },
    {
      question: "A customer's city is NULL. What does COALESCE(city, 'Unknown') show?",
      choices: ["NULL", "Unknown", "An empty space"],
      answer: 1,
      why: "COALESCE returns the first value that isn't NULL, which is the fallback here.",
    },
  ],
};

const aggregates: Lesson = {
  status: "ready",
  slug: "aggregates",
  number: 23,
  title: "Counting and totals",
  minutes: 14,
  summary: "Turn many rows into one answer: how many, how much, the cheapest and the dearest.",
  video: { title: "From rows to answers" },
  practiceDb: bookshop,
  body: `
So far each query has returned rows. Often you want a single answer instead: "How many books do we sell?" or "What's our average price?" **Aggregate functions** squash many rows into one value.

| Function | Gives you |
|---|---|
| \`COUNT(*)\` | how many rows |
| \`SUM(stock)\` | the total of a column |
| \`AVG(price)\` | the average |
| \`MIN(price)\` and \`MAX(price)\` | the smallest and largest |

\`\`\`sql
SELECT COUNT(*) AS books, AVG(price) AS average_price
FROM books;
\`\`\`

**Combine with WHERE** to summarise only some rows. The filter happens first, then the counting:

\`\`\`sql
SELECT COUNT(*) FROM books WHERE stock = 0;
\`\`\`

**Do sums inside.** \`SUM(price * stock)\` is the value of everything on the shelves.

**Two handy details:**

- \`COUNT(*)\` counts rows. \`COUNT(city)\` counts only rows where city isn't NULL.
- \`COUNT(DISTINCT genre)\` counts different values, so 6 rather than 20.

Long decimals look messy. \`ROUND(AVG(price), 2)\` rounds to two decimal places.
`,
  keyIdeas: [
    "COUNT, SUM, AVG, MIN and MAX turn many rows into one value.",
    "WHERE filters the rows first, then the function summarises what's left.",
    "COUNT(*) counts rows; COUNT(column) skips NULLs; COUNT(DISTINCT column) counts different values.",
  ],
  exercises: [
    {
      type: "sql",
      id: "count-books",
      kind: "Write a query",
      prompt: "How many books are in the books table?",
      starter: "SELECT \nFROM books;",
      answer: "SELECT COUNT(*) FROM books;",
      hint: "COUNT(*) counts rows.",
      xp: 20,
    },
    {
      type: "sql",
      id: "min-max-price",
      kind: "Write a query",
      prompt: "Show the cheapest and the most expensive book price, in that order, in one query.",
      starter: "SELECT \nFROM books;",
      answer: "SELECT MIN(price), MAX(price) FROM books;",
      ordered: true,
      hint: "SELECT MIN(price), MAX(price).",
      xp: 25,
    },
    {
      type: "sql",
      id: "fantasy-stock",
      kind: "Fix the query",
      prompt: "This should total the copies of Fantasy books in stock, but it returns an error. Fix it.",
      starter: "SELECT SUM(stock)\nFROM books\nWHERE genre = Fantasy;",
      answer: "SELECT SUM(stock) FROM books WHERE genre = 'Fantasy';",
      hint: "Fantasy is text, so it needs single quotes.",
      xp: 25,
    },
    {
      type: "sql",
      id: "delivered-orders",
      kind: "Write a query",
      prompt: "How many orders have the status 'delivered'?",
      starter: "",
      answer: "SELECT COUNT(*) FROM orders WHERE status = 'delivered';",
      hint: "COUNT(*) with WHERE status = 'delivered'.",
      xp: 25,
    },
    {
      type: "sql",
      id: "shelf-value",
      kind: "Challenge",
      prompt: "What is the total value of all the books on the shelves? Multiply each book's price by its stock, then add it all up.",
      starter: "",
      answer: "SELECT SUM(price * stock) FROM books;",
      hint: "Put the multiplication inside SUM: SUM(price * stock). Don't round it.",
      xp: 50,
    },
  ],
  quiz: [
    {
      question: "How many rows does SELECT AVG(price) FROM books; return?",
      choices: ["1", "20", "It depends on the prices"],
      answer: 0,
      why: "An aggregate turns all the rows into one value, so you get one row.",
    },
    {
      question: "Two of eight customers have no city. What does COUNT(city) return?",
      choices: ["8", "6", "2"],
      answer: 1,
      why: "COUNT(column) skips NULLs. COUNT(*) would return 8.",
    },
    {
      question: "Which comes first when this runs?",
      code: "SELECT SUM(stock) FROM books WHERE genre = 'Children';",
      choices: [
        "Keep the Children's books, then add up their stock",
        "Add up all stock, then keep the Children's books",
      ],
      answer: 0,
      why: "WHERE filters the rows first, then SUM adds up what's left.",
    },
  ],
};

const groupBy: Lesson = {
  status: "ready",
  slug: "group-by",
  number: 24,
  title: "GROUP BY and HAVING",
  minutes: 15,
  summary: "Get a subtotal for every group, like the number of books in each genre.",
  video: { title: "Sorting into piles" },
  practiceDb: bookshop,
  body: `
\`COUNT(*)\` gives one total. But what if you want a count for **each** genre? That's \`GROUP BY\`.

Picture tipping all the books onto a table and sorting them into piles, one pile per genre. Then you count each pile.

\`\`\`sql
SELECT genre, COUNT(*) AS books
FROM books
GROUP BY genre;
\`\`\`

You get one row per pile: Children 3, Fantasy 3, Fiction 8, and so on. Any aggregate works the same way: \`SUM(stock)\` per genre, \`AVG(price)\` per genre.

**The golden rule:** every column in \`SELECT\` should either be in \`GROUP BY\` or be inside an aggregate. A pile of Fiction books has one genre but many titles, so "the title of the Fiction pile" makes no sense.

**Filter the piles with HAVING.** \`WHERE\` can't use \`COUNT(*)\`, because \`WHERE\` checks rows *before* the piles exist. \`HAVING\` checks the piles *after*:

\`\`\`sql
SELECT genre, COUNT(*) AS books
FROM books
GROUP BY genre
HAVING COUNT(*) > 2;
\`\`\`

The full order is now: \`SELECT\`, \`FROM\`, \`WHERE\`, \`GROUP BY\`, \`HAVING\`, \`ORDER BY\`, \`LIMIT\`.
`,
  keyIdeas: [
    "GROUP BY sorts rows into piles and gives one result row per pile.",
    "Columns in SELECT must be grouped or inside an aggregate.",
    "WHERE filters rows before grouping; HAVING filters groups after.",
  ],
  exercises: [
    {
      type: "sql",
      id: "books-per-genre",
      kind: "Write a query",
      prompt: "Show each genre and how many books it has.",
      starter: "SELECT genre, COUNT(*)\nFROM books\n",
      answer: "SELECT genre, COUNT(*) FROM books GROUP BY genre;",
      hint: "Add GROUP BY genre at the end.",
      xp: 25,
    },
    {
      type: "sql",
      id: "stock-per-genre",
      kind: "Write a query",
      prompt: "Show each genre and the total number of copies in stock for that genre.",
      starter: "",
      answer: "SELECT genre, SUM(stock) FROM books GROUP BY genre;",
      hint: "SELECT genre, SUM(stock) ... GROUP BY genre.",
      xp: 25,
    },
    {
      type: "sql",
      id: "where-vs-having",
      kind: "Fix the query",
      prompt: "This should show genres with more than 2 books, but it returns an error. Fix it.",
      starter: "SELECT genre, COUNT(*)\nFROM books\nWHERE COUNT(*) > 2\nGROUP BY genre;",
      answer: "SELECT genre, COUNT(*) FROM books GROUP BY genre HAVING COUNT(*) > 2;",
      hint: "Conditions on COUNT(*) go in HAVING, after GROUP BY.",
      xp: 30,
    },
    {
      type: "sql",
      id: "repeat-customers",
      kind: "Challenge",
      prompt: "Which customers have placed more than one order? Show each customer_id and their number of orders.",
      starter: "",
      answer: "SELECT customer_id, COUNT(*) FROM orders GROUP BY customer_id HAVING COUNT(*) > 1;",
      hint: "Group the orders by customer_id, then keep groups with HAVING COUNT(*) > 1.",
      xp: 50,
    },
  ],
  quiz: [
    {
      question: "How many rows does this return?",
      code: "SELECT status, COUNT(*) FROM orders GROUP BY status;",
      choices: ["10", "4", "1"],
      answer: 1,
      why: "One row per status: delivered, shipped, pending and cancelled.",
    },
    {
      question: "You want genres whose average price is over $12. Where does the condition go?",
      choices: ["HAVING AVG(price) > 12", "WHERE AVG(price) > 12", "GROUP BY AVG(price) > 12"],
      answer: 0,
      why: "The average only exists once the piles are made, so the condition goes in HAVING.",
    },
    {
      question: "Why does SELECT genre, title, COUNT(*) FROM books GROUP BY genre; not make sense?",
      choices: [
        "Each genre pile has many titles, so there's no single title to show",
        "COUNT(*) can't be used with GROUP BY",
        "genre must come last",
      ],
      answer: 0,
      why: "Every column must be grouped or inside an aggregate. Title is neither.",
    },
  ],
};

export const module4Lessons: Lesson[] = [select, orderByAndLimit, whereLesson, combiningConditions, nulls, aggregates, groupBy];
