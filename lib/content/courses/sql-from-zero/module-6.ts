import type { Lesson } from "../../types";
import { BOOKSHOP_SEED } from "../../datasets/bookshop";

/** Module 6: TCL, keeping changes safe. */

/** The bookshop plus customers' gift cards, for moving money between them. */
const bookshopWithGiftCards = {
  seed: `${BOOKSHOP_SEED}
CREATE TABLE gift_cards(id INTEGER PRIMARY KEY, customer_id INTEGER REFERENCES customers(id), balance REAL NOT NULL CHECK (balance >= 0));
INSERT INTO gift_cards VALUES (1, 1, 50.00), (2, 4, 20.00), (3, 5, 35.00), (4, 7, 10.00);`,
  showBookshopTables: true,
};

const giftCardsTable = `
| gift_cards.id | customer | balance |
|---|---|---|
| 1 | Emma Johnson (customer 1) | $50.00 |
| 2 | Oliver Brown (customer 4) | $20.00 |
| 3 | Yuki Tanaka (customer 5) | $35.00 |
| 4 | Sofia Rossi (customer 7) | $10.00 |
`;

const balances = "SELECT id, balance FROM gift_cards ORDER BY id";

const beginAndCommit: Lesson = {
  status: "ready",
  slug: "begin-and-commit",
  number: 28,
  title: "BEGIN and COMMIT",
  minutes: 14,
  summary: "Group changes so they all happen together, or not at all.",
  video: { title: "All or nothing" },
  practiceDb: bookshopWithGiftCards,
  body: `
Emma wants to give $20 from her gift card to her friend Oliver. That's two changes:

1. Take $20 off Emma's card.
2. Add $20 to Oliver's card.

What if the power cuts out between step 1 and step 2? Emma has lost $20, and Oliver never got it. The money has simply vanished.

A **transaction** fixes this. It wraps several changes into one package that either happens completely or not at all. These are the **TCL** (Transaction Control Language) commands:

\`\`\`sql
BEGIN;
UPDATE gift_cards SET balance = balance - 20 WHERE id = 1;
UPDATE gift_cards SET balance = balance + 20 WHERE id = 2;
COMMIT;
\`\`\`

- **BEGIN** says "start a package of changes".
- **COMMIT** says "I'm done, make all of it permanent".

Until \`COMMIT\`, the changes are a draft. If anything goes wrong before then, the database throws the draft away, so it's never left half-done. That "all or nothing" promise is called being **atomic**.

This lesson's practice database has a new \`gift_cards\` table:
${giftCardsTable}
Run \`SELECT * FROM gift_cards;\` to see it.
`,
  keyIdeas: [
    "A transaction groups changes so they all happen, or none do.",
    "BEGIN starts the transaction, and COMMIT makes every change in it permanent.",
    "Use one whenever several changes only make sense together, like moving money.",
  ],
  exercises: [
    {
      type: "order",
      id: "transfer-steps",
      prompt: "Put the steps of a safe gift card transfer in the right order.",
      steps: [
        "BEGIN",
        "Take $20 off Emma's card",
        "Add $20 to Oliver's card",
        "COMMIT",
      ],
      hint: "The transaction opens first and is sealed last. The changes go in between.",
      xp: 20,
    },
    {
      type: "sql",
      id: "transfer",
      kind: "Write a query",
      prompt: "Inside a transaction, move $20 from gift card 1 (Emma) to gift card 2 (Oliver).",
      starter: "BEGIN;\n\nCOMMIT;",
      answer:
        "BEGIN; UPDATE gift_cards SET balance = balance - 20 WHERE id = 1; UPDATE gift_cards SET balance = balance + 20 WHERE id = 2; COMMIT;",
      checkQuery: balances,
      mismatch: "The balances aren't right yet. Card 1 should go down by $20 and card 2 should go up by $20.",
      hint: "Between BEGIN and COMMIT: UPDATE gift_cards SET balance = balance - 20 WHERE id = 1; then the same with + 20 for id 2.",
      xp: 30,
    },
    {
      type: "sql",
      id: "pay-with-card",
      kind: "Challenge",
      prompt:
        "Sofia (customer 7) buys a $9.99 book with her gift card (card 4). In one transaction, add a 'pending' order for her dated '2025-09-20', and take $9.99 off her card.",
      starter: "BEGIN;\n\nCOMMIT;",
      answer:
        "BEGIN; INSERT INTO orders (customer_id, order_date, status) VALUES (7, '2025-09-20', 'pending'); UPDATE gift_cards SET balance = balance - 9.99 WHERE id = 4; COMMIT;",
      checkQuery:
        "SELECT (SELECT COUNT(*) FROM orders WHERE customer_id = 7 AND order_date = '2025-09-20' AND status = 'pending'), (SELECT balance FROM gift_cards WHERE id = 4)",
      mismatch: "Not both changes are there yet. You need one new pending order for customer 7 and $9.99 less on card 4.",
      hint: "An INSERT INTO orders (customer_id, order_date, status) and an UPDATE gift_cards ... WHERE id = 4, both between BEGIN and COMMIT.",
      xp: 50,
    },
  ],
  quiz: [
    {
      question: "The power cuts out after the first UPDATE, before COMMIT. What happens to Emma's $20?",
      choices: [
        "It's back on her card, because the unfinished transaction is thrown away",
        "It's gone",
        "It's on Oliver's card",
      ],
      answer: 0,
      why: "Nothing is permanent until COMMIT, so the database undoes the half-finished change.",
    },
    {
      question: "What does COMMIT do?",
      choices: ["Makes every change since BEGIN permanent", "Undoes every change since BEGIN", "Starts a transaction"],
      answer: 0,
      why: "COMMIT seals the package. BEGIN starts it, and ROLLBACK (next lesson) undoes it.",
    },
    {
      question: "Which of these most needs a transaction?",
      choices: [
        "Moving stock from one warehouse row to another",
        "Looking up a book's price",
        "Listing all customers",
      ],
      answer: 0,
      why: "Two changes that only make sense together need all or nothing. Reading data changes nothing.",
    },
  ],
};

