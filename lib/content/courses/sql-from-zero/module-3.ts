import type { Lesson } from "../../types";
import { BOOKSHOP_SEED } from "../../datasets/bookshop";

/** Module 3: DML, filling and changing data. */

const bookshop = { seed: BOOKSHOP_SEED, showBookshopTables: true };

const insert: Lesson = {
  status: "ready",
  slug: "insert",
  number: 14,
  title: "Adding rows with INSERT",
  minutes: 12,
  summary: "Stock the shelves: add new authors, books and customers.",
  video: {
    title: "Stocking the shelves",
    src: "/videos/sql-14-insert.mp4",
    poster: "/videos/sql-14-insert.jpg",
  },
  practiceDb: bookshop,
  body: `
The shelves are up. Now it's time to stock them. From here on your practice database is the full bookshop, already filled with authors, books, customers and orders. You'll add to it with **DML**, starting with \`INSERT\`.

\`\`\`sql
INSERT INTO authors (id, name, country)
VALUES (11, 'Jane Austen', 'UK');
\`\`\`

Reading it out loud: "Into the authors table, for the columns id, name and country, add these values."

- The values go in the **same order** as the columns you listed.
- Text goes in single quotes. Numbers don't.
- If a value contains an apostrophe, write it twice: \`'The Handmaid''s Tale'\`.

**Leave out what fills itself in.** The id is an \`INTEGER PRIMARY KEY\`, so if you skip it the database picks the next number:

\`\`\`sql
INSERT INTO authors (name, country) VALUES ('Chinua Achebe', 'Nigeria');
\`\`\`

**Add several rows at once** by separating them with commas:

\`\`\`sql
INSERT INTO customers (name, city, country, joined_on) VALUES
  ('Mateo García', 'Madrid', 'Spain', '2025-09-10'),
  ('Lina Haddad', 'Dubai', 'UAE', '2025-09-12');
\`\`\`

Run \`SELECT * FROM authors;\` afterwards to see your new rows.
`,
  keyIdeas: [
    "INSERT INTO table (columns) VALUES (values) adds a row.",
    "Values go in the same order as the columns; text goes in single quotes.",
    "Leave out columns that fill themselves in, like an INTEGER PRIMARY KEY or a DEFAULT. Separate several rows with commas.",
  ],
  exercises: [
    {
      type: "sql",
      id: "add-author",
      kind: "Write a query",
      prompt: "Add a new author: id 11, name 'Jane Austen', country 'UK'.",
      starter: "INSERT INTO authors (id, name, country)\nVALUES ",
      answer: "INSERT INTO authors (id, name, country) VALUES (11, 'Jane Austen', 'UK');",
      checkQuery: "SELECT * FROM authors ORDER BY id",
      mismatch: "The authors table doesn't match yet. There should be one new row: 11, 'Jane Austen', 'UK'.",
      hint: "VALUES (11, 'Jane Austen', 'UK');",
      xp: 25,
    },
    {
      type: "sql",
      id: "add-book",
      kind: "Write a query",
      prompt:
        "Add Agatha Christie's first novel, 'The Mysterious Affair at Styles'. She is author 6. It's a Mystery, costs 8.99, was published in 1920 and has 20 copies in stock. Let the database choose its id.",
      starter: "INSERT INTO books (title, author_id, genre, price, published_year, stock)\nVALUES ",
      answer:
        "INSERT INTO books (title, author_id, genre, price, published_year, stock) VALUES ('The Mysterious Affair at Styles', 6, 'Mystery', 8.99, 1920, 20);",
      checkQuery: "SELECT * FROM books ORDER BY id",
      mismatch: "The books table doesn't match yet. Check each value is in the same order as the column list.",
      hint: "VALUES ('The Mysterious Affair at Styles', 6, 'Mystery', 8.99, 1920, 20);",
      xp: 25,
    },
    {
      type: "sql",
      id: "add-two-customers",
      kind: "Challenge",
      prompt:
        "Add two customers in one statement: Mateo García from Madrid, Spain, who joined on 2025-09-10, and Lina Haddad from Dubai, UAE, who joined on 2025-09-12. Let the database choose their ids.",
      starter: "",
      answer:
        "INSERT INTO customers (name, city, country, joined_on) VALUES ('Mateo García', 'Madrid', 'Spain', '2025-09-10'), ('Lina Haddad', 'Dubai', 'UAE', '2025-09-12');",
      checkQuery: "SELECT * FROM customers ORDER BY id",
      mismatch:
        "The customers table doesn't match yet. Check the spelling (including the accent in García), the dates in YYYY-MM-DD form, and that Mateo comes first.",
      hint: "One INSERT with two sets of brackets after VALUES, separated by a comma.",
      xp: 50,
    },
  ],
  quiz: [
    {
      question: "Which INSERT is written correctly?",
      choices: [
        "INSERT INTO authors (name, country) VALUES ('Toni Morrison', 'USA');",
        "INSERT authors VALUES name = 'Toni Morrison';",
        "INSERT INTO authors ('Toni Morrison', 'USA');",
      ],
      answer: 0,
      why: "INSERT INTO, then the table and its columns, then VALUES with the values in the same order.",
    },
    {
      question: "You leave out the id when inserting into a table whose id is INTEGER PRIMARY KEY. What happens?",
      choices: ["An error", "The database picks the next number", "The id is set to 0"],
      answer: 1,
      why: "SQLite numbers INTEGER PRIMARY KEY rows automatically.",
    },
    {
      question: "How do you add a title with an apostrophe, like Ender's Game?",
      choices: ["'Ender's Game'", "'Ender''s Game'", "Ender's Game"],
      answer: 1,
      why: "Inside single quotes, an apostrophe is written as two single quotes.",
    },
  ],
};

