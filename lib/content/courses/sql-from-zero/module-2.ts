import type { Lesson } from "../../types";

/** Module 2: DDL, building the structure. Learners build the bookshop's tables themselves. */

/** A check that compares a table's columns: names and types, plus optional extras. */
function shape(table: string, extras: ("notnull" | "dflt_value" | "pk")[] = []): string {
  const cols = ["name", "upper(type) AS type", ...extras.map((e) => `"${e}"`)].join(", ");
  return `SELECT ${cols} FROM pragma_table_info('${table}') ORDER BY cid`;
}

const AUTHORS = "CREATE TABLE authors (id INTEGER PRIMARY KEY, name TEXT NOT NULL, country TEXT);";
const CUSTOMERS =
  "CREATE TABLE customers (id INTEGER PRIMARY KEY, name TEXT NOT NULL, city TEXT, country TEXT, joined_on TEXT);";

const createTable: Lesson = {
  status: "ready",
  slug: "create-table",
  number: 8,
  title: "Your first table with CREATE TABLE",
  minutes: 12,
  summary: "Put up the bookshop's first shelf: a table with named columns.",
  video: {
    title: "Putting up the first shelf",
    src: "/videos/sql-08-create-table.mp4",
    poster: "/videos/sql-08-create-table.jpg",
  },
  practiceDb: { seed: "" },
  body: `
Remember the five families of commands? Now you start building, with **DDL**. Your practice database is completely empty, like a new shop with bare walls. Let's put up the first shelf.

A table needs a name and a list of columns. Each column has a name and a **type**, which says what kind of value goes in it.

\`\`\`sql
CREATE TABLE authors (
  id INTEGER,
  name TEXT,
  country TEXT
);
\`\`\`

Reading it out loud: "Create a table called authors, with three columns: id holds whole numbers, name holds text, and country holds text."

A few rules:

- Columns go inside round brackets \`( )\`, separated by **commas**. There's no comma after the last one.
- Names can't have spaces. Use \`published_year\`, not \`published year\`.
- The statement ends with a semicolon \`;\`.
- A new table is empty. It has columns but no rows yet. You'll add rows in Module 3.

To see the tables you've made, run \`SELECT name, sql FROM sqlite_master;\`. That's the database's own list of everything it contains.
`,
  keyIdeas: [
    "CREATE TABLE makes a new, empty table with the columns you list.",
    "Each column has a name and a type, separated by commas inside round brackets.",
    "A new table has structure but no rows until you add data.",
  ],
  exercises: [
    {
      type: "sql",
      id: "create-authors",
      kind: "Write a query",
      prompt: "Create a table called authors with three columns: id (INTEGER), name (TEXT) and country (TEXT).",
      starter: "CREATE TABLE authors (\n\n);",
      answer: "CREATE TABLE authors (id INTEGER, name TEXT, country TEXT);",
      checkQuery: shape("authors"),
      mismatch: "The authors table doesn't match yet. Check the column names, their order and their types.",
      hint: "Inside the brackets write: id INTEGER, name TEXT, country TEXT",
      xp: 25,
    },
    {
      type: "sql",
      id: "fix-customers",
      kind: "Fix the query",
      prompt: "This should create a customers table with id, name and city, but it gives an error. Fix it.",
      starter: "CREATE TABLE customers (\n  id INTEGER,\n  name TEXT,\n  city TEXT,\n);",
      answer: "CREATE TABLE customers (id INTEGER, name TEXT, city TEXT);",
      checkQuery: shape("customers"),
      mismatch: "The customers table doesn't match yet. It needs id INTEGER, name TEXT and city TEXT.",
      hint: "Commas go between columns, so there's never one after the last column.",
      xp: 25,
    },
  ],
  quiz: [
    {
      question: "What does a brand new table contain?",
      choices: ["Columns but no rows", "Ten example rows", "Nothing at all, not even columns"],
      answer: 0,
      why: "CREATE TABLE sets up the structure. The rows come later with INSERT.",
    },
    {
      question: "Which column name is allowed?",
      choices: ["published year", "published_year", "published-year!"],
      answer: 1,
      why: "Names can't contain spaces or most symbols. Underscores are the usual way to join words.",
    },
    {
      question: "Which family of commands does CREATE TABLE belong to?",
      choices: ["DML", "DDL", "TCL"],
      answer: 1,
      why: "It defines structure, so it's Data Definition Language.",
    },
  ],
};

