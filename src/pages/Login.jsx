import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Css/Login.css';

export default function Login() {
  const [step, setStep] = useState('credentials');
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  const { login, verify2FA, resend2FA } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setNotice('');
    setBusy(true);
    try {
      const u = await login(form);
      if (u?.require2FA) {
        setStep('2fa');
        setNotice(u.message || '6-digit OTP code sent to your email.');
      } else {
        navigate(u.role === 'worker' ? '/worker-dashboard' : '/');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed.');
    } finally {
      setBusy(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setNotice('');
    setBusy(true);
    try {
      const u = await verify2FA({ email: form.email, otp });
      navigate(u.role === 'worker' ? '/worker-dashboard' : '/');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Invalid or expired OTP.');
    } finally {
      setBusy(false);
    }
  };

  const handleResend = async () => {
    try {
      await resend2FA(form.email);
      setNotice('A new OTP has been sent to your email.');
    } catch {
      setError('Could not resend OTP.');
    }
  };

  return (
    <main className="login-page auth-wrap">
      {step === 'credentials' ? (
        <form className="form-card" onSubmit={submit}>
          <span className="eyebrow">WELCOME BACK</span>
          <h1>Login</h1>
          <label>
            Email or Mobile Number
            <div className="auth-input-group">
              <Mail size={16} className="auth-input-icon" />
              <input
                type="text"
                required
                placeholder="Enter email or 10-digit mobile"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
          </label>
          <label>
            Password
            <div className="auth-input-group">
              <Lock size={16} className="auth-input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="Enter your password"
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
            {busy ? 'Logging in...' : 'Login'}{' '}
            <ArrowRight size={15} style={{ marginLeft: "6px" }} />
          </button>
          <p><Link to="/forgot-password">Forgot password?</Link></p>
          <p>New here? <Link to="/register">Create an account</Link></p>
        </form>
      ) : (
        <form className="form-card" onSubmit={handleOtpSubmit}>
          <span className="eyebrow">TWO-FACTOR AUTHENTICATION</span>
          <h1>Verify 2FA Code</h1>
          {notice && <p className="notice" style={{ padding: '8px 12px', background: '#ecfdf5', color: '#065f46', borderRadius: '6px', fontSize: '13px' }}>{notice}</p>}
          {error && <p className="form-error">{error}</p>}
          <p className="muted" style={{ fontSize: '13px', margin: '4px 0 12px' }}>Enter the 6-digit OTP sent to <b>{form.email}</b>:</p>
          <label>
            6-Digit OTP
            <input
              type="text"
              required
              autoFocus
              maxLength={6}
              style={{ fontSize: '20px', letterSpacing: '8px', textAlign: 'center', height: '46px' }}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
            />
          </label>
          <button className="btn btn-dark full" disabled={busy || otp.length !== 6}>
            {busy ? 'Verifying...' : 'Verify & Continue'}
          </button>
          <p style={{ marginTop: '14px', fontSize: '13px' }}>
            <button
              type="button"
              style={{ background: 'none', border: 'none', color: '#b45309', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}
              onClick={handleResend}
            >
              Resend OTP
            </button>
            {' · '}
            <button
              type="button"
              style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: 0 }}
              onClick={() => setStep('credentials')}
            >
              Back to Login
            </button>
          </p>
        </form>
      )}
    </main>
  );
}