const update: Lesson = {
  status: "ready",
  slug: "update",
  number: 15,
  title: "Changing rows with UPDATE",
  minutes: 12,
  summary: "Fix a price, restock a book, run a sale, and why WHERE matters so much.",
  video: { title: "Relabelling the price tags" },
  practiceDb: bookshop,
  body: `
Prices change, stock runs out, people move house. \`UPDATE\` changes values in rows that already exist.

\`\`\`sql
UPDATE books
SET price = 19.99
WHERE title = 'Sapiens';
\`\`\`

Reading it out loud: "In books, set the price to 19.99, but only where the title is Sapiens."

You can change several columns at once, and use the current value in a calculation:

\`\`\`sql
UPDATE books
SET stock = stock + 10, price = 12.99
WHERE id = 4;
\`\`\`

⚠️ **The most important rule in this lesson: always write the WHERE.** Without it, \`UPDATE\` changes **every row in the table**. \`UPDATE books SET price = 0;\` makes every book free.

A habit professionals use: first run a \`SELECT\` with the same \`WHERE\`, check it returns only the rows you expect, then turn it into an \`UPDATE\`.

\`\`\`sql
SELECT * FROM books WHERE genre = 'Fantasy';  -- check first
UPDATE books SET price = ROUND(price * 0.9, 2) WHERE genre = 'Fantasy';  -- then change
\`\`\`

\`ROUND(value, 2)\` keeps prices to two decimal places.
`,
  keyIdeas: [
    "UPDATE table SET column = value WHERE condition changes existing rows.",
    "Without WHERE, every row is changed. Check with a SELECT first.",
    "SET can use the current value, like stock = stock + 10, and change several columns at once.",
  ],
  exercises: [
    {
      type: "sql",
      id: "new-price",
      kind: "Write a query",
      prompt: "The price of 'Sapiens' has gone up to 19.99. Update it.",
      starter: "UPDATE books\nSET ",
      answer: "UPDATE books SET price = 19.99 WHERE title = 'Sapiens';",
      checkQuery: "SELECT id, price FROM books ORDER BY id",
      mismatch: "The prices don't match yet. Only Sapiens should change, to 19.99.",
      hint: "SET price = 19.99 WHERE title = 'Sapiens';",
      xp: 25,
    },
    {
      type: "sql",
      id: "fix-the-sale",
      kind: "Fix the query",
      prompt:
        "This was meant to set the stock of 'Americanah' (book 4) to 15, but it would restock every book in the shop. Fix it so only book 4 changes.",
      starter: "UPDATE books\nSET stock = 15;",
      answer: "UPDATE books SET stock = 15 WHERE id = 4;",
      checkQuery: "SELECT id, stock FROM books ORDER BY id",
      mismatch: "The stock numbers don't match yet. Only book 4 should change.",
      hint: "Add WHERE id = 4 before the semicolon.",
      xp: 25,
    },
    {
      type: "sql",
      id: "fantasy-sale",
      kind: "Challenge",
      prompt: "Run a 10% sale on Fantasy books: multiply their price by 0.9, rounded to 2 decimal places.",
      starter: "",
      answer: "UPDATE books SET price = ROUND(price * 0.9, 2) WHERE genre = 'Fantasy';",
      checkQuery: "SELECT id, price FROM books ORDER BY id",
      mismatch: "The prices don't match yet. Only the three Fantasy books should change, to ROUND(price * 0.9, 2).",
      hint: "SET price = ROUND(price * 0.9, 2) WHERE genre = 'Fantasy'",
      xp: 50,
    },
  ],
  quiz: [
    {
      question: "What does UPDATE books SET price = 5; do?",
      choices: ["Changes one book", "Changes every book's price to 5", "Gives an error"],
      answer: 1,
      why: "With no WHERE, UPDATE applies to every row.",
    },
    {
      question: "What's a safe habit before running an UPDATE?",
      choices: [
        "Run a SELECT with the same WHERE to see which rows will change",
        "Run it twice to be sure",
        "Remove the WHERE so nothing is missed",
      ],
      answer: 0,
      why: "The SELECT shows exactly which rows the UPDATE will touch.",
    },
    {
      question: "Which adds 5 copies to the current stock of book 2?",
      choices: [
        "UPDATE books SET stock = 5 WHERE id = 2;",
        "UPDATE books SET stock = stock + 5 WHERE id = 2;",
        "INSERT INTO books (stock) VALUES (5);",
      ],
      answer: 1,
      why: "stock + 5 uses the current value. stock = 5 would replace it.",
    },
  ],
};

