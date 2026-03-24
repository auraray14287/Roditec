import { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import {
  Car, Users, CreditCard, BookOpen, TrendingUp, TrendingDown,
  ArrowRight, Clock, Eye
} from 'lucide-react';
import { Link } from 'react-router-dom';
import API_BASE_URL from '../config/apiConfig';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@600;700;800&family=Inter:wght@400;500;600&display=swap');

  .adash-root { font-family:'Inter',sans-serif; color:#1A1A2E; }

  .adash-greeting { font-family:'Manrope',sans-serif; font-size:clamp(20px,3vw,28px); font-weight:800; color:#1A1A2E; margin-bottom:4px; }
  .adash-greeting span { color:#3B6BF0; }
  .adash-sub { font-size:13px; color:#8888A8; margin-bottom:28px; }

  /* KPI */
  .kpi-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(200px,1fr)); gap:16px; margin-bottom:24px; }
  .kpi-card { background:#fff; border:1px solid #E5E7F0; border-radius:12px; padding:20px; transition:all .2s; }
  .kpi-card:hover { box-shadow:0 4px 20px rgba(59,107,240,.1); border-color:rgba(59,107,240,.3); transform:translateY(-2px); }
  .kpi-top { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:16px; }
  .kpi-icon { width:42px; height:42px; border-radius:10px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
  .kpi-trend { display:flex; align-items:center; gap:4px; font-size:12px; font-weight:600; padding:3px 8px; border-radius:6px; }
  .kpi-trend.up   { color:#2D9C5A; background:#D1E7DD; }
  .kpi-trend.down { color:#E63946; background:#F8D7DA; }
  .kpi-value { font-family:'Manrope',sans-serif; font-weight:800; font-size:28px; color:#1A1A2E; line-height:1; margin-bottom:4px; letter-spacing:-1px; }
  .kpi-label { font-size:12px; color:#8888A8; font-weight:500; }

  /* QUICK ACTIONS */
  .qa-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(170px,1fr)); gap:12px; margin-bottom:24px; }
  .qa-card { background:#fff; border:1px solid #E5E7F0; border-radius:10px; padding:16px; display:flex; align-items:center; gap:12px; text-decoration:none; color:inherit; transition:all .2s; cursor:pointer; }
  .qa-card:hover { border-color:#3B6BF0; box-shadow:0 4px 16px rgba(59,107,240,.1); transform:translateY(-1px); }
  .qa-icon { width:36px; height:36px; border-radius:8px; display:flex; align-items:center; justify-content:center; flex-shrink:0; transition:all .18s; }
  .qa-card:hover .qa-icon { filter:brightness(1.1); }
  .qa-label { font-size:13px; font-weight:600; color:#1A1A2E; }
  .qa-sub { font-size:11px; color:#8888A8; margin-top:1px; }

  /* PANEL */
  .panel-row { display:grid; grid-template-columns:1fr 1fr; gap:20px; margin-bottom:20px; }
  @media(max-width:1100px){ .panel-row { grid-template-columns:1fr; } }
  .panel { background:#fff; border:1px solid #E5E7F0; border-radius:12px; overflow:hidden; }
  .panel-header { display:flex; justify-content:space-between; align-items:center; padding:16px 20px; border-bottom:1px solid #E5E7F0; }
  .panel-title { font-family:'Manrope',sans-serif; font-weight:700; font-size:14px; color:#1A1A2E; }
  .panel-meta { font-size:12px; color:#8888A8; }
  .panel-link { display:flex; align-items:center; gap:4px; font-size:12px; font-weight:600; color:#3B6BF0; text-decoration:none; }
  .panel-link:hover { text-decoration:underline; }

  /* TABLE */
  .table-wrap { overflow-x:auto; }
  table { width:100%; border-collapse:collapse; }
  thead th { padding:10px 16px; text-align:left; font-size:10px; font-weight:700; letter-spacing:.8px; text-transform:uppercase; color:#8888A8; background:#F7F8FC; white-space:nowrap; border-bottom:1px solid #E5E7F0; }
  tbody tr { border-top:1px solid #F0F0F8; transition:background .15s; }
  tbody tr:hover { background:#F7F8FC; }
  td { padding:12px 16px; font-size:13px; color:#1A1A2E; white-space:nowrap; }
  .cell-primary { font-weight:600; color:#1A1A2E; }
  .cell-muted { font-size:11px; color:#8888A8; margin-top:2px; }
  .td-empty { text-align:center; padding:40px; color:#8888A8; font-size:13px; }

  .s-pill { display:inline-flex; align-items:center; gap:4px; padding:3px 10px; border-radius:20px; font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:.4px; }
  .s-pill.active,.s-pill.completed { background:#D1E7DD; color:#0A5C36; }
  .s-pill.pending { background:#FFF3CD; color:#856404; }
  .s-pill.confirmed { background:#CFE2FF; color:#084298; }
  .s-pill.inactive,.s-pill.cancelled { background:#F8D7DA; color:#842029; }
  .s-pill-dot { width:5px; height:5px; border-radius:50%; background:currentColor; }

  /* BAR CHART */
  .bar-chart-wrap { padding:20px; }
  .bar-group { display:flex; align-items:flex-end; gap:5px; height:120px; margin-bottom:8px; }
  .bar-item { flex:1; display:flex; flex-direction:column; align-items:center; gap:4px; height:100%; justify-content:flex-end; }
  .bar { width:100%; border-radius:4px 4px 0 0; background:#EEF2FF; border-top:2px solid #C7D7FA; transition:all .4s; }
  .bar.highlight { background:#BFCFFE; border-color:#3B6BF0; }
  .bar-lbl { font-size:10px; color:#8888A8; font-weight:500; }

  /* SKELETON */
  .skeleton { background:linear-gradient(90deg,#f0f2f8 25%,#e6eaf6 50%,#f0f2f8 75%); background-size:200% 100%; animation:shimmer 1.5s infinite; border-radius:6px; }
  @keyframes shimmer { from{background-position:200% 0} to{background-position:-200% 0} }
`;

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export default function AdminDashboard() {
  const [stats,          setStats]          = useState(null);
  const [recentCars,     setRecentCars]     = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading,        setLoading]        = useState(true);
  const adminName = localStorage.getItem('adminName') || 'Admin';

  const chartData = [42,67,55,80,61,95,78,110,88,102,93,120];
  const maxChart  = Math.max(...chartData);

  // ── original fetch logic ──
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [carsRes, usersRes, bookingsRes, paymentsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/listings/listings`).catch(() => ({ json: () => [] })),
          fetch(`${API_BASE_URL}/api/users/users`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }).catch(() => ({ json: () => [] })),
          fetch(`${API_BASE_URL}/api/bookings/bookings`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }).catch(() => ({ json: () => [] })),
          fetch(`${API_BASE_URL}/api/payments/payments`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }).catch(() => ({ json: () => [] })),
        ]);
        const [cars, users, bookings, payments] = await Promise.all([
          carsRes.json().catch(()=>[]),
          usersRes.json().catch(()=>[]),
          bookingsRes.json().catch(()=>[]),
          paymentsRes.json().catch(()=>[]),
        ]);

        const totalRevenue = (Array.isArray(payments) ? payments : [])
          .filter(p => p.payment_status === 'Completed')
          .reduce((sum, p) => sum + parseFloat(p.amount?.$numberDecimal || p.amount || 0), 0);

        setStats({
          totalCars:       Array.isArray(cars)     ? cars.length     : 0,
          activeCars:      Array.isArray(cars)     ? cars.filter(c => c.listing_status === 'active').length : 0,
          totalUsers:      Array.isArray(users)    ? users.length    : 0,
          totalBookings:   Array.isArray(bookings) ? bookings.length : 0,
          pendingBookings: Array.isArray(bookings) ? bookings.filter(b => b.booking_status === 'Pending').length : 0,
          totalRevenue,
        });
        setRecentCars(Array.isArray(cars)     ? cars.slice(0,5)     : []);
        setRecentBookings(Array.isArray(bookings) ? bookings.slice(0,5) : []);
      } catch (e) {
        console.error(e);
        setStats({ totalCars:0, activeCars:0, totalUsers:0, totalBookings:0, pendingBookings:0, totalRevenue:0 });
      } finally { setLoading(false); }
    };
    fetchData();
  }, []);

  // KSH revenue — fixed formatting
  const fmtRevenue = (v) => {
    if (v >= 1_000_000) return `KSH ${(v/1_000_000).toFixed(1)}M`;
    if (v >= 1_000)     return `KSH ${Math.round(v/1_000)}K`;
    return `KSH ${Math.round(v).toLocaleString()}`;
  };

  const KPI_CARDS = [
    { label:'Total Listings',  value: stats?.totalCars      ?? '—', icon:Car,      color:'#3B6BF0', bg:'#EEF2FF', trend:'+12%', up:true  },
    { label:'Active Listings', value: stats?.activeCars     ?? '—', icon:Eye,      color:'#2D9C5A', bg:'#D1E7DD', trend:'+8%',  up:true  },
    { label:'Total Users',     value: stats?.totalUsers     ?? '—', icon:Users,    color:'#0A6EBD', bg:'#CFE2FF', trend:'+21%', up:true  },
    { label:'Total Revenue',   value: stats ? fmtRevenue(stats.totalRevenue) : '—', icon:CreditCard, color:'#6F42C1', bg:'#E8D5FF', trend:'+15%', up:true },
    { label:'Bookings',        value: stats?.totalBookings  ?? '—', icon:BookOpen, color:'#B25E09', bg:'#FFE5D0', trend:'+6%',  up:true  },
    { label:'Pending',         value: stats?.pendingBookings?? '—', icon:Clock,    color:'#856404', bg:'#FFF3CD', trend:'-3%',  up:false },
  ];

  const statusClass = (s) => {
    if (!s) return 'pending';
    const v = s.toLowerCase();
    if (v==='active'||v==='completed') return 'active';
    if (v==='confirmed') return 'confirmed';
    if (v==='cancelled'||v==='inactive') return 'inactive';
    return 'pending';
  };

  return (
    <AdminLayout pageTitle="Dashboard">
      <style>{STYLES}</style>
      <div className="adash-root">

        <div className="adash-greeting">Good day, <span>{adminName}</span> 👋</div>
        <div className="adash-sub">Here's what's happening with Roditec today.</div>

        {/* KPI */}
        <div className="kpi-grid">
          {KPI_CARDS.map(card => (
            <div key={card.label} className="kpi-card">
              <div className="kpi-top">
                <div className="kpi-icon" style={{ background:card.bg, color:card.color }}>
                  <card.icon size={19}/>
                </div>
                <div className={`kpi-trend ${card.up?'up':'down'}`}>
                  {card.up ? <TrendingUp size={11}/> : <TrendingDown size={11}/>}
                  {card.trend}
                </div>
              </div>
              {loading
                ? <div className="skeleton" style={{ height:28, width:'60%', marginBottom:4 }}/>
                : <div className="kpi-value">{card.value}</div>
              }
              <div className="kpi-label">{card.label}</div>
            </div>
          ))}
        </div>

        {/* QUICK ACTIONS */}
        <div className="qa-grid">
          {[
            { label:'Add Listing',   sub:'Post a new car',   path:'/CarManagement',     icon:Car,       color:'#3B6BF0', bg:'#EEF2FF' },
            { label:'Add User',      sub:'Register a user',  path:'/UserManagement',    icon:Users,     color:'#2D9C5A', bg:'#D1E7DD' },
            { label:'View Bookings', sub:'Manage bookings',  path:'/BookingManagement', icon:BookOpen,  color:'#B25E09', bg:'#FFE5D0' },
            { label:'Payments',      sub:'Track payments',   path:'/PaymentManagement', icon:CreditCard,color:'#6F42C1', bg:'#E8D5FF' },
          ].map(a => (
            <Link key={a.path} to={a.path} className="qa-card">
              <div className="qa-icon" style={{ background:a.bg, color:a.color }}><a.icon size={16}/></div>
              <div><div className="qa-label">{a.label}</div><div className="qa-sub">{a.sub}</div></div>
            </Link>
          ))}
        </div>

        {/* PANELS */}
        <div className="panel-row">
          {/* Revenue Chart */}
          <div className="panel">
            <div className="panel-header">
              <div className="panel-title">Revenue Overview</div>
              <span className="panel-meta">Last 12 months</span>
            </div>
            <div className="bar-chart-wrap">
              <div className="bar-group">
                {chartData.map((val,i) => (
                  <div key={i} className="bar-item">
                    <div className={`bar${i===chartData.length-1?' highlight':''}`} style={{ height:`${(val/maxChart)*100}%` }}/>
                  </div>
                ))}
              </div>
              <div style={{ display:'flex', gap:5 }}>
                {MONTHS.map((m,i) => <div key={i} className="bar-lbl" style={{ flex:1, textAlign:'center' }}>{m}</div>)}
              </div>
            </div>
          </div>

          {/* Recent Bookings */}
          <div className="panel">
            <div className="panel-header">
              <div className="panel-title">Recent Bookings</div>
              <Link to="/BookingManagement" className="panel-link">View All <ArrowRight size={12}/></Link>
            </div>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Customer</th><th>Status</th><th>Amount</th></tr></thead>
                <tbody>
                  {loading ? Array.from({length:4}).map((_,i) => (
                    <tr key={i}>
                      <td><div className="skeleton" style={{ height:13, width:110 }}/></td>
                      <td><div className="skeleton" style={{ height:20, width:70, borderRadius:20 }}/></td>
                      <td><div className="skeleton" style={{ height:13, width:80 }}/></td>
                    </tr>
                  )) : recentBookings.length===0 ? (
                    <tr><td colSpan={3} className="td-empty">No bookings yet</td></tr>
                  ) : recentBookings.map((b,i) => (
                    <tr key={i}>
                      <td>
                        <div className="cell-primary">{b.user_name||b.user_id||'Customer'}</div>
                        <div className="cell-muted">{b.car_make} {b.car_model}</div>
                      </td>
                      <td>
                        <span className={`s-pill ${statusClass(b.booking_status)}`}>
                          <span className="s-pill-dot"/>{b.booking_status||'Pending'}
                        </span>
                      </td>
                      <td style={{ color:'#3B6BF0', fontWeight:600 }}>
                        KSH {parseFloat(b.total_amount?.$numberDecimal||b.total_amount||0).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Recent Listings */}
        <div className="panel">
          <div className="panel-header">
            <div className="panel-title">Recent Listings</div>
            <Link to="/CarManagement" className="panel-link">Manage All <ArrowRight size={12}/></Link>
          </div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Vehicle</th><th>Type</th><th>Price</th><th>Status</th></tr></thead>
              <tbody>
                {loading ? Array.from({length:5}).map((_,i) => (
                  <tr key={i}>
                    <td><div className="skeleton" style={{ height:13, width:130 }}/></td>
                    <td><div className="skeleton" style={{ height:13, width:55 }}/></td>
                    <td><div className="skeleton" style={{ height:13, width:90 }}/></td>
                    <td><div className="skeleton" style={{ height:20, width:65, borderRadius:20 }}/></td>
                  </tr>
                )) : recentCars.length===0 ? (
                  <tr><td colSpan={4} className="td-empty">No listings yet</td></tr>
                ) : recentCars.map((car,i) => {
                  const price = car.price?.$numberDecimal ? parseFloat(car.price.$numberDecimal) : (car.price||0);
                  return (
                    <tr key={i}>
                      <td>
                        <div className="cell-primary">{car.year} {car.make} {car.model}</div>
                        <div className="cell-muted">{car.carType}</div>
                      </td>
                      <td style={{ color:'#8888A8', fontWeight:500 }}>{car.RentSell}</td>
                      <td style={{ color:'#3B6BF0', fontWeight:600 }}>KSH {price.toLocaleString()}</td>
                      <td>
                        <span className={`s-pill ${statusClass(car.listing_status)}`}>
                          <span className="s-pill-dot"/>{car.listing_status||'Active'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}