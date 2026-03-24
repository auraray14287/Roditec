import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import API_BASE_URL from '../config/apiConfig';
import { Car, Mail, ArrowLeft, CheckCircle } from 'lucide-react';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@600;700;800&family=Inter:wght@400;500;600&display=swap');

  .fp-root {
    min-height: 100vh;
    display: grid;
    grid-template-columns: 1fr 1fr;
    font-family: 'Inter', sans-serif;
  }

  /* Left panel — same as Login */
  .fp-panel-left {
    background: linear-gradient(135deg, #1A1A2E 0%, #16213E 60%, #0F3460 100%);
    display: flex; flex-direction: column;
    justify-content: space-between;
    padding: 48px; position: relative; overflow: hidden;
  }
  .fp-panel-left::before {
    content: '';
    position: absolute; width: 500px; height: 500px; border-radius: 50%;
    background: radial-gradient(circle, rgba(59,107,240,0.18) 0%, transparent 70%);
    bottom: -100px; right: -100px; pointer-events: none;
  }
  .fp-panel-left::after {
    content: '';
    position: absolute; width: 300px; height: 300px; border-radius: 50%;
    background: radial-gradient(circle, rgba(59,107,240,0.12) 0%, transparent 70%);
    top: -60px; left: -60px; pointer-events: none;
  }

  .fp-brand {
    display: flex; align-items: center; gap: 10px;
    font-family: 'Manrope', sans-serif; font-size: 22px; font-weight: 800;
    color: #fff; text-decoration: none; z-index: 1;
  }
  .fp-brand-dot { width: 8px; height: 8px; background: #3B6BF0; border-radius: 50%; }

  .fp-left-content { z-index: 1; }
  .fp-left-icon {
    width: 72px; height: 72px; background: rgba(59,107,240,0.15);
    border: 1px solid rgba(59,107,240,0.3); border-radius: 16px;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 24px;
  }
  .fp-left-title {
    font-family: 'Manrope', sans-serif; font-size: clamp(24px,3vw,36px);
    font-weight: 800; color: #fff; line-height: 1.2; margin-bottom: 14px;
  }
  .fp-left-title span { color: #3B6BF0; }
  .fp-left-sub { font-size: 14px; color: rgba(255,255,255,0.5); line-height: 1.7; max-width: 360px; }

  .fp-steps { display: flex; flex-direction: column; gap: 16px; z-index: 1; }
  .fp-step { display: flex; align-items: center; gap: 14px; }
  .fp-step-num {
    width: 32px; height: 32px; border-radius: 50%;
    background: rgba(59,107,240,0.2); border: 1px solid rgba(59,107,240,0.4);
    display: flex; align-items: center; justify-content: center;
    font-size: 13px; font-weight: 700; color: #3B6BF0; flex-shrink: 0;
  }
  .fp-step-text { font-size: 13px; color: rgba(255,255,255,0.55); }

  /* Right panel */
  .fp-panel-right {
    background: #fff;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 48px 40px; overflow-y: auto;
  }
  .fp-form-wrap { width: 100%; max-width: 400px; }

  .fp-back-link {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 13px; color: #8888A8; text-decoration: none;
    margin-bottom: 32px; transition: color 0.18s;
  }
  .fp-back-link:hover { color: #3B6BF0; }

  .fp-form-title {
    font-family: 'Manrope', sans-serif; font-size: 28px; font-weight: 800;
    color: #1A1A2E; margin-bottom: 6px;
  }
  .fp-form-sub { font-size: 14px; color: #8888A8; margin-bottom: 32px; line-height: 1.6; }

  .form-field { margin-bottom: 20px; }
  .form-label { display: block; font-size: 11px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; color: #8888A8; margin-bottom: 7px; }

  .form-input-wrap { position: relative; }
  .form-input-icon { position: absolute; left: 13px; top: 50%; transform: translateY(-50%); color: #8888A8; pointer-events: none; }
  .form-input {
    width: 100%; background: #F7F8FC; border: 1.5px solid #E5E7F0;
    border-radius: 8px; padding: 12px 14px 12px 40px;
    font-family: 'Inter', sans-serif; font-size: 14px; color: #1A1A2E;
    outline: none; transition: border 0.18s, background 0.18s;
  }
  .form-input:focus { border-color: #3B6BF0; background: #fff; box-shadow: 0 0 0 3px rgba(59,107,240,0.1); }
  .form-input::placeholder { color: #AAAACC; }

  /* Message states */
  .fp-message {
    border-radius: 8px; padding: 12px 14px;
    font-size: 13px; line-height: 1.5; margin-bottom: 20px;
    display: flex; align-items: flex-start; gap: 10px;
  }
  .fp-message.success { background: #ECFDF5; border: 1px solid #A7F3D0; color: #065F46; }
  .fp-message.error   { background: #FEF2F2; border: 1px solid #FCA5A5; color: #991B1B; }

  /* Success card */
  .fp-success-card {
    background: #ECFDF5; border: 1px solid #A7F3D0; border-radius: 12px; padding: 28px;
    text-align: center; margin-bottom: 24px;
  }
  .fp-success-icon { font-size: 40px; margin-bottom: 12px; }
  .fp-success-title { font-family: 'Manrope', sans-serif; font-size: 18px; font-weight: 700; color: #065F46; margin-bottom: 8px; }
  .fp-success-text { font-size: 13px; color: #047857; line-height: 1.6; }

  .btn-submit {
    width: 100%; background: #3B6BF0; color: #fff; border: none; border-radius: 8px;
    padding: 13px; font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 600;
    cursor: pointer; transition: background 0.18s;
  }
  .btn-submit:hover { background: #2952CC; }
  .btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }

  .fp-footer-text { text-align: center; font-size: 13px; color: #8888A8; margin-top: 20px; }
  .fp-footer-text a { color: #3B6BF0; font-weight: 600; text-decoration: none; }
  .fp-footer-text a:hover { text-decoration: underline; }

  @media (max-width: 768px) {
    .fp-root { grid-template-columns: 1fr; }
    .fp-panel-left { display: none; }
    .fp-panel-right { padding: 40px 24px; min-height: 100vh; }
  }
`;

function ForgotPassword() {
  const [email,     setEmail]     = useState('');
  const [loading,   setLoading]   = useState(false);
  const [message,   setMessage]   = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // original submit logic — preserved exactly
  const submitValue = async (event) => {
    event.preventDefault();
    if (!email) {
      setMessage('Please enter your email address.');
      setIsSuccess(false);
      return;
    }
    setLoading(true);
    setMessage('');
    try {
      const response = await axios.post(`${API_BASE_URL}/password-reset`, { email });
      if (response.data.flag === "1") {
        setIsSuccess(true);
        setMessage('A new password has been sent to your email. Please check your inbox.');
      } else {
        setIsSuccess(false);
        setMessage('No account found with that email address.');
      }
    } catch (error) {
      setIsSuccess(false);
      setMessage('Something went wrong. Please try again.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fp-root">
      <style>{STYLES}</style>

      {/* ── LEFT PANEL ── */}
      <div className="fp-panel-left">
        <Link to="/" className="fp-brand">
          <Car size={20} color="#3B6BF0" />
          Roditec<span className="fp-brand-dot" />
        </Link>

        <div className="fp-left-content">
          <div className="fp-left-icon">
            <Mail size={32} color="#3B6BF0" />
          </div>
          <h2 className="fp-left-title">
            Reset your<br /><span>Password</span>
          </h2>
          <p className="fp-left-sub">
            Forgot your password? No problem. Enter your email and we'll send you a new one right away.
          </p>
        </div>

        <div className="fp-steps">
          {[
            'Enter the email linked to your account',
            'Check your inbox for a new password',
            'Log in and change your password',
          ].map((s, i) => (
            <div key={i} className="fp-step">
              <div className="fp-step-num">{i + 1}</div>
              <div className="fp-step-text">{s}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="fp-panel-right">
        <div className="fp-form-wrap">

          <Link to="/login" className="fp-back-link">
            <ArrowLeft size={15} /> Back to Login
          </Link>

          <div className="fp-form-title">Forgot Password</div>
          <p className="fp-form-sub">
            Enter your registered email address and we'll send you a new password.
          </p>

          {/* Success card */}
          {isSuccess && (
            <div className="fp-success-card">
              <div className="fp-success-icon">✉️</div>
              <div className="fp-success-title">Email Sent!</div>
              <p className="fp-success-text">
                A new password has been sent to <strong>{email}</strong>. Please check your inbox and spam folder.
              </p>
            </div>
          )}

          {/* Error message */}
          {message && !isSuccess && (
            <div className="fp-message error">
              <span>⚠️</span>
              <span>{message}</span>
            </div>
          )}

          {/* Only show form if not yet succeeded */}
          {!isSuccess && (
            <form onSubmit={submitValue} noValidate>
              <div className="form-field">
                <label className="form-label">Email Address</label>
                <div className="form-input-wrap">
                  <Mail size={16} className="form-input-icon" />
                  <input
                    type="email"
                    name="email"
                    placeholder="you@email.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>

              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? 'Sending…' : 'Send New Password'}
              </button>
            </form>
          )}

          {isSuccess && (
            <Link to="/login" style={{ display: 'block', width: '100%', textAlign: 'center', background: '#3B6BF0', color: '#fff', borderRadius: 8, padding: '13px', fontFamily: 'Inter,sans-serif', fontSize: 14, fontWeight: 600, textDecoration: 'none', transition: 'background .18s' }}>
              Back to Login →
            </Link>
          )}

          <div className="fp-footer-text">
            Remember your password?{' '}
            <Link to="/login">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;