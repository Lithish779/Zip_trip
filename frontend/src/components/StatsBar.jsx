export default function StatsBar({ stats }) {
  if (!stats) return null;

  const items = [
    { label: "Total", value: stats.total },
    { label: "Pending", value: stats.pending },
    { label: "Completed", value: stats.completed },
    { label: "Overdue", value: stats.overdue, warn: stats.overdue > 0 },
  ];

  return (
    <div className="stats-bar">
      {items.map((item) => (
        <div key={item.label} className={`stat-pill ${item.warn ? "stat-warn" : ""}`}>
          <span className="stat-value">{item.value}</span>
          <span className="stat-label">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
