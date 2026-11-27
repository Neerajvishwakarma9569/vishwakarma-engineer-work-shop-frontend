import React from "react";
import './Css/Loader.css'

export default function Loader({ label = "Loading..." }) {
  return (
    <div className="loading-state" role="status" aria-live="polite">
      <span className="loading-spinner" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}
