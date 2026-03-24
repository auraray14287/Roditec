import React, { useEffect, useState } from "react";
import UserAuth from "./UserAuth";
import { Link } from "react-router-dom";
import { Clock, Key, LogOut, User, Calendar, X, Car } from "lucide-react";
import API_BASE_URL from '../config/apiConfig';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@600;700;800&family=Inter:wght@400;500;600&display=swap');
  .dash-root { min-height:100vh; background:#F7F8FC; font-family:'Inter',sans-serif; padding:100px 24px 60px; }
  .dash-inner { max-width:900px; margin:0 auto; }
  .dash-header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:32px; flex-wrap:wrap; gap:16px; }
  .dash-greeting { font-family:'Manrope',sans-serif; font-size:clamp(22px,4vw,34px); font-weight:800; color:#1A1A2E; line-height:1.15; }
  .dash-greeting span { color:#3B6BF0; }
  .dash-date { font-size:13px; color:#8888A8; margin-top:6px; }
  .dash-last-login { display:inline-flex; align-items:center; gap:6px; background:#EEF2FF; border:1px solid rgba(59,107,240,.15); border-radius:20px; padding:5px 12px; font-size:12px; color:#3B6BF0; font-weight:500; margin-top:10px; }
  .dash-avatar { width:54px; height:54px; border-radius:50%; background:linear-gradient(135deg,#3B6BF0,#2040C0); display:flex; align-items:center; justify-content:center; font-family:'Manrope',sans-serif; font-weight:800; font-size:20px; color:#fff; flex-shrink:0; border:3px solid rgba(59,107,240,.2); }
  .dash-grid { display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:16px; }
  @media(max-width:560px){.dash-grid{grid-template-columns:1fr;}}
  .dash-card { background:#fff; border:1px solid #E5E7F0; border-radius:12px; padding:18px 20px; display:flex; align-items:center; gap:14px; text-decoration:none; color:inherit; transition:all .2s; cursor:pointer; width:100%; font-family:'Inter',sans-serif; text-align:left; }
  .dash-card:hover { border-color:#3B6BF0; box-shadow:0 4px 20px rgba(59,107,240,.1); transform:translateY(-2px); }
  .dash-card-icon { width:42px; height:42px; border-radius:10px; background:#EEF2FF; display:flex; align-items:center; justify-content:center; color:#3B6BF0; flex-shrink:0; transition:all .2s; }
  .dash-card:hover .dash-card-icon { background:#3B6BF0; color:#fff; }
  .dash-card-title { font-size:14px; font-weight:600; color:#1A1A2E; margin-bottom:2px; }
  .dash-card-sub { font-size:12px; color:#8888A8; }
  .dash-card-arrow { margin-left:auto; color:#D0D5E8; font-size:18px; transition:all .2s; flex-shrink:0; }
  .dash-card:hover .dash-card-arrow { color:#3B6BF0; transform:translateX(3px); }
  .dash-logout { width:100%; background:#1A1A2E; color:#fff; border:none; border-radius:12px; padding:15px; font-family:'Inter',sans-serif; font-size:14px; font-weight:600; cursor:pointer; transition:all .2s; display:flex; align-items:center; justify-content:center; gap:8px; }
  .dash-logout:hover { background:#2A2A3E; transform:translateY(-1px); box-shadow:0 4px 16px rgba(26,26,46,.25); }
  .modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,.5); backdrop-filter:blur(4px); display:flex; align-items:center; justify-content:center; z-index:1000; padding:24px; }
  .modal-box { background:#fff; border-radius:14px; width:100%; max-width:540px; max-height:82vh; overflow-y:auto; box-shadow:0 20px 60px rgba(0,0,0,.15); }
  .modal-box::-webkit-scrollbar{width:4px;} .modal-box::-webkit-scrollbar-thumb{background:#E5E7F0;border-radius:2px;}
  .modal-header { display:flex; justify-content:space-between; align-items:center; padding:18px 24px; border-bottom:1px solid #E5E7F0; position:sticky; top:0; background:#fff; border-radius:14px 14px 0 0; z-index:1; }
  .modal-title { font-family:'Manrope',sans-serif; font-size:17px; font-weight:700; color:#1A1A2E; }
  .modal-close { width:30px; height:30px; border-radius:7px; border:1px solid #E5E7F0; background:#F7F8FC; display:flex; align-items:center; justify-content:center; cursor:pointer; color:#8888A8; transition:all .18s; }
  .modal-close:hover { background:#FEF2F2; color:#E63946; }
  .modal-body { padding:18px 24px; }
  .booking-item { background:#F7F8FC; border:1px solid #E5E7F0; border-radius:10px; padding:16px; margin-bottom:12px; }
  .booking-item:last-child{margin-bottom:0;}
  .booking-id { font-family:'Manrope',sans-serif; font-size:13px; font-weight:700; color:#1A1A2E; margin-bottom:10px; }
  .booking-row { display:flex; justify-content:space-between; align-items:center; font-size:12px; margin-bottom:5px; }
  .b-lbl { color:#8888A8; } .b-val { color:#1A1A2E; font-weight:500; }
  .b-divider { height:1px; background:#E5E7F0; margin:9px 0; }
  .s-pill { display:inline-flex; align-items:center; gap:4px; padding:3px 10px; border-radius:20px; font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:.4px; }
  .s-confirmed{background:#D1E7DD;color:#0A5C36;} .s-paid{background:#CFE2FF;color:#084298;} .s-pending{background:#FFF3CD;color:#856404;} .s-default{background:#E2E3E5;color:#41464B;}
  .loading-row { display:flex; align-items:center; justify-content:center; gap:10px; padding:40px 0; font-size:13px; color:#8888A8; }
  .spinner { width:18px; height:18px; border:2px solid #E5E7F0; border-top-color:#3B6BF0; border-radius:50%; animation:spin .7s linear infinite; }
  @keyframes spin{to{transform:rotate(360deg);}}
  .empty-state { text-align:center; padding:48px 24px; }
  .empty-icon { font-size:44px; margin-bottom:12px; opacity:.4; }
  .empty-text { font-size:13px; color:#8888A8; }
`;

function Dashboard() {
  const [name,         setName]         = useState("");
  const [greeting,     setGreeting]     = useState("");
  const [lastLogin,    setLastLogin]    = useState("");
  const [bookings,     setBookings]     = useState([]);
  const [showBookings, setShowBookings] = useState(false);
  const [isLoading,    setIsLoading]    = useState(false);

  function logout() { localStorage.clear(); window.location = "login"; alert("You have been logged out!"); }
  function toTitleCase(str) { return str.toLowerCase().replace(/\b\w/g, c => c.toUpperCase()); }
  const formatDate = (d) => { if (!d) return ""; return new Intl.DateTimeFormat("en-US", { year:"numeric",month:"long",day:"numeric",hour:"2-digit",minute:"2-digit" }).format(new Date(d)); };
  const getGreeting = () => { const h = new Date().getHours(); return h<12?"Good Morning":h<18?"Good Afternoon":"Good Evening"; };

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const userId = localStorage.getItem("id");
      const res = await fetch(`${API_BASE_URL}/api/uid/booking?user_id=${userId}`);
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setBookings(data.map(b => ({
        ...b,
        total_price: b.total_price?.$numberDecimal || b.total_price,
        paid_price:  b.paid_price?.$numberDecimal  || b.paid_price,
        payment: b.payment ? { ...b.payment, amount: b.payment.amount?.$numberDecimal || b.payment.amount } : null,
      })));
    } catch (e) { console.error(e); }
    finally { setIsLoading(false); }
  };

  useEffect(() => {
    const n = localStorage.getItem("name");
    const l = localStorage.getItem("lastLogin");
    if (n) setName(toTitleCase(n));
    if (l) setLastLogin(formatDate(l));
    setGreeting(getGreeting());
    const iv = setInterval(() => setGreeting(getGreeting()), 60000);
    return () => clearInterval(iv);
  }, []);

  const sPill = (v) => { if (!v) return 's-default'; const s=v.toLowerCase(); if(s==='confirmed'||s==='success') return 's-confirmed'; if(s==='paid') return 's-paid'; if(s==='pending') return 's-pending'; return 's-default'; };

  return (
    <div className="dash-root">
      <style>{STYLES}</style>
      <div className="dash-inner">

        {/* HEADER */}
        <div className="dash-header">
          <div>
            <h1 className="dash-greeting">{greeting},<br /><span>{name||'Welcome'}</span></h1>
            <div className="dash-date">{new Date().toLocaleDateString('en-KE',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}</div>
            {lastLogin && <div className="dash-last-login"><Clock size={11}/> Last login: {lastLogin}</div>}
          </div>
          <div className="dash-avatar">{name?.[0]?.toUpperCase()||'U'}</div>
        </div>

        {/* ACTIONS */}
        <div className="dash-grid">
          <Link to="/Profile" className="dash-card">
            <div className="dash-card-icon"><User size={19}/></div>
            <div><div className="dash-card-title">Your Profile</div><div className="dash-card-sub">View and edit your information</div></div>
            <div className="dash-card-arrow">›</div>
          </Link>
          <Link to="/ChangePassword" className="dash-card">
            <div className="dash-card-icon"><Key size={19}/></div>
            <div><div className="dash-card-title">Change Password</div><div className="dash-card-sub">Update your security settings</div></div>
            <div className="dash-card-arrow">›</div>
          </Link>
          <button className="dash-card" onClick={() => { if(!showBookings) fetchBookings(); setShowBookings(true); }}>
            <div className="dash-card-icon"><Calendar size={19}/></div>
            <div><div className="dash-card-title">My Bookings</div><div className="dash-card-sub">View bookings and payments</div></div>
            <div className="dash-card-arrow">›</div>
          </button>
          <Link to="/CarExplore" className="dash-card">
            <div className="dash-card-icon"><Car size={19}/></div>
            <div><div className="dash-card-title">Browse Cars</div><div className="dash-card-sub">Find your next vehicle</div></div>
            <div className="dash-card-arrow">›</div>
          </Link>
        </div>

        <button className="dash-logout" onClick={logout}><LogOut size={15}/> Sign Out</button>
      </div>

      {/* BOOKINGS MODAL */}
      {showBookings && (
        <div className="modal-overlay" onClick={e => e.target===e.currentTarget && setShowBookings(false)}>
          <div className="modal-box">
            <div className="modal-header">
              <div className="modal-title">My Bookings</div>
              <button className="modal-close" onClick={() => setShowBookings(false)}><X size={15}/></button>
            </div>
            <div className="modal-body">
              {isLoading ? (
                <div className="loading-row"><div className="spinner"/> Loading bookings…</div>
              ) : bookings.length > 0 ? bookings.map((b,i) => (
                <div key={i} className="booking-item">
                  <div className="booking-id">Booking #{b.booking_id}</div>
                  <div className="booking-row"><span className="b-lbl">Transaction ID</span><span className="b-val" style={{fontFamily:'monospace',fontSize:11}}>{b.transaction_id}</span></div>
                  <div className="booking-row"><span className="b-lbl">Date</span><span className="b-val">{formatDate(b.booking_start_date)}</span></div>
                  <div className="b-divider"/>
                  <div className="booking-row"><span className="b-lbl">Booking Status</span><span className={`s-pill ${sPill(b.booking_status)}`}>{b.booking_status||'—'}</span></div>
                  <div className="booking-row"><span className="b-lbl">Payment Status</span><span className={`s-pill ${sPill(b.payment_status)}`}>{b.payment_status||'—'}</span></div>
                  <div className="b-divider"/>
                  <div className="booking-row"><span className="b-lbl">Total Amount</span><span className="b-val" style={{fontFamily:'Manrope,sans-serif',fontWeight:700}}>KSH {Number(b.total_price).toLocaleString()}</span></div>
                  <div className="booking-row"><span className="b-lbl">Amount Paid</span><span className="b-val" style={{color:'#2D9C5A',fontWeight:600}}>KSH {Number(b.paid_price).toLocaleString()}</span></div>
                  {b.payment && (<>
                    <div className="b-divider"/>
                    <div style={{fontSize:10,fontWeight:700,color:'#8888A8',textTransform:'uppercase',letterSpacing:'.5px',marginBottom:7}}>Payment Details</div>
                    <div className="booking-row"><span className="b-lbl">Amount</span><span className="b-val">KSH {Number(b.payment.amount).toLocaleString()}</span></div>
                    <div className="booking-row"><span className="b-lbl">Status</span><span className={`s-pill ${sPill(b.payment.status)}`}>{b.payment.status||'—'}</span></div>
                  </>)}
                </div>
              )) : (
                <div className="empty-state"><div className="empty-icon">📋</div><div className="empty-text">No bookings found</div></div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserAuth(Dashboard);