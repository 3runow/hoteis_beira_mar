import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

const DEFAULT_ADMIN = { id: 0, name: 'Admin', email: 'admin@beiramar.com', role: 'admin' }

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('luxe_user')
    return stored ? JSON.parse(stored) : null
  })

  const register = ({ name, email, password }) => {
    const users = JSON.parse(localStorage.getItem('luxe_users') || '[]')
    if (users.find((u) => u.email === email)) {
      throw new Error('Email already registered.')
    }
    const newUser = { id: Date.now(), name, email, password, role: 'user' }
    users.push(newUser)
    localStorage.setItem('luxe_users', JSON.stringify(users))
    const { password: _, ...safeUser } = newUser
    setUser(safeUser)
    localStorage.setItem('luxe_user', JSON.stringify(safeUser))
    return safeUser
  }

  const login = ({ email, password }) => {
    if (email === 'admin@beiramar.com' && password === 'admin123') {
      setUser(DEFAULT_ADMIN)
      localStorage.setItem('luxe_user', JSON.stringify(DEFAULT_ADMIN))
      return DEFAULT_ADMIN
    }
    const users = JSON.parse(localStorage.getItem('luxe_users') || '[]')
    const found = users.find((u) => u.email === email && u.password === password)
    if (!found) throw new Error('Invalid email or password.')
    const { password: _, ...safeUser } = found
    setUser(safeUser)
    localStorage.setItem('luxe_user', JSON.stringify(safeUser))
    return safeUser
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('luxe_user')
  }

  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
