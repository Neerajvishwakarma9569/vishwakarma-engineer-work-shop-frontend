import React from "react";
import { Link } from "react-router-dom";
import { Shield, Clock, FileText, ArrowRight, ArrowLeft } from "lucide-react";
import "./policies.css";

export default function PolicyLayout({
  title,
  subtitle,
  lastUpdated = "November 26, 2026",
  children,
}) {
  const policyNav = [
    { label: "Privacy Policy", path: "/privacy-policy" },
    { label: "Refund Policy", path: "/refund-policy" },
    { label: "Return & Replacement", path: "/return-policy" },
    { label: "Cancellation Policy", path: "/cancellation-policy" },
    { label: "Shipping & Delivery", path: "/shipping-policy" },
    { label: "Terms & Conditions", path: "/terms" },
    { label: "Disclaimer", path: "/disclaimer" },
  ];

  return (
    <div className="policy-page">
      {/* Policy Hero Header */}
      <header className="policy-hero">
        <div className="container policy-hero-inner">
          <div className="policy-breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <span>Legal & Policies</span>
            <span>/</span>
            <span className="current">{title}</span>
          </div>

          <div className="policy-badge">
            <Shield size={14} />
            <span>Official Workshop Policy</span>
          </div>

          <h1>{title}</h1>
          <p className="policy-subtitle">{subtitle}</p>

          <div className="policy-meta-row">
            <span className="policy-updated">
              <Clock size={14} /> Last Updated: {lastUpdated}
            </span>
            <span className="policy-tag">Vishwakarma Engineer Workshop</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="container policy-layout-grid">
        {/* Left Navigation Sidebar */}
        <aside className="policy-sidebar">
          <div className="policy-nav-card">
            <h3>
              <FileText size={16} /> Legal & Policies
            </h3>
            <nav className="policy-nav-list">
              {policyNav.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`policy-nav-item ${
                    window.location.pathname === item.path ? "active" : ""
                  }`}
                >
                  <span>{item.label}</span>
                  <ArrowRight size={13} />
                </Link>
              ))}
            </nav>
          </div>

          <div className="policy-help-box">
            <h4>Have Questions?</h4>
            <p>Our customer support team is here to assist with any questions regarding policies or custom orders.</p>
            <a href="tel:+919876543210" className="policy-help-btn">
              Call Support: +91 98765 43210
            </a>
            <Link to="/contact" className="policy-contact-link">
              Send us a message <ArrowRight size={13} />
            </Link>
          </div>
        </aside>

        {/* Right Content Area */}
        <article className="policy-content-card">
          {children}

          <div className="policy-footer-note">
            <p>
              By accessing our website or placing an order with <strong>Vishwakarma Engineer Workshop</strong>, you acknowledge that you have read, understood, and agreed to this policy.
            </p>
            <Link to="/products" className="btn btn-gold btn-sm">
              <ArrowLeft size={14} /> Return to Store
            </Link>
          </div>
        </article>
      </div>
    </div>
  );
}
