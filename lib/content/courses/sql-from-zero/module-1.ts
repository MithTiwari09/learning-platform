import type { Lesson } from "../../types";

/** Module 1: How a database thinks. Intuition first, no code. */

const whatIsADatabase: Lesson = {
  status: "ready",
  slug: "what-is-a-database",
  number: 1,
  title: "What is a database?",
  minutes: 8,
  summary: "Why apps keep their data in databases, and what SQL is for.",
  video: {
    title: "A library, not a pile of books",
    src: "/videos/sql-01-what-is-a-database.mp4",
    poster: "/videos/sql-01-what-is-a-database.jpg",
  },
  body: `
Imagine a bookshop that keeps its records in a notebook. Every time someone buys a book, the owner writes it down. That works for ten customers. With ten thousand customers, finding "everything Yuki bought last year" means flipping through hundreds of pages.

A spreadsheet is a better notebook. But spreadsheets start to struggle when lots of people use them at once, when the same information is copied in many places, and when one wrong edit can quietly break everything.

A **database** is like a well-run library. Every book has a fixed place. There are rules about what can go where. A librarian can find any book in seconds, many people can borrow books at the same time, and nothing gets lost.

**SQL** (say "sequel" or "S-Q-L") is the language you use to talk to that librarian. You don't tell the librarian *how* to walk through the shelves. You just say *what* you want, like "all books by Agatha Christie under $10", and the database works out how to get it.

Almost every app you use, from banking and shopping to food delivery and school portals, has a database behind it.
`,
  keyIdeas: [
    "A database stores information in an organised way, with rules, so it stays correct and quick to search.",
    "SQL is the language for asking a database questions and giving it instructions.",
    "With SQL you describe what you want, not how to find it.",
  ],
  exercises: [
    {
      type: "sort",
      id: "spreadsheet-or-database",
      prompt: "Which of these needs a database, and which is fine in a spreadsheet?",
      groups: ["Spreadsheet is fine", "Needs a database"],
      items: [
        { text: "Your personal monthly budget", group: "Spreadsheet is fine" },
        { text: "A train booking site used by millions of people", group: "Needs a database" },
        { text: "One teacher's class list", group: "Spreadsheet is fine" },
        { text: "A hospital's patient records", group: "Needs a database" },
        { text: "Planning a birthday party guest list", group: "Spreadsheet is fine" },
        { text: "An online shop taking 50,000 orders a day", group: "Needs a database" },
      ],
      hint: "Think about how many people use it at once, and how bad a mistake would be.",
      xp: 20,
    },
  ],
  quiz: [
    {
      question: "What does SQL let you do?",
      choices: [
        "Design web pages",
        "Ask a database for data and give it instructions",
        "Draw charts in a spreadsheet",
      ],
      answer: 1,
      why: "SQL is the language databases understand: you use it to ask questions and to add or change data.",
    },
    {
      question: "When you write SQL, what do you describe?",
      choices: ["What you want", "Exactly how to search, step by step", "Which hard drive to read"],
      answer: 0,
      why: "You say what you want. The database works out how to find it.",
    },
    {
      question: "Which most needs a database?",
      choices: ["A shopping list", "An online store with 50,000 orders a day", "A to-do list"],
      answer: 1,
      why: "Lots of data, lots of people at once and real money involved: that's exactly what databases are built for.",
    },
  ],
};

