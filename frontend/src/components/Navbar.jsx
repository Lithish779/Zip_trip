import { Link } from "react-router-dom";
import { ZiptrripLogo } from "./Icons";

export default function Navbar() {
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

        <Link to="/" className="navbar-brand" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <ZiptrripLogo />
          <span className="brand-badge" style={{ background: "rgba(0, 194, 255, 0.12)", color: "#0088CC", border: "1px solid rgba(0, 194, 255, 0.3)" }}>
            TODO
          </span>
        </Link>
      </div>
    </header>
  );
}
