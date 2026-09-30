import { useState } from "react";
import { INSTRUMENTS, LESSONS } from "../data/lessons";

export default function LessonList({ progress, onSelectLesson }) {
  const [filter, setFilter] = useState("all");

  const visible = filter === "all" ? LESSONS : LESSONS.filter((l) => l.instrument === filter);

  return (
    <div className="lesson-list-page">
      <div className="page-heading">
        <h1>Lessons</h1>
        <p>Pick a note sequence and Notecraft will listen while you work through it.</p>
      </div>

      <div className="filter-row">
        <button
          className={`filter-chip${filter === "all" ? " active" : ""}`}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        {INSTRUMENTS.map((inst) => (
          <button
            key={inst.id}
            className={`filter-chip${filter === inst.id ? " active" : ""}`}
            onClick={() => setFilter(inst.id)}
          >
            {inst.label}
          </button>
        ))}
      </div>

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
