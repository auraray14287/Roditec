import React from 'react';
import { Link } from 'react-router-dom';

function AboutUs() {
  document.title = 'About Us | Roditec';

  const stats = [
    { n: '1M+', l: 'Monthly Visits' },
    { n: '4,200+', l: 'Cars Sold & Hired' },
    { n: '47', l: 'Verified Dealers' },
  ];

  const values = [
    {
      icon: '🛡️',
      title: 'Proven Expertise',
      text: 'Our experienced team excels in car sales and hire with over a decade of navigating the Kenyan market, delivering informed decisions and optimal results.',
    },
    {
      icon: '🎯',
      title: 'Customized Solutions',
      text: 'We create personalized strategies to suit every buyer and seller\'s unique goals, ensuring a seamless automotive journey from start to finish.',
    },
    {
      icon: '🤝',
      title: 'Transparent Partnerships',
      text: 'Transparency is key in our client relationships. We prioritize clear communication and ethical practices, fostering trust and reliability throughout.',
    },
  ];

  const team = [
    { name: 'James Mwangi', role: 'Chief Executive Officer', initials: 'JM' },
    { name: 'Amina Hassan', role: 'Head of Technology', initials: 'AH' },
    { name: 'Brian Otieno', role: 'Listings Manager', initials: 'BO' },
    { name: 'Grace Njeri', role: 'Customer Experience', initials: 'GN' },
  ];

  const testimonials = [
    { stars: 5, date: '15 May 2024 · 9:30 am', text: 'Roditec made buying my first car a breeze. The listings were honest, the process smooth, and I drove away in exactly what I wanted.', name: 'Arlene Kamau', role: 'CEO, Nairobi', initials: 'AK' },
    { stars: 5, date: '20 May 2024 · 11:30 am', text: 'The admin-verified listings gave me full confidence. No scams, no surprises — the car was exactly as described. Highly recommend Roditec.', name: 'Antony Lam', role: 'Car Buyer', initials: 'AL' },
    { stars: 5, date: '22 May 2024 · 1:30 pm', text: 'As a fleet manager, Roditec has been invaluable. Verified listings save us time and stress. The hire process is seamless and professional.', name: 'Grace Njeri', role: 'Fleet Manager', initials: 'GN' },
  ];

  const partners = ['Toyota', 'Land Rover', 'BMW', 'Mercedes', 'Nissan', 'Audi', 'Volkswagen', 'Kia', 'Ford', 'Isuzu', 'Subaru', 'Mazda'];

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", color: '#1A1A2E', background: '#fff' }}>
      <style>{`
        .about-btn-blue { background: #3B6BF0; color: #fff; border: none; border-radius: 6px; padding: 10px 22px; font-size: 14px; font-weight: 600; cursor: pointer; text-decoration: none; display: inline-block; transition: background .2s; }
        .about-btn-blue:hover { background: #2952CC; }
        .about-btn-outline { background: #fff; color: #1A1A2E; border: 1px solid #E5E7F0; border-radius: 6px; padding: 10px 22px; font-size: 14px; font-weight: 500; cursor: pointer; text-decoration: none; display: inline-block; transition: all .2s; }
        .about-btn-outline:hover { border-color: #3B6BF0; color: #3B6BF0; }
        .about-val-card { border: 1px solid #E5E7F0; border-radius: 10px; padding: 24px; transition: all .2s; }
        .about-val-card:hover { border-color: #3B6BF0; background: #EEF2FF; }
        .about-team-card { background: #fff; border: 1px solid #E5E7F0; border-radius: 12px; overflow: hidden; text-align: center; transition: all .2s; }
        .about-team-card:hover { box-shadow: 0 4px 20px rgba(59,107,240,.1); }
        .about-testi-card { background: #fff; border: 1px solid #E5E7F0; border-radius: 12px; padding: 24px; }
        .about-partner-pill { background: #F7F8FC; border: 1px solid #E5E7F0; border-radius: 8px; padding: 12px 20px; font-size: 13px; font-weight: 700; color: #8888A8; white-space: nowrap; }
        .about-stat-box { padding: 32px; text-align: center; border-right: 1px solid #E5E7F0; }
        .about-stat-box:last-child { border-right: none; }
      `}</style>

      {/* ── HERO ── */}
      <div style={{ background: 'linear-gradient(135deg, #EEF2FF, #fff)', padding: '80px 0 60px', textAlign: 'center' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ fontSize: 12, color: '#8888A8', marginBottom: 8 }}>
            <Link to="/" style={{ color: '#8888A8', textDecoration: 'none' }}>Home</Link>
            {' / '}
            <span style={{ color: '#3B6BF0' }}>About Us</span>
          </div>
          <h1 style={{ fontFamily: "'Manrope', sans-serif", fontSize: 'clamp(28px,5vw,44px)', fontWeight: 800, color: '#1A1A2E', marginBottom: 16 }}>
            Buying and selling cars<br />has never been easier!
          </h1>
          <p style={{ fontSize: 16, color: '#4A4A68', maxWidth: 560, margin: '0 auto 28px', lineHeight: 1.7 }}>
            Kenya's leading platform for car sales and hire. We help buyers find the right car from verified, admin-approved dealers only.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/CarExplore" className="about-btn-blue">Browse Cars</Link>
            <Link to="/ContactUs" className="about-btn-outline">Contact Us</Link>
          </div>

          {/* Stats row */}
          <div style={{ background: '#fff', border: '1px solid #E5E7F0', borderRadius: 12, overflow: 'hidden', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', maxWidth: 720, margin: '48px auto 0' }}>
            {stats.map(s => (
              <div key={s.l} className="about-stat-box">
                <div style={{ fontFamily: "'Manrope',sans-serif", fontSize: 40, fontWeight: 800, color: '#3B6BF0', lineHeight: 1 }}>{s.n}</div>
                <div style={{ fontSize: 13, color: '#8888A8', marginTop: 6 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── WHO WE ARE ── */}
      <section style={{ padding: '80px 0' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
          {/* Image block */}
          <div style={{ position: 'relative' }}>
            <div style={{ borderRadius: 12, background: 'linear-gradient(135deg,#EEF2FF,#dce8ff)', aspectRatio: '4/3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 96 }}>
              🏢
            </div>
            <div style={{ position: 'absolute', bottom: -16, right: -16, background: '#3B6BF0', color: '#fff', borderRadius: 10, padding: '14px 20px', textAlign: 'center' }}>
              <div style={{ fontFamily: "'Manrope',sans-serif", fontSize: 28, fontWeight: 800, lineHeight: 1 }}>12+</div>
              <div style={{ fontSize: 11, opacity: .8, marginTop: 2 }}>Years in Kenya</div>
            </div>
          </div>

          {/* Text */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#3B6BF0', marginBottom: 12 }}>WHO WE ARE</div>
            <h2 style={{ fontFamily: "'Manrope',sans-serif", fontSize: 'clamp(22px,3vw,32px)', fontWeight: 800, color: '#1A1A2E', marginBottom: 20 }}>
              Why Choose <span style={{ color: '#3B6BF0' }}>Roditec</span>
            </h2>
            <p style={{ fontSize: 14, color: '#4A4A68', lineHeight: 1.8, marginBottom: 14 }}>
              Our experienced team excels in car sales and hire with over a decade of navigating the Kenyan market, delivering informed decisions and optimal results for buyers and sellers alike.
            </p>
            <p style={{ fontSize: 14, color: '#4A4A68', lineHeight: 1.8, marginBottom: 28 }}>
              Unlike open classifieds, <strong>every listing on Roditec is admin-approved</strong>. Only verified, professional dealers can post cars — so what you see is exactly what you get. No fraud, no surprises.
            </p>

            {/* Value cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
              {values.map(v => (
                <div key={v.title} className="about-val-card">
                  <div style={{ fontSize: 28, marginBottom: 10 }}>{v.icon}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#1A1A2E', marginBottom: 6 }}>{v.title}</div>
                  <p style={{ fontSize: 12, color: '#8888A8', lineHeight: 1.6 }}>{v.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TEAM ── */}
      <section style={{ background: '#F7F8FC', padding: '80px 0' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#3B6BF0', marginBottom: 8 }}>THE PEOPLE</div>
              <h2 style={{ fontFamily: "'Manrope',sans-serif", fontSize: 'clamp(20px,3vw,28px)', fontWeight: 800, color: '#1A1A2E' }}>
                Meet Our <span style={{ color: '#3B6BF0' }}>Agents</span>
              </h2>
            </div>
            <Link to="/ContactUs" style={{ fontSize: 13, fontWeight: 600, color: '#3B6BF0', textDecoration: 'none' }}>
              Become an agent →
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 20 }}>
            {team.map(m => (
              <div key={m.name} className="about-team-card">
                <div style={{ height: 160, background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#3B6BF0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Manrope',sans-serif", fontWeight: 800, fontSize: 24, color: '#fff' }}>
                    {m.initials}
                  </div>
                </div>
                <div style={{ padding: '16px' }}>
                  <div style={{ fontFamily: "'Manrope',sans-serif", fontSize: 15, fontWeight: 700, color: '#1A1A2E' }}>{m.name}</div>
                  <div style={{ fontSize: 12, color: '#8888A8', marginTop: 3 }}>{m.role}</div>
                </div>
              </div>
            ))}
          </div>

          <p style={{ textAlign: 'center', marginTop: 24, fontSize: 13, color: '#8888A8' }}>
            Become an agent and get the commission you deserve.{' '}
            <Link to="/ContactUs" style={{ color: '#3B6BF0', fontWeight: 600, textDecoration: 'none' }}>Contact us →</Link>
          </p>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{ padding: '80px 0' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <h2 style={{ fontFamily: "'Manrope',sans-serif", fontSize: 'clamp(20px,3vw,28px)', fontWeight: 800, color: '#1A1A2E', marginBottom: 32 }}>
            We love our <span style={{ color: '#3B6BF0' }}>clients</span>
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 20 }}>
            {testimonials.map((t, i) => (
              <div key={i} className="about-testi-card">
                <div style={{ color: '#F4A017', fontSize: 14, marginBottom: 8 }}>{'★'.repeat(t.stars)}</div>
                <div style={{ fontSize: 11, color: '#8888A8', marginBottom: 12 }}>{t.date}</div>
                <p style={{ fontSize: 14, color: '#4A4A68', lineHeight: 1.7, marginBottom: 16 }}>"{t.text}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, color: '#3B6BF0' }}>{t.initials}</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#1A1A2E' }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: '#8888A8' }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PARTNERS ── */}
      <div style={{ background: '#fff', borderTop: '1px solid #E5E7F0', borderBottom: '1px solid #E5E7F0', padding: '40px 0', overflow: 'hidden' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <h3 style={{ fontFamily: "'Manrope',sans-serif", fontSize: 18, fontWeight: 700, color: '#1A1A2E', marginBottom: 20 }}>Our partners</h3>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {partners.map(p => (
              <div key={p} className="about-partner-pill">{p}</div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA ── */}
      <div style={{ background: '#3B6BF0', padding: '64px 0' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 24 }}>
          <h2 style={{ fontFamily: "'Manrope',sans-serif", fontSize: 'clamp(22px,4vw,36px)', fontWeight: 800, color: '#fff', lineHeight: 1.2 }}>
            Ready to find your perfect car?
          </h2>
          <Link to="/CarExplore" style={{ background: '#fff', color: '#3B6BF0', fontWeight: 700, fontSize: 14, padding: '14px 32px', borderRadius: 8, textDecoration: 'none', whiteSpace: 'nowrap' }}>
            Browse Inventory →
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AboutUs;