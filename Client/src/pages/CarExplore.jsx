import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, SlidersHorizontal, X, Fuel, Settings2, Gauge, ArrowRight, Star, Grid3x3, List } from 'lucide-react';
import API_BASE_URL from '../config/apiConfig';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700;800&family=Inter:wght@300;400;500;600&display=swap');

  .explore-root {
    background: #fff;
    color: #1A1A2E;
    font-family: 'Inter', sans-serif;
    min-height: 100vh;
    padding-top: 100px;
  }

  /* ── PAGE HERO ── */
  .explore-hero {
    background: #F7F8FC;
    border-bottom: 1px solid #E5E7F0;
    padding: 48px 0 32px;
  }
  .explore-hero-inner {
    max-width: 1280px; margin: 0 auto; padding: 0 24px;
    display: flex; justify-content: space-between; align-items: flex-end; gap: 20px; flex-wrap: wrap;
  }
  .breadcrumb { font-size: 12px; color: #8888A8; margin-bottom: 8px; }
  .breadcrumb a { color: #8888A8; text-decoration: none; }
  .breadcrumb a:hover { color: #3B6BF0; }
  .page-title { font-family: 'Manrope', sans-serif; font-size: clamp(22px,3vw,32px); font-weight: 800; color: #1A1A2E; }

  /* Mode toggle */
  .mode-toggle { display: inline-flex; background: #fff; border: 1px solid #E5E7F0; border-radius: 10px; padding: 4px; gap: 2px; }
  .mode-btn { padding: 8px 22px; border-radius: 7px; font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 600; border: none; cursor: pointer; transition: all 0.18s; background: transparent; color: #8888A8; }
  .mode-btn.active { background: #3B6BF0; color: #fff; box-shadow: 0 2px 8px rgba(59,107,240,0.25); }

  /* Search bar */
  .search-bar-row { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin-top: 16px; }
  .search-input-wrap { position: relative; flex: 1; min-width: 200px; }
  .search-icon-pos { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #8888A8; pointer-events: none; }
  .search-input { width: 100%; background: #fff; border: 1px solid #E5E7F0; border-radius: 8px; padding: 10px 14px 10px 38px; color: #1A1A2E; font-family: 'Inter', sans-serif; font-size: 13px; outline: none; transition: border 0.18s; }
  .search-input:focus { border-color: #3B6BF0; box-shadow: 0 0 0 3px rgba(59,107,240,0.1); }
  .search-input::placeholder { color: #8888A8; }
  .filter-toggle-btn { display: flex; align-items: center; gap: 6px; padding: 10px 18px; background: #fff; border: 1px solid #E5E7F0; border-radius: 8px; color: #4A4A68; font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.18s; white-space: nowrap; }
  .filter-toggle-btn:hover { border-color: #3B6BF0; color: #3B6BF0; }
  .filter-toggle-btn.active { border-color: #3B6BF0; color: #3B6BF0; background: #EEF2FF; }

  /* ── MAIN LAYOUT ── */
  .explore-body { max-width: 1280px; margin: 0 auto; padding: 32px 24px 60px; display: grid; grid-template-columns: 270px 1fr; gap: 28px; align-items: start; }
  @media (max-width: 960px) { .explore-body { grid-template-columns: 1fr; } .filter-sidebar { display: none; } .filter-sidebar.mobile-open { display: block; } }

  /* ── SIDEBAR ── */
  .filter-sidebar { background: #fff; border: 1px solid #E5E7F0; border-radius: 12px; padding: 20px; position: sticky; top: 100px; }
  .filter-title { font-family: 'Manrope', sans-serif; font-size: 14px; font-weight: 700; color: #1A1A2E; margin-bottom: 20px; padding-bottom: 14px; border-bottom: 1px solid #E5E7F0; display: flex; justify-content: space-between; align-items: center; }
  .filter-reset-link { font-size: 12px; color: #3B6BF0; font-weight: 500; cursor: pointer; background: none; border: none; font-family: 'Inter', sans-serif; }
  .filter-group { margin-bottom: 20px; }
  .filter-group-label { font-size: 10px; font-weight: 700; letter-spacing: 0.8px; text-transform: uppercase; color: #8888A8; margin-bottom: 8px; }
  .filter-select { width: 100%; background: #F7F8FC; border: 1px solid #E5E7F0; border-radius: 8px; padding: 9px 12px; color: #1A1A2E; font-family: 'Inter', sans-serif; font-size: 13px; outline: none; cursor: pointer; transition: border 0.18s; appearance: none; -webkit-appearance: none; background-image: url("data:image/svg+xml,%3Csvg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%238888A8' stroke-width='2' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 10px center; padding-right: 32px; }
  .filter-select:focus { border-color: #3B6BF0; background-color: #fff; }
  .filter-select option { background: #fff; color: #1A1A2E; }

  /* Price range */
  .price-range-display { display: flex; justify-content: space-between; font-size: 12px; color: #8888A8; margin-bottom: 6px; }
  .price-current { font-weight: 700; color: #3B6BF0; }
  .range-input { width: 100%; -webkit-appearance: none; height: 4px; background: #E5E7F0; border-radius: 2px; outline: none; cursor: pointer; accent-color: #3B6BF0; }
  .range-input::-webkit-slider-thumb { -webkit-appearance: none; width: 18px; height: 18px; border-radius: 50%; background: #3B6BF0; border: 2px solid #fff; box-shadow: 0 2px 6px rgba(59,107,240,0.35); cursor: pointer; }

  /* Checkboxes */
  .check-item { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; cursor: pointer; }
  .check-item input { accent-color: #3B6BF0; width: 15px; height: 15px; cursor: pointer; }
  .check-item label { font-size: 13px; color: #4A4A68; cursor: pointer; flex: 1; }
  .check-item .cnt { font-size: 11px; color: #8888A8; background: #F7F8FC; border: 1px solid #E5E7F0; padding: 1px 7px; border-radius: 3px; }

  /* ── RESULTS HEADER ── */
  .results-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 10px; }
  .results-count { font-size: 13px; color: #4A4A68; }
  .results-count strong { color: #1A1A2E; }
  .sort-row { display: flex; align-items: center; gap: 8px; }
  .sort-select { background: #fff; border: 1px solid #E5E7F0; border-radius: 6px; padding: 7px 12px; color: #1A1A2E; font-size: 13px; outline: none; cursor: pointer; font-family: 'Inter', sans-serif; }
  .view-toggle { display: flex; border: 1px solid #E5E7F0; border-radius: 6px; overflow: hidden; }
  .view-btn { width: 34px; height: 34px; border: none; background: #fff; color: #8888A8; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.18s; }
  .view-btn.active { background: #EEF2FF; color: #3B6BF0; }
  .view-btn:hover:not(.active) { background: #F7F8FC; }

  /* ── CAR GRID ── */
  .cars-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(268px, 1fr)); gap: 18px; }
  .cars-grid.list-view { grid-template-columns: 1fr; }

  /* ── CAR CARD ── */
  .car-card { background: #fff; border: 1px solid #E5E7F0; border-radius: 12px; overflow: hidden; transition: all 0.28s ease; text-decoration: none; display: block; color: inherit; }
  .car-card:hover { box-shadow: 0 6px 28px rgba(59,107,240,0.11); border-color: rgba(59,107,240,0.3); transform: translateY(-3px); }
  .car-card.list-card { display: grid; grid-template-columns: 240px 1fr; border-radius: 12px; }
  .car-card.list-card:hover { transform: none; box-shadow: 0 4px 20px rgba(59,107,240,0.1); }

  .card-img-wrap { position: relative; height: 196px; background: #F7F8FC; overflow: hidden; display: flex; align-items: center; justify-content: center; }
  .list-card .card-img-wrap { height: 100%; min-height: 160px; }
  .card-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease; }
  .car-card:hover .card-img { transform: scale(1.04); }
  .card-placeholder { width: 100%; height: 100%; background: linear-gradient(135deg,#EEF2FF,#dce8ff); display: flex; align-items: center; justify-content: center; font-size: 56px; }

  .card-badges { position: absolute; top: 10px; left: 10px; display: flex; gap: 5px; }
  .badge { font-size: 10px; font-weight: 700; padding: 4px 10px; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.5px; }
  .badge-sale { background: #CFE2FF; color: #084298; }
  .badge-hire { background: #D1E7DD; color: #0A5C36; }
  .badge-featured { background: #FFF3CD; color: #856404; }
  .card-year-badge { position: absolute; top: 10px; right: 10px; background: #fff; color: #3B6BF0; font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 4px; border: 1px solid #EEF2FF; }
  .card-img-count { position: absolute; bottom: 10px; right: 10px; background: rgba(0,0,0,0.45); color: #fff; font-size: 11px; padding: 3px 8px; border-radius: 4px; }
  .card-fav { position: absolute; top: 10px; right: 10px; width: 30px; height: 30px; background: rgba(255,255,255,0.9); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; cursor: pointer; border: 1px solid #E5E7F0; }

  .card-body { padding: 16px; display: flex; flex-direction: column; flex: 1; }
  .card-body-type { font-size: 10px; font-weight: 700; color: #3B6BF0; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
  .card-name { font-family: 'Manrope', sans-serif; font-size: 16px; font-weight: 700; color: #1A1A2E; margin-bottom: 4px; }
  .card-sub { font-size: 12px; color: #8888A8; margin-bottom: 10px; }
  .card-rating { display: flex; align-items: center; gap: 4px; font-size: 12px; color: #8888A8; margin-bottom: 8px; }
  .card-specs { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 12px; }
  .spec-pill { display: flex; align-items: center; gap: 4px; font-size: 12px; color: #8888A8; background: #F7F8FC; padding: 4px 10px; border-radius: 6px; border: 1px solid #E5E7F0; }
  .card-footer { display: flex; align-items: center; justify-content: space-between; padding-top: 12px; border-top: 1px solid #F0F0F8; margin-top: auto; }
  .card-price { font-family: 'Manrope', sans-serif; font-size: 18px; font-weight: 800; color: #1A1A2E; }
  .card-price-sub { font-size: 11px; color: #8888A8; margin-top: 2px; }
  .view-btn-card { display: flex; align-items: center; gap: 4px; background: #EEF2FF; border: none; color: #3B6BF0; border-radius: 6px; padding: 7px 14px; font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.18s; white-space: nowrap; }
  .car-card:hover .view-btn-card { background: #3B6BF0; color: #fff; }

  /* ── SKELETON ── */
  .skeleton { background: linear-gradient(90deg,#f0f2f8 25%,#e6eaf6 50%,#f0f2f8 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: 6px; }
  @keyframes shimmer { from { background-position: 200% 0; } to { background-position: -200% 0; } }

  /* ── EMPTY ── */
  .empty-state { grid-column: 1/-1; text-align: center; padding: 80px 24px; }
  .empty-icon { font-size: 64px; margin-bottom: 16px; opacity: 0.4; }
  .empty-title { font-family: 'Manrope', sans-serif; font-size: 22px; font-weight: 700; color: #1A1A2E; margin-bottom: 8px; }
  .empty-sub { font-size: 14px; color: #8888A8; }

  /* ── PAGINATION ── */
  .pagination { display: flex; gap: 6px; justify-content: center; margin-top: 40px; }
  .page-btn { width: 36px; height: 36px; border: 1px solid #E5E7F0; background: #fff; border-radius: 6px; font-size: 13px; font-weight: 600; color: #4A4A68; cursor: pointer; transition: all 0.18s; display: flex; align-items: center; justify-content: center; }
  .page-btn.active, .page-btn:hover { background: #3B6BF0; color: #fff; border-color: #3B6BF0; }
`;

export default function CarExplore() {
  const [mode,         setMode]         = useState('buy');
  const [cars,         setCars]         = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [searchQuery,  setSearchQuery]  = useState('');
  const [make,         setMake]         = useState('');
  const [carType,      setCarType]      = useState('');
  const [year,         setYear]         = useState('');
  const [transmission, setTransmission] = useState('All');
  const [priceRange,   setPriceRange]   = useState(100000);
  const [sortOrder,    setSortOrder]    = useState('none');
  const [minRating,    setMinRating]    = useState(0);
  const [viewMode,     setViewMode]     = useState('grid');
  const [filtersOpen,  setFiltersOpen]  = useState(false);

  // ── original fetch logic ──
  useEffect(() => {
    setLoading(true);
    const fetchCars = async () => {
      try {
        const res  = await fetch(`${API_BASE_URL}/api/listings/listings`);
        const data = await res.json();
        const filtered = data.filter(c =>
          c.RentSell === (mode === 'rent' ? 'Rent' : 'Sell') && c.listing_status === 'active'
        );
        setCars(filtered.map((c, i) => ({
          id:           c.listing_id || i,
          listing_id:   c.listing_id,
          make:         c.make         || 'Unknown',
          model:        c.model        || 'Model',
          year:         c.year         || new Date().getFullYear(),
          price:        c.price?.$numberDecimal ? parseFloat(c.price.$numberDecimal) : 0,
          mileage:      c.mileage      || 0,
          carType:      c.carType      || 'Unknown',
          fuelType:     c.fuelType     || 'Petrol',
          transmission: c.transmission || 'Auto',
          image:        c.images?.[0]?.url || '',
          rentSell:     c.RentSell,
          rating:       (Math.random() * 2 + 3).toFixed(1),
          reviews:      Math.floor(Math.random() * 100) + 1,
        })));
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetchCars();
  }, [mode]);

  const allMakes = [...new Set(cars.map(c => c.make))].filter(Boolean);
  const allTypes = [...new Set(cars.map(c => c.carType))].filter(Boolean);
  const allYears = [...new Set(cars.map(c => c.year))].sort().reverse();

  // ── original filter logic ──
  const filtered = cars.filter(c => {
    if (c.price > priceRange) return false;
    if (make && c.make !== make) return false;
    if (carType && c.carType !== carType) return false;
    if (year && c.year.toString() !== year) return false;
    if (transmission !== 'All' && c.transmission !== transmission) return false;
    if (mode === 'rent' && c.rating < minRating) return false;
    if (searchQuery && !`${c.make} ${c.model} ${c.year}`.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  }).sort((a, b) => {
    if (sortOrder === 'lowToHigh') return a.price - b.price;
    if (sortOrder === 'highToLow') return b.price - a.price;
    return 0;
  });

  const resetFilters = () => {
    setMake(''); setCarType(''); setYear('');
    setTransmission('All'); setPriceRange(100000);
    setSortOrder('none'); setMinRating(0); setSearchQuery('');
  };

  const imgSrc = (car) => {
    if (!car.image) return '';
    return car.image.startsWith('http') ? car.image : `${API_BASE_URL}${car.image}`;
  };

  const CardSkeleton = () => (
    <div style={{ background: '#fff', border: '1px solid #E5E7F0', borderRadius: 12, overflow: 'hidden' }}>
      <div className="skeleton" style={{ height: 196 }} />
      <div style={{ padding: 16 }}>
        <div className="skeleton" style={{ height: 12, width: '45%', marginBottom: 6 }} />
        <div className="skeleton" style={{ height: 18, width: '70%', marginBottom: 10 }} />
        <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
          {[1,2,3].map(j => <div key={j} className="skeleton" style={{ height: 26, width: 72, borderRadius: 6 }} />)}
        </div>
        <div className="skeleton" style={{ height: 1, marginBottom: 12 }} />
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div className="skeleton" style={{ height: 20, width: 110 }} />
          <div className="skeleton" style={{ height: 30, width: 80, borderRadius: 6 }} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="explore-root">
      <style>{STYLES}</style>

      {/* ── PAGE HERO ── */}
      <div className="explore-hero">
        <div className="explore-hero-inner">
          <div>
            <div className="breadcrumb">
              <Link to="/">Home</Link> / <span style={{ color: '#3B6BF0' }}>
                {mode === 'rent' ? 'Cars for Hire' : 'Cars for Sale'}
              </span>
            </div>
            <h1 className="page-title">
              {mode === 'rent' ? 'Cars Available to Hire' : 'Cars Available to Buy'}
            </h1>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 12 }}>
            <div className="mode-toggle">
              <button className={`mode-btn${mode === 'buy' ? ' active' : ''}`} onClick={() => setMode('buy')}>Buy</button>
              <button className={`mode-btn${mode === 'rent' ? ' active' : ''}`} onClick={() => setMode('rent')}>Hire</button>
            </div>
            <div className="search-bar-row">
              <div className="search-input-wrap">
                <Search size={15} className="search-icon-pos" />
                <input
                  className="search-input"
                  placeholder="Search make, model, year…"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
              <button
                className={`filter-toggle-btn${filtersOpen ? ' active' : ''}`}
                onClick={() => setFiltersOpen(!filtersOpen)}
              >
                <SlidersHorizontal size={14} />
                Filters
                {filtersOpen && <X size={13} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── BODY ── */}
      <div className="explore-body">

        {/* SIDEBAR */}
        <aside className={`filter-sidebar${filtersOpen ? ' mobile-open' : ''}`}>
          <div className="filter-title">
            Filters
            <button className="filter-reset-link" onClick={resetFilters}>Reset all</button>
          </div>

          <div className="filter-group">
            <div className="filter-group-label">Sort by Price</div>
            <select className="filter-select" value={sortOrder} onChange={e => setSortOrder(e.target.value)}>
              <option value="none">Default</option>
              <option value="lowToHigh">Low → High</option>
              <option value="highToLow">High → Low</option>
            </select>
          </div>

          <div className="filter-group">
            <div className="filter-group-label">Max Price (KSH)</div>
            <div className="price-range-display">
              <span>KSH 0</span>
              <span className="price-current">KSH {priceRange.toLocaleString()}</span>
            </div>
            <input
              type="range" className="range-input"
              min="0" max="100000" step="1000"
              value={priceRange}
              onChange={e => setPriceRange(parseInt(e.target.value))}
            />
            <div style={{ fontSize: 11, color: '#8888A8', marginTop: 4, textAlign: 'right' }}>KSH 100,000+</div>
          </div>

          <div className="filter-group">
            <div className="filter-group-label">Make</div>
            <select className="filter-select" value={make} onChange={e => setMake(e.target.value)}>
              <option value="">All Makes</option>
              {allMakes.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>

          <div className="filter-group">
            <div className="filter-group-label">Body Type</div>
            <select className="filter-select" value={carType} onChange={e => setCarType(e.target.value)}>
              <option value="">All Types</option>
              {allTypes.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div className="filter-group">
            <div className="filter-group-label">Transmission</div>
            <select className="filter-select" value={transmission} onChange={e => setTransmission(e.target.value)}>
              <option value="All">All</option>
              <option value="Automatic">Automatic</option>
              <option value="Manual">Manual</option>
            </select>
          </div>

          <div className="filter-group">
            <div className="filter-group-label">Year</div>
            <select className="filter-select" value={year} onChange={e => setYear(e.target.value)}>
              <option value="">All Years</option>
              {allYears.map(y => <option key={y} value={y.toString()}>{y}</option>)}
            </select>
          </div>

          {mode === 'rent' && (
            <div className="filter-group">
              <div className="filter-group-label">Min Rating</div>
              <select className="filter-select" value={minRating} onChange={e => setMinRating(Number(e.target.value))}>
                <option value={0}>All Ratings</option>
                <option value={3}>3+ Stars</option>
                <option value={4}>4+ Stars</option>
                <option value={4.5}>4.5+ Stars</option>
              </select>
            </div>
          )}
        </aside>

        {/* RESULTS */}
        <div>
          <div className="results-header">
            <div className="results-count">
              <strong>{filtered.length}</strong> {filtered.length === 1 ? 'result' : 'results'} found
            </div>
            <div className="sort-row">
              <select className="sort-select" value={sortOrder} onChange={e => setSortOrder(e.target.value)}>
                <option value="none">Sort: Default</option>
                <option value="lowToHigh">Price: Low to High</option>
                <option value="highToLow">Price: High to Low</option>
              </select>
              <div className="view-toggle">
                <button className={`view-btn${viewMode === 'grid' ? ' active' : ''}`} onClick={() => setViewMode('grid')} title="Grid"><Grid3x3 size={14} /></button>
                <button className={`view-btn${viewMode === 'list' ? ' active' : ''}`} onClick={() => setViewMode('list')} title="List"><List size={14} /></button>
              </div>
            </div>
          </div>

          <div className={`cars-grid${viewMode === 'list' ? ' list-view' : ''}`}>
            {loading
              ? Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)
              : filtered.length === 0
                ? (
                  <div className="empty-state">
                    <div className="empty-icon">🔍</div>
                    <div className="empty-title">No cars found</div>
                    <p className="empty-sub">Try adjusting your filters or search term</p>
                  </div>
                )
                : filtered.map(car => (
                  <Link
                    key={car.id}
                    to={`/${mode}-car/${car.listing_id}`}
                    className={`car-card${viewMode === 'list' ? ' list-card' : ''}`}
                  >
                    <div className="card-img-wrap">
                      {imgSrc(car)
                        ? <img src={imgSrc(car)} alt={`${car.make} ${car.model}`} className="card-img" />
                        : <div className="card-placeholder">🚗</div>
                      }
                      <div className="card-badges">
                        <span className={`badge ${mode === 'rent' ? 'badge-hire' : 'badge-sale'}`}>
                          {mode === 'rent' ? 'For Hire' : 'For Sale'}
                        </span>
                      </div>
                      <div className="card-year-badge">{car.year}</div>
                    </div>

                    <div className="card-body">
                      <div className="card-body-type">{car.carType}</div>
                      <div className="card-name">{car.make} {car.model}</div>
                      <div className="card-sub">{car.year} · {car.carType}</div>

                      {mode === 'rent' && (
                        <div className="card-rating">
                          <Star size={12} fill="#F4A017" color="#F4A017" />
                          <span style={{ color: '#F4A017', fontWeight: 600 }}>{car.rating}</span>
                          <span>({car.reviews} reviews)</span>
                        </div>
                      )}

                      <div className="card-specs">
                        <div className="spec-pill"><Fuel size={12} />{car.fuelType}</div>
                        <div className="spec-pill"><Settings2 size={12} />{car.transmission}</div>
                        <div className="spec-pill"><Gauge size={12} />{car.mileage.toLocaleString()} km</div>
                      </div>

                      <div className="card-footer">
                        <div>
                          <div className="card-price">KSH {car.price.toLocaleString()}</div>
                          {mode === 'rent' && <div className="card-price-sub">per day</div>}
                        </div>
                        <div className="view-btn-card">
                          {mode === 'rent' ? 'Hire Now' : 'View'} <ArrowRight size={12} />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
            }
          </div>

          {!loading && filtered.length > 0 && (
            <div className="pagination">
              {[1,2,3,4,5].map(n => (
                <button key={n} className={`page-btn${n === 1 ? ' active' : ''}`}>{n}</button>
              ))}
              <button className="page-btn">→</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}