const dataTypes: Lesson = {
  status: "ready",
  slug: "data-types",
  number: 9,
  title: "Data types: numbers, text, dates",
  minutes: 12,
  summary: "Choose the right kind of column for each piece of information.",
  video: { title: "The right container for each thing" },
  practiceDb: { seed: "" },
  body: `
In a kitchen you keep soup in a pot and spoons in a drawer. Each column in a table is a container too, and its **type** says what belongs in it. Choosing the right type keeps data tidy and makes sorting and maths work properly.

| Type | Holds | Bookshop examples |
|---|---|---|
| \`INTEGER\` | Whole numbers | id, stock, published_year |
| \`REAL\` | Numbers with decimals | price (12.99) |
| \`TEXT\` | Words and characters | title, name, city |

**Dates** are stored as text in the format \`'YYYY-MM-DD'\`, like \`'2025-07-02'\`. Because the biggest unit comes first, they sort in the right order.

**Yes/no values** are stored as \`INTEGER\`: 1 for yes, 0 for no. A column like \`in_stock\` holds 1 or 0.

Our practice database is SQLite, the most widely used database in the world. It's built into every phone. Other databases such as PostgreSQL and MySQL have a few extra type names you'll see at work:

| You may also see | Means |
|---|---|
| \`VARCHAR(100)\` | Text up to 100 characters |
| \`DECIMAL(10, 2)\` | Exact numbers with 2 decimal places, good for money |
| \`DATE\`, \`TIMESTAMP\` | Dates, and dates with times |
| \`BOOLEAN\` | true or false |

The idea is the same everywhere: pick the container that matches the thing.
`,
  keyIdeas: [
    "INTEGER for whole numbers, REAL for decimals, TEXT for words.",
    "Store dates as text in YYYY-MM-DD order so they sort correctly.",
    "Store yes/no as INTEGER 1 or 0. Other databases add types like VARCHAR, DECIMAL, DATE and BOOLEAN.",
  ],
  exercises: [
    {
      type: "sort",
      id: "pick-the-type",
      prompt: "Which type fits each bookshop column?",
      groups: ["INTEGER", "REAL", "TEXT"],
      items: [
        { text: "title", group: "TEXT" },
        { text: "price, like 12.99", group: "REAL" },
        { text: "stock, how many copies are left", group: "INTEGER" },
        { text: "order_date, like 2025-07-02", group: "TEXT" },
        { text: "is_bestseller, 1 for yes and 0 for no", group: "INTEGER" },
        { text: "author's country", group: "TEXT" },
      ],
      hint: "Dates are stored as text. Yes/no values are stored as whole numbers.",
      xp: 20,
    },
    {
      type: "sql",
      id: "create-books",
      kind: "Write a query",
      prompt:
        "Create a books table with five columns: id (whole number), title (text), price (decimal number), published_on (a date) and in_stock (yes/no).",
      starter: "CREATE TABLE books (\n\n);",
      answer: "CREATE TABLE books (id INTEGER, title TEXT, price REAL, published_on TEXT, in_stock INTEGER);",
      checkQuery: shape("books"),
      mismatch:
        "The books table doesn't match yet. Check each column's type: whole numbers are INTEGER, decimals are REAL, dates are TEXT and yes/no is INTEGER.",
      hint: "id INTEGER, title TEXT, price REAL, published_on TEXT, in_stock INTEGER",
      xp: 30,
    },
  ],
  quiz: [
    {
      question: "Which type should a price like 9.99 use in SQLite?",
      choices: ["INTEGER", "REAL", "TEXT"],
      answer: 1,
      why: "REAL holds numbers with decimals. (Many companies use DECIMAL for money in other databases.)",
    },
    {
      question: "Why write dates as '2025-07-02' rather than '02/07/2025'?",
      choices: [
        "It looks nicer",
        "Year-month-day text sorts in the correct date order",
        "SQL doesn't allow slashes",
      ],
      answer: 1,
      why: "With the biggest unit first, sorting the text also sorts the dates correctly.",
    },
    {
      question: "How is a yes/no value usually stored in SQLite?",
      choices: ["As 1 or 0 in an INTEGER column", "As the words yes and no", "It can't be stored"],
      answer: 0,
      why: "1 means yes and 0 means no. Other databases also offer a BOOLEAN type.",
    },
  ],
};