const deleteRows: Lesson = {
  status: "ready",
  slug: "delete",
  number: 16,
  title: "Removing rows with DELETE",
  minutes: 10,
  summary: "Remove the rows you don't need, and only those.",
  video: { title: "Clearing the shelf, carefully" },
  practiceDb: bookshop,
  body: `
\`DELETE\` removes whole rows from a table.

\`\`\`sql
DELETE FROM orders
WHERE status = 'cancelled';
\`\`\`

Just like \`UPDATE\`, the \`WHERE\` decides which rows are affected, and just like \`UPDATE\`, forgetting it is a disaster: \`DELETE FROM orders;\` removes **every order**. Use the same habit: \`SELECT\` first, then \`DELETE\`.

**DELETE vs DROP.** These are easy to mix up:

| Command | Family | What goes | What stays |
|---|---|---|---|
| \`DELETE FROM books WHERE ...\` | DML | The matching rows | The table and other rows |
| \`DELETE FROM books\` | DML | Every row | The empty table |
| \`DROP TABLE books\` | DDL | The table and all rows | Nothing |

At many companies, important rows are never deleted at all. Instead a column like \`is_active\` is set to 0 with an \`UPDATE\`. This is called a **soft delete**, and it means mistakes can be undone and history is kept.
`,
  keyIdeas: [
    "DELETE FROM table WHERE condition removes matching rows.",
    "Without WHERE, DELETE removes every row. Check with SELECT first.",
    "DELETE removes rows; DROP TABLE removes the whole table. Many teams prefer soft deletes.",
  ],
  exercises: [
    {
      type: "sql",
      id: "delete-cancelled",
      kind: "Write a query",
      prompt: "Remove all cancelled orders.",
      starter: "DELETE FROM orders\n",
      answer: "DELETE FROM orders WHERE status = 'cancelled';",
      checkQuery: "SELECT id FROM orders ORDER BY id",
      mismatch: "The orders don't match yet. Only the cancelled order should be removed.",
      hint: "WHERE status = 'cancelled'",
      xp: 25,
    },
    {
      type: "sql",
      id: "fix-delete",
      kind: "Fix the query",
      prompt: "The book 'The Dispossessed' (book 19) is being taken off sale. This query would empty the whole books table. Fix it.",
      starter: "DELETE FROM books;",
      answer: "DELETE FROM books WHERE id = 19;",
      checkQuery: "SELECT id FROM books ORDER BY id",
      mismatch: "The books don't match yet. Only book 19 should be removed.",
      hint: "Add WHERE id = 19.",
      xp: 25,
    },
    {
      type: "sort",
      id: "delete-or-drop",
      prompt: "Which command fits each job?",
      groups: ["DELETE with WHERE", "DELETE without WHERE", "DROP TABLE"],
      items: [
        { text: "Remove customers who asked for their account to be closed", group: "DELETE with WHERE" },
        { text: "Empty a test table but keep it for tomorrow", group: "DELETE without WHERE" },
        { text: "Get rid of a table nobody uses any more", group: "DROP TABLE" },
        { text: "Remove orders older than 2015", group: "DELETE with WHERE" },
      ],
      hint: "DROP removes the table itself. DELETE without WHERE keeps an empty table.",
      xp: 20,
    },
  ],
  quiz: [
    {
      question: "What does DELETE FROM customers; do?",
      choices: ["Deletes the customers table", "Removes every row but keeps the table", "Removes the first row"],
      answer: 1,
      why: "DELETE removes rows. Without WHERE that's all of them, but the empty table stays.",
    },
    {
      question: "Which is a soft delete?",
      choices: [
        "UPDATE customers SET is_active = 0 WHERE id = 7;",
        "DELETE FROM customers WHERE id = 7;",
        "DROP TABLE customers;",
      ],
      answer: 0,
      why: "The row stays, just marked inactive, so it can be restored later.",
    },
    {
      question: "DELETE belongs to which family?",
      choices: ["DDL", "DML", "TCL"],
      answer: 1,
      why: "It changes data, not structure, so it's Data Manipulation Language.",
    },
  ],
};

