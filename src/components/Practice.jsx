import { useCallback, useEffect, useRef, useState } from "react";
import { autoCorrelate, frequencyToNote } from "../lib/pitchDetect";
import GuitarFretboard from "./GuitarFretboard";
import PianoKeyboard from "./PianoKeyboard";

// How many consecutive in-tune animation frames count as "held" before we
// advance to the next note. At ~60fps this is roughly three-quarters of a
// second of steady, correct pitch.
const FRAMES_TO_CONFIRM = 45;
const IN_TUNE_CENTS = 25;
const FFT_SIZE = 2048;

export default function Practice({ lesson, onExit, onComplete }) {
  const [micState, setMicState] = useState("idle"); // idle | listening | denied | error
  const [noteIndex, setNoteIndex] = useState(0);
  const [detected, setDetected] = useState(null); // { name, octave, cents, frequency }
  const [holdProgress, setHoldProgress] = useState(0);
  const [noteScores, setNoteScores] = useState([]);
  const [finished, setFinished] = useState(false);

  const audioCtxRef = useRef(null);
  const analyserRef = useRef(null);
  const streamRef = useRef(null);
  const rafRef = useRef(null);
  const dataArrayRef = useRef(null);
  const holdFramesRef = useRef(0);
  const holdCentsRef = useRef([]);
  const noteIndexRef = useRef(0);
  const tickRef = useRef(null);

  const target = lesson.notes[noteIndex];

  const stopListening = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
      audioCtxRef.current.close();
      audioCtxRef.current = null;
    }
  }, []);

  useEffect(() => stopListening, [stopListening]);

  const advanceNote = useCallback(
    (score) => {
      setNoteScores((prev) => {
        const next = [...prev, score];
        if (noteIndexRef.current + 1 >= lesson.notes.length) {
          const overall = next.reduce((sum, s) => sum + s, 0) / next.length;
          stopListening();
          setFinished(true);
          onComplete(overall);
        } else {
          noteIndexRef.current += 1;
          setNoteIndex(noteIndexRef.current);
        }
        return next;
      });
      holdFramesRef.current = 0;
      holdCentsRef.current = [];
      setHoldProgress(0);
    },
    [lesson.notes.length, onComplete, stopListening]
  );

  const tick = useCallback(() => {
    const analyser = analyserRef.current;
    const audioCtx = audioCtxRef.current;
    const dataArray = dataArrayRef.current;
    if (!analyser || !audioCtx || !dataArray) return;

    analyser.getFloatTimeDomainData(dataArray);
    const frequency = autoCorrelate(dataArray, audioCtx.sampleRate);
    const currentTarget = lesson.notes[noteIndexRef.current];

    if (frequency > 0) {
      const note = frequencyToNote(frequency);
      setDetected(note);

      const matchesName = note.name === currentTarget.name && note.octave === currentTarget.octave;
      if (matchesName && Math.abs(note.cents) <= IN_TUNE_CENTS) {
        holdFramesRef.current += 1;
        holdCentsRef.current.push(Math.abs(note.cents));
        setHoldProgress(Math.min(1, holdFramesRef.current / FRAMES_TO_CONFIRM));
        if (holdFramesRef.current >= FRAMES_TO_CONFIRM) {
          const avgCents =
            holdCentsRef.current.reduce((a, b) => a + b, 0) / holdCentsRef.current.length;
          const score = Math.max(0, 1 - avgCents / IN_TUNE_CENTS) * 0.5 + 0.5;
          advanceNote(score);
        }
      } else {
        holdFramesRef.current = Math.max(0, holdFramesRef.current - 2);
        holdCentsRef.current = [];
        setHoldProgress(Math.min(1, holdFramesRef.current / FRAMES_TO_CONFIRM));
      }
    } else {
      setDetected(null);
      holdFramesRef.current = Math.max(0, holdFramesRef.current - 1);
      setHoldProgress(Math.min(1, holdFramesRef.current / FRAMES_TO_CONFIRM));
    }

    rafRef.current = requestAnimationFrame(() => tickRef.current?.());
  }, [advanceNote, lesson.notes]);

  useEffect(() => {
    tickRef.current = tick;
  }, [tick]);

  const startListening = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const audioCtx = new AudioCtx();
      audioCtxRef.current = audioCtx;

      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = FFT_SIZE;
      source.connect(analyser);
      analyserRef.current = analyser;
      dataArrayRef.current = new Float32Array(analyser.fftSize);

      setMicState("listening");
      rafRef.current = requestAnimationFrame(() => tickRef.current?.());
    } catch (err) {
      setMicState(err?.name === "NotAllowedError" ? "denied" : "error");
    }
  }, []);

  const centsOffset = detected?.cents ?? 0;
  const needleClass = detected
    ? Math.abs(centsOffset) <= IN_TUNE_CENTS
      ? "in-tune"
      : centsOffset > 0
        ? "sharp"
        : "flat"
    : "silent";

  return (
    <div className="practice-page">
      <div className="practice-top">
        <button className="link-btn" onClick={onExit}>
          ← Back to lessons
        </button>
        <span className="practice-lesson-title">{lesson.title}</span>
        <span className="practice-progress-count">
          {Math.min(noteIndex + 1, lesson.notes.length)} / {lesson.notes.length}
        </span>
      </div>

      {micState === "idle" && (
        <div className="mic-gate">
          <h2>Ready to practice {lesson.title.toLowerCase()}?</h2>
          <p>Tonus needs microphone access to listen to your pitch. Nothing is recorded or sent anywhere — it's analyzed live in your browser.</p>
          <button className="btn btn-primary" onClick={startListening}>
            Enable microphone &amp; start
          </button>
        </div>
      )}

      {micState === "denied" && (
        <div className="mic-gate mic-error">
          <h2>Microphone access denied</h2>
          <p>Tonus can't listen without it. Allow microphone access in your browser's site settings, then try again.</p>
          <button className="btn btn-secondary" onClick={startListening}>
            Try again
          </button>
        </div>
      )}

      {micState === "error" && (
        <div className="mic-gate mic-error">
          <h2>Couldn't access the microphone</h2>
          <p>Something went wrong reaching an audio input on this device.</p>
          <button className="btn btn-secondary" onClick={startListening}>
            Try again
          </button>
        </div>
      )}

      {micState === "listening" && !finished && (
        <div className="tuner">
          <div className="target-note">
            <span className="eyebrow">Play or sing</span>
            <h1>
              {target.name}
              <sub>{target.octave}</sub>
            </h1>
            <p>{target.label}</p>
          </div>

          {lesson.instrument === "guitar" && (
            <GuitarFretboard name={target.name} octave={target.octave} />
          )}
          {lesson.instrument === "piano" && (
            <PianoKeyboard name={target.name} octave={target.octave} />
          )}

          <div className={`meter ${needleClass}`}>
            <div className="meter-track">
              <div className="meter-center-line" />
              <div
                className="meter-needle"
                style={{ transform: `translateX(${Math.max(-1, Math.min(1, centsOffset / 50)) * 90}px)` }}
              />
            </div>
            <div className="meter-labels">
              <span>Flat</span>
              <span>In tune</span>
              <span>Sharp</span>
            </div>
          </div>

          <div className="detected-readout">
            {detected ? (
              <>
                <span className="detected-note">
                  {detected.name}
                  {detected.octave}
                </span>
                <span className="detected-cents">
                  {detected.cents > 0 ? "+" : ""}
                  {detected.cents}¢
                </span>
              </>
            ) : (
              <span className="detected-none">Listening…</span>
            )}
          </div>

          <div className="hold-bar">
            <div className="hold-bar-fill" style={{ width: `${holdProgress * 100}%` }} />
          </div>
          <p className="hold-hint">Hold the note steady to confirm it</p>
        </div>
      )}

      {finished && (
        <div className="lesson-complete">
          <h2>Lesson complete 🎉</h2>
          <p>
            Overall accuracy:{" "}
            <strong>
              {Math.round((noteScores.reduce((a, b) => a + b, 0) / noteScores.length) * 100)}%
            </strong>
          </p>
          <div className="note-score-list">
            {lesson.notes.map((n, i) => (
              <div key={i} className="note-score-row">
                <span>
                  {n.name}
                  {n.octave}
                </span>
                <span>{Math.round((noteScores[i] ?? 0) * 100)}%</span>
              </div>
            ))}
          </div>
          <button className="btn btn-primary" onClick={onExit}>
            Back to lessons
          </button>
        </div>
      )}
    </div>
  );
}