const primaryKeys: Lesson = {
  status: "ready",
  slug: "primary-keys",
  number: 10,
  title: "Primary keys",
  minutes: 10,
  summary: "Give every row its own ID so the database can always tell rows apart.",
  video: { title: "Every row needs a roll number" },
  practiceDb: { seed: "" },
  body: `
In Module 1 you met the **primary key**: the column that identifies exactly one row, like a roll number in a school register. Now you'll create one.

\`\`\`sql
CREATE TABLE customers (
  id INTEGER PRIMARY KEY,
  name TEXT,
  email TEXT
);
\`\`\`

Adding \`PRIMARY KEY\` after a column tells the database two things:

1. **No two rows may share this value.** If you try to add a second customer with id 5, the database refuses.
2. **It's the official way to find a row.** Other tables will point at it later with foreign keys.

A handy SQLite feature: an \`INTEGER PRIMARY KEY\` fills itself in. If you add a customer without an id, the database picks the next number for you. (Other databases do the same with \`AUTO_INCREMENT\` or \`SERIAL\`.)

**A table can only have one primary key.** That's the point of it: one official ID per row.
`,
  keyIdeas: [
    "PRIMARY KEY marks the column that uniquely identifies each row.",
    "The database refuses duplicate primary key values.",
    "A table has only one primary key. In SQLite, an INTEGER PRIMARY KEY numbers new rows automatically.",
  ],
  exercises: [
    {
      type: "sql",
      id: "customers-with-key",
      kind: "Write a query",
      prompt: "Create a customers table with id (a whole-number primary key), name (text) and email (text).",
      starter: "CREATE TABLE customers (\n\n);",
      answer: "CREATE TABLE customers (id INTEGER PRIMARY KEY, name TEXT, email TEXT);",
      checkQuery: shape("customers", ["pk"]),
      mismatch: "Check that id is INTEGER PRIMARY KEY and that name and email are TEXT.",
      hint: "Write PRIMARY KEY straight after id INTEGER.",
      xp: 25,
    },
    {
      type: "sql",
      id: "one-primary-key",
      kind: "Fix the query",
      prompt:
        "This orders table gives an error. An order should be identified by its own id. Fix it so id is the only primary key.",
      starter: "CREATE TABLE orders (\n  id INTEGER PRIMARY KEY,\n  customer_id INTEGER PRIMARY KEY,\n  order_date TEXT\n);",
      answer: "CREATE TABLE orders (id INTEGER PRIMARY KEY, customer_id INTEGER, order_date TEXT);",
      checkQuery: shape("orders", ["pk"]),
      mismatch: "Only id should be the primary key. customer_id is an ordinary INTEGER column.",
      hint: "A table can have only one primary key. Remove PRIMARY KEY from customer_id.",
      xp: 25,
    },
  ],
  quiz: [
    {
      question: "Two customers are both called Emma Johnson. How does the database tell them apart?",
      choices: ["By their primary key, such as id", "By their name", "It can't"],
      answer: 0,
      why: "Names can repeat. The primary key is unique to each row.",
    },
    {
      question: "What happens if you add a second row with an id that already exists?",
      choices: ["Both rows are kept", "The database refuses it", "The old row is deleted"],
      answer: 1,
      why: "A primary key must be unique, so the database rejects the duplicate.",
    },
    {
      question: "Why is customer_id in the orders table not its primary key?",
      choices: [
        "One customer can place many orders, so customer_id repeats",
        "It's too long",
        "Only text columns can be keys",
      ],
      answer: 0,
      why: "A customer can order many times, so the same customer_id appears in many rows. It can't be unique.",
    },
  ],
};

