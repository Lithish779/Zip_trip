import { CategoryIcon } from "./Icons";

export default function StatsBar({ stats, todos = [], onNewTaskClick }) {
  if (!stats) return null;

  const total = stats.total || 0;
  const completed = stats.completed || 0;
  const completionPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  // SVG Circular progress ring calculations
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (completionPercentage / 100) * circumference;

  // Featured themes for the real-time data cards (1st card blue/cyan, 2nd orange, 3rd violet)
  const cardThemes = ["feature-card-cyan", "feature-card-orange", "feature-card-violet"];
  const featuredTasks = todos.length > 0 ? todos.slice(0, 2) : [];

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

      {/* 2. Featured Category Cards Grid (Real time task data) */}
      <div className="section-heading">
        <h2>Today's Tasks</h2>
        <span className="see-all-link">{stats.total} total items</span>
      </div>

      <div className="featured-grid">
        {featuredTasks.length > 0 ? (
          featuredTasks.map((todo, idx) => {
            const themeClass = cardThemes[idx % cardThemes.length];
            const taskProgress = todo.completed ? 100 : (todo.progress ?? (todo.priority === "high" ? 85 : todo.priority === "medium" ? 60 : 40));
            const badgeLabel = todo.priority === "high" ? "High Priority" : (todo.category || "Task");

            return (
              <div key={todo.id} className={`feature-card ${themeClass}`}>
                <div className="feature-card-header">
                  <div className="feature-icon-badge">
                    <CategoryIcon category={todo.category} />
                  </div>
                  <span className="badge" style={{ background: "rgba(255,255,255,0.25)", color: "#fff" }}>
                    {badgeLabel}
                  </span>
                </div>
                <div>
                  <h3 className="feature-card-title">{todo.title}</h3>
                  <div className="progress-bar-bg">
                    <div className="progress-bar-fill" style={{ width: `${taskProgress}%` }}></div>
                  </div>
                  <div className="progress-info">
                    <span>Progress</span>
                    <span>{taskProgress}%</span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="feature-card feature-card-cyan" style={{ justifyContent: "center", alignItems: "center", textAlign: "center" }}>
            <p style={{ margin: 0, fontWeight: 600, fontSize: "0.95rem" }}>
              No tasks yet. Create a new task above to see it here!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
