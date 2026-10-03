"use client";

import type { QuizQuestion } from "@/lib/content/types";
import { answerQuiz, useProgress } from "@/lib/progress";
import { useState } from "react";

export function Quiz({ lessonSlug, questions }: { lessonSlug: string; questions: QuizQuestion[] }) {
  const progress = useProgress();
  return <QuizRound key={progress.resets[lessonSlug] ?? 0} lessonSlug={lessonSlug} questions={questions} />;
}

function QuizRound({ lessonSlug, questions }: { lessonSlug: string; questions: QuizQuestion[] }) {
  const progress = useProgress();
  const saved = progress.quiz[lessonSlug] ?? {};
  // The learner's pick this visit; after a reload we only know right or wrong.
  const [picked, setPicked] = useState<Record<number, number>>({});

  return (
    <div className="quiz">
      {questions.map((q, i) => {
        const answered = i in saved;
        const pick = picked[i] ?? (answered && saved[i] ? q.answer : undefined);
        return (
          <div key={i} className="qcard">
            <h3>
              {i + 1}. {q.question}
            </h3>
            {q.code && (
              <pre>
                <code>{q.code}</code>
              </pre>
            )}
            <div className="qchoices">
              {q.choices.map((c, j) => {
                const cls = answered ? (j === q.answer ? "right" : j === pick ? "wrong" : "") : "";
                return (
                  <button
                    key={j}
                    className={`qchoice ${/^SELECT /.test(c) ? "code" : ""} ${cls}`}
                    disabled={answered}
                    onClick={() => {
                      setPicked({ ...picked, [i]: j });
                      answerQuiz(lessonSlug, i, j === q.answer);
                    }}
                  >
                    {c}
                  </button>
                );
              })}
            </div>
            {answered && (
              <p className="why">
                {saved[i] ? "Correct. " : "Not quite. "}
                {q.why}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