const dbmsAndRdbms: Lesson = {
  status: "ready",
  slug: "dbms-and-rdbms",
  number: 2,
  title: "DBMS and RDBMS",
  minutes: 10,
  summary: "The software that runs a database, and why most of it today is relational.",
  video: {
    title: "The librarian behind the library",
    src: "/videos/sql-02-dbms-and-rdbms.mp4",
    poster: "/videos/sql-02-dbms-and-rdbms.jpg",
  },
  body: `
In the last lesson you met a short word: **DBMS**, a database management system. Let's open it up.

Think of the library again. The books on the shelves are the **database**: the data itself. The librarians, the catalogue and the rules about borrowing are the **DBMS**: the software that looks after the data. It stores it, finds it when you ask, stops two people from getting in each other's way, and keeps it safe if the power fails. You never touch the shelves directly. You always go through the librarian.

Early database software stored data in different shapes. Some kept it like a family tree, where every record had exactly one parent above it: the shop, then each author, then that author's books. That worked until data didn't fit the tree. *Good Omens* was written by Terry Pratchett and Neil Gaiman together, so it had to be copied under both authors, and copies can drift apart.

In 1970, a researcher at IBM called Edgar Codd suggested a simpler idea: keep all data in **tables** of rows and columns, and link tables together using shared values called **keys**. A table in this idea is called a *relation*, so this is the **relational** model. Software built this way is a **relational database management system**, or **RDBMS**.

| customers.id | name | city |
|---|---|---|
| 1 | Emma | London |
| 2 | Yuki | Tokyo |

| orders.id | customer_id | book |
|---|---|---|
| 101 | 2 | Sapiens |
| 102 | 1 | Small Gods |
| 103 | 2 | Norwegian Wood |

Orders 101 and 103 both say customer 2, so both are Yuki's. Her name is written only once, so it can never disagree with itself.

So what's the difference?

| | DBMS | RDBMS |
|---|---|---|
| What it is | Any software that manages a database | A DBMS that stores data in linked tables |
| How data is shaped | Could be files, trees, documents or tables | Always tables of rows and columns |
| Links between data | Not always enforced | Tables are linked with keys, and the links are checked |
| Language | Varies | SQL |
| Examples | Any of the ones on the right, plus older or special-purpose systems | MySQL, PostgreSQL, Oracle, SQL Server, SQLite |

The simplest way to remember it: **every RDBMS is a DBMS, but not every DBMS is relational.** Every square is a rectangle, but not every rectangle is a square.

Today, most business databases are relational. Your bank, airline bookings, online shops and payroll almost certainly run on an RDBMS. Some apps also use non-relational databases, often called **NoSQL**, such as MongoDB or Redis, for special jobs. This course is about relational databases, because that's where SQL lives.
`,
  keyIdeas: [
    "A DBMS is the software that stores, finds and protects the data in a database.",
    "An RDBMS is a DBMS that keeps data in tables linked by keys, and you talk to it with SQL.",
    "Every RDBMS is a DBMS, but not every DBMS is relational. Most business databases today are relational.",
  ],
  exercises: [
    {
      type: "sort",
      id: "every-dbms-or-rdbms",
      prompt: "Is each statement true of every DBMS, or only of a relational one (RDBMS)?",
      groups: ["Every DBMS", "Only an RDBMS"],
      items: [
        { text: "Software that manages a database", group: "Every DBMS" },
        { text: "Stores data so it can be found again later", group: "Every DBMS" },
        { text: "Controls who is allowed to see or change the data", group: "Every DBMS" },
        { text: "Keeps all data in tables of rows and columns", group: "Only an RDBMS" },
        { text: "Links tables together using keys", group: "Only an RDBMS" },
        { text: "Uses SQL as its language", group: "Only an RDBMS" },
      ],
      hint: "Think about what makes a database “relational”: tables, and links between them.",
      xp: 20,
    },
  ],
  quiz: [
    {
      question: "What is a DBMS?",
      choices: ["A type of spreadsheet", "The software that manages a database", "A programming language"],
      answer: 1,
      why: "The DBMS is the librarian: the software that stores, finds and protects the data.",
    },
    {
      question: "What makes a database “relational”?",
      choices: ["It's very large", "Its data lives in tables that are linked by keys", "It runs in the cloud"],
      answer: 1,
      why: "“Relation” is the formal name for a table, and the links between tables are what make it relational.",
    },
    {
      question: "Which of these is true?",
      choices: ["Every RDBMS is a DBMS", "Every DBMS is an RDBMS", "DBMS and RDBMS mean exactly the same thing"],
      answer: 0,
      why: "An RDBMS is one kind of DBMS: the kind that uses linked tables.",
    },
  ],
};

