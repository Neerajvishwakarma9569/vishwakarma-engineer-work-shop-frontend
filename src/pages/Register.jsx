import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Phone, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import "./Css/Register.css";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim()) {
      return setError("Please enter your full name.");
    }
    if (!form.email.trim()) {
      return setError("Please enter your email address.");
    }
    const cleanPhone = form.phone.replace(/[\s\-\(\)]/g, "");
    if (!cleanPhone) {
      return setError("Please enter your 10-digit mobile number.");
    }
    if (!/^\d{10}$/.test(cleanPhone)) {
      return setError("Please enter a valid 10-digit mobile number (e.g. 9876543210).");
    }
    if (form.password.length < 6) {
      return setError("Password must be at least 6 characters.");
    }

    setBusy(true);
    try {
      await register({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: cleanPhone,
        password: form.password,
      });
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please check your details.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="register-page auth-wrap">
      <form className="form-card" onSubmit={submit}>
        <span className="eyebrow">JOIN OUR WORKSHOP</span>
        <h1>Create account</h1>

        <label>
          Full Name <span style={{ color: "#e11d48" }}>*</span>
          <div className="auth-input-group">
            <User size={16} className="auth-input-icon" />
            <input
              type="text"
              required
              placeholder="e.g. Ramesh Vishwakarma"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
        </label>

        <label>
          Email Address <span style={{ color: "#e11d48" }}>*</span>
          <div className="auth-input-group">
            <Mail size={16} className="auth-input-icon" />
            <input
              type="email"
              required
              placeholder="e.g. ramesh@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
        </label>

        <label>
          Mobile Number <span style={{ color: "#e11d48" }}>*</span>
          <div className="auth-input-group">
            <Phone size={16} className="auth-input-icon" />
            <input
              type="tel"
              required
              placeholder="10-digit mobile number (e.g. 9876543210)"
              maxLength={10}
              value={form.phone}
              onChange={(e) => {
                const numericOnly = e.target.value.replace(/\D/g, "").slice(0, 10);
                setForm({ ...form, phone: numericOnly });
              }}
            />
          </div>
        </label>

        <label>
          Password <span style={{ color: "#e11d48" }}>*</span>
          <div className="auth-input-group">
            <Lock size={16} className="auth-input-icon" />
            <input
              type={showPassword ? "text" : "password"}
              minLength={6}
              required
              placeholder="Minimum 6 characters"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <button
              type="button"
              className="auth-pwd-toggle"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex="-1"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </label>

        {error && <p className="form-error">{error}</p>}

        <button className="btn btn-dark full" disabled={busy}>
          {busy ? "Creating account..." : "Create account"}{" "}
          <ArrowRight size={15} style={{ marginLeft: "6px" }} />
        </button>

        <p>
          Already registered? <Link to="/login">Login</Link>
        </p>
      </form>
    </main>
  );
}
