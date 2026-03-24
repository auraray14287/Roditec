import axios from "axios";
import React, { useEffect, useState } from "react";
import API_BASE_URL from '../config/apiConfig';
import { Link } from "react-router-dom";
import { Lock, Eye, EyeOff, ArrowLeft, ShieldCheck } from "lucide-react";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@600;700;800&family=Inter:wght@400;500;600&display=swap');
  .cp-root { min-height:100vh; background:#F7F8FC; font-family:'Inter',sans-serif; padding:100px 24px 60px; display:flex; flex-direction:column; align-items:center; justify-content:center; }
  .cp-back { display:inline-flex; align-items:center; gap:6px; font-size:13px; color:#8888A8; text-decoration:none; background:none; border:none; cursor:pointer; font-family:'Inter',sans-serif; margin-bottom:24px; align-self:flex-start; transition:color .18s; padding:0; max-width:560px; width:100%; }
  .cp-back:hover { color:#3B6BF0; }
  .cp-wrap { width:100%; max-width:480px; }
  .cp-card { background:#fff; border:1px solid #E5E7F0; border-radius:12px; overflow:hidden; box-shadow:0 2px 12px rgba(0,0,0,.05); }
  .cp-card-top { background:linear-gradient(135deg,#1A1A2E,#2A2A4E); padding:28px 32px; display:flex; align-items:center; gap:16px; }
  .cp-card-top-icon { width:48px; height:48px; border-radius:12px; background:rgba(59,107,240,.2); border:1px solid rgba(59,107,240,.3); display:flex; align-items:center; justify-content:center; color:#7BA4FF; flex-shrink:0; }
  .cp-card-top-title { font-family:'Manrope',sans-serif; font-size:20px; font-weight:700; color:#fff; }
  .cp-card-top-sub { font-size:12px; color:rgba(255,255,255,.5); margin-top:3px; }
  .cp-body { padding:28px 32px; }
  .cp-id-box { background:#F7F8FC; border:1px solid #E5E7F0; border-radius:8px; padding:10px 14px; margin-bottom:24px; display:flex; align-items:center; gap:10px; }
  .cp-id-label { font-size:10px; font-weight:700; letter-spacing:.5px; text-transform:uppercase; color:#8888A8; margin-bottom:2px; }
  .cp-id-val { font-size:13px; color:#4A4A68; font-family:monospace; }
  .form-field { margin-bottom:18px; }
  .form-label { display:block; font-size:11px; font-weight:700; letter-spacing:.5px; text-transform:uppercase; color:#8888A8; margin-bottom:7px; }
  .pw-wrap { position:relative; }
  .pw-icon { position:absolute; left:13px; top:50%; transform:translateY(-50%); color:#8888A8; pointer-events:none; }
  .form-input { width:100%; background:#F7F8FC; border:1.5px solid #E5E7F0; border-radius:8px; padding:11px 42px; font-family:'Inter',sans-serif; font-size:14px; color:#1A1A2E; outline:none; transition:border .18s,background .18s; }
  .form-input:focus { border-color:#3B6BF0; background:#fff; box-shadow:0 0 0 3px rgba(59,107,240,.08); }
  .form-input::placeholder { color:#AAAACC; }
  .pw-toggle { position:absolute; right:12px; top:50%; transform:translateY(-50%); background:none; border:none; cursor:pointer; color:#8888A8; display:flex; align-items:center; padding:0; transition:color .18s; }
  .pw-toggle:hover { color:#3B6BF0; }
  .cp-rules { background:#EEF2FF; border:1px solid rgba(59,107,240,.15); border-radius:8px; padding:12px 14px; margin-bottom:20px; }
  .cp-rules-title { font-size:11px; font-weight:700; color:#3B6BF0; margin-bottom:8px; }
  .cp-rule { font-size:12px; color:#4A4A68; margin-bottom:4px; display:flex; align-items:center; gap:6px; }
  .cp-rule::before { content:'•'; color:#3B6BF0; }
  .btn-change { width:100%; background:#3B6BF0; color:#fff; border:none; border-radius:8px; padding:13px; font-family:'Inter',sans-serif; font-size:14px; font-weight:600; cursor:pointer; transition:all .2s; display:flex; align-items:center; justify-content:center; gap:8px; }
  .btn-change:hover { background:#2952CC; transform:translateY(-1px); box-shadow:0 6px 20px rgba(59,107,240,.25); }
`;

function ChangePassword() {
  const [mydata, setData]       = useState({});
  const [id,     setId]         = useState('');
  const [show,   setShow]       = useState({ old:false, new:false, confirm:false });

  // original logic
  useEffect(() => {
    const storedId = localStorage.getItem('id');
    if (storedId) setId(storedId);
  }, []);

  const onChange = (event) => {
    setData(prev => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const submitValue = (event) => {
    event.preventDefault();
    const data = { id, opass: mydata.password, npass: mydata.npassword, cpass: mydata.cpassword };
    axios.post(`${API_BASE_URL}/change-password`, data)
      .then((response) => {
        if (response.data.flag === "1") {
          alert(response.data.message);
          window.location = '/Dashboard';
        } else {
          alert(response.data.message);
        }
      })
      .catch((error) => console.error('There was an error!', error));
  };

  const PwField = ({ name, label, showKey, placeholder }) => (
    <div className="form-field">
      <label className="form-label">{label}</label>
      <div className="pw-wrap">
        <Lock size={15} className="pw-icon"/>
        <input
          type={show[showKey] ? 'text' : 'password'}
          name={name}
          placeholder={placeholder}
          onChange={onChange}
          className="form-input"
        />
        <button type="button" className="pw-toggle" onClick={() => setShow(p => ({...p,[showKey]:!p[showKey]}))}>
          {show[showKey] ? <EyeOff size={16}/> : <Eye size={16}/>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="cp-root">
      <style>{STYLES}</style>
      <div className="cp-wrap">
        <Link to="/Dashboard" className="cp-back"><ArrowLeft size={14}/> Back to Dashboard</Link>

        <div className="cp-card">
          <div className="cp-card-top">
            <div className="cp-card-top-icon"><ShieldCheck size={22}/></div>
            <div>
              <div className="cp-card-top-title">Change Password</div>
              <div className="cp-card-top-sub">Keep your account secure</div>
            </div>
          </div>

          <div className="cp-body">
            {/* ID display */}
            <div className="cp-id-box">
              <div>
                <div className="cp-id-label">User ID</div>
                <div className="cp-id-val">{id || '—'}</div>
              </div>
            </div>

            {/* Rules hint */}
            <div className="cp-rules">
              <div className="cp-rules-title">Password requirements</div>
              <div className="cp-rule">At least 6 characters long</div>
              <div className="cp-rule">New password must differ from the old one</div>
              <div className="cp-rule">Confirm password must match the new one</div>
            </div>

            <form onSubmit={submitValue} noValidate>
              <PwField name="password"  label="Current Password" showKey="old"     placeholder="Enter your current password"/>
              <PwField name="npassword" label="New Password"      showKey="new"     placeholder="Enter new password"/>
              <PwField name="cpassword" label="Confirm Password"  showKey="confirm" placeholder="Confirm new password"/>
              <button type="submit" className="btn-change">
                <ShieldCheck size={15}/> Update Password
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChangePassword;