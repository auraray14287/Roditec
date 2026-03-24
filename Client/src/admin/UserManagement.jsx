import React, { useState, useEffect } from 'react';
import { Search, Filter, Eye, Edit, Trash2, X, RefreshCcw, UserPlus } from 'lucide-react';
import AdminLayout from './AdminLayout';
import API_BASE_URL from '../config/apiConfig';
import AdminAuth from './AdminAuth';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@600;700;800&family=Inter:wght@400;500;600&display=swap');

  .um-root { font-family:'Inter',sans-serif; color:#1A1A2E; }
  .um-page-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:24px; flex-wrap:wrap; gap:12px; }
  .um-page-label { font-size:11px; font-weight:700; letter-spacing:.8px; text-transform:uppercase; color:#3B6BF0; margin-bottom:4px; }
  .um-page-title { font-family:'Manrope',sans-serif; font-weight:800; font-size:22px; color:#1A1A2E; }
  .header-actions { display:flex; align-items:center; gap:10px; flex-wrap:wrap; }

  .btn-primary { display:flex; align-items:center; gap:6px; background:#3B6BF0; color:#fff; border:none; padding:9px 18px; border-radius:8px; font-family:'Inter',sans-serif; font-weight:600; font-size:13px; cursor:pointer; transition:all .18s; }
  .btn-primary:hover { background:#2952CC; transform:translateY(-1px); box-shadow:0 4px 14px rgba(59,107,240,.3); }
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
  .empty-row td { text-align:center; padding:48px; color:#8888A8; }

  .user-avatar { width:34px; height:34px; border-radius:50%; background:linear-gradient(135deg,#3B6BF0,#2040C0); display:flex; align-items:center; justify-content:center; font-family:'Manrope',sans-serif; font-weight:700; font-size:13px; color:#fff; flex-shrink:0; }

  .s-pill { display:inline-flex; align-items:center; gap:4px; padding:3px 10px; border-radius:20px; font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:.4px; }
  .s-pill.Active   { background:#D1E7DD; color:#0A5C36; }
  .s-pill.Inactive { background:#F8D7DA; color:#842029; }
  .s-pill.Pending  { background:#FFF3CD; color:#856404; }
  .s-pill-dot { width:5px; height:5px; border-radius:50%; background:currentColor; }

  .action-btns { display:flex; align-items:center; gap:6px; }
  .action-btn { width:30px; height:30px; border-radius:6px; border:1px solid #E5E7F0; background:#F7F8FC; display:flex; align-items:center; justify-content:center; cursor:pointer; transition:all .18s; color:#8888A8; }
  .action-btn.view:hover { color:#2D9C5A; border-color:rgba(45,156,90,.3); background:#D1E7DD; }
  .action-btn.edit:hover { color:#3B6BF0; border-color:rgba(59,107,240,.3); background:#EEF2FF; }
  .action-btn.del:hover  { color:#E63946; border-color:rgba(230,57,70,.3); background:#FEF2F2; }

  /* MODAL */
  .modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,.45); backdrop-filter:blur(4px); display:flex; align-items:center; justify-content:center; z-index:1000; padding:16px; }
  .modal-box { background:#fff; border:1px solid #E5E7F0; border-radius:14px; width:100%; max-width:460px; max-height:90vh; overflow-y:auto; box-shadow:0 20px 60px rgba(0,0,0,.12); scrollbar-width:none; }
  .modal-box::-webkit-scrollbar { display:none; }
  .modal-header { display:flex; justify-content:space-between; align-items:center; padding:20px 24px; border-bottom:1px solid #E5E7F0; position:sticky; top:0; background:#fff; z-index:1; border-radius:14px 14px 0 0; }
  .modal-title { font-family:'Manrope',sans-serif; font-weight:700; font-size:16px; color:#1A1A2E; }
  .modal-close { width:30px; height:30px; border-radius:7px; background:#F7F8FC; border:1px solid #E5E7F0; color:#8888A8; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all .18s; }
  .modal-close:hover { background:#FEF2F2; color:#E63946; }
  .modal-body { padding:24px; }

  .form-stack { display:flex; flex-direction:column; gap:14px; }
  .form-field { display:flex; flex-direction:column; gap:5px; }
  .form-label { font-size:10px; font-weight:700; letter-spacing:.8px; text-transform:uppercase; color:#8888A8; }
  .form-input,.form-select { background:#F7F8FC; border:1px solid #E5E7F0; border-radius:8px; padding:10px 12px; color:#1A1A2E; font-family:'Inter',sans-serif; font-size:13px; outline:none; transition:border .18s; appearance:none; -webkit-appearance:none; }
  .form-select { background-image:url("data:image/svg+xml,%3Csvg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%238888A8' stroke-width='2' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E"); background-repeat:no-repeat; background-position:right 10px center; padding-right:32px; }
  .form-select option { background:#fff; color:#1A1A2E; }
  .form-input:focus,.form-select:focus { border-color:#3B6BF0; background:#fff; }
  .form-input::placeholder { color:#AAAACC; }
  .form-input:disabled { opacity:.5; cursor:not-allowed; background:#F0F0F8; }
  .form-footer { display:flex; justify-content:flex-end; gap:10px; padding-top:16px; border-top:1px solid #E5E7F0; margin-top:20px; }

  .view-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
  .view-field { background:#F7F8FC; border:1px solid #E5E7F0; border-radius:8px; padding:12px 14px; }
  .view-field.full { grid-column:1/-1; }
  .view-field-label { font-size:10px; font-weight:700; letter-spacing:.8px; text-transform:uppercase; color:#8888A8; margin-bottom:4px; }
  .view-field-value { font-size:14px; font-weight:600; color:#1A1A2E; }

  .avatar-center { display:flex; justify-content:center; margin-bottom:20px; }
  .avatar-lg { width:64px; height:64px; border-radius:50%; background:linear-gradient(135deg,#3B6BF0,#2040C0); display:flex; align-items:center; justify-content:center; font-family:'Manrope',sans-serif; font-weight:700; font-size:24px; color:#fff; }
`;

function UserManagement() {
  const [users,          setUsers]          = useState([]);
  const [filteredUsers,  setFilteredUsers]  = useState([]);
  const [selectedUser,   setSelectedUser]   = useState(null);
  const [showUserDetail, setShowUserDetail] = useState(false);
  const [isEditing,      setIsEditing]      = useState(false);
  const [editableUser,   setEditableUser]   = useState(null);
  const [showFilters,    setShowFilters]    = useState(false);
  const [showRegister,   setShowRegister]   = useState(false);
  const [newUser,        setNewUser]        = useState({ name:'', email:'', mobileno:'', password:'' });

  const [filters, setFilters] = useState({
    search:'', dateRange:{ start:'', end:'' },
    status:'', lastLoginAfter:'', sortBy:'name', sortOrder:'asc'
  });

  // ── original fetch & filter logic ──
  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/get-users`);
      const data = await response.json();
      setUsers(data); setFilteredUsers(data);
    } catch (error) { console.error('Error fetching users:', error); }
  };

  useEffect(() => { fetchUsers(); }, []);

  useEffect(() => {
    let result = [...users];
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(u => u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q) || u.mobile?.toLowerCase().includes(q));
    }
    if (filters.status) result = result.filter(u => u.status === filters.status);
    if (filters.dateRange.start) result = result.filter(u => new Date(u.createdAt) >= new Date(filters.dateRange.start));
    if (filters.dateRange.end)   result = result.filter(u => new Date(u.createdAt) <= new Date(filters.dateRange.end));
    if (filters.lastLoginAfter)  result = result.filter(u => new Date(u.lastLogin) >= new Date(filters.lastLoginAfter));
    result.sort((a, b) => {
      const av = a[filters.sortBy] || '', bv = b[filters.sortBy] || '';
      return filters.sortOrder === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
    });
    setFilteredUsers(result);
  }, [filters, users]);

  const handleEditUser = (user) => {
    setEditableUser({ id: user._id?.toString() || '', name: user.name || '', email: user.email || '', mobile: user.mobile || '' });
    setIsEditing(true);
  };

  const handleSubmitUpdate = async () => {
    if (!editableUser.id || !editableUser.name || !editableUser.email || !editableUser.mobile) { alert('All fields are required.'); return; }
    try {
      const response = await fetch(`${API_BASE_URL}/update-profile`, { method:'POST', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify(editableUser) });
      const result = await response.json();
      if (result.flag === '1') { fetchUsers(); setIsEditing(false); setEditableUser(null); alert('User updated!'); }
      else alert(result.message || 'Error updating user.');
    } catch { alert('An error occurred while updating.'); }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      const response = await fetch(`${API_BASE_URL}/api/deleteUser/${userId}`, { method:'DELETE' });
      if (response.ok) { alert('User deleted!'); fetchUsers(); }
      else { const result = await response.json(); alert(result.message || 'Error deleting user.'); }
    } catch { alert('An error occurred while deleting.'); }
  };

  const handleViewUser   = (user) => { setSelectedUser(user); setShowUserDetail(true); };
  const resetFilters     = () => setFilters({ search:'', dateRange:{ start:'', end:'' }, status:'', lastLoginAfter:'', sortBy:'name', sortOrder:'asc' });

  const handleRegisterUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.mobileno || !newUser.password) { alert('All fields are required.'); return; }
    try {
      const adminId = localStorage.getItem('adminId');
      const response = await fetch(`${API_BASE_URL}/api/admin/register`, { method:'POST', headers:{ 'Content-Type':'application/json', 'admin-id': adminId }, body: JSON.stringify(newUser) });
      const result = await response.json();
      if (response.ok) { alert('User registered!'); setShowRegister(false); setNewUser({ name:'', email:'', mobileno:'', password:'' }); fetchUsers(); }
      else alert(result.message || 'Error registering user.');
    } catch { alert('An error occurred.'); }
  };

  const fmtDate = (d) => { try { return new Date(d).toLocaleDateString('en-KE',{ year:'numeric', month:'short', day:'numeric' }); } catch { return d || '—'; } };

  return (
    <AdminLayout pageTitle="User Management">
      <style>{STYLES}</style>
      <div className="um-root">

        <div className="um-page-header">
          <div>
            <div className="um-page-label">People</div>
            <div className="um-page-title">User Management</div>
          </div>
          <div className="header-actions">
            <button className="btn-primary" onClick={() => setShowRegister(true)}>
              <UserPlus size={15}/> Register User
            </button>
            <button className={`btn-secondary${showFilters?' active':''}`} onClick={() => setShowFilters(!showFilters)}>
              <Filter size={15}/> {showFilters ? 'Hide Filters' : 'Filters'}
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="filter-panel">
            <div className="filter-grid">
              <div className="filter-field" style={{ gridColumn:'1/-1' }}>
                <label className="filter-label">Search</label>
                <div style={{ position:'relative' }}>
                  <Search size={14} style={{ position:'absolute', left:11, top:'50%', transform:'translateY(-50%)', color:'#8888A8', pointerEvents:'none' }}/>
                  <input className="filter-input" style={{ paddingLeft:34 }} type="text" placeholder="Name, email, mobile…" value={filters.search} onChange={e => setFilters(prev => ({ ...prev, search:e.target.value }))}/>
                </div>
              </div>
              <div className="filter-field">
                <label className="filter-label">Status</label>
                <select className="filter-select" value={filters.status} onChange={e => setFilters(prev => ({ ...prev, status:e.target.value }))}>
                  <option value="">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>
              <div className="filter-field">
                <label className="filter-label">Joined Date Range</label>
                <div className="pair">
                  <input className="filter-input" type="date" value={filters.dateRange.start} onChange={e => setFilters(prev => ({ ...prev, dateRange:{ ...prev.dateRange, start:e.target.value } }))}/>
                  <input className="filter-input" type="date" value={filters.dateRange.end} onChange={e => setFilters(prev => ({ ...prev, dateRange:{ ...prev.dateRange, end:e.target.value } }))}/>
                </div>
              </div>
              <div className="filter-field">
                <label className="filter-label">Last Login After</label>
                <input className="filter-input" type="date" value={filters.lastLoginAfter} onChange={e => setFilters(prev => ({ ...prev, lastLoginAfter:e.target.value }))}/>
              </div>
              <div className="filter-field">
                <label className="filter-label">Sort</label>
                <div className="pair">
                  <select className="filter-select" value={filters.sortBy} onChange={e => setFilters(prev => ({ ...prev, sortBy:e.target.value }))}>
                    <option value="name">Name</option>
                    <option value="email">Email</option>
                    <option value="status">Status</option>
                    <option value="lastLogin">Last Login</option>
                  </select>
                  <select className="filter-select" value={filters.sortOrder} onChange={e => setFilters(prev => ({ ...prev, sortOrder:e.target.value }))}>
                    <option value="asc">Asc</option>
                    <option value="desc">Desc</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="filter-actions">
              <button className="btn-reset" onClick={resetFilters}><RefreshCcw size={12}/> Reset</button>
              <span className="filter-count">{filteredUsers.length} users</span>
            </div>
          </div>
        )}

        <div className="table-panel">
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>User</th><th>Email</th><th>Mobile</th><th>Status</th><th>Last Login</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr className="empty-row"><td colSpan={6}>No users found</td></tr>
                ) : filteredUsers.map(user => (
                  <tr key={user._id || `${user.name}-${user.email}`}>
                    <td>
                      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                        <div className="user-avatar">{user.name?.[0]?.toUpperCase() || 'U'}</div>
                        <div className="cell-primary">{user.name}</div>
                      </div>
                    </td>
                    <td style={{ color:'#8888A8' }}>{user.email}</td>
                    <td style={{ color:'#8888A8' }}>{user.mobile || '—'}</td>
                    <td>
                      <span className={`s-pill ${user.status || 'Pending'}`}>
                        <span className="s-pill-dot"/>{user.status || 'Pending'}
                      </span>
                    </td>
                    <td style={{ fontSize:12, color:'#8888A8' }}>{user.lastLogin || '—'}</td>
                    <td>
                      <div className="action-btns">
                        <button className="action-btn view" onClick={() => handleViewUser(user)} title="View"><Eye size={13}/></button>
                        <button className="action-btn edit" onClick={() => handleEditUser(user)} title="Edit"><Edit size={13}/></button>
                        <button className="action-btn del"  onClick={() => handleDeleteUser(user._id)} title="Delete"><Trash2 size={13}/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* VIEW MODAL */}
        {showUserDetail && selectedUser && (
          <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowUserDetail(false)}>
            <div className="modal-box">
              <div className="modal-header">
                <div className="modal-title">{selectedUser.name}</div>
                <button className="modal-close" onClick={() => setShowUserDetail(false)}><X size={15}/></button>
              </div>
              <div className="modal-body">
                <div className="avatar-center">
                  <div className="avatar-lg">{selectedUser.name?.[0]?.toUpperCase()}</div>
                </div>
                <div className="view-grid">
                  {[
                    { label:'Full Name',  value:selectedUser.name,                    full:true },
                    { label:'Email',      value:selectedUser.email,                   full:true },
                    { label:'Mobile',     value:selectedUser.mobile },
                    { label:'Status',     value:selectedUser.status },
                    { label:'Last Login', value:selectedUser.lastLogin },
                    { label:'Joined',     value:fmtDate(selectedUser.createdAt) },
                  ].map(({ label, value, full }) => (
                    <div key={label} className={`view-field${full?' full':''}`}>
                      <div className="view-field-label">{label}</div>
                      <div className="view-field-value">{value || '—'}</div>
                    </div>
                  ))}
                </div>
                <div className="form-footer">
                  <button className="btn-cancel" onClick={() => setShowUserDetail(false)}>Close</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* EDIT MODAL */}
        {isEditing && editableUser && (
          <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setIsEditing(false)}>
            <div className="modal-box">
              <div className="modal-header">
                <div className="modal-title">Edit User</div>
                <button className="modal-close" onClick={() => setIsEditing(false)}><X size={15}/></button>
              </div>
              <div className="modal-body">
                <div className="form-stack">
                  <div className="form-field">
                    <label className="form-label">User ID</label>
                    <input className="form-input" type="text" value={editableUser.id} disabled/>
                  </div>
                  <div className="form-field">
                    <label className="form-label">Full Name</label>
                    <input className="form-input" type="text" value={editableUser.name} onChange={e => setEditableUser({ ...editableUser, name:e.target.value })} placeholder="Name"/>
                  </div>
                  <div className="form-field">
                    <label className="form-label">Email</label>
                    <input className="form-input" type="email" value={editableUser.email} onChange={e => setEditableUser({ ...editableUser, email:e.target.value })} placeholder="Email"/>
                  </div>
                  <div className="form-field">
                    <label className="form-label">Mobile</label>
                    <input className="form-input" type="text" value={editableUser.mobile} onChange={e => setEditableUser({ ...editableUser, mobile:e.target.value })} placeholder="Mobile number"/>
                  </div>
                </div>
                <div className="form-footer">
                  <button className="btn-cancel" onClick={() => setIsEditing(false)}>Cancel</button>
                  <button className="btn-primary" onClick={handleSubmitUpdate}>Save Changes</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* REGISTER MODAL */}
        {showRegister && (
          <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowRegister(false)}>
            <div className="modal-box">
              <div className="modal-header">
                <div className="modal-title">Register New User</div>
                <button className="modal-close" onClick={() => setShowRegister(false)}><X size={15}/></button>
              </div>
              <div className="modal-body">
                <div className="form-stack">
                  {[
                    { label:'Full Name',       key:'name',     type:'text',     placeholder:'John Doe' },
                    { label:'Email Address',   key:'email',    type:'email',    placeholder:'john@example.com' },
                    { label:'Mobile Number',   key:'mobileno', type:'text',     placeholder:'+254 7XX XXX XXX' },
                    { label:'Initial Password',key:'password', type:'password', placeholder:'••••••••' },
                  ].map(({ label, key, type, placeholder }) => (
                    <div key={key} className="form-field">
                      <label className="form-label">{label}</label>
                      <input className="form-input" type={type} placeholder={placeholder} value={newUser[key]} onChange={e => setNewUser({ ...newUser, [key]:e.target.value })}/>
                    </div>
                  ))}
                </div>
                <div className="form-footer">
                  <button className="btn-cancel" onClick={() => setShowRegister(false)}>Cancel</button>
                  <button className="btn-primary" onClick={handleRegisterUser}><UserPlus size={14}/> Register</button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
}

export default AdminAuth(UserManagement);