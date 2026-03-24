import React, { useState, useEffect } from "react";
import axios from "axios";
import API_BASE_URL from '../config/apiConfig';
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Car } from 'lucide-react';
import toast from 'react-hot-toast';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@600;700;800&family=Inter:wght@400;500;600&display=swap');

  .login-root {
    min-height: 100vh;
    display: grid;
    grid-template-columns: 1fr 1fr;
    font-family: 'Inter', sans-serif;
  }

  /* Left panel — decorative */
  .login-panel-left {
    background: linear-gradient(135deg, #1A1A2E 0%, #16213E 60%, #0F3460 100%);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 48px;
    position: relative;
    overflow: hidden;
  }
  .login-panel-left::before {
    content: '';
    position: absolute;
    width: 500px; height: 500px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(59,107,240,0.18) 0%, transparent 70%);
    bottom: -100px; right: -100px;
    pointer-events: none;
  }
  .login-panel-left::after {
    content: '';
    position: absolute;
    width: 300px; height: 300px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(59,107,240,0.12) 0%, transparent 70%);
    top: -60px; left: -60px;
    pointer-events: none;
  }

  .login-brand {
    display: flex; align-items: center; gap: 10px;
    font-family: 'Manrope', sans-serif;
    font-size: 22px; font-weight: 800;
    color: #fff; text-decoration: none; z-index: 1;
  }
  .login-brand-dot { width: 8px; height: 8px; background: #3B6BF0; border-radius: 50%; }

  .login-left-content { z-index: 1; }
  .login-left-title {
    font-family: 'Manrope', sans-serif;
    font-size: clamp(28px, 3vw, 40px);
    font-weight: 800; color: #fff;
    line-height: 1.15; margin-bottom: 16px;
  }
  .login-left-title span { color: #3B6BF0; }
  .login-left-sub { font-size: 15px; color: rgba(255,255,255,0.55); line-height: 1.7; max-width: 380px; }

  .login-left-stats {
    display: flex; gap: 32px; z-index: 1;
    padding-top: 32px; border-top: 1px solid rgba(255,255,255,0.08);
  }
  .login-left-stat-n { font-family: 'Manrope', sans-serif; font-size: 28px; font-weight: 800; color: #fff; line-height: 1; }
  .login-left-stat-l { font-size: 12px; color: rgba(255,255,255,0.4); margin-top: 4px; text-transform: uppercase; letter-spacing: 0.5px; }

  /* Right panel — form */
  .login-panel-right {
    background: #fff;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 48px 40px;
    overflow-y: auto;
  }

  .login-form-wrap { width: 100%; max-width: 400px; }

  .login-form-title {
    font-family: 'Manrope', sans-serif;
    font-size: 28px; font-weight: 800;
    color: #1A1A2E; margin-bottom: 6px;
  }
  .login-form-sub { font-size: 14px; color: #8888A8; margin-bottom: 36px; }

  /* Notice box — no self-registration */
  .login-notice {
    background: #EEF2FF; border: 1px solid rgba(59,107,240,0.2);
    border-left: 3px solid #3B6BF0;
    border-radius: 8px; padding: 12px 14px;
    font-size: 13px; color: #3B6BF0;
    margin-bottom: 24px; line-height: 1.5;
  }

  .form-field { margin-bottom: 18px; }
  .form-label { display: block; font-size: 11px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; color: #8888A8; margin-bottom: 7px; }

  .form-input {
    width: 100%;
    background: #F7F8FC;
    border: 1.5px solid #E5E7F0;
    border-radius: 8px;
    padding: 12px 14px;
    font-family: 'Inter', sans-serif;
    font-size: 14px; color: #1A1A2E;
    outline: none;
    transition: border 0.18s, background 0.18s;
  }
  .form-input:focus { border-color: #3B6BF0; background: #fff; box-shadow: 0 0 0 3px rgba(59,107,240,0.1); }
  .form-input.error { border-color: #E63946; background: #FFF5F5; }
  .form-input::placeholder { color: #AAAACC; }

  .pw-wrap { position: relative; }
  .pw-toggle {
    position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
    background: none; border: none; cursor: pointer; color: #8888A8;
    display: flex; align-items: center; padding: 0;
    transition: color 0.18s;
  }
  .pw-toggle:hover { color: #3B6BF0; }

  .field-error { font-size: 12px; color: #E63946; margin-top: 5px; display: block; }

  .forgot-link { font-size: 13px; color: #3B6BF0; text-decoration: none; font-weight: 500; }
  .forgot-link:hover { text-decoration: underline; }

  .btn-login {
    width: 100%;
    background: #3B6BF0;
    color: #fff;
    border: none; border-radius: 8px;
    padding: 13px;
    font-family: 'Inter', sans-serif;
    font-size: 14px; font-weight: 600;
    cursor: pointer;
    transition: background 0.18s;
    margin-top: 8px;
  }
  .btn-login:hover { background: #2952CC; }
  .btn-login:disabled { opacity: 0.6; cursor: not-allowed; }

  .login-divider { display: flex; align-items: center; gap: 12px; margin: 20px 0; }
  .login-divider-line { flex: 1; height: 1px; background: #E5E7F0; }
  .login-divider-text { font-size: 12px; color: #8888A8; white-space: nowrap; }

  .login-footer-text { text-align: center; font-size: 13px; color: #8888A8; margin-top: 20px; }
  .login-footer-text a { color: #3B6BF0; font-weight: 600; text-decoration: none; }
  .login-footer-text a:hover { text-decoration: underline; }

  @media (max-width: 768px) {
    .login-root { grid-template-columns: 1fr; }
    .login-panel-left { display: none; }
    .login-panel-right { padding: 40px 24px; min-height: 100vh; }
  }
`;

function Login() {
  const [mydata,       setData]          = useState({});
  const [errors,       setErrors]        = useState({});
  const [showPassword, setShowPassword]  = useState(false);
  const [submitting,   setSubmitting]    = useState(false);
  const navigate = useNavigate();

  // original redirect logic
  useEffect(() => {
    const storedId = localStorage.getItem('id');
    if (storedId) navigate('/Profile');
  }, [navigate]);

  // original validation
  const validate = () => {
    const newErrors = {};
    if (!mydata.email)                             newErrors.email    = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(mydata.email))  newErrors.email    = "Email format is invalid";
    if (!mydata.password)                          newErrors.password = "Password is required";
    else if (mydata.password.length < 6)           newErrors.password = "Password must be at least 6 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onChange = (event) => {
    setData(prev => ({ ...prev, [event.target.name]: event.target.value }));
    setErrors(prev => ({ ...prev, [event.target.name]: '' }));
  };

  // original submit logic
  const submitValue = (event) => {
    event.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    axios.post(`${API_BASE_URL}/login`, { email: mydata.email, password: mydata.password })
      .then((response) => {
        if (response.data.flag === "1") {
          toast.success("Successfully logged in");
          localStorage.setItem("name",    response.data.name);
          localStorage.setItem("user_id", response.data.user_id);
          localStorage.setItem("id",      response.data.id);
          window.location = '/Dashboard';
        } else {
          toast.error("Wrong email or password");
        }
      })
      .catch((error) => { console.error('Login error:', error); toast.error("Something went wrong. Please try again."); })
      .finally(() => setSubmitting(false));
  };

  return (
    <div className="login-root">
      <style>{STYLES}</style>

      {/* ── LEFT PANEL ── */}
      <div className="login-panel-left">
        <Link to="/" className="login-brand">
          <Car size={20} color="#3B6BF0" />
          Roditec<span className="login-brand-dot" />
        </Link>

        <div className="login-left-content">
          <h2 className="login-left-title">
            Kenya's Premier<br /><span>Auto Marketplace</span>
          </h2>
          <p className="login-left-sub">
            Sign in to manage your bookings, track your listings, and access exclusive features on Roditec — Kenya's most trusted car platform.
          </p>
        </div>

        <div className="login-left-stats">
          <div>
            <div className="login-left-stat-n">500+</div>
            <div className="login-left-stat-l">Verified Listings</div>
          </div>
          <div>
            <div className="login-left-stat-n">4,200+</div>
            <div className="login-left-stat-l">Cars Sold & Hired</div>
          </div>
          <div>
            <div className="login-left-stat-n">47</div>
            <div className="login-left-stat-l">Trusted Dealers</div>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="login-panel-right">
        <div className="login-form-wrap">

          {/* Mobile logo */}
          <div style={{ display: 'none', marginBottom: 32, justifyContent: 'center' }} className="mobile-logo">
            <Link to="/" className="login-brand" style={{ color: '#1A1A2E' }}>
              <Car size={20} color="#3B6BF0" />
              Roditec<span className="login-brand-dot" />
            </Link>
          </div>

          <div className="login-form-title">Welcome back</div>
          <div className="login-form-sub">Sign in to your Roditec account</div>

          <div className="login-notice">
            Access is by invitation only. No account?{' '}
            <Link to="/ContactUs" style={{ color: '#3B6BF0', fontWeight: 600 }}>Contact our admin →</Link>
          </div>

          <form onSubmit={submitValue} noValidate>
            {/* Email */}
            <div className="form-field">
              <label className="form-label">Email Address</label>
              <input
                type="text"
                name="email"
                placeholder="you@email.com"
                onChange={onChange}
                className={`form-input${errors.email ? ' error' : ''}`}
              />
              {errors.email && <span className="field-error">{errors.email}</span>}
            </div>

            {/* Password */}
            <div className="form-field">
              <label className="form-label">Password</label>
              <div className="pw-wrap">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  onChange={onChange}
                  className={`form-input${errors.password ? ' error' : ''}`}
                  style={{ paddingRight: 42 }}
                />
                <button type="button" className="pw-toggle" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <span className="field-error">{errors.password}</span>}
            </div>

            {/* Forgot */}
            <div style={{ textAlign: 'right', marginBottom: 20, marginTop: -8 }}>
              <Link to="/ForgotPassword" className="forgot-link">Forgot password?</Link>
            </div>

            <button type="submit" className="btn-login" disabled={submitting}>
              {submitting ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <div className="login-footer-text">
            Having trouble?{' '}
            <Link to="/ContactUs">Contact support</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;