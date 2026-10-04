import type { Lesson } from "../../types";

/** Module 7: DCL, who can do what. */

/**
 * The practice database here has no users (it runs in your browser), so GRANT itself can't run.
 * Instead learners query a table of grants, the same kind of list big databases keep internally.
 */
const GRANTS_SEED = `
CREATE TABLE grants(role TEXT NOT NULL, table_name TEXT NOT NULL, privilege TEXT NOT NULL);
INSERT INTO grants VALUES
('shop_website','books','SELECT'),('shop_website','authors','SELECT'),('shop_website','orders','INSERT'),
('warehouse','books','SELECT'),('warehouse','books','UPDATE'),('warehouse','orders','SELECT'),('warehouse','orders','UPDATE'),
('analyst','books','SELECT'),('analyst','authors','SELECT'),('analyst','customers','SELECT'),('analyst','orders','SELECT'),
('admin','books','SELECT'),('admin','books','INSERT'),('admin','books','UPDATE'),('admin','books','DELETE'),
('admin','authors','SELECT'),('admin','authors','INSERT'),('admin','authors','UPDATE'),('admin','authors','DELETE'),
('admin','customers','SELECT'),('admin','customers','INSERT'),('admin','customers','UPDATE'),('admin','customers','DELETE'),
('admin','orders','SELECT'),('admin','orders','INSERT'),('admin','orders','UPDATE'),('admin','orders','DELETE');
`;

const grantAndRevoke: Lesson = {
  status: "ready",
  slug: "grant-and-revoke",
  number: 32,
  title: "GRANT and REVOKE",
  minutes: 14,
  summary: "Decide who may read or change each table, and take access away when it's no longer needed.",
  video: { title: "Keys to the building" },
  practiceDb: { seed: GRANTS_SEED },
  body: `
A real bookshop database is used by many people and programs: the website, warehouse staff, a data analyst, and an administrator. Not all of them should be able to do everything. The analyst needs to read sales figures, but has no reason to delete customers.

**DCL** (Data Control Language) decides who can do what. Think of it as handing out keys in an office building: everyone gets keys to the rooms they need, and no more.

**GRANT gives a permission** (called a *privilege*) on a table:

\`\`\`sql
GRANT SELECT ON books TO analyst;
GRANT SELECT, UPDATE ON books TO warehouse;
\`\`\`

**REVOKE takes it away:**

\`\`\`sql
REVOKE UPDATE ON books FROM warehouse;
\`\`\`

The privileges match the commands you already know: \`SELECT\`, \`INSERT\`, \`UPDATE\` and \`DELETE\`.

**Roles save work.** Instead of granting privileges to 40 warehouse staff one by one, you create a \`warehouse\` *role*, grant the privileges to the role, and add each person to it. When someone changes job, you move them to a different role.

**Give the least access that does the job.** This rule is called *least privilege*. If the website's login is ever stolen, an attacker can only do what the website could do, which is far less harmful than full control.

**About your practice database.** It runs inside your browser and has no user accounts, so \`GRANT\` won't run here. You'd use it on a shared database server such as PostgreSQL, MySQL or SQL Server. Those databases keep a list of every grant, and your practice database has a copy of that kind of list, in a table called \`grants\` with three columns: \`role\`, \`table_name\` and \`privilege\`. Query it with what you've learned to find out who can do what.
`,
  keyIdeas: [
    "GRANT privilege ON table TO role gives access; REVOKE privilege ON table FROM role removes it.",
    "Privileges match the commands: SELECT, INSERT, UPDATE and DELETE.",
    "Grant to roles rather than individuals, and give the least access that does the job.",
  ],
  exercises: [
    {
      type: "sort",
      id: "who-needs-what",
      prompt: "The analyst writes sales reports. Which privileges should the analyst role get?",
      groups: ["Grant it", "Don't grant it"],
      items: [
        { text: "SELECT on orders", group: "Grant it" },
        { text: "SELECT on books", group: "Grant it" },
        { text: "DELETE on customers", group: "Don't grant it" },
        { text: "UPDATE on books", group: "Don't grant it" },
        { text: "SELECT on customers", group: "Grant it" },
        { text: "INSERT on orders", group: "Don't grant it" },
      ],
      hint: "Reports only read data. Anything that changes data isn't needed.",
      xp: 20,
    },
    {
      type: "sql",
      id: "analyst-privileges",
      kind: "Write a query",
      prompt: "Using the grants table, show the table_name and privilege of everything the 'analyst' role is allowed to do.",
      starter: "SELECT table_name, privilege\nFROM grants\n",
      answer: "SELECT table_name, privilege FROM grants WHERE role = 'analyst';",
      hint: "WHERE role = 'analyst'.",
      xp: 25,
    },
    {
      type: "sql",
      id: "who-can-update-books",
      kind: "Challenge",
      prompt: "Which roles are allowed to UPDATE the books table? Show just the role.",
      starter: "",
      answer: "SELECT role FROM grants WHERE table_name = 'books' AND privilege = 'UPDATE';",
      hint: "Two conditions joined with AND: table_name = 'books' and privilege = 'UPDATE'.",
      xp: 50,
    },
    {
      type: "order",
      id: "new-starter",
      prompt: "The bookshop is setting up access for its new warehouse team. Put the steps in order.",
      steps: [
        "Create the warehouse role",
        "Grant the role SELECT and UPDATE on books",
        "Add Priya, a new team member, to the role",
        "Priya logs in and updates the stock count",
      ],
      hint: "Set the role up first, then add people to it. Using the access comes last.",
      xp: 20,
    },
  ],
  quiz: [
    {
      question: "Which command lets the analyst role read the orders table?",
      choices: [
        "GRANT SELECT ON orders TO analyst;",
        "REVOKE SELECT ON orders FROM analyst;",
        "SELECT * FROM orders TO analyst;",
      ],
      answer: 0,
      why: "GRANT gives a privilege. REVOKE takes it away.",
    },
    {
      question: "Why grant privileges to a role instead of to each person?",
      choices: [
        "It's simpler to manage when people join, leave or change jobs",
        "People can't be given privileges",
        "It makes queries faster",
      ],
      answer: 0,
      why: "Set the role up once, then just add or remove people.",
    },
    {
      question: "The shop website only shows books and takes orders. What should it be able to do to customers?",
      choices: ["As little as its job needs", "Everything, to be safe", "Only DELETE"],
      answer: 0,
      why: "Least privilege: if the website's login is ever stolen, the damage stays small.",
    },
  ],
};

export const module7Lessons: Lesson[] = [grantAndRevoke];
