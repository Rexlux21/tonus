import { LESSONS } from "../data/lessons";

export default function ProgressDashboard({ progress, onSelectLesson, onReset }) {
  const completedCount = Object.keys(progress.completedLessons).length;
  const totalCount = LESSONS.length;

  return (
    <div className="progress-page">
      <div className="page-heading">
        <h1>Your progress</h1>
        <p>Tracked locally in this browser — it stays with you across visits.</p>
      </div>

      <div className="progress-stats">
        <div className="stat-card">
          <span className="stat-n">{progress.xp}</span>
          <span className="stat-l">Total XP</span>
        </div>
        <div className="stat-card">
          <span className="stat-n">{progress.streak}</span>
          <span className="stat-l">Day streak</span>
        </div>
        <div className="stat-card">
          <span className="stat-n">
            {completedCount}/{totalCount}
          </span>
          <span className="stat-l">Lessons started</span>
        </div>
      </div>

      <div className="progress-lesson-list">
        {LESSONS.map((lesson) => {
          const record = progress.completedLessons[lesson.id];
          return (
            <button key={lesson.id} className="progress-row" onClick={() => onSelectLesson(lesson.id)}>
              <div>
                <strong>{lesson.title}</strong>
                <span className="instrument-tag inline">{lesson.instrument}</span>
              </div>
              {record ? (
                <div className="progress-row-stats">
                  <span>{record.timesCompleted}× completed</span>
                  <span className="best-accuracy">Best {Math.round(record.bestAccuracy * 100)}%</span>
                </div>
              ) : (
                <span className="not-started">Not started</span>
              )}
            </button>
          );
        })}
      </div>

      {completedCount > 0 && (
        <button className="link-btn reset-link" onClick={onReset}>
          Reset all progress
        </button>
      )}
    </div>
  );
}
