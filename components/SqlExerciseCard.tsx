"use client";

import { useState } from "react";
import type { SqlExercise } from "@/lib/content/types";
import { gradeSql, runSql, type QueryResult } from "@/lib/sql/grade";
import type { PracticeDb } from "@/lib/sql/practice-db";
import { markSolved, saveDraft } from "@/lib/progress";
import { Feedback, type FeedbackState } from "./Feedback";

type Props = {
  lessonSlug: string;
  exercise: SqlExercise;
  engine: PracticeDb | null;
  engineError: string | null;
  solved: boolean;
  draft: string | undefined;
};

export function SqlExerciseCard({ lessonSlug, exercise, engine, engineError, solved, draft }: Props) {
  const [sql, setSql] = useState(draft ?? exercise.starter);
  const [result, setResult] = useState<QueryResult | null>(null);
  const [feedback, setFeedback] = useState<FeedbackState>(null);

  function update(value: string) {
    setSql(value);
    saveDraft(lessonSlug, exercise.id, value);
  }

  function run(check: boolean) {
    if (!engine) return;
    if (!sql.trim()) {
      setFeedback({ tone: "no", text: "Type a query first." });
      return;
    }
    // Checking always starts from the lesson's starting database, so earlier runs can't get in the way.
    if (check) engine.reset();
    try {
      setResult(runSql(engine.db, sql));
    } catch (err) {
      setResult(null);
      setFeedback({ tone: "err", text: errorText(err) });
      return;
    }
    if (!check) {
      setFeedback(null);
      return;
    }
    const verdict = gradeSql(engine.SQL, engine.seed, exercise, sql);
    if (verdict.ok) {
      markSolved(lessonSlug, exercise.id);
      setFeedback({ tone: "ok", text: `Correct, nice work. +${exercise.xp} XP.` });
    } else if ("error" in verdict) {
      setFeedback({ tone: "err", text: errorText(verdict.error) });
    } else {
      setFeedback({ tone: "no", text: `Not quite yet. ${verdict.reason} Press Hint if you're stuck.` });
    }
  }

  const id = `sql-${exercise.id}`;
  return (
    <div className="card">
      <div className="card-q">
        <div className="kind">
          {exercise.kind}
          {solved ? " · solved ✓" : ""}
        </div>
        <p>{exercise.prompt}</p>
      </div>
      <div className="editor">
        <label htmlFor={id} className="sr-only" style={{ position: "absolute", left: -9999 }}>
          SQL query
        </label>
        <textarea
          id={id}
          value={sql}
          spellCheck={false}
          autoCapitalize="off"
          autoComplete="off"
          onChange={(e) => update(e.target.value)}
          onKeyDown={(e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
              e.preventDefault();
              run(true);
            }
          }}
        />
      </div>
      <div className="bar">
        <button className="btn primary" disabled={!engine} onClick={() => run(false)}>
          Run
        </button>
        <button className="btn" disabled={!engine} onClick={() => run(true)}>
          Check answer
        </button>
        <button className="btn" onClick={() => setFeedback({ tone: "hint", text: `Hint: ${exercise.hint}` })}>
          Hint
        </button>
        <button
          className="btn"
          onClick={() => {
            update(exercise.starter);
            engine?.reset();
            setResult(null);
            setFeedback(null);
          }}
        >
          Reset
        </button>
        <span className="kbd">Ctrl + Enter checks</span>
      </div>
      <Feedback state={engineError ? { tone: "err", text: engineError } : feedback} />
      <div className="result">
        {!engine && !engineError ? (
          <div className="empty">Loading the practice database…</div>
        ) : result ? (
          <ResultTable result={result} />
        ) : (
          <div className="empty">Write your query above and press Run to see the result.</div>
        )}
      </div>
    </div>
  );
}

function errorText(err: unknown): string {
  const message = err instanceof Error ? err.message : String(err);
  const tip = /already exists/.test(message)
    ? " You may have run this before. Press Reset to start again with a fresh practice database."
    : "";
  return `Error: ${message}.${tip}`;
}

function ResultTable({ result }: { result: QueryResult }) {
  if (!result.columns.length) {
    return <div className="empty">It ran without errors and returned no rows. (CREATE, ALTER and DROP never return rows.)</div>;
  }
  return (
    <>
      <div className="meta">
        {result.values.length} row{result.values.length === 1 ? "" : "s"}
      </div>
      <div className="tbl">
        <table>
          <thead>
            <tr>
              {result.columns.map((c, i) => (
                <th key={i}>{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {result.values.map((row, r) => (
              <tr key={r}>
                {row.map((v, c) => (
                  <td key={c} className={typeof v === "number" ? "num" : undefined}>
                    {v === null ? <span className="small">NULL</span> : String(v)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
