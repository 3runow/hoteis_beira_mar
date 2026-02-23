import { useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useBooking } from '../context/BookingContext'
import { useLanguage } from '../context/LanguageContext'
import './Booking.css'

export default function Booking() {
  const navigate = useNavigate()
  const { pendingBooking } = useBooking()
  const { t } = useLanguage()

  useEffect(() => {
    if (!pendingBooking) navigate('/hotels')
  }, [pendingBooking, navigate])

  if (!pendingBooking) return null

  const b = pendingBooking

  const formatDate = (d) => new Date(d).toLocaleDateString(undefined, { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' })

  return (
    <div className="booking-page">
      <div className="page-hero" style={{ paddingTop: '70px' }}>
        <div className="container" style={{ padding: '60px 24px 40px' }}>
          <p className="section-subtitle">{t('booking', 'step')}</p>
          <h1 className="section-title">{t('booking', 'title')}</h1>
        </div>
      </div>

      <div className="container booking-layout">
        {/* LEFT: BOOKING DETAILS */}
        <div className="booking-details">
          {/* Hotel */}
          <div className="booking-section-card">
            <h3 className="booking-section-title">{t('booking', 'your_stay')}</h3>
            <div className="booking-hotel-preview">
              <img src={b.hotelImage} alt={b.hotelName} />
              <div>
                <p className="booking-hotel-location">{b.hotelLocation}</p>
                <h4 className="booking-hotel-name">{b.hotelName}</h4>
                <p className="booking-room-name">{b.roomName}</p>
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className="booking-section-card">
            <h3 className="booking-section-title">{t('booking', 'dates_guests')}</h3>
            <div className="booking-dates-grid">
              <div className="booking-date-item">
                <span className="booking-date-label">{t('booking', 'check_in')}</span>
                <span className="booking-date-value">{formatDate(b.checkIn)}</span>
              </div>
              <div className="booking-date-arrow">→</div>
              <div className="booking-date-item">
                <span className="booking-date-label">{t('booking', 'check_out')}</span>
                <span className="booking-date-value">{formatDate(b.checkOut)}</span>
              </div>
            </div>
            <div className="booking-meta-row">
              <span className="badge badge-dark">🌙 {b.nights} {b.nights === 1 ? t('booking', 'night') : t('booking', 'nights')}</span>
              <span className="badge badge-dark">👤 {b.guests} {b.guests === 1 ? t('booking', 'guest') : t('booking', 'guests')}</span>
            </div>
          </div>

          {/* Policies */}
          <div className="booking-section-card">
            <h3 className="booking-section-title">{t('booking', 'policies')}</h3>
            <ul className="booking-policies">
              <li>{t('booking', 'policy1')}</li>
              <li>{t('booking', 'policy2')}</li>
              <li>{t('booking', 'policy3')}</li>
              <li>{t('booking', 'policy4')}</li>
            </ul>
          </div>
        </div>

        {/* RIGHT: PRICE SUMMARY */}
        <aside className="booking-summary-card">
          <h3 className="booking-section-title">{t('booking', 'price_summary')}</h3>
          <img src={b.roomImage} alt={b.roomName} className="booking-room-img" />

          <div className="price-breakdown">
            <div className="price-row">
              <span>${b.pricePerNight}/night × {b.nights} nights</span>
              <span>${(b.pricePerNight * b.nights).toLocaleString()}</span>
            </div>
            <div className="price-row">
              <span>{t('booking', 'taxes')}</span>
              <span>${Math.round(b.totalPrice * 0.1).toLocaleString()}</span>
            </div>
            <div className="price-row price-row--service">
              <span>{t('booking', 'service_fee')}</span>
              <span>$0</span>
            </div>
            <hr className="divider" style={{ margin: '16px 0' }} />
            <div className="price-row price-row--total">
              <span>{t('booking', 'total')}</span>
              <span className="text-gold">${Math.round(b.totalPrice * 1.1).toLocaleString()}</span>
            </div>
          </div>

          <button className="btn btn-primary btn-full" onClick={() => navigate('/payment')}>
            {t('booking', 'proceed')}
          </button>
          <Link to={`/hotels/${b.hotelId}`} className="btn btn-dark btn-full btn-sm" style={{ marginTop: '10px' }}>
            {t('booking', 'change_room')}
          </Link>
        </aside>
      </div>
    </div>
  )
}

