"use client";

import { useState } from "react";
import type { OrderExercise } from "@/lib/content/types";
import { markSolved } from "@/lib/progress";
import { Feedback, type FeedbackState } from "./Feedback";

type Props = { lessonSlug: string; exercise: OrderExercise; solved: boolean };

/** A fixed shuffle (reverse, then swap the middle) so the page renders the same on server and client. */
function scramble(steps: string[]): string[] {
  const s = [...steps].reverse();
  if (s.length > 3) [s[1], s[2]] = [s[2], s[1]];
  return s;
}

export function OrderExerciseCard({ lessonSlug, exercise, solved }: Props) {
  const [order, setOrder] = useState(() => (solved ? exercise.steps : scramble(exercise.steps)));
  const [checked, setChecked] = useState(solved);
  const [feedback, setFeedback] = useState<FeedbackState>(null);

  function move(i: number, by: -1 | 1) {
    const j = i + by;
    if (j < 0 || j >= order.length) return;
    const next = [...order];
    [next[i], next[j]] = [next[j], next[i]];
    setOrder(next);
    setChecked(false);
  }

  function check() {
    setChecked(true);
    if (order.every((s, i) => s === exercise.steps[i])) {
      markSolved(lessonSlug, exercise.id);
      setFeedback({ tone: "ok", text: `That's the right order. +${exercise.xp} XP.` });
    } else {
      setFeedback({ tone: "no", text: "Not quite. The steps in the right place are highlighted green." });
    }
  }

  return (
    <div className="card">
      <div className="card-q">
        <div className="kind">Put in order{solved ? " · solved ✓" : ""}</div>
        <p>{exercise.prompt}</p>
      </div>
      <div className="card-body">
        <ol className="order-list">
          {order.map((step, i) => (
            <li key={step} className={checked && step === exercise.steps[i] ? "right" : ""}>
              <span className="pos">{i + 1}</span>
              <span className="step-text">{step}</span>
              <span className="moves">
                <button className="btn small" aria-label={`Move "${step}" up`} disabled={i === 0} onClick={() => move(i, -1)}>
                  ↑
                </button>
                <button
                  className="btn small"
                  aria-label={`Move "${step}" down`}
                  disabled={i === order.length - 1}
                  onClick={() => move(i, 1)}
                >
                  ↓
                </button>
              </span>
            </li>
          ))}
        </ol>
      </div>
      <div className="bar">
        <button className="btn primary" onClick={check}>
          Check order
        </button>
        <button className="btn" onClick={() => setFeedback({ tone: "hint", text: `Hint: ${exercise.hint}` })}>
          Hint
        </button>
      </div>
      <Feedback state={feedback} />
    </div>
  );
}
