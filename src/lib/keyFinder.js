// Chord-based key finder. Given the chords a learner already knows are in a
// song (typed in, e.g. "G C D Em"), works out which key the song is most
// likely in using real diatonic-harmony rules — no external API, since no
// free service reliably identifies a song's key from its title or audio.

const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

const NOTE_ALIASES = {
  C: 0, "C#": 1, Db: 1, D: 2, "D#": 3, Eb: 3, E: 4, Fb: 4,
  F: 5, "E#": 5, "F#": 6, Gb: 6, G: 7, "G#": 8, Ab: 8,
  A: 9, "A#": 10, Bb: 10, B: 11, Cb: 11,
};

const MAJOR_STEPS = [0, 2, 4, 5, 7, 9, 11];
const MAJOR_QUALITIES = ["major", "minor", "minor", "major", "major", "minor", "diminished"];
const MAJOR_ROMAN = ["I", "ii", "iii", "IV", "V", "vi", "vii°"];
const MAJOR_SOLFA = ["Do", "Re", "Mi", "Fa", "Sol", "La", "Ti"];

// Natural minor, using the standard movable-do convention where the minor
// tonic is sung "La" (so the same solfa syllables describe a major scale
// and its relative minor, just starting from a different degree).
const MINOR_STEPS = [0, 2, 3, 5, 7, 8, 10];
const MINOR_QUALITIES = ["minor", "diminished", "major", "minor", "minor", "major", "major"];
const MINOR_ROMAN = ["i", "ii°", "III", "iv", "v", "VI", "VII"];
const MINOR_SOLFA = ["La", "Ti", "Do", "Re", "Mi", "Fa", "Sol"];

function buildKey(tonicIndex, isMinor) {
  const steps = isMinor ? MINOR_STEPS : MAJOR_STEPS;
  const qualities = isMinor ? MINOR_QUALITIES : MAJOR_QUALITIES;
  const romans = isMinor ? MINOR_ROMAN : MAJOR_ROMAN;
  const solfa = isMinor ? MINOR_SOLFA : MAJOR_SOLFA;
  const degrees = steps.map((step, i) => {
    const noteIndex = (tonicIndex + step) % 12;
    return {
      noteIndex,
      noteName: NOTE_NAMES[noteIndex],
      quality: qualities[i],
      roman: romans[i],
      solfa: solfa[i],
    };
  });
  return {
    tonicIndex,
    isMinor,
    name: `${NOTE_NAMES[tonicIndex]} ${isMinor ? "Minor" : "Major"}`,
    degrees,
  };
}

const ALL_KEYS = [];
for (let i = 0; i < 12; i++) {
  ALL_KEYS.push(buildKey(i, false));
  ALL_KEYS.push(buildKey(i, true));
}

/**
 * Parses a chord symbol like "G", "Am7", "F#dim", "Bb", "Csus4" into a root
 * note index (0-11) and a simplified triad quality. Extensions (7, sus4,
 * add9, maj7...) are folded into "major" for key-matching purposes — they
 * don't change which key a chord belongs to, just its color.
 */
export function parseChord(raw) {
  const trimmed = raw.trim();
  const match = trimmed.match(/^([A-Ga-g])(#|b)?(.*)$/);
  if (!match) return null;
  const [, letter, accidental, rest] = match;
  const key = letter.toUpperCase() + (accidental ?? "");
  const noteIndex = NOTE_ALIASES[key];
  if (noteIndex === undefined) return null;

  let quality = "major";
  if (/^(dim|°|o(?![a-z]))/i.test(rest)) quality = "diminished";
  else if (/^(m|min)(?!aj)/i.test(rest)) quality = "minor";

  return { root: NOTE_NAMES[noteIndex], rootIndex: noteIndex, quality, original: trimmed };
}

/**
 * Given an ordered list of chord symbols, finds the best-matching key(s).
 * Only keys where every chord is diatonic are considered matches; when a
 * major key and its relative minor tie (they always share the same diatonic
 * chords), the chord list's first and last chords are used as a tie-breaker
 * since real progressions usually start or end on the tonic.
 */
export function findKey(chordSymbols) {
  const parsed = chordSymbols
    .split(/[\s,]+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map(parseChord)
    .filter(Boolean);

  if (parsed.length === 0) {
    return { parsed, matches: [], best: null };
  }

  const scored = ALL_KEYS.map((key) => {
    const matchCount = parsed.filter((chord) =>
      key.degrees.some((d) => d.noteIndex === chord.rootIndex && d.quality === chord.quality)
    ).length;
    return { key, matchCount };
  });

  const maxMatch = Math.max(...scored.map((s) => s.matchCount));
  const fullMatches = scored.filter((s) => s.matchCount === parsed.length && parsed.length > 0);
  const candidates = fullMatches.length > 0 ? fullMatches : scored.filter((s) => s.matchCount === maxMatch);

  const first = parsed[0];
  const last = parsed[parsed.length - 1];
  const scoreTiebreak = (s) => {
    let bonus = 0;
    if (s.key.tonicIndex === first.rootIndex) bonus += 2;
    if (s.key.tonicIndex === last.rootIndex) bonus += 1;
    return bonus;
  };
  candidates.sort((a, b) => scoreTiebreak(b) - scoreTiebreak(a));

  const best = candidates[0]?.key ?? null;
  const isExact = fullMatches.length > 0;

  const progression = best
    ? parsed.map((chord) => {
        const degree = best.degrees.find(
          (d) => d.noteIndex === chord.rootIndex && d.quality === chord.quality
        );
        return { chord: chord.original, roman: degree?.roman ?? "?", inKey: Boolean(degree) };
      })
    : [];

  return {
    parsed,
    isExact,
    best,
    // Other keys tied with the best match (usually the relative major/minor).
    alternates: candidates.slice(1, 3).map((c) => c.key),
    progression,
  };
}
