import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen bg-midnight flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-neon to-cyber animate-spin mx-auto mb-4" />
          <p className="text-sm text-white/40">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />

  if (!user.onboardingComplete && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />
  }

  if (role && user.role !== role) {
    const dashboard = user.role === 'ADMIN' ? '/dashboard/admin' : user.role === 'DOCTOR' ? '/dashboard/doctor' : '/dashboard/patient'
    return <Navigate to={dashboard} replace />
  }

  return children
}
