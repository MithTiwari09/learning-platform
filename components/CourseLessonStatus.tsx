"use client";

import type { Lesson } from "@/lib/content/types";
import { useProgress } from "@/lib/progress";

/** Badge on the course page: done, in progress, or nothing. */
export function CourseLessonStatus({ lesson }: { lesson: Lesson }) {
  const progress = useProgress();
  const solved = progress.solved[lesson.slug] ?? [];
  const done = lesson.exercises.filter((e) => solved.includes(e.id)).length;
  if (done === lesson.exercises.length) return <span className="pill ok">Done</span>;
  if (done > 0) return <span className="pill accent">In progress</span>;
  return <span className="small">{lesson.minutes} min</span>;
}
