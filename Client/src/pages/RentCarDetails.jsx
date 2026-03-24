import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Fuel, Settings2, Gauge, Calendar, Car, Shield,
  CheckCircle, ChevronLeft, ChevronRight, Phone, Mail,
  MapPin, Star, Share2, Heart, Clock, Users, Umbrella,
  Navigation, Baby, CreditCard
} from 'lucide-react';
import API_BASE_URL from '../config/apiConfig';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@600;700;800&family=Inter:wght@400;500;600&display=swap');

  .rent-detail-root {
    background: #fff;
    color: #1A1A2E;
    font-family: 'Inter', sans-serif;
    min-height: 100vh;
    padding-top: 100px;
  }

  .breadcrumb { background: #F7F8FC; border-bottom: 1px solid #E5E7F0; padding: 14px 24px; }
  .breadcrumb-inner { max-width: 1280px; margin: 0 auto; display: flex; align-items: center; gap: 6px; font-size: 13px; color: #8888A8; }
  .breadcrumb-inner a { color: #8888A8; text-decoration: none; transition: color .18s; }
  .breadcrumb-inner a:hover { color: #3B6BF0; }
  .breadcrumb-inner .sep { opacity: .4; }
  .breadcrumb-inner .current { color: #1A1A2E; font-weight: 500; }
  .back-btn { display: flex; align-items: center; gap: 5px; color: #8888A8; font-size: 13px; font-weight: 500; background: none; border: none; cursor: pointer; font-family: 'Inter',sans-serif; transition: color .18s; margin-right: 4px; }
  .back-btn:hover { color: #3B6BF0; }

  .detail-inner { max-width: 1280px; margin: 0 auto; padding: 32px 24px 64px; display: grid; grid-template-columns: 1fr 380px; gap: 32px; align-items: start; }
  @media (max-width: 1024px) { .detail-inner { grid-template-columns: 1fr; } }

  /* GALLERY */
  .main-img-wrap { position: relative; height: 460px; border-radius: 12px; overflow: hidden; background: #F7F8FC; margin-bottom: 10px; border: 1px solid #E5E7F0; }
  .main-img { width: 100%; height: 100%; object-fit: cover; }
  .img-placeholder { width: 100%; height: 100%; background: linear-gradient(135deg,#EEF2FF,#dce8ff); display: flex; align-items: center; justify-content: center; font-size: 80px; }

  .gallery-badge { position: absolute; top: 14px; left: 14px; background: #D1E7DD; color: #0A5C36; font-size: 10px; font-weight: 700; letter-spacing: .8px; text-transform: uppercase; padding: 5px 12px; border-radius: 4px; }
  .gallery-actions { position: absolute; top: 14px; right: 14px; display: flex; gap: 7px; }
  .gal-btn { width: 36px; height: 36px; border-radius: 8px; background: rgba(255,255,255,.92); backdrop-filter: blur(8px); border: 1px solid #E5E7F0; color: #4A4A68; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all .18s; }
  .gal-btn:hover { background: #EEF2FF; color: #3B6BF0; border-color: #3B6BF0; }
  .gal-btn.liked { color: #E63946; border-color: rgba(230,57,70,.3); }

  .gallery-arrow { position: absolute; top: 50%; transform: translateY(-50%); width: 36px; height: 36px; border-radius: 8px; background: rgba(255,255,255,.9); border: 1px solid #E5E7F0; color: #4A4A68; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all .18s; }
  .gallery-arrow:hover { background: #3B6BF0; color: #fff; border-color: #3B6BF0; }
  .gallery-arrow.left { left: 12px; }
  .gallery-arrow.right { right: 12px; }

  .gallery-dots { position: absolute; bottom: 14px; left: 50%; transform: translateX(-50%); display: flex; gap: 5px; background: rgba(255,255,255,.85); backdrop-filter: blur(8px); padding: 6px 10px; border-radius: 20px; border: 1px solid #E5E7F0; }
  .nav-dot { width: 6px; height: 6px; border-radius: 50%; background: rgba(59,107,240,.25); cursor: pointer; transition: all .2s; border: none; padding: 0; }
  .nav-dot.active { background: #3B6BF0; width: 18px; border-radius: 3px; }

  .thumb-row { display: flex; gap: 8px; overflow-x: auto; scrollbar-width: none; }
  .thumb-row::-webkit-scrollbar { display: none; }
  .thumb { width: 80px; height: 60px; border-radius: 8px; overflow: hidden; flex-shrink: 0; cursor: pointer; border: 2px solid transparent; transition: border-color .18s; background: #F7F8FC; }
  .thumb.active { border-color: #3B6BF0; }
  .thumb img { width: 100%; height: 100%; object-fit: cover; }

  /* CAR INFO */
  .car-info { margin-top: 28px; }
  .info-header { margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px solid #E5E7F0; }
  .info-title { font-family: 'Manrope',sans-serif; font-size: clamp(22px,3vw,32px); font-weight: 800; color: #1A1A2E; line-height: 1.15; margin-bottom: 10px; }
  .info-sub { font-size: 13px; color: #8888A8; display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
  .availability-badge { display: inline-flex; align-items: center; gap: 5px; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; letter-spacing: .5px; text-transform: uppercase; background: #D1E7DD; color: #0A5C36; }
  .rating-chip { display: flex; align-items: center; gap: 5px; background: #FFF3CD; border: 1px solid #FFDA6A; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; color: #856404; }

  .specs-grid { display: grid; grid-template-columns: repeat(auto-fill,minmax(148px,1fr)); gap: 12px; margin-bottom: 28px; }
  .spec-card { background: #F7F8FC; border: 1px solid #E5E7F0; border-radius: 10px; padding: 14px; display: flex; flex-direction: column; gap: 6px; transition: all .18s; }
  .spec-card:hover { border-color: #3B6BF0; background: #EEF2FF; }
  .spec-icon { color: #3B6BF0; }
  .spec-label { font-size: 10px; font-weight: 700; letter-spacing: .8px; text-transform: uppercase; color: #8888A8; }
  .spec-value { font-family: 'Manrope',sans-serif; font-weight: 700; font-size: 14px; color: #1A1A2E; }

  .info-section { margin-bottom: 28px; }
  .info-section-title { font-family: 'Manrope',sans-serif; font-size: 14px; font-weight: 700; letter-spacing: .5px; text-transform: uppercase; color: #1A1A2E; margin-bottom: 14px; padding-bottom: 10px; border-bottom: 1px solid #E5E7F0; display: flex; align-items: center; gap: 8px; }
  .info-section-title::before { content: ''; width: 3px; height: 14px; background: #3B6BF0; border-radius: 2px; display: inline-block; }
  .description-text { font-size: 14px; color: #4A4A68; line-height: 1.8; }
  .features-grid { display: grid; grid-template-columns: repeat(auto-fill,minmax(180px,1fr)); gap: 8px; }
  .feature-item { display: flex; align-items: center; gap: 8px; font-size: 13px; color: #4A4A68; font-weight: 500; }
  .feature-dot { width: 6px; height: 6px; border-radius: 50%; background: #3B6BF0; flex-shrink: 0; }

  /* ADD-ONS */
  .addons-grid { display: grid; grid-template-columns: repeat(auto-fill,minmax(195px,1fr)); gap: 12px; }
  .addon-card { background: #F7F8FC; border: 2px solid #E5E7F0; border-radius: 10px; padding: 16px; cursor: pointer; transition: all .18s; }
  .addon-card:hover { border-color: #3B6BF0; background: #EEF2FF; }
  .addon-card.selected { border-color: #3B6BF0; background: #EEF2FF; }
  .addon-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px; }
  .addon-icon { width: 34px; height: 34px; border-radius: 8px; background: #EEF2FF; display: flex; align-items: center; justify-content: center; color: #3B6BF0; }
  .addon-check { width: 18px; height: 18px; border-radius: 50%; border: 2px solid #E5E7F0; background: transparent; transition: all .18s; display: flex; align-items: center; justify-content: center; }
  .addon-card.selected .addon-check { background: #3B6BF0; border-color: #3B6BF0; }
  .addon-name { font-weight: 600; font-size: 13px; color: #1A1A2E; margin-bottom: 2px; }
  .addon-price { font-size: 12px; color: #3B6BF0; font-weight: 600; }

  /* POLICY */
  .policy-grid { display: grid; grid-template-columns: repeat(auto-fill,minmax(190px,1fr)); gap: 12px; }
  .policy-item { background: #F7F8FC; border: 1px solid #E5E7F0; border-radius: 10px; padding: 14px; display: flex; flex-direction: column; gap: 4px; }
  .policy-label { font-size: 10px; font-weight: 700; letter-spacing: .8px; text-transform: uppercase; color: #8888A8; }
  .policy-value { font-size: 13px; font-weight: 600; color: #1A1A2E; }

  /* SIDEBAR */
  .detail-sidebar { position: sticky; top: 110px; display: flex; flex-direction: column; gap: 14px; }

  .booking-card { background: #fff; border: 1px solid #E5E7F0; border-radius: 12px; padding: 24px; box-shadow: 0 4px 20px rgba(0,0,0,.06); }
  .booking-title { font-family: 'Manrope',sans-serif; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: .5px; color: #1A1A2E; margin-bottom: 18px; }

  .per-day-badge { display: flex; align-items: center; justify-content: space-between; background: #EEF2FF; border: 1px solid rgba(59,107,240,.2); border-radius: 10px; padding: 14px 16px; margin-bottom: 16px; }
  .per-day-label { font-size: 11px; color: #8888A8; font-weight: 600; text-transform: uppercase; letter-spacing: .5px; margin-bottom: 2px; }
  .per-day-price { font-family: 'Manrope',sans-serif; font-weight: 800; font-size: 26px; color: #1A1A2E; line-height: 1; }
  .per-day-sub { font-size: 11px; color: #8888A8; }

  .date-fields { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 12px; }
  .date-field label { display: block; font-size: 10px; font-weight: 700; letter-spacing: .8px; text-transform: uppercase; color: #8888A8; margin-bottom: 5px; }
  .date-input { width: 100%; background: #F7F8FC; border: 1px solid #E5E7F0; border-radius: 8px; padding: 9px 12px; color: #1A1A2E; font-family: 'Inter',sans-serif; font-size: 13px; outline: none; transition: border .18s; }
  .date-input:focus { border-color: #3B6BF0; background: #fff; }

  .days-display { background: #F7F8FC; border: 1px solid #E5E7F0; border-radius: 8px; padding: 10px 14px; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center; font-size: 13px; }
  .days-label { color: #8888A8; font-weight: 500; }
  .days-value { color: #3B6BF0; font-weight: 700; font-family: 'Manrope',sans-serif; font-size: 16px; }

  .sidebar-divider { height: 1px; background: #E5E7F0; margin: 14px 0; }

  .breakdown-row { display: flex; justify-content: space-between; align-items: center; font-size: 13px; margin-bottom: 7px; }
  .breakdown-label { color: #8888A8; }
  .breakdown-value { color: #1A1A2E; font-weight: 500; }
  .breakdown-total { display: flex; justify-content: space-between; align-items: center; margin-top: 10px; padding-top: 10px; border-top: 1px solid #E5E7F0; }
  .breakdown-total .breakdown-label { color: #1A1A2E; font-weight: 700; font-size: 14px; }
  .breakdown-total .breakdown-value { color: #3B6BF0; font-weight: 800; font-family: 'Manrope',sans-serif; font-size: 18px; }

  .rent-btn { width: 100%; background: #3B6BF0; color: #fff; border: none; padding: 14px; border-radius: 8px; font-family: 'Inter',sans-serif; font-weight: 700; font-size: 15px; cursor: pointer; transition: all .2s; display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: 16px; }
  .rent-btn:hover { background: #2952CC; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(59,107,240,.3); }
  .rent-btn:disabled { opacity: .5; cursor: not-allowed; transform: none; box-shadow: none; }

  .contact-card { background: #fff; border: 1px solid #E5E7F0; border-radius: 12px; padding: 20px; }
  .contact-title { font-family: 'Manrope',sans-serif; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: .5px; color: #1A1A2E; margin-bottom: 16px; }
  .contact-row { display: flex; align-items: center; gap: 12px; padding: 10px 0; border-bottom: 1px solid #F0F0F8; }
  .contact-row:last-child { border-bottom: none; }
  .contact-icon { width: 36px; height: 36px; border-radius: 8px; background: #EEF2FF; display: flex; align-items: center; justify-content: center; color: #3B6BF0; flex-shrink: 0; }
  .contact-label { font-size: 10px; color: #8888A8; font-weight: 600; text-transform: uppercase; letter-spacing: .5px; }
  .contact-value { font-size: 13px; color: #1A1A2E; font-weight: 600; }

  .skeleton { background: linear-gradient(90deg,#f0f2f8 25%,#e6eaf6 50%,#f0f2f8 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: 8px; }
  @keyframes shimmer { from { background-position: 200% 0; } to { background-position: -200% 0; } }
`;

const ADD_ONS = [
  { id: 'insurance', icon: Umbrella, name: 'Insurance Cover', price: 1500, unit: '/day' },
  { id: 'gps',       icon: Navigation, name: 'GPS Navigation', price: 500,  unit: '/day' },
  { id: 'childseat', icon: Baby,       name: 'Child Seat',     price: 700,  unit: '/day' },
  { id: 'driver',    icon: Users,      name: 'With Driver',    price: 3000, unit: '/day' },
];

const DEFAULT_FEATURES = ['Air Conditioning','Power Steering','ABS Brakes','Bluetooth','Backup Camera','USB Ports'];

export default function RentCarDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car,            setCar]            = useState(null);
  const [loading,        setLoading]        = useState(true);
  const [activeImg,      setActiveImg]      = useState(0);
  const [liked,          setLiked]          = useState(false);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [startDate,      setStartDate]      = useState('');
  const [endDate,        setEndDate]        = useState('');

  // original fetch logic
  useEffect(() => {
    const fetchCar = async () => {
      try {
        const res  = await fetch(`${API_BASE_URL}/api/listings/listings/${id}`);
        const data = await res.json();
        setCar(data);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetchCar();
  }, [id]);

  const imgUrl = (img) => {
    if (!img) return null;
    if (typeof img === 'string') return img.startsWith('http') ? img : `${API_BASE_URL}${img}`;
    if (img.url) return img.url.startsWith('http') ? img.url : `${API_BASE_URL}${img.url}`;
    return null;
  };

  const images    = car?.images?.map(imgUrl).filter(Boolean) || [];
  const dailyRate = car?.price?.$numberDecimal ? parseFloat(car.price.$numberDecimal) : (car?.price || 0);

  // original pricing logic
  const numDays = (() => {
    if (!startDate || !endDate) return 1;
    const d = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));
    return d > 0 ? d : 1;
  })();

  const addonTotal  = selectedAddons.reduce((sum, addonId) => { const a = ADD_ONS.find(x => x.id === addonId); return sum + (a?.price || 0); }, 0);
  const totalPerDay = dailyRate + addonTotal;
  const grandTotal  = totalPerDay * numDays;
  const toggleAddon = (id) => setSelectedAddons(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

  if (loading) return (
    <div className="rent-detail-root" style={{ padding: '40px 24px' }}>
      <style>{STYLES}</style>
      <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 380px', gap: 32 }}>
        <div>
          <div className="skeleton" style={{ height: 460, borderRadius: 12, marginBottom: 10 }} />
          <div style={{ display: 'flex', gap: 8 }}>{[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ width: 80, height: 60, borderRadius: 8 }} />)}</div>
        </div>
        <div className="skeleton" style={{ height: 420, borderRadius: 12 }} />
      </div>
    </div>
  );

  if (!car) return (
    <div className="rent-detail-root" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <style>{STYLES}</style>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>🚗</div>
        <div style={{ fontFamily: 'Manrope,sans-serif', fontSize: 22, fontWeight: 700, color: '#1A1A2E', marginBottom: 8 }}>Car not found</div>
        <button className="back-btn" onClick={() => navigate('/CarExplore')} style={{ color: '#3B6BF0', fontSize: 14 }}>← Back to listings</button>
      </div>
    </div>
  );

  return (
    <div className="rent-detail-root">
      <style>{STYLES}</style>

      <div className="breadcrumb">
        <div className="breadcrumb-inner">
          <button className="back-btn" onClick={() => navigate('/CarExplore')}><ArrowLeft size={14} /></button>
          <a href="/">Home</a><span className="sep">/</span>
          <a href="/CarExplore">Hire Car</a><span className="sep">/</span>
          <span className="current">{car.make} {car.model}</span>
        </div>
      </div>

      <div className="detail-inner">
        {/* LEFT */}
        <div>
          {/* Gallery */}
          <div style={{ position: 'relative' }}>
            <div className="main-img-wrap">
              {images.length > 0
                ? <img src={images[activeImg]} alt={`${car.make} ${car.model}`} className="main-img" />
                : <div className="img-placeholder">🚗</div>
              }
              <div className="gallery-badge">For Hire</div>
              <div className="gallery-actions">
                <button className={`gal-btn${liked ? ' liked' : ''}`} onClick={() => setLiked(!liked)}>
                  <Heart size={15} fill={liked ? '#E63946' : 'none'} />
                </button>
                <button className="gal-btn" onClick={() => navigator.clipboard?.writeText(window.location.href)}>
                  <Share2 size={15} />
                </button>
              </div>
              {images.length > 1 && (
                <>
                  <button className="gallery-arrow left" onClick={() => setActiveImg(p => (p - 1 + images.length) % images.length)}><ChevronLeft size={17} /></button>
                  <button className="gallery-arrow right" onClick={() => setActiveImg(p => (p + 1) % images.length)}><ChevronRight size={17} /></button>
                  <div className="gallery-dots">
                    {images.map((_, i) => <button key={i} className={`nav-dot${i === activeImg ? ' active' : ''}`} onClick={() => setActiveImg(i)} />)}
                  </div>
                </>
              )}
            </div>
            {images.length > 1 && (
              <div className="thumb-row">
                {images.map((img, i) => (
                  <div key={i} className={`thumb${i === activeImg ? ' active' : ''}`} onClick={() => setActiveImg(i)}>
                    <img src={img} alt={`thumb ${i + 1}`} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="car-info">
            <div className="info-header">
              <h1 className="info-title">{car.year} {car.make} {car.model}</h1>
              <div className="info-sub">
                <span className="availability-badge">
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor', display: 'inline-block' }} />
                  Available Now
                </span>
                <div className="rating-chip"><Star size={12} fill="#F4A017" color="#F4A017" />4.8 (42 reviews)</div>
                {car.location && <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={12} />{car.location}</span>}
              </div>
            </div>

            <div className="specs-grid">
              {[
                { icon: Calendar,  label: 'Year',         value: car.year },
                { icon: Gauge,     label: 'Mileage',      value: `${(car.mileage || 0).toLocaleString()} km` },
                { icon: Fuel,      label: 'Fuel',         value: car.fuelType || 'Petrol' },
                { icon: Settings2, label: 'Transmission', value: car.transmission || 'Auto' },
                { icon: Car,       label: 'Body Type',    value: car.carType || '—' },
                { icon: Users,     label: 'Seats',        value: car.seats || '5' },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="spec-card">
                  <Icon size={17} className="spec-icon" />
                  <div className="spec-label">{label}</div>
                  <div className="spec-value">{value}</div>
                </div>
              ))}
            </div>

            {car.description && (
              <div className="info-section">
                <div className="info-section-title">About this Car</div>
                <p className="description-text">{car.description}</p>
              </div>
            )}

            <div className="info-section">
              <div className="info-section-title">Features Included</div>
              <div className="features-grid">
                {(car.features?.length ? car.features : DEFAULT_FEATURES).map((f, i) => (
                  <div key={i} className="feature-item"><div className="feature-dot" />{f}</div>
                ))}
              </div>
            </div>

            {/* Add-ons */}
            <div className="info-section">
              <div className="info-section-title">Optional Add-Ons</div>
              <div className="addons-grid">
                {ADD_ONS.map(addon => (
                  <div key={addon.id} className={`addon-card${selectedAddons.includes(addon.id) ? ' selected' : ''}`} onClick={() => toggleAddon(addon.id)}>
                    <div className="addon-header">
                      <div className="addon-icon"><addon.icon size={16} /></div>
                      <div className="addon-check">
                        {selectedAddons.includes(addon.id) && <CheckCircle size={13} color="#fff" />}
                      </div>
                    </div>
                    <div className="addon-name">{addon.name}</div>
                    <div className="addon-price">+KSH {addon.price.toLocaleString()}{addon.unit}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Policy */}
            <div className="info-section">
              <div className="info-section-title">Rental Policy</div>
              <div className="policy-grid">
                {[
                  { label: 'Min Rental',   value: '1 Day' },
                  { label: 'Fuel Policy',  value: 'Full to Full' },
                  { label: 'Mileage',      value: '150 km/day included' },
                  { label: 'Extra KM',     value: 'KSH 25 per km' },
                  { label: 'Driver Age',   value: '21+ years' },
                  { label: 'Deposit',      value: 'KSH 10,000' },
                ].map(({ label, value }) => (
                  <div key={label} className="policy-item">
                    <div className="policy-label">{label}</div>
                    <div className="policy-value">{value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* SIDEBAR */}
        <div className="detail-sidebar">
          <div className="booking-card">
            <div className="booking-title">Book This Car</div>

            <div className="per-day-badge">
              <div>
                <div className="per-day-label">Daily Rate</div>
                <div className="per-day-price">KSH {dailyRate.toLocaleString()}</div>
                <div className="per-day-sub">per day</div>
              </div>
              <Clock size={26} color="rgba(59,107,240,0.25)" />
            </div>

            <div className="date-fields">
              <div className="date-field">
                <label>Pick-up Date</label>
                <input type="date" className="date-input" value={startDate} min={new Date().toISOString().split('T')[0]} onChange={e => setStartDate(e.target.value)} />
              </div>
              <div className="date-field">
                <label>Return Date</label>
                <input type="date" className="date-input" value={endDate} min={startDate || new Date().toISOString().split('T')[0]} onChange={e => setEndDate(e.target.value)} />
              </div>
            </div>

            {startDate && endDate && (
              <div className="days-display">
                <span className="days-label">Duration</span>
                <span className="days-value">{numDays} day{numDays !== 1 ? 's' : ''}</span>
              </div>
            )}

            <div className="sidebar-divider" />

            <div className="breakdown-row"><span className="breakdown-label">KSH {dailyRate.toLocaleString()} × {numDays} day{numDays !== 1 ? 's' : ''}</span><span className="breakdown-value">KSH {(dailyRate * numDays).toLocaleString()}</span></div>
            {selectedAddons.map(addonId => {
              const a = ADD_ONS.find(x => x.id === addonId);
              return a ? (
                <div key={addonId} className="breakdown-row">
                  <span className="breakdown-label">{a.name}</span>
                  <span className="breakdown-value">KSH {(a.price * numDays).toLocaleString()}</span>
                </div>
              ) : null;
            })}
            <div className="breakdown-total">
              <span className="breakdown-label">Total</span>
              <span className="breakdown-value">KSH {grandTotal.toLocaleString()}</span>
            </div>

            <button
              className="rent-btn"
              onClick={() => navigate(`/payment/${car.listing_id}?days=${numDays}&addons=${selectedAddons.join(',')}`)}
              disabled={car.listing_status !== 'active'}
            >
              <CreditCard size={16} />
              {car.listing_status === 'active' ? 'Reserve Now' : 'Not Available'}
            </button>
          </div>

          <div className="contact-card">
            <div className="contact-title">Contact Us</div>
            <div className="contact-row">
              <div className="contact-icon"><Phone size={14} /></div>
              <div><div className="contact-label">Phone</div><div className="contact-value">+254 700 000 000</div></div>
            </div>
            <div className="contact-row">
              <div className="contact-icon"><Mail size={14} /></div>
              <div><div className="contact-label">Email</div><div className="contact-value">rent@roditec.co.ke</div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}