const constraints: Lesson = {
  status: "ready",
  slug: "constraints",
  number: 11,
  title: "Constraints: NOT NULL, UNIQUE, DEFAULT, CHECK",
  minutes: 14,
  summary: "Add rules to columns so bad data can't get in.",
  video: { title: "House rules for your data" },
  practiceDb: { seed: "" },
  body: `
A good shop has rules: every parcel needs an address, and no two lockers share a number. Tables have rules too, called **constraints**. You add them after a column's type, and the database enforces them every time data is added or changed.

| Constraint | Rule | Example |
|---|---|---|
| \`NOT NULL\` | This column must always have a value | \`name TEXT NOT NULL\` |
| \`UNIQUE\` | No two rows may have the same value | \`email TEXT UNIQUE\` |
| \`DEFAULT\` | Use this value if none is given | \`country TEXT DEFAULT 'Unknown'\` |
| \`CHECK\` | The value must pass a test | \`price REAL CHECK (price >= 0)\` |

You can combine them:

\`\`\`sql
CREATE TABLE customers (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  country TEXT DEFAULT 'Unknown'
);
\`\`\`

Why bother, when you could just be careful? Because databases are used by many people and many apps at once. Rules in the database protect the data even when someone else makes a mistake. It's the **C** in ACID: consistent.
`,
  keyIdeas: [
    "Constraints are rules the database enforces on every change.",
    "NOT NULL requires a value, UNIQUE forbids duplicates, DEFAULT fills in a value, CHECK tests a condition.",
    "Rules in the database protect data from everyone's mistakes, not just yours.",
  ],
  exercises: [
    {
      type: "sort",
      id: "match-the-rule",
      prompt: "Which constraint would enforce each bookshop rule?",
      groups: ["PRIMARY KEY", "NOT NULL", "UNIQUE", "DEFAULT", "CHECK"],
      items: [
        { text: "Every book must have a title", group: "NOT NULL" },
        { text: "No two customers can sign up with the same email", group: "UNIQUE" },
        { text: "If no status is given, an order is 'pending'", group: "DEFAULT" },
        { text: "A price can never be negative", group: "CHECK" },
        { text: "Each order has its own ID number", group: "PRIMARY KEY" },
      ],
      hint: "UNIQUE stops duplicates in an ordinary column. PRIMARY KEY is the row's official ID.",
      xp: 25,
    },
    {
      type: "sql",
      id: "customers-with-rules",
      kind: "Write a query",
      prompt:
        "Create a customers table: id is a whole-number primary key, name is text and required, email is text and unique, and country is text that defaults to 'Unknown'.",
      starter: "CREATE TABLE customers (\n\n);",
      answer:
        "CREATE TABLE customers (id INTEGER PRIMARY KEY, name TEXT NOT NULL, email TEXT UNIQUE, country TEXT DEFAULT 'Unknown');",
      checkQuery: `${shape("customers", ["notnull", "dflt_value", "pk"]).replace(" ORDER BY cid", "")}
        UNION ALL SELECT 'unique constraints', count(*), NULL, NULL, NULL FROM pragma_index_list('customers') WHERE origin = 'u'`,
      mismatch:
        "Check each rule: NOT NULL on name, UNIQUE on email, and DEFAULT 'Unknown' (in single quotes) on country.",
      hint: "name TEXT NOT NULL, email TEXT UNIQUE, country TEXT DEFAULT 'Unknown'",
      xp: 35,
    },
  ],
  quiz: [
    {
      question: "Which constraint stops two customers from having the same email?",
      choices: ["NOT NULL", "UNIQUE", "DEFAULT"],
      answer: 1,
      why: "UNIQUE forbids duplicate values in that column.",
    },
    {
      question: "What does stock INTEGER DEFAULT 0 do when a book is added without a stock value?",
      choices: ["Refuses the book", "Sets stock to 0", "Leaves stock empty"],
      answer: 1,
      why: "DEFAULT fills in the given value whenever none is provided.",
    },
    {
      question: "Which rule keeps prices from going below zero?",
      choices: ["CHECK (price >= 0)", "UNIQUE", "NOT NULL"],
      answer: 0,
      why: "CHECK tests a condition on every new or changed value.",
    },
  ],
};

