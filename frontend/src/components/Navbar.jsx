import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          <span className="brand-mark">Z</span>
          Ziptrrip Todo
        </Link>
        <nav className="navbar-links">
          <Link
            to="/"
            className={location.pathname === "/" ? "nav-link active" : "nav-link"}
          >
            All Todos
          </Link>
        </nav>
      </div>
    </header>
  );
}
