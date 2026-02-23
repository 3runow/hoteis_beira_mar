import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useBooking } from '../context/BookingContext'
import { useLanguage } from '../context/LanguageContext'
import './Payment.css'

export default function Payment() {
  const navigate = useNavigate()
  const { pendingBooking, confirmBooking } = useBooking()
  const { t } = useLanguage()

  const [method, setMethod] = useState('card')
  const [form, setForm] = useState({ cardName: '', cardNumber: '', expiry: '', cvv: '' })
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(null)

  if (!pendingBooking && !done) { navigate('/hotels'); return null }

  const total = pendingBooking ? Math.round(pendingBooking.totalPrice * 1.1) : 0
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const formatCard = (v) => v.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19)
  const formatExpiry = (v) => v.replace(/\D/g, '').replace(/^(\d{2})(\d)/, '$1/$2').slice(0, 5)

  const PAYMENT_METHODS = [
    { id: 'card', label: t('payment', 'card'), icon: '💳' },
    { id: 'paypal', label: t('payment', 'paypal'), icon: '🅿' },
    { id: 'bank', label: t('payment', 'bank'), icon: '🏦' },
  ]

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault()
    setLoading(true)
    await new Promise((r) => setTimeout(r, 2000))
    const confirmed = confirmBooking({ method, last4: form.cardNumber.slice(-4) || '****' })
    setDone(confirmed)
    setLoading(false)
  }

  if (done) {
    return (
      <div className="payment-success">
        <div className="payment-success__card">
          <div className="payment-success__icon">✓</div>
          <h2>{t('payment', 'success_title')}</h2>
          <p>{t('payment', 'success_sub')}</p>
          <div className="payment-success__ref">
            {t('payment', 'success_ref')} <strong className="text-gold">{done.id}</strong>
          </div>
          <div className="payment-success__details">
            <div className="success-row"><span>{t('payment', 'hotel')}</span><span>{done.hotelName}</span></div>
            <div className="success-row"><span>{t('payment', 'room')}</span><span>{done.roomName}</span></div>
            <div className="success-row"><span>{t('payment', 'check_in')}</span><span>{new Date(done.checkIn).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span></div>
            <div className="success-row"><span>{t('payment', 'check_out')}</span><span>{new Date(done.checkOut).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span></div>
            <div className="success-row success-row--total"><span>{t('payment', 'total_paid')}</span><span className="text-gold">${Math.round(done.totalPrice * 1.1).toLocaleString()}</span></div>
          </div>
          <button className="btn btn-primary btn-full" onClick={() => navigate('/dashboard')}>
            {t('payment', 'view_bookings')}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="payment-page">
      <div className="page-hero" style={{ paddingTop: '70px' }}>
        <div className="container" style={{ padding: '60px 24px 40px' }}>
          <p className="section-subtitle">{t('payment', 'step')}</p>
          <h1 className="section-title">{t('payment', 'title')}</h1>
        </div>
      </div>

      <div className="container payment-layout">
        {/* FORM */}
        <div className="payment-form-col">
          {/* Method Selection */}
          <div className="payment-methods">
            {PAYMENT_METHODS.map((m) => (
              <button
                key={m.id}
                className={`method-btn ${method === m.id ? 'method-btn--active' : ''}`}
                onClick={() => setMethod(m.id)}
                type="button"
              >
                <span className="method-btn__icon">{m.icon}</span>
                <span>{m.label}</span>
              </button>
            ))}
          </div>

          {method === 'card' && (
            <form className="payment-card-form" onSubmit={handleSubmit}>
              <div className="credit-card-preview">
                <div className="cc-chip">▐▌</div>
                <div className="cc-number">{form.cardNumber || '•••• •••• •••• ••••'}</div>
                <div className="cc-row">
                  <div><div className="cc-label">Cardholder</div><div>{form.cardName || 'YOUR NAME'}</div></div>
                  <div><div className="cc-label">Expires</div><div>{form.expiry || 'MM/YY'}</div></div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">{t('payment', 'card_name')}</label>
                <input className="form-input" name="cardName" placeholder={t('payment', 'card_name_placeholder')} value={form.cardName} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">{t('payment', 'card_number')}</label>
                <input className="form-input" name="cardNumber" placeholder="0000 0000 0000 0000"
                  value={form.cardNumber}
                  onChange={(e) => setForm({ ...form, cardNumber: formatCard(e.target.value) })}
                  required maxLength={19} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">{t('payment', 'expiry')}</label>
                  <input className="form-input" name="expiry" placeholder="MM/YY"
                    value={form.expiry}
                    onChange={(e) => setForm({ ...form, expiry: formatExpiry(e.target.value) })}
                    required maxLength={5} />
                </div>
                <div className="form-group">
                  <label className="form-label">{t('payment', 'cvv')}</label>
                  <input className="form-input" name="cvv" placeholder="•••" type="password"
                    value={form.cvv}
                    onChange={(e) => setForm({ ...form, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                    required maxLength={4} />
                </div>
              </div>

              <div className="payment-secure-note">
                {t('payment', 'secure_note')}
              </div>

              <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center' }}>
                    <span className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} />
                    {t('payment', 'processing')}
                  </span>
                ) : (
                  t('payment', 'pay')(total.toLocaleString())
                )}
              </button>
            </form>
          )}

          {method !== 'card' && (
            <div className="payment-alt-method">
              <p>{t('payment', 'alt_selected')} <strong>{PAYMENT_METHODS.find(m => m.id === method)?.label}</strong>.</p>
              <p className="text-muted" style={{ fontSize: '0.88rem', marginTop: 8 }}>
                {t('payment', 'alt_hint')}
              </p>
              <button className="btn btn-primary btn-full" style={{ marginTop: '24px' }} onClick={handleSubmit} disabled={loading}>
                {loading ? t('payment', 'processing') : t('payment', 'simulate')(total.toLocaleString())}
              </button>
            </div>
          )}
        </div>

        {/* ORDER SUMMARY */}
        <aside className="payment-summary">
          <h3 className="booking-section-title" style={{ color: 'var(--gold)', fontFamily: 'Playfair Display, serif', marginBottom: 20 }}>{t('payment', 'order_summary')}</h3>
          {pendingBooking && (
            <>
              <img src={pendingBooking.roomImage} alt="" style={{ width: '100%', borderRadius: 12, marginBottom: 16, aspectRatio: '16/9', objectFit: 'cover' }} />
              <div style={{ fontSize: '0.82rem', color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 6 }}>{pendingBooking.hotelLocation}</div>
              <div style={{ fontSize: '1.1rem', fontFamily: 'Playfair Display, serif', marginBottom: 4 }}>{pendingBooking.hotelName}</div>
              <div style={{ color: '#888', fontSize: '0.88rem', marginBottom: 20 }}>{pendingBooking.roomName}</div>
              <hr style={{ border: 'none', borderTop: '1px solid #222', marginBottom: 16 }} />
              <div className="summary-row"><span>{t('payment', 'room_nights')(pendingBooking.nights)}</span><span>${pendingBooking.totalPrice.toLocaleString()}</span></div>
              <div className="summary-row"><span>{t('payment', 'taxes')}</span><span>${Math.round(pendingBooking.totalPrice * 0.1).toLocaleString()}</span></div>
              <hr style={{ border: 'none', borderTop: '1px solid #222', margin: '16px 0' }} />
              <div className="summary-row" style={{ fontWeight: 700, fontSize: '1.1rem', color: 'white' }}>
                <span>{t('payment', 'total')}</span><span className="text-gold">${total.toLocaleString()}</span>
              </div>
            </>
          )}
        </aside>
      </div>
    </div>
  )
}

