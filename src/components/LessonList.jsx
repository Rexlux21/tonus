import { useState } from "react";
import { INSTRUMENTS, LESSONS, STYLES } from "../data/lessons";
import GuitarFretboard from "./GuitarFretboard";
import PianoKeyboard from "./PianoKeyboard";
import TriviaWidget from "./TriviaWidget";

const PREVIEW_NOTE = { name: "G", octave: 3 };

export default function LessonList({ progress, onSelectLesson, onBonusXp, filter, onFilterChange }) {
  const [styleFilter, setStyleFilter] = useState("all");

  const visible = LESSONS.filter(
    (l) => (filter === "all" || l.instrument === filter) && (styleFilter === "all" || l.style === styleFilter)
  );
  const activeInstrument = INSTRUMENTS.find((inst) => inst.id === filter);

  return (
    <div className="lesson-list-page">
      <div className="page-heading">
        <h1>Lessons</h1>
        <p>Pick a note sequence and Tonus will listen while you work through it.</p>
      </div>

      <div className="filter-row">
        <button
          className={`filter-chip${filter === "all" ? " active" : ""}`}
          onClick={() => onFilterChange("all")}
        >
          All
        </button>
        {INSTRUMENTS.map((inst) => (
          <button
            key={inst.id}
            className={`filter-chip${filter === inst.id ? " active" : ""}`}
            onClick={() => onFilterChange(inst.id)}
          >
            {inst.label}
          </button>
        ))}
      </div>

      <div className="filter-row style-filter-row">
        <span className="filter-row-label">Style:</span>
        <button
          className={`filter-chip small${styleFilter === "all" ? " active" : ""}`}
          onClick={() => setStyleFilter("all")}
        >
          All
        </button>
        {STYLES.map((style) => (
          <button
            key={style.id}
            className={`filter-chip small${styleFilter === style.id ? " active" : ""}`}
            onClick={() => setStyleFilter(style.id)}
          >
            {style.label}
          </button>
        ))}
      </div>

      {activeInstrument && (
        <div className="instrument-panel">
          <div className="instrument-preview">
            <span className="eyebrow">{activeInstrument.label} at a glance</span>
            {activeInstrument.id === "guitar" && (
              <GuitarFretboard name={PREVIEW_NOTE.name} octave={PREVIEW_NOTE.octave} />
            )}
            {activeInstrument.id === "piano" && (
              <PianoKeyboard name={PREVIEW_NOTE.name} octave={PREVIEW_NOTE.octave} />
            )}
            {activeInstrument.id === "voice" && (
              <p className="voice-tip">
                No instrument needed — just your voice and a quiet room. Pick a lesson below to
                start matching pitch.
              </p>
            )}
          </div>
          <TriviaWidget onCorrect={() => onBonusXp?.(10)} />
        </div>
      )}

      <div className="lesson-grid">
        {visible.map((lesson) => {
          const record = progress.completedLessons[lesson.id];
          return (
            <button
              key={lesson.id}
              className="lesson-card"
              onClick={() => onSelectLesson(lesson.id)}
            >
              <div className="lesson-card-top">
                <span className="instrument-tag">{lesson.instrument}</span>
                {lesson.style !== "technique" && (
                  <span className="style-tag">{lesson.style}</span>
                )}
                <span className="level-tag">{lesson.level}</span>
              </div>
              <h3>{lesson.title}</h3>
              <p>{lesson.description}</p>
              <div className="lesson-card-footer">
                <span>{lesson.notes.length} notes</span>
                {record ? (
                  <span className="best-accuracy">Best: {Math.round(record.bestAccuracy * 100)}%</span>
                ) : (
                  <span className="not-started">Not started</span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
