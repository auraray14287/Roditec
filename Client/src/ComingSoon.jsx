import { Link } from 'react-router-dom';
import { Clock, ArrowLeft, Car } from 'lucide-react';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@600;700;800&family=Inter:wght@400;500;600&display=swap');

  .cs-root {
    min-height: 100vh;
    background: #F7F8FC;
    display: flex;
    flex-direction: column;
    font-family: 'Inter', sans-serif;
  }

  .cs-body {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px 24px;
  }

  .cs-card {
    background: #fff;
    border: 1px solid #E5E7F0;
    border-radius: 20px;
    padding: 56px 48px;
    max-width: 500px;
    width: 100%;
    text-align: center;
    box-shadow: 0 4px 32px rgba(59,107,240,.08);
  }

  .cs-icon-wrap {
    width: 80px;
    height: 80px;
    background: #EEF2FF;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 28px;
    color: #3B6BF0;
    position: relative;
  }

  .cs-icon-pulse {
    position: absolute;
    inset: -8px;
    border-radius: 50%;
    border: 2px solid rgba(59,107,240,.2);
    animation: pulse 2s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.08); opacity: .5; }
  }

  .cs-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: #EEF2FF;
    color: #3B6BF0;
    border-radius: 20px;
    padding: 5px 14px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: .6px;
    text-transform: uppercase;
    margin-bottom: 16px;
  }

  .cs-title {
    font-family: 'Manrope', sans-serif;
    font-weight: 800;
    font-size: 28px;
    color: #1A1A2E;
    margin-bottom: 12px;
    line-height: 1.2;
  }

  .cs-text {
    font-size: 14px;
    color: #8888A8;
    line-height: 1.7;
    margin-bottom: 36px;
  }

  .cs-divider {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 28px;
  }

  .cs-divider-line {
    flex: 1;
    height: 1px;
    background: #E5E7F0;
  }

  .cs-divider-text {
    font-size: 11px;
    font-weight: 600;
    color: #AAAACC;
    letter-spacing: .4px;
  }

  .cs-actions {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .btn-home {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    background: #3B6BF0;
    color: #fff;
    border: none;
    padding: 13px 24px;
    border-radius: 9px;
    font-family: 'Inter', sans-serif;
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    text-decoration: none;
    transition: all .18s;
  }

  .btn-home:hover {
    background: #2952CC;
    transform: translateY(-1px);
    box-shadow: 0 4px 14px rgba(59,107,240,.3);
  }

  .btn-explore {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    background: #F7F8FC;
    color: #4A4A68;
    border: 1px solid #E5E7F0;
    padding: 13px 24px;
    border-radius: 9px;
    font-family: 'Inter', sans-serif;
    font-weight: 500;
    font-size: 14px;
    cursor: pointer;
    text-decoration: none;
    transition: all .18s;
  }

  .btn-explore:hover {
    border-color: #3B6BF0;
    color: #3B6BF0;
  }
`;

export default function ComingSoon() {
  return (
    <>
      <style>{STYLES}</style>
      <div className="cs-root">
          <div className="cs-body">
          <div className="cs-card">

            <div className="cs-icon-wrap">
              <div className="cs-icon-pulse"/>
              <Clock size={32}/>
            </div>

            <div className="cs-badge">
              <Car size={11}/> Coming Soon
            </div>

            <div className="cs-title">Feature Under Development</div>

            <div className="cs-text">
              We're working hard to bring this feature to you. Our team is busy building something great — check back soon!
            </div>

            <div className="cs-divider">
              <div className="cs-divider-line"/>
              <div className="cs-divider-text">In the meantime</div>
              <div className="cs-divider-line"/>
            </div>

            <div className="cs-actions">
              <Link to="/" className="btn-home">
                <ArrowLeft size={15}/> Back to Home
              </Link>
              <Link to="/CarExplore" className="btn-explore">
                <Car size={15}/> Explore Cars
              </Link>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}