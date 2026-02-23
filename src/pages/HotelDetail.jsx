import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { hotels } from '../data/hotels'
import { useAuth } from '../context/AuthContext'
import { useBooking } from '../context/BookingContext'
import { useLanguage } from '../context/LanguageContext'
import DatePicker from '../components/DatePicker'
import './HotelDetail.css'

export default function HotelDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { createBooking } = useBooking()
  const { t } = useLanguage()

  const hotel = hotels.find((h) => h.id === Number(id))

  const [activeImg, setActiveImg] = useState(0)
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState(2)

  if (!hotel) {
    return (
      <div style={{ textAlign: 'center', padding: '120px 24px' }}>
        <h2>Hotel not found</h2>
        <Link to="/hotels" className="btn btn-primary" style={{ marginTop: '24px' }}>Back to Hotels</Link>
      </div>
    )
  }

  const allImages = [hotel.image, ...hotel.gallery]
  const today = new Date().toISOString().split('T')[0]

  const handleBook = (room) => {
    if (!user) { navigate('/login'); return }
    setSelectedRoom(room)
    window.scrollTo({ top: document.getElementById('booking-form')?.offsetTop - 100, behavior: 'smooth' })
  }

  const handleSubmitBooking = (e) => {
    e.preventDefault()
    if (!checkIn || !checkOut) { alert('Please select check-in and check-out dates.'); return }
    if (checkOut <= checkIn) { alert('Check-out must be after check-in.'); return }
    createBooking({ hotel, room: selectedRoom, checkIn, checkOut, guests, userId: user.id })
    navigate('/booking')
  }

  return (
    <div className="hotel-detail">
      {/* GALLERY */}
      <div className="detail-gallery">
        <div className="detail-gallery__main">
          <img src={allImages[activeImg]} alt={hotel.name} />
        </div>
        <div className="detail-gallery__thumbs">
          {allImages.map((img, i) => (
            <button key={i} className={`thumb-btn ${activeImg === i ? 'thumb-btn--active' : ''}`} onClick={() => setActiveImg(i)}>
              <img src={img} alt={`View ${i + 1}`} />
            </button>
          ))}
        </div>
      </div>

      <div className="container detail-body">
        {/* LEFT COLUMN */}
        <div className="detail-main">
          {/* HEADER */}
          <div className="detail-header">
            <p className="section-subtitle">{hotel.location}</p>
            <h1 className="detail-title">{hotel.name}</h1>
            <div className="detail-meta">
              <div className="detail-rating">
                <span className="stars">{'★'.repeat(Math.round(hotel.rating))}</span>
                <span className="detail-rating-value">{hotel.rating}</span>
                <span className="text-muted">({hotel.reviewCount.toLocaleString()} {t('hotels', 'reviews')})</span>
              </div>
            </div>
          </div>

          <hr className="divider" />

          {/* DESCRIPTION */}
          <p className="detail-desc">{hotel.description}</p>

          {/* AMENITIES */}
          <div className="detail-section">
            <h3 className="detail-section-title">{t('detail', 'amenities')}</h3>
            <div className="amenities-grid">
              {hotel.amenities.map((a) => (
                <div key={a} className="amenity-item">
                  <span className="amenity-check">✓</span> {a}
                </div>
              ))}
            </div>
          </div>

          <hr className="divider" />

          {/* ROOMS */}
          <div className="detail-section" id="rooms">
            <h3 className="detail-section-title">{t('detail', 'available_rooms')}</h3>
            <div className="rooms-list">
              {hotel.rooms.map((room) => (
                <div key={room.id} className={`room-card ${!room.available ? 'room-card--unavailable' : ''}`}>
                  <div className="room-card__img">
                    <img src={room.image} alt={room.name} loading="lazy" />
                    {!room.available && <div className="room-card__sold-out">{t('detail', 'sold_out')}</div>}
                  </div>
                  <div className="room-card__body">
                    <div className="room-card__header">
                      <h4 className="room-card__name">{room.name}</h4>
                      <div className="room-card__price">
                        <span className="room-card__price-value">${room.price}</span>
                        <span className="text-muted" style={{ fontSize: '0.8rem' }}>{t('detail', 'night')}</span>
                      </div>
                    </div>
                    <p className="room-card__desc">{room.description}</p>
                    <div className="room-card__meta">
                      <span className="badge badge-dark">📐 {room.size}</span>
                      <span className="badge badge-dark">👤 {t('detail', 'up_to')} {room.capacity} {t('detail', 'guests')}</span>
                    </div>
                    <div className="room-card__amenities">
                      {room.amenities.map((a) => <span key={a} className="tag">{a}</span>)}
                    </div>
                    {room.available ? (
                      <button
                        className={`btn btn-primary btn-sm ${selectedRoom?.id === room.id ? 'room-selected-btn' : ''}`}
                        onClick={() => handleBook(room)}
                      >
                        {selectedRoom?.id === room.id ? t('detail', 'selected') : t('detail', 'select_room')}
                      </button>
                    ) : (
                      <button className="btn btn-dark btn-sm" disabled>{t('detail', 'unavailable')}</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR: BOOKING FORM */}
        <aside className="detail-sidebar">
          <div className="booking-widget" id="booking-form">
            <h3 className="booking-widget__title">
              {t('detail', 'book_title')(selectedRoom?.name)}
            </h3>
            {selectedRoom && (
              <div className="booking-widget__price">
                <span className="text-gold" style={{ fontSize: '1.8rem', fontFamily: 'Playfair Display, serif', fontWeight: 700 }}>
                  ${selectedRoom.price}
                </span>
                <span className="text-muted">{t('detail', 'night')}</span>
              </div>
            )}
            <form onSubmit={handleSubmitBooking}>
              <div className="form-group">
                <DatePicker
                  label={t('detail', 'checkin')}
                  value={checkIn}
                  onChange={setCheckIn}
                  minDate={today}
                  placeholder={t('detail', 'checkin')}
                  rangeStart={checkIn}
                  rangeEnd={checkOut}
                />
              </div>
              <div className="form-group">
                <DatePicker
                  label={t('detail', 'checkout')}
                  value={checkOut}
                  onChange={setCheckOut}
                  minDate={checkIn || today}
                  placeholder={t('detail', 'checkout')}
                  rangeStart={checkIn}
                  rangeEnd={checkOut}
                />
              </div>
              <div className="form-group">
                <label className="form-label">{t('detail', 'guests_label')}</label>
                <select className="form-input" value={guests} onChange={(e) => setGuests(e.target.value)}>
                  {[1,2,3,4,5,6,8,10].map(n => <option key={n} value={n}>{n} {n === 1 ? t('detail', 'guest') : t('detail', 'guests_label')}</option>)}
                </select>
              </div>
              {checkIn && checkOut && checkOut > checkIn && selectedRoom && (
                <div className="booking-widget__summary">
                  {(() => {
                    const nights = Math.round((new Date(checkOut) - new Date(checkIn)) / 86400000)
                    return (
                      <>
                        <div className="summary-row"><span>${selectedRoom.price} × {nights} {t('detail', 'nights_label')}</span><span>${(selectedRoom.price * nights).toLocaleString()}</span></div>
                        <div className="summary-row summary-row--total"><span>{t('detail', 'total_label')}</span><span className="text-gold">${(selectedRoom.price * nights).toLocaleString()}</span></div>
                      </>
                    )
                  })()}
                </div>
              )}
              <button type="submit" className="btn btn-primary btn-full" disabled={!selectedRoom}>
                {selectedRoom ? t('detail', 'continue') : t('detail', 'select_first')}
              </button>
            </form>
            {!user && (
              <p className="booking-widget__login-hint">
                <Link to="/login" className="text-gold">{t('detail', 'sign_in')}</Link> {t('detail', 'sign_in_hint')}
              </p>
            )}
          </div>
        </aside>
      </div>
    </div>
  )
}
