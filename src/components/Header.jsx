import { INSTRUMENTS } from "../data/lessons";

export default function Header({ view, activeInstrument, onNavigate, onSelectInstrument, xp, streak }) {
  const navItems = [
    { id: "landing", label: "Home" },
    { id: "lessons", label: "Lessons" },
    { id: "songtools", label: "Song Tools" },
    { id: "progress", label: "Progress" },
  ];

  return (
    <header className="app-header">
      <button className="logo" onClick={() => onNavigate("landing")}>
        <span className="logo-mark">T</span>
        Tonus
      </button>

      <nav className="main-nav">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`nav-link${view === item.id ? " active" : ""}`}
            onClick={() => onNavigate(item.id)}
          >
            {item.label}
          </button>
        ))}

        <span className="nav-divider" aria-hidden="true" />

        {INSTRUMENTS.map((inst) => (
          <button
            key={inst.id}
            className={`nav-link nav-instrument${
              view === "lessons" && activeInstrument === inst.id ? " active" : ""
            }`}
            onClick={() => onSelectInstrument(inst.id)}
          >
            {inst.label}
          </button>
        ))}
      </nav>

      <div className="header-stats">
        <span className="stat-chip streak" title="Daily practice streak">
          🔥 {streak}
        </span>
        <span className="stat-chip xp" title="Experience points">
          {xp} XP
        </span>
      </div>
    </header>
  );
}
