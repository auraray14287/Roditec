import React, { useState, useEffect } from 'react';
import { ArrowRight, Camera, Loader2, ShieldX, Check } from 'lucide-react';
import axios from 'axios';
import UserAuth from '../auth/UserAuth';
import API_BASE_URL from '../config/apiConfig';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@600;700;800&family=Inter:wght@400;500;600&display=swap');

  .sc-root { min-height:100vh; background:#F7F8FC; font-family:'Inter',sans-serif; color:#1A1A2E; }

  /* HERO HEADER */
  .sc-header { background:#fff; border-bottom:1px solid #E5E7F0; padding:32px 0; }
  .sc-header-inner { max-width:960px; margin:0 auto; padding:0 24px; }
  .sc-header-label { font-size:11px; font-weight:700; letter-spacing:.8px; text-transform:uppercase; color:#3B6BF0; margin-bottom:6px; }
  .sc-header-title { font-family:'Manrope',sans-serif; font-weight:800; font-size:clamp(22px,3vw,30px); color:#1A1A2E; margin-bottom:8px; }
  .sc-header-sub { font-size:14px; color:#8888A8; }

  /* STEPPER */
  .sc-stepper { max-width:960px; margin:0 auto; padding:28px 24px 0; }
  .sc-steps { display:flex; align-items:center; gap:0; margin-bottom:32px; overflow-x:auto; padding-bottom:4px; }
  .sc-step { display:flex; align-items:center; gap:10px; flex-shrink:0; }
  .sc-step-circle {
    width:32px; height:32px; border-radius:50%;
    display:flex; align-items:center; justify-content:center;
    font-family:'Manrope',sans-serif; font-weight:700; font-size:13px;
    flex-shrink:0; transition:all .2s;
  }
  .sc-step-circle.done { background:#3B6BF0; color:#fff; }
  .sc-step-circle.active { background:#3B6BF0; color:#fff; box-shadow:0 0 0 4px rgba(59,107,240,.15); }
  .sc-step-circle.pending { background:#E5E7F0; color:#8888A8; }
  .sc-step-label { font-size:12px; font-weight:600; white-space:nowrap; }
  .sc-step-label.done,.sc-step-label.active { color:#1A1A2E; }
  .sc-step-label.pending { color:#8888A8; }
  .sc-step-divider { flex:1; min-width:24px; height:2px; background:#E5E7F0; margin:0 8px; }
  .sc-step-divider.done { background:#3B6BF0; }

  /* FORM CARD */
  .sc-card { background:#fff; border:1px solid #E5E7F0; border-radius:14px; padding:32px; max-width:960px; margin:0 auto 32px; }
  .sc-step-title { font-family:'Manrope',sans-serif; font-weight:800; font-size:18px; color:#1A1A2E; margin-bottom:24px; display:flex; align-items:center; gap:10px; }
  .sc-step-badge { width:28px; height:28px; border-radius:50%; background:#EEF2FF; color:#3B6BF0; display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:700; }

  .sc-grid { display:grid; grid-template-columns:1fr 1fr; gap:18px; }
  @media(max-width:600px){ .sc-grid { grid-template-columns:1fr; } }
  .sc-field { display:flex; flex-direction:column; gap:6px; }
  .sc-field.full { grid-column:1/-1; }
  .sc-label { font-size:11px; font-weight:700; letter-spacing:.6px; text-transform:uppercase; color:#8888A8; }
  .sc-input,.sc-select,.sc-textarea {
    background:#F7F8FC; border:1px solid #E5E7F0; border-radius:8px;
    padding:11px 14px; color:#1A1A2E; font-family:'Inter',sans-serif;
    font-size:13px; outline:none; transition:border .18s;
    appearance:none; -webkit-appearance:none; width:100%;
  }
  .sc-select {
    background-image:url("data:image/svg+xml,%3Csvg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%238888A8' stroke-width='2' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
    background-repeat:no-repeat; background-position:right 12px center; padding-right:36px;
  }
  .sc-select option { background:#fff; color:#1A1A2E; }
  .sc-input:focus,.sc-select:focus,.sc-textarea:focus { border-color:#3B6BF0; background:#fff; }
  .sc-input::placeholder,.sc-textarea::placeholder { color:#AAAACC; }
  .sc-textarea { resize:vertical; min-height:100px; }

  /* CHECKBOXES */
  .sc-check-group { display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-top:4px; }
  .sc-check-label { display:flex; align-items:center; gap:8px; font-size:13px; color:#4A4A68; cursor:pointer; }
  .sc-check-label input[type=checkbox] { width:16px; height:16px; accent-color:#3B6BF0; cursor:pointer; }

  /* IMAGE UPLOAD */
  .sc-upload-zone {
    border:2px dashed #C7D7FA; border-radius:10px; padding:40px 20px;
    display:flex; flex-direction:column; align-items:center; gap:12px;
    background:#EEF2FF; cursor:pointer; transition:all .2s;
  }
  .sc-upload-zone:hover { border-color:#3B6BF0; background:#E6EDFF; }
  .sc-upload-icon { width:48px; height:48px; background:#fff; border-radius:50%; display:flex; align-items:center; justify-content:center; color:#3B6BF0; box-shadow:0 2px 8px rgba(59,107,240,.15); }
  .sc-upload-text { font-size:13px; color:#4A4A68; text-align:center; }
  .sc-upload-link { color:#3B6BF0; font-weight:600; }
  .sc-upload-hint { font-size:11px; color:#8888A8; }
  .sc-preview-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(120px,1fr)); gap:12px; margin-top:16px; }
  .sc-preview-item { position:relative; border-radius:8px; overflow:hidden; aspect-ratio:1; }
  .sc-preview-item img { width:100%; height:100%; object-fit:cover; }
  .sc-preview-remove { position:absolute; top:4px; right:4px; width:22px; height:22px; background:#E63946; color:#fff; border:none; border-radius:50%; cursor:pointer; display:flex; align-items:center; justify-content:center; font-size:14px; font-weight:700; line-height:1; }

  /* TIPS BOX */
  .sc-tips { background:#EEF2FF; border:1px solid rgba(59,107,240,.15); border-radius:10px; padding:16px 18px; margin-top:20px; }
  .sc-tips-title { font-size:12px; font-weight:700; letter-spacing:.5px; text-transform:uppercase; color:#3B6BF0; margin-bottom:8px; }
  .sc-tips ul { margin:0; padding-left:18px; }
  .sc-tips li { font-size:12px; color:#4A4A68; margin-bottom:4px; }

  /* ERROR */
  .sc-error { background:#FEF2F2; border:1px solid rgba(230,57,70,.2); border-radius:8px; padding:12px 16px; margin-bottom:20px; font-size:13px; color:#E63946; }

  /* NAV BUTTONS */
  .sc-nav { display:flex; justify-content:space-between; align-items:center; margin-top:28px; padding-top:20px; border-top:1px solid #E5E7F0; }
  .sc-nav-left { display:flex; gap:10px; }
  .btn-back { display:flex; align-items:center; gap:6px; background:#F7F8FC; color:#4A4A68; border:1px solid #E5E7F0; padding:10px 20px; border-radius:8px; font-family:'Inter',sans-serif; font-weight:500; font-size:13px; cursor:pointer; transition:all .18s; }
  .btn-back:hover { border-color:#3B6BF0; color:#3B6BF0; }
  .btn-next { display:flex; align-items:center; gap:6px; background:#3B6BF0; color:#fff; border:none; padding:10px 24px; border-radius:8px; font-family:'Inter',sans-serif; font-weight:600; font-size:13px; cursor:pointer; transition:all .18s; }
  .btn-next:hover:not(:disabled) { background:#2952CC; transform:translateY(-1px); box-shadow:0 4px 14px rgba(59,107,240,.3); }
  .btn-next:disabled { opacity:.6; cursor:not-allowed; }

  /* ACCESS SCREENS */
  .sc-access-screen { min-height:100vh; background:#F7F8FC; display:flex; align-items:center; justify-content:center; padding:24px; }
  .sc-access-card { background:#fff; border:1px solid #E5E7F0; border-radius:16px; padding:48px 40px; max-width:440px; width:100%; text-align:center; box-shadow:0 4px 24px rgba(0,0,0,.06); }
  .sc-access-icon { width:72px; height:72px; border-radius:50%; display:flex; align-items:center; justify-content:center; margin:0 auto 20px; }
  .sc-access-icon.deny { background:#FEF2F2; color:#E63946; }
  .sc-access-title { font-family:'Manrope',sans-serif; font-weight:800; font-size:22px; color:#1A1A2E; margin-bottom:10px; }
  .sc-access-text { font-size:14px; color:#8888A8; line-height:1.6; margin-bottom:28px; }
  .btn-home { display:inline-flex; align-items:center; gap:6px; background:#3B6BF0; color:#fff; border:none; padding:11px 24px; border-radius:8px; font-family:'Inter',sans-serif; font-weight:600; font-size:14px; cursor:pointer; text-decoration:none; transition:all .18s; }
  .btn-home:hover { background:#2952CC; }
`;

const STEPS = ['Basic Information', 'Specifications', 'Features & Extras', 'Photo Upload'];

function SellCar() {
  const [step, setStep] = useState(1);
  const [selectedImages, setSelectedImages] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [isAuthorized, setIsAuthorized] = useState(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const userId = localStorage.getItem('id');

  // original permission check
  useEffect(() => {
    const checkPostingPermission = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/users/profile/${userId}`);
        const user = response.data;
        const allowed = user.role === 'admin' || user.role === 'poster' || user.canPostListings === true;
        setIsAuthorized(allowed);
      } catch (err) {
        console.error('Permission check failed:', err);
        setIsAuthorized(false);
      }
    };
    if (userId) checkPostingPermission();
    else setIsAuthorized(false);
  }, [userId]);

  const [formData, setFormData] = useState({
    user_id: String(userId),
    listing_status: 'requested',
    owner: '', RentSell: '', make: '', model: '', year: '',
    mileage: '', price: '', location: '', condition: '',
    filename: '', url: '', engine: '', transmission: '', fuelType: '',
    seatingCapacity: '', interiorColor: '', exteriorColor: '',
    carType: '', vin: '',
    serviceHistory: { recentServicing: false, noAccidentHistory: false, modifications: false },
    extraFeatures: { gps: false, sunroof: false, leatherSeats: false, backupCamera: false },
    certificationReport: null, description: '', modificationDetails: '',
    contactMethods: [], availability: '', responseTime: ''
  });

  // original handlers
  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) { setError('Maximum 5 images allowed'); return; }
    setSelectedImages(files);
    setImageUrls(files.map(f => URL.createObjectURL(f)));
  };

  const removeImage = (index) => {
    const ni = [...selectedImages]; const nu = [...imageUrls];
    URL.revokeObjectURL(nu[index]);
    ni.splice(index,1); nu.splice(index,1);
    setSelectedImages(ni); setImageUrls(nu);
  };

  const handleInputChange = (e) => {
    const { id, value, type, checked } = e.target;
    if (id.includes('.')) {
      const [parent, child] = id.split('.');
      setFormData(prev => ({ ...prev, [parent]: { ...prev[parent], [child]: type==='checkbox' ? checked : value } }));
    } else {
      setFormData(prev => ({ ...prev, [id]: type==='checkbox' ? checked : value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); setError('');
    try {
      const fd = new FormData();
      Object.keys(formData).forEach(key => {
        if (typeof formData[key]==='object' && formData[key]!==null) fd.append(key, JSON.stringify(formData[key]));
        else fd.append(key, formData[key]);
      });
      selectedImages.forEach(img => fd.append('images', img));
      const response = await fetch(`${API_BASE_URL}/api/listings/listings`, {
        method: 'POST',
        headers: { 'user-id': userId },
        body: fd,
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create listing');
      }
      alert('Your car listing request has been successfully submitted!');
    } catch (err) {
      setError(err.message || 'An error occurred while creating the listing');
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => { setError(''); setStep(s => s+1); };
  const prevStep = () => { setError(''); setStep(s => s-1); };

  // Loading
  if (isAuthorized === null) {
    return (
      <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#F7F8FC' }}>
        <Loader2 style={{ animation:'spin 1s linear infinite', color:'#3B6BF0', width:40, height:40 }}/>
        <style>{`@keyframes spin { to { transform:rotate(360deg); } }`}</style>
      </div>
    );
  }

  // Not authorized
  if (!isAuthorized) {
    return (
      <>
        <style>{STYLES}</style>
        <div className="sc-access-screen">
          <div className="sc-access-card">
            <div className="sc-access-icon deny"><ShieldX size={32}/></div>
            <div className="sc-access-title">Access Restricted</div>
            <div className="sc-access-text">
              You are not authorized to post car listings. Only admin-approved users can create listings on Roditec.
              Please contact the admin to request posting access.
            </div>
            <a href="/" className="btn-home">Back to Home</a>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{STYLES}</style>
      <div className="sc-root">

        {/* HEADER */}
        <div className="sc-header">
          <div className="sc-header-inner">
            <div className="sc-header-label">List your car</div>
            <div className="sc-header-title">Sell Your Car Hassle-Free</div>
            <div className="sc-header-sub">Reach thousands of potential buyers with our quick and easy listing process</div>
          </div>
        </div>

        <div className="sc-stepper">

          {/* STEP INDICATOR */}
          <div className="sc-steps">
            {STEPS.map((label, i) => {
              const num = i + 1;
              const state = num < step ? 'done' : num === step ? 'active' : 'pending';
              return (
                <React.Fragment key={i}>
                  <div className="sc-step">
                    <div className={`sc-step-circle ${state}`}>
                      {state === 'done' ? <Check size={14}/> : num}
                    </div>
                    <span className={`sc-step-label ${state}`}>{label}</span>
                  </div>
                  {i < STEPS.length - 1 && <div className={`sc-step-divider${state==='done'?' done':''}`}/>}
                </React.Fragment>
              );
            })}
          </div>

          {error && <div className="sc-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="sc-card">

              {/* STEP 1 */}
              {step === 1 && (
                <>
                  <div className="sc-step-title"><span className="sc-step-badge">1</span> Basic Information</div>
                  <div className="sc-grid">
                    <div className="sc-field">
                      <label className="sc-label" htmlFor="owner">Owner</label>
                      <input className="sc-input" type="number" id="owner" value={formData.owner} onChange={handleInputChange} placeholder="Enter Owner ID"/>
                    </div>
                    <div className="sc-field">
                      <label className="sc-label" htmlFor="RentSell">Rent or Sell</label>
                      <select className="sc-select" id="RentSell" value={formData.RentSell} onChange={handleInputChange}>
                        <option value="">Select</option>
                        <option value="Sell">Sell</option>
                        <option value="Rent">Rent</option>
                      </select>
                    </div>
                    <div className="sc-field">
                      <label className="sc-label" htmlFor="make">Car Make</label>
                      <input className="sc-input" type="text" id="make" value={formData.make} onChange={handleInputChange} placeholder="e.g. Toyota"/>
                    </div>
                    <div className="sc-field">
                      <label className="sc-label" htmlFor="model">Car Model</label>
                      <input className="sc-input" type="text" id="model" value={formData.model} onChange={handleInputChange} placeholder="e.g. Corolla"/>
                    </div>
                    <div className="sc-field">
                      <label className="sc-label" htmlFor="year">Year of Manufacture</label>
                      <input className="sc-input" type="number" id="year" value={formData.year} onChange={handleInputChange} placeholder="e.g. 2019"/>
                    </div>
                    <div className="sc-field">
                      <label className="sc-label" htmlFor="mileage">Mileage (km)</label>
                      <input className="sc-input" type="number" id="mileage" value={formData.mileage} onChange={handleInputChange} placeholder="e.g. 60000"/>
                    </div>
                    <div className="sc-field">
                      <label className="sc-label" htmlFor="price">Price (KSH)</label>
                      <input className="sc-input" type="number" id="price" value={formData.price} onChange={handleInputChange} placeholder="e.g. 1500000"/>
                    </div>
                    <div className="sc-field">
                      <label className="sc-label" htmlFor="location">Location</label>
                      <input className="sc-input" type="text" id="location" value={formData.location} onChange={handleInputChange} placeholder="City or Town"/>
                    </div>
                  </div>
                </>
              )}

              {/* STEP 2 */}
              {step === 2 && (
                <>
                  <div className="sc-step-title"><span className="sc-step-badge">2</span> Car Specifications</div>
                  <div className="sc-grid">
                    <div className="sc-field">
                      <label className="sc-label" htmlFor="engine">Engine</label>
                      <input className="sc-input" type="text" id="engine" value={formData.engine} onChange={handleInputChange} placeholder="e.g. 1.8L 4-cylinder"/>
                    </div>
                    <div className="sc-field">
                      <label className="sc-label" htmlFor="transmission">Transmission</label>
                      <select className="sc-select" id="transmission" value={formData.transmission} onChange={handleInputChange}>
                        <option value="">Select Transmission</option>
                        <option value="automatic">Automatic</option>
                        <option value="manual">Manual</option>
                        <option value="cvt">CVT</option>
                        <option value="semi-automatic">Semi-Automatic</option>
                      </select>
                    </div>
                    <div className="sc-field">
                      <label className="sc-label" htmlFor="fuelType">Fuel Type</label>
                      <select className="sc-select" id="fuelType" value={formData.fuelType} onChange={handleInputChange}>
                        <option value="">Select Fuel Type</option>
                        <option value="petrol">Petrol</option>
                        <option value="diesel">Diesel</option>
                        <option value="electric">Electric</option>
                        <option value="hybrid">Hybrid</option>
                        <option value="cng">CNG</option>
                        <option value="lpg">LPG</option>
                      </select>
                    </div>
                    <div className="sc-field">
                      <label className="sc-label" htmlFor="seatingCapacity">Seating Capacity</label>
                      <input className="sc-input" type="number" id="seatingCapacity" value={formData.seatingCapacity} onChange={handleInputChange} min="2" max="15" placeholder="e.g. 5"/>
                    </div>
                    <div className="sc-field">
                      <label className="sc-label" htmlFor="exteriorColor">Exterior Color</label>
                      <input className="sc-input" type="text" id="exteriorColor" value={formData.exteriorColor} onChange={handleInputChange} placeholder="e.g. Pearl White"/>
                    </div>
                    <div className="sc-field">
                      <label className="sc-label" htmlFor="interiorColor">Interior Color</label>
                      <input className="sc-input" type="text" id="interiorColor" value={formData.interiorColor} onChange={handleInputChange} placeholder="e.g. Black"/>
                    </div>
                    <div className="sc-field">
                      <label className="sc-label" htmlFor="carType">Car Type</label>
                      <select className="sc-select" id="carType" value={formData.carType} onChange={handleInputChange}>
                        <option value="">Select Car Type</option>
                        <option value="sedan">Sedan</option>
                        <option value="suv">SUV</option>
                        <option value="hatchback">Hatchback</option>
                        <option value="truck">Truck</option>
                        <option value="coupe">Coupe</option>
                        <option value="wagon">Wagon</option>
                        <option value="van">Van</option>
                        <option value="convertible">Convertible</option>
                      </select>
                    </div>
                    <div className="sc-field">
                      <label className="sc-label" htmlFor="vin">VIN <span style={{ textTransform:'none', fontWeight:500, color:'#AAAACC' }}>(Optional)</span></label>
                      <input className="sc-input" type="text" id="vin" value={formData.vin} onChange={handleInputChange} placeholder="Vehicle ID number"/>
                    </div>
                    <div className="sc-field full">
                      <label className="sc-label" htmlFor="condition">Vehicle Condition</label>
                      <select className="sc-select" id="condition" value={formData.condition} onChange={handleInputChange}>
                        <option value="">Select Condition</option>
                        <option value="Excellent">Excellent</option>
                        <option value="Good">Good</option>
                        <option value="Fair">Fair</option>
                      </select>
                    </div>
                    <div className="sc-field full">
                      <label className="sc-label">Service History</label>
                      <div className="sc-check-group">
                        {[
                          { key:'recentServicing',    label:'Recent servicing' },
                          { key:'noAccidentHistory',  label:'No accident history' },
                          { key:'modifications',      label:'Has modifications' },
                        ].map(({ key, label }) => (
                          <label key={key} className="sc-check-label">
                            <input type="checkbox" id={`serviceHistory.${key}`} checked={formData.serviceHistory[key]} onChange={handleInputChange}/>
                            {label}
                          </label>
                        ))}
                      </div>
                    </div>
                    {formData.serviceHistory.modifications && (
                      <div className="sc-field full">
                        <label className="sc-label" htmlFor="modificationDetails">Modification Details</label>
                        <textarea className="sc-textarea" id="modificationDetails" value={formData.modificationDetails} onChange={handleInputChange} placeholder="Describe any modifications made to the vehicle"/>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* STEP 3 */}
              {step === 3 && (
                <>
                  <div className="sc-step-title"><span className="sc-step-badge">3</span> Features & Extras</div>
                  <div className="sc-grid">
                    <div className="sc-field">
                      <label className="sc-label">Extra Features</label>
                      <div className="sc-check-group">
                        {[
                          { key:'gps',           label:'GPS Navigation' },
                          { key:'sunroof',        label:'Sunroof' },
                          { key:'leatherSeats',   label:'Leather Seats' },
                          { key:'backupCamera',   label:'Backup Camera' },
                        ].map(({ key, label }) => (
                          <label key={key} className="sc-check-label">
                            <input type="checkbox" id={`extraFeatures.${key}`} checked={formData.extraFeatures[key]} onChange={handleInputChange}/>
                            {label}
                          </label>
                        ))}
                      </div>
                    </div>
                    <div className="sc-field">
                      <label className="sc-label" htmlFor="certification">Inspection Report <span style={{ textTransform:'none', fontWeight:500, color:'#AAAACC' }}>(Optional)</span></label>
                      <input className="sc-input" type="file" id="certification" onChange={handleInputChange} accept=".pdf,.jpg,.png"/>
                    </div>
                    <div className="sc-field full">
                      <label className="sc-label" htmlFor="description">Description</label>
                      <textarea className="sc-textarea" id="description" value={formData.description} onChange={handleInputChange} placeholder="Describe the car's condition, unique features, or recent upgrades…"/>
                    </div>
                  </div>
                </>
              )}

              {/* STEP 4 */}
              {step === 4 && (
                <>
                  <div className="sc-step-title"><span className="sc-step-badge">4</span> Photo Upload</div>
                  <label htmlFor="file-upload" style={{ cursor:'pointer', display:'block' }}>
                    <div className="sc-upload-zone">
                      <div className="sc-upload-icon"><Camera size={22}/></div>
                      <div className="sc-upload-text">
                        <span className="sc-upload-link">Click to upload</span> or drag and drop
                      </div>
                      <div className="sc-upload-hint">PNG, JPG, GIF up to 10MB · Max 5 images</div>
                      <input id="file-upload" name="file-upload" type="file" style={{ display:'none' }}
                        onChange={handleImageSelect} accept="image/jpeg,image/png,image/gif,image/webp" multiple/>
                    </div>
                  </label>

                  {imageUrls.length > 0 && (
                    <div className="sc-preview-grid">
                      {imageUrls.map((url, index) => (
                        <div key={index} className="sc-preview-item">
                          <img src={url} alt={`Preview ${index+1}`}/>
                          <button type="button" className="sc-preview-remove" onClick={() => removeImage(index)}>×</button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="sc-tips">
                    <div className="sc-tips-title">Photo Tips</div>
                    <ul>
                      <li>Use natural light for better quality</li>
                      <li>Take photos from multiple angles — front, side, rear, interior</li>
                      <li>Include close-ups of any special features or damage</li>
                      <li>Avoid using filters or heavy editing</li>
                    </ul>
                  </div>
                </>
              )}

              {/* NAV */}
              <div className="sc-nav">
                <div className="sc-nav-left">
                  {step > 1 && (
                    <button type="button" className="btn-back" onClick={prevStep} disabled={isSubmitting}>
                      ← Previous
                    </button>
                  )}
                </div>
                {step < 4 ? (
                  <button type="button" className="btn-next" onClick={nextStep} disabled={isSubmitting}>
                    Next <ArrowRight size={15}/>
                  </button>
                ) : (
                  <button type="submit" className="btn-next" disabled={isSubmitting}>
                    {isSubmitting
                      ? <><Loader2 size={15} style={{ animation:'spin 1s linear infinite' }}/> Submitting…</>
                      : 'List My Car'
                    }
                  </button>
                )}
              </div>

            </div>
          </form>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform:rotate(360deg); } }`}</style>
    </>
  );
}

export default UserAuth(SellCar);