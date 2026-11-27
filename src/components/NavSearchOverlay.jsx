import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  X,
  SearchX,
  ArrowRight,
  Loader2,
  Wrench,
  Tag,
  Sparkles,
} from "lucide-react";
import api from "../services/api";
import { useLanguage } from "../context/LanguageContext";
import "./Css/NavSearchOverlay.css";

const POPULAR_SUGGESTIONS = [
  { label: "Main Gate", hi: "मेन गेट" },
  { label: "Balcony Railing", hi: "बालकनी रेलिंग" },
  { label: "Window Grill", hi: "खिड़की ग्रिल" },
  { label: "Rolling Shutter", hi: "रोलिंग शटर" },
  { label: "Iron Staircase", hi: "लोहे की सीढ़ी" },
  { label: "Shed Fabrication", hi: "शेड निर्माण" },
];

export default function NavSearchOverlay({ isOpen, onClose }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const { t, lang } = useLanguage();

  // Focus input when opened and lock body scroll
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 80);
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    } else {
      setQuery("");
      setResults([]);
      setHasSearched(false);
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Live search debounced
  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setResults([]);
      setLoading(false);
      setHasSearched(false);
      return;
    }

    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const { data } = await api.get("/products", {
          params: { search: trimmed },
        });
        setResults(Array.isArray(data) ? data : []);
        setHasSearched(true);
      } catch (err) {
        console.error("Search error:", err);
        setResults([]);
        setHasSearched(true);
      } finally {
        setLoading(false);
      }
    }, 240);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const handleSelectProduct = (productId) => {
    onClose();
    navigate(`/products/${productId}`);
  };

  const handleViewAll = (e) => {
    if (e) e.preventDefault();
    const trimmed = query.trim();
    onClose();
    if (trimmed) {
      navigate(`/products?search=${encodeURIComponent(trimmed)}`);
    } else {
      navigate("/products");
    }
  };

  const handleSuggestionClick = (keyword) => {
    setQuery(keyword);
    inputRef.current?.focus();
  };

  const handleClear = () => {
    setQuery("");
    setResults([]);
    setHasSearched(false);
    inputRef.current?.focus();
  };

  return (
    <div
      className="nav-search-overlay-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Product Search"
    >
      <div className="nav-search-modal">
        {/* Header Search Input */}
        <form className="nav-search-header" onSubmit={handleViewAll}>
          <Search size={22} className="nav-search-input-icon" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t(
              "Search products, gates, railings, materials...",
              "उत्पाद, गेट, रेलिंग, सामग्री खोजें..."
            )}
            className="nav-search-input"
            autoComplete="off"
            spellCheck="false"
          />

          {loading ? (
            <Loader2 size={19} className="nav-search-spinner" />
          ) : query ? (
            <button
              type="button"
              className="nav-search-clear-btn"
              onClick={handleClear}
              aria-label="Clear search"
              title="Clear"
            >
              <X size={17} />
            </button>
          ) : null}

          <button
            type="button"
            className="nav-search-close-btn"
            onClick={onClose}
            aria-label="Close search"
            title="Close (Esc)"
          >
            <X size={20} />
          </button>
        </form>

        {/* Content Body */}
        <div className="nav-search-body">
          {/* 1. When query is empty: Popular Suggestions */}
          {!query.trim() && (
            <div className="nav-search-suggestions">
              <div className="nav-search-section-title">
                <Sparkles size={15} />
                <span>{t("Popular Searches", "लोकप्रिय खोजें")}</span>
              </div>
              <div className="nav-search-chips">
                {POPULAR_SUGGESTIONS.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    className="nav-search-chip"
                    onClick={() => handleSuggestionClick(item.label)}
                  >
                    <Tag size={12} />
                    <span>{lang === "hi" ? item.hi : item.label}</span>
                  </button>
                ))}
              </div>
              <div className="nav-search-hint">
                <span>
                  {t(
                    "Tip: Search by product name, category, or materials used (iron, stainless steel, mild steel).",
                    "सुझाव: उत्पाद का नाम, श्रेणी, या उपयोग की गई सामग्री (लोहा, स्टील) से खोजें।"
                  )}
                </span>
              </div>
            </div>
          )}

          {/* 2. Loading State */}
          {loading && !results.length && (
            <div className="nav-search-loading-box">
              <Loader2 size={28} className="nav-search-spinner" />
              <p>{t("Searching catalog...", "कैटलॉग खोजा जा रहा है...")}</p>
            </div>
          )}

          {/* 3. When search was performed and NO products found */}
          {!loading && hasSearched && results.length === 0 && query.trim() && (
            <div className="nav-search-not-found">
              <div className="not-found-icon-wrap">
                <SearchX size={44} />
              </div>
              <h3 className="not-found-title">
                {t("Product Not Found", "कोई उत्पाद नहीं मिला")}
              </h3>
              <p className="not-found-desc">
                {t(
                  `No matching products found for "${query.trim()}". Please check your spelling or try another keyword.`,
                  `"${query.trim()}" के लिए कोई उत्पाद नहीं मिला। कृपया वर्तनी जांचें या अन्य कीवर्ड खोजें।`
                )}
              </p>

              <div className="not-found-suggestions">
                <span className="suggestions-label">
                  {t("Try searching for:", "इनमें से खोज कर देखें:")}
                </span>
                <div className="nav-search-chips">
                  {POPULAR_SUGGESTIONS.slice(0, 4).map((item) => (
                    <button
                      key={item.label}
                      type="button"
                      className="nav-search-chip"
                      onClick={() => handleSuggestionClick(item.label)}
                    >
                      <Tag size={12} />
                      <span>{lang === "hi" ? item.hi : item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="not-found-actions">
                <button
                  type="button"
                  className="nav-search-all-btn"
                  onClick={() => {
                    onClose();
                    navigate("/products");
                  }}
                >
                  <Wrench size={15} />
                  <span>{t("Browse All Products", "सभी उत्पाद देखें")}</span>
                </button>
              </div>
            </div>
          )}

          {/* 4. Matching Results Found */}
          {results.length > 0 && (
            <div className="nav-search-results-list">
              <div className="nav-search-results-count">
                <span>
                  {t(
                    `Found ${results.length} related product${results.length > 1 ? "s" : ""}`,
                    `${results.length} संबंधित उत्पाद मिले`
                  )}
                </span>
              </div>

              <div className="nav-search-items-grid">
                {results.slice(0, 8).map((product) => {
                  const displayImg =
                    product.image ||
                    product.images?.[0] ||
                    "/Images/placeholder.jpg";
                  return (
                    <div
                      key={product._id}
                      className="nav-search-item"
                      onClick={() => handleSelectProduct(product._id)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSelectProduct(product._id);
                      }}
                    >
                      <div className="nav-search-item-img">
                        <img
                          src={displayImg}
                          alt={product.name}
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.src = "/Images/vishlogo.png";
                          }}
                        />
                      </div>
                      <div className="nav-search-item-details">
                        <div className="nav-search-item-category">
                          {product.category || "Workshop"}
                        </div>
                        <h4 className="nav-search-item-title">
                          {product.name}
                        </h4>
                        {product.description && (
                          <p className="nav-search-item-desc">
                            {product.description.slice(0, 75)}
                            {product.description.length > 75 ? "..." : ""}
                          </p>
                        )}
                        <div className="nav-search-item-bottom">
                          <span className="nav-search-item-price">
                            {product.price > 0
                              ? `₹${Number(product.price).toLocaleString("en-IN")}`
                              : t("Get a quote", "कोटेशन प्राप्त करें")}
                          </span>
                          <span className="nav-search-view-link">
                            {t("View", "देखें")} <ArrowRight size={13} />
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer Bar */}
        <div className="nav-search-footer">
          {query.trim() && results.length > 0 && (
            <button
              type="button"
              className="nav-search-view-all-link"
              onClick={handleViewAll}
            >
              <span>
                {t(
                  `View all ${results.length} results in catalog`,
                  `कैटलॉग में सभी ${results.length} परिणाम देखें`
                )}
              </span>
              <ArrowRight size={15} />
            </button>
          )}
          <div className="nav-search-shortcuts">
            <span className="shortcut-tag">
              <kbd>ESC</kbd> {t("to close", "बंद करने के लिए")}
            </span>
            <span className="shortcut-tag">
              <kbd>ENTER</kbd> {t("to search catalog", "कैटलॉग में खोजने के लिए")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
