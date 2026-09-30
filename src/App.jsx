import { useState } from "react";
import Header from "./components/Header";
import Landing from "./components/Landing";
import LessonList from "./components/LessonList";
import Practice from "./components/Practice";
import ProgressDashboard from "./components/ProgressDashboard";
import { getLessonById } from "./data/lessons";
import { useProgress } from "./hooks/useProgress";
import "./App.css";

export default function App() {
  const [view, setView] = useState("landing");
  const [activeLessonId, setActiveLessonId] = useState(null);
  const { progress, completeLesson, resetProgress } = useProgress();

  const navigate = (nextView) => {
    setView(nextView);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const selectLesson = (lessonId) => {
    setActiveLessonId(lessonId);
    setView("practice");
  };

  const activeLesson = activeLessonId ? getLessonById(activeLessonId) : null;

  return (
    <div className="app-shell">
      <Header view={view} onNavigate={navigate} xp={progress.xp} streak={progress.streak} />

      <main>
        {view === "landing" && <Landing onNavigate={navigate} />}

        {view === "lessons" && <LessonList progress={progress} onSelectLesson={selectLesson} />}

        {view === "practice" && activeLesson && (
          <Practice
            key={activeLesson.id}
            lesson={activeLesson}
            onExit={() => navigate("lessons")}
            onComplete={(accuracy) => completeLesson(activeLesson.id, accuracy)}
          />
        )}

        {view === "progress" && (
          <ProgressDashboard
            progress={progress}
            onSelectLesson={selectLesson}
            onReset={resetProgress}
          />
        )}
      </main>

      <footer className="app-footer">
        Notecraft — practice with real-time pitch feedback, right in your browser.
      </footer>
    </div>
  );
}
