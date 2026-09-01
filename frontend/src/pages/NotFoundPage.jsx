import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="page empty-state">
      <h1>404</h1>
      <p>That page doesn't exist.</p>
      <Link to="/" className="btn-primary">
        Go home
      </Link>
    </div>
  );
}
