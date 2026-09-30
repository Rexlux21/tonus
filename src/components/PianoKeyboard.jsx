const WHITE_KEYS = ["C", "D", "E", "F", "G", "A", "B"];
// Black key sits right after these white keys (no black key after E or B).
const BLACK_AFTER = { C: "C#", D: "D#", F: "F#", G: "G#", A: "A#" };

const WHITE_WIDTH = 40;
const BLACK_WIDTH = 24;

export default function PianoKeyboard({ name, octave }) {
  return (
    <div className="piano-wrap">
      <div className="piano-keys" style={{ width: WHITE_KEYS.length * WHITE_WIDTH }}>
        {WHITE_KEYS.map((key, i) => (
          <div
            key={key}
            className={`piano-key white${key === name ? " active" : ""}`}
            style={{ left: i * WHITE_WIDTH, width: WHITE_WIDTH }}
          >
            <span>{key}</span>
          </div>
        ))}
        {WHITE_KEYS.map((key, i) => {
          const blackNote = BLACK_AFTER[key];
          if (!blackNote) return null;
          return (
            <div
              key={blackNote}
              className={`piano-key black${blackNote === name ? " active" : ""}`}
              style={{ left: (i + 1) * WHITE_WIDTH - BLACK_WIDTH / 2, width: BLACK_WIDTH }}
            />
          );
        })}
      </div>
      <p className="piano-caption">
        {name}
        {octave} highlighted above
      </p>
    </div>
  );
}
