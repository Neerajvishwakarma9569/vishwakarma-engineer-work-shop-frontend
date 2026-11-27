import React, { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, SearchX, X, Tag, RefreshCw } from "lucide-react";
import api from "../services/api";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";
import { useLanguage } from "../context/LanguageContext";
import "./css/products.css";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [params, setParams] = useSearchParams();
  const { t } = useLanguage();

  const urlSearch = params.get("search") || params.get("q") || "";
  const category = params.get("category") || "";

  const [search, setSearch] = useState(urlSearch);

  // Sync state when URL search param changes
  useEffect(() => {
    setSearch(urlSearch);
  }, [urlSearch]);

  // Fetch products
  useEffect(() => {
    setLoading(true);
    const controller = new AbortController();

    api
      .get("/products", {
        params: {
          category: category || undefined,
          search: search.trim() || undefined,
        },
        signal: controller.signal,
      })
      .then(({ data }) => setProducts(Array.isArray(data) ? data : []))
      .catch((err) => {
        if (err.name !== "CanceledError" && err.name !== "AbortError") {
          setProducts([]);
        }
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [category, search]);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearch(val);
    const nextParams = new URLSearchParams(params);
    if (val.trim()) {
      nextParams.set("search", val);
    } else {
      nextParams.delete("search");
      nextParams.delete("q");
    }
    setParams(nextParams, { replace: true });
  };

  const handleClearSearch = () => {
    setSearch("");
    const nextParams = new URLSearchParams(params);
    nextParams.delete("search");
    nextParams.delete("q");
    setParams(nextParams, { replace: true });
  };

  const handleClearCategory = () => {
    const nextParams = new URLSearchParams(params);
    nextParams.delete("category");
    setParams(nextParams, { replace: true });
  };

  const handleResetFilters = () => {
    setSearch("");
    setParams({});
  };

  return (
    <main className="products-page container section">
      <div className="page-heading">
        <span className="eyebrow">{t("THE COLLECTION", "कलेक्शन")}</span>
        <h1>{t("Products & craftsmanship.", "उत्पाद और शिल्प कौशल।")}</h1>
        <p>
          {t(
            "Explore our range or contact us for a custom-made design.",
            "हमारी उत्पाद श्रृंखला देखें या कस्टम डिजाइन के लिए हमसे संपर्क करें।"
          )}
        </p>
      </div>

      <div className="catalog-toolbar">
        <span className="catalog-counter">
          {products.length}{" "}
          {t(
            products.length === 1 ? "product" : "products",
            products.length === 1 ? "उत्पाद" : "उत्पाद"
          )}
        </span>

        <div className="catalog-search-wrapper">
          <Search size={18} className="catalog-search-icon" />
          <input
            type="search"
            value={search}
            onChange={handleSearchChange}
            placeholder={t(
              "Search products, gates, railings...",
              "उत्पाद, गेट, रेलिंग खोजें..."
            )}
            className="catalog-search-input"
          />
          {search && (
            <button
              type="button"
              className="catalog-search-clear"
              onClick={handleClearSearch}
              aria-label="Clear search"
            >
              <X size={15} />
            </button>
          )}
        </div>
      </div>

      {/* Active Filter Tags */}
      {(search.trim() || category) && (
        <div className="active-filters-bar">
          <span className="active-filters-label">
            {t("Active Filters:", "सक्रिय फिल्टर:")}
          </span>
          {category && (
            <span className="active-filter-chip">
              <Tag size={12} />
              <span>{category}</span>
              <button
                type="button"
                onClick={handleClearCategory}
                aria-label="Remove category filter"
              >
                <X size={12} />
              </button>
            </span>
          )}
          {search.trim() && (
            <span className="active-filter-chip">
              <Search size={12} />
              <span>"{search.trim()}"</span>
              <button
                type="button"
                onClick={handleClearSearch}
                aria-label="Remove search filter"
              >
                <X size={12} />
              </button>
            </span>
          )}
          <button
            type="button"
            className="clear-all-filters-btn"
            onClick={handleResetFilters}
          >
            {t("Clear All", "सभी हटाएं")}
          </button>
        </div>
      )}

      {loading ? (
        <Loader label={t("Loading products...", "उत्पाद लोड हो रहे हैं...")} />
      ) : products.length > 0 ? (
        <div className="product-grid">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      ) : (
        <div className="empty-state product-not-found-state">
          <div className="product-not-found-icon">
            <SearchX size={56} />
          </div>
          <h3>{t("Product Not Found", "कोई उत्पाद नहीं मिला")}</h3>
          <p>
            {search.trim()
              ? t(
                  `No products found matching "${search.trim()}". Please check your spelling or try searching for another product name or category.`,
                  `"${search.trim()}" से संबंधित कोई उत्पाद नहीं मिला। कृपया वर्तनी जांचें या किसी अन्य उत्पाद का नाम या श्रेणी खोजें।`
                )
              : category
              ? t(
                  `No products found in category "${category}".`,
                  `श्रेणी "${category}" में कोई उत्पाद उपलब्ध नहीं है।`
                )
              : t(
                  "No products available right now. Please check back later.",
                  "वर्तमान में कोई उत्पाद उपलब्ध नहीं है। कृपया बाद में देखें।"
                )}
          </p>

          <div className="not-found-buttons">
            {(search || category) && (
              <button
                type="button"
                className="btn btn-outline"
                onClick={handleResetFilters}
              >
                <RefreshCw size={15} />
                <span>
                  {t("Show All Products", "सभी उत्पाद दिखाएं")}
                </span>
              </button>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
