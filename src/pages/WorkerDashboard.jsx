import React, { useEffect, useState, useCallback } from "react";
import {
  LayoutDashboard,
  CalendarDays,
  IndianRupee,
  UserRound,
  LogOut,
  Phone,
  MapPin,
  Mail,
  ShieldAlert,
  Wallet,
  CheckCircle2,
  Clock,
  Briefcase,
  AlertCircle,
  Percent,
  TrendingUp,
  RefreshCw,
  Menu,
  X,
  ChevronRight,
  Sparkles,
  Globe,
  Camera,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import api from "../services/api";
import {
  generateMonthCalendar,
  formatMonthDisplay,
  getSelectableMonths,
} from "../utils/attendanceUtils";
import { subscribeToWorkerSync } from "../utils/syncUtils";
import "./Css/WorkerDashboard.css";

const currentMonth = () => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
};

const money = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount || 0);

const formatDate = (value) => {
  if (!value) return "";
  const [year, month, day] = value.slice(0, 10).split("-").map(Number);
  const dateObj = new Date(year, month - 1, day);
  return new Intl.DateTimeFormat("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(dateObj);
};

export default function WorkerDashboard() {
  const { user, logout } = useAuth();
  const { lang, toggleLang, t } = useLanguage();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("dashboard"); // 'dashboard' | 'attendance' | 'payments' | 'profile'
  const [month, setMonth] = useState(currentMonth());
  const [worker, setWorker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [tableFilter, setTableFilter] = useState("all");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoNotice, setPhotoNotice] = useState("");

  const handleUploadProfilePhoto = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert(t("Image size must be 5MB or smaller", "इमेज का आकार 5MB या उससे कम होना चाहिए"));
      return;
    }
    const formData = new FormData();
    formData.append("profileImage", file);
    setUploadingPhoto(true);
    setPhotoNotice("");
    try {
      await api.patch("/workers/me/profile", formData);
      setPhotoNotice(t("Profile photo updated successfully!", "आपकी प्रोफाइल फोटो सफलतापूर्वक अपडेट हो गई!"));
      await fetchWorkerData(false);
    } catch (err) {
      alert(err.response?.data?.message || t("Could not update photo", "फोटो अपडेट नहीं हो सकी"));
    } finally {
      setUploadingPhoto(false);
    }
  };

  const fetchWorkerData = useCallback(
    async (showLoading = false) => {
      if (showLoading) setLoading(true);
      else setRefreshing(true);
      setError("");

      try {
        const { data } = await api.get("/workers/me", {
          params: { month, _t: Date.now() },
        });
        setWorker(data.worker);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            t("Could not load your worker profile.", "आपकी प्रोफाइल लोड नहीं हो सकी।")
        );
      } finally {
        if (showLoading) setLoading(false);
        setRefreshing(false);
      }
    },
    [month, t]
  );

  // Initial load
  useEffect(() => {
    fetchWorkerData(true);
  }, [fetchWorkerData]);

  // Real-time synchronization
  useEffect(() => {
    const unsubscribe = subscribeToWorkerSync(() => {
      fetchWorkerData(false);
    });

    const intervalId = window.setInterval(() => {
      fetchWorkerData(false);
    }, 3000);

    const onFocus = () => fetchWorkerData(false);
    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        fetchWorkerData(false);
      }
    };

    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      unsubscribe();
      window.clearInterval(intervalId);
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [fetchWorkerData]);

  const handleLogout = () => {
    if (window.confirm(t("Are you sure you want to logout?", "क्या आप लॉगआउट करना चाहते हैं?"))) {
      logout();
      navigate("/login");
    }
  };

  const summary = worker?.summary;
  const balance = summary?.balance;
  const balanceText =
    balance === null || balance === undefined
      ? t("Salary not set", "वेतन निर्धारित नहीं")
      : balance < 0
      ? `${t("Advance", "अग्रिम")} ${money(Math.abs(balance))}`
      : balance === 0
      ? t("Settled", "सब चुकता")
      : money(balance);

  // Calendar and attendance calculations
  const calendarData = worker
    ? generateMonthCalendar(month, worker.attendance, lang)
    : null;

  const stats = calendarData?.stats || {
    presentCount: summary?.presentDays || 0,
    halfDayCount: summary?.halfDays || 0,
    absentCount: summary?.absentDays || 0,
    effectivePresent: summary?.workedDays || 0,
    accuracyPercentage: summary?.accuracyPercentage ?? 100,
    accuracyRating: lang === "hi" ? "उत्कृष्ट" : "Excellent",
    accuracyColor: "#16a34a",
  };

  // Filtered days for the attendance table
  const filteredDays =
    calendarData?.days.filter((day) => {
      if (tableFilter === "all") return true;
      if (tableFilter === "present") return day.status === "present";
      if (tableFilter === "half-day") return day.status === "half-day";
      if (tableFilter === "absent") return day.status === "absent";
      return true;
    }) || [];

  return (
    <div className="worker-portal-app">
      {/* ================= FIXED SIDEBAR ================= */}
      <aside className={`worker-portal-sidebar ${sidebarOpen ? "open" : ""}`}>
        {/* Brand / Logo Area */}
        <div className="wp-sidebar-brand">
          <div className="wp-brand-icon">
            <Sparkles size={22} />
          </div>
          <div className="wp-brand-text">
            <h2>Vishwakarma</h2>
            <span>{t("WORKER PORTAL", "कर्मचारी पोर्टल")}</span>
          </div>
          <button
            type="button"
            className="wp-sidebar-close-btn"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Worker Profile Snippet in Sidebar */}
        <div
          className="wp-sidebar-user-card"
          onClick={() => {
            setActiveTab("profile");
            setSidebarOpen(false);
          }}
          title={t("Click to view full profile", "पूरी प्रोफाइल देखने के लिए क्लिक करें")}
        >
          <div className="wp-user-avatar">
            {worker?.profileImageUrl ? (
              <img src={worker.profileImageUrl} alt={worker.name} />
            ) : (
              <UserRound size={24} />
            )}
            <span className="wp-status-dot" title={t("Active on duty", "ड्यूटी पर सक्रिय")} />
          </div>
          <div className="wp-user-info">
            <strong>{worker?.name || user?.name || "Worker"}</strong>
            <span>{worker?.jobTitle || t("Workshop Staff", "वर्कशॉप स्टाफ")}</span>
          </div>
        </div>

        {/* Sidebar Navigation Menu */}
        <nav className="wp-sidebar-nav">
          <button
            type="button"
            className={`wp-nav-item ${activeTab === "dashboard" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("dashboard");
              setSidebarOpen(false);
            }}
          >
            <LayoutDashboard size={19} />
            <span>{t("Dashboard", "डैशबोर्ड")}</span>
          </button>

          <button
            type="button"
            className={`wp-nav-item ${activeTab === "attendance" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("attendance");
              setSidebarOpen(false);
            }}
          >
            <CalendarDays size={19} />
            <span>{t("Attendance", "हाजिरी")}</span>
          </button>

          <button
            type="button"
            className={`wp-nav-item ${activeTab === "payments" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("payments");
              setSidebarOpen(false);
            }}
          >
            <Wallet size={19} />
            <span>{t("Salary & Payments", "वेतन एवं भुगतान")}</span>
          </button>

          <button
            type="button"
            className={`wp-nav-item ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("profile");
              setSidebarOpen(false);
            }}
          >
            <UserRound size={19} />
            <span>{t("My Profile", "मेरी प्रोफाइल")}</span>
          </button>
        </nav>

        {/* Bottom Sidebar: Sync Pill + Logout */}
        <div className="wp-sidebar-bottom">
          <div className="wp-sidebar-sync-pill">
            <span className="pulse-dot" />
            <span className="sync-text">{t("Live Sync Active", "लाइव सिंक चालू")}</span>
          </div>

          <button
            type="button"
            className="wp-logout-button"
            onClick={handleLogout}
          >
            <LogOut size={18} />
            <span>{t("Logout", "लॉगआउट")}</span>
          </button>
        </div>
      </aside>

      {/* Backdrop for Mobile Sidebar */}
      {sidebarOpen && (
        <div
          className="wp-sidebar-backdrop"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ================= MAIN CONTENT WRAPPER ================= */}
      <div className="worker-portal-main-wrapper">
        {/* ================= TOP HEADER ================= */}
        <header className="worker-portal-header">
          <div className="wp-header-left">
            <button
              type="button"
              className="wp-mobile-hamburger"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar menu"
            >
              <Menu size={22} />
            </button>
            <div className="wp-header-title-box">
              <span className="wp-breadcrumb">{t("VEW WORKER PORTAL", "कर्मचारी पोर्टल")}</span>
              <h1>
                {activeTab === "dashboard" && t("Worker Dashboard", "कर्मचारी डैशबोर्ड")}
                {activeTab === "attendance" && t("Monthly Attendance Sheet", "मासिक हाजिरी तालिका")}
                {activeTab === "payments" && t("Salary & Payment Receipts", "वेतन एवं भुगतान रसीदें")}
                {activeTab === "profile" && t("Worker Profile Details", "मेरी प्रोफाइल")}
              </h1>
            </div>
          </div>

          <div className="wp-header-right">
            {/* Language Switcher Button */}
            <button
              type="button"
              className="wp-lang-btn"
              onClick={toggleLang}
              title={lang === "en" ? "हिंदी में बदलें (Switch to Hindi)" : "Switch to English"}
            >
              <Globe size={15} />
              <span>{lang === "en" ? "हिंदी" : "English"}</span>
            </button>

            {/* Live Sync Badge & Refresh Button */}
            <div className="wp-live-sync-pill" title={t("Data updates automatically in real-time", "डेटा अपने आप अपडेट होता है")}>
              <span className="live-dot" />
              <span className="live-label">{t("Live Sync", "लाइव सिंक")}</span>
            </div>

            <button
              type="button"
              className={`wp-refresh-btn ${refreshing ? "spinning" : ""}`}
              onClick={() => fetchWorkerData(false)}
              title={t("Click to refresh data now", "रिफ्रेश करने के लिए क्लिक करें")}
            >
              <RefreshCw size={15} />
              <span className="btn-text">{t("Refresh", "रिफ्रेश")}</span>
            </button>

            {/* Quick Balance Header Pill */}
            {summary && (
              <div
                className={`wp-header-balance-pill ${
                  balance > 0 ? "due" : balance < 0 ? "advance" : "settled"
                }`}
                title={t("Current Month Payment Balance", "चालू माह का बैलेंस")}
              >
                <IndianRupee size={14} />
                <span className="balance-label">
                  {balance > 0 ? t("Due:", "बाकी:") : balance < 0 ? t("Advance:", "अग्रिम:") : t("Status:", "स्थिति:")}
                </span>
                <strong>{balanceText}</strong>
              </div>
            )}

            {/* Header Worker Name & Profile Menu Button */}
            <div className="wp-header-profile-menu-wrap">
              <button
                type="button"
                className="wp-header-profile-btn"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                aria-label="Worker Profile Menu"
              >
                <div className="wp-header-avatar">
                  {worker?.profileImageUrl ? (
                    <img src={worker.profileImageUrl} alt={worker.name} />
                  ) : (
                    <UserRound size={18} />
                  )}
                </div>
                <div className="wp-header-name-box">
                  <span className="wp-header-name">{worker?.name || user?.name || "Worker"}</span>
                  <span className="wp-header-role">{worker?.jobTitle || t("Staff", "स्टाफ")}</span>
                </div>
              </button>

              {/* Profile Dropdown Menu */}
              {profileDropdownOpen && (
                <div className="wp-profile-dropdown">
                  <div className="wp-dropdown-user-header">
                    <strong>{worker?.name || user?.name}</strong>
                    <span>{user?.email || worker?.phone}</span>
                  </div>
                  <hr className="wp-dropdown-divider" />
                  <button
                    type="button"
                    className="wp-dropdown-item"
                    onClick={() => {
                      setActiveTab("profile");
                      setProfileDropdownOpen(false);
                    }}
                  >
                    <UserRound size={16} />
                    <span>{t("View Profile", "प्रोफाइल देखें")}</span>
                  </button>
                  <button
                    type="button"
                    className="wp-dropdown-item"
                    onClick={() => {
                      setActiveTab("payments");
                      setProfileDropdownOpen(false);
                    }}
                  >
                    <Wallet size={16} />
                    <span>{t("Salary Receipts", "भुगतान रसीदें")}</span>
                  </button>
                  <hr className="wp-dropdown-divider" />
                  <button
                    type="button"
                    className="wp-dropdown-item logout"
                    onClick={handleLogout}
                  >
                    <LogOut size={16} />
                    <span>{t("Logout", "लॉगआउट")}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Global Error Banner */}
        {error && (
          <div className="wp-notice-error" role="alert">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* ================= MAIN CONTENT BODY ================= */}
        <main className="worker-portal-content">
          {loading && !worker ? (
            <div className="wp-loading-state">
              <RefreshCw size={36} className="spinning" />
              <p>{t("Loading your worker records...", "डेटा लोड हो रहा है...")}</p>
            </div>
          ) : (
            <>
              {/* TAB 1: DASHBOARD OVERVIEW */}
              {activeTab === "dashboard" && (
                <div className="wp-dashboard-view">
                  {/* Top Month Selector Toolbar */}
                  <div className="wp-period-toolbar">
                    <div className="toolbar-info">
                      <h2>{formatMonthDisplay(month, lang)}</h2>
                      <p>
                        {t(
                          "Real-time attendance tracking, payroll overview, and performance accuracy.",
                          "रियल-टाइम हाजिरी ट्रैकिंग, वेतन विवरण और उपस्थिति एक्यूरेसी।"
                        )}
                      </p>
                    </div>

                    <div className="toolbar-picker">
                      <label htmlFor="wp-month-select">{t("Payroll Month:", "वेतन माह:")}</label>
                      <select
                        id="wp-month-select"
                        value={month}
                        onChange={(e) => {
                          if (e.target.value) setMonth(e.target.value);
                        }}
                      >
                        {getSelectableMonths(18, lang).map((m) => (
                          <option key={m.key} value={m.key}>
                            {m.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* 3 PRIMARY PAYMENT OVERVIEW CARDS */}
                  <div className="wp-payment-highlight-grid">
                    <article className="wp-payment-card salary">
                      <div className="wp-card-icon">
                        <Wallet size={26} />
                      </div>
                      <div className="wp-card-data">
                        <span className="card-label">{t("Total Monthly Salary", "कुल तय वेतन")}</span>
                        <strong className="card-value">
                          {summary?.salaryConfigured ? money(summary.earned) : t("Not set", "निर्धारित नहीं")}
                        </strong>
                        <small className="card-sub">{t("Fixed monthly compensation", "मासिक निर्धारित वेतन")}</small>
                      </div>
                    </article>

                    <article className="wp-payment-card paid">
                      <div className="wp-card-icon">
                        <CheckCircle2 size={26} />
                      </div>
                      <div className="wp-card-data">
                        <span className="card-label">{t("Total Received Payment", "मिल चुका भुगतान")}</span>
                        <strong className="card-value">{money(summary?.paid || 0)}</strong>
                        <small className="card-sub">
                          {worker?.payments?.length || 0} {t("payment(s) recorded", "भुगतान दर्ज")}
                        </small>
                      </div>
                    </article>

                    <article
                      className={`wp-payment-card balance ${
                        balance > 0 ? "due" : balance < 0 ? "advance" : "settled"
                      }`}
                    >
                      <div className="wp-card-icon">
                        <IndianRupee size={26} />
                      </div>
                      <div className="wp-card-data">
                        <span className="card-label">
                          {balance < 0
                            ? t("Advance Drawn", "अग्रिम राशि")
                            : balance === 0
                            ? t("Payment Status", "स्थिति")
                            : t("Remaining Due Balance", "बचा हुआ वेतन")}
                        </span>
                        <strong className="card-value">{balanceText}</strong>
                        <small className="card-sub">
                          {balance > 0
                            ? t("Pending payout from workshop", "वर्कशॉप से मिलना बाकी")
                            : balance === 0
                            ? t("All dues settled for this month", "इस माह का सब चुकता")
                            : t("Advance paid by workshop", "अग्रिम भुगतान")}
                        </small>
                      </div>
                    </article>
                  </div>

                  {/* 4 ATTENDANCE SUMMARY METRICS */}
                  <div className="wp-attendance-metrics-grid">
                    <article className="wp-metric-card present">
                      <div className="metric-icon">
                        <CheckCircle2 size={22} />
                      </div>
                      <div className="metric-details">
                        <span className="metric-title">{t("Present", "पूरा दिन")}</span>
                        <strong className="metric-num">{stats.presentCount} {t("Days", "दिन")}</strong>
                        <small>{t("Full working days", "पूर्ण कार्य दिवस")}</small>
                      </div>
                    </article>

                    <article className="wp-metric-card half-day">
                      <div className="metric-icon">
                        <Clock size={22} />
                      </div>
                      <div className="metric-details">
                        <span className="metric-title">{t("Half-Day", "आधा दिन")}</span>
                        <strong className="metric-num">{stats.halfDayCount} {t("Days", "दिन")}</strong>
                        <small>{t("0.5 credit per day", "0.5 दिन मान")}</small>
                      </div>
                    </article>

                    <article className="wp-metric-card absent">
                      <div className="metric-icon">
                        <ShieldAlert size={22} />
                      </div>
                      <div className="metric-details">
                        <span className="metric-title">{t("Absent", "अनुपस्थित")}</span>
                        <strong className="metric-num">{stats.absentCount} {t("Days", "दिन")}</strong>
                        <small>{t("Leave / Off days", "छुट्टी के दिन")}</small>
                      </div>
                    </article>

                    <article className="wp-metric-card worked">
                      <div className="metric-icon">
                        <TrendingUp size={22} />
                      </div>
                      <div className="metric-details">
                        <span className="metric-title">{t("Effective Worked", "कुल प्रभावी कार्य")}</span>
                        <strong className="metric-num">{stats.effectivePresent} {t("Days", "दिन")}</strong>
                        <small>{t("Present + 0.5×Half-day", "उपस्थित + आधा दिन")}</small>
                      </div>
                    </article>
                  </div>

                  {/* DASHBOARD BOTTOM SPLIT: Accuracy Gauge & Quick Tables */}
                  <div className="wp-dashboard-split">
                    {/* LEFT: Attendance Accuracy Gauge Widget */}
                    <div className="wp-accuracy-widget-card">
                      <div className="wp-widget-header">
                        <h3>
                          <Percent size={18} /> {t("Attendance Accuracy", "उपस्थिति दर (एक्यूरेसी)")}
                        </h3>
                      </div>
                      <div className="wp-accuracy-widget-body">
                        <div className="gauge-outer-ring">
                          <div
                            className="gauge-progress-circle"
                            style={{
                              background: `conic-gradient(${stats.accuracyColor} ${
                                stats.accuracyPercentage * 3.6
                              }deg, #e2e8f0 0deg)`,
                            }}
                          >
                            <div className="gauge-center-circle">
                              <span className="gauge-percentage-text">
                                {stats.accuracyPercentage}%
                              </span>
                              <span className="gauge-sub-text">{t("Accuracy", "एक्यूरेसी")}</span>
                            </div>
                          </div>
                        </div>

                        <div className="gauge-text-panel">
                          <div
                            className="accuracy-rating-pill"
                            style={{
                              backgroundColor: `${stats.accuracyColor}15`,
                              color: stats.accuracyColor,
                              borderColor: stats.accuracyColor,
                            }}
                          >
                            {stats.accuracyRating}
                          </div>
                          <p className="accuracy-explainer">
                            {t("You completed", "आपने")} <strong>{stats.effectivePresent} {t("working days", "कार्य दिवस")}</strong> {t("out of", "पूरे किए")} <strong>{stats.totalMarkedDays || 0} {t("recorded days", "दर्ज दिनों में से")}</strong> {t("in", "")} {formatMonthDisplay(month, lang)}.
                          </p>
                          <div className="accuracy-meter-bar">
                            <div
                              className="accuracy-meter-fill"
                              style={{
                                width: `${Math.min(stats.accuracyPercentage, 100)}%`,
                                backgroundColor: stats.accuracyColor,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* RIGHT: Quick Recent Payment & Attendance Snapshot */}
                    <div className="wp-recent-activity-card">
                      <div className="wp-widget-header">
                        <h3>
                          <Wallet size={18} /> {t("Recent Payments", "हाल के भुगतान")} ({month})
                        </h3>
                        <button
                          type="button"
                          className="wp-widget-link-btn"
                          onClick={() => setActiveTab("payments")}
                        >
                          {t("View All", "सभी देखें")} <ChevronRight size={14} />
                        </button>
                      </div>
                      <div className="wp-recent-payments-list">
                        {worker?.payments?.length ? (
                          worker.payments.slice(0, 4).map((p) => (
                            <div key={p._id} className="wp-recent-payment-row">
                              <div className="pay-row-left">
                                <span className="pay-method-tag">
                                  {p.method.toUpperCase()}
                                </span>
                                <div className="pay-details">
                                  <strong>{formatDate(p.paidAt)}</strong>
                                  <small>{p.referenceId ? `Ref: ${p.referenceId}` : p.note || t("Workshop payout", "भुगतान")}</small>
                                </div>
                              </div>
                              <strong className="pay-amount-text">
                                +{money(p.amount)}
                              </strong>
                            </div>
                          ))
                        ) : (
                          <div className="wp-empty-snippet">
                            <p>{t("No payments recorded yet for this month.", "इस माह का कोई भुगतान दर्ज नहीं है।")}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: FULL ATTENDANCE SHEET */}
              {activeTab === "attendance" && (
                <div className="wp-attendance-view">
                  <div className="wp-period-toolbar">
                    <div className="toolbar-info">
                      <h2>{t("Monthly Attendance Sheet", "मासिक हाजिरी तालिका")} ({formatMonthDisplay(month, lang)})</h2>
                      <p>
                        {t(
                          "Full day-by-day attendance records with working credit calculations.",
                          "दैनिक उपस्थिति रिकॉर्ड और कार्य क्रेडिट की गणना।"
                        )}
                      </p>
                    </div>

                    <div className="toolbar-picker">
                      <label htmlFor="wp-att-month-select">{t("Select Month:", "महीना चुनें:")}</label>
                      <select
                        id="wp-att-month-select"
                        value={month}
                        onChange={(e) => {
                          if (e.target.value) setMonth(e.target.value);
                        }}
                      >
                        {getSelectableMonths(18, lang).map((m) => (
                          <option key={m.key} value={m.key}>
                            {m.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Attendance Table Card */}
                  <div className="wp-section-card">
                    <div className="wp-card-header-bar">
                      <div className="filter-pills-group" role="tablist">
                        <button
                          type="button"
                          className={`filter-btn ${tableFilter === "all" ? "active" : ""}`}
                          onClick={() => setTableFilter("all")}
                        >
                          {t("All Days", "सभी दिन")} ({calendarData?.days.length || 0})
                        </button>
                        <button
                          type="button"
                          className={`filter-btn present ${tableFilter === "present" ? "active" : ""}`}
                          onClick={() => setTableFilter("present")}
                        >
                          {t("Present", "उपस्थित")} ({stats.presentCount})
                        </button>
                        <button
                          type="button"
                          className={`filter-btn half-day ${tableFilter === "half-day" ? "active" : ""}`}
                          onClick={() => setTableFilter("half-day")}
                        >
                          {t("Half-Day", "आधा दिन")} ({stats.halfDayCount})
                        </button>
                        <button
                          type="button"
                          className={`filter-btn absent ${tableFilter === "absent" ? "active" : ""}`}
                          onClick={() => setTableFilter("absent")}
                        >
                          {t("Absent", "अनुपस्थित")} ({stats.absentCount})
                        </button>
                      </div>

                      <div className="wp-table-stats-badge">
                        <span>{t("Accuracy:", "एक्यूरेसी:")} <strong>{stats.accuracyPercentage}%</strong></span>
                        <span>{t("Worked Days:", "कार्य दिन:")} <strong>{stats.effectivePresent}</strong></span>
                      </div>
                    </div>

                    <div className="wp-table-responsive">
                      <table className="wp-data-table">
                        <thead>
                          <tr>
                            <th>{t("Date", "तारीख")}</th>
                            <th>{t("Day", "वार")}</th>
                            <th>{t("Day Category", "दिन श्रेणी")}</th>
                            <th>{t("Attendance Status", "स्थिति")}</th>
                            <th>{t("Credit", "कार्य मान")}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredDays.length ? (
                            filteredDays.map((day) => (
                              <tr
                                key={day.dateStr}
                                className={`row-status ${day.status} ${
                                  day.isSunday ? "sunday-row" : ""
                                }`}
                              >
                                <td>
                                  <strong>{day.dateFormatted}</strong>
                                </td>
                                <td>
                                  <span className="day-name-cell">
                                    {lang === "hi" ? day.dayNameHi : day.dayName}
                                  </span>
                                </td>
                                <td>
                                  {day.isSunday ? (
                                    <span className="category-pill sunday">
                                      {t("Sunday Holiday", "साप्ताहिक अवकाश")}
                                    </span>
                                  ) : day.isFuture ? (
                                    <span className="category-pill future">
                                      {t("Upcoming", "आने वाला दिन")}
                                    </span>
                                  ) : (
                                    <span className="category-pill workday">
                                      {t("Working Day", "कार्य दिवस")}
                                    </span>
                                  )}
                                </td>
                                <td>
                                  {day.status === "present" && (
                                    <span className="status-badge present">
                                      <CheckCircle2 size={13} /> {t("Present", "उपस्थित")}
                                    </span>
                                  )}
                                  {day.status === "half-day" && (
                                    <span className="status-badge half-day">
                                      <Clock size={13} /> {t("Half-Day", "आधा दिन")}
                                    </span>
                                  )}
                                  {day.status === "absent" && (
                                    <span className="status-badge absent">
                                      <AlertCircle size={13} /> {t("Absent", "अनुपस्थित")}
                                    </span>
                                  )}
                                  {day.status === "sunday" && (
                                    <span className="status-badge sunday">
                                      {t("Sunday Holiday", "रविवार अवकाश")}
                                    </span>
                                  )}
                                  {day.status === "upcoming" && (
                                    <span className="status-badge upcoming">
                                      {t("Upcoming", "आने वाला")}
                                    </span>
                                  )}
                                  {day.status === "unmarked" && (
                                    <span className="status-badge unmarked">
                                      {t("Not Marked", "खाली")}
                                    </span>
                                  )}
                                </td>
                                <td>
                                  <strong className="credit-value">
                                    {day.workCredit === 1
                                      ? "1.0 Day"
                                      : day.workCredit === 0.5
                                      ? "0.5 Day"
                                      : "0 Day"}
                                  </strong>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="5" className="table-empty-row">
                                {t("No attendance records found.", "कोई रिकॉर्ड नहीं मिला।")}
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: SALARY & PAYMENTS VIEW */}
              {activeTab === "payments" && (
                <div className="wp-payments-view">
                  <div className="wp-period-toolbar">
                    <div className="toolbar-info">
                      <h2>{t("Salary & Payments", "वेतन एवं भुगतान")} ({formatMonthDisplay(month, lang)})</h2>
                      <p>
                        {t(
                          "Track received payments, salary earnings, and pending balance with the workshop.",
                          "प्राप्त भुगतान, वेतन आय और वर्कशॉप के साथ बकाया शेष राशि की जांच करें।"
                        )}
                      </p>
                    </div>

                    <div className="toolbar-picker">
                      <label htmlFor="wp-pay-month-select">{t("Payroll Month:", "वेतन माह:")}</label>
                      <select
                        id="wp-pay-month-select"
                        value={month}
                        onChange={(e) => {
                          if (e.target.value) setMonth(e.target.value);
                        }}
                      >
                        {getSelectableMonths(18, lang).map((m) => (
                          <option key={m.key} value={m.key}>
                            {m.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* 3 Summary Cards */}
                  <div className="wp-payment-highlight-grid">
                    <article className="wp-payment-card salary">
                      <div className="wp-card-icon">
                        <Wallet size={26} />
                      </div>
                      <div className="wp-card-data">
                        <span className="card-label">{t("Monthly Fixed Salary", "मासिक तय वेतन")}</span>
                        <strong className="card-value">
                          {summary?.salaryConfigured ? money(summary.earned) : t("Not set", "निर्धारित नहीं")}
                        </strong>
                        <small className="card-sub">{t("Fixed compensation", "मासिक वेतन")}</small>
                      </div>
                    </article>

                    <article className="wp-payment-card paid">
                      <div className="wp-card-icon">
                        <CheckCircle2 size={26} />
                      </div>
                      <div className="wp-card-data">
                        <span className="card-label">{t("Total Received Payment", "मिल चुका भुगतान")}</span>
                        <strong className="card-value">{money(summary?.paid || 0)}</strong>
                        <small className="card-sub">
                          {worker?.payments?.length || 0} {t("receipt(s) recorded", "रसीदें दर्ज")}
                        </small>
                      </div>
                    </article>

                    <article
                      className={`wp-payment-card balance ${
                        balance > 0 ? "due" : balance < 0 ? "advance" : "settled"
                      }`}
                    >
                      <div className="wp-card-icon">
                        <IndianRupee size={26} />
                      </div>
                      <div className="wp-card-data">
                        <span className="card-label">
                          {balance < 0
                            ? t("Advance Drawn", "अग्रिम राशि")
                            : balance === 0
                            ? t("Settlement Status", "स्थिति")
                            : t("Remaining Due Balance", "बचा हुआ वेतन")}
                        </span>
                        <strong className="card-value">{balanceText}</strong>
                        <small className="card-sub">
                          {balance > 0 ? t("Pending from workshop", "वर्कशॉप से बाकी") : t("All settled", "सब चुकता")}
                        </small>
                      </div>
                    </article>
                  </div>

                  {/* Detailed Payment Receipts Table */}
                  <div className="wp-section-card">
                    <div className="wp-card-header-bar">
                      <h3>
                        <IndianRupee size={18} /> {t("Payment Receipts Log", "भुगतान रसीदें")} ({formatMonthDisplay(month, lang)})
                      </h3>
                    </div>

                    <div className="wp-table-responsive">
                      <table className="wp-data-table">
                        <thead>
                          <tr>
                            <th>{t("Payment Date", "भुगतान तारीख")}</th>
                            <th>{t("Payment Mode", "माध्यम")}</th>
                            <th>{t("Amount", "राशि")}</th>
                            <th>{t("UTR / Transaction Ref", "रेफरेंस आईडी")}</th>
                            <th>{t("Payment Note", "टिप्पणी")}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {worker?.payments?.length ? (
                            worker.payments.map((p) => (
                              <tr key={p._id}>
                                <td>
                                  <strong>{formatDate(p.paidAt)}</strong>
                                </td>
                                <td>
                                  <span className="category-pill workday">
                                    {p.method.toUpperCase()}
                                  </span>
                                </td>
                                <td>
                                  <strong className="pay-amount-green">
                                    {money(p.amount)}
                                  </strong>
                                </td>
                                <td>
                                  <span className="reference-code">
                                    {p.referenceId || "—"}
                                  </span>
                                </td>
                                <td>{p.note || "—"}</td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="5" className="table-empty-row">
                                {t("No payment receipts recorded yet for this month.", "इस माह कोई भुगतान रसीद दर्ज नहीं है।")}
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: MY PROFILE VIEW */}
              {activeTab === "profile" && (
                <div className="wp-profile-view">
                  {photoNotice && (
                    <div className="wp-notice-banner success">
                      <CheckCircle2 size={16} />
                      <span>{photoNotice}</span>
                    </div>
                  )}

                  <div className="wp-profile-hero-card">
                    <div className="wp-hero-avatar-wrap">
                      {worker?.profileImageUrl ? (
                        <img src={worker.profileImageUrl} alt={worker.name} />
                      ) : (
                        <UserRound size={48} />
                      )}
                      <label
                        className="wp-avatar-upload-badge"
                        title={t("Change profile photo", "फोटो बदलें")}
                      >
                        {uploadingPhoto ? (
                          <Loader2 size={15} className="wp-spinner" />
                        ) : (
                          <Camera size={15} />
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: "none" }}
                          onChange={handleUploadProfilePhoto}
                          disabled={uploadingPhoto}
                        />
                      </label>
                    </div>
                    <div className="wp-hero-meta">
                      <h2>{worker?.name}</h2>
                      <span className="wp-hero-role">
                        <Briefcase size={15} /> {worker?.jobTitle}
                      </span>
                      <div className="wp-hero-contact-row">
                        <span>📞 {worker?.phone}</span>
                        {user?.email && <span>✉️ {user.email}</span>}
                      </div>
                      <span className="wp-photo-hint">
                        {t("Click camera badge to update your photo", "फोटो बदलने के लिए कैमरा आइकन पर क्लिक करें")}
                      </span>
                    </div>
                  </div>

                  <div className="wp-profile-details-grid">
                    <div className="wp-profile-field-card">
                      <span className="field-lbl">{t("Full Name", "पूरा नाम")}</span>
                      <strong>{worker?.name}</strong>
                    </div>

                    <div className="wp-profile-field-card">
                      <span className="field-lbl">{t("Designation / Role", "पद")}</span>
                      <strong>{worker?.jobTitle}</strong>
                    </div>

                    <div className="wp-profile-field-card">
                      <span className="field-lbl">{t("Primary Mobile", "मोबाइल नंबर")}</span>
                      <strong>
                        <a href={`tel:${worker?.phone}`}>{worker?.phone}</a>
                      </strong>
                    </div>

                    {worker?.alternatePhone && (
                      <div className="wp-profile-field-card">
                        <span className="field-lbl">{t("Alternate Mobile", "दूसरा मोबाइल")}</span>
                        <strong>{worker.alternatePhone}</strong>
                      </div>
                    )}

                    <div className="wp-profile-field-card full-width">
                      <span className="field-lbl">{t("Residential Address", "निवास का पता")}</span>
                      <strong>{worker?.address || t("Address not registered", "पता दर्ज नहीं")}</strong>
                    </div>

                    {(worker?.emergencyContactName || worker?.emergencyContactPhone) && (
                      <div className="wp-profile-field-card">
                        <span className="field-lbl">{t("Emergency Contact", "आपातकालीन संपर्क")}</span>
                        <strong>
                          {worker.emergencyContactName || t("Contact", "संपर्क")}
                          {worker.emergencyContactPhone && ` · 📞 ${worker.emergencyContactPhone}`}
                        </strong>
                      </div>
                    )}

                    {worker?.upiId && (
                      <div className="wp-profile-field-card">
                        <span className="field-lbl">{t("Registered UPI ID", "यूपीआई आईडी")}</span>
                        <strong className="upi-code-badge">{worker.upiId}</strong>
                      </div>
                    )}

                    {user?.email && (
                      <div className="wp-profile-field-card">
                        <span className="field-lbl">{t("Login Account Email", "लॉगिन ईमेल")}</span>
                        <strong>{user.email}</strong>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
