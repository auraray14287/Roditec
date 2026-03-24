import React, { useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config/apiConfig';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@600;700;800&family=Inter:wght@400;500;600&display=swap');

  .clf-root { font-family:'Inter',sans-serif; color:#1A1A2E; }
  .clf-grid { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
  @media(max-width:540px){ .clf-grid { grid-template-columns:1fr; } }
  .clf-field { display:flex; flex-direction:column; gap:5px; }
  .clf-field.full { grid-column:1/-1; }
  .clf-label { font-size:10px; font-weight:700; letter-spacing:.8px; text-transform:uppercase; color:#8888A8; }
  .clf-input,.clf-select,.clf-textarea {
    background:#F7F8FC; border:1px solid #E5E7F0; border-radius:8px;
    padding:10px 12px; color:#1A1A2E; font-family:'Inter',sans-serif;
    font-size:13px; outline:none; transition:border .18s;
    appearance:none; -webkit-appearance:none; width:100%;
  }
  .clf-select {
    background-image:url("data:image/svg+xml,%3Csvg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%238888A8' stroke-width='2' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
    background-repeat:no-repeat; background-position:right 10px center; padding-right:32px;
  }
  .clf-select option { background:#fff; color:#1A1A2E; }
  .clf-input:focus,.clf-select:focus,.clf-textarea:focus { border-color:#3B6BF0; background:#fff; }
  .clf-input::placeholder,.clf-textarea::placeholder { color:#AAAACC; }
  .clf-textarea { resize:vertical; min-height:80px; }
  .clf-section { font-family:'Manrope',sans-serif; font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:.5px; color:#3B6BF0; grid-column:1/-1; padding-bottom:8px; border-bottom:1px solid #E5E7F0; margin-top:8px; display:flex; align-items:center; gap:6px; }
  .clf-section::before { content:''; width:3px; height:12px; background:#3B6BF0; border-radius:2px; }
  .clf-submit { width:100%; margin-top:20px; background:#3B6BF0; color:#fff; border:none; padding:13px; border-radius:8px; font-family:'Inter',sans-serif; font-weight:600; font-size:14px; cursor:pointer; transition:all .2s; }
  .clf-submit:hover { background:#2952CC; transform:translateY(-1px); box-shadow:0 4px 14px rgba(59,107,240,.3); }
`;

const AdminCarListingForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    listing_status: 'active',
    user_id: '',
    owner: '',
    RentSell: 'Rent',
    make: '',
    model: '',
    year: '',
    mileage: '',
    price: '',
    location: '',
    condition: 'Excellent',
    certified: false,
    engine: '',
    transmission: '',
    fuelType: '',
    seatingCapacity: '',
    interiorColor: '',
    exteriorColor: '',
    carType: '',
    vin: '',
    description: '',
    images: [],
  });
  const [selectedFile, setSelectedFile] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files);
  };

  // original submit logic — fixed API URL template literal bug
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isNaN(formData.user_id) || formData.user_id.trim() === '') {
      alert('Please enter a valid user ID (numeric value).');
      return;
    }
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key !== 'images') data.append(key, formData[key]);
    });
    if (selectedFile) {
      for (let i = 0; i < selectedFile.length; i++) {
        data.append('images', selectedFile[i]);
      }
    }
    try {
      await axios.post(`${API_BASE_URL}/api/listings/listings`, data);
      alert('Listing added successfully!');
      setFormData({
        listing_status: 'active', user_id: '', owner: '', RentSell: 'Rent',
        make: '', model: '', year: '', mileage: '', price: '', location: '',
        condition: 'Excellent', certified: false, engine: '', transmission: '',
        fuelType: '', seatingCapacity: '', interiorColor: '', exteriorColor: '',
        carType: '', vin: '', description: '', images: [],
      });
      setSelectedFile(null);
      if (onClose) onClose();
    } catch (error) {
      console.error('Error adding listing:', error);
      alert('Error adding listing');
    }
  };

  return (
    <div className="clf-root">
      <style>{STYLES}</style>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="clf-grid">

          <div className="clf-section">Listing Info</div>

          <div className="clf-field">
            <label className="clf-label">Listing Status</label>
            <select className="clf-select" name="listing_status" value={formData.listing_status} onChange={handleInputChange}>
              <option value="active">Active</option>
              <option value="sold">Sold</option>
              <option value="rented">Rented</option>
              <option value="requested">Requested</option>
            </select>
          </div>

          <div className="clf-field">
            <label className="clf-label">Rent or Sell</label>
            <select className="clf-select" name="RentSell" value={formData.RentSell} onChange={handleInputChange}>
              <option value="Rent">Rent</option>
              <option value="Sell">Sell</option>
            </select>
          </div>

          <div className="clf-field">
            <label className="clf-label">User ID</label>
            <input className="clf-input" type="text" name="user_id" value={formData.user_id} onChange={handleInputChange} placeholder="Numeric User ID"/>
          </div>

          <div className="clf-field">
            <label className="clf-label">Owner</label>
            <input className="clf-input" type="text" name="owner" value={formData.owner} onChange={handleInputChange} placeholder="Owner name"/>
          </div>

          <div className="clf-section">Vehicle Details</div>

          <div className="clf-field">
            <label className="clf-label">Make</label>
            <input className="clf-input" type="text" name="make" value={formData.make} onChange={handleInputChange} placeholder="e.g. Toyota"/>
          </div>

          <div className="clf-field">
            <label className="clf-label">Model</label>
            <input className="clf-input" type="text" name="model" value={formData.model} onChange={handleInputChange} placeholder="e.g. Corolla"/>
          </div>

          <div className="clf-field">
            <label className="clf-label">Year</label>
            <input className="clf-input" type="number" name="year" value={formData.year} onChange={handleInputChange} placeholder="e.g. 2020"/>
          </div>

          <div className="clf-field">
            <label className="clf-label">Mileage (km)</label>
            <input className="clf-input" type="number" name="mileage" value={formData.mileage} onChange={handleInputChange} placeholder="e.g. 45000"/>
          </div>

          <div className="clf-field">
            <label className="clf-label">Price (KSH)</label>
            <input className="clf-input" type="number" name="price" value={formData.price} onChange={handleInputChange} placeholder="e.g. 1500000"/>
          </div>

          <div className="clf-field">
            <label className="clf-label">Location</label>
            <input className="clf-input" type="text" name="location" value={formData.location} onChange={handleInputChange} placeholder="City or Town"/>
          </div>

          <div className="clf-field">
            <label className="clf-label">Car Type</label>
            <select className="clf-select" name="carType" value={formData.carType} onChange={handleInputChange}>
              <option value="">Select Type</option>
              <option value="SUV">SUV</option>
              <option value="Sedan">Sedan</option>
              <option value="Hatchback">Hatchback</option>
              <option value="Truck">Truck</option>
              <option value="Coupe">Coupe</option>
              <option value="Wagon">Wagon</option>
              <option value="Van">Van</option>
            </select>
          </div>

          <div className="clf-field">
            <label className="clf-label">Condition</label>
            <select className="clf-select" name="condition" value={formData.condition} onChange={handleInputChange}>
              <option value="Excellent">Excellent</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
            </select>
          </div>

          <div className="clf-section">Specs</div>

          <div className="clf-field">
            <label className="clf-label">Engine</label>
            <input className="clf-input" type="text" name="engine" value={formData.engine} onChange={handleInputChange} placeholder="e.g. 1.8L 4-cylinder"/>
          </div>

          <div className="clf-field">
            <label className="clf-label">Transmission</label>
            <select className="clf-select" name="transmission" value={formData.transmission} onChange={handleInputChange}>
              <option value="">Select</option>
              <option value="Automatic">Automatic</option>
              <option value="Manual">Manual</option>
              <option value="CVT">CVT</option>
            </select>
          </div>

          <div className="clf-field">
            <label className="clf-label">Fuel Type</label>
            <select className="clf-select" name="fuelType" value={formData.fuelType} onChange={handleInputChange}>
              <option value="">Select</option>
              <option value="Petrol">Petrol</option>
              <option value="Diesel">Diesel</option>
              <option value="Electric">Electric</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>

          <div className="clf-field">
            <label className="clf-label">Seating Capacity</label>
            <input className="clf-input" type="number" name="seatingCapacity" value={formData.seatingCapacity} onChange={handleInputChange} placeholder="e.g. 5" min="2" max="15"/>
          </div>

          <div className="clf-field">
            <label className="clf-label">Exterior Color</label>
            <input className="clf-input" type="text" name="exteriorColor" value={formData.exteriorColor} onChange={handleInputChange} placeholder="e.g. Pearl White"/>
          </div>

          <div className="clf-field">
            <label className="clf-label">Interior Color</label>
            <input className="clf-input" type="text" name="interiorColor" value={formData.interiorColor} onChange={handleInputChange} placeholder="e.g. Black"/>
          </div>

          <div className="clf-field">
            <label className="clf-label">VIN (Optional)</label>
            <input className="clf-input" type="text" name="vin" value={formData.vin} onChange={handleInputChange} placeholder="Vehicle ID number"/>
          </div>

          <div className="clf-section">Description & Images</div>

          <div className="clf-field full">
            <label className="clf-label">Description</label>
            <textarea className="clf-textarea" name="description" value={formData.description} onChange={handleInputChange} placeholder="Describe the car's condition, features, or any unique details…"/>
          </div>

          <div className="clf-field full">
            <label className="clf-label">Images</label>
            <input className="clf-input" type="file" multiple onChange={handleFileChange} accept="image/*"/>
          </div>

        </div>

        <button type="submit" className="clf-submit">Add Listing</button>
      </form>
    </div>
  );
};

export default AdminCarListingForm;