const tablesRowsKeys: Lesson = {
  status: "ready",
  slug: "tables-rows-and-keys",
  number: 3,
  title: "Tables, rows, columns and keys",
  minutes: 10,
  summary: "How a database organises information, using a school register as the example.",
  video: {
    title: "The school register",
    src: "/videos/sql-03-tables-rows-and-keys.mp4",
    poster: "/videos/sql-03-tables-rows-and-keys.jpg",
  },
  body: `
Think of a school attendance register. Across the top are headings: Roll number, Name, Class. Each line below is one student.

A database **table** works the same way. The headings are **columns**: each one holds one kind of information, like a name or a price. Each line is a **row**: one complete record, like one student or one book.

Two students can have the same name. So how does the school tell them apart? By the **roll number**. No two students share one. In a database this is called the **primary key**: a value that identifies exactly one row.

A database usually has several tables that are linked together. Our bookshop has a \`books\` table and an \`authors\` table. Instead of typing "Agatha Christie" next to every one of her books, each book stores the author's ID number, say 6. That ID points to her row in the \`authors\` table. A column that points to another table like this is called a **foreign key**.

| books.id | title | author_id |
|---|---|---|
| 10 | Murder on the Orient Express | 6 |
| 11 | And Then There Were None | 6 |

| authors.id | name | country |
|---|---|---|
| 6 | Agatha Christie | UK |

Why bother? If an author's name is spelled wrong, you fix it in one place, and every book that points to that author is correct straight away.
`,
  keyIdeas: [
    "A table is like a register: columns are the headings, rows are the records.",
    "A primary key uniquely identifies each row, like a roll number.",
    "A foreign key links a row to a row in another table, so information is stored once and shared.",
  ],
  exercises: [
    {
      type: "sort",
      id: "name-the-part",
      prompt: "In the bookshop's books table, what is each of these?",
      groups: ["Column", "Row", "Primary key", "Foreign key"],
      items: [
        { text: "title", group: "Column" },
        { text: "Everything about the book “Sapiens”", group: "Row" },
        { text: "books.id", group: "Primary key" },
        { text: "books.author_id", group: "Foreign key" },
        { text: "price", group: "Column" },
      ],
      hint: "A foreign key points to another table. A primary key identifies a row in its own table.",
      xp: 20,
    },
  ],
  quiz: [
    {
      question: "In the books table, what is one row?",
      choices: ["One book", "All the prices", "One author"],
      answer: 0,
      why: "Each row is one complete record. In the books table, that's one book.",
    },
    {
      question: "Why not use a book's title as its primary key?",
      choices: ["Titles are too long", "Two different books can have the same title", "Titles can't be stored as text"],
      answer: 1,
      why: "A primary key must be unique. Titles can repeat, so we use an ID number instead.",
    },
    {
      question: "books.author_id points to which table?",
      choices: ["customers", "orders", "authors"],
      answer: 2,
      why: "It's a foreign key: it stores an id from the authors table.",
    },
  ],
};

