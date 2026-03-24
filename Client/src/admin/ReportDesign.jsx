import React, { useState } from 'react';
import axios from 'axios';
import { FileText, Download, Calendar, BarChart2, TrendingUp, Users, DollarSign } from 'lucide-react';
import AdminLayout from './AdminLayout';
import AdminAuth from './AdminAuth';
import API_BASE_URL from '../config/apiConfig';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@600;700;800&family=Inter:wght@400;500;600&display=swap');

  .rd-root { font-family:'Inter',sans-serif; color:#1A1A2E; max-width:720px; }
  .rd-page-label { font-size:11px; font-weight:700; letter-spacing:.8px; text-transform:uppercase; color:#3B6BF0; margin-bottom:4px; }
  .rd-page-title { font-family:'Manrope',sans-serif; font-weight:800; font-size:22px; color:#1A1A2E; margin-bottom:4px; }
  .rd-page-sub { font-size:13px; color:#8888A8; margin-bottom:28px; }

  .report-card { background:#fff; border:1px solid #E5E7F0; border-radius:12px; padding:28px; }

  /* SCOPE TOGGLE */
  .scope-toggle { display:inline-flex; background:#F7F8FC; border:1px solid #E5E7F0; border-radius:8px; padding:3px; gap:3px; margin-bottom:24px; }
  .scope-btn { padding:8px 24px; border-radius:6px; font-family:'Inter',sans-serif; font-size:13px; font-weight:500; border:none; cursor:pointer; transition:all .18s; background:transparent; color:#8888A8; }
  .scope-btn.active { background:#3B6BF0; color:#fff; box-shadow:0 2px 8px rgba(59,107,240,.25); }

  .section-divider { height:1px; background:#E5E7F0; margin:24px 0; }
  .section-label { font-size:11px; font-weight:700; letter-spacing:.8px; text-transform:uppercase; color:#8888A8; margin-bottom:14px; display:flex; align-items:center; gap:6px; }
  .section-label::before { content:''; width:12px; height:2px; background:#3B6BF0; border-radius:2px; display:inline-block; }

  /* REPORT TYPE GRID */
  .report-type-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(140px,1fr)); gap:10px; }
  .rto {
    border:2px solid #E5E7F0; border-radius:10px; padding:16px 12px;
    cursor:pointer; transition:all .18s; background:#F7F8FC;
    display:flex; flex-direction:column; align-items:center; gap:6px; text-align:center;
  }
  .rto:hover { border-color:#3B6BF0; background:#EEF2FF; }
  .rto.selected { border-color:#3B6BF0; background:#EEF2FF; }
  .rto-icon { width:38px; height:38px; border-radius:8px; background:#EEF2FF; display:flex; align-items:center; justify-content:center; color:#3B6BF0; margin-bottom:2px; transition:all .18s; }
  .rto.selected .rto-icon { background:#3B6BF0; color:#fff; }
  .rto-label { font-size:13px; font-weight:600; color:#1A1A2E; line-height:1.3; }
  .rto-sub { font-size:11px; color:#8888A8; }

  /* DATE FIELDS */
  .field-row { display:grid; grid-template-columns:1fr 1fr; gap:14px; margin-top:20px; }
  @media(max-width:460px){ .field-row { grid-template-columns:1fr; } }
  .field-group { display:flex; flex-direction:column; gap:5px; }
  .field-group.full { grid-column:1/-1; }
  .field-label { font-size:10px; font-weight:700; letter-spacing:.8px; text-transform:uppercase; color:#8888A8; }
  .field-select { background:#F7F8FC; border:1px solid #E5E7F0; border-radius:8px; padding:10px 12px; color:#1A1A2E; font-family:'Inter',sans-serif; font-size:13px; outline:none; transition:border .18s; appearance:none; -webkit-appearance:none; width:100%; cursor:pointer; background-image:url("data:image/svg+xml,%3Csvg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%238888A8' stroke-width='2' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E"); background-repeat:no-repeat; background-position:right 10px center; padding-right:32px; }
  .field-select:focus { border-color:#3B6BF0; background:#fff; }
  .field-select option { background:#fff; color:#1A1A2E; }

  /* PREVIEW */
  .preview-box { background:#EEF2FF; border:1px solid rgba(59,107,240,.2); border-radius:10px; padding:14px 16px; margin-top:20px; }
  .preview-title { font-size:10px; font-weight:700; letter-spacing:.8px; text-transform:uppercase; color:#3B6BF0; margin-bottom:6px; }
  .preview-text { font-size:13px; color:#4A4A68; line-height:1.6; }
  .preview-text strong { color:#1A1A2E; }

  /* GENERATE BUTTON */
  .generate-btn { width:100%; margin-top:20px; background:#3B6BF0; color:#fff; border:none; padding:14px; border-radius:8px; font-family:'Inter',sans-serif; font-weight:600; font-size:14px; cursor:pointer; transition:all .2s; display:flex; align-items:center; justify-content:center; gap:8px; }
  .generate-btn:hover:not(:disabled) { background:#2952CC; transform:translateY(-1px); box-shadow:0 6px 20px rgba(59,107,240,.3); }
  .generate-btn:disabled { opacity:.6; cursor:not-allowed; transform:none; box-shadow:none; }

  .spinner { width:16px; height:16px; border:2px solid rgba(255,255,255,.3); border-top-color:#fff; border-radius:50%; animation:spin .7s linear infinite; }
  @keyframes spin { to { transform:rotate(360deg); } }
`;

const REPORT_TYPES = [
  { value:'overall',          label:'Overall',    sub:'Full summary',       icon:BarChart2  },
  { value:'sales',            label:'Sales',      sub:'Vehicle sales',      icon:TrendingUp },
  { value:'rentals',          label:'Rentals',    sub:'Rental activity',    icon:Calendar   },
  { value:'financials',       label:'Financials', sub:'Revenue & payments', icon:DollarSign },
  { value:'customerfeedback', label:'Feedback',   sub:'Customer reviews',   icon:Users      },
];

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

const ReportDesign = () => {
  const [reportScope, setReportScope] = useState('monthly');
  const [reportType,  setReportType]  = useState('overall');
  const [month,       setMonth]       = useState(new Date().getMonth() + 1);
  const [year,        setYear]        = useState(new Date().getFullYear());
  const [generating,  setGenerating]  = useState(false);

  // original generate logic
  const generateReport = async () => {
    setGenerating(true);
    try {
      const params = { year, reportType, reportScope };
      if (reportScope==='monthly') params.month = month;
      const response = await axios.get(`${API_BASE_URL}/api/reports`, { params, responseType:'blob' });
      const blob = new Blob([response.data], { type:'application/pdf' });
      const link = document.createElement('a');
      const filename = reportScope==='yearly'
        ? `roditec_yearly_report_${year}.pdf`
        : `roditec_${reportType}_report_${MONTHS[month-1].toLowerCase()}_${year}.pdf`;
      link.href = window.URL.createObjectURL(blob);
      link.download = filename;
      link.click();
    } catch (error) {
      console.error('Report generation failed:',error);
      alert('Failed to generate report. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const currentYear = new Date().getFullYear();
  const selectedType = REPORT_TYPES.find(t => t.value===reportType);

  return (
    <AdminLayout pageTitle="Reports">
      <style>{STYLES}</style>
      <div className="rd-root">
        <div className="rd-page-label">Analytics</div>
        <div className="rd-page-title">Generate Report</div>
        <div className="rd-page-sub">Download detailed PDF reports in KSH for any time period and category.</div>

        <div className="report-card">

          {/* SCOPE TOGGLE */}
          <div className="section-label">Report Period</div>
          <div className="scope-toggle">
            <button className={`scope-btn${reportScope==='monthly'?' active':''}`} onClick={() => setReportScope('monthly')}>Monthly</button>
            <button className={`scope-btn${reportScope==='yearly'?' active':''}`} onClick={() => setReportScope('yearly')}>Yearly</button>
          </div>

          <div className="section-divider"/>

          {/* REPORT TYPE */}
          <div className="section-label">Report Type</div>
          <div className="report-type-grid">
            {REPORT_TYPES.map(type => (
              <div key={type.value} className={`rto${reportType===type.value?' selected':''}`} onClick={() => setReportType(type.value)}>
                <div className="rto-icon"><type.icon size={17}/></div>
                <div className="rto-label">{type.label}</div>
                <div className="rto-sub">{type.sub}</div>
              </div>
            ))}
          </div>

          <div className="section-divider"/>

          {/* DATE SELECTORS */}
          <div className="section-label">Time Period</div>
          <div className="field-row">
            {reportScope==='monthly' && (
              <div className="field-group">
                <label className="field-label">Month</label>
                <select className="field-select" value={month} onChange={e => setMonth(e.target.value)}>
                  {MONTHS.map((m,i) => <option key={i+1} value={i+1}>{m}</option>)}
                </select>
              </div>
            )}
            <div className={`field-group${reportScope==='yearly'?' full':''}`}>
              <label className="field-label">Year</label>
              <select className="field-select" value={year} onChange={e => setYear(e.target.value)}>
                {[...Array(5)].map((_,i) => (
                  <option key={currentYear-i} value={currentYear-i}>{currentYear-i}</option>
                ))}
              </select>
            </div>
          </div>

          {/* PREVIEW */}
          <div className="preview-box">
            <div className="preview-title">Report Preview</div>
            <div className="preview-text">
              Generating a <strong>{selectedType?.label} Report</strong> for{' '}
              {reportScope==='monthly'
                ? <><strong>{MONTHS[month-1]} {year}</strong></>
                : <><strong>Full Year {year}</strong></>
              }. The PDF will download automatically. All amounts in <strong>KSH</strong>.
            </div>
          </div>

          <button className="generate-btn" onClick={generateReport} disabled={generating}>
            {generating
              ? <><div className="spinner"/> Generating…</>
              : <><Download size={16}/> Download Report</>
            }
          </button>

        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminAuth(ReportDesign);