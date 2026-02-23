import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useLanguage } from '../context/LanguageContext'
import './DatePicker.css'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

function parseLocal(str) {
  if (!str) return null
  const [y, m, d] = str.split('-').map(Number)
  return new Date(y, m - 1, d)
}

function toLocalStr(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function sameDay(a, b) {
  return (
    a && b &&
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

export default function DatePicker({
  label,
  value,
  onChange,
  minDate,
  placeholder = 'Select date',
  rangeStart,
  rangeEnd,
}) {
  const { t } = useLanguage()
  const today = new Date()
  const selected = parseLocal(value)
  const min = parseLocal(minDate)

  const [open, setOpen] = useState(false)
  const [viewYear, setViewYear] = useState(selected?.getFullYear() ?? today.getFullYear())
  const [viewMonth, setViewMonth] = useState(selected?.getMonth() ?? today.getMonth())
  const [calStyle, setCalStyle] = useState({})
  const wrapRef = useRef(null)
  const calRef = useRef(null)

  // Close on outside click — must check both the trigger AND the portal calendar
  useEffect(() => {
    const handler = (e) => {
      const insideTrigger = wrapRef.current && wrapRef.current.contains(e.target)
      const insideCal = calRef.current && calRef.current.contains(e.target)
      if (!insideTrigger && !insideCal) setOpen(false)
    }
    if (open) document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  // Position calendar with fixed so it never gets clipped
  const handleOpen = () => {
    if (!wrapRef.current) return
    const rect = wrapRef.current.getBoundingClientRect()
    const spaceBelow = window.innerHeight - rect.bottom
    const calH = 340
    const top = spaceBelow >= calH ? rect.bottom + 6 : rect.top - calH - 6
    const left = Math.min(rect.left, window.innerWidth - 310)
    setCalStyle({ top, left: Math.max(8, left) })
    setOpen((v) => !v)
  }

  // Build calendar grid
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
  const firstDay = new Date(viewYear, viewMonth, 1).getDay()
  const cells = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(viewYear, viewMonth, d))

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1) }
    else setViewMonth((m) => m - 1)
  }
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1) }
    else setViewMonth((m) => m + 1)
  }

  const selectDay = (date) => {
    onChange(toLocalStr(date))
    setOpen(false)
  }

  const isDisabled = (date) => min && date < min && !sameDay(date, min)

  const rStart = parseLocal(rangeStart)
  const rEnd = parseLocal(rangeEnd)
  const inRange = (date) => rStart && rEnd && date > rStart && date < rEnd

  const displayValue = selected
    ? selected.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : ''

  return (
    <div className="dp-wrap" ref={wrapRef}>
      {label && <label className="dp-label">{label}</label>}
      <button
        type="button"
        className={`dp-trigger ${open ? 'dp-trigger--open' : ''}`}
        onClick={handleOpen}
      >
        <span className={displayValue ? 'dp-value' : 'dp-placeholder'}>
          {displayValue || placeholder}
        </span>
        <span className="dp-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        </span>
      </button>

      {open && createPortal(
        <div
          ref={calRef}
          className="dp-calendar"
          style={{ position: 'fixed', zIndex: 9999, ...calStyle }}
        >
          {/* Month navigation */}
          <div className="dp-cal-header">
            <button type="button" className="dp-nav" onClick={prevMonth}>‹</button>
            <span className="dp-cal-title">{MONTHS[viewMonth]} {viewYear}</span>
            <button type="button" className="dp-nav" onClick={nextMonth}>›</button>
          </div>

          {/* Day names */}
          <div className="dp-day-names">
            {DAYS.map((d) => <div key={d} className="dp-day-name">{d}</div>)}
          </div>

          {/* Day grid */}
          <div className="dp-grid">
            {cells.map((date, i) => {
              if (!date) return <div key={`e-${i}`} className="dp-cell-empty" />
              const disabled = isDisabled(date)
              const isSelected = sameDay(date, selected)
              const isToday = sameDay(date, today)
              const isInRange = inRange(date)
              const isRangeStart = sameDay(date, rStart)
              const isRangeEnd = sameDay(date, rEnd)

              const classes = [
                'dp-day',
                isSelected ? 'dp-day--selected' : '',
                isToday && !isSelected ? 'dp-day--today' : '',
                isInRange ? 'dp-day--in-range' : '',
                isRangeStart && !isSelected ? 'dp-day--range-edge' : '',
                isRangeEnd && !isSelected ? 'dp-day--range-edge' : '',
                disabled ? 'dp-day--disabled' : '',
              ].filter(Boolean).join(' ')

              return (
                <button
                  key={i}
                  type="button"
                  disabled={disabled}
                  className={classes}
                  onClick={() => !disabled && selectDay(date)}
                >
                  {date.getDate()}
                </button>
              )
            })}
          </div>

          {/* Footer */}
          <div className="dp-footer">
            <button type="button" className="dp-today-btn" onClick={() => {
              if (!isDisabled(today)) {
                onChange(toLocalStr(today))
                setOpen(false)
              }
            }}>
              {t('datepicker', 'today')}
            </button>
            <button type="button" className="dp-clear-btn" onClick={() => { onChange(''); setOpen(false) }}>
              {t('datepicker', 'clear')}
            </button>
          </div>
        </div>
      , document.body)}
    </div>
  )
}
