import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CreditCard, DollarSignIcon as PaypalLogo, Smartphone, CheckCircle, ArrowLeft, Shield, Car } from 'lucide-react';
import API_BASE_URL from '../config/apiConfig';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@600;700;800&family=Inter:wght@400;500;600&display=swap');

  .payment-root {
    min-height: 100vh;
    background: #F7F8FC;
    font-family: 'Inter', sans-serif;
    padding: 100px 24px 60px;
  }

  .payment-inner {
    max-width: 860px;
    margin: 0 auto;
  }

  .payment-back {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 13px; color: #8888A8; text-decoration: none;
    background: none; border: none; cursor: pointer;
    font-family: 'Inter',sans-serif; margin-bottom: 24px; transition: color .18s;
  }
  .payment-back:hover { color: #3B6BF0; }

  .payment-grid {
    display: grid;
    grid-template-columns: 1fr 340px;
    gap: 24px;
    align-items: start;
  }
  @media (max-width: 768px) { .payment-grid { grid-template-columns: 1fr; } }

  /* ── FORM CARD ── */
  .payment-card {
    background: #fff;
    border: 1px solid #E5E7F0;
    border-radius: 12px;
    padding: 32px;
    box-shadow: 0 2px 12px rgba(0,0,0,.05);
  }

  .payment-title {
    font-family: 'Manrope', sans-serif;
    font-size: 22px; font-weight: 800; color: #1A1A2E;
    margin-bottom: 6px;
  }
  .payment-subtitle { font-size: 13px; color: #8888A8; margin-bottom: 28px; }

  /* Method selector */
  .method-tabs { display: flex; gap: 8px; margin-bottom: 28px; }
  .method-tab {
    flex: 1; display: flex; flex-direction: column; align-items: center; gap: 6px;
    padding: 14px 10px; border-radius: 10px;
    border: 2px solid #E5E7F0; background: #F7F8FC;
    cursor: pointer; transition: all .18s; font-family: 'Inter',sans-serif;
  }
  .method-tab:hover { border-color: #3B6BF0; background: #EEF2FF; }
  .method-tab.active { border-color: #3B6BF0; background: #EEF2FF; }
  .method-tab-icon { color: #4A4A68; }
  .method-tab.active .method-tab-icon { color: #3B6BF0; }
  .method-tab-label { font-size: 12px; font-weight: 600; color: #4A4A68; text-transform: capitalize; }
  .method-tab.active .method-tab-label { color: #3B6BF0; }

  /* Form fields */
  .form-section-title { font-size: 11px; font-weight: 700; letter-spacing: .8px; text-transform: uppercase; color: #8888A8; margin-bottom: 14px; padding-bottom: 10px; border-bottom: 1px solid #E5E7F0; }

  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .form-field { margin-bottom: 16px; }
  .form-label { display: block; font-size: 11px; font-weight: 700; letter-spacing: .5px; text-transform: uppercase; color: #8888A8; margin-bottom: 6px; }
  .form-input {
    width: 100%; background: #F7F8FC; border: 1.5px solid #E5E7F0;
    border-radius: 8px; padding: 11px 14px;
    font-family: 'Inter',sans-serif; font-size: 14px; color: #1A1A2E;
    outline: none; transition: border .18s;
  }
  .form-input:focus { border-color: #3B6BF0; background: #fff; box-shadow: 0 0 0 3px rgba(59,107,240,.08); }
  .form-input::placeholder { color: #AAAACC; }
  .form-input.error { border-color: #E63946; }
  .field-error { font-size: 12px; color: #E63946; margin-top: 4px; display: block; }

  .submit-btn {
    width: 100%; background: #3B6BF0; color: #fff; border: none; border-radius: 8px;
    padding: 14px; font-family: 'Inter',sans-serif; font-size: 15px; font-weight: 700;
    cursor: pointer; transition: all .2s; display: flex; align-items: center; justify-content: center; gap: 8px;
    margin-top: 8px;
  }
  .submit-btn:hover:not(:disabled) { background: #2952CC; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(59,107,240,.3); }
  .submit-btn:disabled { background: #8888A8; cursor: not-allowed; transform: none; box-shadow: none; }

  /* Spinner */
  .spinner { width: 18px; height: 18px; border: 2px solid rgba(255,255,255,.3); border-top-color: #fff; border-radius: 50%; animation: spin .7s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* ── SUMMARY CARD ── */
  .summary-card { background: #fff; border: 1px solid #E5E7F0; border-radius: 12px; padding: 24px; box-shadow: 0 2px 12px rgba(0,0,0,.05); position: sticky; top: 110px; }
  .summary-title { font-family: 'Manrope',sans-serif; font-size: 16px; font-weight: 700; color: #1A1A2E; margin-bottom: 20px; padding-bottom: 14px; border-bottom: 1px solid #E5E7F0; }

  .summary-car { display: flex; align-items: center; gap: 12px; background: #EEF2FF; border-radius: 8px; padding: 12px; margin-bottom: 20px; }
  .summary-car-icon { width: 42px; height: 42px; background: #3B6BF0; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #fff; flex-shrink: 0; }
  .summary-car-id { font-size: 12px; color: #8888A8; }
  .summary-car-label { font-size: 13px; font-weight: 600; color: #1A1A2E; }

  .summary-row { display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 8px; }
  .summary-lbl { color: #8888A8; }
  .summary-val { color: #1A1A2E; font-weight: 500; }
  .summary-divider { height: 1px; background: #E5E7F0; margin: 12px 0; }
  .summary-total { display: flex; justify-content: space-between; font-family: 'Manrope',sans-serif; font-weight: 800; }
  .summary-total-lbl { font-size: 14px; color: #1A1A2E; }
  .summary-total-val { font-size: 18px; color: #3B6BF0; }

  .booking-amount { background: #EEF2FF; border: 1px solid rgba(59,107,240,.2); border-radius: 8px; padding: 12px 14px; margin-top: 14px; }
  .booking-amount-label { font-size: 11px; font-weight: 700; color: #3B6BF0; text-transform: uppercase; letter-spacing: .5px; margin-bottom: 4px; }
  .booking-amount-val { font-family: 'Manrope',sans-serif; font-size: 22px; font-weight: 800; color: #1A1A2E; }
  .booking-amount-sub { font-size: 11px; color: #8888A8; margin-top: 2px; }

  .trust-row { display: flex; align-items: center; gap: 6px; font-size: 12px; color: #8888A8; margin-top: 14px; }

  /* ── SUCCESS ── */
  .success-wrap { background: #fff; border: 1px solid #E5E7F0; border-radius: 12px; padding: 60px 40px; text-align: center; box-shadow: 0 2px 12px rgba(0,0,0,.05); }
  .success-check { width: 72px; height: 72px; background: #D1E7DD; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; }
  .success-title { font-family: 'Manrope',sans-serif; font-size: 26px; font-weight: 800; color: #1A1A2E; margin-bottom: 10px; }
  .success-sub { font-size: 14px; color: #4A4A68; line-height: 1.7; margin-bottom: 8px; }
  .success-amount { font-family: 'Manrope',sans-serif; font-size: 28px; font-weight: 800; color: #2D9C5A; margin: 16px 0 8px; }
  .success-amount-label { font-size: 12px; color: #8888A8; margin-bottom: 28px; }
  .btn-go-home { background: #3B6BF0; color: #fff; border: none; border-radius: 8px; padding: 13px 36px; font-family: 'Inter',sans-serif; font-weight: 600; font-size: 14px; cursor: pointer; transition: background .18s; }
  .btn-go-home:hover { background: #2952CC; }
`;

export default function Payment() {
  const { id } = useParams();
  const navigate = useNavigate();

  // ── original state ──
  const [step,          setStep]          = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('credit');
  const [formData,      setFormData]      = useState({ cardNumber: '', expiryDate: '', cvv: '', name: '', email: '', paypalEmail: '', upiId: '' });
  const [errors,        setErrors]        = useState({});
  const [isProcessing,  setIsProcessing]  = useState(false);
  const [carPrice,      setCarPrice]      = useState(null);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState(null);

  // ── original fetch logic ──
  useEffect(() => {
    const fetchCarPrice = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/listings/listings/${id}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        if (data && data.price?.$numberDecimal) {
          setCarPrice(parseFloat(data.price.$numberDecimal));
        } else {
          throw new Error('Invalid price data');
        }
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchCarPrice();
  }, [id]);

  // ── original price calc ──
  const taxRate        = 0.08;
  const registrationFee = 5000;
  const totalPrice     = carPrice ? carPrice + (carPrice * taxRate) + registrationFee : 0;
  const bookingPrice   = totalPrice * 25 / 100;

  // ── original handlers ──
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (paymentMethod === 'credit') {
      if (!/^\d{16}$/.test(formData.cardNumber))       newErrors.cardNumber  = 'Invalid card number (16 digits)';
      if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate)) newErrors.expiryDate  = 'Invalid expiry date (MM/YY)';
      if (!/^\d{3}$/.test(formData.cvv))               newErrors.cvv         = 'Invalid CVV (3 digits)';
      if (formData.name.trim().length < 3)              newErrors.name        = 'Cardholder name is required';
    } else if (paymentMethod === 'paypal') {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.paypalEmail)) newErrors.paypalEmail = 'Invalid email address';
    } else if (paymentMethod === 'upi') {
      if (!/^[^\s@]+@[^\s@]+/.test(formData.upiId)) newErrors.upiId = 'Invalid UPI ID';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email address';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const userId = localStorage.getItem('id');

  // ── original submit logic ──
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsProcessing(true);
      setTimeout(async () => {
        const paymentMethodMapping = { credit: 'credit_card', paypal: 'paypal', upi: 'upi' };
        const payload = {
          user_id: String(userId),
          transaction_id: `TR${Date.now()}`,
          amount: bookingPrice,
          payment_method: paymentMethodMapping[paymentMethod],
          payment_status: 'success',
          formData,
        };
        try {
          const response = await fetch(`${API_BASE_URL}/payments`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });
          const data = await response.json();
          if (response.ok) {
            const carStatusResponse = await fetch(`${API_BASE_URL}/api/listings/listings/${id}`, {
              method: 'PUT', headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ listing_status: 'sold' }),
            });
            if (carStatusResponse.ok) {
              const bookingPayload = {
                listing_id: id, user_id: String(userId), car_id: Number(id),
                transaction_id: payload.transaction_id,
                booking_start_date: new Date().toISOString(),
                booking_end_date: new Date().toISOString(),
                total_price: totalPrice.toFixed(2),
                paid_price: bookingPrice.toFixed(2),
                booking_status: 'confirmed', payment_status: 'paid',
              };
              const bookingResponse = await fetch(`${API_BASE_URL}/api/booking`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bookingPayload),
              });
              if (bookingResponse.ok) { setStep(2); }
              else alert('Payment succeeded, but booking record creation failed.');
            } else {
              alert('Payment succeeded, but car status update failed.');
            }
          } else {
            alert(`Payment failed: ${data.error}`);
          }
        } catch (err) {
          alert('An unexpected error occurred. Please try again later.');
        } finally {
          setIsProcessing(false);
        }
      }, 5000);
    }
  };

  // ── LOADING / ERROR ──
  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#F7F8FC' }}>
      <style>{STYLES}</style>
      <div style={{ textAlign: 'center' }}>
        <div className="spinner" style={{ width: 40, height: 40, margin: '0 auto 16px', borderWidth: 3 }} />
        <div style={{ fontFamily: 'Manrope,sans-serif', fontSize: 16, color: '#1A1A2E', fontWeight: 600 }}>Loading payment details…</div>
      </div>
    </div>
  );

  if (error) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#F7F8FC' }}>
      <style>{STYLES}</style>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
        <div style={{ fontFamily: 'Manrope,sans-serif', fontSize: 18, fontWeight: 700, color: '#E63946', marginBottom: 8 }}>Error</div>
        <p style={{ fontSize: 14, color: '#4A4A68', marginBottom: 20 }}>{error}</p>
        <button className="btn-go-home" onClick={() => navigate('/')}>Go Home</button>
      </div>
    </div>
  );

  if (!carPrice) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#F7F8FC' }}>
      <style>{STYLES}</style>
      <p style={{ fontFamily: 'Inter,sans-serif', color: '#4A4A68' }}>Car not found or price unavailable</p>
    </div>
  );

  return (
    <div className="payment-root">
      <style>{STYLES}</style>

      <div className="payment-inner">
        <button className="payment-back" onClick={() => navigate(-1)}>
          <ArrowLeft size={14} /> Back
        </button>

        {step === 1 ? (
          <div className="payment-grid">
            {/* FORM */}
            <div className="payment-card">
              <div className="payment-title">Complete Your Booking</div>
              <div className="payment-subtitle">Secure payment — your booking amount is 25% of the total</div>

              {/* Method selector */}
              <div className="method-tabs">
                {[
                  { key: 'credit', icon: CreditCard, label: 'Card' },
                  { key: 'paypal', icon: PaypalLogo, label: 'PayPal' },
                  { key: 'upi',    icon: Smartphone, label: 'M-Pesa / UPI' },
                ].map(({ key, icon: Icon, label }) => (
                  <div key={key} className={`method-tab${paymentMethod === key ? ' active' : ''}`} onClick={() => setPaymentMethod(key)}>
                    <Icon size={20} className="method-tab-icon" />
                    <div className="method-tab-label">{label}</div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSubmit} noValidate>
                {/* Credit card fields */}
                {paymentMethod === 'credit' && (
                  <>
                    <div className="form-section-title">Card Details</div>
                    <div className="form-field">
                      <label className="form-label">Card Number</label>
                      <input type="text" name="cardNumber" value={formData.cardNumber} onChange={handleInputChange} placeholder="1234 5678 1234 5678" className={`form-input${errors.cardNumber ? ' error' : ''}`} />
                      {errors.cardNumber && <span className="field-error">{errors.cardNumber}</span>}
                    </div>
                    <div className="form-row">
                      <div className="form-field">
                        <label className="form-label">Expiry Date</label>
                        <input type="text" name="expiryDate" value={formData.expiryDate} onChange={handleInputChange} placeholder="MM/YY" className={`form-input${errors.expiryDate ? ' error' : ''}`} />
                        {errors.expiryDate && <span className="field-error">{errors.expiryDate}</span>}
                      </div>
                      <div className="form-field">
                        <label className="form-label">CVV</label>
                        <input type="password" name="cvv" value={formData.cvv} onChange={handleInputChange} placeholder="123" className={`form-input${errors.cvv ? ' error' : ''}`} />
                        {errors.cvv && <span className="field-error">{errors.cvv}</span>}
                      </div>
                    </div>
                    <div className="form-field">
                      <label className="form-label">Cardholder Name</label>
                      <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="John Kamau" className={`form-input${errors.name ? ' error' : ''}`} />
                      {errors.name && <span className="field-error">{errors.name}</span>}
                    </div>
                  </>
                )}

                {/* PayPal */}
                {paymentMethod === 'paypal' && (
                  <>
                    <div className="form-section-title">PayPal Details</div>
                    <div className="form-field">
                      <label className="form-label">PayPal Email</label>
                      <input type="email" name="paypalEmail" value={formData.paypalEmail} onChange={handleInputChange} placeholder="you@example.com" className={`form-input${errors.paypalEmail ? ' error' : ''}`} />
                      {errors.paypalEmail && <span className="field-error">{errors.paypalEmail}</span>}
                    </div>
                  </>
                )}

                {/* UPI */}
                {paymentMethod === 'upi' && (
                  <>
                    <div className="form-section-title">M-Pesa / UPI Details</div>
                    <div className="form-field">
                      <label className="form-label">UPI ID / Phone Number</label>
                      <input type="text" name="upiId" value={formData.upiId} onChange={handleInputChange} placeholder="+254 7XX XXX XXX or you@upi" className={`form-input${errors.upiId ? ' error' : ''}`} />
                      {errors.upiId && <span className="field-error">{errors.upiId}</span>}
                    </div>
                  </>
                )}

                <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid #E5E7F0' }}>
                  <div className="form-section-title">Contact Information</div>
                  <div className="form-field">
                    <label className="form-label">Email Address</label>
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="you@example.com" className={`form-input${errors.email ? ' error' : ''}`} />
                    {errors.email && <span className="field-error">{errors.email}</span>}
                  </div>
                </div>

                <button type="submit" disabled={isProcessing} className="submit-btn">
                  {isProcessing ? (
                    <><div className="spinner" />Processing…</>
                  ) : (
                    <><CreditCard size={16} />Confirm Payment — KSH {bookingPrice.toFixed(2)}</>
                  )}
                </button>
              </form>
            </div>

            {/* SUMMARY */}
            <div className="summary-card">
              <div className="summary-title">Order Summary</div>

              <div className="summary-car">
                <div className="summary-car-icon"><Car size={20} /></div>
                <div>
                  <div className="summary-car-label">Vehicle #{id}</div>
                  <div className="summary-car-id">Booking ID: {id}</div>
                </div>
              </div>

              <div className="summary-row"><span className="summary-lbl">Vehicle Price</span><span className="summary-val">KSH {carPrice.toLocaleString()}</span></div>
              <div className="summary-row"><span className="summary-lbl">Tax ({(taxRate * 100).toFixed(0)}%)</span><span className="summary-val">KSH {(carPrice * taxRate).toLocaleString()}</span></div>
              <div className="summary-row"><span className="summary-lbl">Registration Fee</span><span className="summary-val">KSH {registrationFee.toLocaleString()}</span></div>
              <div className="summary-divider" />
              <div className="summary-total">
                <span className="summary-total-lbl">Total Price</span>
                <span className="summary-total-val">KSH {totalPrice.toFixed(2)}</span>
              </div>

              <div className="booking-amount">
                <div className="booking-amount-label">Booking Amount (25%)</div>
                <div className="booking-amount-val">KSH {bookingPrice.toFixed(2)}</div>
                <div className="booking-amount-sub">Remaining balance paid on collection</div>
              </div>

              <div className="trust-row">
                <Shield size={13} color="#2D9C5A" />
                <span>Secure 256-bit SSL encryption</span>
              </div>
              <div className="trust-row">
                <CheckCircle size={13} color="#2D9C5A" />
                <span>Verified by Roditec</span>
              </div>
            </div>
          </div>
        ) : (
          /* ── SUCCESS ── */
          <div style={{ maxWidth: 520, margin: '0 auto' }}>
            <div className="success-wrap">
              <div className="success-check">
                <CheckCircle size={36} color="#2D9C5A" />
              </div>
              <h2 className="success-title">Booking Confirmed!</h2>
              <p className="success-sub">Thank you for your booking. Our team will be in touch with you shortly to confirm the details.</p>
              <div className="success-amount">KSH {bookingPrice.toFixed(2)}</div>
              <div className="success-amount-label">Payment successfully processed</div>
              <p style={{ fontSize: 13, color: '#8888A8', lineHeight: 1.6, marginBottom: 28 }}>
                A confirmation email has been sent to your provided email address. Please keep your booking reference safe.
              </p>
              <button className="btn-go-home" onClick={() => navigate('/')}>
                Back to Home
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}