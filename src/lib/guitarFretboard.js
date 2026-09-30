// Maps a target note to a real, playable position on a standard-tuned
// six-string guitar (E2 A2 D3 G3 B3 E4, low to high), so the practice UI can
// show the learner where to put their finger instead of just a note name.

const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

// Index 0 = low E (6th string) ... index 5 = high E (1st string), matching
// how a fretboard diagram is usually drawn top-to-bottom.
export const STANDARD_TUNING = [
  { name: "E", octave: 2, label: "6th string (low E)" },
  { name: "A", octave: 2, label: "5th string" },
  { name: "D", octave: 3, label: "4th string" },
  { name: "G", octave: 3, label: "3rd string" },
  { name: "B", octave: 3, label: "2nd string" },
  { name: "E", octave: 4, label: "1st string (high E)" },
];

function noteToMidi(name, octave) {
  return (octave + 1) * 12 + NOTE_NAMES.indexOf(name);
}

/**
 * Finds the lowest-fret playable position for a note on standard tuning.
 * @returns {{ stringIndex: number, fret: number } | null} stringIndex is
 *   0 (low E) through 5 (high E); null if the note isn't reachable within
 *   maxFret frets on any string (shouldn't happen for our lesson notes).
 */
export function findFretPosition(name, octave, maxFret = 15) {
  const targetMidi = noteToMidi(name, octave);
  let best = null;
  STANDARD_TUNING.forEach((open, stringIndex) => {
    const fret = targetMidi - noteToMidi(open.name, open.octave);
    if (fret >= 0 && fret <= maxFret && (!best || fret < best.fret)) {
      best = { stringIndex, fret };
    }
  });
  return best;
}
