import { useState } from "react";
import Header from "./components/Header";
import Landing from "./components/Landing";
import LessonList from "./components/LessonList";
import Practice from "./components/Practice";
import ProgressDashboard from "./components/ProgressDashboard";
import SongTools from "./components/SongTools";
import { getLessonById } from "./data/lessons";
import { useProgress } from "./hooks/useProgress";
import "./App.css";

export default function App() {
  const [view, setView] = useState("landing");
  const [activeLessonId, setActiveLessonId] = useState(null);
  const [lessonFilter, setLessonFilter] = useState("all");
  const { progress, completeLesson, addBonusXp, resetProgress } = useProgress();

  const navigate = (nextView) => {
    setView(nextView);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const selectLesson = (lessonId) => {
    setActiveLessonId(lessonId);
    setView("practice");
  };

  const selectInstrument = (instrumentId) => {
    setLessonFilter(instrumentId);
    navigate("lessons");
  };

  const activeLesson = activeLessonId ? getLessonById(activeLessonId) : null;

  return (
    <div className="app-shell">
      <Header
        view={view}
        activeInstrument={lessonFilter}
        onNavigate={navigate}
        onSelectInstrument={selectInstrument}
        xp={progress.xp}
        streak={progress.streak}
      />

      <main>
        {view === "landing" && <Landing onNavigate={navigate} />}

        {view === "lessons" && (
          <LessonList
            progress={progress}
            onSelectLesson={selectLesson}
            onBonusXp={addBonusXp}
            filter={lessonFilter}
            onFilterChange={setLessonFilter}
          />
        )}

        {view === "practice" && activeLesson && (
          <Practice
            key={activeLesson.id}
            lesson={activeLesson}
            onExit={() => navigate("lessons")}
            onComplete={(accuracy) => completeLesson(activeLesson.id, accuracy)}
          />
        )}

        {view === "songtools" && <SongTools />}

        {view === "progress" && (
          <ProgressDashboard
            progress={progress}
            onSelectLesson={selectLesson}
            onReset={resetProgress}
          />
        )}
      </main>

      <footer className="app-footer">
        Tonus — practice with real-time pitch feedback, right in your browser.
      </footer>
    </div>
  );
}
