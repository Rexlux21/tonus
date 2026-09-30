const TILE_WIDTH = 64;
const TILE_GAP = 8;
const STEP = TILE_WIDTH + TILE_GAP;

// A horizontal "note highway" — every note in the lesson laid out in order,
// sliding past a fixed center marker as the learner advances, Yousician-style.
// Pace is set by the learner actually holding each note in tune (there's no
// backing track to sync to), but the scrolling and hit/upcoming states give
// the same at-a-glance "what's coming next" feel.
export default function NoteHighway({ notes, currentIndex }) {
  const offset = -(currentIndex * STEP);

  return (
    <div className="note-highway">
      <div className="note-highway-marker" />
      <div
        className="note-highway-track"
        style={{ transform: `translateX(calc(50% - ${TILE_WIDTH / 2}px + ${offset}px))` }}
      >
        {notes.map((note, i) => (
          <div
            key={i}
            className={`note-tile${i < currentIndex ? " done" : ""}${i === currentIndex ? " active" : ""}`}
          >
            <span>{note.name}</span>
            <sub>{note.octave}</sub>
          </div>
        ))}
      </div>
    </div>
  );
}
