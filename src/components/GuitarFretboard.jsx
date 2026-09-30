import { STANDARD_TUNING, findFretPosition } from "../lib/guitarFretboard";

const VISIBLE_FRETS = 5;

export default function GuitarFretboard({ name, octave }) {
  const position = findFretPosition(name, octave);

  if (!position) {
    return <p className="fretboard-fallback">Play {name}{octave} anywhere on the neck.</p>;
  }

  const { stringIndex, fret } = position;
  // Keep the target fret inside a small visible window instead of always
  // starting at fret 0, so higher positions still read clearly.
  const windowStart = fret <= VISIBLE_FRETS - 2 ? 0 : fret - 1;
  const frets = Array.from({ length: VISIBLE_FRETS }, (_, i) => windowStart + i);

  const stringGap = 22;
  const fretWidth = 56;
  const leftPad = 44;
  const topPad = 14;
  const width = leftPad + frets.length * fretWidth + 16;
  const height = topPad * 2 + stringGap * (STANDARD_TUNING.length - 1);

  return (
    <div className="fretboard-wrap">
      <svg viewBox={`0 0 ${width} ${height}`} className="fretboard-svg" role="img" aria-label={`Fret diagram for ${name}${octave}`}>
        {/* nut or fret-window start line */}
        <line
          x1={leftPad}
          y1={topPad - 6}
          x2={leftPad}
          y2={height - topPad + 6}
          stroke="var(--border)"
          strokeWidth={windowStart === 0 ? 5 : 1.5}
        />
        {/* fret lines */}
        {frets.map((f, i) => (
          <line
            key={f}
            x1={leftPad + (i + 1) * fretWidth}
            y1={topPad - 6}
            x2={leftPad + (i + 1) * fretWidth}
            y2={height - topPad + 6}
            stroke="var(--border)"
            strokeWidth={1.5}
          />
        ))}
        {/* strings */}
        {STANDARD_TUNING.map((str, i) => (
          <g key={str.name + i}>
            <line
              x1={leftPad}
              y1={topPad + i * stringGap}
              x2={width - 16}
              y2={topPad + i * stringGap}
              stroke="var(--ink-muted)"
              strokeWidth={1 + i * 0.3}
            />
            <text x={12} y={topPad + i * stringGap + 4} className="fretboard-string-label">
              {str.name}
            </text>
          </g>
        ))}
        {/* fret number labels */}
        {frets.map((f, i) => (
          <text
            key={`n${f}`}
            x={leftPad + (i + 0.5) * fretWidth}
            y={height - 2}
            textAnchor="middle"
            className="fretboard-fret-label"
          >
            {f === 0 ? "open" : f}
          </text>
        ))}
        {/* target dot */}
        <circle
          cx={leftPad + (fret - windowStart + 0.5) * fretWidth}
          cy={topPad + stringIndex * stringGap}
          r={9}
          className="fretboard-target"
        />
      </svg>
      <p className="fretboard-caption">
        {STANDARD_TUNING[stringIndex].label}, {fret === 0 ? "open string" : `fret ${fret}`}
      </p>
    </div>
  );
}
