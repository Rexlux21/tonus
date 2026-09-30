// Each lesson is a short, ordered sequence of target notes. Practice mode
// walks the learner through them one at a time, listening via the
// microphone and confirming pitch before advancing.

export const INSTRUMENTS = [
  { id: "guitar", label: "Guitar" },
  { id: "piano", label: "Piano" },
  { id: "voice", label: "Voice" },
];

export const LESSONS = [
  {
    id: "guitar-open-strings",
    instrument: "guitar",
    title: "Open Strings",
    level: "Beginner",
    description:
      "Play each open string on its own and hold it until Tonus confirms you're in tune.",
    notes: [
      { name: "E", octave: 2, label: "Low E — 6th string" },
      { name: "A", octave: 2, label: "A — 5th string" },
      { name: "D", octave: 3, label: "D — 4th string" },
      { name: "G", octave: 3, label: "G — 3rd string" },
      { name: "B", octave: 3, label: "B — 2nd string" },
      { name: "E", octave: 4, label: "High E — 1st string" },
    ],
  },
  {
    id: "guitar-first-riff",
    instrument: "guitar",
    title: "First Riff: E Minor Pentatonic",
    level: "Beginner",
    description:
      "The first five notes of the E minor pentatonic scale, the backbone of most beginner riffs.",
    notes: [
      { name: "E", octave: 3, label: "E" },
      { name: "G", octave: 3, label: "G" },
      { name: "A", octave: 3, label: "A" },
      { name: "B", octave: 3, label: "B" },
      { name: "D", octave: 4, label: "D" },
    ],
  },
  {
    id: "piano-middle-c-scale",
    instrument: "piano",
    title: "Middle C to G",
    level: "Beginner",
    description: "Play a C major scale from middle C up to G, one note at a time.",
    notes: [
      { name: "C", octave: 4, label: "C4 — Middle C" },
      { name: "D", octave: 4, label: "D4" },
      { name: "E", octave: 4, label: "E4" },
      { name: "F", octave: 4, label: "F4" },
      { name: "G", octave: 4, label: "G4" },
    ],
  },
  {
    id: "piano-triad",
    instrument: "piano",
    title: "C Major Triad",
    level: "Beginner",
    description: "Play the three notes of a C major chord separately: root, third, fifth.",
    notes: [
      { name: "C", octave: 4, label: "Root — C4" },
      { name: "E", octave: 4, label: "Third — E4" },
      { name: "G", octave: 4, label: "Fifth — G4" },
    ],
  },
  {
    id: "vocal-pitch-match",
    instrument: "voice",
    title: "Pitch Matching",
    level: "Beginner",
    description: "Sing each note back as steadily as you can. A great daily ear-training warm-up.",
    notes: [
      { name: "C", octave: 4, label: "C4" },
      { name: "E", octave: 4, label: "E4" },
      { name: "G", octave: 4, label: "G4" },
      { name: "C", octave: 5, label: "C5" },
    ],
  },
  {
    id: "vocal-scale-warmup",
    instrument: "voice",
    title: "Five-Note Scale Warm-Up",
    level: "Intermediate",
    description: "A classic five-note ascending warm-up used before rehearsals and lessons.",
    notes: [
      { name: "C", octave: 4, label: "C4" },
      { name: "D", octave: 4, label: "D4" },
      { name: "E", octave: 4, label: "E4" },
      { name: "F", octave: 4, label: "F4" },
      { name: "G", octave: 4, label: "G4" },
    ],
  },
];

export function getLessonById(id) {
  return LESSONS.find((lesson) => lesson.id === id) ?? null;
}
