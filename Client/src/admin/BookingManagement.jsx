import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Filter, Edit, Eye, Trash2, Plus, X, ChevronDown, ChevronUp, RefreshCcw } from 'lucide-react';
import AdminLayout from './AdminLayout';
import AdminCarListingForm from './AdminCarListingForm';
import AdminAuth from './AdminAuth';
import API_BASE_URL from '../config/apiConfig';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@600;700;800&family=Inter:wght@400;500;600&display=swap');

  .bm-root { font-family:'Inter',sans-serif; color:#1A1A2E; }
  .bm-page-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:24px; flex-wrap:wrap; gap:12px; }
  .bm-page-label { font-size:11px; font-weight:700; letter-spacing:.8px; text-transform:uppercase; color:#3B6BF0; margin-bottom:4px; }
  .bm-page-title { font-family:'Manrope',sans-serif; font-weight:800; font-size:22px; color:#1A1A2E; }
  .bm-header-actions { display:flex; align-items:center; gap:10px; flex-wrap:wrap; }

  .btn-primary { display:flex; align-items:center; gap:6px; background:#3B6BF0; color:#fff; border:none; padding:9px 18px; border-radius:8px; font-family:'Inter',sans-serif; font-weight:600; font-size:13px; cursor:pointer; transition:all .18s; }
  .btn-primary:hover { background:#2952CC; transform:translateY(-1px); box-shadow:0 4px 14px rgba(59,107,240,.3); }
  .btn-secondary { display:flex; align-items:center; gap:6px; background:#fff; color:#4A4A68; border:1px solid #E5E7F0; padding:9px 18px; border-radius:8px; font-family:'Inter',sans-serif; font-weight:500; font-size:13px; cursor:pointer; transition:all .18s; }
  .btn-secondary:hover { border-color:#3B6BF0; color:#3B6BF0; }
  .btn-secondary.active { border-color:#3B6BF0; color:#3B6BF0; background:#EEF2FF; }
  .btn-cancel { display:flex; align-items:center; gap:6px; background:#F7F8FC; color:#4A4A68; border:1px solid #E5E7F0; padding:9px 18px; border-radius:8px; font-family:'Inter',sans-serif; font-weight:500; font-size:13px; cursor:pointer; }
  .btn-cancel:hover { background:#FEF2F2; color:#E63946; }
  .btn-reset { display:flex; align-items:center; gap:6px; background:#FEF2F2; border:1px solid rgba(230,57,70,.2); color:#E63946; padding:8px 14px; border-radius:8px; font-family:'Inter',sans-serif; font-size:12px; font-weight:600; cursor:pointer; transition:all .18s; }
  .btn-reset:hover { background:#FCD5D5; }

  .filter-panel { background:#fff; border:1px solid #E5E7F0; border-radius:12px; padding:18px 20px; margin-bottom:20px; }
  .filter-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(200px,1fr)); gap:14px; margin-bottom:12px; }
  .filter-field { display:flex; flex-direction:column; gap:5px; }
  .filter-field.span2 { grid-column:1/-1; }
  .filter-label { font-size:10px; font-weight:700; letter-spacing:.8px; text-transform:uppercase; color:#8888A8; }
  .filter-input,.filter-select { background:#F7F8FC; border:1px solid #E5E7F0; border-radius:8px; padding:9px 12px; color:#1A1A2E; font-family:'Inter',sans-serif; font-size:13px; outline:none; transition:border .18s; appearance:none; -webkit-appearance:none; width:100%; }
  .filter-select { background-image:url("data:image/svg+xml,%3Csvg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%238888A8' stroke-width='2' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E"); background-repeat:no-repeat; background-position:right 10px center; padding-right:32px; }
  .filter-select option { background:#fff; color:#1A1A2E; }
  .filter-input:focus,.filter-select:focus { border-color:#3B6BF0; background:#fff; }
  .filter-input::placeholder { color:#AAAACC; }
  .price-pair,.date-pair { display:flex; gap:8px; }
  .search-wrap { position:relative; }
  .search-icon-pos { position:absolute; left:11px; top:50%; transform:translateY(-50%); color:#8888A8; pointer-events:none; }
  .search-clear { position:absolute; right:11px; top:50%; transform:translateY(-50%); background:none; border:none; color:#8888A8; cursor:pointer; display:flex; align-items:center; }
  .search-clear:hover { color:#1A1A2E; }
  .filter-actions { display:flex; justify-content:space-between; align-items:center; margin-top:8px; }
  .filter-count { font-size:12px; color:#8888A8; }

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
  .cell-mono { font-family:monospace; font-size:12px; color:#8888A8; }
  .price-cell { color:#3B6BF0; font-weight:700; font-family:'Manrope',sans-serif; }
  .empty-row td { text-align:center; padding:48px; color:#8888A8; }

  .s-pill { display:inline-flex; align-items:center; gap:4px; padding:3px 10px; border-radius:20px; font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:.4px; }
  .s-pill.completed { background:#D1E7DD; color:#0A5C36; }
  .s-pill.confirmed { background:#CFE2FF; color:#084298; }
  .s-pill.cancelled { background:#F8D7DA; color:#842029; }
  .s-pill.pending   { background:#FFF3CD; color:#856404; }
  .s-pill.paid      { background:#D1E7DD; color:#0A5C36; }
  .s-pill.failed    { background:#F8D7DA; color:#842029; }
  .s-pill.refunded  { background:#CFE2FF; color:#084298; }
  .s-pill-dot { width:5px; height:5px; border-radius:50%; background:currentColor; }

  .action-btns { display:flex; align-items:center; gap:6px; }
  .action-btn { width:30px; height:30px; border-radius:6px; border:1px solid #E5E7F0; background:#F7F8FC; display:flex; align-items:center; justify-content:center; cursor:pointer; transition:all .18s; color:#8888A8; }
  .action-btn.edit:hover  { color:#3B6BF0; border-color:rgba(59,107,240,.3); background:#EEF2FF; }
  .action-btn.view:hover  { color:#2D9C5A; border-color:rgba(45,156,90,.3); background:#D1E7DD; }
  .action-btn.del:hover   { color:#E63946; border-color:rgba(230,57,70,.3); background:#FEF2F2; }

  .modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,.45); backdrop-filter:blur(4px); display:flex; align-items:center; justify-content:center; z-index:1000; padding:16px; }
  .modal-box { background:#fff; border:1px solid #E5E7F0; border-radius:14px; width:100%; max-width:640px; max-height:90vh; overflow-y:auto; box-shadow:0 20px 60px rgba(0,0,0,.12); scrollbar-width:none; }
  .modal-box::-webkit-scrollbar { display:none; }
  .modal-header { display:flex; justify-content:space-between; align-items:center; padding:20px 24px; border-bottom:1px solid #E5E7F0; position:sticky; top:0; background:#fff; z-index:1; border-radius:14px 14px 0 0; }
  .modal-title { font-family:'Manrope',sans-serif; font-weight:700; font-size:16px; color:#1A1A2E; }
  .modal-close { width:30px; height:30px; border-radius:7px; background:#F7F8FC; border:1px solid #E5E7F0; color:#8888A8; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all .18s; }
  .modal-close:hover { background:#FEF2F2; color:#E63946; }
  .modal-body { padding:24px; }
  .form-grid { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
  @media(max-width:540px){ .form-grid { grid-template-columns:1fr; } }
  .form-field { display:flex; flex-direction:column; gap:5px; }
  .form-label { font-size:10px; font-weight:700; letter-spacing:.8px; text-transform:uppercase; color:#8888A8; }
  .form-input,.form-select { background:#F7F8FC; border:1px solid #E5E7F0; border-radius:8px; padding:10px 12px; color:#1A1A2E; font-family:'Inter',sans-serif; font-size:13px; outline:none; transition:border .18s; appearance:none; -webkit-appearance:none; }
  .form-select { background-image:url("data:image/svg+xml,%3Csvg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%238888A8' stroke-width='2' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E"); background-repeat:no-repeat; background-position:right 10px center; padding-right:32px; }
  .form-select option { background:#fff; color:#1A1A2E; }
  .form-input:focus,.form-select:focus { border-color:#3B6BF0; background:#fff; }
  .form-footer { display:flex; justify-content:flex-end; gap:10px; padding-top:16px; border-top:1px solid #E5E7F0; margin-top:20px; }

  .view-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
  @media(max-width:540px){ .view-grid { grid-template-columns:1fr; } }
  .view-section { font-family:'Manrope',sans-serif; font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:.5px; color:#3B6BF0; grid-column:1/-1; padding-bottom:8px; border-bottom:1px solid #E5E7F0; margin-bottom:4px; margin-top:8px; display:flex; align-items:center; gap:6px; }
  .view-section::before { content:''; width:3px; height:12px; background:#3B6BF0; border-radius:2px; display:inline-block; }
  .view-field { background:#F7F8FC; border:1px solid #E5E7F0; border-radius:8px; padding:12px 14px; }
  .view-field-label { font-size:10px; font-weight:700; letter-spacing:.8px; text-transform:uppercase; color:#8888A8; margin-bottom:4px; }
  .view-field-value { font-size:14px; font-weight:600; color:#1A1A2E; }
  .view-field-value.blue { color:#3B6BF0; font-family:'Manrope',sans-serif; }
`;

function BookingManagement() {
  const [listings,        setListings]        = useState([]);
  const [filteredListings,setFilteredListings]= useState([]);
  const [showAddEditModal,setShowAddEditModal] = useState(false);
  const [showViewModel,   setShowViewModel]   = useState(false);
  const [selectedListing, setSelectedListing] = useState(null);
  const [showAdminCarListingForm, setShowAdminCarListingForm] = useState(false);
  const [showFilters,     setShowFilters]     = useState(false);

  const [filters, setFilters] = useState({
    paymentStatus:'all', paymentRange:{ min:'', max:'' },
    dueAmount:'all', searchQuery:'', bookingStatus:'all'
  });

  const [formData, setFormData] = useState({
    listing_id:'', user_id:'', car_id:'',
    booking_start_date:'', booking_end_date:'',
    total_price:'', paid_price:'', transaction_id:'',
    booking_status:'pending', payment_status:'pending'
  });

  const parseAmount = (amount) => {
    if (amount===null||amount===undefined) return 0;
    if (typeof amount==='number') return amount;
    if (typeof amount==='object'&&amount.$numberDecimal) return parseFloat(amount.$numberDecimal);
    const p=parseFloat(amount); return !isNaN(p)?p:0;
  };

  useEffect(() => { fetchListings(); }, []);
  useEffect(() => { if (listings.length>0) applyFilters(); }, [filters, listings]);

  const fetchListings = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/booking`);
      if (response.status===200) {
        const processed = response.data.map(l => ({ ...l, total_price:parseAmount(l.total_price), paid_price:parseAmount(l.paid_price) }));
        setListings(processed); setFilteredListings(processed);
      }
    } catch (error) { alert(`Failed to fetch bookings: ${error.response?.data?.message||'Unknown error'}`); }
  };

  const applyFilters = () => {
    let r = [...listings];
    if (filters.paymentStatus!=='all') r = r.filter(b => b.payment_status===filters.paymentStatus);
    if (filters.paymentRange.min!=='') r = r.filter(b => b.paid_price>=parseFloat(filters.paymentRange.min));
    if (filters.paymentRange.max!=='') r = r.filter(b => b.paid_price<=parseFloat(filters.paymentRange.max));
    if (filters.dueAmount!=='all') {
      r = r.filter(b => {
        const due = b.total_price - b.paid_price;
        if (filters.dueAmount==='none') return due===0;
        if (filters.dueAmount==='partial') return due>0&&due<b.total_price;
        if (filters.dueAmount==='full') return due===b.total_price;
        return true;
      });
    }
    if (filters.bookingStatus!=='all') r = r.filter(b => b.booking_status===filters.bookingStatus);
    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.trim().toLowerCase();
      r = r.filter(b => String(b.booking_id||'').toLowerCase().includes(q)||String(b.user_id||'').toLowerCase().includes(q)||String(b.transaction_id||'').toLowerCase().includes(q)||String(b.car_id||'').toLowerCase().includes(q));
    }
    setFilteredListings(r);
  };

  const handleViewListing = async (listing) => {
    if (!listing?.booking_id) { alert('Invalid listing data'); return; }
    try {
      const response = await axios.get(`${API_BASE_URL}/api/booking/${listing.booking_id}`);
      setSelectedListing(response.data); setShowViewModel(true);
    } catch (error) { alert(`Failed to fetch booking: ${error.response?.data?.message||'Unknown error'}`); }
  };

  const handleEditListing = async (listing) => {
    if (!listing?.booking_id) { alert('Invalid listing data'); return; }
    try {
      const response = await axios.get(`${API_BASE_URL}/api/booking/${listing.booking_id}`);
      if (!response.data) throw new Error('No data returned');
      setSelectedListing(response.data);
      setFormData({
        listing_id:response.data.listing_id||'', user_id:response.data.user_id||'',
        car_id:response.data.car_id||'', booking_start_date:response.data.booking_start_date||'',
        booking_end_date:response.data.booking_end_date||'', total_price:response.data.total_price?.toString()||'',
        paid_price:response.data.paid_price?.toString()||'', transaction_id:response.data.transaction_id||'',
        booking_status:response.data.booking_status||'pending', payment_status:response.data.payment_status||'pending',
      });
      setShowAddEditModal(true);
    } catch (error) { alert(`Failed to fetch for editing: ${error.response?.data?.message||'Unknown error'}`); }
  };

  const handleSaveListing = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`${API_BASE_URL}/api/booking/${selectedListing.booking_id}`, formData);
      if (response.status===200) { alert('Booking updated!'); setShowAddEditModal(false); fetchListings(); }
    } catch (error) { alert(`Failed to save: ${error.response?.data?.message||'Unknown error'}`); }
  };

  const handleDeleteListing = async (listing) => {
    if (!listing?.booking_id) { alert('Invalid booking data'); return; }
    if (!window.confirm('Delete this booking?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/booking/${listing.booking_id}`);
      fetchListings(); alert('Booking deleted');
    } catch (error) { alert(`Failed to delete: ${error.response?.data?.message||'Unknown error'}`); }
  };

  const handleCloseModal = () => {
    setShowAddEditModal(false); setShowViewModel(false); setSelectedListing(null);
    setFormData({ listing_id:'',user_id:'',car_id:'',booking_start_date:'',booking_end_date:'',total_price:'',paid_price:'',transaction_id:'',booking_status:'pending',payment_status:'pending' });
  };

  const resetFilters = () => setFilters({ paymentStatus:'all', paymentRange:{ min:'', max:'' }, dueAmount:'all', searchQuery:'', bookingStatus:'all' });
  const statusClass = (s) => ({ completed:'completed', confirmed:'confirmed', cancelled:'cancelled', pending:'pending', paid:'paid', failed:'failed', refunded:'refunded' })[s]||'pending';
  const fmtDate = (d) => { try { return new Date(d).toLocaleDateString('en-KE',{ year:'numeric',month:'short',day:'numeric' }); } catch { return d||'—'; } };

  return (
    <AdminLayout pageTitle="Booking Management">
      <style>{STYLES}</style>
      <div className="bm-root">

        <div className="bm-page-header">
          <div>
            <div className="bm-page-label">Transactions</div>
            <div className="bm-page-title">Booking Management</div>
          </div>
          <div className="bm-header-actions">
            <button className={`btn-secondary${showFilters?' active':''}`} onClick={() => setShowFilters(!showFilters)}>
              <Filter size={15}/> {showFilters?'Hide Filters':'Filters'}
              {showFilters ? <ChevronUp size={13}/> : <ChevronDown size={13}/>}
            </button>
            <button className="btn-primary" onClick={() => setShowAdminCarListingForm(true)}>
              <Plus size={15}/> Add Booking
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="filter-panel">
            <div className="filter-grid">
              <div className="filter-field">
                <label className="filter-label">Payment Status</label>
                <select className="filter-select" value={filters.paymentStatus} onChange={e => setFilters({...filters,paymentStatus:e.target.value})}>
                  <option value="all">All Payments</option>
                  <option value="pending">Pending</option><option value="paid">Paid</option>
                  <option value="failed">Failed</option><option value="refunded">Refunded</option>
                </select>
              </div>
              <div className="filter-field">
                <label className="filter-label">Booking Status</label>
                <select className="filter-select" value={filters.bookingStatus} onChange={e => setFilters({...filters,bookingStatus:e.target.value})}>
                  <option value="all">All Bookings</option>
                  <option value="pending">Pending</option><option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option><option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div className="filter-field">
                <label className="filter-label">Payment Range (KSH)</label>
                <div className="price-pair">
                  <input className="filter-input" type="number" placeholder="Min" value={filters.paymentRange.min} onChange={e => setFilters({...filters,paymentRange:{...filters.paymentRange,min:e.target.value}})}/>
                  <input className="filter-input" type="number" placeholder="Max" value={filters.paymentRange.max} onChange={e => setFilters({...filters,paymentRange:{...filters.paymentRange,max:e.target.value}})}/>
                </div>
              </div>
              <div className="filter-field">
                <label className="filter-label">Due Amount</label>
                <select className="filter-select" value={filters.dueAmount} onChange={e => setFilters({...filters,dueAmount:e.target.value})}>
                  <option value="all">All</option><option value="none">No Due</option>
                  <option value="partial">Partially Due</option><option value="full">Fully Due</option>
                </select>
              </div>
              <div className="filter-field span2">
                <label className="filter-label">Search</label>
                <div className="search-wrap">
                  <Search size={14} className="search-icon-pos" style={{ left:11 }}/>
                  <input className="filter-input" style={{ paddingLeft:34, paddingRight:filters.searchQuery?34:12 }} type="text" placeholder="Booking ID, User ID, Car ID, Transaction ID…" value={filters.searchQuery} onChange={e => setFilters(prev=>({...prev,searchQuery:e.target.value}))}/>
                  {filters.searchQuery && <button className="search-clear" onClick={() => setFilters(prev=>({...prev,searchQuery:''}))}><X size={13}/></button>}
                </div>
              </div>
            </div>
            <div className="filter-actions">
              <button className="btn-reset" onClick={resetFilters}><RefreshCcw size={12}/> Reset</button>
              <span className="filter-count">{filteredListings.length} results</span>
            </div>
          </div>
        )}

        <div className="table-panel">
          <div className="table-wrap">
            <table>
              <thead><tr><th>Booking ID</th><th>User</th><th>Dates</th><th>Total</th><th>Paid</th><th>Booking</th><th>Payment</th><th>Actions</th></tr></thead>
              <tbody>
                {filteredListings.length===0 ? (
                  <tr className="empty-row"><td colSpan={8}>No bookings found</td></tr>
                ) : filteredListings.map(listing => (
                  <tr key={listing.booking_id}>
                    <td><span className="cell-mono">{listing.booking_id||'N/A'}</span></td>
                    <td>
                      <div className="cell-primary">{listing.user_id||'N/A'}</div>
                      <div className="cell-muted">{listing.car_id||''}</div>
                    </td>
                    <td>
                      <div style={{ fontSize:12,color:'#8888A8' }}>{fmtDate(listing.booking_start_date)}</div>
                      <div style={{ fontSize:12,color:'#8888A8' }}>→ {fmtDate(listing.booking_end_date)}</div>
                    </td>
                    <td className="price-cell">KSH {listing.total_price?.toLocaleString()||'—'}</td>
                    <td className="price-cell">KSH {listing.paid_price?.toLocaleString()||'—'}</td>
                    <td><span className={`s-pill ${statusClass(listing.booking_status)}`}><span className="s-pill-dot"/>{listing.booking_status||'N/A'}</span></td>
                    <td><span className={`s-pill ${statusClass(listing.payment_status)}`}><span className="s-pill-dot"/>{listing.payment_status||'N/A'}</span></td>
                    <td>
                      <div className="action-btns">
                        <button className="action-btn edit" onClick={() => handleEditListing(listing)} title="Edit"><Edit size={13}/></button>
                        <button className="action-btn view" onClick={() => handleViewListing(listing)} title="View"><Eye size={13}/></button>
                        <button className="action-btn del" onClick={() => handleDeleteListing(listing)} title="Delete"><Trash2 size={13}/></button>
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
                <div className="modal-title">Edit Booking</div>
                <button className="modal-close" onClick={handleCloseModal}><X size={15}/></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSaveListing}>
                  <div className="form-grid">
                    {[
                      { label:'User ID',              key:'user_id',              type:'text' },
                      { label:'Car ID',               key:'car_id',               type:'text' },
                      { label:'Start Date',           key:'booking_start_date',   type:'date' },
                      { label:'End Date',             key:'booking_end_date',     type:'date' },
                      { label:'Total Price (KSH)',    key:'total_price',          type:'number' },
                      { label:'Paid Price (KSH)',     key:'paid_price',           type:'number' },
                      { label:'Transaction ID',       key:'transaction_id',       type:'text' },
                    ].map(({ label, key, type }) => (
                      <div key={key} className="form-field">
                        <label className="form-label">{label}</label>
                        <input className="form-input" type={type} value={formData[key]} onChange={e => setFormData({...formData,[key]:e.target.value})} required/>
                      </div>
                    ))}
                    <div className="form-field">
                      <label className="form-label">Booking Status</label>
                      <select className="form-select" value={formData.booking_status} onChange={e => setFormData({...formData,booking_status:e.target.value})}>
                        <option value="pending">Pending</option><option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option><option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                    <div className="form-field">
                      <label className="form-label">Payment Status</label>
                      <select className="form-select" value={formData.payment_status} onChange={e => setFormData({...formData,payment_status:e.target.value})}>
                        <option value="pending">Pending</option><option value="paid">Paid</option>
                        <option value="failed">Failed</option><option value="refunded">Refunded</option>
                      </select>
                    </div>
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
                <div className="modal-title">Booking #{selectedListing.booking_id}</div>
                <button className="modal-close" onClick={() => setShowViewModel(false)}><X size={15}/></button>
              </div>
              <div className="modal-body">
                <div className="view-grid">
                  <div className="view-section">Booking Information</div>
                  {[
                    { label:'Booking ID',  value:selectedListing.booking_id },
                    { label:'Listing ID',  value:selectedListing.listing_id },
                    { label:'User ID',     value:selectedListing.user_id },
                    { label:'Car ID',      value:selectedListing.car_id },
                    { label:'Start Date',  value:fmtDate(selectedListing.booking_start_date) },
                    { label:'End Date',    value:fmtDate(selectedListing.booking_end_date) },
                  ].map(({ label, value }) => (
                    <div key={label} className="view-field">
                      <div className="view-field-label">{label}</div>
                      <div className="view-field-value">{value||'—'}</div>
                    </div>
                  ))}
                  <div className="view-section" style={{ marginTop:8 }}>Payment Details</div>
                  {[
                    { label:'Total Price',      value:`KSH ${selectedListing.total_price?.toLocaleString()}`, blue:true },
                    { label:'Paid Amount',      value:`KSH ${selectedListing.paid_price?.toLocaleString()}`, blue:true },
                    { label:'Transaction ID',   value:selectedListing.transaction_id },
                    { label:'Payment Status',   value:selectedListing.payment_status },
                    { label:'Booking Status',   value:selectedListing.booking_status },
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

        {/* ADD BOOKING MODAL */}
        {showAdminCarListingForm && (
          <div className="modal-overlay" onClick={e => e.target===e.currentTarget && setShowAdminCarListingForm(false)}>
            <div className="modal-box">
              <div className="modal-header">
                <div className="modal-title">Add New Booking</div>
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

export default AdminAuth(BookingManagement);