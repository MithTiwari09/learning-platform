"use client";

import type { Lesson } from "@/lib/content/types";
import { resetLesson, useProgress } from "@/lib/progress";

const QUIZ_XP = 10;

export function lessonXp(lesson: Lesson, solved: string[], quiz: Record<number, boolean>): number {
  const exerciseXp = lesson.exercises.filter((e) => solved.includes(e.id)).reduce((sum, e) => sum + e.xp, 0);
  return exerciseXp + Object.values(quiz).filter(Boolean).length * QUIZ_XP;
}

export function LessonProgressPanel({ lesson }: { lesson: Lesson }) {
  const progress = useProgress();
  const solved = progress.solved[lesson.slug] ?? [];
  const quiz = progress.quiz[lesson.slug] ?? {};
  const done = lesson.exercises.filter((e) => solved.includes(e.id)).length;
  const total = lesson.exercises.length;
  const started = done > 0 || Object.keys(quiz).length > 0;

  return (
    <div className="panel">
      <div className="eyebrow">Your progress</div>
      <div className="xp">
        <b>{lessonXp(lesson, solved, quiz)}</b>
        <span className="small">XP this lesson</span>
      </div>
      <div className="meter" aria-hidden="true">
        <i style={{ width: `${(done / total) * 100}%` }} />
      </div>
      <p className="small" style={{ margin: "6px 0 0" }}>
        {done === total ? "All practice done. Lesson complete!" : `${done} of ${total} practice activities done`}
      </p>
      {started && (
        <button className="btn small" style={{ marginTop: 10 }} onClick={() => resetLesson(lesson.slug)}>
          Start this lesson over
        </button>
      )}
    </div>
  );
}
