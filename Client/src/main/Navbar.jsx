import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, Search, User, LogOut, Shield } from 'lucide-react';
import roditecLogo from '../assets/roditec-logo.jpg';

const NAV_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700;800&family=Inter:wght@400;500;600&display=swap');

  .nav-root {
    font-family: 'Inter', sans-serif;
    position: fixed;
    top: 0; left: 0; right: 0;
    z-index: 1000;
    background: #fff;
    border-bottom: 1px solid #E5E7F0;
    box-shadow: 0 1px 8px rgba(0,0,0,0.06);
    transition: box-shadow 0.3s ease;
  }
  .nav-root.scrolled {
    box-shadow: 0 2px 20px rgba(0,0,0,0.10);
  }

  .nav-inner {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 24px;
    height: 70px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
  }

  .nav-logo {
    text-decoration: none;
    display: flex;
    align-items: center;
    flex-shrink: 0;
  }
  .nav-logo img {
    height: 48px;
    width: auto;
    object-fit: contain;
    display: block;
  }

  .nav-links {
    display: flex;
    align-items: center;
    gap: 2px;
    list-style: none;
    margin: 0; padding: 0;
    flex: 1;
  }

  .nav-link {
    font-size: 14px;
    font-weight: 500;
    color: #4A4A68;
    text-decoration: none;
    padding: 8px 14px;
    border-radius: 6px;
    transition: all 0.18s ease;
    position: relative;
  }
  .nav-link:hover {
    color: #3B6BF0;
    background: #EEF2FF;
  }
  .nav-link.active {
    color: #3B6BF0;
    font-weight: 600;
    background: #EEF2FF;
  }

  .nav-actions {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
  }

  .icon-btn {
    width: 38px; height: 38px;
    border-radius: 8px;
    border: 1px solid #E5E7F0;
    background: #F7F8FC;
    color: #4A4A68;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.18s ease;
  }
  .icon-btn:hover {
    background: #EEF2FF;
    border-color: #3B6BF0;
    color: #3B6BF0;
  }

  .btn-signin {
    background: none;
    border: 1px solid #E5E7F0;
    color: #4A4A68;
    font-family: 'Inter', sans-serif;
    font-size: 13px;
    font-weight: 500;
    padding: 8px 18px;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.18s ease;
    text-decoration: none;
    display: inline-flex; align-items: center;
  }
  .btn-signin:hover {
    border-color: #3B6BF0;
    color: #3B6BF0;
  }

  .btn-cta {
    background: #3B6BF0;
    color: #fff;
    border: none;
    font-family: 'Inter', sans-serif;
    font-size: 13px;
    font-weight: 600;
    padding: 9px 20px;
    border-radius: 6px;
    cursor: pointer;
    transition: background 0.18s ease;
    text-decoration: none;
    display: inline-flex; align-items: center; gap: 6px;
    white-space: nowrap;
  }
  .btn-cta:hover { background: #2952CC; }

  /* Search overlay */
  .search-overlay {
    position: fixed;
    top: 70px; left: 0; right: 0;
    background: #fff;
    border-bottom: 1px solid #E5E7F0;
    padding: 16px 24px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.08);
    transform: translateY(-100%);
    opacity: 0;
    transition: all 0.25s ease;
    z-index: 999;
  }
  .search-overlay.open { transform: translateY(0); opacity: 1; }

  .search-input-wrap {
    max-width: 560px;
    margin: 0 auto;
    position: relative;
  }
  .search-icon-pos {
    position: absolute; left: 14px; top: 50%;
    transform: translateY(-50%);
    color: #8888A8;
    pointer-events: none;
  }
  .search-input {
    width: 100%;
    background: #F7F8FC;
    border: 1px solid #E5E7F0;
    border-radius: 10px;
    padding: 11px 16px 11px 42px;
    color: #1A1A2E;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    outline: none;
    transition: border-color 0.2s;
  }
  .search-input:focus { border-color: #3B6BF0; background: #fff; box-shadow: 0 0 0 3px rgba(59,107,240,0.1); }
  .search-input::placeholder { color: #8888A8; }

  /* User menu */
  .user-menu-wrap { position: relative; }

  .user-avatar-btn {
    width: 34px; height: 34px;
    border-radius: 50%;
    background: linear-gradient(135deg, #3B6BF0, #2040C0);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Manrope', sans-serif;
    font-weight: 700;
    font-size: 13px;
    color: #fff;
    cursor: pointer;
    border: 2px solid rgba(59,107,240,0.25);
    transition: box-shadow 0.2s;
  }
  .user-avatar-btn:hover { box-shadow: 0 0 0 4px rgba(59,107,240,0.15); }

  .user-dropdown {
    position: absolute;
    top: calc(100% + 10px);
    right: 0;
    min-width: 190px;
    background: #fff;
    border: 1px solid #E5E7F0;
    border-radius: 10px;
    padding: 6px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.12);
    opacity: 0;
    transform: translateY(-6px);
    pointer-events: none;
    transition: all 0.18s ease;
  }
  .user-dropdown.open { opacity: 1; transform: translateY(0); pointer-events: all; }

  .dropdown-header {
    padding: 8px 12px 12px;
    border-bottom: 1px solid #E5E7F0;
    margin-bottom: 4px;
  }
  .dropdown-name { color: #1A1A2E; font-weight: 600; font-size: 14px; }
  .dropdown-role { color: #8888A8; font-size: 12px; margin-top: 2px; text-transform: capitalize; }

  .dropdown-item {
    display: flex; align-items: center; gap: 9px;
    padding: 9px 12px;
    border-radius: 6px;
    color: #4A4A68;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s ease;
    text-decoration: none;
    border: none;
    background: none;
    width: 100%;
    font-family: 'Inter', sans-serif;
  }
  .dropdown-item:hover { background: #F7F8FC; color: #1A1A2E; }
  .dropdown-item.danger:hover { background: #FEF2F2; color: #E63946; }
  .dropdown-divider { height: 1px; background: #E5E7F0; margin: 4px 0; }

  /* Mobile */
  .mobile-overlay {
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.4);
    z-index: 998;
    opacity: 0; pointer-events: none;
    transition: opacity 0.25s ease;
  }
  .mobile-overlay.open { opacity: 1; pointer-events: all; }

  .mobile-drawer {
    position: fixed;
    top: 0; right: 0;
    width: min(320px, 100vw);
    height: 100vh;
    background: #fff;
    border-left: 1px solid #E5E7F0;
    z-index: 999;
    transform: translateX(100%);
    transition: transform 0.35s cubic-bezier(0.16,1,0.3,1);
    display: flex; flex-direction: column;
    padding: 20px;
    box-shadow: -4px 0 24px rgba(0,0,0,0.08);
  }
  .mobile-drawer.open { transform: translateX(0); }

  .mobile-drawer-header {
    display: flex; justify-content: space-between; align-items: center;
    margin-bottom: 28px;
    padding-bottom: 16px;
    border-bottom: 1px solid #E5E7F0;
  }

  .mobile-nav-link {
    display: flex; align-items: center; justify-content: space-between;
    padding: 14px 0;
    color: #4A4A68;
    font-family: 'Inter', sans-serif;
    font-size: 15px;
    font-weight: 500;
    text-decoration: none;
    border-bottom: 1px solid #F0F0F8;
    transition: color 0.18s ease;
  }
  .mobile-nav-link:hover, .mobile-nav-link.active { color: #3B6BF0; }

  .topbar {
    background: #1A1A2E;
    color: rgba(255,255,255,0.6);
    font-size: 12px;
    padding: 7px 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 100%;
  }
  .topbar a { color: rgba(255,255,255,0.6); text-decoration: none; margin-left: 16px; }
  .topbar a:hover { color: #fff; }

  @media (max-width: 768px) {
    .desktop-nav { display: none; }
    .desktop-actions { display: none; }
    .topbar { display: none; }
  }
  @media (min-width: 769px) {
    .mobile-toggle { display: none; }
  }
`;

export default function Navbar() {
  const [isOpen,       setIsOpen]       = useState(false);
  const [scrolled,     setScrolled]     = useState(false);
  const [searchOpen,   setSearchOpen]   = useState(false);
  const [searchQuery,  setSearchQuery]  = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const location    = useLocation();
  const navigate    = useNavigate();
  const userMenuRef = useRef(null);

  const isLoggedIn = !!localStorage.getItem('name');
  const userName   = localStorage.getItem('name');
  const userRole   = localStorage.getItem('role');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => { setIsOpen(false); setSearchOpen(false); }, [location]);

  const handleLogout = () => { localStorage.clear(); navigate('/login'); };

  const navLinks = [
    { label: 'Home',      path: '/' },
    { label: 'Buy a Car', path: '/CarExplore' },
    { label: 'Rent a Car',path: '/CarExplore' },
    { label: 'About Us',  path: '/AboutUs' },
    { label: 'Contact',   path: '/ContactUs' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <style>{NAV_STYLES}</style>

      {/* Top bar */}
      <div className="topbar">
        <span>📞 +254 700 000 000 &nbsp;|&nbsp; ✉️ info@roditec.co.ke</span>
        <div>
          <a href="#">Mon–Fri: 8am–6pm</a>
          <a href="#">Nairobi, Kenya</a>
        </div>
      </div>

      {/* Main nav */}
      <nav className={`nav-root${scrolled ? ' scrolled' : ''}`}>
        <div className="nav-inner">

          {/* Logo */}
          <Link to="/" className="nav-logo">
            <img src={roditecLogo} alt="Roditec Automotives" />
          </Link>

          {/* Desktop links */}
          <ul className="nav-links desktop-nav">
            {navLinks.map(link => (
              <li key={link.label}>
                <Link to={link.path} className={`nav-link${isActive(link.path) ? ' active' : ''}`}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop actions */}
          <div className="nav-actions desktop-actions">
            <button className="icon-btn" onClick={() => setSearchOpen(!searchOpen)} title="Search">
              <Search size={16} />
            </button>

            {isLoggedIn ? (
              <div className="user-menu-wrap" ref={userMenuRef}>
                <button className="user-avatar-btn" onClick={() => setUserMenuOpen(!userMenuOpen)} title={userName}>
                  {userName?.[0]?.toUpperCase() || 'U'}
                </button>
                <div className={`user-dropdown${userMenuOpen ? ' open' : ''}`}>
                  <div className="dropdown-header">
                    <div className="dropdown-name">{userName}</div>
                    <div className="dropdown-role">{userRole || 'member'}</div>
                  </div>
                  {userRole === 'admin' && (
                    <Link to="/AdminDashboard" className="dropdown-item">
                      <Shield size={14} /> Admin Panel
                    </Link>
                  )}
                  <Link to="/Profile" className="dropdown-item">
                    <User size={14} /> My Profile
                  </Link>
                  <div className="dropdown-divider" />
                  <button className="dropdown-item danger" onClick={handleLogout}>
                    <LogOut size={14} /> Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <>
                <Link to="/login" className="btn-signin">Sign In</Link>
                <Link to="/CarExplore" className="btn-cta">Browse Cars</Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button className="icon-btn mobile-toggle" onClick={() => setIsOpen(!isOpen)}>
            <Menu size={18} />
          </button>
        </div>
      </nav>

      {/* Search overlay */}
      <div className={`search-overlay${searchOpen ? ' open' : ''}`} style={{ top: scrolled ? '70px' : '100px' }}>
        <div className="search-input-wrap">
          <Search size={16} className="search-icon-pos" />
          <input
            className="search-input"
            placeholder="Search by make, model, year…"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && searchQuery) { navigate(`/CarExplore?q=${searchQuery}`); setSearchOpen(false); }
              if (e.key === 'Escape') setSearchOpen(false);
            }}
            autoFocus={searchOpen}
          />
        </div>
      </div>

      {/* Mobile overlay */}
      <div className={`mobile-overlay${isOpen ? ' open' : ''}`} onClick={() => setIsOpen(false)} />

      {/* Mobile drawer */}
      <div className={`mobile-drawer${isOpen ? ' open' : ''}`}>
        <div className="mobile-drawer-header">
          <Link to="/" className="nav-logo">
            <img src={roditecLogo} alt="Roditec Automotives" style={{ height: 36 }} />
          </Link>
          <button className="icon-btn" onClick={() => setIsOpen(false)}>
            <X size={16} />
          </button>
        </div>

        {navLinks.map(link => (
          <Link key={link.label} to={link.path} className={`mobile-nav-link${isActive(link.path) ? ' active' : ''}`}>
            {link.label}
            <ChevronDown size={14} style={{ transform: 'rotate(-90deg)', opacity: 0.4 }} />
          </Link>
        ))}

        <div style={{ marginTop: 'auto', paddingTop: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {isLoggedIn ? (
            <>
              {userRole === 'admin' && (
                <Link to="/AdminDashboard" className="btn-cta" style={{ justifyContent: 'center' }}>
                  <Shield size={14} /> Admin Panel
                </Link>
              )}
              <button
                onClick={handleLogout}
                style={{ background: '#FEF2F2', color: '#E63946', border: '1px solid rgba(230,57,70,0.2)', borderRadius: 8, padding: '10px', fontFamily: 'Inter,sans-serif', fontWeight: 600, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
              >
                <LogOut size={14} /> Sign Out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-signin" style={{ justifyContent: 'center', textAlign: 'center' }}>Sign In</Link>
              <Link to="/CarExplore" className="btn-cta" style={{ justifyContent: 'center' }}>Browse Cars</Link>
            </>
          )}
        </div>
      </div>
    </>
  );
}