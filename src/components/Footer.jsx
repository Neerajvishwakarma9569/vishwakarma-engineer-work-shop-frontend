import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  Facebook,
  Instagram,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Youtube,
  Clock,
  ShieldCheck,
} from "lucide-react";
import "./Css/Footer.css";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer-grid">
        {/* Column 1: Brand & Socials */}
        <div className="footer-col footer-brand-block">
          <Link to="/" className="footer-brand" aria-label="Vishwakarma Home">
            <img src="/Images/vishlogo.png" alt="Vishwakarma Engineer Workshop" />
          </Link>
          <p className="footer-brand-desc">
            Built with precision. Crafted to last. Custom iron gates, steel railings, windows, grills, and architectural metal fabrications.
          </p>

          <div className="footer-social-wrap">
            <span className="footer-social-label">Follow Us</span>
            <div className="footer-social-links">
              <a
                href="https://www.instagram.com/"
                aria-label="Instagram"
                target="_blank"
                rel="noreferrer"
                title="Instagram"
              >
                <Instagram size={17} />
              </a>
              <a
                href="https://www.facebook.com/"
                aria-label="Facebook"
                target="_blank"
                rel="noreferrer"
                title="Facebook"
              >
                <Facebook size={17} />
              </a>
              <a
                href="https://www.youtube.com/"
                aria-label="YouTube"
                target="_blank"
                rel="noreferrer"
                title="YouTube"
              >
                <Youtube size={17} />
              </a>
              <a
                href="https://wa.me/919876543210"
                aria-label="WhatsApp"
                target="_blank"
                rel="noreferrer"
                title="WhatsApp"
              >
                <MessageCircle size={17} />
              </a>
              <a
                href="mailto:info@vishwakarmaworkshop.in"
                aria-label="Email Us"
                title="Email Us"
              >
                <Mail size={17} />
              </a>
            </div>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div className="footer-col footer-links-col">
          <h4>Quick Links</h4>
          <nav className="footer-nav-list">
            <Link to="/products">
              <ArrowUpRight size={13} /> Products
            </Link>
            <Link to="/about">
              <ArrowUpRight size={13} /> About Us
            </Link>
            <Link to="/projects">
              <ArrowUpRight size={13} /> Our Projects
            </Link>
            <Link to="/contact">
              <ArrowUpRight size={13} /> Contact Us
            </Link>
            <Link to="/my-orders">
              <ArrowUpRight size={13} /> Track Order / My Orders
            </Link>
          </nav>
        </div>

        {/* Column 3: Policies & Legal */}
        <div className="footer-col footer-policies-col">
          <h4>Policies & Legal</h4>
          <nav className="footer-nav-list">
            <Link to="/privacy-policy">
              <ArrowUpRight size={13} /> Privacy Policy
            </Link>
            <Link to="/refund-policy">
              <ArrowUpRight size={13} /> Refund Policy
            </Link>
            <Link to="/return-policy">
              <ArrowUpRight size={13} /> Return & Replacement
            </Link>
            <Link to="/cancellation-policy">
              <ArrowUpRight size={13} /> Cancellation Policy
            </Link>
            <Link to="/shipping-policy">
              <ArrowUpRight size={13} /> Shipping & Delivery
            </Link>
            <Link to="/terms">
              <ArrowUpRight size={13} /> Terms & Conditions
            </Link>
            <Link to="/disclaimer">
              <ArrowUpRight size={13} /> Disclaimer
            </Link>
          </nav>
        </div>

        {/* Column 4: Get in Touch (Side-by-Side with Policies & Legal) */}
        <div className="footer-col footer-contact-col">
          <h4>Get in Touch</h4>
          <div className="footer-contact-details">
            <div className="contact-item">
              <MapPin size={17} className="contact-icon" />
              <span>
                <strong>Vishwakarma Engineer Work Shop</strong>
                <br />
                Lucknow, Uttar Pradesh – 226010, India
              </span>
            </div>

            <div className="contact-item">
              <Phone size={17} className="contact-icon" />
              <a href="tel:+919876543210">+91 98765 43210</a>
            </div>

            <div className="contact-item">
              <Mail size={17} className="contact-icon" />
              <a href="mailto:info@vishwakarmaworkshop.in">info@vishwakarmaworkshop.in</a>
            </div>

            <div className="contact-item">
              <Clock size={17} className="contact-icon" />
              <span>Mon – Sat: 9:00 AM – 7:30 PM (Sunday Closed)</span>
            </div>

            <a
              href="https://wa.me/919876543210?text=Hello%20Vishwakarma%20Workshop,%20I%20need%20a%20quote%20for%20custom%20fabrication."
              target="_blank"
              rel="noreferrer"
              className="footer-wa-action"
            >
              <MessageCircle size={15} />
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Copyright & Guarantee Bar */}
      <div className="container footer-bottom-bar">
        <div className="footer-copyright">
          <span>© {currentYear} Vishwakarma Engineer Workshop. All rights reserved.</span>
          <span className="copyright-bullet">•</span>
          <span className="footer-sub-note">Precision Engineering & Structural Metal Crafters</span>
        </div>

        <div className="footer-trust-badge">
          <ShieldCheck size={14} />
          <span>Razorpay Verified · 100% Quality Assured</span>
        </div>
      </div>
    </footer>
  );
}
