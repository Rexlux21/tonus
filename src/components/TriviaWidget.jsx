import { useCallback, useEffect, useState } from "react";
import { fetchMusicTrivia } from "../lib/musicTrivia";

export default function TriviaWidget({ onCorrect }) {
  const [state, setState] = useState("loading"); // loading | ready | error
  const [trivia, setTrivia] = useState(null);
  const [selected, setSelected] = useState(null);

  // Fetches a question and lands the result asynchronously — the effect
  // below only kicks this off, it never sets state synchronously itself.
  const runFetch = useCallback(() => {
    fetchMusicTrivia()
      .then((data) => {
        setTrivia(data);
        setState("ready");
      })
      .catch(() => setState("error"));
  }, []);

  const loadQuestion = useCallback(() => {
    setState("loading");
    setSelected(null);
    runFetch();
  }, [runFetch]);

  useEffect(() => {
    runFetch();
  }, [runFetch]);

  const handleAnswer = (answer) => {
    if (selected) return;
    setSelected(answer);
    if (answer === trivia.correctAnswer) onCorrect?.();
  };

  return (
    <div className="trivia-card">
      <div className="trivia-header">
        <span className="eyebrow">Music trivia · bonus XP</span>
      </div>

      {state === "loading" && <p className="trivia-status">Loading a question…</p>}

      {state === "error" && (
        <div className="trivia-status">
          <p>Couldn't reach the trivia API right now.</p>
          <button className="link-btn" onClick={loadQuestion}>
            Try again
          </button>
        </div>
      )}

      {state === "ready" && trivia && (
        <>
          <p className="trivia-question">{trivia.question}</p>
          <div className="trivia-answers">
            {trivia.answers.map((answer) => {
              const isCorrect = answer === trivia.correctAnswer;
              const isSelected = answer === selected;
              const showState = selected != null;
              return (
                <button
                  key={answer}
                  className={`trivia-answer${
                    showState && isCorrect
                      ? " correct"
                      : showState && isSelected
                        ? " incorrect"
                        : ""
                  }`}
                  onClick={() => handleAnswer(answer)}
                  disabled={showState}
                >
                  {answer}
                </button>
              );
            })}
          </div>
          {selected && (
            <button className="btn btn-secondary trivia-next" onClick={loadQuestion}>
              Next question
            </button>
          )}
        </>
      )}
    </div>
  );
}
