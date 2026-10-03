"use client";

import { useSyncExternalStore } from "react";

/**
 * Learner progress, kept in this browser for now. Stage 2 moves it to
 * the learner's account so it follows them across devices.
 */
export type Progress = {
  /** lessonSlug -> ids of solved exercises */
  solved: Record<string, string[]>;
  /** lessonSlug -> question index -> answered correctly */
  quiz: Record<string, Record<number, boolean>>;
  /** `${lessonSlug}/${exerciseId}` -> SQL the learner last typed */
  drafts: Record<string, string>;
  /** lessonSlug -> how many times the learner started it over (used to reset on-screen state) */
  resets: Record<string, number>;
};

const KEY = "learnlab-progress-v1";
const EMPTY: Progress = { solved: {}, quiz: {}, drafts: {}, resets: {} };

let cache: Progress | null = null;
const listeners = new Set<() => void>();

function read(): Progress {
  if (cache) return cache;
  try {
    const raw = window.localStorage.getItem(KEY);
    cache = raw ? { ...EMPTY, ...(JSON.parse(raw) as Progress) } : EMPTY;
  } catch {
    cache = EMPTY;
  }
  return cache;
}

function write(next: Progress) {
  cache = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Storage can be unavailable (private mode). Progress then lasts for this visit only.
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      cache = null;
      listener();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function useProgress(): Progress {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}

export function markSolved(lesson: string, exerciseId: string) {
  const p = read();
  const list = p.solved[lesson] ?? [];
  if (list.includes(exerciseId)) return;
  write({ ...p, solved: { ...p.solved, [lesson]: [...list, exerciseId] } });
}

export function answerQuiz(lesson: string, index: number, correct: boolean) {
  const p = read();
  const answers = p.quiz[lesson] ?? {};
  if (index in answers) return;
  write({ ...p, quiz: { ...p.quiz, [lesson]: { ...answers, [index]: correct } } });
}

export function saveDraft(lesson: string, exerciseId: string, sql: string) {
  const p = read();
  write({ ...p, drafts: { ...p.drafts, [`${lesson}/${exerciseId}`]: sql } });
}

export function resetLesson(lesson: string) {
  const p = read();
  const solved = { ...p.solved };
  const quiz = { ...p.quiz };
  delete solved[lesson];
  delete quiz[lesson];
  const drafts = Object.fromEntries(Object.entries(p.drafts).filter(([k]) => !k.startsWith(`${lesson}/`)));
  write({ solved, quiz, drafts, resets: { ...p.resets, [lesson]: (p.resets[lesson] ?? 0) + 1 } });
}

const noop = () => () => {};

/** False during server rendering and hydration, true once browser-only state can be read. */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
}
