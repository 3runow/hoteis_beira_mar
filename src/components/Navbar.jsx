import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import './Navbar.css'

const LANGS = [
  { code: 'pt', label: 'PT', full: 'Português' },
  { code: 'en', label: 'EN', full: 'English' },
  { code: 'es', label: 'ES', full: 'Español' },
]

export default function Navbar() {
  const { user, logout } = useAuth()
  const { lang, setLang, t } = useLanguage()
  const navigate = useNavigate()
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMenuOpen(false); setLangOpen(false) }, [location])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__inner">
        <Link to="/" className="navbar__logo">
          <span className="navbar__logo-icon">✦</span>
          Beira Mar
        </Link>

        <div className={`navbar__links ${menuOpen ? 'navbar__links--open' : ''}`}>
          <Link to="/" className="navbar__link">{t('nav', 'home')}</Link>
          <Link to="/hotels" className="navbar__link">{t('nav', 'hotels')}</Link>
          {user ? (
            <>
              <Link to="/dashboard" className="navbar__link">{t('nav', 'myBookings')}</Link>
              {user.role === 'admin' && <Link to="/admin" className="navbar__link navbar__link--gold">{t('nav', 'admin')}</Link>}
              <button onClick={handleLogout} className="navbar__link navbar__link--btn">{t('nav', 'logout')}</button>
              <span className="navbar__avatar">{user.name.charAt(0).toUpperCase()}</span>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar__link">{t('nav', 'login')}</Link>
              <Link to="/register" className="btn btn-primary btn-sm">{t('nav', 'register')}</Link>
            </>
          )}
        </div>

        {/* LANGUAGE SWITCHER */}
        <div className="lang-switcher">
          <button
            className="lang-switcher__toggle"
            onClick={() => setLangOpen(!langOpen)}
            aria-label="Change language"
          >
            <span className="lang-switcher__globe">🌐</span>
            <span>{LANGS.find(l => l.code === lang)?.label}</span>
            <span className="lang-switcher__arrow">{langOpen ? '▲' : '▼'}</span>
          </button>
          {langOpen && (
            <div className="lang-switcher__dropdown">
              {LANGS.map((l) => (
                <button
                  key={l.code}
                  className={`lang-switcher__option ${lang === l.code ? 'lang-switcher__option--active' : ''}`}
                  onClick={() => { setLang(l.code); setLangOpen(false) }}
                >
                  <span className="lang-option__label">{l.label}</span>
                  <span className="lang-option__full">{l.full}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <button className="navbar__burger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          <span /><span /><span />
        </button>
      </div>
    </nav>
  )
}
