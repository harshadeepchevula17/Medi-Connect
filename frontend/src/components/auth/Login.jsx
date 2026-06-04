import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import RotatingHuman from '../../components/RotatingHuman'
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  User,
  Stethoscope,
  CalendarCheck,
  FileText,
  Video,
  ShieldCheck,
} from 'lucide-react'

const roles = [
  { id: 'PATIENT', label: 'Patient', icon: User, desc: 'Access your health records, book consultations, and track vitals.' },
  { id: 'DOCTOR', label: 'Doctor', icon: Stethoscope, desc: 'Manage appointments, review patient cases, and conduct consultations.' },
]

const features = [
  { icon: CalendarCheck, title: 'Smart scheduling', sub: 'Book appointments in under 60 seconds' },
  { icon: FileText, title: 'Health records', sub: 'All your medical history in one place' },
  { icon: Video, title: 'Video consultations', sub: 'See a doctor from anywhere, anytime' },
  { icon: ShieldCheck, title: 'HIPAA compliant', sub: 'Your data is always private and secure' },
]

export default function Login() {
  const [searchParams] = useSearchParams()
  const defaultRole = searchParams.get('role')?.toUpperCase() === 'DOCTOR' ? 'DOCTOR' : 'PATIENT'
  const [role, setRole] = useState(defaultRole)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      const data = await login({ email, password })
      const nextRole = data.role?.toUpperCase()

      if (nextRole === 'ADMIN') navigate('/dashboard/admin')
      else if (nextRole === 'DOCTOR') navigate('/dashboard/doctor')
      else navigate('/dashboard/patient')
    } catch (err) {
      setError(err?.response?.data?.error || err?.response?.data?.message || 'Login failed')
    }
  }

  const activeRole = roles.find((item) => item.id === role)

  return (
    <div className="min-h-screen grid lg:grid-cols-2 overflow-hidden bg-[#f5f7fb]">
      <div className="relative hidden lg:flex flex-col justify-start p-10 xl:p-14 overflow-hidden text-white" style={{ background: 'linear-gradient(160deg, #0a3d5c 0%, #0c5a82 45%, #0e72a8 100%)' }}>
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute -bottom-16 -left-12 w-56 h-56 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute top-1/2 -right-8 w-36 h-36 rounded-full bg-white/[0.04] pointer-events-none" />

        <div className="relative z-10 flex items-center gap-3">
          <img src="/logo.png" alt="MediConnect" className="w-10 h-10 object-contain" />
          <span className="text-white text-lg font-semibold tracking-tight">MediConnect</span>
        </div>

  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} className="relative z-10 mt-8 max-w-md">
          <h1 className="text-white text-3xl xl:text-4xl font-bold leading-snug tracking-tight mb-4">
            Healthcare at<br />your fingertips
          </h1>
          <p className="text-white/60 text-sm leading-relaxed mb-9 max-w-xs">
            Connect with doctors, manage appointments, and access your health records in one secure platform.
          </p>

          <div className="space-y-4">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <div key={feature.title} className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-lg bg-white/8 border border-white/10 flex items-center justify-center text-cyan-300 shrink-0">
                    <Icon size={16} />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-white/90">{feature.title}</h3>
                    <p className="text-xs text-white/48 mt-1">{feature.sub}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>
      </div>

      <div className="flex items-center justify-center p-6 md:p-10 xl:p-14">
        <div className="w-full max-w-md">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="bg-white rounded-[28px] shadow-[0_20px_60px_rgba(15,23,42,0.08)] border border-slate-100 p-7 md:p-8">
            <div className="mb-7">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-50 text-cyan-700 text-xs font-medium mb-4">
                <ArrowRight size={14} /> Secure sign-in
              </div>
              <h2 className="text-2xl font-semibold text-slate-900 tracking-tight">Welcome back</h2>
              <p className="text-sm text-slate-500 mt-1">Sign in to your MediConnect account</p>
            </div>

            <div className="flex p-1 bg-slate-100 rounded-2xl mb-5">
              {roles.map((item) => {
                const Icon = item.icon
                const selected = role === item.id
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setRole(item.id)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all ${selected ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    <Icon size={16} />
                    {item.label}
                  </button>
                )
              })}
            </div>

            <div className="mb-6 rounded-2xl border border-cyan-100 bg-cyan-50/70 px-4 py-3 text-xs leading-relaxed text-cyan-800">
              {activeRole?.desc}
            </div>

            {error && (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 py-3 text-sm outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
                    placeholder="name@example.com"
                    autoComplete="email"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-11 py-3 text-sm outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
                    placeholder="••••••••"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Use your registered email and password.</span>
                <Link to="/signup" className="font-medium text-cyan-700 hover:text-cyan-800">
                  Create account
                </Link>
              </div>

              <button
                type="submit"
                className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3.5 text-sm font-medium text-white transition hover:bg-slate-800 active:scale-[0.99]"
              >
                Sign in as {role === 'PATIENT' ? 'Patient' : 'Doctor'}
                <ArrowRight size={16} />
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
