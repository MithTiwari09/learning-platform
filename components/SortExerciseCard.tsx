"use client";

import { useState } from "react";
import type { SortExercise } from "@/lib/content/types";
import { markSolved } from "@/lib/progress";
import { Feedback, type FeedbackState } from "./Feedback";

type Props = { lessonSlug: string; exercise: SortExercise; solved: boolean };

export function SortExerciseCard({ lessonSlug, exercise, solved }: Props) {
  const [picks, setPicks] = useState<Record<number, string>>(() =>
    solved ? Object.fromEntries(exercise.items.map((it, i) => [i, it.group])) : {},
  );
  const [checked, setChecked] = useState(solved);
  const [feedback, setFeedback] = useState<FeedbackState>(null);

  function check() {
    const missing = exercise.items.length - Object.keys(picks).length;
    if (missing > 0) {
      setFeedback({ tone: "no", text: `Choose an answer for every item first (${missing} left).` });
      return;
    }
    setChecked(true);
    const wrong = exercise.items.filter((it, i) => picks[i] !== it.group).length;
    if (wrong === 0) {
      markSolved(lessonSlug, exercise.id);
      setFeedback({ tone: "ok", text: `All correct. +${exercise.xp} XP.` });
    } else {
      setFeedback({
        tone: "no",
        text: `${wrong} of ${exercise.items.length} need another look. They're highlighted. Change them and check again.`,
      });
    }
  }

  return (
    <div className="card">
      <div className="card-q">
        <div className="kind">Sort it{solved ? " · solved ✓" : ""}</div>
        <p>{exercise.prompt}</p>
      </div>
      <div className="card-body">
        <div className="sort-items">
          {exercise.items.map((item, i) => {
            const state = checked && picks[i] ? (picks[i] === item.group ? "right" : "wrong") : "";
            return (
              <div key={i} className={`sort-item ${state}`}>
                <div className="text">{item.text}</div>
                <div className="choices-row" role="group" aria-label={`Answer for: ${item.text}`}>
                  {exercise.groups.map((g) => (
                    <button
                      key={g}
                      className="chip"
                      aria-pressed={picks[i] === g}
                      onClick={() => {
                        setPicks({ ...picks, [i]: g });
                        setChecked(false);
                      }}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="bar">
        <button className="btn primary" onClick={check}>
          Check answers
        </button>
        <button className="btn" onClick={() => setFeedback({ tone: "hint", text: `Hint: ${exercise.hint}` })}>
          Hint
        </button>
      </div>
      <Feedback state={feedback} />
    </div>
  );
}