const rollback: Lesson = {
  status: "ready",
  slug: "rollback",
  number: 29,
  title: "Undoing with ROLLBACK",
  minutes: 12,
  summary: "Change your mind before it's too late, and undo everything since BEGIN.",
  video: { title: "The undo button" },
  practiceDb: bookshopWithGiftCards,
  body: `
\`COMMIT\` keeps the changes. Its opposite is **ROLLBACK**, which throws away every change since \`BEGIN\`, as if they never happened:

\`\`\`sql
BEGIN;
UPDATE books SET price = 0;   -- Oops! Forgot the WHERE
SELECT title, price FROM books;   -- Every price is 0...
ROLLBACK;                     -- ...and now they're all back
\`\`\`

That's a safety net worth getting used to. When you're about to change a lot of data:

1. \`BEGIN\`
2. Make the change.
3. Look at the result with a \`SELECT\`.
4. If it's right, \`COMMIT\`. If it's wrong, \`ROLLBACK\`.

**Roll back when something goes wrong part-way.** Gift card 99 doesn't exist, so here the second \`UPDATE\` changes nothing, without an error. If you \`COMMIT\` anyway, $50 disappears from Emma's card:

\`\`\`sql
BEGIN;
UPDATE gift_cards SET balance = balance - 50 WHERE id = 1;
UPDATE gift_cards SET balance = balance + 50 WHERE id = 99;  -- no such card!
ROLLBACK;  -- so cancel the whole transfer
\`\`\`

Apps do this automatically: if any step fails, they roll back instead of committing.

**After COMMIT, it's too late.** ROLLBACK only undoes the transaction that's still open.

This lesson uses the same gift cards as the last one:
${giftCardsTable}`,
  keyIdeas: [
    "ROLLBACK throws away every change since BEGIN.",
    "Check the result with a SELECT before you COMMIT, and roll back if it's wrong.",
    "After COMMIT, ROLLBACK can no longer undo those changes.",
  ],
  exercises: [
    {
      type: "sql",
      id: "undo-prices",
      kind: "Fix the query",
      prompt: "Oops: this sets every book's price to 0. Add one line at the end so that no price changes.",
      starter: "BEGIN;\nUPDATE books SET price = 0;\n",
      answer: "BEGIN; UPDATE books SET price = 0; ROLLBACK;",
      checkQuery: "SELECT id, price FROM books ORDER BY id",
      mismatch: "Some prices are still 0. End the transaction with ROLLBACK to undo everything since BEGIN.",
      hint: "Add ROLLBACK; on the last line.",
      xp: 25,
    },
    {
      type: "sql",
      id: "missing-card",
      kind: "Fix the query",
      prompt: "Gift card 99 doesn't exist, so this transfer would lose Emma's $50. Change it so that no balance changes.",
      starter:
        "BEGIN;\nUPDATE gift_cards SET balance = balance - 50 WHERE id = 1;\nUPDATE gift_cards SET balance = balance + 50 WHERE id = 99;\nCOMMIT;",
      answer:
        "BEGIN; UPDATE gift_cards SET balance = balance - 50 WHERE id = 1; UPDATE gift_cards SET balance = balance + 50 WHERE id = 99; ROLLBACK;",
      checkQuery: balances,
      mismatch: "Emma's card is still down $50. Cancel the transfer with ROLLBACK instead of COMMIT.",
      hint: "Replace COMMIT with ROLLBACK.",
      xp: 30,
    },
    {
      type: "sort",
      id: "commit-or-rollback",
      prompt: "You've just checked your changes with a SELECT. Should you COMMIT or ROLLBACK?",
      groups: ["COMMIT", "ROLLBACK"],
      items: [
        { text: "Only the 3 books you meant to change have new prices", group: "COMMIT" },
        { text: "Every book now has a price of 0", group: "ROLLBACK" },
        { text: "The money left one card but never reached the other", group: "ROLLBACK" },
        { text: "The new order and the gift card payment are both there", group: "COMMIT" },
        { text: "You deleted 200 orders when you expected 2", group: "ROLLBACK" },
      ],
      hint: "Keep it if it's exactly what you meant. Undo it if anything is off.",
      xp: 20,
    },
  ],
  quiz: [
    {
      question: "What does ROLLBACK undo?",
      choices: ["Every change since BEGIN", "Only the last statement", "Everything ever done to the database"],
      answer: 0,
      why: "ROLLBACK cancels the whole open transaction.",
    },
    {
      question: "You ran BEGIN, an UPDATE, then COMMIT. Can ROLLBACK undo the UPDATE now?",
      choices: ["No", "Yes"],
      answer: 0,
      why: "COMMIT made it permanent. ROLLBACK only affects a transaction that's still open.",
    },
    {
      question: "What's a good habit before a big UPDATE or DELETE?",
      choices: [
        "BEGIN first, check with SELECT, then COMMIT or ROLLBACK",
        "Run it twice to be sure",
        "Always COMMIT straight away",
      ],
      answer: 0,
      why: "The transaction gives you a chance to look before the change becomes permanent.",
    },
  ],
};

