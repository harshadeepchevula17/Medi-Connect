import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { authAPI } from '../../utils/api'
import GlassCard from '../ui/GlassCard'
import MagneticButton from '../ui/MagneticButton'
import FloatingParticles from '../three/FloatingParticles'

const specializations = [
  'General Medicine', 'Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics',
  'Dermatology', 'Ophthalmology', 'Psychiatry', 'Radiology', 'Surgery',
  'Oncology', 'Endocrinology', 'Gastroenterology', 'Pulmonology', 'Emergency Medicine',
]

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

export default function Signup() {
  const [searchParams] = useSearchParams()
  const defaultRole = searchParams.get('role')?.toUpperCase() === 'DOCTOR' ? 'DOCTOR' : 'PATIENT'
  const [role, setRole] = useState(defaultRole)
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({
    name: '', email: '', phone: '', password: '', confirmPassword: '',
    gender: '', dateOfBirth: '', bloodGroup: '', city: '',
    specialization: '', yearsOfExperience: '', medicalLicenseNumber: '', consultationFee: '', profilePhoto: '',
  })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const update = (field, value) => setForm({ ...form, [field]: value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match')
      return
    }
    try {
      const payload = { ...form, role }
      delete payload.confirmPassword
      await authAPI.signup(payload)
      navigate('/login')
    } catch (err) {
      setError(err.response?.data?.error || 'Signup failed. Try again.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-white py-10">
      <div className="absolute inset-0 bg-gradient-to-br from-bg-light via-white to-bg-light" />
      <FloatingParticles count={1000} color="#0ea5e9" size={0.008} spread={2} opacity={0.15} />
      <div className="absolute inset-0 mesh-gradient opacity-40" />

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/3 w-[600px] h-[600px] bg-primary/[0.03] rounded-full blur-[200px]" />
        <div className="absolute bottom-1/3 right-1/3 w-[600px] h-[600px] bg-secondary/[0.03] rounded-full blur-[200px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.17, 0.67, 0.83, 0.67] }}
        className="relative z-10 w-full max-w-lg px-6"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex items-center gap-2 justify-center mb-6"
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

        <GlassCard glass="premium" className="p-6 md:p-8 relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/[0.04] rounded-full blur-[60px]" />

          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold gradient-text">Create Account</h2>
              <p className="text-sm text-text-tertiary mt-1">Join the future of healthcare</p>
            </div>
            <div className="flex items-center gap-2">
              {[0, 1].map(i => (
                <div key={i} className="flex items-center">
                  <motion.div
                    animate={{
                      width: i === step ? 32 : 8,
                      backgroundColor: i <= step ? '#0ea5e9' : 'rgba(0,0,0,0.08)',
                    }}
                    transition={{ duration: 0.4, ease: 'easeInOut' }}
                    className="h-2 rounded-full"
                  />
                  {i === 0 && <div className={`w-6 h-px mx-1 transition-colors ${step > 0 ? 'bg-primary/30' : 'bg-black/[0.04]'}`} />}
                </div>
              ))}
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              className="text-red-500 text-sm mb-4 p-3 rounded-xl bg-red-50 border border-red-200"
            >{error}</motion.div>
          )}

          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3, ease: [0.17, 0.67, 0.83, 0.67] }}
              >
                {step === 0 ? (
                  <div className="space-y-4">
                    <div className="flex gap-2 mb-4 bg-bg-subtle rounded-2xl p-1.5 border border-black/[0.04]">
                      {[
                        { id: 'PATIENT', label: 'Patient', icon: '👤' },
                        { id: 'DOCTOR', label: 'Doctor', icon: '👨‍⚕️' },
                      ].map(r => (
                        <button key={r.id} type="button" onClick={() => { setRole(r.id); setError('') }}
                          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-medium transition-all duration-300 ${
                            role === r.id
                              ? 'bg-gradient-to-r from-primary/20 to-secondary/20 text-primary border border-primary/20 shadow-premium'
                              : 'text-text-tertiary hover:text-text-secondary border border-transparent'
                          }`}
                        >
                          <span className="text-lg">{r.icon}</span> {r.label}
                        </button>
                      ))}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-medium text-text-tertiary uppercase tracking-wider mb-1.5">Full Name</label>
                        <input type="text" value={form.name} onChange={e => update('name', e.target.value)} className="input-premium w-full"
                          placeholder={role === 'DOCTOR' ? 'Dr. John Doe' : 'John Doe'} required />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-text-tertiary uppercase tracking-wider mb-1.5">Email</label>
                        <input type="email" value={form.email} onChange={e => update('email', e.target.value)} className="input-premium w-full" placeholder="you@example.com" required />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-text-tertiary uppercase tracking-wider mb-1.5">Phone</label>
                        <input type="tel" value={form.phone} onChange={e => update('phone', e.target.value)} className="input-premium w-full" placeholder="+1 234 567 890" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-text-tertiary uppercase tracking-wider mb-1.5">Password</label>
                        <input type="password" value={form.password} onChange={e => update('password', e.target.value)} className="input-premium w-full" placeholder="Min 6 characters" required minLength={6} />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-text-tertiary uppercase tracking-wider mb-1.5">Confirm Password</label>
                        <input type="password" value={form.confirmPassword} onChange={e => update('confirmPassword', e.target.value)} className="input-premium w-full" placeholder="Re-enter password" required />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {role === 'PATIENT' ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-text-tertiary uppercase tracking-wider mb-1.5">Gender</label>
                          <select value={form.gender} onChange={e => update('gender', e.target.value)} className="input-premium w-full">
                            <option value="">Select</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-text-tertiary uppercase tracking-wider mb-1.5">Date of Birth</label>
                          <input type="date" value={form.dateOfBirth} onChange={e => update('dateOfBirth', e.target.value)} className="input-premium w-full" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-text-tertiary uppercase tracking-wider mb-1.5">Blood Group</label>
                          <select value={form.bloodGroup} onChange={e => update('bloodGroup', e.target.value)} className="input-premium w-full">
                            <option value="">Select</option>
                            {bloodGroups.map(b => <option key={b} value={b}>{b}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-text-tertiary uppercase tracking-wider mb-1.5">City</label>
                          <input type="text" value={form.city} onChange={e => update('city', e.target.value)} className="input-premium w-full" placeholder="Your city" />
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-text-tertiary uppercase tracking-wider mb-1.5">Gender</label>
                          <select value={form.gender} onChange={e => update('gender', e.target.value)} className="input-premium w-full">
                            <option value="">Select</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-text-tertiary uppercase tracking-wider mb-1.5">Date of Birth</label>
                          <input type="date" value={form.dateOfBirth} onChange={e => update('dateOfBirth', e.target.value)} className="input-premium w-full" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-text-tertiary uppercase tracking-wider mb-1.5">Specialization</label>
                          <select value={form.specialization} onChange={e => update('specialization', e.target.value)} className="input-premium w-full" required>
                            <option value="">Select</option>
                            {specializations.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-text-tertiary uppercase tracking-wider mb-1.5">Years of Experience</label>
                          <input type="number" value={form.yearsOfExperience} onChange={e => update('yearsOfExperience', e.target.value)} className="input-premium w-full" placeholder="e.g. 10" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-text-tertiary uppercase tracking-wider mb-1.5">Medical License Number</label>
                          <input type="text" value={form.medicalLicenseNumber} onChange={e => update('medicalLicenseNumber', e.target.value)} className="input-premium w-full" placeholder="License #" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-text-tertiary uppercase tracking-wider mb-1.5">Consultation Fee ($)</label>
                          <input type="number" value={form.consultationFee} onChange={e => update('consultationFee', e.target.value)} className="input-premium w-full" placeholder="e.g. 50" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-text-tertiary uppercase tracking-wider mb-1.5">City</label>
                          <input type="text" value={form.city} onChange={e => update('city', e.target.value)} className="input-premium w-full" placeholder="Your city" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-text-tertiary uppercase tracking-wider mb-1.5">Profile Photo URL</label>
                          <input type="url" value={form.profilePhoto} onChange={e => update('profilePhoto', e.target.value)} className="input-premium w-full" placeholder="https://..." />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <motion.div className="flex justify-between mt-8" layout>
              {step === 1 ? (
                <>
                  <MagneticButton type="button" variant="secondary" onClick={() => setStep(0)}>Back</MagneticButton>
                  <MagneticButton type="submit" variant="primary">Create Account</MagneticButton>
                </>
              ) : (
                <>
                  <div />
                  <MagneticButton type="button" variant="primary" onClick={() => setStep(1)}>Continue</MagneticButton>
                </>
              )}
            </motion.div>
          </form>

          <div className="relative mt-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-black/[0.06]" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-4 bg-white text-text-tertiary">Already registered?</span>
            </div>
          </div>

          <p className="text-center text-sm mt-4">
            <Link to={`/login?role=${role.toLowerCase()}`} className="text-text-tertiary hover:text-primary transition-colors">
              Sign in to your account <span className="text-primary">→</span>
            </Link>
          </p>
        </GlassCard>
      </motion.div>
    </div>
  )
}
