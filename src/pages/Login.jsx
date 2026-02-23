import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import './AuthPages.css'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const { t } = useLanguage()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await new Promise((r) => setTimeout(r, 600))
      const user = login(form)
      navigate(user.role === 'admin' ? '/admin' : '/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-bg">
        <img src="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200&q=80" alt="" />
        <div className="auth-bg__overlay" />
      </div>

      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-card__header">
            <Link to="/" className="auth-logo">✶ Beira Mar Hotéis</Link>
            <h1>{t('auth', 'login_title')}</h1>
            <p>{t('auth', 'login_sub')}</p>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">{t('auth', 'email')}</label>
              <input className="form-input" type="email" name="email" placeholder={t('auth', 'email_placeholder')} value={form.email} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">{t('auth', 'password')}</label>
              <input className="form-input" type="password" name="password" placeholder={t('auth', 'password_placeholder')} value={form.password} onChange={handleChange} required />
            </div>
            <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
              {loading ? t('auth', 'signing_in') : t('auth', 'sign_in')}
            </button>
          </form>

          <div className="auth-demo-hint">
            <strong>{t('auth', 'demo')}</strong><br />
            Admin: <span>admin@beiramar.com</span> / <span>admin123</span>
          </div>

          <p className="auth-switch">
            {t('auth', 'no_account')} <Link to="/register">{t('auth', 'create_link')}</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