const foreignKeys: Lesson = {
  status: "ready",
  slug: "foreign-keys",
  number: 12,
  title: "Foreign keys",
  minutes: 14,
  summary: "Link tables together so every book points to a real author.",
  video: { title: "Pointing to another shelf" },
  practiceDb: { seed: `PRAGMA foreign_keys = ON;\n${AUTHORS}\n${CUSTOMERS}` },
  body: `
In Module 1 you saw that each book stores its author's id instead of the author's name. That link is a **foreign key**: a column whose values must match the primary key of another table.

Your practice database already has an \`authors\` table and a \`customers\` table. Now link a new table to one of them:

\`\`\`sql
CREATE TABLE books (
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  author_id INTEGER REFERENCES authors(id)
);
\`\`\`

\`REFERENCES authors(id)\` means: "every value in author_id must be an id that exists in the authors table."

What this buys you:

- **No orphans.** You can't add a book by author 999 if there's no author 999. The database refuses.
- **Safe deletes.** You can't delete an author while books still point at them, unless you decide what should happen to those books.

You'll often see the longer form, which does the same thing:

\`\`\`sql
FOREIGN KEY (author_id) REFERENCES authors(id)
\`\`\`

Note: SQLite only enforces foreign keys after \`PRAGMA foreign_keys = ON;\`. Your practice database has it switched on. Most other databases enforce them automatically.
`,
  keyIdeas: [
    "A foreign key links a column to another table's primary key.",
    "Write it as column_name INTEGER REFERENCES other_table(id).",
    "The database then refuses values that don't exist in the other table.",
  ],
  exercises: [
    {
      type: "sql",
      id: "books-reference-authors",
      kind: "Write a query",
      prompt:
        "Create a books table with id (whole-number primary key), title (text, required) and author_id, a whole number that references the id in authors.",
      starter: "CREATE TABLE books (\n\n);",
      answer:
        "CREATE TABLE books (id INTEGER PRIMARY KEY, title TEXT NOT NULL, author_id INTEGER REFERENCES authors(id));",
      checkQuery: `SELECT name, upper(type), "notnull", pk FROM pragma_table_info('books')
        UNION ALL SELECT 'link: ' || "from", "table" || '.' || "to", NULL, NULL FROM pragma_foreign_key_list('books')`,
      mismatch:
        "Check the columns, and that author_id ends with REFERENCES authors(id), including the (id).",
      hint: "author_id INTEGER REFERENCES authors(id)",
      xp: 30,
    },
    {
      type: "sql",
      id: "orders-reference-customers",
      kind: "Challenge",
      prompt:
        "Create an orders table with id (whole-number primary key), customer_id linked to the customers table, and order_date (a date).",
      starter: "",
      answer:
        "CREATE TABLE orders (id INTEGER PRIMARY KEY, customer_id INTEGER REFERENCES customers(id), order_date TEXT);",
      checkQuery: `SELECT name, upper(type), pk FROM pragma_table_info('orders')
        UNION ALL SELECT 'link: ' || "from", "table" || '.' || "to", NULL FROM pragma_foreign_key_list('orders')`,
      mismatch:
        "You need id INTEGER PRIMARY KEY, customer_id INTEGER REFERENCES customers(id), and order_date TEXT.",
      hint: "Dates are TEXT. The link is customer_id INTEGER REFERENCES customers(id).",
      xp: 50,
    },
  ],
  quiz: [
    {
      question: "books.author_id REFERENCES authors(id). What happens if you add a book with author_id 999 and there's no author 999?",
      choices: ["The book is added anyway", "The database refuses it", "Author 999 is created automatically"],
      answer: 1,
      why: "The foreign key only allows ids that exist in the authors table.",
    },
    {
      question: "A foreign key usually points to which column of the other table?",
      choices: ["Its primary key", "Any text column", "Its last column"],
      answer: 0,
      why: "It points to the other table's primary key, the official ID of each row.",
    },
    {
      question: "Why store author_id in books rather than the author's name?",
      choices: [
        "Names are too long",
        "The name is stored once in authors, so a fix in one place updates every book",
        "SQL can't store names twice",
      ],
      answer: 1,
      why: "Linking by id keeps each fact in one place, so it can't get out of step.",
    },
  ],
};

