import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import './Footer.css'

export default function Footer() {
  const { t } = useLanguage()
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__brand">
            <div className="footer__logo">
              <span>✦</span> Beira Mar Hotéis
            </div>
            <p className="footer__tagline">{t('footer', 'tagline')}</p>
          </div>
          <div className="footer__col">
            <h4>{t('footer', 'explore')}</h4>
            <Link to="/hotels">{t('footer', 'ourHotels')}</Link>
            <Link to="/hotels">{t('footer', 'destinations')}</Link>
            <Link to="/register">{t('footer', 'join')}</Link>
          </div>
          <div className="footer__col">
            <h4>{t('footer', 'support')}</h4>
            <a href="#">{t('footer', 'faq')}</a>
            <a href="#">{t('footer', 'cancel')}</a>
            <a href="#">{t('footer', 'contact')}</a>
          </div>
          <div className="footer__col">
            <h4>{t('footer', 'legal')}</h4>
            <a href="#">{t('footer', 'privacy')}</a>
            <a href="#">{t('footer', 'terms')}</a>
            <a href="#">{t('footer', 'cookie')}</a>
          </div>
        </div>
        <hr className="footer__divider" />
        <div className="footer__bottom">
          <p>© {new Date().getFullYear()} Beira Mar Hotéis. {t('footer', 'rights')}</p>
          <p className="footer__credits">{t('footer', 'crafted')}</p>
        </div>
      </div>
    </footer>
  )
}

