import type { Lesson } from "../../types";
import { BOOKSHOP_SEED } from "../../datasets/bookshop";

/** Module 8: the final project. */

const REVIEWS_TABLE =
  "CREATE TABLE reviews (\n  id INTEGER PRIMARY KEY,\n  book_id INTEGER NOT NULL REFERENCES books(id),\n  customer_id INTEGER NOT NULL REFERENCES customers(id),\n  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),\n  comment TEXT\n);";

const THREE_REVIEWS = `INSERT INTO reviews (book_id, customer_id, rating, comment) VALUES
  (12, 1, 5, 'Changed how I see history'),
  (7, 5, 4, 'Very funny'),
  (3, 6, 5, NULL);`;

const reviewsShape = `SELECT name, upper(type), "notnull", pk FROM pragma_table_info('reviews')
  UNION ALL SELECT 'link: ' || "from", "table", NULL, NULL FROM pragma_foreign_key_list('reviews')
  UNION ALL SELECT 'has a CHECK rule', instr(upper(sql), 'CHECK') > 0, NULL, NULL FROM sqlite_master WHERE name = 'reviews'`;

const buildTheBookshop: Lesson = {
  status: "ready",
  slug: "build-the-bookshop",
  number: 34,
  title: "Project: add reviews to the bookshop",
  minutes: 25,
  summary: "Use every command family to design, fill and check a new feature: book reviews.",
  video: { title: "Your first feature, end to end" },
  practiceDb: { seed: `PRAGMA foreign_keys = ON;\n${BOOKSHOP_SEED}`, showBookshopTables: true },
  body: `
Time to put it all together. The bookshop wants customers to leave **reviews**: a star rating from 1 to 5, and an optional comment. You'll build the feature from start to finish, the way a real developer would.

**The plan**

1. **Design (DDL).** A new \`reviews\` table. Each review belongs to one book and one customer, so it needs two foreign keys.
2. **Fill (DML), safely (TCL).** Add the first reviews inside a transaction.
3. **Protect.** The database itself should refuse a rating of 0 or 6, whatever the website sends.
4. **Ask (DQL).** Show each review with its book's title.
5. **Control (DCL).** On a real server, you'd finish with \`GRANT SELECT, INSERT ON reviews TO shop_website;\`, so the website can add and read reviews, but never delete them.

**The design**

| Column | Type | Rules |
|---|---|---|
| id | INTEGER | primary key |
| book_id | INTEGER | required, references books(id) |
| customer_id | INTEGER | required, references customers(id) |
| rating | INTEGER | required, CHECK (rating BETWEEN 1 AND 5) |
| comment | TEXT | optional |

\`CHECK\` is a rule you write yourself. The database tests it on every insert and update, and refuses any row that breaks it.

Each exercise below starts from the original bookshop, so later exercises include the \`CREATE TABLE\` for you. Foreign keys are switched on here, so a review for a book that doesn't exist is refused too.
`,
  keyIdeas: [
    "A feature touches every command family: DDL to design, DML to fill, TCL to keep it safe, DQL to ask, DCL to control access.",
    "CHECK (condition) lets the database enforce your own rules, like ratings from 1 to 5.",
    "Design on paper first: columns, types, keys and rules.",
  ],
  exercises: [
    {
      type: "sort",
      id: "which-family",
      prompt: "Which command family is each step of the reviews feature?",
      groups: ["DDL", "DML", "TCL", "DQL", "DCL"],
      items: [
        { text: "CREATE TABLE reviews (...)", group: "DDL" },
        { text: "INSERT INTO reviews ...", group: "DML" },
        { text: "BEGIN ... COMMIT", group: "TCL" },
        { text: "SELECT AVG(rating) FROM reviews", group: "DQL" },
        { text: "GRANT INSERT ON reviews TO shop_website", group: "DCL" },
      ],
      hint: "Structure, data, transactions, questions, permissions.",
      xp: 20,
    },
    {
      type: "sql",
      id: "create-reviews",
      kind: "Write a query",
      prompt: "Create the reviews table exactly as in the design table above, including both foreign keys and the CHECK on rating.",
      starter: "CREATE TABLE reviews (\n\n);",
      answer: REVIEWS_TABLE,
      checkQuery: reviewsShape,
      mismatch:
        "Compare with the design table: five columns, NOT NULL on book_id, customer_id and rating, both REFERENCES, and CHECK (rating BETWEEN 1 AND 5).",
      hint: "Write one line per row of the design table, e.g. rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5).",
      xp: 50,
    },
    {
      type: "sql",
      id: "first-reviews",
      kind: "Write a query",
      prompt:
        "The table is created for you. Inside the transaction, add three reviews: Emma (customer 1) gives Sapiens (book 12) 5 stars, Yuki (customer 5) gives Guards! Guards! (book 7) 4 stars, and Amara (customer 6) gives Half of a Yellow Sun (book 3) 5 stars. Comments are up to you.",
      starter: `${REVIEWS_TABLE}\n\nBEGIN;\n\nCOMMIT;`,
      answer: `${REVIEWS_TABLE}\nBEGIN;\n${THREE_REVIEWS}\nCOMMIT;`,
      checkQuery: "SELECT book_id, customer_id, rating FROM reviews",
      mismatch: "The reviews aren't right yet. You need exactly three: book 12 by customer 1 (5 stars), book 7 by customer 5 (4 stars) and book 3 by customer 6 (5 stars).",
      hint: "INSERT INTO reviews (book_id, customer_id, rating, comment) VALUES (12, 1, 5, 'Great'), ... with the other two rows.",
      xp: 40,
    },
    {
      type: "sql",
      id: "six-stars",
      kind: "Fix the query",
      prompt: "Daniel loved The Dispossessed so much that he tried to give it 6 stars. The database refuses. Change it to the highest rating allowed.",
      starter: `${REVIEWS_TABLE}\n\nINSERT INTO reviews (book_id, customer_id, rating, comment)\nVALUES (19, 8, 6, 'Better than perfect');`,
      answer: `${REVIEWS_TABLE}\nINSERT INTO reviews (book_id, customer_id, rating, comment) VALUES (19, 8, 5, 'Better than perfect');`,
      checkQuery: "SELECT book_id, customer_id, rating FROM reviews",
      mismatch: "There should be one review: book 19, customer 8, 5 stars.",
      hint: "The CHECK only allows 1 to 5. Change 6 to 5.",
      xp: 30,
    },
    {
      type: "sql",
      id: "reviews-with-titles",
      kind: "Challenge",
      prompt: "The table and three reviews are ready. Finish with a query that shows each review's book title and rating.",
      starter: `${REVIEWS_TABLE}\n${THREE_REVIEWS}\n\n`,
      answer: `${REVIEWS_TABLE}\n${THREE_REVIEWS}\nSELECT books.title, reviews.rating FROM reviews JOIN books ON reviews.book_id = books.id;`,
      hint: "JOIN books ON reviews.book_id = books.id, then SELECT books.title, reviews.rating.",
      xp: 50,
    },
  ],
  quiz: [
    {
      question: "Why put CHECK (rating BETWEEN 1 AND 5) in the database, when the website could check it too?",
      choices: [
        "The database then protects the data whatever program sends it",
        "Websites can't check numbers",
        "It makes the table smaller",
      ],
      answer: 0,
      why: "Many programs may write to the database. A rule in the table can't be skipped by any of them.",
    },
    {
      question: "A review points to book_id 999, which doesn't exist, and foreign keys are on. What happens?",
      choices: ["The insert is refused", "A book 999 is created", "The review is saved anyway"],
      answer: 0,
      why: "REFERENCES books(id) means the book must exist.",
    },
    {
      question: "Which privileges should the shop website get on reviews?",
      choices: ["SELECT and INSERT", "Everything, including DELETE", "None"],
      answer: 0,
      why: "It shows and adds reviews. Least privilege says nothing more.",
    },
  ],
};

