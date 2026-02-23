import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useBooking } from '../context/BookingContext'
import { useLanguage } from '../context/LanguageContext'
import './Dashboard.css'

const STATUS_COLORS = {
  confirmed: 'badge-success',
  pending: 'badge-gold',
  cancelled: 'badge-error',
}

export default function Dashboard() {
  const { user, logout } = useAuth()
  const { getUserBookings, cancelBooking } = useBooking()
  const { t } = useLanguage()
  const navigate = useNavigate()

  const [bookings, setBookings] = useState(() => getUserBookings(user.id))
  const [filter, setFilter] = useState('all')

  const filtered = filter === 'all' ? bookings : bookings.filter((b) => b.status === filter)

  const handleCancel = (id) => {
    if (!confirm(t('dashboard', 'cancel_confirm'))) return
    cancelBooking(id)
    setBookings(getUserBookings(user.id))
  }

  const handleLogout = () => { logout(); navigate('/') }

  const formatDate = (d) => new Date(d).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })

  const stats = {
    total: bookings.length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    spent: bookings.filter(b => b.status === 'confirmed').reduce((s, b) => s + Math.round(b.totalPrice * 1.1), 0),
  }

  const FILTER_LABELS = {
    all: t('dashboard', 'filter_all'),
    confirmed: t('dashboard', 'filter_confirmed'),
    pending: t('dashboard', 'filter_pending'),
    cancelled: t('dashboard', 'filter_cancelled'),
  }

  return (
    <div className="dashboard-page">
      <div className="page-hero" style={{ paddingTop: '70px' }}>
        <div className="container dashboard-hero">
          <div>
            <p className="section-subtitle">{t('dashboard', 'badge')}</p>
            <h1 className="section-title">{t('dashboard', 'welcome')(user.name.split(' ')[0])}</h1>
          </div>
          <button className="btn btn-dark btn-sm" onClick={handleLogout}>{t('dashboard', 'logout')}</button>
        </div>
      </div>

      <div className="container dashboard-body">
        {/* STATS */}
        <div className="dashboard-stats">
          <div className="dash-stat">
            <div className="dash-stat__value">{stats.total}</div>
            <div className="dash-stat__label">{t('dashboard', 'total_bookings')}</div>
          </div>
          <div className="dash-stat">
            <div className="dash-stat__value">{stats.confirmed}</div>
            <div className="dash-stat__label">{t('dashboard', 'confirmed')}</div>
          </div>
          <div className="dash-stat">
            <div className="dash-stat__value">${stats.spent.toLocaleString()}</div>
            <div className="dash-stat__label">{t('dashboard', 'total_spent')}</div>
          </div>
          <div className="dash-stat">
            <div className="dash-stat__value">{user.email.split('@')[0]}</div>
            <div className="dash-stat__label">{t('dashboard', 'account')}</div>
          </div>
        </div>

        {/* BOOKINGS */}
        <div className="dashboard-bookings">
          <div className="dashboard-bookings__header">
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.4rem' }}>{t('dashboard', 'my_reservations')}</h2>
            <div className="filter-tabs">
              {['all', 'confirmed', 'pending', 'cancelled'].map((s) => (
                <button key={s} className={`filter-tab ${filter === s ? 'filter-tab--active' : ''}`} onClick={() => setFilter(s)}>
                  {FILTER_LABELS[s]}
                </button>
              ))}
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="dashboard-empty">
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🛎</div>
              <h3>{t('dashboard', 'empty_title')}</h3>
              <p>{t('dashboard', 'empty_sub')}</p>
              <Link to="/hotels" className="btn btn-primary" style={{ marginTop: '24px' }}>{t('dashboard', 'browse')}</Link>
            </div>
          ) : (
            <div className="bookings-list">
              {filtered.map((b) => (
                <div key={b.id} className={`booking-item ${b.status === 'cancelled' ? 'booking-item--cancelled' : ''}`}>
                  <div className="booking-item__img">
                    <img src={b.roomImage} alt={b.roomName} />
                  </div>
                  <div className="booking-item__info">
                    <div className="booking-item__header">
                      <div>
                        <p className="booking-item__location">{b.hotelLocation}</p>
                        <h4 className="booking-item__hotel">{b.hotelName}</h4>
                        <p className="booking-item__room">{b.roomName}</p>
                      </div>
                      <span className={`badge ${STATUS_COLORS[b.status]}`}>
                        {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                      </span>
                    </div>
                    <div className="booking-item__dates">
                      <div className="booking-date-chip">
                        <span className="booking-date-chip__label">{t('dashboard', 'check_in')}</span>
                        <span>{formatDate(b.checkIn)}</span>
                      </div>
                      <span className="booking-date-sep">→</span>
                      <div className="booking-date-chip">
                        <span className="booking-date-chip__label">{t('dashboard', 'check_out')}</span>
                        <span>{formatDate(b.checkOut)}</span>
                      </div>
                      <div className="booking-date-chip">
                        <span className="booking-date-chip__label">{t('dashboard', 'nights')}</span>
                        <span>{b.nights}</span>
                      </div>
                      <div className="booking-date-chip">
                        <span className="booking-date-chip__label">{t('dashboard', 'guests')}</span>
                        <span>{b.guests}</span>
                      </div>
                    </div>
                    <div className="booking-item__footer">
                      <div>
                        <span className="booking-item__ref">{t('dashboard', 'ref')} {b.id}</span>
                        <span className="booking-item__total text-gold">${Math.round(b.totalPrice * 1.1).toLocaleString()}</span>
                      </div>
                      <div className="booking-item__actions">
                        <Link to={`/hotels/${b.hotelId}`} className="btn btn-dark btn-sm">{t('dashboard', 'view_hotel')}</Link>
                        {b.status !== 'cancelled' && (
                          <button className="btn btn-danger btn-sm" onClick={() => handleCancel(b.id)}>{t('dashboard', 'cancel')}</button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

