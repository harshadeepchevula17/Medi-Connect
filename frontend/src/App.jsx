import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import LandingPage from './pages/LandingPage'
import Login from './components/auth/Login'
import Signup from './components/auth/Signup'
import PatientDashboard from './components/dashboard/PatientDashboard'
import DoctorDashboard from './components/dashboard/DoctorDashboard'
import AdminDashboard from './components/dashboard/AdminDashboard'
import VideoConsultation from './components/consultation/VideoConsultation'
import AiChat from './components/ai/AiChat'
import ProfileSettings from './components/profile/ProfileSettings'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import AnimatedBackground from './components/three/AnimatedBackground'
import FloatingParticles from './components/three/FloatingParticles'

export default function App() {
  const location = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [location.pathname])

  return (
    <AuthProvider>
      <div className="ui-3d-root min-h-screen bg-surface text-text-primary relative" style={{ overflowY: 'auto', overflowX: 'hidden' }}>
        <AnimatedBackground className="fixed inset-0 z-0 opacity-55" />
        <FloatingParticles count={520} color="#2563eb" size={0.014} spread={4.8} opacity={0.12} speed={0.35} className="fixed inset-0 z-[1]" />
        <div className="fixed inset-0 z-[2] pointer-events-none bg-[radial-gradient(circle_at_18%_18%,rgba(37,99,235,0.08),transparent_34%),radial-gradient(circle_at_80%_72%,rgba(109,40,217,0.06),transparent_40%),linear-gradient(180deg,rgba(255,255,255,0.92)_0%,rgba(247,247,249,0.94)_100%)]" />

        <div className="relative z-10">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard/patient" element={<ProtectedRoute role="PATIENT"><PatientDashboard /></ProtectedRoute>} />
            <Route path="/dashboard/doctor" element={<ProtectedRoute role="DOCTOR"><DoctorDashboard /></ProtectedRoute>} />
            <Route path="/dashboard/admin" element={<ProtectedRoute role="ADMIN"><AdminDashboard /></ProtectedRoute>} />
            <Route path="/video-consultation/:appointmentId" element={<ProtectedRoute><VideoConsultation /></ProtectedRoute>} />
            <Route path="/ai-assistant" element={<ProtectedRoute><AiChat /></ProtectedRoute>} />
            <Route path="/profile/settings" element={<ProtectedRoute><ProfileSettings /></ProtectedRoute>} />
          </Routes>
        </div>
      </div>
    </AuthProvider>
  )
}
