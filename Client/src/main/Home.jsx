import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ArrowRight, Shield, Clock, Users, Award, Fuel, Gauge, Settings2, Star, MapPin } from 'lucide-react';
import API_BASE_URL from '../config/apiConfig';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600&display=swap');

  .home-root {
    background: #fff;
    color: #1A1A2E;
    font-family: 'Inter', sans-serif;
    overflow-x: hidden;
  }

  /* ── HERO ── */
  .hero {
    position: relative;
    background: #F7F8FC;
    min-height: 520px;
    overflow: hidden;
  }
  .hero-slides { position: relative; height: 520px; }
  .hero-slide {
    position: absolute; inset: 0;
    opacity: 0; transition: opacity 0.6s ease;
    display: flex; align-items: center;
  }
  .hero-slide.active { opacity: 1; }
  .hero-slide-bg {
    position: absolute; inset: 0;
    background-size: cover; background-position: center;
  }
  .hero-slide-bg::after {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(to right, rgba(255,255,255,0.94) 38%, rgba(255,255,255,0.5) 65%, rgba(255,255,255,0.15) 100%);
  }
  .hero-content { position: relative; z-index: 2; max-width: 1280px; margin: 0 auto; padding: 0 24px; width: 100%; }
  .hero-tag {
    display: inline-block;
    background: #EEF2FF; color: #3B6BF0;
    font-size: 11px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase;
    padding: 5px 12px; border-radius: 4px; margin-bottom: 14px;
  }
  .hero-h1 {
    font-family: 'Manrope', sans-serif;
    font-size: clamp(28px, 4.5vw, 52px);
    font-weight: 800; line-height: 1.12;
    color: #1A1A2E; margin-bottom: 16px;
  }
  .hero-specs { display: flex; gap: 20px; margin-bottom: 24px; flex-wrap: wrap; }
  .hero-spec { font-size: 13px; color: #4A4A68; display: flex; align-items: center; gap: 6px; }
  .hero-spec::before { content: '•'; color: #3B6BF0; }
  .hero-spec:first-child::before { display: none; }
  .hero-btns { display: flex; gap: 12px; flex-wrap: wrap; }
  .hero-agent { display: flex; align-items: center; gap: 10px; margin-top: 20px; }
  .hero-agent-av { width: 36px; height: 36px; border-radius: 50%; background: #3B6BF0; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 13px; color: #fff; }
  .hero-agent-name { font-size: 13px; font-weight: 600; color: #1A1A2E; }
  .hero-agent-role { font-size: 11px; color: #8888A8; }
  .hero-dots { position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%); display: flex; gap: 6px; z-index: 10; }
  .hero-dot { width: 8px; height: 8px; border-radius: 50%; background: rgba(59,107,240,0.25); cursor: pointer; transition: all 0.2s; border: none; padding: 0; }
  .hero-dot.active { background: #3B6BF0; width: 24px; border-radius: 4px; }
  .hero-nav { position: absolute; top: 50%; transform: translateY(-50%); z-index: 10; width: 38px; height: 38px; background: #fff; border: 1px solid #E5E7F0; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 16px; color: #4A4A68; transition: all 0.2s; }
  .hero-nav:hover { background: #3B6BF0; color: #fff; border-color: #3B6BF0; }
  .hero-prev { left: 16px; }
  .hero-next { right: 16px; }

  /* ── SEARCH ── */
  .search-wrap {
    background: #fff;
    box-shadow: 0 4px 24px rgba(0,0,0,0.08);
    border-radius: 12px;
    padding: 24px;
    max-width: 1060px;
    margin: -40px auto 0;
    position: relative; z-index: 10;
  }
  .search-tabs { display: flex; gap: 4px; margin-bottom: 18px; border-bottom: 1px solid #E5E7F0; padding-bottom: 14px; }
  .s-tab { background: none; border: none; font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 600; color: #8888A8; padding: 6px 16px; border-radius: 6px; cursor: pointer; transition: all 0.18s; }
  .s-tab.active, .s-tab:hover { color: #3B6BF0; background: #EEF2FF; }
  .search-row { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr auto; gap: 12px; align-items: end; }
  .sf { display: flex; flex-direction: column; gap: 5px; }
  .sf label { font-size: 10px; font-weight: 700; color: #8888A8; text-transform: uppercase; letter-spacing: 0.5px; }
  .sf select, .sf input { background: #F7F8FC; border: 1px solid #E5E7F0; color: #1A1A2E; font-family: 'Inter', sans-serif; font-size: 13px; padding: 10px 12px; border-radius: 8px; outline: none; transition: border 0.18s; -webkit-appearance: none; }
  .sf select:focus, .sf input:focus { border-color: #3B6BF0; background: #fff; }
  .btn-search { background: #3B6BF0; color: #fff; border: none; border-radius: 8px; padding: 11px 28px; font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 600; cursor: pointer; white-space: nowrap; transition: background 0.18s; display: flex; align-items: center; gap: 6px; }
  .btn-search:hover { background: #2952CC; }
  .search-more { font-size: 12px; color: #3B6BF0; cursor: pointer; margin-top: 10px; display: inline-block; background: none; border: none; font-family: 'Inter', sans-serif; }
  .search-more:hover { text-decoration: underline; }

  /* ── CONTAINER ── */
  .container { max-width: 1280px; margin: 0 auto; padding: 0 24px; }
  .section { padding: 64px 0; }

  /* ── SECTION HEADER ── */
  .sec-head { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 28px; flex-wrap: wrap; gap: 12px; }
  .sec-label { font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #3B6BF0; margin-bottom: 6px; }
  .sec-title { font-family: 'Manrope', sans-serif; font-size: clamp(20px,3vw,28px); font-weight: 800; color: #1A1A2E; }
  .sec-sub { font-size: 13px; color: #8888A8; margin-top: 4px; }
  .view-all { font-size: 13px; font-weight: 600; color: #3B6BF0; background: none; border: 1px solid #E5E7F0; padding: 7px 14px; border-radius: 6px; cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; gap: 4px; transition: all 0.18s; }
  .view-all:hover { background: #EEF2FF; border-color: #3B6BF0; }

  /* ── BODY TYPE TABS ── */
  .body-tabs { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 24px; }
  .body-tab { background: none; border: 1px solid #E5E7F0; color: #4A4A68; font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 500; padding: 6px 16px; border-radius: 20px; cursor: pointer; transition: all 0.18s; }
  .body-tab.active, .body-tab:hover { background: #3B6BF0; color: #fff; border-color: #3B6BF0; }

  /* ── CAR CARD ── */
  .cars-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; }
  .car-card { background: #fff; border: 1px solid #E5E7F0; border-radius: 12px; overflow: hidden; transition: all 0.3s ease; cursor: pointer; text-decoration: none; display: block; color: inherit; }
  .car-card:hover { box-shadow: 0 8px 32px rgba(59,107,240,0.12); border-color: rgba(59,107,240,0.3); transform: translateY(-3px); }
  .card-img-wrap { position: relative; height: 195px; background: #F7F8FC; overflow: hidden; display: flex; align-items: center; justify-content: center; }
  .card-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease; }
  .car-card:hover .card-img { transform: scale(1.04); }
  .card-img-placeholder { width: 100%; height: 100%; background: linear-gradient(135deg,#EEF2FF,#dce8ff); display: flex; align-items: center; justify-content: center; font-size: 56px; }
  .card-badges { position: absolute; top: 10px; left: 10px; display: flex; gap: 5px; }
  .badge { font-size: 10px; font-weight: 700; padding: 4px 10px; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.5px; }
  .badge-sale { background: #CFE2FF; color: #084298; }
  .badge-hire { background: #D1E7DD; color: #0A5C36; }
  .badge-new { background: #D1E7DD; color: #0A5C36; }
  .badge-featured { background: #FFF3CD; color: #856404; }
  .card-img-count { position: absolute; bottom: 10px; right: 10px; background: rgba(0,0,0,0.5); color: #fff; font-size: 11px; padding: 3px 8px; border-radius: 4px; display: flex; align-items: center; gap: 4px; }
  .card-year { position: absolute; top: 10px; right: 10px; background: #fff; color: #3B6BF0; font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 4px; border: 1px solid #EEF2FF; }
  .card-body { padding: 16px; }
  .card-type { font-size: 10px; font-weight: 700; color: #3B6BF0; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
  .card-name { font-family: 'Manrope', sans-serif; font-size: 16px; font-weight: 700; color: #1A1A2E; margin-bottom: 10px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .card-specs { display: flex; gap: 14px; margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid #F0F0F8; flex-wrap: wrap; }
  .card-spec { font-size: 12px; color: #8888A8; display: flex; align-items: center; gap: 4px; }
  .card-footer { display: flex; justify-content: space-between; align-items: center; }
  .card-price { font-family: 'Manrope', sans-serif; font-size: 18px; font-weight: 800; color: #1A1A2E; }
  .card-price-sub { font-size: 11px; color: #8888A8; margin-top: 2px; }
  .card-agent { display: flex; align-items: center; gap: 6px; }
  .card-agent-av { width: 26px; height: 26px; border-radius: 50%; background: #EEF2FF; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 700; color: #3B6BF0; }
  .card-agent-name { font-size: 12px; color: #8888A8; }
  .btn-view { display: block; width: 100%; text-align: center; margin-top: 12px; padding: 8px; background: #EEF2FF; color: #3B6BF0; border: none; border-radius: 6px; font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.18s; }
  .btn-view:hover { background: #3B6BF0; color: #fff; }

  /* ── SKELETON ── */
  .skeleton { background: linear-gradient(90deg,#f0f2f8 25%,#e8ecf8 50%,#f0f2f8 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: 6px; }
  @keyframes shimmer { from { background-position: 200% 0; } to { background-position: -200% 0; } }

  /* ── BRANDS ── */
  .brands-bg { background: #F7F8FC; padding: 48px 0; }
  .brands-grid { display: grid; grid-template-columns: repeat(6,1fr); gap: 14px; }
  .brand-card { background: #fff; border: 1px solid #E5E7F0; border-radius: 10px; padding: 18px; display: flex; flex-direction: column; align-items: center; gap: 8px; cursor: pointer; transition: all 0.18s; }
  .brand-card:hover { border-color: #3B6BF0; box-shadow: 0 4px 16px rgba(59,107,240,0.1); }
  .brand-logo { font-family: 'Manrope', sans-serif; font-size: 15px; font-weight: 700; color: #4A4A68; }
  .brand-count { font-size: 12px; color: #8888A8; }

  /* ── BODY TYPES ── */
  .body-types-grid { display: grid; grid-template-columns: repeat(5,1fr); gap: 14px; }
  .body-type-card { border: 1px solid #E5E7F0; border-radius: 10px; padding: 20px 14px; text-align: center; cursor: pointer; transition: all 0.18s; }
  .body-type-card:hover { border-color: #3B6BF0; background: #EEF2FF; }
  .body-type-icon { font-size: 32px; margin-bottom: 10px; line-height: 1; }
  .body-type-name { font-size: 13px; font-weight: 600; color: #1A1A2E; }
  .body-type-count { font-size: 11px; color: #8888A8; margin-top: 3px; }

  /* ── HOW IT WORKS ── */
  .how-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 20px; }
  .how-card { text-align: center; padding: 28px 16px; }
  .how-icon { width: 60px; height: 60px; background: #EEF2FF; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 26px; margin: 0 auto 16px; }
  .how-title { font-family: 'Manrope', sans-serif; font-size: 15px; font-weight: 700; color: #1A1A2E; margin-bottom: 8px; }
  .how-text { font-size: 13px; color: #8888A8; line-height: 1.6; }

  /* ── PROMO ── */
  .promo-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  .promo-card { border-radius: 12px; padding: 40px; position: relative; overflow: hidden; min-height: 200px; display: flex; flex-direction: column; justify-content: flex-end; }
  .promo-1 { background: linear-gradient(135deg,#E8F0FE,#C7D9FD); }
  .promo-2 { background: linear-gradient(135deg,#E8F5ED,#C0E4CB); }
  .promo-h { font-family: 'Manrope', sans-serif; font-size: 20px; font-weight: 800; color: #1A1A2E; margin-bottom: 8px; }
  .promo-p { font-size: 13px; color: #4A4A68; margin-bottom: 16px; }
  .promo-img { position: absolute; right: 0; bottom: 0; font-size: 100px; opacity: 0.1; }

  /* ── STATS ── */
  .stats-bar { background: #1A1A2E; padding: 48px 0; }
  .stats-grid { display: grid; grid-template-columns: repeat(4,1fr); text-align: center; }
  .stat-item { padding: 20px; border-right: 1px solid rgba(255,255,255,0.08); }
  .stat-item:last-child { border-right: none; }
  .stat-n { font-family: 'Manrope', sans-serif; font-size: 36px; font-weight: 800; color: #fff; line-height: 1; }
  .stat-l { font-size: 12px; color: rgba(255,255,255,0.45); margin-top: 6px; letter-spacing: 0.5px; text-transform: uppercase; }

  /* ── CALC ── */
  .calc-wrap { background: #F7F8FC; padding: 64px 0; }
  .calc-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: center; }
  .calc-form { background: #fff; border: 1px solid #E5E7F0; border-radius: 12px; padding: 32px; }
  .calc-title { font-family: 'Manrope', sans-serif; font-size: 20px; font-weight: 700; color: #1A1A2E; margin-bottom: 24px; }
  .calc-field { margin-bottom: 16px; }
  .calc-label { display: block; font-size: 11px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; color: #8888A8; margin-bottom: 6px; }
  .calc-input { width: 100%; background: #F7F8FC; border: 1px solid #E5E7F0; border-radius: 8px; padding: 10px 14px; font-size: 14px; color: #1A1A2E; outline: none; transition: border 0.18s; font-family: 'Inter', sans-serif; }
  .calc-input:focus { border-color: #3B6BF0; background: #fff; }
  .calc-result { background: #EEF2FF; border-radius: 8px; padding: 18px; margin-top: 6px; }
  .calc-result-label { font-size: 12px; color: #3B6BF0; font-weight: 600; margin-bottom: 4px; }
  .calc-result-val { font-family: 'Manrope', sans-serif; font-size: 30px; font-weight: 800; color: #3B6BF0; }
  .calc-info-title { font-family: 'Manrope', sans-serif; font-size: 28px; font-weight: 800; color: #1A1A2E; margin-bottom: 16px; }
  .calc-info p { font-size: 14px; color: #4A4A68; line-height: 1.7; margin-bottom: 20px; }

  /* ── TESTIMONIALS ── */
  .testi-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 20px; }
  .testi-card { background: #fff; border: 1px solid #E5E7F0; border-radius: 12px; padding: 24px; }
  .testi-stars { color: #F4A017; font-size: 14px; margin-bottom: 10px; }
  .testi-text { font-size: 14px; color: #4A4A68; line-height: 1.7; margin-bottom: 16px; }
  .testi-author { display: flex; align-items: center; gap: 10px; }
  .testi-av { width: 40px; height: 40px; border-radius: 50%; background: #EEF2FF; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; color: #3B6BF0; }

  /* ── WHY US ── */
  .why-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 0; }
  .why-item { padding: 40px 32px; border-right: 1px solid #E5E7F0; position: relative; transition: background 0.18s; }
  .why-item:last-child { border-right: none; }
  .why-item:hover { background: #EEF2FF; }
  .why-icon { width: 52px; height: 52px; background: #EEF2FF; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: #3B6BF0; margin-bottom: 16px; transition: all 0.18s; }
  .why-item:hover .why-icon { background: #3B6BF0; color: #fff; }
  .why-num { font-family: 'Manrope', sans-serif; font-size: 32px; font-weight: 800; color: #1A1A2E; line-height: 1; margin-bottom: 6px; }
  .why-label { font-size: 13px; color: #8888A8; line-height: 1.5; }

  /* ── PARTNERS ── */
  .partners-wrap { background: #fff; border-top: 1px solid #E5E7F0; border-bottom: 1px solid #E5E7F0; padding: 32px 0; overflow: hidden; }
  .partners-track { display: flex; gap: 12px; flex-wrap: wrap; }
  .partner-pill { background: #F7F8FC; border: 1px solid #E5E7F0; border-radius: 8px; padding: 10px 18px; font-size: 13px; font-weight: 700; color: #8888A8; white-space: nowrap; }

  /* ── CTA ── */
  .cta-strip { background: #3B6BF0; padding: 64px 0; }
  .cta-inner { display: flex; justify-content: space-between; align-items: center; gap: 32px; flex-wrap: wrap; }
  .cta-h { font-family: 'Manrope', sans-serif; font-size: clamp(22px,4vw,36px); font-weight: 800; color: #fff; line-height: 1.2; }
  .btn-cta-white { background: #fff; color: #3B6BF0; font-family: 'Inter', sans-serif; font-weight: 700; font-size: 14px; padding: 14px 32px; border: none; border-radius: 8px; cursor: pointer; text-decoration: none; white-space: nowrap; transition: all 0.18s; display: inline-block; }
  .btn-cta-white:hover { background: #f0f2ff; }

  /* ── FOOTER ── */
  footer { background: #1A1A2E; color: rgba(255,255,255,0.55); padding: 60px 0 32px; }
  .footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1.2fr; gap: 48px; margin-bottom: 48px; }
  .footer-brand { font-family: 'Manrope', sans-serif; font-size: 20px; font-weight: 800; color: #fff; margin-bottom: 12px; display: flex; align-items: center; gap: 8px; }
  .footer-brand-dot { width: 8px; height: 8px; background: #3B6BF0; border-radius: 50%; }
  .footer-desc { font-size: 13px; line-height: 1.7; color: rgba(255,255,255,0.45); max-width: 260px; margin-bottom: 20px; }
  .footer-newsletter { display: flex; gap: 8px; }
  .footer-input { flex: 1; background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.1); color: #fff; font-size: 13px; padding: 9px 14px; border-radius: 6px; outline: none; font-family: 'Inter', sans-serif; }
  .footer-input::placeholder { color: rgba(255,255,255,0.3); }
  .btn-subscribe { background: #3B6BF0; color: #fff; border: none; border-radius: 6px; padding: 9px 16px; font-size: 13px; font-weight: 600; cursor: pointer; white-space: nowrap; font-family: 'Inter', sans-serif; }
  .footer-col-title { font-size: 14px; font-weight: 700; color: #fff; margin-bottom: 16px; }
  .footer-links { display: flex; flex-direction: column; gap: 9px; }
  .footer-link { font-size: 13px; color: rgba(255,255,255,0.45); cursor: pointer; background: none; border: none; text-align: left; padding: 0; font-family: 'Inter', sans-serif; transition: color 0.18s; text-decoration: none; display: block; }
  .footer-link:hover { color: #fff; }
  .footer-bottom { border-top: 1px solid rgba(255,255,255,0.08); padding-top: 24px; display: flex; justify-content: space-between; align-items: center; font-size: 12px; color: rgba(255,255,255,0.3); flex-wrap: wrap; gap: 12px; }

  @media (max-width: 1024px) {
    .search-row { grid-template-columns: 1fr 1fr; }
    .brands-grid { grid-template-columns: repeat(4,1fr); }
    .how-grid, .why-grid { grid-template-columns: repeat(2,1fr); }
    .why-item { border-right: none; border-bottom: 1px solid #E5E7F0; }
    .footer-grid { grid-template-columns: 1fr 1fr; }
    .promo-grid, .calc-grid { grid-template-columns: 1fr; }
    .testi-grid { grid-template-columns: 1fr 1fr; }
    .body-types-grid { grid-template-columns: repeat(3,1fr); }
    .stats-grid { grid-template-columns: repeat(2,1fr); }
    .stat-item:nth-child(2) { border-right: none; }
  }
  @media (max-width: 640px) {
    .hero-slides { height: 420px; }
    .brands-grid { grid-template-columns: repeat(3,1fr); }
    .testi-grid, .how-grid { grid-template-columns: 1fr; }
    .body-types-grid { grid-template-columns: repeat(2,1fr); }
    .search-row { grid-template-columns: 1fr; }
    .footer-grid { grid-template-columns: 1fr; }
  }
`;

const HERO_SLIDES = [
  { tag: 'For Sale', title: 'Find Your Perfect Car', specs: ['Verified Listings', 'KSH Pricing', 'Admin Approved'], agent: 'James Mwangi', role: 'Listings Manager', bg: '#f0f4ff' },
  { tag: 'For Hire', title: 'Flexible Car Hire in Kenya', specs: ['Daily & Long-term', 'Transparent Rates', 'Top Brands'], agent: 'Grace Njeri', role: 'Customer Experience', bg: '#f0f8f4' },
  { tag: 'New Arrivals', title: 'Latest Cars Just Listed', specs: ['New & Used', 'All Body Types', 'Nairobi & Beyond'], agent: 'Amina Hassan', role: 'Head of Technology', bg: '#fff8f0' },
];

const BRANDS = [
  { name: 'Toyota', count: 12 }, { name: 'Mercedes', count: 5 }, { name: 'BMW', count: 6 },
  { name: 'Land Rover', count: 4 }, { name: 'Volkswagen', count: 3 }, { name: 'Subaru', count: 4 },
  { name: 'Nissan', count: 5 }, { name: 'Audi', count: 3 }, { name: 'Kia', count: 2 },
  { name: 'Ford', count: 4 }, { name: 'Isuzu', count: 2 }, { name: 'Mazda', count: 3 },
];

const BODY_TYPES = [
  { name: 'SUV', count: 5, icon: '🚙' }, { name: 'Sedan', count: 3, icon: '🚘' },
  { name: 'Pickup', count: 2, icon: '🛻' }, { name: 'Hatchback', count: 2, icon: '🚗' },
  { name: 'Crossover', count: 4, icon: '🚙' }, { name: 'Coupe', count: 1, icon: '🏎' },
  { name: 'Minivan', count: 3, icon: '🚌' }, { name: 'Station Wagon', count: 2, icon: '🚗' },
  { name: 'Convertible', count: 1, icon: '🏎' }, { name: 'MVP', count: 0, icon: '🚐' },
];

const TESTIMONIALS = [
  { stars: 5, date: '15 May 2024', text: 'Roditec made buying my first car a breeze. Verified listings, honest pricing — I drove away exactly happy.', name: 'James Mwangi', role: 'Nairobi', initials: 'JM' },
  { stars: 5, date: '20 May 2024', text: 'Admin-verified listings gave me complete confidence. No scams, no surprises. Highly recommend Roditec.', name: 'Amina Hassan', role: 'Mombasa', initials: 'AH' },
  { stars: 5, date: '22 May 2024', text: 'Hired a car for our corporate event. Seamless process and professional service. Will use again.', name: 'Grace Njeri', role: 'Fleet Manager', initials: 'GN' },
];

const PARTNERS = ['Toyota', 'Land Rover', 'BMW', 'Mercedes', 'Nissan', 'Audi', 'VW', 'Kia', 'Ford', 'Isuzu', 'Subaru', 'Mazda'];

export default function Home() {
  const [activeTab,  setActiveTab]  = useState('buy');
  const [make,       setMake]       = useState('');
  const [priceMax,   setPriceMax]   = useState('');
  const [carType,    setCarType]    = useState('');
  const [cars,       setCars]       = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [slideIdx,   setSlideIdx]   = useState(0);
  const [calcPrice,  setCalcPrice]  = useState(3000000);
  const [calcDown,   setCalcDown]   = useState(500000);
  const [calcMonths, setCalcMonths] = useState(36);
  const [calcRate,   setCalcRate]   = useState(14);
  const navigate = useNavigate();

  // ── fetch listings (original logic) ──
  useEffect(() => {
    const fetchCars = async () => {
      try {
        const res  = await fetch(`${API_BASE_URL}/api/listings/listings`);
        const data = await res.json();
        const active = data.filter(c => c.listing_status === 'active').slice(0, 8);
        setCars(active.map(c => ({
          id:           c.listing_id,
          make:         c.make        || 'Unknown',
          model:        c.model       || 'Model',
          year:         c.year        || 2024,
          price:        c.price?.$numberDecimal ? parseFloat(c.price.$numberDecimal) : 0,
          mileage:      c.mileage     || 0,
          fuelType:     c.fuelType    || 'Petrol',
          transmission: c.transmission|| 'Auto',
          carType:      c.carType     || 'SUV',
          rentSell:     c.RentSell,
          image:        c.images?.[0]?.url
            ? (c.images[0].url.startsWith('http') ? c.images[0].url : `${API_BASE_URL}${c.images[0].url}`)
            : '',
        })));
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetchCars();
  }, []);

  // Auto-advance hero
  useEffect(() => {
    const t = setInterval(() => setSlideIdx(i => (i + 1) % HERO_SLIDES.length), 5000);
    return () => clearInterval(t);
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (make)     params.set('make',     make);
    if (priceMax) params.set('priceMax', priceMax);
    if (carType)  params.set('type',     carType);
    navigate(`/CarExplore?${params.toString()}`);
  };

  const calcMonthly = () => {
    const p = calcPrice - calcDown;
    const r = calcRate / 100 / 12;
    if (r === 0) return Math.round(p / calcMonths);
    return Math.round(p * r * Math.pow(1 + r, calcMonths) / (Math.pow(1 + r, calcMonths) - 1));
  };

  const CarSkeleton = () => (
    <div style={{ background: '#fff', border: '1px solid #E5E7F0', borderRadius: 12, overflow: 'hidden' }}>
      <div className="skeleton" style={{ height: 195 }} />
      <div style={{ padding: 16 }}>
        <div className="skeleton" style={{ height: 14, width: '55%', marginBottom: 8 }} />
        <div className="skeleton" style={{ height: 18, width: '70%', marginBottom: 12 }} />
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          {[1,2,3].map(j => <div key={j} className="skeleton" style={{ height: 13, width: 64 }} />)}
        </div>
        <div className="skeleton" style={{ height: 1, marginBottom: 12 }} />
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div className="skeleton" style={{ height: 20, width: 100 }} />
          <div className="skeleton" style={{ height: 28, width: 60, borderRadius: 6 }} />
        </div>
      </div>
    </div>
  );

  const CarCard = ({ car }) => (
    <Link to={`/${car.rentSell === 'Rent' ? 'rent' : 'buy'}-car/${car.id}`} className="car-card">
      <div className="card-img-wrap">
        {car.image
          ? <img src={car.image} alt={`${car.make} ${car.model}`} className="card-img" />
          : <div className="card-img-placeholder">🚗</div>
        }
        <div className="card-badges">
          <span className={`badge ${car.rentSell === 'Rent' ? 'badge-hire' : 'badge-sale'}`}>
            {car.rentSell === 'Rent' ? 'For Hire' : 'For Sale'}
          </span>
        </div>
        <div className="card-year">{car.year}</div>
      </div>
      <div className="card-body">
        <div className="card-type">{car.carType}</div>
        <div className="card-name">{car.make} {car.model}</div>
        <div className="card-specs">
          <div className="card-spec"><Fuel size={12} />{car.fuelType}</div>
          <div className="card-spec"><Settings2 size={12} />{car.transmission}</div>
          <div className="card-spec"><Gauge size={12} />{car.mileage.toLocaleString()} km</div>
        </div>
        <div className="card-footer">
          <div>
            <div className="card-price">KSH {car.price.toLocaleString()}</div>
            {car.rentSell === 'Rent' && <div className="card-price-sub">per day</div>}
          </div>
        </div>
        <button className="btn-view">View car →</button>
      </div>
    </Link>
  );

  return (
    <div className="home-root">
      <style>{STYLES}</style>

      {/* ── HERO ── */}
      <div className="hero">
        <div className="hero-slides">
          {HERO_SLIDES.map((s, i) => (
            <div key={i} className={`hero-slide${i === slideIdx ? ' active' : ''}`} style={{ background: s.bg }}>
              <div className="hero-slide-bg" style={{ background: s.bg }} />
              <div className="hero-content">
                <div className="container">
                  <span className="hero-tag">{s.tag}</span>
                  <h1 className="hero-h1">{s.title}</h1>
                  <div className="hero-specs">
                    {s.specs.map(sp => <span key={sp} className="hero-spec">{sp}</span>)}
                  </div>
                  <div className="hero-btns">
                    <button className="btn-search" onClick={() => navigate('/CarExplore')}>
                      <Search size={15} /> Find Cars
                    </button>
                    <Link to="/ContactUs" style={{ background: '#fff', color: '#1A1A2E', border: '1px solid #E5E7F0', borderRadius: 8, padding: '10px 22px', fontFamily: 'Inter,sans-serif', fontWeight: 500, fontSize: 14, textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
                      Contact Us
                    </Link>
                  </div>
                  <div className="hero-agent">
                    <div className="hero-agent-av">{s.agent[0]}</div>
                    <div>
                      <div className="hero-agent-name">{s.agent}</div>
                      <div className="hero-agent-role">{s.role}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="hero-dots">
          {HERO_SLIDES.map((_, i) => (
            <button key={i} className={`hero-dot${i === slideIdx ? ' active' : ''}`} onClick={() => setSlideIdx(i)} />
          ))}
        </div>
        <button className="hero-nav hero-prev" onClick={() => setSlideIdx(i => (i - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}>‹</button>
        <button className="hero-nav hero-next" onClick={() => setSlideIdx(i => (i + 1) % HERO_SLIDES.length)}>›</button>
      </div>

      {/* ── SEARCH ── */}
      <div className="container">
        <div className="search-wrap">
          <div className="search-tabs">
            {['buy', 'rent', 'hire', 'new'].map(t => (
              <button key={t} className={`s-tab${activeTab === t ? ' active' : ''}`} onClick={() => setActiveTab(t)}>
                {t === 'buy' ? 'Buy Car' : t === 'rent' ? 'Rent Car' : t === 'hire' ? 'For Hire' : 'New Arrivals'}
              </button>
            ))}
          </div>
          <div className="search-row">
            <div className="sf">
              <label>Make</label>
              <select value={make} onChange={e => setMake(e.target.value)}>
                <option value="">All Makes</option>
                {BRANDS.map(b => <option key={b.name} value={b.name}>{b.name}</option>)}
              </select>
            </div>
            <div className="sf">
              <label>Body Type</label>
              <select value={carType} onChange={e => setCarType(e.target.value)}>
                <option value="">All Types</option>
                {BODY_TYPES.map(b => <option key={b.name} value={b.name}>{b.name}</option>)}
              </select>
            </div>
            <div className="sf">
              <label>Budget (KSH)</label>
              <select value={priceMax} onChange={e => setPriceMax(e.target.value)}>
                <option value="">Any Price</option>
                <option value="1000000">Under 1M</option>
                <option value="2000000">Under 2M</option>
                <option value="3000000">Under 3M</option>
                <option value="5000000">Under 5M</option>
                <option value="10000000">Under 10M</option>
              </select>
            </div>
            <div className="sf">
              <label>Location</label>
              <select>
                <option>All Kenya</option>
                <option>Nairobi</option>
                <option>Mombasa</option>
                <option>Kisumu</option>
                <option>Nakuru</option>
              </select>
            </div>
            <button className="btn-search" onClick={handleSearch}>
              <Search size={15} /> Find Cars
            </button>
          </div>
          <button className="search-more" onClick={() => navigate('/CarExplore')}>+ Advanced search options →</button>
        </div>
      </div>

      {/* Trending */}
      <div className="container" style={{ padding: '32px 24px 16px', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: '#8888A8' }}>Trending:</span>
        <div className="body-tabs" style={{ margin: 0 }}>
          {['SUV', 'Sedan', 'Pickup', 'Hatchback', 'Crossover', 'Minivan'].map(b => (
            <button key={b} className="body-tab" onClick={() => navigate('/CarExplore')}>{b}</button>
          ))}
        </div>
      </div>

      {/* ── FEATURED CARS ── */}
      <section className="section">
        <div className="container">
          <div className="sec-head">
            <div>
              <div className="sec-label">Hot Inventory</div>
              <div className="sec-title">Cars By Body Type</div>
              <div className="sec-sub">Browse our verified Kenyan inventory</div>
            </div>
            <Link to="/CarExplore" className="view-all">View all →</Link>
          </div>
          <div className="body-tabs">
            {['All Cars', 'SUV', 'Sedan', 'Crossover', 'Hatchback', 'Minivan'].map(b => (
              <button key={b} className={`body-tab${b === 'All Cars' ? ' active' : ''}`} onClick={() => navigate('/CarExplore')}>{b}</button>
            ))}
          </div>
          <div className="cars-grid">
            {loading ? Array.from({ length: 6 }).map((_, i) => <CarSkeleton key={i} />) : cars.map(c => <CarCard key={c.id} car={c} />)}
          </div>
        </div>
      </section>

      {/* ── BRANDS ── */}
      <div className="brands-bg">
        <div className="container">
          <div className="sec-head">
            <div className="sec-title">What would you like to find?</div>
            <Link to="/CarExplore" className="view-all">View all →</Link>
          </div>
          <div className="brands-grid">
            {BRANDS.map(b => (
              <div key={b.name} className="brand-card" onClick={() => navigate('/CarExplore')}>
                <div className="brand-logo">{b.name}</div>
                <div className="brand-count">{b.count} Car{b.count !== 1 ? 's' : ''}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── BODY TYPES ── */}
      <section className="section">
        <div className="container">
          <div className="sec-head">
            <div className="sec-title">Search by body</div>
          </div>
          <div className="body-types-grid">
            {BODY_TYPES.map(b => (
              <div key={b.name} className="body-type-card" onClick={() => navigate('/CarExplore')}>
                <div className="body-type-icon">{b.icon}</div>
                <div className="body-type-name">{b.name}</div>
                <div className="body-type-count">{b.count} Car{b.count !== 1 ? 's' : ''}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="section" style={{ background: '#F7F8FC' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div className="sec-title">Find your dream car easily and quickly</div>
            <p style={{ fontSize: 14, color: '#8888A8', marginTop: 8 }}>Browse verified listings from admin-approved dealers across Kenya</p>
          </div>
          <div className="how-grid">
            {[
              { icon: '🔍', title: 'Browse Inventory', text: 'Find the ideal car and browse our verified, admin-approved listings.' },
              { icon: '💰', title: 'Get an Offer', text: "What's your car worth? Get the best trade-in value." },
              { icon: '📋', title: 'Apply for Financing', text: 'Fill out our credit approval form for your next vehicle purchase.' },
              { icon: '🔧', title: 'Expert Service', text: 'Our team keeps your vehicle in top running condition.' },
            ].map(h => (
              <div key={h.title} className="how-card">
                <div className="how-icon">{h.icon}</div>
                <div className="how-title">{h.title}</div>
                <p className="how-text">{h.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── RECOMMENDED ── */}
      <section className="section">
        <div className="container">
          <div className="sec-head">
            <div>
              <div className="sec-label">Curated For You</div>
              <div className="sec-title">Recommended Cars</div>
            </div>
            <Link to="/CarExplore" className="view-all">View all →</Link>
          </div>
          <div className="cars-grid">
            {loading ? Array.from({ length: 4 }).map((_, i) => <CarSkeleton key={i} />) : cars.slice(0, 4).map(c => <CarCard key={c.id} car={c} />)}
          </div>
        </div>
      </section>

      {/* ── PROMO ── */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="promo-grid">
            <div className="promo-card promo-1">
              <div className="promo-img">🚗</div>
              <div className="promo-h">Looking for a car?</div>
              <p className="promo-p">Save time — find the right car without visiting multiple dealers.</p>
              <button className="btn-search" style={{ alignSelf: 'flex-start' }} onClick={() => navigate('/CarExplore')}>Find Cars →</button>
            </div>
            <div className="promo-card promo-2">
              <div className="promo-img">🚙</div>
              <div className="promo-h">Want to hire a car?</div>
              <p className="promo-p">Flexible hire options for any duration. Verified, trusted dealers only.</p>
              <button className="btn-search" style={{ alignSelf: 'flex-start', background: '#2D9C5A' }} onClick={() => navigate('/CarExplore')}>Browse Hire →</button>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY US ── */}
      <div style={{ borderTop: '1px solid #E5E7F0', borderBottom: '1px solid #E5E7F0' }}>
        <div className="container" style={{ padding: '64px 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div className="sec-label" style={{ justifyContent: 'center', display: 'flex' }}>Why Roditec</div>
            <div className="sec-title">The Roditec Difference</div>
          </div>
          <div className="why-grid">
            {[
              { icon: Shield, num: '100%', label: 'Vehicles verified by admin before listing' },
              { icon: Award,  num: '500+', label: 'Active cars across all categories' },
              { icon: Users,  num: '4,200+', label: 'Cars sold and hired across Kenya' },
              { icon: Clock,  num: '24/7', label: 'Support team available around the clock' },
            ].map(({ icon: Icon, num, label }) => (
              <div key={label} className="why-item">
                <div className="why-icon"><Icon size={22} /></div>
                <div className="why-num">{num}</div>
                <div className="why-label">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── LOAN CALCULATOR ── */}
      <div className="calc-wrap">
        <div className="container">
          <div className="calc-grid">
            <div className="calc-info">
              <div className="sec-label">Financing</div>
              <div className="calc-info-title">Auto Loan Calculator</div>
              <p>Estimate your monthly car payments in KSH. Get a clear picture of your financing before visiting our showroom.</p>
              <Link to="/ContactUs" className="btn-search" style={{ display: 'inline-flex', textDecoration: 'none', marginTop: 4 }}>
                Apply for a Loan →
              </Link>
            </div>
            <div className="calc-form">
              <div className="calc-title">Estimate Monthly Payment</div>
              {[
                { label: 'Total Price (KSH)', id: 'price', val: calcPrice, set: setCalcPrice },
                { label: 'Down Payment (KSH)', id: 'down', val: calcDown, set: setCalcDown },
                { label: 'Interest Rate (%)', id: 'rate', val: calcRate, set: setCalcRate, step: 0.5 },
              ].map(f => (
                <div key={f.id} className="calc-field">
                  <label className="calc-label">{f.label}</label>
                  <input className="calc-input" type="number" value={f.val} step={f.step || 1} onChange={e => f.set(+e.target.value)} />
                </div>
              ))}
              <div className="calc-field">
                <label className="calc-label">Term (months)</label>
                <select className="calc-input" value={calcMonths} onChange={e => setCalcMonths(+e.target.value)}>
                  {[12,24,36,48,60].map(m => <option key={m} value={m}>{m} months</option>)}
                </select>
              </div>
              <div className="calc-result">
                <div className="calc-result-label">Estimated Monthly Payment</div>
                <div className="calc-result-val">KSH {calcMonthly().toLocaleString()}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── TESTIMONIALS ── */}
      <section className="section">
        <div className="container">
          <div className="sec-head">
            <div>
              <div className="sec-label">Happy Clients</div>
              <div className="sec-title">We love our clients</div>
            </div>
          </div>
          <div className="testi-grid">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="testi-card">
                <div className="testi-stars">{'★'.repeat(t.stars)}</div>
                <p className="testi-text">"{t.text}"</p>
                <div className="testi-author">
                  <div className="testi-av">{t.initials}</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#1A1A2E' }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: '#8888A8', display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={11} />{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PARTNERS ── */}
      <div className="partners-wrap">
        <div className="container">
          <div style={{ fontFamily: "'Manrope',sans-serif", fontSize: 18, fontWeight: 700, color: '#1A1A2E', marginBottom: 20 }}>Our partners</div>
          <div className="partners-track">
            {PARTNERS.map(p => <div key={p} className="partner-pill">{p}</div>)}
          </div>
        </div>
      </div>

      {/* ── STATS ── */}
      <div className="stats-bar">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item"><div className="stat-n">#1</div><div className="stat-l">Car Portal in Kenya</div></div>
            <div className="stat-item"><div className="stat-n">500+</div><div className="stat-l">Active Listings</div></div>
            <div className="stat-item"><div className="stat-n">4,200+</div><div className="stat-l">Cars Sold & Hired</div></div>
            <div className="stat-item"><div className="stat-n">47</div><div className="stat-l">Verified Dealers</div></div>
          </div>
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="cta-strip">
        <div className="container">
          <div className="cta-inner">
            <h2 className="cta-h">Ready to find your perfect car?</h2>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link to="/CarExplore" className="btn-cta-white">Browse Inventory →</Link>
              <Link to="/ContactUs" style={{ background: 'transparent', color: '#fff', border: '2px solid rgba(255,255,255,0.4)', borderRadius: 8, padding: '13px 28px', fontFamily: 'Inter,sans-serif', fontWeight: 600, fontSize: 14, textDecoration: 'none', whiteSpace: 'nowrap', transition: 'all .18s', display: 'inline-block' }}>
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer>
        <div className="container">
          <div className="footer-grid">
            <div>
              <div className="footer-brand"><div className="footer-brand-dot" />Roditec</div>
              <p className="footer-desc">Kenya's premier platform for car sales and hire. Verified listings, trusted dealers, transparent KSH pricing.</p>
              <div className="footer-newsletter">
                <input className="footer-input" placeholder="Your email address" />
                <button className="btn-subscribe">Subscribe</button>
              </div>
            </div>
            <div>
              <div className="footer-col-title">Inventory</div>
              <div className="footer-links">
                <Link to="/CarExplore" className="footer-link">Cars for Sale</Link>
                <Link to="/CarExplore" className="footer-link">Cars for Hire</Link>
                <Link to="/CarExplore" className="footer-link">New Arrivals</Link>
                <Link to="/CarExplore" className="footer-link">Luxury Fleet</Link>
              </div>
            </div>
            <div>
              <div className="footer-col-title">Company</div>
              <div className="footer-links">
                <Link to="/AboutUs" className="footer-link">About Us</Link>
                <Link to="/ContactUs" className="footer-link">Contact</Link>
                <a href="#" className="footer-link">FAQs</a>
                <a href="#" className="footer-link">Terms & Conditions</a>
              </div>
            </div>
            <div>
              <div className="footer-col-title">Contact</div>
              <div className="footer-links">
                <span className="footer-link" style={{ cursor: 'default' }}>📍 Nairobi, Kenya</span>
                <span className="footer-link" style={{ cursor: 'default' }}>📞 +254 700 000 000</span>
                <span className="footer-link" style={{ cursor: 'default' }}>✉️ info@roditec.co.ke</span>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© 2025 Roditec. All rights reserved.</span>
            <span>Nairobi, Kenya · info@roditec.co.ke</span>
          </div>
        </div>
      </footer>
    </div>
  );
}