const alterAndDrop: Lesson = {
  status: "ready",
  slug: "alter-and-drop",
  number: 13,
  title: "Changing and removing tables",
  minutes: 12,
  summary: "Add or rename columns with ALTER TABLE, and remove tables with DROP TABLE.",
  video: { title: "Renovating the shop" },
  practiceDb: {
    seed: `${AUTHORS}\n${CUSTOMERS}\nCREATE TABLE books (id INTEGER PRIMARY KEY, title TEXT NOT NULL, author_id INTEGER REFERENCES authors(id), price REAL, stock INTEGER);\nCREATE TABLE old_promotions (id INTEGER PRIMARY KEY, code TEXT);`,
  },
  body: `
Shops get renovated. A new shelf goes up, a label gets changed, an old display is taken down. Tables change too. Your practice database has \`authors\`, \`customers\`, \`books\` and an old \`old_promotions\` table.

**Add a column** to an existing table:

\`\`\`sql
ALTER TABLE customers ADD COLUMN phone TEXT;
\`\`\`

Existing rows get an empty value (\`NULL\`) in the new column, or the \`DEFAULT\` if you give one.

**Rename a column** or **rename a table**:

\`\`\`sql
ALTER TABLE books RENAME COLUMN stock TO copies_in_stock;
ALTER TABLE customers RENAME TO shoppers;
\`\`\`

**Remove a table completely** with \`DROP TABLE\`:

\`\`\`sql
DROP TABLE old_promotions;
\`\`\`

⚠️ \`DROP TABLE\` deletes the table **and every row in it**, permanently. There's no undo button in most databases. At work, people back up first and double-check the table name. Here in practice, the Reset button brings everything back.
`,
  keyIdeas: [
    "ALTER TABLE ... ADD COLUMN adds a column to an existing table.",
    "ALTER TABLE ... RENAME COLUMN ... TO ... renames a column; RENAME TO renames the table.",
    "DROP TABLE removes a table and all its data permanently, so use it with care.",
  ],
  exercises: [
    {
      type: "sql",
      id: "add-phone",
      kind: "Write a query",
      prompt: "The shop wants to store phone numbers. Add a phone column (text) to the customers table.",
      starter: "ALTER TABLE customers\n",
      answer: "ALTER TABLE customers ADD COLUMN phone TEXT;",
      checkQuery: shape("customers"),
      mismatch: "The customers table should end up with a new last column called phone, of type TEXT.",
      hint: "ALTER TABLE customers ADD COLUMN phone TEXT;",
      xp: 25,
    },
    {
      type: "sql",
      id: "rename-stock",
      kind: "Write a query",
      prompt: "Rename the stock column in books to copies_in_stock, so it's clearer.",
      starter: "",
      answer: "ALTER TABLE books RENAME COLUMN stock TO copies_in_stock;",
      checkQuery: shape("books"),
      mismatch: "Only the stock column should change, and its new name is copies_in_stock.",
      hint: "ALTER TABLE books RENAME COLUMN old_name TO new_name;",
      xp: 25,
    },
    {
      type: "sql",
      id: "drop-promotions",
      kind: "Write a query",
      prompt: "The old_promotions table is no longer used. Remove it, and leave every other table in place.",
      starter: "",
      answer: "DROP TABLE old_promotions;",
      checkQuery: "SELECT name FROM sqlite_master WHERE type = 'table' ORDER BY name",
      mismatch: "Only old_promotions should be gone. The authors, books and customers tables must stay.",
      hint: "DROP TABLE followed by the table's name.",
      xp: 25,
    },
  ],
  quiz: [
    {
      question: "You add a phone column to a customers table that already has 500 rows. What's in phone for those rows?",
      choices: ["NULL, or the DEFAULT if you set one", "The number 0", "The command fails"],
      answer: 0,
      why: "Existing rows have no value for the new column, so they get NULL unless a DEFAULT is given.",
    },
    {
      question: "What does DROP TABLE books; remove?",
      choices: ["Only the rows", "Only the column names", "The whole table and all its rows"],
      answer: 2,
      why: "DROP removes the structure and the data together. To remove only rows, you'd use DELETE (Module 3).",
    },
    {
      question: "Which family do ALTER and DROP belong to?",
      choices: ["DDL", "DML", "DCL"],
      answer: 0,
      why: "They change the structure, so they're Data Definition Language, like CREATE.",
    },
  ],
};

export const module2Lessons: Lesson[] = [createTable, dataTypes, primaryKeys, constraints, foreignKeys, alterAndDrop];
