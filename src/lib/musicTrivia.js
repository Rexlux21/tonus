// Free, keyless public trivia API (opentdb.com). Category 12 is
// "Entertainment: Music" — general music trivia, not instrument-specific,
// since no free API offers per-instrument exercise questions.
const TRIVIA_URL = "https://opentdb.com/api.php?amount=1&category=12&type=multiple";

// opentdb returns HTML-entity-encoded strings (e.g. &#039;, &quot;). Decode
// the handful of entities that actually show up in trivia text manually,
// rather than round-tripping through the DOM.
const NAMED_ENTITIES = {
  quot: '"',
  "#039": "'",
  apos: "'",
  amp: "&",
  lt: "<",
  gt: ">",
  rsquo: "’",
  lsquo: "‘",
  ldquo: "“",
  rdquo: "”",
};

function decodeHtmlEntities(str) {
  return str.replace(/&(#\d+|#x[0-9a-fA-F]+|[a-zA-Z]+);/g, (match, entity) => {
    if (entity in NAMED_ENTITIES) return NAMED_ENTITIES[entity];
    if (entity.startsWith("#x")) return String.fromCodePoint(parseInt(entity.slice(2), 16));
    if (entity.startsWith("#")) return String.fromCodePoint(parseInt(entity.slice(1), 10));
    return match;
  });
}

function shuffle(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Fetches one music trivia question from the Open Trivia Database.
 * @returns {Promise<{ question: string, answers: string[], correctAnswer: string }>}
 */
export async function fetchMusicTrivia() {
  const res = await fetch(TRIVIA_URL);
  if (!res.ok) throw new Error(`Trivia API error: ${res.status}`);
  const data = await res.json();
  if (data.response_code !== 0 || !data.results?.length) {
    throw new Error("Trivia API returned no questions");
  }
  const item = data.results[0];
  const question = decodeHtmlEntities(item.question);
  const correctAnswer = decodeHtmlEntities(item.correct_answer);
  const answers = shuffle([
    correctAnswer,
    ...item.incorrect_answers.map(decodeHtmlEntities),
  ]);
  return { question, answers, correctAnswer };
}
