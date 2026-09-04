import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  const todayDate = new Date().toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <div className="navbar-user">
          <div className="user-avatar" title="User Profile">
            L
          </div>
          <div className="user-info">
            <span className="user-name">Lithish N</span>
            <span className="user-date">{todayDate}</span>
          </div>
        </div>

        <Link to="/" className="navbar-brand">
          <span className="brand-badge">ZIPTRRIP</span>
          Task Manager
        </Link>
      </div>
    </header>
  );
}