const whatHappensWhenYouRunAQuery: Lesson = {
  status: "ready",
  slug: "what-happens-when-you-run-a-query",
  number: 4,
  title: "What happens when you run a query",
  minutes: 12,
  summary: "Follow one question through the database engine: parse, plan, execute, return.",
  video: {
    title: "Ordering at a restaurant",
    src: "/videos/sql-04-what-happens-when-you-run-a-query.mp4",
    poster: "/videos/sql-04-what-happens-when-you-run-a-query.jpg",
  },
  body: `
Let's follow one question on its journey through the database: "Show me the titles of all Fantasy books." Think of it like ordering food at a restaurant.

**1. You place your order.** You write your SQL and press Run. That's like telling the waiter what you want.

**2. The waiter checks the order makes sense.** Is everything on the menu? Is the order written clearly? The database's **parser** does this. It checks your SQL's grammar and makes sure the table and columns you named really exist. If you misspell \`books\` as \`bokks\`, this is where you get an error, before any work starts.

**3. The head chef plans the work.** There's often more than one way to make a dish, and some are faster. The database's **planner** (also called the optimiser) looks at your question and picks the quickest route. Should it read every single book? Or is there a shortcut, like an index of genres? You never have to decide this. The planner does it for you.

**4. The kitchen cooks.** The **executor** follows the plan. It fetches the rows from storage, keeps the ones where the genre is Fantasy, and picks out just the title column.

**5. Your food is served.** The finished result comes back to you as a neat little table.

All of this usually takes a fraction of a second. And it's why SQL lets you say *what* you want rather than *how*: the planner and executor take care of the how.
`,
  keyIdeas: [
    "A query goes through four steps: parse (check it), plan (choose the fastest route), execute (fetch the data), then return the result.",
    "Spelling and grammar mistakes are caught at the parse step, before any data is touched.",
    "The planner chooses how to find your data, so you only describe what you want.",
  ],
  exercises: [
    {
      type: "journey",
      id: "follow-the-query",
      prompt: "Press Run and follow the query through the engine.",
      query: "SELECT title FROM books WHERE genre = 'Fantasy';",
      stations: [
        {
          name: "Parser",
          analogy: "The waiter checks your order",
          detail:
            "Checks the grammar, and that the table books and the columns title and genre exist. All good, so the query moves on.",
        },
        {
          name: "Planner",
          analogy: "The head chef plans the dish",
          detail:
            "Looks for the fastest route. There's no index on genre, so the plan is: read every book and keep the Fantasy ones.",
        },
        {
          name: "Executor",
          analogy: "The kitchen cooks",
          detail:
            "Reads all 20 books from storage, keeps the 3 where genre is Fantasy, and picks out just the title column.",
        },
        {
          name: "Result",
          analogy: "Your food is served",
          detail: "Guards! Guards!, Small Gods and A Wizard of Earthsea come back to you as a small table.",
        },
      ],
      xp: 10,
    },
    {
      type: "order",
      id: "order-the-steps",
      prompt: "Put the engine's steps in the right order.",
      steps: [
        "Parse: check the SQL makes sense",
        "Plan: choose the fastest way to find the data",
        "Execute: fetch the rows from storage",
        "Return: send the result back to you",
      ],
      hint: "Think of the restaurant: waiter, head chef, kitchen, then your table.",
      xp: 20,
    },
    {
      type: "sort",
      id: "where-does-it-break",
      prompt: "Each of these queries has a problem. Which station would notice it?",
      groups: ["Parser", "Executor"],
      items: [
        { text: "SELECT title FROM bokks;  (the table name is misspelled)", group: "Parser" },
        { text: "SELECT title books;  (the word FROM is missing)", group: "Parser" },
        {
          text: "INSERT a book with an author_id of 999, but no author 999 exists",
          group: "Executor",
        },
      ],
      hint: "The parser only checks that the query makes sense. Problems with the actual data show up when rows are fetched or changed.",
      xp: 20,
    },
  ],
  quiz: [
    {
      question: "Which step catches a misspelled column name?",
      choices: ["The parser", "The executor", "Nothing catches it"],
      answer: 0,
      why: "The parser checks the query and the names in it before any data is touched.",
    },
    {
      question: "Who decides the fastest way to find the data?",
      choices: ["You, in your SQL", "The planner", "The parser"],
      answer: 1,
      why: "The planner (or optimiser) picks the route, for example whether to use an index.",
    },
    {
      question: "Do you need to tell SQL which order to search the rows in?",
      choices: ["Yes, always", "No, the planner works that out", "Only for big tables"],
      answer: 1,
      why: "You describe what you want. Choosing how to search is the planner's job.",
    },
  ],
};

const indexes: Lesson = {
  status: "ready",
  slug: "indexes",
  number: 5,
  title: "How the database finds things fast",
  minutes: 10,
  summary: "Full table scans, indexes, and why indexes aren't free.",
  video: {
    title: "The index at the back of the book",
    src: "/videos/sql-05-indexes.mp4",
    poster: "/videos/sql-05-indexes.jpg",
  },
  body: `
Pick up a big textbook and try to find every page that mentions "photosynthesis". You could read all 500 pages from start to finish. That works, but it's slow. Or you could turn to the **index** at the back, find "photosynthesis: pages 42, 87, 233", and jump straight there.

Databases face the same choice. Reading every row in a table is called a **full table scan**. It's fine for 20 books, but painful for 20 million.

So a database can keep an **index** on a column. An index is a sorted list of that column's values, and each value points to where its rows live. If there's an index on \`genre\`, a search for Fantasy books jumps straight to the right rows.

Remember the planner from the last lesson? This is exactly the kind of choice it makes: "There's an index on genre, so I'll use it instead of reading every row."

Indexes aren't free, though. Just as a textbook's index has to be updated whenever pages change, the database has to update an index every time you add or change a row. So you add indexes to the columns people search on a lot, not to every column.
`,
  keyIdeas: [
    "Without an index, the database reads every row: a full table scan.",
    "An index is like a book's index: a sorted shortcut to the right rows.",
    "Indexes make searching faster but make adding and changing data a little slower, so use them where they help most.",
  ],
  exercises: [
    {
      type: "sort",
      id: "index-or-not",
      prompt:
        "The bookshop has millions of orders. Which columns deserve an index?",
      groups: ["Worth an index", "Probably not"],
      items: [
        { text: "orders.customer_id (every “my orders” page searches it)", group: "Worth an index" },
        { text: "books.title (the search box uses it all day)", group: "Worth an index" },
        { text: "books.stock (rarely searched, changes with every sale)", group: "Probably not" },
        { text: "customers.joined_on (only used in a yearly report)", group: "Probably not" },
      ],
      hint: "Index columns that are searched often. Skip ones that are rarely searched, especially if they change all the time.",
      xp: 20,
    },
  ],
  quiz: [
    {
      question: "What is a full table scan?",
      choices: ["Reading every row to find the matches", "Copying a table", "Deleting a table"],
      answer: 0,
      why: "Without a shortcut, the database checks every row one by one.",
    },
    {
      question: "Why not put an index on every column?",
      choices: [
        "Indexes are only allowed on one column",
        "Each index slows down adding and changing data",
        "Indexes make searching slower",
      ],
      answer: 1,
      why: "Every index must be kept up to date whenever rows change, which costs time and space.",
    },
    {
      question: "A book's index is like a database index because…",
      choices: [
        "It lists every word in the book",
        "It points straight to where the information is",
        "It is at the back",
      ],
      answer: 1,
      why: "Both are sorted shortcuts that take you straight to the right place.",
    },
  ],
};

