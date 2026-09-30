// Real-time monophonic pitch detection for the browser.
//
// autoCorrelate() implements the ACF2+ technique (time-domain autocorrelation
// with parabolic interpolation for sub-sample precision) — a well-established
// approach for detecting a single played/sung pitch from a microphone buffer
// in real time, popularized by Chris Wilson's pitch-detector demo for the
// Web Audio API. It trades some accuracy on very noisy or polyphonic input
// for being fast enough to run every animation frame.

const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

/**
 * @param {Float32Array} buffer time-domain samples from an AnalyserNode
 * @param {number} sampleRate the AudioContext's sample rate
 * @returns {number} detected frequency in Hz, or -1 if no clear pitch was found
 */
export function autoCorrelate(buffer, sampleRate) {
  const SIZE = buffer.length;

  // Bail out on near-silence rather than reporting a noisy, meaningless pitch.
  let rms = 0;
  for (let i = 0; i < SIZE; i++) {
    rms += buffer[i] * buffer[i];
  }
  rms = Math.sqrt(rms / SIZE);
  if (rms < 0.01) return -1;

  // Trim leading/trailing near-zero samples so the autocorrelation window
  // centers on the actual waveform.
  let start = 0;
  let end = SIZE - 1;
  const threshold = 0.2;
  for (let i = 0; i < SIZE / 2; i++) {
    if (Math.abs(buffer[i]) >= threshold) {
      start = i;
      break;
    }
  }
  for (let i = 1; i < SIZE / 2; i++) {
    if (Math.abs(buffer[SIZE - i]) >= threshold) {
      end = SIZE - i;
      break;
    }
  }
  const trimmed = buffer.slice(start, end);
  const n = trimmed.length;
  if (n < 8) return -1;

  const correlations = new Array(n).fill(0);
  for (let lag = 0; lag < n; lag++) {
    let sum = 0;
    for (let i = 0; i < n - lag; i++) {
      sum += trimmed[i] * trimmed[i + lag];
    }
    correlations[lag] = sum;
  }

  // Skip the initial downward slope from lag 0 (perfect self-correlation)
  // before looking for the first real correlation peak.
  let d = 0;
  while (d < n - 1 && correlations[d] > correlations[d + 1]) d++;

  let maxValue = -1;
  let maxLag = -1;
  for (let i = d; i < n; i++) {
    if (correlations[i] > maxValue) {
      maxValue = correlations[i];
      maxLag = i;
    }
  }
  if (maxLag <= 0) return -1;

  // Parabolic interpolation around the peak for sub-sample-accurate lag.
  const x1 = correlations[maxLag - 1] ?? correlations[maxLag];
  const x2 = correlations[maxLag];
  const x3 = correlations[maxLag + 1] ?? correlations[maxLag];
  const a = (x1 + x3 - 2 * x2) / 2;
  const b = (x3 - x1) / 2;
  const refinedLag = a ? maxLag - b / (2 * a) : maxLag;

  if (refinedLag <= 0) return -1;
  const frequency = sampleRate / refinedLag;

  // Human voice / instrument fundamentals of interest fall well inside this
  // range; anything outside it is almost certainly a detection artifact.
  if (frequency < 60 || frequency > 1500) return -1;
  return frequency;
}

/**
 * Converts a frequency in Hz to the nearest musical note, using A4 = 440Hz
 * as the reference pitch (standard concert tuning).
 * @param {number} frequency
 * @returns {{name: string, octave: number, cents: number, frequency: number} | null}
 */
export function frequencyToNote(frequency) {
  if (!frequency || frequency <= 0) return null;
  const midi = 69 + 12 * Math.log2(frequency / 440);
  const roundedMidi = Math.round(midi);
  const cents = Math.round((midi - roundedMidi) * 100);
  const noteIndex = ((roundedMidi % 12) + 12) % 12;
  const octave = Math.floor(roundedMidi / 12) - 1;
  return { name: NOTE_NAMES[noteIndex], octave, cents, frequency };
}

/** Convenience: standard equal-temperament frequency for a given note/octave. */
export function noteToFrequency(name, octave) {
  const index = NOTE_NAMES.indexOf(name);
  if (index === -1) return null;
  const midi = (octave + 1) * 12 + index;
  return 440 * Math.pow(2, (midi - 69) / 12);
}
