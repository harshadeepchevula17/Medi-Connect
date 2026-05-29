import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import GlassCard from '../ui/GlassCard'
import MagneticButton from '../ui/MagneticButton'
import FloatingParticles from '../three/FloatingParticles'

const roles = [
  { id: 'PATIENT', label: 'Patient', icon: '👤', desc: 'Access your health records, book consultations, and track vitals' },
  { id: 'DOCTOR', label: 'Doctor', icon: '👨‍⚕️', desc: 'Manage appointments, review patient cases, and conduct consultations' },
]

export default function Login() {
  const [searchParams] = useSearchParams()
  const defaultRole = searchParams.get('role')?.toUpperCase() === 'DOCTOR' ? 'DOCTOR' : 'PATIENT'
  const [role, setRole] = useState(defaultRole)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const data = await login({ email, password })
      // Special-case: seeded admin account 'admin' should always land on admin dashboard
      if ((email || '').toLowerCase() === 'admin') {
        navigate('/dashboard/admin')
        return
      }

      const userRole = data.role?.toLowerCase()
      if (userRole === 'admin') navigate('/dashboard/admin')
      else if (userRole === 'doctor') navigate('/dashboard/doctor')
      else navigate('/dashboard/patient')
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Login failed')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-white">
      <div className="absolute inset-0 bg-gradient-to-br from-bg-light via-white to-bg-light" />
      <FloatingParticles count={1000} color="#0ea5e9" size={0.008} spread={2} opacity={0.15} />
      <div className="absolute inset-0 mesh-gradient opacity-40" />

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/[0.04] rounded-full blur-[180px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-secondary/[0.04] rounded-full blur-[180px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.17, 0.67, 0.83, 0.67] }}
        className="relative z-10 w-full max-w-md px-6"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex items-center gap-2 justify-center mb-8"
        >
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary via-sky-400 to-secondary flex items-center justify-center shadow-glow-primary group-hover:shadow-glow-secondary transition-all duration-500 group-hover:scale-105 relative z-10">
                <span className="text-white font-bold text-xl">M</span>
              </div>
              <div className="absolute inset-0 rounded-2xl bg-primary/20 blur-md opacity-0 group-hover:opacity-60 transition-opacity duration-500" />
            </div>
            <span className="font-display text-2xl font-bold gradient-text">MediConnect</span>
          </Link>
        </motion.div>

        <GlassCard glass="premium" depth className="p-8 relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/[0.04] rounded-full blur-[60px]" />

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <h2 className="text-3xl font-bold gradient-text">Welcome back</h2>
            <p className="text-sm text-text-tertiary mt-1 mb-6">{roles.find(r => r.id === role)?.desc}</p>
          </motion.div>

          <div className="flex gap-2 mb-6 bg-bg-subtle rounded-2xl p-1.5 border border-black/[0.04]">
            {roles.map((r) => (
              <button key={r.id} onClick={() => setRole(r.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-medium transition-all duration-300 ${
                  role === r.id
                    ? 'bg-gradient-to-r from-primary/20 to-secondary/20 text-primary border border-primary/20 shadow-premium'
                    : 'text-text-tertiary hover:text-text-secondary border border-transparent'
                }`}
              >
                <span className="text-lg">{r.icon}</span>
                {r.label}
              </button>
            ))}
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              className="text-red-500 text-sm mb-4 p-3 rounded-xl bg-red-50 border border-red-200"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
              <label className="block text-xs font-medium text-text-tertiary uppercase tracking-wider mb-1.5">Email Address</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="input-premium w-full"
                placeholder="you@example.com" required />
            </motion.div>
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
              <label className="block text-xs font-medium text-text-tertiary uppercase tracking-wider mb-1.5">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                className="input-premium w-full"
                placeholder="••••••••" required />
              <div className="flex justify-end mt-2">
                <Link to="/forgot-password" className="text-xs text-primary/60 hover:text-primary transition-colors">Forgot password?</Link>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
              <MagneticButton type="submit" variant="primary" className="w-full py-3.5 text-sm">
                Sign In as {roles.find(r => r.id === role)?.label}
              </MagneticButton>
            </motion.div>
          </form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="relative mt-8"
          >
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-black/[0.06]" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-4 bg-white text-text-tertiary">New to MediConnect?</span>
            </div>
          </motion.div>

          <p className="text-center text-sm mt-6">
            <Link to={`/signup?role=${role.toLowerCase()}`} className="text-text-tertiary hover:text-primary transition-colors">
              Create an account <span className="text-primary">→</span>
            </Link>
          </p>
        </GlassCard>
      </motion.div>
    </div>
  )
}