const transactions: Lesson = {
  status: "ready",
  slug: "transactions",
  number: 6,
  title: "Keeping data safe: transactions",
  minutes: 12,
  summary: "All-or-nothing changes, the ACID promises, and how a database survives a crash.",
  video: {
    title: "The $50 that must not vanish",
    src: "/videos/sql-06-transactions.mp4",
    poster: "/videos/sql-06-transactions.jpg",
  },
  body: `
Emma sends $50 to Lucas. For the database, that's two steps: take $50 out of Emma's account, then add $50 to Lucas's.

Now imagine the power goes out right after step one. Emma's money is gone, and Lucas never received it. $50 has disappeared.

Databases stop this with a **transaction**: a group of steps that must all succeed together or not happen at all. It's like a sealed envelope. Either the whole envelope is delivered, or it's returned to sender unopened. Half a letter never arrives.

A transaction makes four promises, known as **ACID**:

- **Atomic:** all or nothing. Both steps happen, or neither does.
- **Consistent:** the rules always hold. For example, a balance can never go below zero if that's a rule.
- **Isolated:** if two people make changes at the same time, they don't trip over each other. It's as if they took turns.
- **Durable:** once the database says "saved", it stays saved, even if the power fails a second later.

How does it keep that last promise? Before changing anything, the database writes a note in a diary called the **log**: "about to move $50 from Emma to Lucas". If something crashes, it reads the diary when it restarts and either finishes the job or cleanly undoes it.

Later in the course you'll control transactions yourself with \`BEGIN\`, \`COMMIT\` and \`ROLLBACK\`.
`,
  keyIdeas: [
    "A transaction groups changes so they all happen or none do.",
    "ACID stands for Atomic, Consistent, Isolated and Durable.",
    "The database keeps a log so it can recover safely after a crash.",
  ],
  exercises: [
    {
      type: "sort",
      id: "match-acid",
      prompt: "Match each everyday situation to the ACID promise it shows.",
      groups: ["Atomic", "Consistent", "Isolated", "Durable"],
      items: [
        { text: "The power fails mid-transfer, and neither account changes", group: "Atomic" },
        { text: "A rule says stock can't go below zero, so a sale of a sold-out book is refused", group: "Consistent" },
        { text: "Two people buy the last copy at the same moment, and only one gets it", group: "Isolated" },
        { text: "The site says “order placed”, the server restarts, and the order is still there", group: "Durable" },
      ],
      hint: "Atomic is all-or-nothing, Consistent is about rules, Isolated is about people at the same time, and Durable is about surviving crashes.",
      xp: 25,
    },
  ],
  quiz: [
    {
      question: "What does “atomic” mean for a transaction?",
      choices: ["It runs very fast", "All of its steps happen, or none of them do", "It changes only one row"],
      answer: 1,
      why: "Atomic means it can't be split: there's no half-finished state.",
    },
    {
      question: "The power fails just after the database said “saved”. Is the change kept?",
      choices: ["Yes, that's durability", "No, it's lost", "Only if someone presses Save again"],
      answer: 0,
      why: "Durable means a saved change survives crashes and power cuts.",
    },
    {
      question: "What does the database use to recover after a crash?",
      choices: ["A backup from last week", "Its log", "The index"],
      answer: 1,
      why: "The log records what it was about to do, so it can finish or undo the work.",
    },
  ],
};

