import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import './AuthPages.css'

export default function Register() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const { t } = useLanguage()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm) { setError(t('auth', 'error_match')); return }
    if (form.password.length < 6) { setError(t('auth', 'error_length')); return }
    setLoading(true)
    try {
      await new Promise((r) => setTimeout(r, 600))
      register({ name: form.name, email: form.email, password: form.password })
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-bg">
        <img src="https://images.unsplash.com/photo-1615460549969-36fa19521a4f?w=1200&q=80" alt="" />
        <div className="auth-bg__overlay" />
      </div>

      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-card__header">
            <Link to="/" className="auth-logo">✶ Beira Mar Hotéis</Link>
            <h1>{t('auth', 'register_title')}</h1>
            <p>{t('auth', 'register_sub')}</p>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">{t('auth', 'full_name')}</label>
              <input className="form-input" type="text" name="name" placeholder={t('auth', 'name_placeholder')} value={form.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">{t('auth', 'email')}</label>
              <input className="form-input" type="email" name="email" placeholder={t('auth', 'email_placeholder')} value={form.email} onChange={handleChange} required />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">{t('auth', 'password')}</label>
                <input className="form-input" type="password" name="password" placeholder={t('auth', 'min_chars')} value={form.password} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">{t('auth', 'confirm_password')}</label>
                <input className="form-input" type="password" name="confirm" placeholder={t('auth', 'confirm_placeholder')} value={form.confirm} onChange={handleChange} required />
              </div>
            </div>
            <p className="auth-terms">
              {t('auth', 'terms')} <a href="#">{t('auth', 'terms_link')}</a> {t('auth', 'and')} <a href="#">{t('auth', 'privacy_link')}</a>.
            </p>
            <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
              {loading ? t('auth', 'creating') : t('auth', 'create')}
            </button>
          </form>

          <p className="auth-switch">
            {t('auth', 'have_account')} <Link to="/login">{t('auth', 'sign_in_link')}</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

