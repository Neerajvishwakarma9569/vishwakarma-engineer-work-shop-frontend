import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, Ruler, Award, Hammer } from "lucide-react";
import api from "../services/api";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";
import { useLanguage } from "../context/LanguageContext";
import "./Css/Home.css";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const { t, lang } = useLanguage();

  
  useEffect(() => {
    api
      .get("/products?featured=true")
      .then(({ data }) => {
        const list = Array.isArray(data) ? data : (data?.products || []);
        setProducts(list.slice(0, 3));
      })
      .catch(() => setProducts([]))
      .finally(() => setLoadingProducts(false));
  }, []);

  const categories = [
    {
      name: "Iron Gates",
      nameHi: "आयरन गेट्स",
      image: "/Images/content.png",
    },
    {
      name: "Steel Railings",
      nameHi: "स्टील रेलिंग्स",
      image: "/Images/col3.png",
    },
    {
      name: "Windows & Grills",
      nameHi: "विंडोज़ और ग्रिल्स",
      image: "/Images/b8.jpg",
    },
    {
      name: "Aluminium",
      nameHi: "एल्युमिनियम",
      image: "/Images/f4.jpg",
    },
    {
      name: "Custom Fabrication",
      nameHi: "कस्टम फैब्रिकेशन",
      image: "/Images/f6.jpg",
    },
  ];
  return (
    <main className="home-page">
      <section className="hero">
        <div className="hero-pattern"></div>
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="eyebrow gold">CRAFT • ENGINEERING • TRUST</span>
            <h1>
              Metalwork made
              <br />
              <em>to make a mark.</em>
            </h1>
            <p>
              Custom gates, railings, grills and fabrication — thoughtfully
              engineered and expertly crafted for your space.
            </p>
            <div className="hero-actions">
              <Link className="btn btn-gold" to="/products">
                Explore products <ArrowRight size={18} />
              </Link>
              <Link className="btn btn-outline" to="/contact">
                Request a quote
              </Link>
            </div>
            <div className="hero-note">
              <span></span> Made for your space. Built for years.
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-image"></div>
            <div className="hero-stamp">
              <strong>VEW</strong>
              <small>
                ENGINEERED
                <br />
                WITH CARE
              </small>
            </div>
            <div className="visual-caption">
              CUSTOM METAL FABRICATION <b>01 / 05</b>
            </div>
          </div>
        </div>
      </section>
      <section className="trust-strip">
        <div className="trust-strip-bg" />
        <div className="trust-strip-overlay" />
        <div className="container trust-grid">
          <div className="trust-card">
            <div className="trust-icon-box">
              <ShieldCheck size={22} />
            </div>
            <div className="trust-card-text">
              <b>{t("Quality first", "विश्वसनीय गुणवत्ता")}</b>
              <small>{t("Reliable materials", "उच्च श्रेणी सामग्री")}</small>
            </div>
          </div>
          <div className="trust-card">
            <div className="trust-icon-box">
              <Ruler size={22} />
            </div>
            <div className="trust-card-text">
              <b>{t("Made to measure", "सटीक नाप व आकार")}</b>
              <small>{t("Custom dimensions", "मनपसंद डाइमेंशन")}</small>
            </div>
          </div>
          <div className="trust-card">
            <div className="trust-icon-box">
              <Award size={22} />
            </div>
            <div className="trust-card-text">
              <b>{t("Skilled craft", "अनुभवी कारीगरी")}</b>
              <small>{t("Detail-driven work", "बारीकी से फिनिशिंग")}</small>
            </div>
          </div>
          <div className="trust-card">
            <div className="trust-icon-box">
              <Hammer size={22} />
            </div>
            <div className="trust-card-text">
              <b>{t("Built to last", "मजबूत और टिकाऊ")}</b>
              <small>{t("Strong finishing", "लंबे समय तक चलने वाला")}</small>
            </div>
          </div>
        </div>
      </section>
      <section className="section container">
        <div className="section-heading">
          <div>
            <span className="eyebrow">WHAT WE CREATE</span>
            <h2>Solutions for every space.</h2>
          </div>
          <Link className="text-link" to="/products">
            View all products <ArrowRight size={16} />
          </Link>
        </div>
        <div className="category-grid">
          {categories.map((c, i) => (
            <Link
              to={`/products?category=${encodeURIComponent(c.name)}`}
              className="category-tile"
              key={c.name}
            >
              <div
                className="category-tile-bg"
                style={{ backgroundImage: `url(${c.image})` }}
              />
              <div className="category-tile-overlay" />
              <div className="category-tile-content">
                <span>0{i + 1}</span>
                <h3>{lang === "hi" ? c.nameHi : c.name}</h3>
              </div>
              <ArrowRight className="category-tile-arrow" size={18} />
            </Link>
          ))}
        </div>
      </section>
      <section className="section section-muted">
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="eyebrow">SELECTED WORK</span>
              <h2>Featured creations.</h2>
            </div>
            <Link className="text-link" to="/products">
              Browse collection <ArrowRight size={16} />
            </Link>
          </div>
          {loadingProducts ? (
            <Loader label="Loading featured products..." />
          ) : products.length ? (
            <div className="product-grid">
              {products.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <Hammer size={30} />
              <h3>Your next project starts here.</h3>
              <p>
                Our featured products will appear here when the admin adds them.
              </p>
              <Link className="btn btn-dark" to="/contact">
                Discuss your project
              </Link>
            </div>
          )}
        </div>
      </section>
      <section className="cta-band container">
        <div
          className="cta-band-bg"
          style={{ backgroundImage: "url('/Images/f7.jpg')" }}
        />
        <div className="cta-band-overlay" />
        <div className="cta-band-content">
          <span className="eyebrow gold">
            {t("HAVE A DESIGN IN MIND?", "क्या आपके मन में कोई डिज़ाइन है?")}
          </span>
          <h2>
            {t("Let's build something", "आइए कुछ खास बनाएं")}
            <br />
            <em>{t("made just for you.", "सिर्फ आपके लिए।")}</em>
          </h2>
          <p className="cta-band-subtext">
            {t(
              "Custom gates, railings, grills, and structural metal fabrication — crafted with precision and built to last.",
              "कस्टम गेट्स, रेलिंग्स, ग्रिल्स और मेटल फैब्रिकेशन — पूरी सटीकता और मजबूती के साथ निर्मित।"
            )}
          </p>
        </div>
        <div className="cta-band-actions">
          <Link className="btn btn-gold cta-action-btn" to="/contact">
            {t("Start a conversation", "हमसे संपर्क करें")}{" "}
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </main>
  );
}
