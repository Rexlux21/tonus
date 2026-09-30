import { useState } from "react";
import { findKey } from "../lib/keyFinder";
import { findAnyFretPosition } from "../lib/guitarFretboard";
import GuitarFretboard from "./GuitarFretboard";

const EXAMPLE = "G C D Em";

export default function KeyFinder() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setResult(findKey(input));
  };

  return (
    <div className="key-finder">
      <form className="key-finder-form" onSubmit={handleSubmit}>
        <label className="eyebrow" htmlFor="chord-input">
          Chords used in the song
        </label>
        <div className="key-finder-row">
          <input
            id="chord-input"
            type="text"
            placeholder={`e.g. ${EXAMPLE}`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">
            Find the key
          </button>
        </div>
        <p className="key-finder-hint">
          Type the chords in the order they appear, separated by spaces or commas.
        </p>
      </form>

      {result && result.parsed.length === 0 && (
        <p className="key-finder-error">Couldn't read any chords from that — try something like "{EXAMPLE}".</p>
      )}

      {result && result.best && (
        <div className="key-finder-result">
          <div className="key-result-header">
            <span className="eyebrow">Most likely key</span>
            <h3>{result.best.name}</h3>
            {!result.isExact && (
              <p className="key-finder-note">
                Not every chord fit neatly — this is the closest match, not a certain answer.
              </p>
            )}
            {result.alternates.length > 0 && (
              <p className="key-finder-note">
                Could also be read as {result.alternates.map((k) => k.name).join(" or ")} — the
                same chords are shared between relative major/minor keys.
              </p>
            )}
          </div>

          <div className="key-result-section">
            <span className="eyebrow">Chord progression</span>
            <div className="progression-row">
              {result.progression.map((step, i) => (
                <span key={i} className={`progression-chip${step.inKey ? "" : " out-of-key"}`}>
                  {step.chord}
                  <em>{step.roman}</em>
                </span>
              ))}
            </div>
          </div>

          <div className="key-result-section">
            <span className="eyebrow">Diatonic chords &amp; tabs</span>
            <div className="degree-grid">
              {result.best.degrees.map((d) => {
                const position = findAnyFretPosition(d.noteName);
                return (
                  <div key={d.roman} className="degree-card">
                    <div className="degree-card-top">
                      <span className="degree-roman">{d.roman}</span>
                      <span className="degree-name">
                        {d.noteName}
                        {d.quality === "minor" ? "m" : d.quality === "diminished" ? "dim" : ""}
                      </span>
                    </div>
                    {position ? (
                      <GuitarFretboard name={d.noteName} octave={position.octave} />
                    ) : (
                      <p className="fretboard-fallback">—</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="key-result-section">
            <span className="eyebrow">Tonic sol-fa</span>
            <div className="solfa-row">
              {result.best.degrees.map((d) => (
                <div key={d.roman} className="solfa-chip">
                  <span className="solfa-syllable">{d.solfa}</span>
                  <span className="solfa-note">{d.noteName}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
