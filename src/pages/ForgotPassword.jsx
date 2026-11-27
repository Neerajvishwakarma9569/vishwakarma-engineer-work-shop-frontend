import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import './Css/ForgotPassword.css';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();
  const { resetPassword } = useAuth();

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');
    setSubmitting(true);
    try {
      const { data } = await api.post('/auth/forgot-password', { email });
      setOtpSent(true);
      setMessage(data.message);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not request a password reset.');
    } finally {
      setSubmitting(false);
    }
  };

  const reset = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');
    if (otp.length !== 6) {
      setError('Enter the 6-digit OTP.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setSubmitting(true);
    try {
      const user = await resetPassword({ email, otp, password });
      navigate(user.role === 'worker' ? '/worker-dashboard' : '/');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not reset password.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="login-page auth-wrap">
      <form className="form-card" onSubmit={otpSent ? reset : submit}>
        <span className="eyebrow">ACCOUNT RECOVERY</span>
        <h1>Forgot password</h1>
        <label>Email
          <input type="email" required disabled={otpSent} value={email} onChange={(event) => setEmail(event.target.value)} />
        </label>
        {otpSent && (
          <>
            <label>6-digit OTP
              <input className="otp-input" type="text" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength="6" required value={otp} onChange={(event) => setOtp(event.target.value.replace(/\D/g, '').slice(0, 6))} />
            </label>
            <label>New password
              <input type="password" minLength="6" required value={password} onChange={(event) => setPassword(event.target.value)} />
            </label>
            <label>Confirm password
              <input type="password" minLength="6" required value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} />
            </label>
          </>
        )}
        {error && <p className="form-error">{error}</p>}
        {message && <p className="form-success">{message}</p>}
        <button className="btn btn-dark full" disabled={submitting}>
          {submitting ? (otpSent ? 'Verifying...' : 'Sending...') : (otpSent ? 'Verify OTP & update password' : 'Send OTP')}
        </button>
        <p><Link to="/login">Back to login</Link></p>
      </form>
    </main>
  );
}
