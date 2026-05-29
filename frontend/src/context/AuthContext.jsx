import { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../utils/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const handleExpired = () => setUser(null)
    window.addEventListener('auth:expired', handleExpired)
    return () => window.removeEventListener('auth:expired', handleExpired)
  }, [])

  useEffect(() => {
    const token = localStorage.getItem('mediconnect_token')
    if (token) {
      authAPI.getProfile()
        .then((res) => setUser(res.data))
        .catch(() => localStorage.removeItem('mediconnect_token'))
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (credentials) => {
    const res = await authAPI.login(credentials)
    localStorage.setItem('mediconnect_token', res.data.token)
    setUser(res.data)
    return res.data
  }

  const logout = () => {
    localStorage.removeItem('mediconnect_token')
    setUser(null)
  }

  const refreshUser = async () => {
    try {
      const res = await authAPI.getProfile()
      setUser(res.data)
      return res.data
    } catch {
      return null
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
