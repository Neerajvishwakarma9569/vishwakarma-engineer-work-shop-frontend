import React from "react";
import { ArrowRight, Compass, Home } from "lucide-react";
import { Link } from "react-router-dom";
import "./Css/NotFound.css";

export default function NotFound() {
  return (
    <main className="not-found-page container section">
      <section className="not-found-content" aria-labelledby="not-found-title">
        <div className="not-found-illustration" aria-hidden="true">
          <span>4</span>
          <span className="not-found-zero">
            0
            <Compass size={48} strokeWidth={1.5} />
          </span>
          <span>4</span>
        </div>
        <span className="eyebrow">ERROR 404</span>
        <h1 id="not-found-title">Page not found</h1>
        <p>
          The page you are looking for may have moved, or the address may be
          incorrect. Let’s get you back on track.
        </p>
        <nav className="not-found-actions" aria-label="Helpful links">
          <Link className="btn btn-dark" to="/">
            <Home size={17} />
            Back to home
          </Link>
          <Link className="not-found-products-link" to="/products">
            Explore products
            <ArrowRight size={17} />
          </Link>
        </nav>
      </section>
    </main>
  );
}
