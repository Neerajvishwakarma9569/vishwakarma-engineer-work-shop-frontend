import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  ClipboardList,
  Menu,
  ShoppingBag,
  UserRound,
  X,
  Globe,
  Home,
  Wrench,
  Info,
  Briefcase,
  Phone,
  LogOut,
  LogIn,
  Search,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import NavSearchOverlay from "./NavSearchOverlay";
import './Css/Navbar.css';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { count } = useCart();
  const { user, logout } = useAuth();
  const { lang, toggleLang, t } = useLanguage();

  // Keyboard shortcut Ctrl+K / Cmd+K to toggle search
  useEffect(() => {
    const handleShortcut = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    const closeOnDesktop = () => {
      if (window.innerWidth > 1040) setOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    window.addEventListener("resize", closeOnDesktop);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
      window.removeEventListener("resize", closeOnDesktop);
    };
  }, [open]);

  const links = user?.role === "worker" ? [] : [
    { label: t("Home", "होम"), path: "/", icon: Home },
    { label: t("Products", "उत्पाद"), path: "/products", icon: Wrench },
    { label: t("About", "हमारे बारे में"), path: "/about", icon: Info },
    { label: t("Projects", "प्रोजेक्ट्स"), path: "/projects", icon: Briefcase },
    { label: t("Contact", "संपर्क"), path: "/contact", icon: Phone },
  ];

  return (
    <header className="navbar">
      <div className="container nav-inner">
        <Link to="/" className="brand" onClick={() => setOpen(false)}>
          <img src="/Images/vishlogo.png" alt="Vishwakarma Engineer Workshop" />
        </Link>

        {/* Mobile Quick Action Strip (Search, Cart, Language, Hamburger) */}
        <div className="nav-mobile-actions">
          {user?.role !== "worker" && (
            <button
              className="mobile-action-btn mobile-search-btn"
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search products"
              title={t("Search products", "उत्पाद खोजें")}
            >
              <Search size={19} />
            </button>
          )}

          {user?.role !== "worker" && (
            <Link
              className="mobile-action-btn mobile-cart-btn"
              to="/cart"
              aria-label="Shopping Cart"
              onClick={() => setOpen(false)}
            >
              <ShoppingBag size={20} />
              {count > 0 && <span className="mobile-cart-badge">{count}</span>}
            </Link>
          )}

          <button
            className="mobile-action-btn mobile-lang-btn"
            type="button"
            onClick={toggleLang}
            aria-label="Toggle language"
            title={lang === "en" ? "हिंदी में देखें" : "Switch to English"}
          >
            <Globe size={18} />
            <span className="lang-code-tag">{lang === "en" ? "HI" : "EN"}</span>
          </button>

          <button
            className="icon-btn menu-toggle"
            type="button"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-controls="primary-navigation"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {open && (
          <button
            className="nav-backdrop"
            type="button"
            aria-label="Close navigation menu"
            onClick={() => setOpen(false)}
          />
        )}

        <nav
          id="primary-navigation"
          className={open ? "nav-links show" : "nav-links"}
        >
          {/* Mobile Drawer Top Banner */}
          <div className="mobile-drawer-header">
            {user ? (
              <div className="mobile-user-card">
                <div className="mobile-avatar">
                  <UserRound size={20} />
                </div>
                <div className="mobile-user-info">
                  <span className="mobile-user-name">{user.name || "User"}</span>
                  <span className="mobile-user-role">
                    {user.role === "worker"
                      ? t("Workshop Worker", "वर्कशॉप स्टाफ")
                      : t("Customer Account", "ग्राहक खाता")}
                  </span>
                </div>
              </div>
            ) : (
              <div className="mobile-guest-card">
                <span className="mobile-welcome-text">
                  {t("Welcome to Workshop", "विश्वकर्मा वर्कशॉप")}
                </span>
                <Link
                  to="/login"
                  className="mobile-quick-login-link"
                  onClick={() => setOpen(false)}
                >
                  <LogIn size={14} /> {t("Login / Sign In", "लॉगिन करें")}
                </Link>
              </div>
            )}
          </div>

          <div className="nav-links-list">
            {links.map(({ label, path, icon: IconComponent }) => (
              <NavLink key={path} to={path} onClick={() => setOpen(false)}>
                <IconComponent size={16} className="nav-item-icon" />
                <span>{label}</span>
              </NavLink>
            ))}

            {user?.role === "worker" && (
              <NavLink to="/worker-dashboard" onClick={() => setOpen(false)}>
                <UserRound size={16} className="nav-item-icon" />
                <span>{t("Worker Dashboard", "वर्कर डैशबोर्ड")}</span>
              </NavLink>
            )}

            {user && user.role !== "worker" && (
              <NavLink to="/profile" onClick={() => setOpen(false)}>
                <UserRound size={16} className="nav-item-icon" />
                <span>{t("Profile", "प्रोफाइल")}</span>
              </NavLink>
            )}

            {user && user.role !== "worker" && (
              <NavLink to="/my-orders" onClick={() => setOpen(false)}>
                <ClipboardList size={16} className="nav-item-icon" />
                <span>{t("My Orders", "मेरे ऑर्डर्स")}</span>
              </NavLink>
            )}

            {user?.role !== "worker" && (
              <button
                type="button"
                className="nav-drawer-search-btn"
                onClick={() => {
                  setOpen(false);
                  setSearchOpen(true);
                }}
              >
                <Search size={16} className="nav-item-icon" />
                <span>{t("Search Products", "उत्पाद खोजें")}</span>
              </button>
            )}

            {user?.role !== "worker" && (
              <button
                type="button"
                className="nav-search-btn"
                onClick={() => setSearchOpen(true)}
                aria-label="Search products"
                title={t("Search products (Ctrl+K)", "उत्पाद खोजें (Ctrl+K)")}
              >
                <Search size={15} className="nav-search-btn-icon" />
                <span className="nav-search-btn-text">{t("Search", "खोजें")}</span>
                <kbd className="nav-search-kbd">Ctrl K</kbd>
              </button>
            )}

            {user?.role !== "worker" && (
              <Link className="cart-link" to="/cart" onClick={() => setOpen(false)}>
                <ShoppingBag size={18} className="nav-item-icon" />
                <span>{t("Cart", "कार्ट")}</span> <b>{count}</b>
              </Link>
            )}
          </div>

          {/* Bottom Actions inside Drawer */}
          <div className="nav-drawer-footer">
            <button
              className="nav-lang-btn"
              type="button"
              onClick={toggleLang}
              title={lang === "en" ? "हिंदी में देखें" : "Switch to English"}
            >
              <Globe size={15} />
              <span>{lang === "en" ? "हिंदी" : "English"}</span>
            </button>

            {user ? (
              <button
                className="nav-auth logout"
                type="button"
                onClick={() => {
                  logout();
                  setOpen(false);
                }}
              >
                <LogOut size={15} />
                <span>{t("Logout", "लॉगआउट")}</span>
              </button>
            ) : (
              <Link
                className="nav-auth"
                to="/login"
                onClick={() => setOpen(false)}
              >
                <LogIn size={15} />
                <span>{t("Login", "लॉगिन")}</span>
              </Link>
            )}
          </div>
        </nav>
      </div>

      {/* Product Search Overlay */}
      <NavSearchOverlay
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
      />
    </header>
  );
}
