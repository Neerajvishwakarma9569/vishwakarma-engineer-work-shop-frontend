import { Hammer, Ruler, ShieldCheck } from "lucide-react";
import React from "react";
import "./css/projects.css";

export default function Projects() {
  return (
    <main className="projects-page container section">
      <div className="page-heading">
        <span className="eyebrow">OUR PROJECTS</span>
        <h1>Work shaped around real spaces.</h1>
        <p>
          Project photos can be added to this gallery as your portfolio grows.
        </p>
      </div>
      <div className="project-placeholder-grid">
        {[
          "Gates & entrances",
          "Railings & balconies",
          "Custom fabrication",
        ].map((x, i) => (
          <div className="project-placeholder" key={x}>
            <span>0{i + 1}</span>
            {i === 0 ? <ShieldCheck /> : i === 1 ? <Ruler /> : <Hammer />}
            <h3>{x}</h3>
            <p>Project showcase image coming soon</p>
          </div>
        ))}
      </div>
    </main>
  );
}
