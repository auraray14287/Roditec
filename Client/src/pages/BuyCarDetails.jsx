import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Fuel, Settings2, Gauge, Calendar, Car, Shield,
  CheckCircle, ChevronLeft, ChevronRight, Phone, Mail,
  MapPin, Star, Share2, Heart, FileText, CreditCard
} from 'lucide-react';
import API_BASE_URL from '../config/apiConfig';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@600;700;800&family=Inter:wght@400;500;600&display=swap');

  .detail-root {
    background: #fff;
    color: #1A1A2E;
    font-family: 'Inter', sans-serif;
    min-height: 100vh;
    padding-top: 100px;
  }

  /* BREADCRUMB */
  .breadcrumb {
    background: #F7F8FC;
    border-bottom: 1px solid #E5E7F0;
    padding: 14px 24px;
  }
  .breadcrumb-inner {
    max-width: 1280px; margin: 0 auto;
    display: flex; align-items: center; gap: 6px;
    font-size: 13px; color: #8888A8;
  }
  .breadcrumb-inner a { color: #8888A8; text-decoration: none; transition: color .18s; }
  .breadcrumb-inner a:hover { color: #3B6BF0; }
  .breadcrumb-inner .sep { opacity: .4; }
  .breadcrumb-inner .current { color: #1A1A2E; font-weight: 500; }
  .back-btn {
    display: flex; align-items: center; gap: 5px;
    color: #8888A8; font-size: 13px; font-weight: 500;
    background: none; border: none; cursor: pointer;
    font-family: 'Inter', sans-serif; transition: color .18s; margin-right: 4px;
  }
  .back-btn:hover { color: #3B6BF0; }

  /* LAYOUT */
  .detail-inner {
    max-width: 1280px; margin: 0 auto;
    padding: 32px 24px 64px;
    display: grid;
    grid-template-columns: 1fr 360px;
    gap: 32px;
    align-items: start;
  }
  @media (max-width: 1024px) { .detail-inner { grid-template-columns: 1fr; } }

  /* GALLERY */
  .main-img-wrap {
    position: relative; height: 460px;
    border-radius: 12px; overflow: hidden;
    background: #F7F8FC; margin-bottom: 10px;
    border: 1px solid #E5E7F0;
  }
  .main-img { width: 100%; height: 100%; object-fit: cover; transition: opacity .3s; }
  .img-placeholder { width: 100%; height: 100%; background: linear-gradient(135deg,#EEF2FF,#dce8ff); display: flex; align-items: center; justify-content: center; font-size: 80px; }

  .gallery-badge {
    position: absolute; top: 14px; left: 14px;
    background: #CFE2FF; color: #084298;
    font-size: 10px; font-weight: 700; letter-spacing: .8px; text-transform: uppercase;
    padding: 5px 12px; border-radius: 4px;
  }
  .gallery-actions { position: absolute; top: 14px; right: 14px; display: flex; gap: 7px; }
  .gallery-action-btn {
    width: 36px; height: 36px; border-radius: 8px;
    background: rgba(255,255,255,0.92); backdrop-filter: blur(8px);
    border: 1px solid #E5E7F0; color: #4A4A68;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: all .18s;
  }
  .gallery-action-btn:hover { background: #EEF2FF; color: #3B6BF0; border-color: #3B6BF0; }
  .gallery-action-btn.liked { color: #E63946; border-color: rgba(230,57,70,.3); }

  .gallery-arrow {
    position: absolute; top: 50%; transform: translateY(-50%);
    width: 36px; height: 36px; border-radius: 8px;
    background: rgba(255,255,255,0.9); border: 1px solid #E5E7F0;
    color: #4A4A68; display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: all .18s;
  }
  .gallery-arrow:hover { background: #3B6BF0; color: #fff; border-color: #3B6BF0; }
  .gallery-arrow.left { left: 12px; }
  .gallery-arrow.right { right: 12px; }

  .gallery-dots {
    position: absolute; bottom: 14px; left: 50%; transform: translateX(-50%);
    display: flex; gap: 5px;
    background: rgba(255,255,255,0.85); backdrop-filter: blur(8px);
    padding: 6px 10px; border-radius: 20px; border: 1px solid #E5E7F0;
  }
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
  .info-title { font-family: 'Manrope', sans-serif; font-size: clamp(22px,3vw,32px); font-weight: 800; color: #1A1A2E; line-height: 1.15; margin-bottom: 10px; }
  .info-sub { font-size: 13px; color: #8888A8; display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
  .status-badge {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 4px 12px; border-radius: 20px;
    font-size: 11px; font-weight: 700; letter-spacing: .5px; text-transform: uppercase;
  }
  .status-available { background: #D1E7DD; color: #0A5C36; }
  .status-sold { background: #F8D7DA; color: #842029; }

  /* SPECS */
  .specs-grid { display: grid; grid-template-columns: repeat(auto-fill,minmax(155px,1fr)); gap: 12px; margin-bottom: 28px; }
  .spec-card {
    background: #F7F8FC; border: 1px solid #E5E7F0; border-radius: 10px;
    padding: 14px; display: flex; flex-direction: column; gap: 6px; transition: all .18s;
  }
  .spec-card:hover { border-color: #3B6BF0; background: #EEF2FF; }
  .spec-icon { color: #3B6BF0; }
  .spec-label { font-size: 10px; font-weight: 700; letter-spacing: .8px; text-transform: uppercase; color: #8888A8; }
  .spec-value { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 14px; color: #1A1A2E; }

  /* SECTIONS */
  .info-section { margin-bottom: 28px; }
  .info-section-title {
    font-family: 'Manrope', sans-serif; font-size: 14px; font-weight: 700;
    letter-spacing: .5px; text-transform: uppercase; color: #1A1A2E;
    margin-bottom: 14px; padding-bottom: 10px; border-bottom: 1px solid #E5E7F0;
    display: flex; align-items: center; gap: 8px;
  }
  .info-section-title::before { content: ''; width: 3px; height: 14px; background: #3B6BF0; border-radius: 2px; display: inline-block; }
  .description-text { font-size: 14px; color: #4A4A68; line-height: 1.8; }

  .features-grid { display: grid; grid-template-columns: repeat(auto-fill,minmax(180px,1fr)); gap: 8px; }
  .feature-item { display: flex; align-items: center; gap: 8px; font-size: 13px; color: #4A4A68; font-weight: 500; }
  .feature-dot { width: 6px; height: 6px; border-radius: 50%; background: #3B6BF0; flex-shrink: 0; }

  /* SIDEBAR */
  .detail-sidebar { position: sticky; top: 110px; display: flex; flex-direction: column; gap: 14px; }

  .price-card { background: #fff; border: 1px solid #E5E7F0; border-radius: 12px; padding: 24px; box-shadow: 0 4px 20px rgba(0,0,0,0.06); }
  .price-label { font-size: 11px; font-weight: 700; letter-spacing: .8px; text-transform: uppercase; color: #8888A8; margin-bottom: 6px; }
  .price-main { font-family: 'Manrope', sans-serif; font-weight: 800; font-size: 36px; color: #1A1A2E; letter-spacing: -1px; line-height: 1; margin-bottom: 6px; }
  .price-negotiable { font-size: 12px; color: #2D9C5A; font-weight: 500; display: flex; align-items: center; gap: 5px; margin-bottom: 20px; }

  .sidebar-divider { height: 1px; background: #E5E7F0; margin: 16px 0; }

  .breakdown-row { display: flex; justify-content: space-between; align-items: center; font-size: 13px; margin-bottom: 8px; }
  .breakdown-label { color: #8888A8; }
  .breakdown-value { color: #1A1A2E; font-weight: 500; }
  .breakdown-total { display: flex; justify-content: space-between; align-items: center; font-size: 14px; margin-top: 10px; padding-top: 10px; border-top: 1px solid #E5E7F0; }
  .breakdown-total .breakdown-label { color: #1A1A2E; font-weight: 700; }
  .breakdown-total .breakdown-value { color: #3B6BF0; font-weight: 800; font-family: 'Manrope', sans-serif; font-size: 16px; }

  .cta-buy-btn {
    width: 100%; background: #3B6BF0; color: #fff; border: none;
    padding: 14px; border-radius: 8px;
    font-family: 'Inter', sans-serif; font-weight: 700; font-size: 15px;
    cursor: pointer; transition: all .2s;
    display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: 16px;
  }
  .cta-buy-btn:hover { background: #2952CC; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(59,107,240,.3); }
  .cta-buy-btn:disabled { opacity: .5; cursor: not-allowed; transform: none; box-shadow: none; }

  .contact-card { background: #fff; border: 1px solid #E5E7F0; border-radius: 12px; padding: 20px; }
  .contact-title { font-family: 'Manrope', sans-serif; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: .5px; color: #1A1A2E; margin-bottom: 16px; }
  .contact-row { display: flex; align-items: center; gap: 12px; padding: 10px 0; border-bottom: 1px solid #F0F0F8; }
  .contact-row:last-child { border-bottom: none; }
  .contact-icon { width: 36px; height: 36px; border-radius: 8px; background: #EEF2FF; display: flex; align-items: center; justify-content: center; color: #3B6BF0; flex-shrink: 0; }
  .contact-label { font-size: 10px; color: #8888A8; font-weight: 600; text-transform: uppercase; letter-spacing: .5px; }
  .contact-value { font-size: 13px; color: #1A1A2E; font-weight: 600; }

  .trust-badges { background: #F7F8FC; border: 1px solid #E5E7F0; border-radius: 12px; padding: 16px 20px; display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .trust-badge { display: flex; align-items: center; gap: 7px; font-size: 12px; color: #4A4A68; font-weight: 500; }

  /* SKELETON */
  .skeleton { background: linear-gradient(90deg,#f0f2f8 25%,#e6eaf6 50%,#f0f2f8 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: 8px; }
  @keyframes shimmer { from { background-position: 200% 0; } to { background-position: -200% 0; } }
`;

const DEFAULT_FEATURES = ['Air Conditioning','Power Steering','ABS Brakes','Airbags','Bluetooth','Backup Camera','Keyless Entry','Navigation System'];

export default function BuyCarDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car,       setCar]       = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [liked,     setLiked]     = useState(false);

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

  const images  = car?.images?.map(imgUrl).filter(Boolean) || [];
  const price   = car?.price?.$numberDecimal ? parseFloat(car.price.$numberDecimal) : (car?.price || 0);
  const regFee  = 5000;
  const total   = price + regFee;

  // ── LOADING ──
  if (loading) return (
    <div className="detail-root" style={{ padding: '40px 24px' }}>
      <style>{STYLES}</style>
      <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 360px', gap: 32 }}>
        <div>
          <div className="skeleton" style={{ height: 460, borderRadius: 12, marginBottom: 10 }} />
          <div style={{ display: 'flex', gap: 8 }}>
            {[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ width: 80, height: 60, borderRadius: 8 }} />)}
          </div>
          <div style={{ marginTop: 28 }}>
            <div className="skeleton" style={{ height: 36, width: '55%', marginBottom: 12 }} />
            <div className="skeleton" style={{ height: 16, width: '35%' }} />
          </div>
        </div>
        <div className="skeleton" style={{ height: 320, borderRadius: 12 }} />
      </div>
    </div>
  );

  // ── NOT FOUND ──
  if (!car) return (
    <div className="detail-root" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <style>{STYLES}</style>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>🚗</div>
        <div style={{ fontFamily: 'Manrope,sans-serif', fontSize: 22, fontWeight: 700, color: '#1A1A2E', marginBottom: 8 }}>Car not found</div>
        <button className="back-btn" onClick={() => navigate('/CarExplore')} style={{ color: '#3B6BF0', fontSize: 14 }}>← Back to listings</button>
      </div>
    </div>
  );

  return (
    <div className="detail-root">
      <style>{STYLES}</style>

      {/* BREADCRUMB */}
      <div className="breadcrumb">
        <div className="breadcrumb-inner">
          <button className="back-btn" onClick={() => navigate('/CarExplore')}><ArrowLeft size={14} /></button>
          <a href="/">Home</a><span className="sep">/</span>
          <a href="/CarExplore">Buy Car</a><span className="sep">/</span>
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
              <div className="gallery-badge">For Sale</div>
              <div className="gallery-actions">
                <button className={`gallery-action-btn${liked ? ' liked' : ''}`} onClick={() => setLiked(!liked)}>
                  <Heart size={15} fill={liked ? '#E63946' : 'none'} />
                </button>
                <button className="gallery-action-btn" onClick={() => navigator.clipboard?.writeText(window.location.href)}>
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
                <span className={`status-badge ${car.listing_status === 'active' ? 'status-available' : 'status-sold'}`}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor', display: 'inline-block' }} />
                  {car.listing_status === 'active' ? 'Available' : 'Sold'}
                </span>
                {car.carType && <><span>·</span><span>{car.carType}</span></>}
                {car.location && <><span>·</span><span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={12} />{car.location}</span></>}
              </div>
            </div>

            {/* Specs */}
            <div className="specs-grid">
              {[
                { icon: Calendar,  label: 'Year',         value: car.year },
                { icon: Gauge,     label: 'Mileage',      value: `${(car.mileage || 0).toLocaleString()} km` },
                { icon: Fuel,      label: 'Fuel',         value: car.fuelType || 'Petrol' },
                { icon: Settings2, label: 'Transmission', value: car.transmission || 'Auto' },
                { icon: Car,       label: 'Body Type',    value: car.carType || '—' },
                { icon: Shield,    label: 'Condition',    value: car.condition || 'Used' },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="spec-card">
                  <Icon size={17} className="spec-icon" />
                  <div className="spec-label">{label}</div>
                  <div className="spec-value">{value}</div>
                </div>
              ))}
            </div>

            {/* Description */}
            {car.description && (
              <div className="info-section">
                <div className="info-section-title">About this Car</div>
                <p className="description-text">{car.description}</p>
              </div>
            )}

            {/* Features */}
            <div className="info-section">
              <div className="info-section-title">Features & Equipment</div>
              <div className="features-grid">
                {(car.features?.length ? car.features : DEFAULT_FEATURES).map((f, i) => (
                  <div key={i} className="feature-item"><div className="feature-dot" />{f}</div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* SIDEBAR */}
        <div className="detail-sidebar">
          {/* Price */}
          <div className="price-card">
            <div className="price-label">Asking Price</div>
            <div className="price-main">KSH {price.toLocaleString()}</div>
            <div className="price-negotiable"><CheckCircle size={13} /> Price is negotiable</div>

            <div className="sidebar-divider" />

            <div className="breakdown-row"><span className="breakdown-label">Vehicle Price</span><span className="breakdown-value">KSH {price.toLocaleString()}</span></div>
            <div className="breakdown-row"><span className="breakdown-label">Registration Fee</span><span className="breakdown-value">KSH {regFee.toLocaleString()}</span></div>
            <div className="breakdown-total">
              <span className="breakdown-label">Total Estimate</span>
              <span className="breakdown-value">KSH {total.toLocaleString()}</span>
            </div>

            <button
              className="cta-buy-btn"
              onClick={() => navigate(`/payment/${car.listing_id}`)}
              disabled={car.listing_status !== 'active'}
            >
              <CreditCard size={16} />
              {car.listing_status === 'active' ? 'Proceed to Buy' : 'No Longer Available'}
            </button>
          </div>

          {/* Contact */}
          <div className="contact-card">
            <div className="contact-title">Contact Dealer</div>
            <div className="contact-row">
              <div className="contact-icon"><Phone size={14} /></div>
              <div><div className="contact-label">Phone</div><div className="contact-value">+254 700 000 000</div></div>
            </div>
            <div className="contact-row">
              <div className="contact-icon"><Mail size={14} /></div>
              <div><div className="contact-label">Email</div><div className="contact-value">info@roditec.co.ke</div></div>
            </div>
            <div className="contact-row">
              <div className="contact-icon"><MapPin size={14} /></div>
              <div><div className="contact-label">Location</div><div className="contact-value">Nairobi, Kenya</div></div>
            </div>
          </div>

          {/* Trust */}
          <div className="trust-badges">
            {[
              { icon: Shield,      text: 'Verified Listing' },
              { icon: Star,        text: 'Top Rated' },
              { icon: FileText,    text: 'Full Docs' },
              { icon: CheckCircle, text: 'Inspected' },
            ].map(({ icon: Icon, text }, i) => (
              <div key={i} className="trust-badge">
                <Icon size={14} color="#3B6BF0" />{text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}