/** The bookshop with reviews and the books in each order, for the report. */
const REPORT_SEED = `${BOOKSHOP_SEED}
${REVIEWS_TABLE}
INSERT INTO reviews (book_id, customer_id, rating, comment) VALUES
(12, 1, 5, 'Changed how I see history'), (7, 5, 4, 'Very funny'), (3, 6, 5, NULL),
(12, 4, 4, 'Long but worth it'), (7, 2, 5, NULL), (7, 1, 3, 'Not my kind of humour'), (1, 2, 4, 'Read it with my kids');
CREATE TABLE order_items(order_id INTEGER REFERENCES orders(id), book_id INTEGER REFERENCES books(id), quantity INTEGER NOT NULL, price REAL NOT NULL);
INSERT INTO order_items VALUES
(1, 12, 1, 18.99), (1, 10, 2, 9.99), (2, 18, 1, 15.99), (3, 5, 1, 12.99), (4, 7, 1, 11.99), (4, 8, 1, 12.49),
(5, 11, 1, 9.99), (6, 5, 2, 12.99), (7, 3, 1, 14.99), (8, 12, 1, 18.99), (8, 14, 1, 10.99), (9, 1, 3, 7.99), (10, 13, 1, 14.99);`;

const businessReport: Lesson = {
  status: "ready",
  slug: "business-report",
  number: 35,
  title: "Project: the bookshop business report",
  minutes: 30,
  summary: "Answer the owner's real questions about sales, best sellers and reviews.",
  video: { title: "From data to decisions" },
  practiceDb: { seed: REPORT_SEED, showBookshopTables: true },
  body: `
The bookshop's owner has a meeting with investors and needs answers. You have everything you need to give them.

This lesson's database is the bookshop plus two more tables:

**reviews**: id, book_id, customer_id, rating (1 to 5), comment. It holds seven reviews.

**order_items**: which books were in each order.

| Column | Meaning |
|---|---|
| order_id | the order (links to orders.id) |
| book_id | the book (links to books.id) |
| quantity | how many copies |
| price | the price per copy when it was bought |

An order can contain several books, so \`order_items\` can have several rows for the same order. The money from one row is \`quantity * price\`.

**A word on cancelled orders.** Order 3 was cancelled, so it shouldn't count as a sale. Join to \`orders\` and filter on its \`status\`.

**Tips for report queries**

- Write the \`FROM\` and \`JOIN\` lines first, run them, and look at the rows. Then add \`WHERE\`, \`GROUP BY\` and the columns.
- Money sums can show long decimals like 119.41000000000001. Use \`ROUND(..., 2)\`, as the questions ask.
- Give result columns clear names with \`AS\`. The owner will thank you.

These questions are deliberately like the ones real analysts get every day. Take your time, and use Hint whenever you need it.
`,
  keyIdeas: [
    "Build big queries in small steps: joins first, then filters, then grouping.",
    "Leave out cancelled orders when counting sales.",
    "ROUND money to 2 decimal places and name columns clearly.",
  ],
  exercises: [
    {
      type: "sql",
      id: "delivered-revenue",
      kind: "Write a query",
      prompt: "How much money came from delivered orders? Add up quantity * price for every item in an order with the status 'delivered', and round it to 2 decimal places.",
      starter: "SELECT ROUND(SUM(order_items.quantity * order_items.price), 2)\nFROM order_items\nJOIN orders ON ",
      answer:
        "SELECT ROUND(SUM(order_items.quantity * order_items.price), 2) FROM order_items JOIN orders ON order_items.order_id = orders.id WHERE orders.status = 'delivered';",
      hint: "Finish the JOIN with order_items.order_id = orders.id, then add WHERE orders.status = 'delivered'.",
      xp: 40,
    },
    {
      type: "sql",
      id: "revenue-by-genre",
      kind: "Write a query",
      prompt: "Show each genre and its sales, rounded to 2 decimal places, counting every order except cancelled ones.",
      starter: "",
      answer:
        "SELECT books.genre, ROUND(SUM(order_items.quantity * order_items.price), 2) FROM order_items JOIN orders ON order_items.order_id = orders.id JOIN books ON order_items.book_id = books.id WHERE orders.status <> 'cancelled' GROUP BY books.genre;",
      hint: "Join order_items to orders and to books. WHERE orders.status <> 'cancelled', then GROUP BY books.genre.",
      xp: 50,
    },
    {
      type: "sql",
      id: "best-seller",
      kind: "Challenge",
      prompt: "What's the best-selling book by number of copies, not counting cancelled orders? Show its title and the copies sold.",
      starter: "",
      answer:
        "SELECT books.title, SUM(order_items.quantity) AS copies FROM order_items JOIN orders ON order_items.order_id = orders.id JOIN books ON order_items.book_id = books.id WHERE orders.status <> 'cancelled' GROUP BY books.id ORDER BY copies DESC LIMIT 1;",
      hint: "Group by book, SUM(order_items.quantity), sort largest first and LIMIT 1.",
      xp: 50,
    },
    {
      type: "sql",
      id: "well-reviewed",
      kind: "Challenge",
      prompt: "For books with at least 2 reviews, show the title and the average rating.",
      starter: "",
      answer:
        "SELECT books.title, AVG(reviews.rating) FROM reviews JOIN books ON reviews.book_id = books.id GROUP BY books.id HAVING COUNT(*) >= 2;",
      hint: "Join reviews to books, GROUP BY the book, and keep groups with HAVING COUNT(*) >= 2.",
      xp: 50,
    },
    {
      type: "sql",
      id: "no-reviews-yet",
      kind: "Challenge",
      prompt: "The owner wants to ask quiet customers for a review. Which customers haven't written a review yet? Show their names.",
      starter: "",
      answer:
        "SELECT customers.name FROM customers LEFT JOIN reviews ON reviews.customer_id = customers.id WHERE reviews.id IS NULL;",
      hint: "LEFT JOIN reviews onto customers, then keep rows where reviews.id IS NULL. NOT IN with a subquery works too.",
      xp: 50,
    },
  ],
  quiz: [
    {
      question: "Why join order_items to orders when adding up sales?",
      choices: [
        "To check each order's status and leave out cancelled ones",
        "Because order_items has no prices",
        "JOIN is always required before SUM",
      ],
      answer: 0,
      why: "The status lives in orders. Without it you'd count the cancelled order as a sale.",
    },
    {
      question: "Which filters groups, like books with at least 2 reviews?",
      choices: ["HAVING", "WHERE", "ORDER BY"],
      answer: 0,
      why: "HAVING checks groups after GROUP BY. WHERE checks single rows before grouping.",
    },
    {
      question: "You've finished SQL from Zero. Which order does a query run in, inside the engine?",
      choices: [
        "Parse, plan, execute, return",
        "Return, execute, plan, parse",
        "Execute, parse, return, plan",
      ],
      answer: 0,
      why: "Back to lesson 1: the parser checks it, the planner picks a route, the executor fetches the rows, and the result comes back to you.",
    },
  ],
};

export const module8Lessons: Lesson[] = [buildTheBookshop, businessReport];