const whenRulesAreBroken: Lesson = {
  status: "ready",
  slug: "when-rules-are-broken",
  number: 17,
  title: "When rules are broken",
  minutes: 12,
  summary: "Read constraint errors like a pro and fix what caused them.",
  video: { title: "The database says no" },
  practiceDb: { seed: `PRAGMA foreign_keys = ON;\n${BOOKSHOP_SEED}`, showBookshopTables: true },
  body: `
In Module 2 you gave your tables rules. Now you'll see them protect the data. When a change breaks a rule, the database **refuses the whole statement** and explains why. Nothing is half-done.

Here are the errors you'll meet most, and what they mean in plain words:

| Error message | What it means | Typical fix |
|---|---|---|
| \`NOT NULL constraint failed: books.title\` | A required value is missing | Provide the value |
| \`UNIQUE constraint failed: books.id\` | That value is already taken | Use a different value, or leave the id out |
| \`FOREIGN KEY constraint failed\` | You pointed to something that doesn't exist | Use an id that exists in the other table |
| \`CHECK constraint failed\` | The value failed a test, like a negative price | Fix the value |

The message names the rule and usually the column. Read it slowly. It's the database telling you exactly where to look.

These errors are good news. Each one is bad data that **didn't** get into your shop.
`,
  keyIdeas: [
    "A change that breaks a rule is refused completely, with an error that names the rule.",
    "NOT NULL means a value is missing; UNIQUE means it's taken; FOREIGN KEY means it points to nothing.",
    "Constraint errors are the database protecting your data.",
  ],
  exercises: [
    {
      type: "sql",
      id: "fix-missing-title",
      kind: "Fix the query",
      prompt: "This should add the book 'Kitchen' by author 3 (Fiction, 11.49, 1988, 9 in stock), but it fails. Run it, read the error, and fix it.",
      starter:
        "INSERT INTO books (author_id, genre, price, published_year, stock)\nVALUES (3, 'Fiction', 11.49, 1988, 9);",
      answer:
        "INSERT INTO books (title, author_id, genre, price, published_year, stock) VALUES ('Kitchen', 3, 'Fiction', 11.49, 1988, 9);",
      checkQuery: "SELECT * FROM books ORDER BY id",
      mismatch: "The books table doesn't match yet. The new book needs the title 'Kitchen' and all the other values.",
      hint: "The error says books.title is NOT NULL. Add title to the column list and 'Kitchen' to the values.",
      xp: 25,
    },
    {
      type: "sql",
      id: "fix-duplicate-id",
      kind: "Fix the query",
      prompt: "This should add a new customer, Chen Wei from Shanghai, China, who joined on 2025-09-15, but it fails. Fix it.",
      starter:
        "INSERT INTO customers (id, name, city, country, joined_on)\nVALUES (3, 'Chen Wei', 'Shanghai', 'China', '2025-09-15');",
      answer:
        "INSERT INTO customers (name, city, country, joined_on) VALUES ('Chen Wei', 'Shanghai', 'China', '2025-09-15');",
      checkQuery: "SELECT * FROM customers ORDER BY id",
      mismatch: "The customers table doesn't match yet. Chen Wei should be added as a new customer with the next free id.",
      hint: "id 3 is already taken. Leave the id out and let the database choose.",
      xp: 25,
    },
    {
      type: "sql",
      id: "fix-missing-author",
      kind: "Challenge",
      prompt:
        "This should add 'After Dark' by Haruki Murakami (Fiction, 12.49, 2004, 7 in stock), but it fails. Look up his real author id and fix it.",
      starter:
        "INSERT INTO books (title, author_id, genre, price, published_year, stock)\nVALUES ('After Dark', 33, 'Fiction', 12.49, 2004, 7);",
      answer:
        "INSERT INTO books (title, author_id, genre, price, published_year, stock) VALUES ('After Dark', 3, 'Fiction', 12.49, 2004, 7);",
      checkQuery: "SELECT * FROM books ORDER BY id",
      mismatch: "The books table doesn't match yet. Check the author id and the other values.",
      hint: "Run SELECT * FROM authors; to find Haruki Murakami's id.",
      xp: 50,
    },
  ],
  quiz: [
    {
      question: "What does “NOT NULL constraint failed: customers.name” mean?",
      choices: ["The name is too long", "A customer was added without a name", "The customers table is missing"],
      answer: 1,
      why: "name is required, and the statement didn't provide one.",
    },
    {
      question: "An INSERT of 3 rows breaks a rule on the second row. How many rows are added?",
      choices: ["0", "1", "2"],
      answer: 0,
      why: "The whole statement is refused, so nothing is half-done.",
    },
    {
      question: "“FOREIGN KEY constraint failed” usually means…",
      choices: [
        "You pointed to a row that doesn't exist in the other table",
        "The table has no primary key",
        "The value is a duplicate",
      ],
      answer: 0,
      why: "A foreign key must match an existing row, like a real author id.",
    },
  ],
};

export const module3Lessons: Lesson[] = [insert, update, deleteRows, whenRulesAreBroken];
