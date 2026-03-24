import React, { useState, useEffect } from 'react';
import { Eye, Filter, X, RefreshCcw, Trash2, Search } from 'lucide-react';
import AdminLayout from './AdminLayout';
import AdminAuth from './AdminAuth';
import API_BASE_URL from '../config/apiConfig';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@600;700;800&family=Inter:wght@400;500;600&display=swap');

  .pm-root { font-family:'Inter',sans-serif; color:#1A1A2E; }
  .pm-page-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:24px; flex-wrap:wrap; gap:12px; }
  .pm-page-label { font-size:11px; font-weight:700; letter-spacing:.8px; text-transform:uppercase; color:#3B6BF0; margin-bottom:4px; }
  .pm-page-title { font-family:'Manrope',sans-serif; font-weight:800; font-size:22px; color:#1A1A2E; }

  .btn-secondary { display:flex; align-items:center; gap:6px; background:#fff; color:#4A4A68; border:1px solid #E5E7F0; padding:9px 18px; border-radius:8px; font-family:'Inter',sans-serif; font-weight:500; font-size:13px; cursor:pointer; transition:all .18s; }
  .btn-secondary:hover { border-color:#3B6BF0; color:#3B6BF0; }
  .btn-secondary.active { border-color:#3B6BF0; color:#3B6BF0; background:#EEF2FF; }
  .btn-cancel { display:flex; align-items:center; gap:6px; background:#F7F8FC; color:#4A4A68; border:1px solid #E5E7F0; padding:9px 18px; border-radius:8px; font-family:'Inter',sans-serif; font-weight:500; font-size:13px; cursor:pointer; }
  .btn-cancel:hover { background:#FEF2F2; color:#E63946; }
  .btn-reset { display:flex; align-items:center; gap:6px; background:#FEF2F2; border:1px solid rgba(230,57,70,.2); color:#E63946; padding:8px 14px; border-radius:8px; font-family:'Inter',sans-serif; font-size:12px; font-weight:600; cursor:pointer; }
  .btn-reset:hover { background:#FCD5D5; }

  .filter-panel { background:#fff; border:1px solid #E5E7F0; border-radius:12px; padding:18px 20px; margin-bottom:20px; }
  .filter-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(200px,1fr)); gap:14px; margin-bottom:12px; }
  .filter-field { display:flex; flex-direction:column; gap:5px; }
  .filter-label { font-size:10px; font-weight:700; letter-spacing:.8px; text-transform:uppercase; color:#8888A8; }
  .filter-input,.filter-select { background:#F7F8FC; border:1px solid #E5E7F0; border-radius:8px; padding:9px 12px; color:#1A1A2E; font-family:'Inter',sans-serif; font-size:13px; outline:none; transition:border .18s; appearance:none; -webkit-appearance:none; width:100%; }
  .filter-select { background-image:url("data:image/svg+xml,%3Csvg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%238888A8' stroke-width='2' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E"); background-repeat:no-repeat; background-position:right 10px center; padding-right:32px; }
  .filter-select option { background:#fff; color:#1A1A2E; }
  .filter-input:focus,.filter-select:focus { border-color:#3B6BF0; background:#fff; }
  .filter-input::placeholder { color:#AAAACC; }
  .pair { display:flex; gap:8px; }
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
  .s-pill.success { background:#D1E7DD; color:#0A5C36; }
  .s-pill.pending { background:#FFF3CD; color:#856404; }
  .s-pill.failed  { background:#F8D7DA; color:#842029; }
  .s-pill-dot { width:5px; height:5px; border-radius:50%; background:currentColor; }

  .action-btns { display:flex; align-items:center; gap:6px; }
  .action-btn { width:30px; height:30px; border-radius:6px; border:1px solid #E5E7F0; background:#F7F8FC; display:flex; align-items:center; justify-content:center; cursor:pointer; transition:all .18s; color:#8888A8; }
  .action-btn.view:hover { color:#2D9C5A; border-color:rgba(45,156,90,.3); background:#D1E7DD; }
  .action-btn.del:hover  { color:#E63946; border-color:rgba(230,57,70,.3); background:#FEF2F2; }

  .modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,.45); backdrop-filter:blur(4px); display:flex; align-items:center; justify-content:center; z-index:1000; padding:16px; }
  .modal-box { background:#fff; border:1px solid #E5E7F0; border-radius:14px; width:100%; max-width:500px; max-height:90vh; overflow-y:auto; box-shadow:0 20px 60px rgba(0,0,0,.12); scrollbar-width:none; }
  .modal-box::-webkit-scrollbar { display:none; }
  .modal-header { display:flex; justify-content:space-between; align-items:center; padding:20px 24px; border-bottom:1px solid #E5E7F0; position:sticky; top:0; background:#fff; z-index:1; border-radius:14px 14px 0 0; }
  .modal-title { font-family:'Manrope',sans-serif; font-weight:700; font-size:16px; color:#1A1A2E; }
  .modal-close { width:30px; height:30px; border-radius:7px; background:#F7F8FC; border:1px solid #E5E7F0; color:#8888A8; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all .18s; }
  .modal-close:hover { background:#FEF2F2; color:#E63946; }
  .modal-body { padding:24px; }
  .detail-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
  .detail-field { background:#F7F8FC; border:1px solid #E5E7F0; border-radius:8px; padding:12px 14px; }
  .detail-label { font-size:10px; font-weight:700; letter-spacing:.8px; text-transform:uppercase; color:#8888A8; margin-bottom:4px; }
  .detail-value { font-size:14px; font-weight:600; color:#1A1A2E; }
  .detail-value.blue { color:#3B6BF0; font-family:'Manrope',sans-serif; font-size:16px; }
  .modal-footer { display:flex; justify-content:flex-end; padding-top:16px; border-top:1px solid #E5E7F0; margin-top:16px; }
`;

function PaymentManagement() {
  const [transactions,         setTransactions]         = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [showDetailPanel,      setShowDetailPanel]      = useState(false);
  const [selectedTransaction,  setSelectedTransaction]  = useState(null);
  const [showFilters,          setShowFilters]          = useState(false);

  const [filters, setFilters] = useState({
    search:'', status:'all', startDate:'', endDate:'', minAmount:'', maxAmount:''
  });

  const parseAmount = (amount) => {
    if (amount===null||amount===undefined) return 0;
    if (typeof amount==='number') return amount;
    if (typeof amount==='object'&&amount.$numberDecimal) return parseFloat(amount.$numberDecimal);
    const p=parseFloat(amount); return !isNaN(p)?p:0;
  };

  // original fetch logic
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/payments`,{ method:'GET',headers:{'Content-Type':'application/json'} });
        const data = await response.json();
        const processed = data.map(t => ({ ...t, amount:parseAmount(t.amount) }));
        setTransactions(processed); setFilteredTransactions(processed);
      } catch (error) { console.error('Error fetching transactions:',error); }
    };
    fetchTransactions();
  }, []);

  // original filter logic
  useEffect(() => {
    let r = [...transactions];
    if (filters.search) r = r.filter(t => t.transaction_id?.toLowerCase().includes(filters.search.toLowerCase())||t.user_id?.toLowerCase().includes(filters.search.toLowerCase())||t.car_id?.toLowerCase().includes(filters.search.toLowerCase()));
    if (filters.status!=='all') r = r.filter(t => t.payment_status===filters.status);
    if (filters.startDate) r = r.filter(t => new Date(t.date_of_payment)>=new Date(filters.startDate));
    if (filters.endDate)   r = r.filter(t => new Date(t.date_of_payment)<=new Date(filters.endDate));
    if (filters.minAmount) r = r.filter(t => t.amount>=parseFloat(filters.minAmount));
    if (filters.maxAmount) r = r.filter(t => t.amount<=parseFloat(filters.maxAmount));
    setFilteredTransactions(r);
  }, [filters, transactions]);

  const handleDeleteTransaction = async (transactionId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/payments/${transactionId}`,{ method:'DELETE',headers:{'Content-Type':'application/json'} });
      if (response.ok) {
        setTransactions(transactions.filter(t => t._id!==transactionId));
        if (selectedTransaction?._id===transactionId) { setShowDetailPanel(false); setSelectedTransaction(null); }
        alert('Transaction deleted');
      } else { throw new Error((await response.json()).error||'Failed to delete'); }
    } catch (error) { alert(`Failed to delete: ${error.message}`); }
  };

  const handleViewTransaction = (transaction) => { setSelectedTransaction(transaction); setShowDetailPanel(true); };

  const formatDate = (d) => { try { return new Date(d).toLocaleDateString('en-KE',{ year:'numeric',month:'short',day:'numeric',hour:'2-digit',minute:'2-digit' }); } catch { return d||'—'; } };
  const resetFilters = () => setFilters({ search:'',status:'all',startDate:'',endDate:'',minAmount:'',maxAmount:'' });
  const statusClass = (s) => ({ success:'success',pending:'pending',failed:'failed' })[s]||'pending';

  return (
    <AdminLayout pageTitle="Payment Management">
      <style>{STYLES}</style>
      <div className="pm-root">

        <div className="pm-page-header">
          <div>
            <div className="pm-page-label">Finance</div>
            <div className="pm-page-title">Payment Management</div>
          </div>
          <button className={`btn-secondary${showFilters?' active':''}`} onClick={() => setShowFilters(!showFilters)}>
            <Filter size={15}/> {showFilters?'Hide Filters':'Filters'}
          </button>
        </div>

        {showFilters && (
          <div className="filter-panel">
            <div className="filter-grid">
              <div className="filter-field" style={{ gridColumn:'1/-1' }}>
                <label className="filter-label">Search</label>
                <div style={{ position:'relative' }}>
                  <Search size={14} style={{ position:'absolute',left:11,top:'50%',transform:'translateY(-50%)',color:'#8888A8',pointerEvents:'none' }}/>
                  <input className="filter-input" style={{ paddingLeft:34 }} type="text" placeholder="Transaction ID, User ID, Car ID…" value={filters.search} onChange={e => setFilters(prev=>({...prev,search:e.target.value}))}/>
                </div>
              </div>
              <div className="filter-field">
                <label className="filter-label">Status</label>
                <select className="filter-select" value={filters.status} onChange={e => setFilters(prev=>({...prev,status:e.target.value}))}>
                  <option value="all">All Statuses</option>
                  <option value="success">Successful</option><option value="pending">Pending</option><option value="failed">Failed</option>
                </select>
              </div>
              <div className="filter-field">
                <label className="filter-label">Amount Range (KSH)</label>
                <div className="pair">
                  <input className="filter-input" type="number" placeholder="Min" value={filters.minAmount} onChange={e => setFilters(prev=>({...prev,minAmount:e.target.value}))}/>
                  <input className="filter-input" type="number" placeholder="Max" value={filters.maxAmount} onChange={e => setFilters(prev=>({...prev,maxAmount:e.target.value}))}/>
                </div>
              </div>
              <div className="filter-field">
                <label className="filter-label">Date Range</label>
                <div className="pair">
                  <input className="filter-input" type="date" value={filters.startDate} onChange={e => setFilters(prev=>({...prev,startDate:e.target.value}))}/>
                  <input className="filter-input" type="date" value={filters.endDate} onChange={e => setFilters(prev=>({...prev,endDate:e.target.value}))}/>
                </div>
              </div>
            </div>
            <div className="filter-actions">
              <button className="btn-reset" onClick={resetFilters}><RefreshCcw size={12}/> Reset</button>
              <span className="filter-count">{filteredTransactions.length} results</span>
            </div>
          </div>
        )}

        <div className="table-panel">
          <div className="table-wrap">
            <table>
              <thead><tr><th>Transaction ID</th><th>User</th><th>Amount</th><th>Method</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {filteredTransactions.length===0 ? (
                  <tr className="empty-row"><td colSpan={7}>No transactions found</td></tr>
                ) : filteredTransactions.map(transaction => (
                  <tr key={transaction._id}>
                    <td><span className="cell-mono">{transaction.transaction_id}</span></td>
                    <td>
                      <div className="cell-primary">{transaction.user_id||'N/A'}</div>
                      <div className="cell-muted">{transaction.car_id||''}</div>
                    </td>
                    <td className="price-cell">KSH {transaction.amount.toLocaleString(undefined,{ minimumFractionDigits:2,maximumFractionDigits:2 })}</td>
                    <td style={{ color:'#8888A8',fontWeight:500 }}>{transaction.payment_method||'N/A'}</td>
                    <td style={{ fontSize:12,color:'#8888A8' }}>{formatDate(transaction.date_of_payment)}</td>
                    <td>
                      <span className={`s-pill ${statusClass(transaction.payment_status)}`}>
                        <span className="s-pill-dot"/>{transaction.payment_status}
                      </span>
                    </td>
                    <td>
                      <div className="action-btns">
                        <button className="action-btn view" onClick={() => handleViewTransaction(transaction)} title="View"><Eye size={13}/></button>
                        <button className="action-btn del" onClick={() => handleDeleteTransaction(transaction._id)} title="Delete"><Trash2 size={13}/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* DETAIL MODAL */}
        {showDetailPanel && selectedTransaction && (
          <div className="modal-overlay" onClick={e => e.target===e.currentTarget && setShowDetailPanel(false)}>
            <div className="modal-box">
              <div className="modal-header">
                <div className="modal-title">Transaction Details</div>
                <button className="modal-close" onClick={() => setShowDetailPanel(false)}><X size={15}/></button>
              </div>
              <div className="modal-body">
                <div className="detail-grid">
                  {[
                    { label:'Transaction ID',  value:selectedTransaction.transaction_id, full:true },
                    { label:'User ID',         value:selectedTransaction.user_id||'N/A' },
                    { label:'Car ID',          value:selectedTransaction.car_id||'N/A' },
                    { label:'Payment Method',  value:selectedTransaction.payment_method||'N/A' },
                    { label:'Date',            value:formatDate(selectedTransaction.date_of_payment), full:true },
                    { label:'Status',          value:selectedTransaction.payment_status },
                    { label:'Amount',          value:`KSH ${selectedTransaction.amount.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}`, blue:true },
                  ].map(({ label, value, blue, full }) => (
                    <div key={label} className="detail-field" style={full?{gridColumn:'1/-1'}:{}}>
                      <div className="detail-label">{label}</div>
                      <div className={`detail-value${blue?' blue':''}`}>{value}</div>
                    </div>
                  ))}
                </div>
                <div className="modal-footer">
                  <button className="btn-cancel" onClick={() => setShowDetailPanel(false)}>Close</button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
}

export default AdminAuth(PaymentManagement);