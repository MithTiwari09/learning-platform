import type { Lesson } from "../../types";
import { BOOKSHOP_SEED } from "../../datasets/bookshop";

/** Module 5: combining tables. */

const bookshop = { seed: BOOKSHOP_SEED, showBookshopTables: true };

/** The bookshop plus an author with no books and a customer with no orders, for LEFT JOIN. */
const bookshopWithGaps = {
  seed: `${BOOKSHOP_SEED}
INSERT INTO authors VALUES (11, 'Jane Austen', 'UK');
INSERT INTO customers VALUES (9, 'Mateo García', 'Madrid', 'Spain', '2025-09-10');`,
  showBookshopTables: true,
};

const whySeveralTables: Lesson = {
  status: "ready",
  slug: "why-several-tables",
  number: 25,
  title: "Why data lives in several tables",
  minutes: 10,
  summary: "Why the bookshop keeps authors and books apart, and how keys connect them again.",
  video: {
    title: "One fact, one place",
    src: "/videos/sql-25-why-several-tables.mp4",
    poster: "/videos/sql-25-why-several-tables.jpg",
  },
  practiceDb: bookshop,
  body: `
Imagine keeping the whole bookshop in one big table, with the author's name and country typed out next to every book. Terry Pratchett would be written out twice, Ursula K. Le Guin three times.

That causes real trouble:

- **Wasted effort.** The same details are typed again and again.
- **Mistakes creep in.** One row says "Le Guin", another "LeGuin". Are they the same person?
- **Changes are risky.** If an author's country changes, you have to find and fix every copy. Miss one and your data disagrees with itself.

So the bookshop follows a simple rule: **one fact, one place.** Each author is written down once, in the authors table. Each book just points to its author with \`author_id\`, the foreign key you met in Module 2.

| books.title | books.author_id | | authors.id | authors.name |
|---|---|---|---|---|
| Small Gods | 4 | → | 4 | Terry Pratchett |

The cost is that one question can now need two tables. "Who wrote Small Gods?" means finding the book's \`author_id\`, then looking up that id in authors. Try it in two steps below. In the next lesson, \`JOIN\` will do both steps in one query.
`,
  keyIdeas: [
    "Keep each fact in one place, so it's typed once and changed once.",
    "Tables point to each other with keys: books.author_id matches authors.id.",
    "Answering a question can then mean looking in more than one table. JOIN does that for you.",
  ],
  exercises: [
    {
      type: "sort",
      id: "which-table",
      prompt: "In the bookshop, which table does each fact belong in?",
      groups: ["authors", "books", "customers", "orders"],
      items: [
        { text: "Haruki Murakami is from Japan", group: "authors" },
        { text: "Sapiens costs $18.99", group: "books" },
        { text: "Yuki Tanaka lives in Tokyo", group: "customers" },
        { text: "Order 6 was shipped", group: "orders" },
        { text: "Small Gods has 0 copies left", group: "books" },
        { text: "Order 9 was placed on 20 August 2025", group: "orders" },
      ],
      hint: "Ask what the fact is about: a writer, a book, a shopper or a purchase.",
      xp: 20,
    },
    {
      type: "sql",
      id: "find-author-id",
      kind: "Write a query",
      prompt: "Step 1: find the author_id of the book 'Norwegian Wood'.",
      starter: "SELECT author_id\nFROM books\n",
      answer: "SELECT author_id FROM books WHERE title = 'Norwegian Wood';",
      hint: "WHERE title = 'Norwegian Wood'.",
      xp: 20,
    },
    {
      type: "sql",
      id: "look-up-author",
      kind: "Write a query",
      prompt: "Step 2: Norwegian Wood's author_id is 3. Show the name and country of author 3.",
      starter: "SELECT name, country\nFROM authors\n",
      answer: "SELECT name, country FROM authors WHERE id = 3;",
      hint: "WHERE id = 3.",
      xp: 20,
    },
  ],
  quiz: [
    {
      question: "Why does the books table store author_id instead of the author's name?",
      choices: [
        "So each author's details are written in one place only",
        "Because names can't be stored in the books table",
        "To make the books table load faster",
      ],
      answer: 0,
      why: "Pointing to the author by id means their details live once, in authors, and are changed once.",
    },
    {
      question: "An author's country is typed next to all 3 of their books, and you update only one row. What's the problem?",
      choices: ["Nothing", "The data now disagrees with itself", "The other rows update automatically"],
      answer: 1,
      why: "Copies drift apart when you forget one. That's what one fact, one place prevents.",
    },
    {
      question: "Which pair of columns connects books to authors?",
      choices: ["books.author_id and authors.id", "books.id and authors.id", "books.title and authors.name"],
      answer: 0,
      why: "author_id is the foreign key in books, and it matches the primary key id in authors.",
    },
  ],
};

