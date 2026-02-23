import { useState, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { hotels } from '../data/hotels'
import { useLanguage } from '../context/LanguageContext'
import './Hotels.css'

const LOCATIONS = ['All', 'Paris, France', 'Maldives', 'Swiss Alps, Switzerland', 'New York, USA']

export default function Hotels() {
  const [searchParams] = useSearchParams()
  const { t } = useLanguage()
  const initialQ = searchParams.get('q') || ''

  const [query, setQuery] = useState(initialQ)
  const [location, setLocation] = useState('All')
  const [maxPrice, setMaxPrice] = useState(10000)
  const [minRating, setMinRating] = useState(0)
  const [sortBy, setSortBy] = useState('rating')

  const filtered = useMemo(() => {
    let list = hotels.filter((h) => {
      const matchQ = query === '' || h.name.toLowerCase().includes(query.toLowerCase()) || h.location.toLowerCase().includes(query.toLowerCase())
      const matchLoc = location === 'All' || h.location === location
      const matchPrice = h.priceFrom <= maxPrice
      const matchRating = h.rating >= minRating
      return matchQ && matchLoc && matchPrice && matchRating
    })
    if (sortBy === 'price-asc') list = [...list].sort((a, b) => a.priceFrom - b.priceFrom)
    else if (sortBy === 'price-desc') list = [...list].sort((a, b) => b.priceFrom - a.priceFrom)
    else if (sortBy === 'rating') list = [...list].sort((a, b) => b.rating - a.rating)
    else if (sortBy === 'reviews') list = [...list].sort((a, b) => b.reviewCount - a.reviewCount)
    return list
  }, [query, location, maxPrice, minRating, sortBy])

  return (
    <div className="hotels-page">
      <div className="page-hero" style={{ paddingTop: '70px' }}>
        <div className="container" style={{ padding: '60px 24px 40px' }}>
          <p className="section-subtitle">{t('hotels', 'badge')}</p>
          <h1 className="section-title">{t('hotels', 'title')}</h1>
          <p className="text-muted" style={{ marginTop: '8px' }}>
            {t('hotels', 'properties_found')(filtered.length)}
          </p>
        </div>
      </div>

      <div className="container hotels-layout">
        {/* SIDEBAR FILTERS */}
        <aside className="filters-panel">
          <h3>{t('hotels', 'filters')}</h3>

          <div className="filter-group">
            <label className="filter-label">{t('hotels', 'search')}</label>
            <input
              className="form-input"
              type="text"
              placeholder={t('hotels', 'search_placeholder')}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label className="filter-label">{t('hotels', 'location')}</label>
            <div className="filter-options">
              {LOCATIONS.map((loc) => (
                <button
                  key={loc}
                  className={`filter-chip ${location === loc ? 'filter-chip--active' : ''}`}
                  onClick={() => setLocation(loc)}
                >
                  {loc === 'All' ? t('hotels', 'all') : loc}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <label className="filter-label">
              {t('hotels', 'max_price')}: <span className="text-gold">${maxPrice.toLocaleString()}/night</span>
            </label>
            <input
              type="range" min="100" max="10000" step="50"
              value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="range-slider"
            />
          </div>

          <div className="filter-group">
            <label className="filter-label">{t('hotels', 'min_rating')}</label>
            <div className="filter-options">
              {[0, 4.5, 4.7, 4.9].map((r) => (
                <button
                  key={r}
                  className={`filter-chip ${minRating === r ? 'filter-chip--active' : ''}`}
                  onClick={() => setMinRating(r)}
                >
                  {r === 0 ? t('hotels', 'any') : `${r}+`}
                </button>
              ))}
            </div>
          </div>

          <button className="btn btn-dark btn-full btn-sm" onClick={() => { setQuery(''); setLocation('All'); setMaxPrice(10000); setMinRating(0) }}>
            {t('hotels', 'reset')}
          </button>
        </aside>

        {/* HOTEL CARDS */}
        <div className="hotels-results">
          <div className="hotels-results__header">
            <span className="text-muted" style={{ fontSize: '0.9rem' }}>{t('hotels', 'results')(filtered.length)}</span>
            <select className="form-input filter-sort" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="rating">{t('hotels', 'sort_rating')}</option>
              <option value="reviews">{t('hotels', 'sort_reviews')}</option>
              <option value="price-asc">{t('hotels', 'sort_price_asc')}</option>
              <option value="price-desc">{t('hotels', 'sort_price_desc')}</option>
            </select>
          </div>

          {filtered.length === 0 ? (
            <div className="hotels-empty">
              <div style={{ fontSize: '3rem' }}>🔍</div>
              <h3>{t('hotels', 'no_results')}</h3>
              <p>{t('hotels', 'no_results_sub')}</p>
            </div>
          ) : (
            <div className="hotels-list">
              {filtered.map((hotel) => (
                <Link to={`/hotels/${hotel.id}`} key={hotel.id} className="hotel-list-card card">
                  <div className="hotel-list-card__img">
                    <img src={hotel.image} alt={hotel.name} loading="lazy" />
                  </div>
                  <div className="hotel-list-card__body">
                    <div className="hotel-list-card__meta">
                      <span className="hotel-list-card__location">{hotel.location}</span>
                      <div className="hotel-list-card__rating">
                        <span className="stars">{'★'.repeat(Math.round(hotel.rating))}</span>
                        <span className="text-muted" style={{ fontSize: '0.82rem' }}>
                          {hotel.rating} · {hotel.reviewCount.toLocaleString()} {t('hotels', 'reviews')}
                        </span>
                      </div>
                    </div>
                    <h2 className="hotel-list-card__name">{hotel.name}</h2>
                    <p className="hotel-list-card__desc">{hotel.description.substring(0, 130)}…</p>
                    <div className="hotel-list-card__amenities">
                      {hotel.amenities.slice(0, 5).map((a) => <span key={a} className="tag">{a}</span>)}
                    </div>
                    <div className="hotel-list-card__footer">
                      <div className="hotel-list-card__price">
                        <span className="hotel-list-card__price-from">{t('hotels', 'from')}</span>
                        <span className="hotel-list-card__price-value">${hotel.priceFrom}</span>
                        <span className="hotel-list-card__price-night">{t('hotels', 'night')}</span>
                      </div>
                      <span className="btn btn-primary btn-sm">{t('hotels', 'view_rooms')}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