const savepointsAndConcurrency: Lesson = {
  status: "ready",
  slug: "savepoints-and-concurrency",
  number: 30,
  title: "SAVEPOINT and changes at the same time",
  minutes: 15,
  summary: "Undo just part of a transaction, and see how databases keep many users from colliding.",
  video: { title: "Two shoppers, one last copy" },
  practiceDb: bookshopWithGiftCards,
  body: `
**A SAVEPOINT is a bookmark inside a transaction.** \`ROLLBACK TO\` undoes back to the bookmark, and keeps everything before it:

\`\`\`sql
BEGIN;
INSERT INTO customers (name, city, country, joined_on)
  VALUES ('Mateo García', 'Madrid', 'Spain', '2025-09-10');
SAVEPOINT after_mateo;
INSERT INTO customers (name, city, country, joined_on)
  VALUES ('Test Person', 'Test', 'Test', '2025-09-11');
ROLLBACK TO after_mateo;   -- the test row goes, Mateo stays
COMMIT;
\`\`\`

It's like a video game checkpoint: you go back a little way instead of starting the level again.

**Many people at once.** A real bookshop has many shoppers at the same moment. Imagine Ana in Lisbon and Ken in Osaka both buying the last copy of a book at the same second. Both check the stock and see 1. Both buy. Now the stock is -1 and two people expect a book that only one can have.

Databases prevent this with **isolation**: each transaction behaves as if it were alone. While Ana's transaction is changing that book's stock, Ken's has to wait its turn. When Ken's goes ahead, it sees stock 0 and the purchase is refused. This waiting is done with **locks**, like a "please wait" sign on the row.

**The four promises.** Together, these are known as **ACID**:

| Letter | Promise | In plain words |
|---|---|---|
| A | Atomic | All or nothing |
| C | Consistent | The rules (keys, NOT NULL, CHECK) are never broken |
| I | Isolated | Transactions at the same time don't trip over each other |
| D | Durable | Once committed, it survives a crash or power cut |
`,
  keyIdeas: [
    "SAVEPOINT name sets a bookmark; ROLLBACK TO name undoes back to it and keeps earlier changes.",
    "Isolation and locks stop users who change the same data at the same time from colliding.",
    "ACID: Atomic, Consistent, Isolated, Durable.",
  ],
  exercises: [
    {
      type: "sql",
      id: "undo-test-row",
      kind: "Fix the query",
      prompt:
        "The second customer is a test row. Add one line so that it's undone and Mateo is kept.",
      starter:
        "BEGIN;\nINSERT INTO customers (name, city, country, joined_on)\n  VALUES ('Mateo García', 'Madrid', 'Spain', '2025-09-10');\nSAVEPOINT after_mateo;\nINSERT INTO customers (name, city, country, joined_on)\n  VALUES ('Test Person', 'Test', 'Test', '2025-09-11');\n\nCOMMIT;",
      answer:
        "BEGIN; INSERT INTO customers (name, city, country, joined_on) VALUES ('Mateo García', 'Madrid', 'Spain', '2025-09-10'); SAVEPOINT after_mateo; INSERT INTO customers (name, city, country, joined_on) VALUES ('Test Person', 'Test', 'Test', '2025-09-11'); ROLLBACK TO after_mateo; COMMIT;",
      checkQuery: "SELECT name FROM customers ORDER BY id",
      mismatch: "The customers aren't right yet. Mateo should be added and Test Person should not.",
      hint: "Before COMMIT, add ROLLBACK TO after_mateo;",
      xp: 30,
    },
    {
      type: "sort",
      id: "acid",
      prompt: "Which ACID promise does each situation show?",
      groups: ["Atomic", "Consistent", "Isolated", "Durable"],
      items: [
        { text: "A transfer is interrupted, and neither card changes", group: "Atomic" },
        { text: "An order for customer 999 is refused because there's no such customer", group: "Consistent" },
        { text: "Ken's purchase waits until Ana's has finished", group: "Isolated" },
        { text: "A committed order is still there after the server restarts", group: "Durable" },
      ],
      hint: "All or nothing, rules kept, no collisions, survives crashes.",
      xp: 20,
    },
  ],
  quiz: [
    {
      question: "After ROLLBACK TO after_mateo, what happens to changes made before the savepoint?",
      choices: ["They're kept", "They're undone too", "They're committed straight away"],
      answer: 0,
      why: "ROLLBACK TO only undoes what came after the bookmark. The transaction stays open until COMMIT.",
    },
    {
      question: "Two shoppers buy the last copy at the same moment. What stops both purchases going through?",
      choices: ["Isolation, with locks", "A bigger server", "The PRIMARY KEY"],
      answer: 0,
      why: "Isolation makes one transaction wait for the other, so the second sees the stock is already 0.",
    },
    {
      question: "Which ACID letter means a committed change survives a power cut?",
      choices: ["D, Durable", "A, Atomic", "C, Consistent"],
      answer: 0,
      why: "Durable: once COMMIT finishes, the change is safely stored.",
    },
  ],
};

export const module6Lessons: Lesson[] = [beginAndCommit, rollback, savepointsAndConcurrency];
