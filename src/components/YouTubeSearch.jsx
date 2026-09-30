import { useState } from "react";

export default function YouTubeSearch() {
  const [query, setQuery] = useState("");

  const searchUrl = query.trim()
    ? `https://www.youtube.com/results?search_query=${encodeURIComponent(query.trim())}`
    : null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchUrl) window.open(searchUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <form className="yt-search" onSubmit={handleSubmit}>
      <label className="eyebrow" htmlFor="yt-search-input">
        Find a song on YouTube
      </label>
      <div className="yt-search-row">
        <input
          id="yt-search-input"
          type="text"
          placeholder="Song title or artist…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" className="btn btn-primary" disabled={!searchUrl}>
          Search on YouTube
        </button>
      </div>
      <p className="yt-search-hint">Opens YouTube search results in a new tab.</p>
    </form>
  );
}
