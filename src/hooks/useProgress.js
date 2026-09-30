import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "notecraft-progress-v1";

function defaultProgress() {
  return { xp: 0, streak: 0, lastPracticeDate: null, completedLessons: {} };
}

function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...defaultProgress(), ...JSON.parse(raw) } : defaultProgress();
  } catch {
    // Private window, blocked storage, or corrupt data — start fresh rather
    // than crash the app over a convenience feature.
    return defaultProgress();
  }
}

function wasYesterday(dateStr, today) {
  if (!dateStr) return false;
  const prev = new Date(dateStr);
  const cutoff = new Date(today);
  cutoff.setDate(cutoff.getDate() - 1);
  return prev.toDateString() === cutoff.toDateString();
}

/** Tracks XP, a daily practice streak, and per-lesson best accuracy in localStorage. */
export function useProgress() {
  const [progress, setProgress] = useState(loadProgress);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // Nothing we can do if storage is unavailable — progress just won't persist.
    }
  }, [progress]);

  const completeLesson = useCallback((lessonId, accuracy) => {
    setProgress((prev) => {
      const today = new Date().toDateString();
      let streak = prev.streak;
      if (prev.lastPracticeDate !== today) {
        streak = wasYesterday(prev.lastPracticeDate, today) ? prev.streak + 1 : 1;
      }
      const earnedXp = Math.round(accuracy * 50);
      const existing = prev.completedLessons[lessonId];
      return {
        ...prev,
        xp: prev.xp + earnedXp,
        streak,
        lastPracticeDate: today,
        completedLessons: {
          ...prev.completedLessons,
          [lessonId]: {
            timesCompleted: (existing?.timesCompleted ?? 0) + 1,
            bestAccuracy: Math.max(existing?.bestAccuracy ?? 0, accuracy),
          },
        },
      };
    });
  }, []);

  const resetProgress = useCallback(() => setProgress(defaultProgress()), []);

  return { progress, completeLesson, resetProgress };
}
