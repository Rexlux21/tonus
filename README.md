# Notecraft

A practice tool for guitar, piano, and voice that listens through your microphone and gives real-time pitch feedback — the same core loop as apps like Yousician, built from scratch with the Web Audio API.

## How it works

- Pick a lesson: a short, ordered sequence of target notes for guitar, piano, or voice.
- Notecraft asks for microphone access, then runs a live pitch-detection loop (autocorrelation with parabolic interpolation, a well-established technique for real-time monophonic pitch tracking) on every animation frame.
- Detected pitch is compared to the target note in cents (hundredths of a semitone). Hold it steady and in tune for about three-quarters of a second to confirm it and move to the next note.
- Finishing a lesson scores your accuracy and saves XP, a daily streak, and your best score per lesson to `localStorage` — nothing leaves your browser.

## Stack

- React + Vite
- Plain CSS (no UI framework) — tokens for light/dark mode via `prefers-color-scheme`
- Web Audio API (`AudioContext`, `AnalyserNode`, `getUserMedia`) for live pitch detection — no external audio library

## Running locally

```bash
npm install
npm run dev
```

Then open the printed local URL. Microphone access is requested only when you start a lesson, and audio is analyzed entirely client-side — nothing is recorded or uploaded.

## Project structure

```
src/
  lib/pitchDetect.js      autocorrelation pitch detection + frequency-to-note conversion
  data/lessons.js         lesson definitions (instrument, target notes)
  hooks/useProgress.js    XP / streak / per-lesson accuracy, persisted to localStorage
  components/
    Landing.jsx           marketing/home page
    LessonList.jsx        browse lessons, filter by instrument
    Practice.jsx          the live tuner/practice screen
    ProgressDashboard.jsx per-lesson progress view
    Header.jsx            nav + XP/streak display
```

## Status

Early-stage demo: six lessons across three instruments, single-note pitch matching. Not yet built: sustained-note/rhythm exercises, chord detection, user accounts, or a backend — everything currently runs client-only.