const innerJoin: Lesson = {
  status: "ready",
  slug: "inner-join",
  number: 26,
  title: "INNER JOIN",
  minutes: 15,
  summary: "Put two tables side by side, like each book next to its author's name.",
  video: { title: "Matching rows across tables" },
  practiceDb: bookshop,
  body: `
\`JOIN\` puts rows from two tables side by side, matching them up with the keys:

\`\`\`sql
SELECT books.title, authors.name
FROM books
JOIN authors ON books.author_id = authors.id;
\`\`\`

Reading it out loud: "Take books, and next to each book put the author whose id equals the book's author_id."

- **ON** says how rows match. It's almost always "foreign key = primary key".
- Write \`table.column\` when both tables have a column with the same name. Both tables here have \`id\`, so a bare \`id\` would confuse the database.
- \`JOIN\` is short for \`INNER JOIN\`. "Inner" means only rows with a match on both sides are kept.

**Short names save typing.** Give each table a nickname after its name:

\`\`\`sql
SELECT b.title, a.name, a.country
FROM books b
JOIN authors a ON b.author_id = a.id
WHERE a.country = 'Japan';
\`\`\`

Everything you've learned still works after the join: \`WHERE\`, \`ORDER BY\`, \`GROUP BY\` and the rest.

**Forgetting ON is a classic mistake.** Without it, the database pairs every book with every author: 20 × 10 = 200 rows of nonsense.
`,
  keyIdeas: [
    "JOIN ... ON puts matching rows from two tables side by side.",
    "ON is usually foreign key = primary key, such as books.author_id = authors.id.",
    "Use table.column (or short nicknames) when both tables have a column with the same name.",
  ],
  exercises: [
    {
      type: "sql",
      id: "books-with-authors",
      kind: "Write a query",
      prompt: "Show every book's title next to its author's name.",
      starter: "SELECT books.title, authors.name\nFROM books\nJOIN authors ON ",
      answer: "SELECT books.title, authors.name FROM books JOIN authors ON books.author_id = authors.id;",
      hint: "Finish the ON part: books.author_id = authors.id.",
      xp: 25,
    },
    {
      type: "sql",
      id: "orders-with-customers",
      kind: "Write a query",
      prompt: "Show each order's id, its status and the name of the customer who placed it.",
      starter: "",
      answer:
        "SELECT orders.id, orders.status, customers.name FROM orders JOIN customers ON orders.customer_id = customers.id;",
      hint: "JOIN customers ON orders.customer_id = customers.id.",
      xp: 25,
    },
    {
      type: "sql",
      id: "missing-on",
      kind: "Fix the query",
      prompt: "This should show each book's title with its author's name, but it returns 200 rows. Fix it.",
      starter: "SELECT title, name\nFROM books\nJOIN authors;",
      answer: "SELECT title, name FROM books JOIN authors ON books.author_id = authors.id;",
      hint: "Without ON, every book is paired with every author. Add ON books.author_id = authors.id.",
      xp: 30,
    },
    {
      type: "sql",
      id: "ambiguous-id",
      kind: "Fix the query",
      prompt: "This returns the error “ambiguous column name”. Fix it so it shows each book's id, title and author name.",
      starter: "SELECT id, title, name\nFROM books\nJOIN authors ON author_id = id;",
      answer: "SELECT books.id, title, name FROM books JOIN authors ON books.author_id = authors.id;",
      hint: "Both tables have an id column. Write books.id and authors.id so the database knows which you mean.",
      xp: 30,
    },
    {
      type: "sql",
      id: "uk-books",
      kind: "Challenge",
      prompt: "Show the title of every book written by an author from the UK.",
      starter: "",
      answer: "SELECT b.title FROM books b JOIN authors a ON b.author_id = a.id WHERE a.country = 'UK';",
      hint: "Join books to authors, then add WHERE on the author's country.",
      xp: 50,
    },
  ],
  quiz: [
    {
      question: "What does ON tell the database?",
      choices: ["How rows in the two tables match up", "Which columns to show", "How to sort the result"],
      answer: 0,
      why: "ON is the matching rule, usually foreign key = primary key.",
    },
    {
      question: "Why write books.id instead of id after joining books and authors?",
      choices: [
        "Both tables have an id column, so the database needs to know which one",
        "It makes the query faster",
        "id is a reserved word",
      ],
      answer: 0,
      why: "With two id columns in play, a bare id is ambiguous.",
    },
    {
      question: "A book's author_id is 99, and there's no author 99. Does an INNER JOIN show that book?",
      choices: ["No", "Yes, with a blank author name"],
      answer: 0,
      why: "INNER JOIN keeps only rows with a match on both sides. The next lesson's LEFT JOIN would keep it.",
    },
  ],
};

