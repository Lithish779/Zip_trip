import { CategoryIcon } from "./Icons";

export default function StatsBar({ stats, onNewTaskClick }) {
  if (!stats) return null;

  const total = stats.total || 0;
  const completed = stats.completed || 0;
  const completionPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  // SVG Circular progress ring calculations
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (completionPercentage / 100) * circumference;

  return (
    <div className="stats-wrapper">
      {/* 1. Dark Hero Summary Banner (Matching 2nd phone screen top banner) */}
      <div className="hero-banner">
        <div className="hero-content">
          <span className="hero-tag">DAILY PROGRESS</span>
          <h2 className="hero-title">
            {completionPercentage >= 80
              ? "Your daily tasks almost done!"
              : completionPercentage >= 50
              ? "Over halfway through your tasks!"
              : "Let's stay productive today!"}
          </h2>
          <p className="hero-subtitle">
            {completed} of {total} tasks completed • {stats.pending} pending
          </p>
          <button className="btn-primary btn-sm" onClick={onNewTaskClick}>
            + Add New Task
          </button>
        </div>

        <div className="hero-ring-container">
          <svg width="90" height="90" viewBox="0 0 90 90">
            <circle
              cx="45"
              cy="45"
              r={radius}
              stroke="rgba(255, 255, 255, 0.15)"
              strokeWidth="8"
              fill="transparent"
            />
            <circle
              cx="45"
              cy="45"
              r={radius}
              stroke="#00C2FF"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              transform="rotate(-90 45 45)"
              style={{ transition: "stroke-dashoffset 0.5s ease" }}
            />
          </svg>
          <span className="hero-ring-text">{completionPercentage}%</span>
        </div>
      </div>

      {/* 2. Featured Category Cards Grid (Matching 2nd phone screen middle tiles) */}
      <div className="section-heading">
        <h2>Today's Tasks</h2>
        <span className="see-all-link">{stats.total} total items</span>
      </div>

      <div className="featured-grid">
        <div className="feature-card feature-card-cyan">
          <div className="feature-card-header">
            <div className="feature-icon-badge">
              <CategoryIcon category="Work" />
            </div>
            <span className="badge" style={{ background: "rgba(255,255,255,0.2)", color: "#fff" }}>
              Work
            </span>
          </div>
          <div>
            <h3 className="feature-card-title">User Experience Design</h3>
            <div className="progress-bar-bg">
              <div className="progress-bar-fill" style={{ width: "70%" }}></div>
            </div>
            <div className="progress-info">
              <span>Progress</span>
              <span>70%</span>
            </div>
          </div>
        </div>

        <div className="feature-card feature-card-orange">
          <div className="feature-card-header">
            <div className="feature-icon-badge">
              <CategoryIcon category="Health" />
            </div>
            <span className="badge" style={{ background: "rgba(255,255,255,0.2)", color: "#fff" }}>
              High Priority
            </span>
          </div>
          <div>
            <h3 className="feature-card-title">Meeting with Designer</h3>
            <div className="progress-bar-bg">
              <div className="progress-bar-fill" style={{ width: "85%" }}></div>
            </div>
            <div className="progress-info">
              <span>Progress</span>
              <span>85%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
