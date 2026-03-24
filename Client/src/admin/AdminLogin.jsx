import React, { useState, useEffect } from "react";
import axios from "axios";
import API_BASE_URL from '../config/apiConfig';
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Shield, Car, Lock, Mail } from "lucide-react";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@600;700;800&family=Inter:wght@400;500;600&display=swap');

  .al-root {
    min-height:100vh; display:grid; grid-template-columns:1fr 1fr;
    font-family:'Inter',sans-serif;
  }

  /* LEFT - dark admin panel */
  .al-left {
    background:linear-gradient(160deg,#0D1117 0%,#161B22 60%,#1A1A2E 100%);
    display:flex; flex-direction:column; justify-content:space-between;
    padding:48px; position:relative; overflow:hidden;
  }
  .al-left::before { content:''; position:absolute; width:500px; height:500px; border-radius:50%; background:radial-gradient(circle,rgba(59,107,240,.12) 0%,transparent 70%); bottom:-100px; right:-100px; pointer-events:none; }
  .al-left::after  { content:''; position:absolute; width:300px; height:300px; border-radius:50%; background:radial-gradient(circle,rgba(59,107,240,.08) 0%,transparent 70%); top:-60px; left:-60px; pointer-events:none; }

  .al-brand { display:flex; align-items:center; gap:10px; font-family:'Manrope',sans-serif; font-size:22px; font-weight:800; color:#fff; text-decoration:none; z-index:1; }
  .al-brand-dot { width:8px; height:8px; background:#3B6BF0; border-radius:50%; }

  .al-left-content { z-index:1; }
  .al-left-badge { display:inline-flex; align-items:center; gap:7px; background:rgba(59,107,240,.15); border:1px solid rgba(59,107,240,.3); border-radius:20px; padding:6px 14px; font-size:12px; color:#7BA4FF; font-weight:600; margin-bottom:20px; }
  .al-left-title { font-family:'Manrope',sans-serif; font-size:clamp(24px,3vw,36px); font-weight:800; color:#fff; line-height:1.2; margin-bottom:14px; }
  .al-left-title span { color:#3B6BF0; }
  .al-left-sub { font-size:14px; color:rgba(255,255,255,.45); line-height:1.7; max-width:360px; }

  .al-features { display:flex; flex-direction:column; gap:12px; z-index:1; }
  .al-feature { display:flex; align-items:center; gap:12px; }
  .al-feature-icon { width:32px; height:32px; border-radius:8px; background:rgba(59,107,240,.15); border:1px solid rgba(59,107,240,.25); display:flex; align-items:center; justify-content:center; color:#7BA4FF; flex-shrink:0; }
  .al-feature-text { font-size:13px; color:rgba(255,255,255,.5); }

  /* RIGHT - form */
  .al-right { background:#fff; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:48px 40px; overflow-y:auto; }
  .al-form-wrap { width:100%; max-width:400px; }

  .al-form-title { font-family:'Manrope',sans-serif; font-size:26px; font-weight:800; color:#1A1A2E; margin-bottom:4px; }
  .al-form-sub { font-size:14px; color:#8888A8; margin-bottom:32px; }

  .al-notice { background:#FFF3CD; border:1px solid #FFDA6A; border-left:3px solid #F4A017; border-radius:8px; padding:10px 14px; font-size:13px; color:#856404; margin-bottom:24px; display:flex; align-items:center; gap:8px; }

  .form-field { margin-bottom:18px; }
  .form-label { display:block; font-size:11px; font-weight:700; letter-spacing:.5px; text-transform:uppercase; color:#8888A8; margin-bottom:7px; }
  .form-input-wrap { position:relative; }
  .form-input-icon { position:absolute; left:13px; top:50%; transform:translateY(-50%); color:#8888A8; pointer-events:none; }
  .form-input { width:100%; background:#F7F8FC; border:1.5px solid #E5E7F0; border-radius:8px; padding:12px 14px 12px 40px; font-family:'Inter',sans-serif; font-size:14px; color:#1A1A2E; outline:none; transition:border .18s,background .18s; }
  .form-input:focus { border-color:#3B6BF0; background:#fff; box-shadow:0 0 0 3px rgba(59,107,240,.08); }
  .form-input.error { border-color:#E63946; }
  .form-input::placeholder { color:#AAAACC; }
  .pw-toggle { position:absolute; right:12px; top:50%; transform:translateY(-50%); background:none; border:none; cursor:pointer; color:#8888A8; display:flex; align-items:center; padding:0; transition:color .18s; }
  .pw-toggle:hover { color:#3B6BF0; }
  .field-error { font-size:12px; color:#E63946; margin-top:4px; display:block; }

  .btn-admin { width:100%; background:#1A1A2E; color:#fff; border:none; border-radius:8px; padding:13px; font-family:'Inter',sans-serif; font-size:14px; font-weight:600; cursor:pointer; transition:all .2s; display:flex; align-items:center; justify-content:center; gap:8px; margin-top:8px; }
  .btn-admin:hover { background:#2A2A3E; transform:translateY(-1px); box-shadow:0 6px 20px rgba(26,26,46,.3); }
  .btn-admin:disabled { opacity:.6; cursor:not-allowed; transform:none; box-shadow:none; }

  @media(max-width:768px){
    .al-root { grid-template-columns:1fr; }
    .al-left { display:none; }
    .al-right { padding:40px 24px; min-height:100vh; }
  }
`;

export default function AdminLogin() {
  const [adminData,     setAdminData]     = useState({ email:"", password:"" });
  const [errors,        setErrors]        = useState({ email:"", password:"" });
  const [showPassword,  setShowPassword]  = useState(false);
  const [submitting,    setSubmitting]    = useState(false);
  const navigate = useNavigate();

  // original redirect logic
  useEffect(() => {
    const storedId = localStorage.getItem('id');
    if (storedId) navigate('/AdminDashboard');
  }, [navigate]);

  // original validation
  const validate = () => {
    const newErrors = { email:"", password:"" };
    if (!adminData.email)                              newErrors.email    = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(adminData.email))   newErrors.email    = "Email format is invalid";
    if (!adminData.password)                           newErrors.password = "Password is required";
    else if (adminData.password.length < 6)            newErrors.password = "Password must be at least 6 characters";
    setErrors(newErrors);
    return Object.values(newErrors).every(e => e === "");
  };

  const onChange = (event) => {
    setAdminData(prev => ({ ...prev, [event.target.name]: event.target.value }));
    setErrors(prev => ({ ...prev, [event.target.name]: "" }));
  };

  // original submit logic
  const submitValue = async (event) => {
    event.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/admin/admin/login`, adminData);
      if (response.data.flag === "1") {
        alert("Admin successfully logged in");
        localStorage.setItem("adminName", response.data.name);
        localStorage.setItem("adminId",   response.data.id);
        window.location.href = "/AdminDashboard";
      } else {
        alert("Invalid email or password");
      }
    } catch (error) {
      console.error("There was an error!", error);
      alert("An error occurred during login");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="al-root">
      <style>{STYLES}</style>

      {/* LEFT PANEL */}
      <div className="al-left">
        <div className="al-brand">
          <Car size={20} color="#3B6BF0"/>
          Roditec<span className="al-brand-dot"/>
        </div>

        <div className="al-left-content">
          <div className="al-left-badge"><Shield size={13}/> Admin Access Only</div>
          <h2 className="al-left-title">Admin<br /><span>Control Panel</span></h2>
          <p className="al-left-sub">
            Manage listings, bookings, payments, users and reports from one centralised dashboard.
          </p>
        </div>

        <div className="al-features">
          {[
            'Manage all car listings & inventory',
            'View and approve user bookings',
            'Process and track all payments',
            'Register users & manage accounts',
            'Generate reports in KSH',
          ].map((f, i) => (
            <div key={i} className="al-feature">
              <div className="al-feature-icon"><Shield size={13}/></div>
              <div className="al-feature-text">{f}</div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="al-right">
        <div className="al-form-wrap">
          <div className="al-form-title">Admin Sign In</div>
          <div className="al-form-sub">Enter your admin credentials to continue</div>

          <div className="al-notice">
            ⚠️ This portal is restricted to authorised administrators only.
          </div>

          <form onSubmit={submitValue} noValidate>
            {/* Email */}
            <div className="form-field">
              <label className="form-label">Admin Email</label>
              <div className="form-input-wrap">
                <Mail size={15} className="form-input-icon"/>
                <input
                  type="text" name="email"
                  placeholder="admin@roditec.co.ke"
                  onChange={onChange}
                  className={`form-input${errors.email ? ' error' : ''}`}
                />
              </div>
              {errors.email && <span className="field-error">{errors.email}</span>}
            </div>

            {/* Password */}
            <div className="form-field">
              <label className="form-label">Password</label>
              <div className="form-input-wrap">
                <Lock size={15} className="form-input-icon"/>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  onChange={onChange}
                  className={`form-input${errors.password ? ' error' : ''}`}
                  style={{ paddingRight: 42 }}
                />
                <button type="button" className="pw-toggle" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={16}/> : <Eye size={16}/>}
                </button>
              </div>
              {errors.password && <span className="field-error">{errors.password}</span>}
            </div>

            <button type="submit" className="btn-admin" disabled={submitting}>
              <Shield size={15}/>
              {submitting ? 'Signing in…' : 'Sign In as Admin'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}