const commandFamilies: Lesson = {
  status: "ready",
  slug: "sql-command-families",
  number: 7,
  title: "SQL's five families of commands",
  minutes: 10,
  summary: "DDL, DML, DQL, TCL and DCL: the map for the rest of the course.",
  video: { title: "Running a shop" },
  body: `
SQL has many commands, but they fall into five families. Think about running our bookshop's database the way you'd run a real shop.

| Family | Shop analogy | Main commands | Example |
|---|---|---|---|
| **DDL**, Data Definition Language | Build the shelves | \`CREATE\`, \`ALTER\`, \`DROP\` | Create a books table |
| **DML**, Data Manipulation Language | Stock the shelves | \`INSERT\`, \`UPDATE\`, \`DELETE\` | Add a new book, change a price |
| **DQL**, Data Query Language | Ask questions | \`SELECT\` | Which books cost under $10? |
| **TCL**, Transaction Control Language | Make each sale all-or-nothing | \`BEGIN\`, \`COMMIT\`, \`ROLLBACK\` | Undo a half-finished price update |
| **DCL**, Data Control Language | Hand out keys | \`GRANT\`, \`REVOKE\` | Let an intern read orders, but not delete them |

Some people count \`SELECT\` as part of DML. Either way, it's the command you'll use most.

This is also the map of this course. Next, you'll start building: writing your first \`CREATE TABLE\` and putting up the bookshop's shelves.
`,
  keyIdeas: [
    "DDL builds the structure: CREATE, ALTER, DROP.",
    "DML changes the data: INSERT, UPDATE, DELETE. DQL asks questions with SELECT.",
    "TCL makes changes all-or-nothing: BEGIN, COMMIT, ROLLBACK. DCL controls who can do what: GRANT, REVOKE.",
  ],
  exercises: [
    {
      type: "sort",
      id: "sort-the-commands",
      prompt: "Sort each command into its family.",
      groups: ["DDL", "DML", "DQL", "TCL", "DCL"],
      items: [
        { text: "CREATE", group: "DDL" },
        { text: "DROP", group: "DDL" },
        { text: "INSERT", group: "DML" },
        { text: "UPDATE", group: "DML" },
        { text: "SELECT", group: "DQL" },
        { text: "COMMIT", group: "TCL" },
        { text: "ROLLBACK", group: "TCL" },
        { text: "GRANT", group: "DCL" },
      ],
      hint: "Building is DDL, changing data is DML, asking is DQL, saving or undoing is TCL, permissions are DCL.",
      xp: 20,
    },
    {
      type: "sort",
      id: "which-family-for-the-job",
      prompt: "Which family would you use for each task?",
      groups: ["DDL", "DML", "DQL", "TCL", "DCL"],
      items: [
        { text: "Add a phone number column to customers", group: "DDL" },
        { text: "Fix a typo in a book's title", group: "DML" },
        { text: "Find all pending orders", group: "DQL" },
        { text: "Undo a half-finished price update", group: "TCL" },
        { text: "Let the accountant read the orders table", group: "DCL" },
      ],
      hint: "Adding a column changes the structure. Fixing a typo changes the data.",
      xp: 25,
    },
  ],
  quiz: [
    {
      question: "CREATE TABLE belongs to which family?",
      choices: ["DML", "DDL", "DCL"],
      answer: 1,
      why: "Creating tables builds the structure, which is Data Definition Language.",
    },
    {
      question: "You want to change a book's price. Which family?",
      choices: ["DML, using UPDATE", "DDL, using ALTER", "TCL, using COMMIT"],
      answer: 0,
      why: "Changing the data inside a table is Data Manipulation Language.",
    },
    {
      question: "Which family includes ROLLBACK?",
      choices: ["DQL", "DCL", "TCL"],
      answer: 2,
      why: "ROLLBACK undoes a transaction, so it's Transaction Control Language.",
    },
  ],
};

export const module1Lessons: Lesson[] = [
  whatIsADatabase,
  dbmsAndRdbms,
  tablesRowsKeys,
  whatHappensWhenYouRunAQuery,
  indexes,
  transactions,
  commandFamilies,
];