const leftJoin: Lesson = {
  status: "ready",
  slug: "left-join",
  number: 27,
  title: "LEFT JOIN",
  minutes: 15,
  summary: "Keep every row from one table, even when it has no match, and find what's missing.",
  video: { title: "Who's left out?" },
  practiceDb: bookshopWithGaps,
  body: `
In this lesson's practice database, two new rows have arrived. Jane Austen has joined as an author, but none of her books are listed yet. Mateo García from Madrid has signed up, but hasn't ordered anything.

An ordinary \`JOIN\` leaves both of them out, because they have nothing to match. Often that's exactly the information you want: which authors have no books listed, and which customers have never ordered?

**LEFT JOIN keeps every row from the first (left) table**, matched or not. Where there's no match, the other table's columns are filled with NULL:

\`\`\`sql
SELECT authors.name, books.title
FROM authors
LEFT JOIN books ON books.author_id = authors.id;
\`\`\`

Jane Austen appears once, with NULL as the title.

**Find what's missing** by keeping only those NULL rows:

\`\`\`sql
SELECT authors.name
FROM authors
LEFT JOIN books ON books.author_id = authors.id
WHERE books.id IS NULL;
\`\`\`

The order of the tables matters. The table that must keep every row goes first, straight after \`FROM\`.

**Counting with zero.** \`COUNT(books.id)\` counts only real matches, so an author with no books counts 0. \`COUNT(*)\` would count the NULL row and say 1.
`,
  keyIdeas: [
    "LEFT JOIN keeps every row from the first table, even with no match.",
    "Missing matches show up as NULL, so WHERE other.id IS NULL finds what's missing.",
    "Put the table that must keep all its rows first. Count with COUNT(other.id) to get 0 for no matches.",
  ],
  exercises: [
    {
      type: "sql",
      id: "all-authors-books",
      kind: "Write a query",
      prompt: "Show every author's name and the titles of their books. Authors with no books must still appear.",
      starter: "SELECT authors.name, books.title\nFROM authors\n",
      answer: "SELECT authors.name, books.title FROM authors LEFT JOIN books ON books.author_id = authors.id;",
      hint: "LEFT JOIN books ON books.author_id = authors.id.",
      xp: 25,
    },
    {
      type: "sql",
      id: "include-mateo",
      kind: "Fix the query",
      prompt: "This should list every customer with their order ids, but Mateo García is missing. Fix it.",
      starter: "SELECT customers.name, orders.id\nFROM customers\nJOIN orders ON orders.customer_id = customers.id;",
      answer: "SELECT customers.name, orders.id FROM customers LEFT JOIN orders ON orders.customer_id = customers.id;",
      hint: "An ordinary JOIN drops customers with no orders. Use LEFT JOIN.",
      xp: 30,
    },
    {
      type: "sql",
      id: "authors-without-books",
      kind: "Write a query",
      prompt: "Find the name of every author who has no books listed.",
      starter: "SELECT authors.name\nFROM authors\nLEFT JOIN books ON books.author_id = authors.id\n",
      answer: "SELECT authors.name FROM authors LEFT JOIN books ON books.author_id = authors.id WHERE books.id IS NULL;",
      hint: "Keep only the rows with no match: WHERE books.id IS NULL.",
      xp: 25,
    },
    {
      type: "sql",
      id: "never-ordered",
      kind: "Challenge",
      prompt: "Which customers have never placed an order? Show their names.",
      starter: "",
      answer:
        "SELECT customers.name FROM customers LEFT JOIN orders ON orders.customer_id = customers.id WHERE orders.id IS NULL;",
      hint: "Start FROM customers, LEFT JOIN orders, then keep rows where orders.id IS NULL.",
      xp: 50,
    },
    {
      type: "sql",
      id: "books-per-author",
      kind: "Challenge",
      prompt: "Show every author's name and how many books they have listed, including 0 for authors with none.",
      starter: "",
      answer:
        "SELECT authors.name, COUNT(books.id) FROM authors LEFT JOIN books ON books.author_id = authors.id GROUP BY authors.id;",
      hint: "LEFT JOIN, then GROUP BY authors.id and count COUNT(books.id), not COUNT(*).",
      xp: 50,
    },
  ],
  quiz: [
    {
      question: "In FROM authors LEFT JOIN books, which table keeps all its rows?",
      choices: ["authors", "books", "Both"],
      answer: 0,
      why: "The left table, the one straight after FROM, keeps every row.",
    },
    {
      question: "What does an author with no books show in the title column after a LEFT JOIN?",
      choices: ["NULL", "An empty text ''", "The row is left out"],
      answer: 0,
      why: "Where there's no match, the other table's columns are filled with NULL.",
    },
    {
      question: "An author has no books. What does COUNT(*) give for them after a LEFT JOIN and GROUP BY?",
      choices: ["0", "1"],
      answer: 1,
      why: "COUNT(*) counts the one row with NULLs. COUNT(books.id) skips NULLs and gives 0.",
    },
  ],
};

