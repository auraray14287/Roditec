import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Filter, Edit, Eye, Trash2, Plus, X } from 'lucide-react';
import AdminLayout from './AdminLayout';
import AdminCarListingForm from './AdminCarListingForm';
import AdminAuth from './AdminAuth';
import API_BASE_URL from '../config/apiConfig';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@600;700;800&family=Inter:wght@400;500;600&display=swap');

  .cm-root { font-family:'Inter',sans-serif; color:#1A1A2E; }
  .cm-page-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:24px; flex-wrap:wrap; gap:12px; }
  .cm-page-label { font-size:11px; font-weight:700; letter-spacing:.8px; text-transform:uppercase; color:#3B6BF0; margin-bottom:4px; }
  .cm-page-title { font-family:'Manrope',sans-serif; font-weight:800; font-size:22px; color:#1A1A2E; }
  .cm-header-actions { display:flex; align-items:center; gap:10px; flex-wrap:wrap; }

  .btn-primary { display:flex; align-items:center; gap:6px; background:#3B6BF0; color:#fff; border:none; padding:9px 18px; border-radius:8px; font-family:'Inter',sans-serif; font-weight:600; font-size:13px; cursor:pointer; transition:all .18s; }
  .btn-primary:hover { background:#2952CC; transform:translateY(-1px); box-shadow:0 4px 14px rgba(59,107,240,.3); }
  .btn-secondary { display:flex; align-items:center; gap:6px; background:#fff; color:#4A4A68; border:1px solid #E5E7F0; padding:9px 18px; border-radius:8px; font-family:'Inter',sans-serif; font-weight:500; font-size:13px; cursor:pointer; transition:all .18s; }
  .btn-secondary:hover { border-color:#3B6BF0; color:#3B6BF0; }
  .btn-secondary.active { border-color:#3B6BF0; color:#3B6BF0; background:#EEF2FF; }
  .btn-cancel { display:flex; align-items:center; gap:6px; background:#F7F8FC; color:#4A4A68; border:1px solid #E5E7F0; padding:9px 18px; border-radius:8px; font-family:'Inter',sans-serif; font-weight:500; font-size:13px; cursor:pointer; transition:all .18s; }
  .btn-cancel:hover { background:#FEF2F2; color:#E63946; border-color:rgba(230,57,70,.3); }

  .filter-panel { background:#fff; border:1px solid #E5E7F0; border-radius:12px; padding:18px 20px; margin-bottom:20px; display:flex; flex-wrap:wrap; gap:14px; }
  .filter-field { flex:1; min-width:170px; display:flex; flex-direction:column; gap:5px; }
  .filter-label { font-size:10px; font-weight:700; letter-spacing:.8px; text-transform:uppercase; color:#8888A8; }
  .filter-input,.filter-select { background:#F7F8FC; border:1px solid #E5E7F0; border-radius:8px; padding:9px 12px; color:#1A1A2E; font-family:'Inter',sans-serif; font-size:13px; outline:none; transition:border .18s; appearance:none; -webkit-appearance:none; width:100%; }
  .filter-select { background-image:url("data:image/svg+xml,%3Csvg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%238888A8' stroke-width='2' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E"); background-repeat:no-repeat; background-position:right 10px center; padding-right:32px; }
  .filter-select option { background:#fff; color:#1A1A2E; }
  .filter-input:focus,.filter-select:focus { border-color:#3B6BF0; background:#fff; }
  .filter-input::placeholder { color:#AAAACC; }
  .search-wrap { position:relative; }
  .search-icon-pos { position:absolute; left:11px; top:50%; transform:translateY(-50%); color:#8888A8; pointer-events:none; }
  .search-wrap .filter-input { padding-left:34px; }
  .price-pair { display:flex; gap:8px; }

  .table-panel { background:#fff; border:1px solid #E5E7F0; border-radius:12px; overflow:hidden; }
  .table-wrap { overflow-x:auto; }
  table { width:100%; border-collapse:collapse; }
  thead th { padding:11px 16px; text-align:left; font-size:10px; font-weight:700; letter-spacing:.8px; text-transform:uppercase; color:#8888A8; background:#F7F8FC; white-space:nowrap; border-bottom:1px solid #E5E7F0; }
  tbody tr { border-bottom:1px solid #F0F0F8; transition:background .15s; }
  tbody tr:last-child { border-bottom:none; }
  tbody tr:hover { background:#F7F8FC; }
  td { padding:12px 16px; font-size:13px; color:#1A1A2E; white-space:nowrap; }
  .cell-primary { font-weight:600; color:#1A1A2E; }
  .cell-muted { font-size:11px; color:#8888A8; margin-top:2px; }
  .car-thumb { width:56px; height:44px; border-radius:7px; overflow:hidden; background:#F7F8FC; border:1px solid #E5E7F0; }
  .car-thumb img { width:100%; height:100%; object-fit:cover; }
  .price-cell { color:#3B6BF0; font-weight:700; font-family:'Manrope',sans-serif; }

  .s-pill { display:inline-flex; align-items:center; gap:4px; padding:3px 10px; border-radius:20px; font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:.4px; }
  .s-pill.active  { background:#D1E7DD; color:#0A5C36; }
  .s-pill.sold,.s-pill.rented { background:#F8D7DA; color:#842029; }
  .s-pill.requested,.s-pill.na { background:#FFF3CD; color:#856404; }
  .s-pill-dot { width:5px; height:5px; border-radius:50%; background:currentColor; }

  .action-btns { display:flex; align-items:center; gap:6px; }
  .action-btn { width:30px; height:30px; border-radius:6px; border:1px solid #E5E7F0; background:#F7F8FC; display:flex; align-items:center; justify-content:center; cursor:pointer; transition:all .18s; color:#8888A8; }
  .action-btn.edit:hover  { color:#3B6BF0; border-color:rgba(59,107,240,.3); background:#EEF2FF; }
  .action-btn.view:hover  { color:#2D9C5A; border-color:rgba(45,156,90,.3); background:#D1E7DD; }
  .action-btn.del:hover   { color:#E63946; border-color:rgba(230,57,70,.3); background:#FEF2F2; }
  .empty-row td { text-align:center; padding:48px; color:#8888A8; }

  /* MODAL */
  .modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,.45); backdrop-filter:blur(4px); display:flex; align-items:center; justify-content:center; z-index:1000; padding:16px; }
  .modal-box { background:#fff; border:1px solid #E5E7F0; border-radius:14px; width:100%; max-width:640px; max-height:90vh; overflow-y:auto; box-shadow:0 20px 60px rgba(0,0,0,.12); scrollbar-width:none; }
  .modal-box::-webkit-scrollbar { display:none; }
  .modal-header { display:flex; justify-content:space-between; align-items:center; padding:20px 24px; border-bottom:1px solid #E5E7F0; position:sticky; top:0; background:#fff; z-index:1; border-radius:14px 14px 0 0; }
  .modal-title { font-family:'Manrope',sans-serif; font-weight:700; font-size:16px; color:#1A1A2E; }
  .modal-close { width:30px; height:30px; border-radius:7px; background:#F7F8FC; border:1px solid #E5E7F0; color:#8888A8; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all .18s; }
  .modal-close:hover { background:#FEF2F2; color:#E63946; border-color:rgba(230,57,70,.2); }
  .modal-body { padding:24px; }
  .form-grid { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
  @media(max-width:540px){ .form-grid { grid-template-columns:1fr; } }
  .form-field { display:flex; flex-direction:column; gap:5px; }
  .form-field.full { grid-column:1/-1; }
  .form-label { font-size:10px; font-weight:700; letter-spacing:.8px; text-transform:uppercase; color:#8888A8; }
  .form-input,.form-select { background:#F7F8FC; border:1px solid #E5E7F0; border-radius:8px; padding:10px 12px; color:#1A1A2E; font-family:'Inter',sans-serif; font-size:13px; outline:none; transition:border .18s; appearance:none; -webkit-appearance:none; }
  .form-select { background-image:url("data:image/svg+xml,%3Csvg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%238888A8' stroke-width='2' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E"); background-repeat:no-repeat; background-position:right 10px center; padding-right:32px; }
  .form-select option { background:#fff; color:#1A1A2E; }
  .form-input:focus,.form-select:focus { border-color:#3B6BF0; background:#fff; }
  .form-input::placeholder { color:#AAAACC; }
  .form-footer { display:flex; justify-content:flex-end; gap:10px; padding-top:16px; border-top:1px solid #E5E7F0; margin-top:20px; }

  .view-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
  @media(max-width:540px){ .view-grid { grid-template-columns:1fr; } }
  .view-field { background:#F7F8FC; border:1px solid #E5E7F0; border-radius:8px; padding:12px 14px; }
  .view-field-label { font-size:10px; font-weight:700; letter-spacing:.8px; text-transform:uppercase; color:#8888A8; margin-bottom:4px; }
  .view-field-value { font-size:14px; font-weight:600; color:#1A1A2E; }
  .view-field-value.blue { color:#3B6BF0; font-family:'Manrope',sans-serif; }
`;

function CarManagement() {
  const [listings, setListings] = useState([]);
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [showViewModel, setShowViewModel] = useState(false);
  const [selectedListing, setSelectedListing] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showAdminCarListingForm, setShowAdminCarListingForm] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    make:'', model:'', year:'', price:'',
    carType:'Select Category', mileage:'',
    fuelType:'Select Fuel Type', transmission:'Select Transmission', listing_status:'NA'
  });

  const parseAmount = (amount) => {
    if (amount===null||amount===undefined) return 0;
    if (typeof amount==='number') return amount;
    if (typeof amount==='object'&&amount.$numberDecimal) return parseFloat(amount.$numberDecimal);
    const p=parseFloat(amount); return isNaN(p)?0:p;
  };

  useEffect(() => { fetchListings(); }, []);

  const fetchListings = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/listings/listings`);
      setListings(response.data.map(l => ({ ...l, price:parseAmount(l.price) })));
    } catch { alert('Failed to fetch listings'); }
  };

  const handleViewListing = async (listing) => {
    if (!listing?.listing_id) { alert('Cannot view listing: Invalid listing data'); return; }
    try {
      const response = await axios.get(`${API_BASE_URL}/api/listings/listings/${listing.listing_id}`);
      setSelectedListing(response.data); setShowViewModel(true);
    } catch (error) { alert(`Failed to fetch listing: ${error.response?.data?.message||'Unknown error'}`); }
  };

  const handleEditListing = async (listing) => {
    if (!listing?.listing_id) { alert('Cannot edit listing: Invalid listing data'); return; }
    try {
      const response = await axios.get(`${API_BASE_URL}/api/listings/listings/${listing.listing_id}`);
      if (!response.data) throw new Error('No data returned');
      setSelectedListing(response.data);
      setFormData({
        make:response.data.make||'', model:response.data.model||'',
        year:response.data.year?.toString()||'', price:response.data.price?.toString()||'',
        carType:response.data.carType||'Select Category', mileage:response.data.mileage?.toString()||'',
        fuelType:response.data.fuelType||'Select Fuel Type',
        transmission:response.data.transmission||'Select Transmission',
        listing_status:response.data.listing_status||'NA',
      });
      setShowAddEditModal(true);
    } catch (error) { alert(`Failed to fetch for editing: ${error.response?.data?.message||'Unknown error'}`); }
  };

  const handleSaveListing = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`${API_BASE_URL}/api/listings/listings/${selectedListing.listing_id}`, formData);
      if (response.status===200) { alert('Listing updated!'); setShowAddEditModal(false); fetchListings(); }
    } catch (error) { alert(`Failed to save: ${error.response?.data?.message||'Unknown error'}`); }
  };

  const handleDeleteListing = async (listing) => {
    if (!listing?._id) { alert('Cannot delete: Invalid listing data'); return; }
    if (!window.confirm('Delete this listing?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/listings/listings/${listing._id}`);
      fetchListings(); alert('Listing deleted');
    } catch (error) { alert(`Failed to delete: ${error.response?.data?.message||'Unknown error'}`); }
  };

  const handleCloseModal = () => {
    setShowAddEditModal(false); setShowViewModel(false); setSelectedListing(null);
    setFormData({ make:'',model:'',year:'',price:'',carType:'Select Category',mileage:'',fuelType:'Select Fuel Type',transmission:'Select Transmission',listing_status:'NA' });
  };

  const filteredListings = listings.filter(l => {
    const cat   = selectedCategory==="All Categories"||l.carType===selectedCategory;
    const price = (minPrice===""||l.price>=parseFloat(minPrice))&&(maxPrice===""||l.price<=parseFloat(maxPrice));
    const stat  = selectedStatus==="All Statuses"||l.listing_status===selectedStatus;
    const srch  = searchTerm===""||l.make?.toLowerCase().includes(searchTerm.toLowerCase())||l.model?.toLowerCase().includes(searchTerm.toLowerCase());
    return cat&&price&&stat&&srch;
  });

  const statusClass = (s) => {
    const m = { active:'active', sold:'sold', Sold:'sold', rented:'rented', Rented:'rented', requested:'requested', NA:'na' };
    return m[s]||'na';
  };

  return (
    <AdminLayout pageTitle="Car Management">
      <style>{STYLES}</style>
      <div className="cm-root">

        <div className="cm-page-header">
          <div>
            <div className="cm-page-label">Inventory</div>
            <div className="cm-page-title">Car Management</div>
          </div>
          <div className="cm-header-actions">
            <button className={`btn-secondary${showFilters?' active':''}`} onClick={() => setShowFilters(!showFilters)}>
              <Filter size={15}/> {showFilters?'Hide Filters':'Filters'}
            </button>
            <button className="btn-primary" onClick={() => setShowAdminCarListingForm(true)}>
              <Plus size={15}/> Add Listing
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="filter-panel">
            <div className="filter-field">
              <label className="filter-label">Category</label>
              <select className="filter-select" value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
                <option>All Categories</option>
                <option>SUV</option><option>Sedan</option><option>Truck</option>
                <option>Hatchback</option><option>Coupe</option><option>Wagon</option>
              </select>
            </div>
            <div className="filter-field">
              <label className="filter-label">Price Range (KSH)</label>
              <div className="price-pair">
                <input className="filter-input" type="number" placeholder="Min" value={minPrice} onChange={e => setMinPrice(e.target.value)}/>
                <input className="filter-input" type="number" placeholder="Max" value={maxPrice} onChange={e => setMaxPrice(e.target.value)}/>
              </div>
            </div>
            <div className="filter-field">
              <label className="filter-label">Status</label>
              <select className="filter-select" value={selectedStatus} onChange={e => setSelectedStatus(e.target.value)}>
                <option>All Statuses</option>
                <option value="active">Active</option><option value="sold">Sold</option>
                <option value="rented">Rented</option><option value="requested">Requested</option>
              </select>
            </div>
            <div className="filter-field">
              <label className="filter-label">Search</label>
              <div className="search-wrap">
                <Search size={14} className="search-icon-pos"/>
                <input className="filter-input" type="text" placeholder="Make, model…" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}/>
              </div>
            </div>
          </div>
        )}

        <div className="table-panel">
          <div className="table-wrap">
            <table>
              <thead><tr><th>Image</th><th>Vehicle</th><th>Category</th><th>Price</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {filteredListings.length===0 ? (
                  <tr className="empty-row"><td colSpan={6}>No listings found</td></tr>
                ) : filteredListings.map(listing => (
                  <tr key={listing._id}>
                    <td>
                      <div className="car-thumb">
                        <img alt="" src={`${API_BASE_URL}${listing.image}`} onError={e => { e.target.style.display='none'; }}/>
                      </div>
                    </td>
                    <td>
                      <div className="cell-primary">{listing.make} {listing.model}</div>
                      <div className="cell-muted">{listing.year}</div>
                    </td>
                    <td style={{ color:'#8888A8', fontWeight:500 }}>{listing.carType||'N/A'}</td>
                    <td className="price-cell">KSH {listing.price?listing.price.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2}):'N/A'}</td>
                    <td>
                      <span className={`s-pill ${statusClass(listing.listing_status)}`}>
                        <span className="s-pill-dot"/>{listing.listing_status||'N/A'}
                      </span>
                    </td>
                    <td>
                      <div className="action-btns">
                        <button className="action-btn edit" onClick={() => handleEditListing(listing)} title="Edit"><Edit size={14}/></button>
                        <button className="action-btn view" onClick={() => handleViewListing(listing)} title="View"><Eye size={14}/></button>
                        <button className="action-btn del" onClick={() => handleDeleteListing(listing)} title="Delete"><Trash2 size={14}/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* EDIT MODAL */}
        {showAddEditModal && (
          <div className="modal-overlay" onClick={e => e.target===e.currentTarget && handleCloseModal()}>
            <div className="modal-box">
              <div className="modal-header">
                <div className="modal-title">Edit Car Listing</div>
                <button className="modal-close" onClick={handleCloseModal}><X size={15}/></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSaveListing}>
                  <div className="form-grid">
                    <div className="form-field"><label className="form-label">Make</label><input className="form-input" type="text" value={formData.make} onChange={e => setFormData({...formData,make:e.target.value})} required/></div>
                    <div className="form-field"><label className="form-label">Model</label><input className="form-input" type="text" value={formData.model} onChange={e => setFormData({...formData,model:e.target.value})} required/></div>
                    <div className="form-field"><label className="form-label">Year</label><input className="form-input" type="number" value={formData.year} onChange={e => setFormData({...formData,year:e.target.value})} required/></div>
                    <div className="form-field"><label className="form-label">Price (KSH)</label><input className="form-input" type="number" value={formData.price} onChange={e => setFormData({...formData,price:e.target.value})} required/></div>
                    <div className="form-field"><label className="form-label">Car Type</label>
                      <select className="form-select" value={formData.carType} onChange={e => setFormData({...formData,carType:e.target.value})}>
                        <option>Select Category</option><option>SUV</option><option>Sedan</option><option>Truck</option><option>Hatchback</option><option>Coupe</option><option>Wagon</option>
                      </select>
                    </div>
                    <div className="form-field"><label className="form-label">Fuel Type</label>
                      <select className="form-select" value={formData.fuelType} onChange={e => setFormData({...formData,fuelType:e.target.value})}>
                        <option>Select Fuel Type</option><option>Petrol</option><option>Diesel</option><option>Electric</option><option>Hybrid</option>
                      </select>
                    </div>
                    <div className="form-field"><label className="form-label">Transmission</label>
                      <select className="form-select" value={formData.transmission} onChange={e => setFormData({...formData,transmission:e.target.value})}>
                        <option>Select Transmission</option><option>Automatic</option><option>Manual</option>
                      </select>
                    </div>
                    <div className="form-field"><label className="form-label">Mileage (km)</label><input className="form-input" type="number" value={formData.mileage} onChange={e => setFormData({...formData,mileage:e.target.value})}/></div>
                    <div className="form-field"><label className="form-label">Status</label>
                      <select className="form-select" value={formData.listing_status} onChange={e => setFormData({...formData,listing_status:e.target.value})}>
                        <option value="NA">Not Available</option><option value="active">Active</option><option value="Sold">Sold</option><option value="Rented">Rented</option>
                      </select>
                    </div>
                    <div className="form-field full"><label className="form-label">Images</label><input className="form-input" type="file" multiple name="images"/></div>
                  </div>
                  <div className="form-footer">
                    <button type="button" className="btn-cancel" onClick={handleCloseModal}>Cancel</button>
                    <button type="submit" className="btn-primary">Save Changes</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* VIEW MODAL */}
        {showViewModel && selectedListing && (
          <div className="modal-overlay" onClick={e => e.target===e.currentTarget && setShowViewModel(false)}>
            <div className="modal-box">
              <div className="modal-header">
                <div className="modal-title">{selectedListing.year} {selectedListing.make} {selectedListing.model}</div>
                <button className="modal-close" onClick={() => setShowViewModel(false)}><X size={15}/></button>
              </div>
              <div className="modal-body">
                <div className="view-grid">
                  {[
                    { label:'Make',         value:selectedListing.make },
                    { label:'Model',        value:selectedListing.model },
                    { label:'Year',         value:selectedListing.year },
                    { label:'Price',        value:`KSH ${parseAmount(selectedListing.price).toLocaleString()}`, blue:true },
                    { label:'Car Type',     value:selectedListing.carType },
                    { label:'Fuel Type',    value:selectedListing.fuelType },
                    { label:'Transmission', value:selectedListing.transmission },
                    { label:'Mileage',      value:selectedListing.mileage?`${selectedListing.mileage.toLocaleString()} km`:'—' },
                    { label:'Status',       value:selectedListing.listing_status },
                    { label:'Type',         value:selectedListing.RentSell },
                  ].map(({ label, value, blue }) => (
                    <div key={label} className="view-field">
                      <div className="view-field-label">{label}</div>
                      <div className={`view-field-value${blue?' blue':''}`}>{value||'—'}</div>
                    </div>
                  ))}
                </div>
                <div className="form-footer"><button className="btn-cancel" onClick={() => setShowViewModel(false)}>Close</button></div>
              </div>
            </div>
          </div>
        )}

        {/* ADD LISTING MODAL */}
        {showAdminCarListingForm && (
          <div className="modal-overlay" onClick={e => e.target===e.currentTarget && setShowAdminCarListingForm(false)}>
            <div className="modal-box">
              <div className="modal-header">
                <div className="modal-title">Add New Car Listing</div>
                <button className="modal-close" onClick={() => setShowAdminCarListingForm(false)}><X size={15}/></button>
              </div>
              <div className="modal-body">
                <AdminCarListingForm onClose={() => { setShowAdminCarListingForm(false); fetchListings(); }}/>
              </div>
            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
}

export default AdminAuth(CarManagement);