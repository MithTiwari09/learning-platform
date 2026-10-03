export type FeedbackState = { tone: "ok" | "no" | "err" | "hint"; text: string } | null;

export function Feedback({ state }: { state: FeedbackState }) {
  if (!state) return null;
  return (
    <div className={`feedback ${state.tone}`} role="status">
      {state.text}
    </div>
  );
}