const subqueriesAndCase: Lesson = {
  status: "ready",
  slug: "subqueries-and-case",
  number: 28,
  title: "Subqueries and CASE WHEN",
  minutes: 15,
  summary: "Use one query's answer inside another, and label rows with your own categories.",
  video: { title: "Questions inside questions" },
  practiceDb: bookshop,
  body: `
**A subquery is a query inside brackets** whose answer is used by the outer query.

"Which books cost more than average?" needs the average first. You can't write \`WHERE price > AVG(price)\`, because \`WHERE\` checks one row at a time. A subquery works it out first:

\`\`\`sql
SELECT title, price
FROM books
WHERE price > (SELECT AVG(price) FROM books);
\`\`\`

The database runs the inner query, gets one number, and then uses it like any other value.

**A subquery can return a list** for \`IN\`:

\`\`\`sql
SELECT title
FROM books
WHERE author_id IN (SELECT id FROM authors WHERE country = 'Nigeria');
\`\`\`

**CASE WHEN labels rows with your own categories.** It checks each condition in turn and uses the first one that's true:

\`\`\`sql
SELECT title, price,
  CASE
    WHEN price < 10 THEN 'Budget'
    WHEN price < 15 THEN 'Standard'
    ELSE 'Premium'
  END AS price_band
FROM books;
\`\`\`

A $12 book isn't under 10, but it is under 15, so it's 'Standard'. \`ELSE\` catches everything left. Always finish with \`END\`.
`,
  keyIdeas: [
    "A subquery in brackets runs first, and its answer is used by the outer query.",
    "Use a one-value subquery with > or =, and a list subquery with IN.",
    "CASE WHEN ... THEN ... ELSE ... END labels rows; the first true condition wins.",
  ],
  exercises: [
    {
      type: "sql",
      id: "above-average",
      kind: "Write a query",
      prompt: "Show the title and price of every book that costs more than the average book price.",
      starter: "SELECT title, price\nFROM books\nWHERE price > ",
      answer: "SELECT title, price FROM books WHERE price > (SELECT AVG(price) FROM books);",
      hint: "Finish with (SELECT AVG(price) FROM books).",
      xp: 25,
    },
    {
      type: "sql",
      id: "most-expensive",
      kind: "Fix the query",
      prompt: "This should show the most expensive book, but it returns an error. Fix it with a subquery.",
      starter: "SELECT title, price\nFROM books\nWHERE price = MAX(price);",
      answer: "SELECT title, price FROM books WHERE price = (SELECT MAX(price) FROM books);",
      hint: "WHERE can't use MAX directly. Use = (SELECT MAX(price) FROM books).",
      xp: 30,
    },
    {
      type: "sql",
      id: "japanese-authors-books",
      kind: "Write a query",
      prompt: "Using a subquery with IN, show the titles of books written by authors from Japan.",
      starter: "SELECT title\nFROM books\nWHERE author_id IN ",
      answer: "SELECT title FROM books WHERE author_id IN (SELECT id FROM authors WHERE country = 'Japan');",
      hint: "IN (SELECT id FROM authors WHERE country = 'Japan').",
      xp: 25,
    },
    {
      type: "sql",
      id: "stock-label",
      kind: "Challenge",
      prompt:
        "Show each book's title and a stock label: 'Out of stock' when stock is 0, 'Low' when it's under 10, and 'In stock' otherwise.",
      starter: "",
      answer:
        "SELECT title, CASE WHEN stock = 0 THEN 'Out of stock' WHEN stock < 10 THEN 'Low' ELSE 'In stock' END AS stock_label FROM books;",
      hint: "CASE WHEN stock = 0 THEN 'Out of stock' WHEN stock < 10 THEN 'Low' ELSE 'In stock' END.",
      xp: 50,
    },
  ],
  quiz: [
    {
      question: "In this query, what runs first?",
      code: "SELECT title FROM books WHERE price > (SELECT AVG(price) FROM books);",
      choices: ["The query in brackets", "The outer SELECT"],
      answer: 0,
      why: "The subquery works out the average, and the outer query then compares each price with it.",
    },
    {
      question: "A book costs $8. Which label does it get?",
      code: "CASE WHEN price < 10 THEN 'Budget' WHEN price < 15 THEN 'Standard' ELSE 'Premium' END",
      choices: ["Budget", "Standard", "Both"],
      answer: 0,
      why: "$8 matches both conditions, but the first true condition wins.",
    },
    {
      question: "Which needs a subquery that returns a list?",
      choices: ["WHERE author_id IN (...)", "WHERE price > (...)", "WHERE price = (...)"],
      answer: 0,
      why: "IN checks against a list of values. > and = compare with a single value.",
    },
  ],
};

