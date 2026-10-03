export type SqlExercise = {
  type: "sql";
  id: string;
  kind: "Write a query" | "Fix the query" | "Challenge";
  prompt: string;
  starter: string;
  /** Reference solution. The learner's result must match its result. */
  answer: string;
  /** Require rows in the same order as the answer (for ORDER BY questions). */
  ordered?: boolean;
  /**
   * For exercises that change data or structure: run this query after the
   * learner's SQL (and after the answer) and compare those results instead.
   */
  checkQuery?: string;
  hint: string;
  xp: number;
};

export type OrderExercise = {
  type: "order";
  id: string;
  prompt: string;
  /** Steps in the correct order. Shown shuffled. */
  steps: string[];
  hint: string;
  xp: number;
};

export type SortExercise = {
  type: "sort";
  id: string;
  prompt: string;
  groups: string[];
  items: { text: string; group: string }[];
  hint: string;
  xp: number;
};

/** Animated walk-through of a query passing through the engine. */
export type JourneyExercise = {
  type: "journey";
  id: string;
  prompt: string;
  query: string;
  stations: { name: string; analogy: string; detail: string }[];
  xp: number;
};

export type Exercise = SqlExercise | OrderExercise | SortExercise | JourneyExercise;

export type QuizQuestion = {
  question: string;
  code?: string;
  choices: string[];
  answer: number;
  why: string;
};

export type Lesson = {
  status: "ready";
  slug: string;
  number: number;
  title: string;
  minutes: number;
  summary: string;
  video: { title: string };
  /** Markdown. */
  body: string;
  keyIdeas: string[];
  /** Practice database loaded for SQL exercises. */
  dataset?: "bookshop";
  exercises: Exercise[];
  quiz: QuizQuestion[];
};

export type PlannedLesson = {
  status: "planned";
  slug: string;
  number: number;
  title: string;
};

export type LessonEntry = Lesson | PlannedLesson;

export type Module = {
  number: number;
  title: string;
  description: string;
  lessons: LessonEntry[];
};

export type Course = {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  audience: string;
  hours: string;
  modules: Module[];
};
