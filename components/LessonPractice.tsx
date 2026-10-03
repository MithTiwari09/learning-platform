"use client";

import { useEffect, useState } from "react";
import type { Lesson } from "@/lib/content/types";
import { PracticeDb } from "@/lib/sql/practice-db";
import { loadSqlJs } from "@/lib/sql/load";
import { useHydrated, useProgress } from "@/lib/progress";
import { SqlExerciseCard } from "./SqlExerciseCard";
import { SortExerciseCard } from "./SortExerciseCard";
import { OrderExerciseCard } from "./OrderExerciseCard";
import { JourneyExerciseCard } from "./JourneyExerciseCard";

export function LessonPractice({ lesson }: { lesson: Lesson }) {
  const hydrated = useHydrated();
  const progress = useProgress();
  const needsSql = lesson.exercises.some((e) => e.type === "sql");
  const [engine, setEngine] = useState<PracticeDb | null>(null);
  const [engineError, setEngineError] = useState<string | null>(null);

  useEffect(() => {
    const seed = lesson.practiceDb?.seed;
    if (!needsSql || seed === undefined) return;
    let practice: PracticeDb | null = null;
    let cancelled = false;
    loadSqlJs().then(
      (SQL) => {
        if (cancelled) return;
        practice = new PracticeDb(SQL, seed);
        setEngine(practice);
      },
      () => {
        if (!cancelled) setEngineError("The practice database could not load. Check your connection and reload the page.");
      },
    );
    return () => {
      cancelled = true;
      practice?.close();
    };
  }, [needsSql, lesson.practiceDb?.seed]);

  if (!hydrated) return <div className="empty">Loading practice…</div>;

  const solved = progress.solved[lesson.slug] ?? [];
  const round = progress.resets[lesson.slug] ?? 0;
  return (
    <div className="practice" key={round}>
      {lesson.exercises.map((ex) => {
        const isSolved = solved.includes(ex.id);
        switch (ex.type) {
          case "sql":
            return (
              <SqlExerciseCard
                key={ex.id}
                lessonSlug={lesson.slug}
                exercise={ex}
                engine={engine}
                engineError={engineError}
                solved={isSolved}
                draft={progress.drafts[`${lesson.slug}/${ex.id}`]}
              />
            );
          case "sort":
            return <SortExerciseCard key={ex.id} lessonSlug={lesson.slug} exercise={ex} solved={isSolved} />;
          case "order":
            return <OrderExerciseCard key={ex.id} lessonSlug={lesson.slug} exercise={ex} solved={isSolved} />;
          case "journey":
            return <JourneyExerciseCard key={ex.id} lessonSlug={lesson.slug} exercise={ex} solved={isSolved} />;
        }
      })}
    </div>
  );
}
