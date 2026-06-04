import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { authAPI } from '../../utils/api'

const specializations = [
  'General Medicine', 'Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics',
  'Dermatology', 'Ophthalmology', 'Psychiatry', 'Radiology', 'Surgery',
  'Oncology', 'Endocrinology', 'Gastroenterology', 'Pulmonology', 'Emergency Medicine',
]

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

const features = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ width: 20, height: 20 }}>
        <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
    title: 'Smart scheduling',
    desc: 'Book appointments in under 60 seconds',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ width: 20, height: 20 }}>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
      </svg>
    ),
    title: 'Health records',
    desc: 'All your medical history in one place',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ width: 20, height: 20 }}>
        <polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
      </svg>
    ),
    title: 'Video consultations',
    desc: 'See a doctor from anywhere, anytime',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ width: 20, height: 20 }}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: 'HIPAA compliant',
    desc: 'Your data is always private and secure',
  },
]

const inputStyle = {
  width: '100%',
  padding: '10px 14px',
  border: '1.5px solid #e5e7eb',
  borderRadius: '10px',
  fontSize: '14px',
  color: '#111827',
  background: '#fff',
  outline: 'none',
  transition: 'border-color 0.2s',
  boxSizing: 'border-box',
}

const labelStyle = {
  display: 'block',
  fontSize: '11px',
  fontWeight: 600,
  color: '#6b7280',
  textTransform: 'uppercase',
  letterSpacing: '0.07em',
  marginBottom: '6px',
}

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
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }))

  // Step 0 Continue — purely client-side, never submits
  const handleContinue = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setError('')
    if (!form.name.trim()) { setError('Please enter your full name'); return }
    if (!form.email.trim()) { setError('Please enter your email'); return }
    if (!form.password) { setError('Please enter a password'); return }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return }
    if (form.password !== form.confirmPassword) { setError('Passwords do not match'); return }
    setStep(1)
  }

  // Step 1 Submit — actual API call
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const phone = (form.phone || '').trim().replace(/[^+\d]/g, '')
    try {
      setLoading(true)
      const payload = { ...form, role, phone }
      delete payload.confirmPassword
      Object.keys(payload).forEach(k => {
        if (typeof payload[k] === 'string') payload[k] = payload[k].trim()
      })
      await authAPI.signup(payload)
      navigate('/login')
    } catch (err) {
      setError(
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message ||
        'Signup failed. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: "'DM Sans', sans-serif" }}>

      {/* Left Panel */}
      <div style={{
        width: '44%',
        background: 'linear-gradient(160deg, #0d4a3a 0%, #0f5c48 40%, #0a6e56 100%)',
        padding: '48px 52px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: 320, height: 320, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '60px', left: '-60px', width: 240, height: 240, borderRadius: '50%', background: 'rgba(255,255,255,0.03)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '40%', right: '-40px', width: 180, height: 180, borderRadius: '50%', background: 'rgba(255,255,255,0.03)', pointerEvents: 'none' }} />

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img src="/logo.png" alt="MediConnect" style={{ width: 40, height: 40, objectFit: 'contain' }} />
          <span style={{ color: '#fff', fontWeight: 700, fontSize: 20, letterSpacing: '-0.01em' }}>MediConnect</span>
        </div>

        {/* Hero */}
        <div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }}
            style={{ color: '#fff', fontSize: '2.4rem', fontWeight: 800, lineHeight: 1.2, letterSpacing: '-0.02em', marginBottom: 16 }}>
            Healthcare at<br />your fingertips
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.6 }}
            style={{ color: 'rgba(255,255,255,0.65)', fontSize: 14, lineHeight: 1.7, maxWidth: 300 }}>
            Connect with doctors, manage appointments, and access your health records — all in one secure platform.
          </motion.p>
        </div>

        {/* Features */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {features.map((f, i) => (
            <motion.div key={f.title} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.1, duration: 0.5 }}
              style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.85)', flexShrink: 0 }}>
                {f.icon}
              </div>
              <div>
                <div style={{ color: '#fff', fontWeight: 600, fontSize: 14 }}>{f.title}</div>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, marginTop: 2 }}>{f.desc}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.5 }}
          style={{ display: 'flex', gap: 32, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          {[['500+', 'Doctors'], ['50+', 'Specialties'], ['25K+', 'Patients']].map(([num, lbl]) => (
            <div key={lbl}>
              <div style={{ color: '#fff', fontWeight: 800, fontSize: 20 }}>{num}</div>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, marginTop: 2 }}>{lbl}</div>
            </div>
          ))}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 8px #4ade80' }} />
            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>Live platform</span>
          </div>
        </motion.div>
      </div>

      {/* Right Panel */}
      <div style={{ flex: 1, background: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 40px', overflowY: 'auto' }}>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          style={{ width: '100%', maxWidth: 440 }}>

          <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: '1.9rem', fontWeight: 800, color: '#111827', letterSpacing: '-0.02em', marginBottom: 6 }}>Create Account</h2>
            <p style={{ color: '#9ca3af', fontSize: 14 }}>Join the future of healthcare</p>
          </div>

          {/* Role Toggle */}
          <div style={{ display: 'flex', background: '#fff', border: '1.5px solid #e5e7eb', borderRadius: 14, padding: 4, marginBottom: 24, gap: 4 }}>
            {[
              { id: 'PATIENT', label: 'Patient', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 16, height: 16 }}><circle cx="12" cy="7" r="4"/><path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/></svg> },
              { id: 'DOCTOR', label: 'Doctor', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 16, height: 16 }}><circle cx="9" cy="7" r="4"/><path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/><path d="M19 8v6m-3-3h6"/></svg> },
            ].map(r => (
              <button key={r.id} type="button"
                onClick={() => { setRole(r.id); setError('') }}
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '10px 16px', borderRadius: 10, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 14, transition: 'all 0.25s', background: role === r.id ? '#fff' : 'transparent', color: role === r.id ? '#065f46' : '#9ca3af', boxShadow: role === r.id ? '0 1px 6px rgba(0,0,0,0.08)' : 'none' }}>
                <span style={{ color: role === r.id ? '#10b981' : '#9ca3af' }}>{r.icon}</span>
                {r.label}
              </button>
            ))}
          </div>

          {/* Role hint */}
          <div style={{ borderLeft: '3px solid #10b981', background: 'rgba(16,185,129,0.05)', borderRadius: '0 8px 8px 0', padding: '10px 14px', marginBottom: 24, fontSize: 13, color: '#374151' }}>
            {role === 'PATIENT' ? 'Access your health records, book consultations, and track vitals.' : 'Manage your patients, set availability, and conduct video consultations.'}
          </div>

          {/* Error */}
          {error && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              style={{ background: '#fef2f2', border: '1.5px solid #fecaca', color: '#dc2626', borderRadius: 10, padding: '10px 14px', fontSize: 13, marginBottom: 20 }}>
              {error}
            </motion.div>
          )}

          {/* Step indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
            {[0, 1].map(i => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: i === step ? 28 : 8, height: 8, borderRadius: 99, background: i <= step ? '#10b981' : '#e5e7eb', transition: 'all 0.3s' }} />
                {i === 0 && <div style={{ width: 20, height: 1, background: step > 0 ? '#10b981' : '#e5e7eb', transition: 'background 0.3s' }} />}
              </div>
            ))}
            <span style={{ fontSize: 12, color: '#9ca3af', marginLeft: 4 }}>Step {step + 1} of 2</span>
          </div>

          {/* STEP 0 — standalone div, NOT inside a form */}
          {step === 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={labelStyle}>Full Name</label>
                <input type="text" value={form.name} onChange={e => update('name', e.target.value)} style={inputStyle}
                  placeholder={role === 'DOCTOR' ? 'Dr. John Doe' : 'John Doe'}
                  onFocus={e => e.target.style.borderColor = '#10b981'} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label style={labelStyle}>Email</label>
                  <input type="email" value={form.email} onChange={e => update('email', e.target.value)} style={inputStyle} placeholder="you@example.com"
                    onFocus={e => e.target.style.borderColor = '#10b981'} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
                </div>
                <div>
                  <label style={labelStyle}>Phone</label>
                  <input type="tel" value={form.phone} onChange={e => update('phone', e.target.value)} style={inputStyle} placeholder="+91 98765 43210"
                    onFocus={e => e.target.style.borderColor = '#10b981'} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
                </div>
                <div>
                  <label style={labelStyle}>Password</label>
                  <input type="password" value={form.password} onChange={e => update('password', e.target.value)} style={inputStyle} placeholder="Min 6 characters"
                    onFocus={e => e.target.style.borderColor = '#10b981'} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
                </div>
                <div>
                  <label style={labelStyle}>Confirm Password</label>
                  <input type="password" value={form.confirmPassword} onChange={e => update('confirmPassword', e.target.value)} style={inputStyle} placeholder="Re-enter password"
                    onFocus={e => e.target.style.borderColor = '#10b981'} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
                <button type="button" onClick={handleContinue}
                  style={{ padding: '11px 28px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)', color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer', boxShadow: '0 4px 14px rgba(16,185,129,0.35)', transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(16,185,129,0.45)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(16,185,129,0.35)' }}>
                  Continue →
                </button>
              </div>
            </div>
          )}

          {/* STEP 1 — real form with onSubmit */}
          {step === 1 && (
            <form onSubmit={handleSubmit}>
              <AnimatePresence mode="wait">
                <motion.div key="step1" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.28 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    <div>
                      <label style={labelStyle}>Gender</label>
                      <select value={form.gender} onChange={e => update('gender', e.target.value)} style={inputStyle}
                        onFocus={e => e.target.style.borderColor = '#10b981'} onBlur={e => e.target.style.borderColor = '#e5e7eb'}>
                        <option value="">Select</option>
                        <option>Male</option><option>Female</option><option>Other</option>
                      </select>
                    </div>
                    <div>
                      <label style={labelStyle}>Date of Birth</label>
                      <input type="date" value={form.dateOfBirth} onChange={e => update('dateOfBirth', e.target.value)} style={inputStyle}
                        onFocus={e => e.target.style.borderColor = '#10b981'} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
                    </div>
                    {role === 'PATIENT' ? (
                      <>
                        <div>
                          <label style={labelStyle}>Blood Group</label>
                          <select value={form.bloodGroup} onChange={e => update('bloodGroup', e.target.value)} style={inputStyle}
                            onFocus={e => e.target.style.borderColor = '#10b981'} onBlur={e => e.target.style.borderColor = '#e5e7eb'}>
                            <option value="">Select</option>
                            {bloodGroups.map(b => <option key={b}>{b}</option>)}
                          </select>
                        </div>
                        <div>
                          <label style={labelStyle}>City</label>
                          <input type="text" value={form.city} onChange={e => update('city', e.target.value)} style={inputStyle} placeholder="Your city"
                            onFocus={e => e.target.style.borderColor = '#10b981'} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <label style={labelStyle}>Specialization</label>
                          <select value={form.specialization} onChange={e => update('specialization', e.target.value)} style={inputStyle} required
                            onFocus={e => e.target.style.borderColor = '#10b981'} onBlur={e => e.target.style.borderColor = '#e5e7eb'}>
                            <option value="">Select</option>
                            {specializations.map(s => <option key={s}>{s}</option>)}
                          </select>
                        </div>
                        <div>
                          <label style={labelStyle}>Years of Experience</label>
                          <input type="number" value={form.yearsOfExperience} onChange={e => update('yearsOfExperience', e.target.value)} style={inputStyle} placeholder="e.g. 10"
                            onFocus={e => e.target.style.borderColor = '#10b981'} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
                        </div>
                        <div>
                          <label style={labelStyle}>Medical License Number</label>
                          <input type="text" value={form.medicalLicenseNumber} onChange={e => update('medicalLicenseNumber', e.target.value)} style={inputStyle} placeholder="License #"
                            onFocus={e => e.target.style.borderColor = '#10b981'} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
                        </div>
                        <div>
                          <label style={labelStyle}>Consultation Fee ($)</label>
                          <input type="number" value={form.consultationFee} onChange={e => update('consultationFee', e.target.value)} style={inputStyle} placeholder="e.g. 50"
                            onFocus={e => e.target.style.borderColor = '#10b981'} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
                        </div>
                        <div>
                          <label style={labelStyle}>City</label>
                          <input type="text" value={form.city} onChange={e => update('city', e.target.value)} style={inputStyle} placeholder="Your city"
                            onFocus={e => e.target.style.borderColor = '#10b981'} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
                        </div>
                        <div>
                          <label style={labelStyle}>Profile Photo URL</label>
                          <input type="url" value={form.profilePhoto} onChange={e => update('profilePhoto', e.target.value)} style={inputStyle} placeholder="https://..."
                            onFocus={e => e.target.style.borderColor = '#10b981'} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
                        </div>
                      </>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 28, gap: 12 }}>
                <button type="button" onClick={() => { setStep(0); setError('') }}
                  style={{ padding: '11px 24px', borderRadius: 10, border: '1.5px solid #e5e7eb', background: '#fff', color: '#374151', fontWeight: 600, fontSize: 14, cursor: 'pointer', transition: 'all 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = '#10b981'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = '#e5e7eb'}>
                  ← Back
                </button>
                <button type="submit" disabled={loading}
                  style={{ padding: '11px 28px', borderRadius: 10, border: 'none', background: loading ? '#6ee7b7' : 'linear-gradient(135deg, #059669 0%, #10b981 100%)', color: '#fff', fontWeight: 700, fontSize: 14, cursor: loading ? 'not-allowed' : 'pointer', boxShadow: '0 4px 14px rgba(16,185,129,0.35)', transition: 'all 0.2s' }}
                  onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(16,185,129,0.45)' }}}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(16,185,129,0.35)' }}>
                  {loading ? 'Creating...' : 'Create Account →'}
                </button>
              </div>
            </form>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '24px 0' }}>
            <div style={{ flex: 1, height: 1, background: '#e5e7eb' }} />
            <span style={{ fontSize: 12, color: '#9ca3af' }}>Already registered?</span>
            <div style={{ flex: 1, height: 1, background: '#e5e7eb' }} />
          </div>

          <p style={{ textAlign: 'center' }}>
            <Link to={`/login?role=${role.toLowerCase()}`}
              style={{ color: '#9ca3af', fontSize: 14, textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => e.target.style.color = '#10b981'}
              onMouseLeave={e => e.target.style.color = '#9ca3af'}>
              Sign in to your account <span style={{ color: '#10b981' }}>→</span>
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}