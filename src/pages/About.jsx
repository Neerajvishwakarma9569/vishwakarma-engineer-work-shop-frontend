import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Phone,
  Mail,
  ShieldCheck,
  Award,
  Wrench,
  CheckCircle,
  Clock,
  Sparkles,
  UserCheck,
  UserRound,
  ArrowRight,
  Flame,
  Layers,
} from "lucide-react";
import api from "../services/api";
import Loader from "../components/Loader";
import { useLanguage } from "../context/LanguageContext";
import "./css/about.css";

export default function About() {
  const [teamData, setTeamData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { t, lang } = useLanguage();

  useEffect(() => {
    let isMounted = true;
    api
      .get("/workers/team")
      .then(({ data }) => {
        if (isMounted) {
          setTeamData(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Could not load team data:", err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const owner = teamData?.owner || {
    name: "Er. Ram Vishwakarma",
    jobTitle: "Founder & Master Engineer",
    email: "vishwakarma.workshop@gmail.com",
    phone: "+91 98765 43210",
    profileImageUrl: "/Images/vishlogo.png",
    experience: "20+ Years in Architectural Metal Fabrication & Engineering",
    quote:
      "Every gate, railing, and structure we forge carries our commitment to lifelong durability, flawless safety, and precision craftsmanship.",
  };

  const workers = teamData?.workers || [];

  return (
    <main className="about-page">
      {/* 1. HERO SECTION WITH content.png BACKGROUND */}
      <section className="about-hero">
        <div
          className="about-hero-bg"
          style={{ backgroundImage: "url('/Images/content.png')" }}
        />
        <div className="about-hero-overlay" />
        <div className="container about-hero-content">
          <span className="eyebrow gold">
            {t("ABOUT VISHWAKARMA ENGINEER WORKSHOP", "विश्वकर्मा इंजीनियर वर्कशॉप के बारे में")}
          </span>
          <h1>
            {t(
              "Practical Engineering. Thoughtful Craftsmanship.",
              "सटीक इंजीनियरिंग। बेमिसाल शिल्प कौशल।"
            )}
          </h1>
          <p className="about-hero-subtitle">
            {t(
              "Vishwakarma Engineer Workshop creates bespoke metalwork solutions with an uncompromising focus on fit, finish, and structural strength.",
              "विश्वकर्मा इंजीनियर वर्कशॉप मजबूत, सुंदर और सटीक धातु निर्माण (Metalwork) का भरोसेमंद केंद्र है।"
            )}
          </p>

          <div className="about-hero-badges">
            <div className="about-hero-badge">
              <ShieldCheck size={18} />
              <span>{t("ISO Standard Materials", "प्रमाणित गुणवत्ता सामग्री")}</span>
            </div>
            <div className="about-hero-badge">
              <Award size={18} />
              <span>{t("Master Craftsmen Team", "अनुभवी कारीगरों की टीम")}</span>
            </div>
            <div className="about-hero-badge">
              <Clock size={18} />
              <span>{t("20+ Years Legacy", "20+ वर्षों का अनुभव")}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. OUR HERITAGE & WORKSHOP PHILOSOPHY */}
      <section className="container section about-story-section">
        <div className="about-story-grid">
          <div className="about-story-card">
            <span className="eyebrow gold">
              {t("OUR CRAFT & PASSION", "हमारा कार्य और समर्पण")}
            </span>
            <h2>
              {t(
                "Made around your exact architectural requirements.",
                "आपकी आवश्यकताओं और वास्तु डिज़ाइन के अनुरूप निर्माण।"
              )}
            </h2>
            <p>
              {t(
                "From heavy ornamental iron gates and structural stainless steel railings to precision window grills, industrial rolling shutters, and customized metal sheds, every project begins with understanding your space, purpose, and design vision.",
                "मजबूत लोहे के मुख्य गेट, स्टेनलेस स्टील बालकनी व सीढ़ी रेलिंग्स, सुरक्षा ग्रिल्स, रोलिंग शटर और शेड निर्माण तक — हम आपके स्थान और पसंद को समझकर बेहतरीन धातु उत्पाद बनाते हैं।"
              )}
            </p>
            <p>
              {t(
                "We believe genuine fabrication is far more than welding metal together — it requires meticulous measurement, high-grade alloy selection, and a smooth, weather-resistant finish that stands gracefully for generations.",
                "हमारा मानना है कि सच्चा फैब्रिकेशन सिर्फ लोहे को जोड़ना नहीं है, बल्कि मिलीमीटर स्तर की नाप, बेहतरीन वेल्डिंग फिनिश और जंगरोधी सुरक्षा देना है।"
              )}
            </p>

            <div className="about-features-list">
              <div className="about-feature-item">
                <CheckCircle size={18} className="feature-icon-gold" />
                <span>
                  {t(
                    "High-strength Jindal Stainless & Tata Steel grades",
                    "टाटा व जिंदल उच्च-श्रेणी स्टील का उपयोग"
                  )}
                </span>
              </div>
              <div className="about-feature-item">
                <CheckCircle size={18} className="feature-icon-gold" />
                <span>
                  {t(
                    "Anti-rust epoxy primer & polyurethane coatings",
                    "एंटी-रस्ट प्राइमर और प्रीमियम पॉलिश कोटिंग"
                  )}
                </span>
              </div>
              <div className="about-feature-item">
                <CheckCircle size={18} className="feature-icon-gold" />
                <span>
                  {t(
                    "CNC laser cut intricate artistic patterns",
                    "सीएनसी लेजर कटिंग द्वारा खूबसूरत नक्काशीदार डिज़ाइन"
                  )}
                </span>
              </div>
            </div>
          </div>

          <div className="about-story-visual">
            <div className="story-image-wrap">
              <img
                src="/Images/clo1.png"
                alt="Workshop Architectural Installation"
                className="story-image"
              />
              <div className="story-stamp">
                <Sparkles size={20} />
                <div>
                  <strong>100%</strong>
                  <small>{t("Custom Built", "कस्टम निर्मित")}</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FOUNDER & LEADERSHIP SECTION */}
      <section className="about-founder-section">
        <div className="container">
          <div className="section-heading text-center">
            <span className="eyebrow gold">
              {t("WORKSHOP LEADERSHIP", "नेतृत्व एवं संस्थापक")}
            </span>
            <h2>{t("Meet Our Founder & Master Engineer", "हमारे संस्थापक से मिलें")}</h2>
            <p>
              {t(
                "Guiding every weld, design blueprint, and quality inspection with decades of hands-on expertise.",
                "दशकों के अनुभव और इंजीनियरिंग ज्ञान के साथ हर प्रोजेक्ट का मार्गदर्शन।"
              )}
            </p>
          </div>

          <div className="founder-card">
            <div className="founder-avatar-wrap">
              {owner.profileImageUrl ? (
                <img
                  src={owner.profileImageUrl}
                  alt={owner.name}
                  className="founder-photo"
                  onError={(e) => {
                    e.currentTarget.src = "/Images/vishlogo.png";
                  }}
                />
              ) : (
                <div className="founder-placeholder-avatar">
                  <UserCheck size={64} />
                </div>
              )}
              <span className="founder-badge-tag">
                <Award size={14} /> {t("Founder & Owner", "संस्थापक एवं स्वामी")}
              </span>
            </div>

            <div className="founder-details">
              <div className="founder-header">
                <div>
                  <h3>{owner.name}</h3>
                  <span className="founder-role-title">
                    <Wrench size={15} /> {owner.jobTitle}
                  </span>
                </div>
                {owner.experience && (
                  <span className="founder-experience-pill">
                    {owner.experience}
                  </span>
                )}
              </div>

              <blockquote className="founder-quote">
                "{owner.quote}"
              </blockquote>

              <div className="founder-contact-row">
                {owner.phone && (
                  <a href={`tel:${owner.phone}`} className="founder-contact-btn phone">
                    <Phone size={16} />
                    <span>{owner.phone}</span>
                  </a>
                )}
                {owner.email && (
                  <a href={`mailto:${owner.email}`} className="founder-contact-btn email">
                    <Mail size={16} />
                    <span>{owner.email}</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. WORKSHOP STAFF & CRAFTSMEN DIRECTORY */}
      <section className="container section about-team-section">
        <div className="section-heading text-center">
          <span className="eyebrow gold">
            {t("SKILLED CRAFTSMEN & STAFF", "हमारे कुशल कारीगर एवं स्टाफ")}
          </span>
          <h2>
            {t(
              "The Craftsmen Who Forge Your Vision",
              "कुशल हाथ जो आपके सपनों को आकार देते हैं"
            )}
          </h2>
          <p>
            {t(
              "Our workshop employs highly experienced welders, steel fitters, CNC operators, and finishers committed to precision.",
              "हमारी वर्कशॉप में उच्च प्रशिक्षित वेल्डर, स्टील फिटर, और फैब्रिकेशन स्पेशलिस्ट समर्पित भाव से काम करते हैं।"
            )}
          </p>
        </div>

        {loading ? (
          <Loader label={t("Loading workshop team...", "स्टाफ जानकारी लोड हो रही है...")} />
        ) : workers.length > 0 ? (
          <div className="team-grid">
            {workers.map((member) => (
              <article key={member._id} className="team-card">
                <div className="team-avatar-box">
                  {member.profileImageUrl ? (
                    <img
                      src={member.profileImageUrl}
                      alt={member.name}
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                        e.currentTarget.parentElement.classList.add("avatar-fallback");
                      }}
                    />
                  ) : (
                    <div className="team-avatar-initials">
                      <UserRound size={36} />
                    </div>
                  )}
                  <span className="team-craft-badge">
                    <Flame size={12} /> {t("Verified Staff", "वर्कशॉप स्टाफ")}
                  </span>
                </div>

                <div className="team-card-info">
                  <h3 className="team-name">{member.name}</h3>
                  <span className="team-job-title">{member.jobTitle}</span>

                  <div className="team-contact-list">
                    {member.phone && (
                      <a href={`tel:${member.phone}`} className="team-contact-link">
                        <Phone size={13} />
                        <span>{member.phone}</span>
                      </a>
                    )}
                    {member.email && (
                      <a href={`mailto:${member.email}`} className="team-contact-link">
                        <Mail size={13} />
                        <span>{member.email}</span>
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="team-empty-card">
            <Layers size={40} className="empty-icon-gold" />
            <h3>{t("Master Craftsmen at Work", "कुशल कारीगर कार्यशाला में कार्यरत")}</h3>
            <p>
              {t(
                "Our dedicated fabrication specialists and technicians are ready to execute your custom projects. Connect with our founder or visit the workshop.",
                "हमारे समर्पित तकनीशियन आपके प्रोजेक्ट्स के लिए तत्पर हैं। अधिक जानकारी के लिए हमसे संपर्क करें।"
              )}
            </p>
            <Link to="/contact" className="btn btn-gold btn-sm">
              {t("Contact Workshop", "वर्कशॉप से संपर्क करें")}
            </Link>
          </div>
        )}
      </section>

      {/* 5. CALL TO ACTION BAND */}
      <section className="about-cta-container container">
        <div className="about-cta-card">
          <div
            className="about-cta-bg"
            style={{ backgroundImage: "url('/Images/f6.jpg')" }}
          />
          <div className="about-cta-overlay" />
          <div className="about-cta-content">
            <span className="eyebrow gold">
              {t("START YOUR CUSTOM PROJECT", "अपना प्रोजेक्ट शुरू करें")}
            </span>
            <h2>
              {t(
                "Looking for a custom metal gate, railing, or structure?",
                "क्या आपको कस्टम मेटल गेट, रेलिंग या शेड बनवाना है?"
              )}
            </h2>
            <p>
              {t(
                "Visit our workshop in person, discuss measurements, or request an instant quotation for your residence or commercial facility.",
                "हमारी वर्कशॉप पर आएं, सही नाप की चर्चा करें, या अपने घर व दुकान के लिए निःशुल्क कोटेशन प्राप्त करें।"
              )}
            </p>
          </div>
          <div className="about-cta-actions">
            <Link to="/contact" className="btn btn-gold cta-btn">
              {t("Request a Consultation", "सलाह प्राप्त करें")}{" "}
              <ArrowRight size={18} />
            </Link>
            <Link to="/products" className="btn btn-outline cta-btn">
              {t("Explore Catalog", "उत्पाद देखें")}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
