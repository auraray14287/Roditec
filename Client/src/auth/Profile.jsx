import axios from "axios";
import React, { useEffect, useState } from "react";
import API_BASE_URL from '../config/apiConfig';
import { Link } from "react-router-dom";
import { User, Mail, Phone, Calendar, ArrowLeft, CheckCircle } from "lucide-react";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@600;700;800&family=Inter:wght@400;500;600&display=swap');
  .profile-root { min-height:100vh; background:#F7F8FC; font-family:'Inter',sans-serif; padding:100px 24px 60px; }
  .profile-inner { max-width:640px; margin:0 auto; }
  .profile-back { display:inline-flex; align-items:center; gap:6px; font-size:13px; color:#8888A8; text-decoration:none; background:none; border:none; cursor:pointer; font-family:'Inter',sans-serif; margin-bottom:24px; transition:color .18s; padding:0; }
  .profile-back:hover { color:#3B6BF0; }
  .profile-card { background:#fff; border:1px solid #E5E7F0; border-radius:12px; overflow:hidden; box-shadow:0 2px 12px rgba(0,0,0,.05); }
  .profile-card-header { background:linear-gradient(135deg,#3B6BF0,#2040C0); padding:32px; display:flex; align-items:center; gap:20px; }
  .profile-avatar { width:68px; height:68px; border-radius:50%; background:rgba(255,255,255,.2); border:3px solid rgba(255,255,255,.4); display:flex; align-items:center; justify-content:center; font-family:'Manrope',sans-serif; font-weight:800; font-size:26px; color:#fff; flex-shrink:0; }
  .profile-header-name { font-family:'Manrope',sans-serif; font-size:20px; font-weight:700; color:#fff; }
  .profile-header-meta { font-size:12px; color:rgba(255,255,255,.65); margin-top:4px; }
  .profile-meta-row { display:flex; gap:16px; flex-wrap:wrap; margin-top:8px; }
  .profile-meta-item { display:flex; align-items:center; gap:5px; font-size:12px; color:rgba(255,255,255,.65); }
  .profile-body { padding:32px; }
  .profile-section-title { font-size:11px; font-weight:700; letter-spacing:.8px; text-transform:uppercase; color:#8888A8; margin-bottom:16px; padding-bottom:10px; border-bottom:1px solid #E5E7F0; }
  .profile-id-field { background:#F7F8FC; border:1px solid #E5E7F0; border-radius:8px; padding:11px 14px; font-size:13px; color:#8888A8; margin-bottom:20px; display:flex; align-items:center; gap:8px; }
  .profile-id-label { font-size:10px; font-weight:700; letter-spacing:.5px; text-transform:uppercase; color:#8888A8; margin-bottom:3px; }
  .profile-id-val { font-size:13px; color:#4A4A68; font-family:'monospace'; }
  .form-field { margin-bottom:18px; }
  .form-label { display:block; font-size:11px; font-weight:700; letter-spacing:.5px; text-transform:uppercase; color:#8888A8; margin-bottom:7px; }
  .form-input-wrap { position:relative; }
  .form-input-icon { position:absolute; left:13px; top:50%; transform:translateY(-50%); color:#8888A8; pointer-events:none; }
  .form-input { width:100%; background:#F7F8FC; border:1.5px solid #E5E7F0; border-radius:8px; padding:11px 14px 11px 40px; font-family:'Inter',sans-serif; font-size:14px; color:#1A1A2E; outline:none; transition:border .18s,background .18s; }
  .form-input:focus { border-color:#3B6BF0; background:#fff; box-shadow:0 0 0 3px rgba(59,107,240,.08); }
  .form-input::placeholder { color:#AAAACC; }
  .btn-update { width:100%; background:#3B6BF0; color:#fff; border:none; border-radius:8px; padding:13px; font-family:'Inter',sans-serif; font-size:14px; font-weight:600; cursor:pointer; transition:all .2s; display:flex; align-items:center; justify-content:center; gap:8px; margin-top:8px; }
  .btn-update:hover { background:#2952CC; transform:translateY(-1px); box-shadow:0 6px 20px rgba(59,107,240,.25); }
  .profile-dates { display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:24px; }
  .date-box { background:#F7F8FC; border:1px solid #E5E7F0; border-radius:8px; padding:12px; }
  .date-box-label { font-size:10px; font-weight:700; letter-spacing:.5px; text-transform:uppercase; color:#8888A8; margin-bottom:4px; }
  .date-box-val { font-size:13px; color:#1A1A2E; font-weight:500; }
  @media(max-width:480px){.profile-dates{grid-template-columns:1fr;}}
`;

function Profile() {
  const [mydata, setData] = useState({ name:'', email:'', mobile:'', createdAt:'', lastLogin:'' });
  const [id,     setId]   = useState('');

  // original fetch logic
  useEffect(() => {
    const storedId = localStorage.getItem('id');
    if (storedId) {
      setId(storedId);
      axios.get(`${API_BASE_URL}/get-profile`, { params: { id: storedId } })
        .then((response) => {
          const userData = response.data;
          if (userData) {
            setData({
              name:      userData.name      || '',
              email:     userData.email     || '',
              mobile:    userData.mobile    || '',
              createdAt: formatDate(userData.createdAt),
              lastLogin: formatDate(userData.lastLogin),
            });
          }
        })
        .catch((error) => console.error('Error fetching profile data', error));
    }
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleString();
  };

  const onChange = (event) => {
    setData(prev => ({ ...prev, [event.target.name]: event.target.value }));
  };

  // original submit logic
  const submitValue = (event) => {
    event.preventDefault();
    const data = { id, name: mydata.name, email: mydata.email, mobile: mydata.mobile };
    axios.post(`${API_BASE_URL}/update-profile`, data)
      .then((response) => {
        if (response.data.flag === "1") {
          alert(response.data.message);
          window.location = "/Dashboard";
        } else {
          alert(response.data.message);
        }
      })
      .catch((error) => console.error('There was an error!', error));
  };

  return (
    <div className="profile-root">
      <style>{STYLES}</style>
      <div className="profile-inner">

        <Link to="/Dashboard" className="profile-back">
          <ArrowLeft size={14}/> Back to Dashboard
        </Link>

        <div className="profile-card">
          {/* Header */}
          <div className="profile-card-header">
            <div className="profile-avatar">{mydata.name?.[0]?.toUpperCase() || 'U'}</div>
            <div>
              <div className="profile-header-name">{mydata.name || 'Your Profile'}</div>
              <div class="profile-meta-row">
                {mydata.email  && <div className="profile-meta-item"><Mail size={11}/>{mydata.email}</div>}
                {mydata.mobile && <div className="profile-meta-item"><Phone size={11}/>{mydata.mobile}</div>}
              </div>
            </div>
          </div>

          <div className="profile-body">
            {/* Dates */}
            {(mydata.createdAt || mydata.lastLogin) && (
              <div className="profile-dates">
                {mydata.createdAt && (
                  <div className="date-box">
                    <div className="date-box-label">Member Since</div>
                    <div className="date-box-val">{mydata.createdAt}</div>
                  </div>
                )}
                {mydata.lastLogin && (
                  <div className="date-box">
                    <div className="date-box-label">Last Login</div>
                    <div className="date-box-val">{mydata.lastLogin}</div>
                  </div>
                )}
              </div>
            )}

            <div className="profile-section-title">Edit Profile</div>

            {/* ID (read-only display) */}
            <div className="profile-id-field">
              <div>
                <div className="profile-id-label">User ID</div>
                <div className="profile-id-val">{id || '—'}</div>
              </div>
            </div>

            <form onSubmit={submitValue} noValidate>
              <div className="form-field">
                <label className="form-label">Full Name</label>
                <div className="form-input-wrap">
                  <User size={15} className="form-input-icon"/>
                  <input type="text" name="name" placeholder="Your name" value={mydata.name} onChange={onChange} className="form-input"/>
                </div>
              </div>
              <div className="form-field">
                <label className="form-label">Email Address</label>
                <div className="form-input-wrap">
                  <Mail size={15} className="form-input-icon"/>
                  <input type="text" name="email" placeholder="your@email.com" value={mydata.email} onChange={onChange} className="form-input"/>
                </div>
              </div>
              <div className="form-field">
                <label className="form-label">Mobile Number</label>
                <div className="form-input-wrap">
                  <Phone size={15} className="form-input-icon"/>
                  <input type="number" name="mobile" placeholder="+254 7XX XXX XXX" value={mydata.mobile} onChange={onChange} className="form-input"/>
                </div>
              </div>
              <button type="submit" className="btn-update">
                <CheckCircle size={15}/> Save Changes
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;