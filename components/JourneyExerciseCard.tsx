"use client";

import { useState } from "react";
import type { JourneyExercise } from "@/lib/content/types";
import { markSolved } from "@/lib/progress";

type Props = { lessonSlug: string; exercise: JourneyExercise; solved: boolean };

export function JourneyExerciseCard({ lessonSlug, exercise, solved }: Props) {
  // -1 = not started; otherwise the index of the current station.
  const [at, setAt] = useState(solved ? exercise.stations.length - 1 : -1);
  const last = exercise.stations.length - 1;

  function step() {
    const next = Math.min(at + 1, last);
    setAt(next);
    if (next === last) markSolved(lessonSlug, exercise.id);
  }

  const current = at >= 0 ? exercise.stations[at] : null;
  return (
    <div className="card">
      <div className="card-q">
        <div className="kind">Follow the query{solved ? " · done ✓" : ""}</div>
        <p>{exercise.prompt}</p>
      </div>
      <div className="card-body">
        <pre className="journey-query">
          <code>{exercise.query}</code>
        </pre>
        <div className="stations">
          {exercise.stations.map((s, i) => (
            <div key={s.name} className={`station ${i <= at ? "reached" : ""} ${i === at ? "current" : ""}`}>
              <span className="small">Step {i + 1}</span>
              <b>{s.name}</b>
              <span className="analogy">{s.analogy}</span>
            </div>
          ))}
        </div>
        <div className="journey-detail" aria-live="polite">
          {current ? (
            <p style={{ margin: 0 }}>
              <strong>{current.name}:</strong> {current.detail}
            </p>
          ) : (
            <p className="small" style={{ margin: 0 }}>
              Press Run to send the query into the engine.
            </p>
          )}
        </div>
      </div>
      <div className="bar">
        {at < last ? (
          <button className="btn primary" onClick={step}>
            {at === -1 ? "Run" : "Next step"}
          </button>
        ) : (
          <button className="btn" onClick={() => setAt(-1)}>
            Replay
          </button>
        )}
        {at === last && <span className="pill ok">Done. +{exercise.xp} XP</span>}
      </div>
    </div>
  );
}
