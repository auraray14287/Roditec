import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Car, CalendarCheck, CreditCard,
  Users, FileBarChart, LogOut, Menu, X, Bell, ChevronRight
} from 'lucide-react';

const NAV_ITEMS = [
  { group: 'Overview', items: [{ label: 'Dashboard',  path: '/AdminDashboard', icon: LayoutDashboard }] },
  { group: 'Fleet',    items: [
    { label: 'Cars',     path: '/CarManagement',     icon: Car },
    { label: 'Bookings', path: '/BookingManagement', icon: CalendarCheck },
  ]},
  { group: 'Finance',  items: [{ label: 'Payments', path: '/PaymentManagement', icon: CreditCard }] },
  { group: 'People',   items: [{ label: 'Users',    path: '/UserManagement',    icon: Users }] },
  { group: 'Reports',  items: [{ label: 'Reports',  path: '/ReportDesign',      icon: FileBarChart }] },
];

const LAYOUT_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@600;700;800&family=Inter:wght@400;500;600&display=swap');

  .al-root { display:flex; height:100vh; background:#F7F8FC; overflow:hidden; font-family:'Inter',sans-serif; }

  /* SIDEBAR */
  .al-sidebar {
    width:220px; flex-shrink:0; height:100vh;
    background:#fff; border-right:1px solid #E5E7F0;
    display:flex; flex-direction:column;
    transition:width .28s cubic-bezier(.16,1,.3,1);
    position:relative; z-index:10;
  }
  .al-sidebar.collapsed { width:64px; }

  .al-sidebar-logo {
    height:64px; padding:0 14px; flex-shrink:0;
    border-bottom:1px solid #E5E7F0;
    display:flex; align-items:center; justify-content:space-between;
  }
  .al-logo-text { font-family:'Manrope',sans-serif; font-weight:800; font-size:18px; color:#1A1A2E; display:flex; align-items:center; gap:8px; white-space:nowrap; overflow:hidden; }
  .al-logo-dot { width:8px; height:8px; background:#3B6BF0; border-radius:50%; flex-shrink:0; }
  .al-collapse-btn { width:28px; height:28px; border-radius:6px; border:1px solid #E5E7F0; background:#F7F8FC; cursor:pointer; display:flex; align-items:center; justify-content:center; color:#8888A8; flex-shrink:0; transition:all .18s; }
  .al-collapse-btn:hover { background:#EEF2FF; color:#3B6BF0; border-color:#3B6BF0; }

  /* NAV */
  .al-nav { flex:1; overflow-y:auto; padding:10px 8px; scrollbar-width:none; }
  .al-nav::-webkit-scrollbar { display:none; }
  .al-nav-group { margin-bottom:16px; }
  .al-nav-group-label { font-size:10px; font-weight:700; letter-spacing:.12em; text-transform:uppercase; color:#8888A8; padding:0 8px; margin-bottom:4px; white-space:nowrap; overflow:hidden; }
  .al-nav-item {
    width:100%; border:none; border-radius:8px; padding:9px 10px;
    display:flex; align-items:center; gap:10px;
    font-family:'Inter',sans-serif; font-size:13px; font-weight:500;
    color:#4A4A68; background:transparent; cursor:pointer;
    transition:all .18s; text-align:left; margin-bottom:2px; white-space:nowrap;
  }
  .al-nav-item:hover { background:#F7F8FC; color:#1A1A2E; }
  .al-nav-item.active { background:#EEF2FF; color:#3B6BF0; font-weight:600; }
  .al-nav-item.active .al-nav-icon { color:#3B6BF0; }
  .al-nav-icon { flex-shrink:0; color:#8888A8; }
  .al-nav-item.active .al-nav-icon { color:#3B6BF0; }

  /* SIDEBAR BOTTOM */
  .al-sidebar-bottom { padding:10px 8px; border-top:1px solid #E5E7F0; flex-shrink:0; }
  .al-logout-btn {
    width:100%; border:none; border-radius:8px; padding:9px 10px;
    display:flex; align-items:center; gap:10px;
    font-family:'Inter',sans-serif; font-size:13px; font-weight:500;
    color:#E63946; background:transparent; cursor:pointer;
    transition:all .18s; text-align:left; white-space:nowrap;
  }
  .al-logout-btn:hover { background:#FEF2F2; }

  /* MAIN */
  .al-main { flex:1; display:flex; flex-direction:column; overflow:hidden; }

  /* TOPBAR */
  .al-topbar {
    height:64px; flex-shrink:0; background:#fff;
    border-bottom:1px solid #E5E7F0;
    display:flex; align-items:center; padding:0 20px; gap:14px;
  }
  .al-mobile-toggle { width:34px; height:34px; border-radius:7px; border:1px solid #E5E7F0; background:#F7F8FC; cursor:pointer; display:flex; align-items:center; justify-content:center; color:#4A4A68; transition:all .18s; flex-shrink:0; }
  .al-mobile-toggle:hover { background:#EEF2FF; color:#3B6BF0; border-color:#3B6BF0; }
  .al-topbar-title-section { flex:1; }
  .al-topbar-admin-label { font-size:10px; font-weight:700; letter-spacing:.12em; text-transform:uppercase; color:#3B6BF0; margin-bottom:1px; }
  .al-topbar-page-title { font-family:'Manrope',sans-serif; font-size:16px; font-weight:700; color:#1A1A2E; line-height:1.2; }
  .al-topbar-right { display:flex; align-items:center; gap:8px; }
  .al-icon-btn { width:34px; height:34px; border-radius:7px; border:1px solid #E5E7F0; background:#F7F8FC; cursor:pointer; display:flex; align-items:center; justify-content:center; color:#4A4A68; transition:all .18s; position:relative; }
  .al-icon-btn:hover { background:#EEF2FF; color:#3B6BF0; border-color:#3B6BF0; }
  .al-notif-dot { position:absolute; top:7px; right:7px; width:7px; height:7px; border-radius:50%; background:#E63946; border:2px solid #fff; }
  .al-avatar { width:34px; height:34px; border-radius:50%; background:linear-gradient(135deg,#3B6BF0,#2040C0); display:flex; align-items:center; justify-content:center; font-family:'Manrope',sans-serif; font-weight:700; font-size:13px; color:#fff; cursor:default; border:2px solid rgba(59,107,240,.2); }

  /* CONTENT */
  .al-content { flex:1; overflow-y:auto; padding:24px; background:#F7F8FC; }

  /* MOBILE OVERLAY */
  .al-mobile-overlay { position:fixed; inset:0; background:rgba(0,0,0,.4); backdrop-filter:blur(4px); z-index:200; }
  .al-mobile-sidebar {
    position:fixed; top:0; left:0; bottom:0; width:260px;
    background:#fff; border-right:1px solid #E5E7F0;
    z-index:201; display:flex; flex-direction:column;
    box-shadow:4px 0 24px rgba(0,0,0,.08);
  }
`;

export default function AdminLayout({ children, pageTitle }) {
  const navigate   = useNavigate();
  const location   = useLocation();
  const [collapsed,  setCollapsed]  = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const adminName = localStorage.getItem('adminName') || 'Admin';

  const handleLogout = () => { localStorage.clear(); navigate('/AdminLogin'); };
  const isActive = (path) => location.pathname === path;

  useEffect(() => { setMobileOpen(false); }, [location]);

  const SidebarContent = ({ mobile = false }) => (
    <>
      {/* Logo */}
      <div className="al-sidebar-logo">
        {(!collapsed || mobile) && (
          <div className="al-logo-text">
            <div className="al-logo-dot" />
            Roditec
          </div>
        )}
        <button
          className="al-collapse-btn"
          onClick={() => mobile ? setMobileOpen(false) : setCollapsed(c => !c)}
        >
          {mobile ? <X size={14}/> : (collapsed ? <ChevronRight size={13}/> : <Menu size={13}/>)}
        </button>
      </div>

      {/* Nav */}
      <nav className="al-nav">
        {NAV_ITEMS.map(({ group, items }) => (
          <div key={group} className="al-nav-group">
            {(!collapsed || mobile) && <div className="al-nav-group-label">{group}</div>}
            {items.map(({ label, path, icon: Icon }) => (
              <button
                key={path}
                className={`al-nav-item${isActive(path) ? ' active' : ''}`}
                onClick={() => { navigate(path); if (mobile) setMobileOpen(false); }}
                title={(collapsed && !mobile) ? label : undefined}
                style={{ justifyContent: (collapsed && !mobile) ? 'center' : 'flex-start' }}
              >
                <Icon size={16} className="al-nav-icon"/>
                {(!collapsed || mobile) && <span>{label}</span>}
              </button>
            ))}
          </div>
        ))}
      </nav>

      {/* Bottom */}
      <div className="al-sidebar-bottom">
        <button
          className="al-logout-btn"
          onClick={handleLogout}
          title={(collapsed && !mobile) ? 'Logout' : undefined}
          style={{ justifyContent: (collapsed && !mobile) ? 'center' : 'flex-start' }}
        >
          <LogOut size={15} style={{ flexShrink:0 }}/>
          {(!collapsed || mobile) && <span>Logout</span>}
        </button>
      </div>
    </>
  );

  return (
    <div className="al-root">
      <style>{LAYOUT_STYLES}</style>

      {/* Desktop sidebar */}
      <aside className={`al-sidebar${collapsed ? ' collapsed' : ''}`}>
        <SidebarContent mobile={false}/>
      </aside>

      {/* Mobile overlay + drawer */}
      {mobileOpen && (
        <>
          <div className="al-mobile-overlay" onClick={() => setMobileOpen(false)}/>
          <aside className="al-mobile-sidebar"><SidebarContent mobile={true}/></aside>
        </>
      )}

      {/* Main area */}
      <div className="al-main">
        <header className="al-topbar">
          <button className="al-mobile-toggle" onClick={() => setMobileOpen(true)}><Menu size={15}/></button>
          <div className="al-topbar-title-section">
            <div className="al-topbar-admin-label">Admin</div>
            <div className="al-topbar-page-title">{pageTitle}</div>
          </div>
          <div className="al-topbar-right">
            <button className="al-icon-btn">
              <Bell size={15}/>
              <span className="al-notif-dot"/>
            </button>
            <div className="al-avatar">{adminName?.[0]?.toUpperCase() || 'A'}</div>
          </div>
        </header>
        <main className="al-content">{children}</main>
      </div>
    </div>
  );
}