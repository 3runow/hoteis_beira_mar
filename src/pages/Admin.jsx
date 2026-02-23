import { useState } from 'react'
import { useBooking } from '../context/BookingContext'
import { useLanguage } from '../context/LanguageContext'
import { hotels } from '../data/hotels'
import './Admin.css'

const STATUS_COLORS = {
  confirmed: 'badge-success',
  pending: 'badge-gold',
  cancelled: 'badge-error',
}

export default function Admin() {
  const { getAllBookings, cancelBooking } = useBooking()
  const { t } = useLanguage()
  const TABS = t('admin', 'tabs')
  const [tabIndex, setTabIndex] = useState(0)
  const [bookings, setBookings] = useState(getAllBookings)
  const [bookingFilter, setBookingFilter] = useState('all')

  const refresh = () => setBookings(getAllBookings())
  const handleCancel = (id) => { cancelBooking(id); refresh() }

  const users = JSON.parse(localStorage.getItem('luxe_users') || '[]')

  const revenue = bookings.filter(b => b.status === 'confirmed').reduce((s, b) => s + Math.round(b.totalPrice * 1.1), 0)
  const confirmed = bookings.filter(b => b.status === 'confirmed').length
  const cancelled = bookings.filter(b => b.status === 'cancelled').length

  const filteredBookings = bookingFilter === 'all' ? bookings : bookings.filter(b => b.status === bookingFilter)

  const formatDate = (d) => new Date(d).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })

  const FILTER_LABELS = {
    all: t('dashboard', 'filter_all'),
    confirmed: t('dashboard', 'filter_confirmed'),
    pending: t('dashboard', 'filter_pending'),
    cancelled: t('dashboard', 'filter_cancelled'),
  }

  return (
    <div className="admin-page">
      <div className="page-hero" style={{ paddingTop: '70px' }}>
        <div className="container" style={{ padding: '60px 24px 40px' }}>
          <p className="section-subtitle">{t('admin', 'badge')}</p>
          <h1 className="section-title">{t('admin', 'title')}</h1>
        </div>
      </div>

      <div className="container admin-body">
        {/* TABS */}
        <div className="admin-tabs">
          {TABS.map((tabLabel, i) => (
            <button key={i} className={`admin-tab ${tabIndex === i ? 'admin-tab--active' : ''}`} onClick={() => setTabIndex(i)}>{tabLabel}</button>
          ))}
        </div>

        {/* OVERVIEW */}
        {tabIndex === 0 && (
          <div>
            <div className="admin-stats">
              {[
                { label: t('admin', 'total_bookings'), value: bookings.length, icon: '📋' },
                { label: t('admin', 'confirmed'), value: confirmed, icon: '✓' },
                { label: t('admin', 'cancelled'), value: cancelled, icon: '✕' },
                { label: t('admin', 'revenue'), value: `$${revenue.toLocaleString()}`, icon: '💰' },
                { label: t('admin', 'hotels'), value: hotels.length, icon: '🏨' },
                { label: t('admin', 'registered_users'), value: users.length, icon: '👤' },
              ].map((s) => (
                <div key={s.label} className="admin-stat">
                  <div className="admin-stat__icon">{s.icon}</div>
                  <div className="admin-stat__value">{s.value}</div>
                  <div className="admin-stat__label">{s.label}</div>
                </div>
              ))}
            </div>

            <h3 className="admin-section-title">{t('admin', 'recent')}</h3>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>{t('admin', 'ref')}</th><th>{t('admin', 'hotel')}</th><th>{t('admin', 'room')}</th>
                    <th>{t('admin', 'dates')}</th><th>{t('admin', 'total')}</th><th>{t('admin', 'status')}</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.slice(0, 5).map((b) => (
                    <tr key={b.id}>
                      <td className="text-gold" style={{ fontSize: '0.78rem' }}>{b.id}</td>
                      <td>{b.hotelName}</td>
                      <td style={{ color: '#888', fontSize: '0.85rem' }}>{b.roomName}</td>
                      <td style={{ fontSize: '0.85rem' }}>{formatDate(b.checkIn)} → {formatDate(b.checkOut)}</td>
                      <td className="text-gold" style={{ fontWeight: 700 }}>${Math.round(b.totalPrice * 1.1).toLocaleString()}</td>
                      <td><span className={`badge ${STATUS_COLORS[b.status]}`}>{b.status}</span></td>
                    </tr>
                  ))}
                  {bookings.length === 0 && (
                    <tr><td colSpan={6} style={{ textAlign: 'center', color: '#555', padding: '32px' }}>{t('admin', 'no_bookings')}</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* BOOKINGS */}
        {tabIndex === 1 && (
          <div>
            <div className="admin-filter-row">
              <h3 className="admin-section-title" style={{ margin: 0 }}>{t('admin', 'all_bookings')(bookings.length)}</h3>
              <div className="filter-tabs">
                {['all', 'confirmed', 'pending', 'cancelled'].map((s) => (
                  <button key={s} className={`filter-tab ${bookingFilter === s ? 'filter-tab--active' : ''}`} onClick={() => setBookingFilter(s)}>
                    {FILTER_LABELS[s]}
                  </button>
                ))}
              </div>
            </div>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>{t('admin', 'ref')}</th><th>{t('admin', 'user_id')}</th><th>{t('admin', 'hotel')}</th>
                    <th>{t('admin', 'room')}</th><th>{t('admin', 'dates')}</th><th>{t('admin', 'guests')}</th>
                    <th>{t('admin', 'total')}</th><th>{t('admin', 'status')}</th><th>{t('admin', 'actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map((b) => (
                    <tr key={b.id}>
                      <td className="text-gold" style={{ fontSize: '0.75rem' }}>{b.id}</td>
                      <td style={{ fontSize: '0.82rem', color: '#888' }}>{b.userId}</td>
                      <td style={{ fontSize: '0.88rem' }}>{b.hotelName}</td>
                      <td style={{ fontSize: '0.82rem', color: '#888' }}>{b.roomName}</td>
                      <td style={{ fontSize: '0.78rem' }}>{formatDate(b.checkIn)} → {formatDate(b.checkOut)}</td>
                      <td style={{ textAlign: 'center' }}>{b.guests}</td>
                      <td className="text-gold" style={{ fontWeight: 700 }}>${Math.round(b.totalPrice * 1.1).toLocaleString()}</td>
                      <td><span className={`badge ${STATUS_COLORS[b.status]}`}>{b.status}</span></td>
                      <td>
                        {b.status !== 'cancelled' && (
                          <button className="btn btn-danger btn-sm" onClick={() => handleCancel(b.id)}>{t('admin', 'cancel')}</button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {filteredBookings.length === 0 && (
                    <tr><td colSpan={9} style={{ textAlign: 'center', color: '#555', padding: '32px' }}>{t('admin', 'no_bookings')}</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* HOTELS */}
        {tabIndex === 2 && (
          <div>
            <h3 className="admin-section-title">{t('admin', 'hotels_rooms')}</h3>
            <div className="admin-hotels-grid">
              {hotels.map((h) => (
                <div key={h.id} className="admin-hotel-card">
                  <div className="admin-hotel-card__img">
                    <img src={h.image} alt={h.name} />
                  </div>
                  <div className="admin-hotel-card__body">
                    <p style={{ fontSize: '0.72rem', color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 4 }}>{h.location}</p>
                    <h4 style={{ fontFamily: 'Playfair Display, serif', marginBottom: 8 }}>{h.name}</h4>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: 12 }}>
                      <span className="badge badge-dark">⭐ {h.rating}</span>
                      <span className="badge badge-dark">{h.rooms.length} {t('admin', 'rooms_label')}</span>
                      <span className="badge badge-dark">From ${h.priceFrom}/night</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {h.rooms.map((r) => (
                        <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: '#888', padding: '6px 0', borderBottom: '1px solid #1e1e1e' }}>
                          <span>{r.name}</span>
                          <div style={{ display: 'flex', gap: 8 }}>
                            <span className="text-gold">${r.price}/night</span>
                            <span className={r.available ? 'badge badge-success' : 'badge badge-error'} style={{ fontSize: '0.7rem' }}>
                              {r.available ? t('admin', 'available') : t('admin', 'sold_out')}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* USERS */}
        {tabIndex === 3 && (
          <div>
            <h3 className="admin-section-title">{t('admin', 'users_title')(users.length)}</h3>
            {users.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px', color: '#555' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: 16 }}>👤</div>
                <p>{t('admin', 'no_users')}</p>
              </div>
            ) : (
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr><th>{t('admin', 'id')}</th><th>{t('admin', 'name')}</th><th>{t('admin', 'email')}</th><th>{t('admin', 'bookings')}</th></tr>
                  </thead>
                  <tbody>
                    {users.map((u) => {
                      const userBookings = bookings.filter(b => b.userId === u.id)
                      return (
                        <tr key={u.id}>
                          <td style={{ fontSize: '0.78rem', color: '#666' }}>{u.id}</td>
                          <td>{u.name}</td>
                          <td style={{ color: '#888', fontSize: '0.88rem' }}>{u.email}</td>
                          <td><span className="badge badge-dark">{userBookings.length}</span></td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
