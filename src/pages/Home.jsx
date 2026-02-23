import { useState, useRef, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { hotels } from '../data/hotels'
import { useLanguage } from '../context/LanguageContext'
import DatePicker from '../components/DatePicker'
import './Home.css'

const FEATURE_ICONS = ['✦', '🔒', '🌍', '♾️']

export default function Home() {
  const navigate = useNavigate()
  const { t } = useLanguage()
  const [searchQuery, setSearchQuery] = useState('')
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState(2)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const destRef = useRef(null)

  // Build suggestion list from hotel names + locations
  const ALL_SUGGESTIONS = [
    ...hotels.map(h => h.location),
    ...hotels.map(h => h.name),
  ]
  const suggestions = searchQuery.trim().length > 0
    ? ALL_SUGGESTIONS.filter(s =>
        s.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 6)
    : []

  // Close suggestions on outside click
  useEffect(() => {
    const handler = (e) => {
      if (destRef.current && !destRef.current.contains(e.target)) setShowSuggestions(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    setShowSuggestions(false)
    navigate(`/hotels?q=${encodeURIComponent(searchQuery)}`)
  }

  const today = new Date().toISOString().split('T')[0]
  const features = t('home', 'features')
  const testimonials = t('home', 'testimonials')
  const stats = t('home', 'stats')

  return (
    <div className="home">
      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero__bg">
          <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600&q=80" alt="Beira Mar Hotéis" />
          <div className="hero__overlay" />
        </div>
        <div className="container hero__content">
          <p className="section-subtitle">{t('home', 'badge')}</p>
          <h1 className="hero__title">{t('home', 'hero_title').split('\n').map((line, i) => i === 0 ? <span key={i}>{line}<br /></span> : line)}</h1>
          <p className="hero__sub">{t('home', 'hero_sub')}</p>

          {/* Search Box */}
          <form className="search-box" onSubmit={handleSearch}>
            <div className="search-field search-field--dest" ref={destRef}>
              <label>{t('home', 'destination')}</label>
              <input
                type="text" placeholder={t('home', 'destination_placeholder')}
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setShowSuggestions(true) }}
                onFocus={() => setShowSuggestions(true)}
                autoComplete="off"
              />
              {showSuggestions && suggestions.length > 0 && (
                <ul className="dest-suggestions">
                  {suggestions.map((s, i) => (
                    <li key={i} onMouseDown={() => { setSearchQuery(s); setShowSuggestions(false) }}>
                      <span className="dest-suggestions__icon">📍</span> {s}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="search-field">
              <DatePicker
                label={t('home', 'checkin')}
                value={checkIn}
                onChange={setCheckIn}
                minDate={today}
                placeholder={t('home', 'checkin')}
                rangeStart={checkIn}
                rangeEnd={checkOut}
              />
            </div>
            <div className="search-field">
              <DatePicker
                label={t('home', 'checkout')}
                value={checkOut}
                onChange={setCheckOut}
                minDate={checkIn || today}
                placeholder={t('home', 'checkout')}
                rangeStart={checkIn}
                rangeEnd={checkOut}
              />
            </div>
            <div className="search-field search-field--sm">
              <label>{t('home', 'guests')}</label>
              <select value={guests} onChange={(e) => setGuests(e.target.value)}>
                {[1,2,3,4,5,6,8,10].map(n => <option key={n} value={n}>{n} {n === 1 ? t('home', 'guest') : t('home', 'guests')}</option>)}
              </select>
            </div>
            <button type="submit" className="btn btn-primary search-btn">{t('home', 'search')}</button>
          </form>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="section features-section">
        <div className="container">
          <div className="grid-4">
            {features.map((f, i) => (
              <div key={i} className="feature-card">
                <div className="feature-card__icon">{FEATURE_ICONS[i]}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED HOTELS ── */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <p className="section-subtitle">{t('home', 'featured_badge')}</p>
          <div className="section-header-row">
            <h2 className="section-title">{t('home', 'featured_title')}</h2>
            <Link to="/hotels" className="btn btn-outline btn-sm">{t('home', 'view_all')}</Link>
          </div>
          <div className="home-hotels-grid">
            {hotels.slice(0, 3).map((hotel) => (
              <Link to={`/hotels/${hotel.id}`} key={hotel.id} className="hotel-card card">
                <div className="hotel-card__img">
                  <img src={hotel.image} alt={hotel.name} loading="lazy" />
                  <div className="hotel-card__badge">{t('home', 'from')} ${hotel.priceFrom}{t('home', 'night')}</div>
                </div>
                <div className="hotel-card__body">
                  <div className="hotel-card__location">{hotel.location}</div>
                  <h3 className="hotel-card__name">{hotel.name}</h3>
                  <p className="hotel-card__desc">{hotel.description.substring(0, 100)}…</p>
                  <div className="hotel-card__footer">
                    <div className="hotel-card__rating">
                      <span className="stars">{'★'.repeat(Math.round(hotel.rating))}</span>
                      <span>{hotel.rating} ({hotel.reviewCount.toLocaleString()})</span>
                    </div>
                    <span className="btn btn-outline btn-sm">{t('home', 'explore')}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="section stats-section">
        <div className="container">
          <div className="stats-grid">
            {stats.map(([n, l]) => (
              <div key={l} className="stat-item">
                <div className="stat-number">{n}</div>
                <div className="stat-label">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <p className="section-subtitle">{t('home', 'testimonials_badge')}</p>
          <h2 className="section-title" style={{ marginBottom: '48px' }}>{t('home', 'testimonials_title')}</h2>
          <div className="grid-3">
            {testimonials.map((item) => (
              <div key={item.name} className="testimonial-card">
                <div className="stars" style={{ marginBottom: '16px' }}>★★★★★</div>
                <p className="testimonial-text">"{item.text}"</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar">{item.name.charAt(0)}</div>
                  <div>
                    <div className="testimonial-name">{item.name}</div>
                    <div className="testimonial-location">{item.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="section cta-section">
        <div className="container">
          <div className="cta-box">
            <p className="section-subtitle">{t('home', 'cta_badge')}</p>
            <h2 className="section-title">{t('home', 'cta_title')}</h2>
            <p className="cta-sub">{t('home', 'cta_sub')}</p>
            <div className="cta-actions">
              <Link to="/register" className="btn btn-primary">{t('home', 'cta_register')}</Link>
              <Link to="/hotels" className="btn btn-outline">{t('home', 'cta_browse')}</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

