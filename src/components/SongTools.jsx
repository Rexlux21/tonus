import YouTubeSearch from "./YouTubeSearch";
import KeyFinder from "./KeyFinder";

export default function SongTools() {
  return (
    <div className="song-tools-page">
      <div className="page-heading">
        <h1>Song Tools</h1>
        <p>Look up a song, then work out what key it's in — with the chord progression, tabs, and sol-fa laid out for you.</p>
      </div>

      <div className="song-tools-grid">
        <section className="tool-card">
          <h2>1. Find the song</h2>
          <YouTubeSearch />
        </section>

        <section className="tool-card">
          <h2>2. Find the key</h2>
          <KeyFinder />
        </section>
      </div>
    </div>
  );
}
