import type { Database, SqlJsStatic } from "sql.js";
import { freshDatabase } from "./grade";

/** The learner's scratch database for a lesson. Reset brings it back to the lesson's starting point. */
export class PracticeDb {
  db: Database;

  constructor(
    readonly SQL: SqlJsStatic,
    readonly seed: string,
  ) {
    this.db = freshDatabase(SQL, seed);
  }

  reset() {
    this.db.close();
    this.db = freshDatabase(this.SQL, this.seed);
  }

  close() {
    this.db.close();
  }
}