const orderOfExecution: Lesson = {
  status: "ready",
  slug: "order-of-execution",
  number: 29,
  title: "The order SQL runs your query",
  minutes: 18,
  summary: "Why SQL runs FROM first and SELECT fifth, and the surprises that explains.",
  video: {
    title: "Packing an order in a warehouse",
    src: "/videos/sql-29-order-of-execution.mp4",
    poster: "/videos/sql-29-order-of-execution.jpg",
  },
  practiceDb: bookshop,
  body: `
You write a query top to bottom: \`SELECT\` first, then \`FROM\`, then \`WHERE\`, and so on. But the database doesn't run it in that order. It runs it in the order that makes sense for building the answer.

### Think of a warehouse packing orders

Imagine a warehouse worker making up a delivery of books.

1. **FROM / JOIN:** go to the right shelves and pull everything off (and if you need two shelves, put their items side by side).
2. **WHERE:** throw out every item that doesn't match the order slip.
3. **GROUP BY:** sort what's left into boxes, one box per group.
4. **HAVING:** throw out whole boxes that don't qualify.
5. **SELECT:** write the label for each item or box: which details to show, and any calculations.
6. **DISTINCT:** remove any labels that are exact duplicates.
7. **ORDER BY:** line everything up in the right order.
8. **LIMIT:** take only the first few off the front of the line.

| You write it in this order | The database runs it in this order |
|---|---|
| SELECT | 1. FROM and JOIN |
| DISTINCT | 2. WHERE |
| FROM and JOIN | 3. GROUP BY |
| WHERE | 4. HAVING |
| GROUP BY | 5. SELECT |
| HAVING | 6. DISTINCT |
| ORDER BY | 7. ORDER BY |
| LIMIT | 8. LIMIT |

The one to remember: **SELECT runs fifth, not first.** Almost every surprise below comes from that.

### Scenario 1: a simple query

\`\`\`sql
SELECT title
FROM books
WHERE genre = 'Fantasy';
\`\`\`

FROM fetches all 20 books. WHERE keeps the 3 Fantasy ones. SELECT keeps just the title. Result: *Guards! Guards!*, *Small Gods*, *A Wizard of Earthsea*.

### Scenario 2: a nickname (alias) in ORDER BY works

\`\`\`sql
SELECT title, price * 0.9 AS sale_price
FROM books
ORDER BY sale_price
LIMIT 3;
\`\`\`

SELECT (step 5) creates the nickname \`sale_price\`. ORDER BY (step 7) runs later, so the nickname already exists. Result: *The Blue Umbrella*, *Swami and Friends*, *Malgudi Days*.

### Scenario 3: a nickname in WHERE usually fails

\`\`\`sql
SELECT title, price * 0.9 AS sale_price
FROM books
WHERE sale_price < 9;
\`\`\`

WHERE is step 2. SELECT, which creates \`sale_price\`, hasn't run yet. In PostgreSQL, SQL Server and Oracle this is an error ("column sale_price does not exist"). **Note:** SQLite, which runs this course's practice boxes, and MySQL are lenient and allow it, so it will work here. Don't rely on it at work. Repeat the calculation instead: \`WHERE price * 0.9 < 9\`.

### Scenario 4: a total in WHERE always fails

\`\`\`sql
SELECT genre, COUNT(*)
FROM books
WHERE COUNT(*) > 2
GROUP BY genre;
\`\`\`

Error: *misuse of aggregate: COUNT()*. WHERE (step 2) looks at one row at a time. Counting needs groups, and groups don't exist until GROUP BY (step 3). Filtering on a count is HAVING's job.

### Scenario 5: WHERE and HAVING together

\`\`\`sql
SELECT genre, COUNT(*) AS cheap_books
FROM books
WHERE price < 15
GROUP BY genre
HAVING COUNT(*) >= 3
ORDER BY cheap_books DESC;
\`\`\`

1. FROM: all 20 books.
2. WHERE: keep books under $15 (17 books).
3. GROUP BY: one box per genre (6 boxes).
4. HAVING: keep boxes with 3 or more books (3 boxes).
5. SELECT: show the genre and the count.
6. ORDER BY: biggest count first.

Result: Fiction 6, then Children 3 and Fantasy 3.

**WHERE filters rows before grouping. HAVING filters groups after grouping.**

### Scenario 6: JOIN happens first

\`\`\`sql
SELECT a.name, COUNT(*) AS books
FROM books b
JOIN authors a ON a.id = b.author_id
WHERE b.price < 15
GROUP BY a.name
HAVING COUNT(*) >= 2
ORDER BY books DESC, a.name
LIMIT 3;
\`\`\`

The JOIN is part of step 1: the two tables are joined into one wide table *before* anything else happens. That's why WHERE can use columns from both tables. Result: Ruskin Bond 3, Ursula K. Le Guin 3, Agatha Christie 2.

### Scenario 7: the LEFT JOIN trap, ON versus WHERE

Every author, with their Fantasy books if they have any:

\`\`\`sql
SELECT a.name, b.title
FROM authors a
LEFT JOIN books b ON b.author_id = a.id AND b.genre = 'Fantasy';
\`\`\`

This returns all 10 authors. Those without Fantasy books show an empty title.

Move the genre check to WHERE, and the result changes:

\`\`\`sql
SELECT a.name, b.title
FROM authors a
LEFT JOIN books b ON b.author_id = a.id
WHERE b.genre = 'Fantasy';
\`\`\`

Only 3 rows come back, and the authors without Fantasy books disappear. The LEFT JOIN (step 1) kept every author, but then WHERE (step 2) threw away the rows with an empty genre. **A condition in ON shapes the join. A condition in WHERE filters afterwards.**

### Scenario 8: DISTINCT comes after SELECT

\`\`\`sql
SELECT DISTINCT genre
FROM books
ORDER BY genre;
\`\`\`

SELECT picks out the genre from all 20 rows (with repeats). DISTINCT then removes the duplicates, leaving 6. ORDER BY sorts them A to Z.

### Scenario 9: LIMIT is always last

\`\`\`sql
SELECT title, price
FROM books
ORDER BY price
LIMIT 3;
\`\`\`

ORDER BY sorts all 20 books first, and only then does LIMIT take the top 3. So you really do get the 3 cheapest, not 3 random books sorted. Result: *The Blue Umbrella* $7.99, *Swami and Friends* $7.99, *Malgudi Days* $8.49.

### Scenario 10: a subquery runs as its own query first

\`\`\`sql
SELECT title, price
FROM books
WHERE price > (SELECT AVG(price) FROM books)
ORDER BY price DESC;
\`\`\`

The query inside the brackets is a complete query of its own, with its own FROM and SELECT. It works out the average price ($12.39) first. Then the outer query runs in the normal order, using that number in its WHERE. Result: 11 books, from *Sapiens* at $18.99 down to *Small Gods* at $12.49.

### A note on the planner

This is the *logical* order: the order the database promises your results will behave as if it followed. Behind the scenes, the planner from lesson 4 may take shortcuts, like using an index. It will never change the answer.
`,
  keyIdeas: [
    "The database runs a query in this order: FROM and JOIN, WHERE, GROUP BY, HAVING, SELECT, DISTINCT, ORDER BY, LIMIT.",
    "SELECT runs fifth, so nicknames made in SELECT work in ORDER BY but not in WHERE (in most databases).",
    "WHERE filters rows before grouping. HAVING filters groups after grouping, so totals like COUNT belong in HAVING.",
  ],
  exercises: [
    {
      type: "order",
      id: "run-order",
      prompt: "Put the parts of a query in the order the database runs them.",
      steps: ["FROM and JOIN", "WHERE", "GROUP BY", "HAVING", "SELECT", "DISTINCT", "ORDER BY", "LIMIT"],
      hint: "Think of the warehouse: shelves, throw out, boxes, drop boxes, labels, duplicates, line up, take a few.",
      xp: 20,
    },
    {
      type: "sort",
      id: "which-step",
      prompt: "Which part of the query does each job?",
      groups: ["FROM and JOIN", "WHERE", "HAVING", "DISTINCT", "LIMIT"],
      items: [
        { text: "Put books and authors side by side", group: "FROM and JOIN" },
        { text: "Keep only books under $10", group: "WHERE" },
        { text: "Keep only genres with 3 or more books", group: "HAVING" },
        { text: "Remove repeated genres", group: "DISTINCT" },
        { text: "Show only the first 5 results", group: "LIMIT" },
      ],
      hint: "WHERE works on single rows. HAVING works on whole groups.",
      xp: 20,
    },
    {
      type: "sql",
      id: "fix-count-in-where",
      kind: "Fix the query",
      prompt: "This query should show each genre with 3 or more books, but it fails. Fix it.",
      starter: "SELECT genre, COUNT(*)\nFROM books\nWHERE COUNT(*) >= 3\nGROUP BY genre;",
      answer: "SELECT genre, COUNT(*) FROM books GROUP BY genre HAVING COUNT(*) >= 3;",
      hint: "Totals can't be checked in WHERE, because groups don't exist yet. Use HAVING after GROUP BY.",
      xp: 25,
    },
    {
      type: "sql",
      id: "cheap-genres",
      kind: "Write a query",
      prompt:
        "For each genre, count the books under $15. Keep only genres with at least 2 such books, and show the biggest count first. Show the genre and the count.",
      starter: "SELECT genre, COUNT(*) AS cheap_books\nFROM books\n",
      answer:
        "SELECT genre, COUNT(*) AS cheap_books FROM books WHERE price < 15 GROUP BY genre HAVING COUNT(*) >= 2 ORDER BY cheap_books DESC, genre;",
      hint: "WHERE price < 15, then GROUP BY genre, then HAVING COUNT(*) >= 2, then ORDER BY.",
      xp: 30,
    },
  ],
  quiz: [
    {
      question: "Which part of a query runs first?",
      choices: ["FROM", "SELECT", "ORDER BY"],
      answer: 0,
      why: "The database must fetch the rows before it can do anything with them.",
    },
    {
      question: "Why can't WHERE use COUNT(*)?",
      choices: [
        "Because the groups don't exist yet when WHERE runs",
        "Because COUNT only works in SELECT",
        "Because WHERE only works on text",
      ],
      answer: 0,
      why: "WHERE is step 2. Groups are only made at step 3, by GROUP BY.",
    },
    {
      question: "You ask for the 3 cheapest books with ORDER BY price LIMIT 3. What happens first?",
      choices: [
        "ORDER BY sorts all the books, then LIMIT takes 3",
        "LIMIT takes 3 books, then ORDER BY sorts them",
        "They happen at the same time",
      ],
      answer: 0,
      why: "LIMIT always runs last, so it takes the top of an already sorted list.",
    },
  ],
};

export const module5Lessons: Lesson[] = [whySeveralTables, innerJoin, leftJoin, subqueriesAndCase, orderOfExecution];
