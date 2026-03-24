import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import emailjs from 'emailjs-com';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ContactUs = () => {
  document.title = 'Contact Us | Roditec';

  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [formErrors, setFormErrors] = useState({});
  const [formStatus, setFormStatus] = useState('');
  const [validFields, setValidFields] = useState({ name: false, email: false, phone: false, subject: false, message: false });

  const validateField = (name, value) => {
    switch (name) {
      case 'email': return /\S+@\S+\.\S+/.test(value);
      default: return value.trim() !== '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    const isValid = validateField(name, value);
    setValidFields({ ...validFields, [name]: isValid });
    setFormErrors({ ...formErrors, [name]: isValid ? '' : formErrors[name] });
  };

  const validateForm = () => {
    const errors = {};
    Object.keys(formData).forEach(field => {
      if (!validateField(field, formData[field])) {
        errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required.`;
      }
    });
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) { setFormErrors(errors); return; }
    setFormStatus('Sending…');
    emailjs.send('service_isfonxb', 'template_zc2fn7i', formData, '89pcl6Blv6ZJ33wZk')
      .then(() => {
        setFormStatus('');
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
        setFormErrors({});
        setValidFields({ name: false, email: false, phone: false, subject: false, message: false });
        toast.success('Message sent! We\'ll be in touch soon.');
      })
      .catch(() => { setFormStatus(''); toast.error('Something went wrong. Please try again.'); });
  };

  const infoBlocks = [
    { icon: '📍', label: 'Address', value: 'Westlands Business Park\nNairobi, Kenya' },
    { icon: '📞', label: 'Phone', value: '+254 700 000 000\n+254 711 000 000' },
    { icon: '✉️', label: 'Email', value: 'info@roditec.co.ke\nsales@roditec.co.ke' },
    { icon: '🕐', label: 'Open Times', value: 'Monday – Friday: 08:00 – 18:00\nSaturday – Sunday: 10:00 – 14:00' },
  ];

  const inputStyle = (field) => ({
    width: '100%',
    background: '#F7F8FC',
    border: `1px solid ${formErrors[field] ? '#E63946' : validFields[field] ? '#2D9C5A' : '#E5E7F0'}`,
    borderRadius: 8,
    padding: '11px 14px',
    fontFamily: "'Inter', sans-serif",
    fontSize: 14,
    color: '#1A1A2E',
    outline: 'none',
    transition: 'border .2s',
    resize: 'none',
  });

  const labelStyle = { display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', color: '#8888A8', marginBottom: 6 };

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", color: '#1A1A2E', background: '#fff' }}>
      <ToastContainer position="top-right" autoClose={5000} />
      <style>{`
        .cu-info-block { display: flex; gap: 16px; margin-bottom: 28px; }
        .cu-info-icon { width: 44px; height: 44px; background: #EEF2FF; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0; }
        .cu-social-btn { width: 36px; height: 36px; background: #EEF2FF; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; color: #3B6BF0; cursor: pointer; transition: all .2s; border: none; }
        .cu-social-btn:hover { background: #3B6BF0; color: #fff; }
        .cu-form-input { transition: border-color .2s; }
        .cu-form-input:focus { border-color: #3B6BF0 !important; background: #fff !important; }
        .cu-submit-btn { width: 100%; background: #3B6BF0; color: #fff; border: none; border-radius: 8px; padding: 14px; font-size: 14px; font-weight: 600; cursor: pointer; margin-top: 4px; transition: background .2s; font-family: 'Inter', sans-serif; }
        .cu-submit-btn:hover { background: #2952CC; }
        .cu-submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        @media (max-width: 768px) {
          .cu-layout { grid-template-columns: 1fr !important; }
          .cu-form-row { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* ── PAGE HERO ── */}
      <div style={{ background: '#F7F8FC', padding: '80px 0 40px', borderBottom: '1px solid #E5E7F0' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ fontSize: 12, color: '#8888A8', marginBottom: 8 }}>
            <Link to="/" style={{ color: '#8888A8', textDecoration: 'none' }}>Home</Link>
            {' / '}
            <span style={{ color: '#3B6BF0' }}>Contact Us</span>
          </div>
          <h1 style={{ fontFamily: "'Manrope', sans-serif", fontSize: 'clamp(24px,4vw,36px)', fontWeight: 800, color: '#1A1A2E' }}>Contact Us</h1>
        </div>
      </div>

      {/* ── MAIN LAYOUT ── */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
        <div className="cu-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 64, padding: '64px 0' }}>

          {/* LEFT: Info */}
          <div>
            <h2 style={{ fontFamily: "'Manrope',sans-serif", fontSize: 26, fontWeight: 800, color: '#1A1A2E', marginBottom: 8 }}>Drop Us a Line</h2>
            <p style={{ fontSize: 14, color: '#4A4A68', lineHeight: 1.7, marginBottom: 36 }}>
              Feel free to connect with us for updates, enquiries, test drive bookings, or any automotive questions. Our team responds within 24 hours.
            </p>

            {infoBlocks.map(b => (
              <div key={b.label} className="cu-info-block">
                <div className="cu-info-icon">{b.icon}</div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', color: '#8888A8', marginBottom: 4 }}>{b.label}</div>
                  <div style={{ fontSize: 14, color: '#1A1A2E', lineHeight: 1.6, whiteSpace: 'pre-line' }}>{b.value}</div>
                </div>
              </div>
            ))}

            {/* Social */}
            <div className="cu-info-block">
              <div className="cu-info-icon">🔗</div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', color: '#8888A8', marginBottom: 10 }}>Follow Us</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {['f', 'ig', 'yt', 'tw'].map(s => (
                    <button key={s} className="cu-social-btn">{s}</button>
                  ))}
                </div>
              </div>
            </div>

            {/* Map placeholder */}
            <div style={{ background: 'linear-gradient(135deg,#EEF2FF,#dce8ff)', borderRadius: 12, height: 200, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '1px solid #E5E7F0', marginTop: 8 }}>
              <div style={{ fontSize: 36, animation: 'mapbounce 2s infinite' }}>📍</div>
              <div style={{ fontSize: 13, color: '#4A4A68', marginTop: 10, fontWeight: 500 }}>Nairobi, Kenya</div>
            </div>
            <style>{`@keyframes mapbounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}`}</style>
          </div>

          {/* RIGHT: Form */}
          <div style={{ background: '#fff', border: '1px solid #E5E7F0', borderRadius: 12, padding: 36 }}>
            <h3 style={{ fontFamily: "'Manrope',sans-serif", fontSize: 22, fontWeight: 800, color: '#1A1A2E', marginBottom: 8 }}>Send us a Message</h3>
            <p style={{ fontSize: 13, color: '#8888A8', marginBottom: 28 }}>
              For listing requests, please select "Dealer/Listing Request" — only admin-approved dealers can list on Roditec.
            </p>

            {formStatus && (
              <div style={{ background: '#FFF3CD', border: '1px solid #FFD700', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#856404', marginBottom: 20 }}>
                {formStatus}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              {/* Name + Email row */}
              <div className="cu-form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={labelStyle}>Full Name</label>
                  <input className="cu-form-input" name="name" type="text" placeholder="John Kamau" value={formData.name} onChange={handleChange} style={inputStyle('name')} />
                  {formErrors.name && <p style={{ fontSize: 12, color: '#E63946', marginTop: 4 }}>{formErrors.name}</p>}
                </div>
                <div>
                  <label style={labelStyle}>Email Address</label>
                  <input className="cu-form-input" name="email" type="email" placeholder="john@email.com" value={formData.email} onChange={handleChange} style={inputStyle('email')} />
                  {formErrors.email && <p style={{ fontSize: 12, color: '#E63946', marginTop: 4 }}>{formErrors.email}</p>}
                </div>
              </div>

              {/* Phone */}
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Phone Number</label>
                <input className="cu-form-input" name="phone" type="tel" placeholder="+254 700 000 000" value={formData.phone} onChange={handleChange} style={inputStyle('phone')} />
                {formErrors.phone && <p style={{ fontSize: 12, color: '#E63946', marginTop: 4 }}>{formErrors.phone}</p>}
              </div>

              {/* Subject */}
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Subject</label>
                <select className="cu-form-input" name="subject" value={formData.subject} onChange={handleChange} style={{ ...inputStyle('subject'), appearance: 'none', WebkitAppearance: 'none', background: formErrors.subject ? '#FFF5F5' : validFields.subject ? '#F0FFF4' : '#F7F8FC' }}>
                  <option value="">Select enquiry type…</option>
                  <option value="Car Purchase Enquiry">Car Purchase Enquiry</option>
                  <option value="Car Hire Enquiry">Car Hire Enquiry</option>
                  <option value="Test Drive Request">Test Drive Request</option>
                  <option value="Dealer/Listing Request">Dealer / Listing Request</option>
                  <option value="General Enquiry">General Enquiry</option>
                </select>
                {formErrors.subject && <p style={{ fontSize: 12, color: '#E63946', marginTop: 4 }}>{formErrors.subject}</p>}
              </div>

              {/* Message */}
              <div style={{ marginBottom: 20 }}>
                <label style={labelStyle}>Your Message</label>
                <textarea className="cu-form-input" name="message" rows={5} placeholder="How can we help you?" value={formData.message} onChange={handleChange} style={inputStyle('message')} />
                {formErrors.message && <p style={{ fontSize: 12, color: '#E63946', marginTop: 4 }}>{formErrors.message}</p>}
              </div>

              <button type="submit" className="cu-submit-btn" disabled={!!formStatus}>
                {formStatus ? formStatus : 'Send Message →'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* ── PARTNERS ── */}
      <div style={{ background: '#F7F8FC', borderTop: '1px solid #E5E7F0', padding: '40px 0' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <h3 style={{ fontFamily: "'Manrope',sans-serif", fontSize: 18, fontWeight: 700, color: '#1A1A2E', marginBottom: 20 }}>Our partners</h3>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {['Toyota', 'Land Rover', 'BMW', 'Mercedes', 'Nissan', 'Audi', 'Volkswagen', 'Kia', 'Ford', 'Isuzu'].map(p => (
              <div key={p} style={{ background: '#fff', border: '1px solid #E5E7F0', borderRadius: 8, padding: '10px 18px', fontSize: 13, fontWeight: 700, color: '#8888A8' }}>{p}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;