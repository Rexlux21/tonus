import { INSTRUMENTS, LESSONS } from "../data/lessons";

const FEATURES = [
  {
    title: "Real-time pitch listening",
    body: "Your microphone feeds a live pitch detector, so Tonus hears exactly what you play or sing — not a guess after the fact.",
  },
  {
    title: "Any instrument, one method",
    body: "Guitar, piano, or voice — the same note-by-note practice loop adapts to whatever you're learning.",
  },
  {
    title: "Progress that's actually yours",
    body: "XP, streaks, and per-lesson accuracy are tracked locally and never reset just because you closed the tab.",
  },
];

export default function Landing({ onNavigate }) {
  const lessonCount = LESSONS.length;

  return (
    <div className="landing">
      <section className="hero">
        <p className="eyebrow">Ear training that listens back</p>
        <h1>
          Play the note.
          <br />
          Tonus tells you if it's right.
        </h1>
        <p className="hero-sub">
          A practice tool for guitar, piano, and voice that uses your microphone to give
          real-time feedback on pitch — sharp, flat, or right on — the moment you play.
        </p>
        <div className="hero-actions">
          <button className="btn btn-primary" onClick={() => onNavigate("lessons")}>
            Start practicing
          </button>
          <span className="hero-meta">{lessonCount} lessons across 3 instruments</span>
        </div>
      </section>

      <section className="instrument-strip">
        {INSTRUMENTS.map((inst) => (
          <div key={inst.id} className="instrument-pill">
            {inst.label}
          </div>
        ))}
      </section>

      <section className="features">
        {FEATURES.map((feature) => (
          <div key={feature.title} className="feature-card">
            <h3>{feature.title}</h3>
            <p>{feature.body}</p>
          </div>
        ))}
      </section>

      <section className="how-it-works">
        <h2>How a lesson works</h2>
        <ol className="steps">
          <li>
            <span className="step-n">1</span>
            <div>
              <h4>Pick a lesson</h4>
              <p>Choose an instrument and a short, ordered sequence of notes to work through.</p>
            </div>
          </li>
          <li>
            <span className="step-n">2</span>
            <div>
              <h4>Play or sing the target note</h4>
              <p>Tonus listens through your microphone and shows your pitch in real time.</p>
            </div>
          </li>
          <li>
            <span className="step-n">3</span>
            <div>
              <h4>Hold it steady</h4>
              <p>Stay in tune for a moment to confirm the note, then move on to the next one.</p>
            </div>
          </li>
        </ol>
      </section>
    </div>
  );
}
