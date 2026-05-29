import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import GlassCard from '../ui/GlassCard'
import AnimatedCounter from '../ui/AnimatedCounter'
import { useAuth } from '../../context/AuthContext'
import { usePolling } from '../../hooks/useData'
import { useWebSocket } from '../../hooks/useWebSocket'
import { dashboardAPI, fileAPI, publicAPI, appointmentAPI } from '../../utils/api'
import MagneticButton from '../ui/MagneticButton'
import DragDropUpload from '../ui/DragDropUpload'
import { useNavigate } from 'react-router-dom'
import FloatingParticles from '../three/FloatingParticles'

const statusLabel = { COMPLETED: 'Completed', IN_PROGRESS: 'Live', CONFIRMED: 'Confirmed', PENDING: 'Pending', CANCELLED: 'Cancelled' }
const statusBadge = (s) => `text-xs px-2 py-1 rounded-full ${
  s === 'COMPLETED' ? 'bg-green-50 text-green-600' :
  s === 'CONFIRMED' ? 'bg-primary/10 text-primary' :
  s === 'PENDING' ? 'bg-amber-50 text-amber-600' :
  s === 'IN_PROGRESS' ? 'bg-primary/10 text-primary animate-pulse' :
  s === 'CANCELLED' ? 'bg-black/5 text-text-tertiary' :
  'bg-black/5 text-text-tertiary'
}`

export default function PatientDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')
  const { data: dashData, refetch } = usePolling(() => dashboardAPI.getPatient(), 15000)
  const { connected } = useWebSocket('/topic/vitals', () => { refetch() })

  const menu = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'consultations', label: 'Consultations', icon: '🎥' },
    { id: 'records', label: 'Health Records', icon: '📋' },
    { id: 'prescriptions', label: 'Prescriptions', icon: '💊' },
    { id: 'find-doctors', label: 'Find Doctors', icon: '🔍' },
    { id: 'ai-assistant', label: 'AI Assistant', icon: '🤖' },
  ]

  const cards = [
    { label: 'Upcoming Appointments', value: dashData?.upcomingAppointments || 0, icon: '📅', color: 'from-primary' },
    { label: 'Medical Records', value: dashData?.medicalRecords || 0, icon: '📋', color: 'from-secondary' },
    { label: 'Active Prescriptions', value: dashData?.activePrescriptions || 0, icon: '💊', color: 'from-accent' },
    { label: 'Health Score', value: dashData?.healthScore || 0, suffix: '%', icon: '❤️', color: 'from-primary' },
  ]

  const recentAppts = dashData?.recentConsultations || []

  const renderOverview = () => (
    <>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary">Welcome back, {user?.name || 'Patient'}</h1>
        <p className="text-text-tertiary text-sm">Live data synced via WebSocket · {new Date().toLocaleTimeString()}</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((card, i) => (
          <motion.div key={card.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <GlassCard className="p-5 depth-card" depth>
              <div className="flex items-center justify-between mb-3">
                <span className="text-lg">{card.icon}</span>
                <span className="badge-premium text-[10px]">Live</span>
              </div>
              <div className="stat-premium">
                <AnimatedCounter end={card.value} suffix={card.suffix || ''} />
              </div>
              <div className="stat-label mt-1">{card.label}</div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <GlassCard className="p-6 depth-card" depth>
            <h3 className="font-semibold text-text-primary mb-4">Recent Consultations</h3>
            {recentAppts.length === 0 ? (
              <div className="text-sm text-text-tertiary text-center py-8">No consultations yet. Book your first one!</div>
            ) : (
              recentAppts.slice(0, 5).map((apt, i) => (
                <div key={i} className="flex items-center justify-between py-3 border-b border-black/[0.03] last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-xs font-bold text-white">
                      {apt.doctorName?.split(' ')[1]?.[0] || '?'}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-text-primary">{apt.doctorName || 'Doctor'}</div>
                      <div className="text-xs text-text-tertiary">{apt.type || apt.symptoms || 'Consultation'} · {new Date(apt.date || apt.appointmentTime).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={statusBadge(apt.status)}>{statusLabel[apt.status] || apt.status}</span>
                    {(apt.status === 'IN_PROGRESS' || apt.status === 'CONFIRMED') && apt.meetingRoomId && (
                      <button onClick={() => navigate(`/video-consultation/${apt.id}`)}
                        className="text-[10px] px-2 py-1 rounded bg-gradient-to-r from-primary to-secondary text-white font-medium">
                        Join
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
            {recentAppts.length > 0 && (
              <button onClick={() => setActiveTab('consultations')} className="w-full mt-4 text-sm text-primary/60 hover:text-primary transition-colors text-center">
                View All Consultations →
              </button>
            )}
          </GlassCard>
        </div>

        <GlassCard className="p-6 depth-card" depth>
          <h3 className="font-semibold text-text-primary mb-4">Quick Actions</h3>
          <div className="space-y-2">
            {[
              { label: 'Find a Doctor', icon: '🔍', color: 'from-primary to-secondary', path: '#find-doctors' },
              { label: 'Check Symptoms', icon: '🔍', color: 'from-secondary to-accent', path: '/ai-assistant' },
              { label: 'View Records', icon: '📋', color: 'from-accent to-primary', path: '#records' },
              { label: 'Emergency', icon: '🚨', color: 'from-red-500 to-red-700', path: '#emergency' },
            ].map((action) => {
              const handleClick = () => {
                if (action.path === '#records') setActiveTab('records')
                else if (action.path === '#find-doctors') setActiveTab('find-doctors')
                else if (action.path === '#emergency') window.location.href = '/#emergency'
                else if (action.path.startsWith('/#')) window.location.href = action.path
                else navigate(action.path)
              }
              return (
              <button key={action.label} onClick={handleClick}
                className={`w-full p-3 rounded-xl bg-gradient-to-r ${action.color} opacity-80 hover:opacity-100 transition-opacity text-sm font-medium text-left flex items-center gap-3 text-white`}
              >
                <span>{action.icon}</span>
                {action.label}
              </button>)
            })}
          </div>
        </GlassCard>
      </div>
    </>
  )

  // Rest of the component functions remain the same as before but with white theme class names
  const renderConsultations = () => {
    const all = dashData?.allConsultations || []
    return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2 className="text-xl font-bold text-text-primary mb-6">Consultation History</h2>
      {all.length === 0 ? (
        <GlassCard className="p-12 text-center">
          <p className="text-text-tertiary">No consultations yet</p>
          <button onClick={() => setActiveTab('find-doctors')} className="mt-4 text-sm text-primary hover:text-primary/80 transition-colors">
            Find a Doctor →
          </button>
        </GlassCard>
      ) : (
        <div className="space-y-3">
          {all.map((apt) => (
            <GlassCard key={apt.id} className="p-5 depth-card" depth>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                    apt.status === 'COMPLETED' ? 'bg-green-50 text-green-600' :
                    apt.status === 'IN_PROGRESS' ? 'bg-primary/10 text-primary animate-pulse' :
                    'bg-black/5 text-text-tertiary'
                  }`}>
                    {apt.status === 'IN_PROGRESS' ? '●' : apt.status === 'COMPLETED' ? '✓' : apt.id}
                  </div>
                  <div>
                    <div className="font-medium text-text-primary">{apt.doctorName || 'Consultation'}</div>
                    <div className="text-xs text-text-tertiary">
                      {apt.symptoms || 'General'} · {new Date(apt.date).toLocaleDateString()} {new Date(apt.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    {apt.notes && <div className="text-xs text-text-tertiary/70 mt-1">{apt.notes}</div>}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={statusBadge(apt.status)}>{statusLabel[apt.status] || apt.status}</span>
                  {(apt.status === 'IN_PROGRESS' || apt.status === 'CONFIRMED') && apt.meetingRoomId && (
                    <button onClick={() => navigate(`/video-consultation/${apt.id}`)}
                      className="px-3 py-1.5 text-xs rounded-full bg-gradient-to-r from-primary to-secondary text-white font-medium">
                      Join
                    </button>
                  )}
                  {apt.status === 'COMPLETED' && (
                    <button onClick={() => navigate(`/video-consultation/${apt.id}`)}
                      className="px-3 py-1.5 text-xs rounded-full bg-black/5 border border-black/10 text-text-tertiary hover:text-text-primary transition-colors">
                      View
                    </button>
                  )}
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </motion.div>
  )}

  const renderRecords = () => {
    const vitals = dashData?.vitalsHistory || []
    const docs = dashData?.documents || []
    const handleUpload = async (file) => {
      try {
        await fileAPI.upload(file, 'health-report')
        refetch()
      } catch {}
    }
    const handleDelete = async (id) => {
      try {
        await fileAPI.delete(id)
        refetch()
      } catch {}
    }
    const handleDownload = async (id) => {
      try {
        await fileAPI.downloadFile(id)
      } catch {}
    }
    const formatSize = (bytes) => {
      if (bytes < 1024) return bytes + ' B'
      if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB'
      return (bytes / 1048576).toFixed(1) + ' MB'
    }
    return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2 className="text-xl font-bold text-text-primary mb-6">Health Records</h2>

      <GlassCard className="p-5 mb-6 depth-card" depth>
        <h3 className="text-sm font-semibold mb-3 text-text-primary">Upload Report</h3>
        <DragDropUpload onFileSelect={handleUpload} accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" />
      </GlassCard>

      <GlassCard className="p-5 mb-6 depth-card" depth>
        <h3 className="text-sm font-semibold mb-3 text-text-primary">Uploaded Documents ({docs.length})</h3>
        {docs.length === 0 ? (
          <p className="text-sm text-text-tertiary text-center py-6">No documents uploaded yet. Drag & drop your medical reports above.</p>
        ) : (
          <div className="space-y-2">
            {docs.map((doc) => (
              <div key={doc.id}
                className="flex items-center gap-3 p-3 rounded-xl bg-bg-subtle hover:bg-bg-light transition-colors group">
                <a href="#" onClick={(e) => { e.preventDefault(); handleDownload(doc.id) }}
                  className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-sm">
                    📄
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-text-primary truncate group-hover:text-primary transition-colors">{doc.fileName}</div>
                    <div className="text-xs text-text-tertiary">{formatSize(doc.fileSize)} · {new Date(doc.uploadedAt).toLocaleDateString()}</div>
                  </div>
                  <span className="text-xs text-text-tertiary group-hover:text-primary/60 transition-colors">↓</span>
                </a>
                <button onClick={() => handleDelete(doc.id)}
                  className="w-7 h-7 rounded-full bg-red-50 hover:bg-red-100 flex items-center justify-center text-xs text-red-500 transition-colors flex-shrink-0">
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </GlassCard>

      <h3 className="text-sm font-semibold mb-3 text-text-primary">Vitals History</h3>
      {vitals.length === 0 ? (
        <GlassCard className="p-12 text-center">
          <p className="text-text-tertiary">No vitals recorded yet. They will appear here after your first consultation.</p>
        </GlassCard>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-xs text-text-tertiary border-b border-black/[0.04]">
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">Heart Rate</th>
                <th className="pb-3 font-medium">Blood Pressure</th>
                <th className="pb-3 font-medium">O₂ Sat</th>
                <th className="pb-3 font-medium">Temperature</th>
                <th className="pb-3 font-medium">Blood Sugar</th>
              </tr>
            </thead>
            <tbody>
              {vitals.map((v) => (
                <tr key={v.id} className="border-b border-black/[0.03] text-sm hover:bg-bg-subtle transition-colors">
                  <td className="py-3 text-text-secondary">{new Date(v.recordedAt).toLocaleDateString()}</td>
                  <td className="py-3 text-text-primary">{v.heartRate} <span className="text-xs text-text-tertiary">bpm</span></td>
                  <td className="py-3 text-text-primary">{v.bloodPressureSystolic}/{v.bloodPressureDiastolic}</td>
                  <td className="py-3 text-text-primary">{v.oxygenSaturation}%</td>
                  <td className="py-3 text-text-primary">{v.temperature}°C</td>
                  <td className="py-3 text-text-primary">{v.bloodSugar} <span className="text-xs text-text-tertiary">mg/dL</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  )}

  const renderPrescriptions = () => {
    const prescriptions = dashData?.prescriptions || []
    return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2 className="text-xl font-bold text-text-primary mb-6">Prescriptions</h2>
      {prescriptions.length === 0 ? (
        <GlassCard className="p-12 text-center">
          <p className="text-text-tertiary">No prescriptions yet.</p>
        </GlassCard>
      ) : (
        <div className="space-y-3">
          {prescriptions.map((p) => (
            <GlassCard key={p.id} className="p-5 depth-card" depth>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-xs font-bold text-white">
                    {p.doctorName?.[0] || 'D'}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-text-primary">{p.doctorName || 'Doctor'}</div>
                    <div className="text-xs text-text-tertiary">{new Date(p.prescribedAt).toLocaleDateString()}</div>
                  </div>
                </div>
                <span className="badge-premium text-[10px]">Active</span>
              </div>
              {p.medications && (
                <div className="mb-2">
                  <div className="text-xs text-text-tertiary mb-1">Medications</div>
                  <div className="text-sm text-text-primary whitespace-pre-wrap">{p.medications}</div>
                </div>
              )}
              {p.instructions && (
                <div className="mb-2">
                  <div className="text-xs text-text-tertiary mb-1">Instructions</div>
                  <div className="text-sm text-text-secondary whitespace-pre-wrap">{p.instructions}</div>
                </div>
              )}
              {p.notes && (
                <div>
                  <div className="text-xs text-text-tertiary mb-1">Notes</div>
                  <div className="text-sm text-text-tertiary italic">{p.notes}</div>
                </div>
              )}
            </GlassCard>
          ))}
        </div>
      )}
    </motion.div>
  )}

  const [doctors, setDoctors] = useState([])
  const [doctorsLoading, setDoctorsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [specialtyFilter, setSpecialtyFilter] = useState('')
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [symptoms, setSymptoms] = useState('')
  const [booking, setBooking] = useState(false)
  const [bookingMsg, setBookingMsg] = useState('')
  const [lastBookingId, setLastBookingId] = useState(null)

  const { connected: wsConnected } = useWebSocket('/topic/appointments', (msg) => {
    if (!lastBookingId) return
    const data = msg.data || msg
    if (data.id === lastBookingId && data.status === 'CONFIRMED') {
      setBookingMsg('Doctor accepted! Launching consultation...')
      setTimeout(() => {
        setSelectedDoctor(null)
        setLastBookingId(null)
        navigate(`/video-consultation/${data.id}`)
      }, 1500)
    }
  })

  const fetchDoctors = async () => {
    setDoctorsLoading(true)
    try {
      const res = await publicAPI.getDoctors()
      setDoctors(res.data || [])
    } catch {} finally {
      setDoctorsLoading(false)
    }
  }

  useEffect(() => { fetchDoctors() }, [])

  const handleBook = async () => {
    if (!user) { navigate('/login'); return }
    setBooking(true)
    setBookingMsg('')
    try {
      const res = await appointmentAPI.book({ doctorId: selectedDoctor.id, symptoms })
      const appointment = res.data
      setLastBookingId(appointment.id)
      setBookingMsg('Appointment requested! Waiting for doctor to confirm...')
      setSymptoms('')
    } catch (err) {
      setBookingMsg(err.response?.data?.message || 'Booking failed. Try again.')
    } finally {
      setBooking(false)
    }
  }

  const specializations = [...new Set((doctors || []).map(d => d.specialization).filter(Boolean))]
  const filteredDoctors = (doctors || []).filter(d => {
    const matchesSearch = !searchTerm || d.name?.toLowerCase().includes(searchTerm.toLowerCase()) || d.specialization?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSpecialty = !specialtyFilter || d.specialization === specialtyFilter
    return matchesSearch && matchesSpecialty
  })

  const renderFindDoctors = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2 className="text-xl font-bold text-text-primary mb-6">Find a Doctor</h2>

      <GlassCard className="p-5 mb-6 depth-card" depth>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name or specialization..."
              className="input-premium w-full pl-10" />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary text-sm">🔍</span>
          </div>
          <select value={specialtyFilter} onChange={(e) => setSpecialtyFilter(e.target.value)}
            className="input-premium min-w-[160px]">
            <option value="">All Specialties</option>
            {specializations.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </GlassCard>

      {doctorsLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="bg-white/80 backdrop-blur border border-black/[0.04] shadow-premium-lg rounded-2xl p-6 animate-pulse">
              <div className="w-16 h-16 bg-black/5 rounded-2xl mx-auto mb-4" />
              <div className="h-4 bg-black/5 rounded w-3/4 mx-auto mb-2" />
              <div className="h-3 bg-black/3 rounded w-1/2 mx-auto mb-3" />
              <div className="h-10 bg-black/3 rounded-xl" />
            </div>
          ))}
        </div>
      ) : filteredDoctors.length === 0 ? (
        <GlassCard className="p-12 text-center">
          <p className="text-text-tertiary">No doctors match your search criteria.</p>
          <button onClick={() => { setSearchTerm(''); setSpecialtyFilter('') }}
            className="mt-4 text-sm text-primary hover:text-primary/80 transition-colors">Clear Filters</button>
        </GlassCard>
      ) : (
        <>
          <p className="text-sm text-text-tertiary mb-4">{filteredDoctors.length} doctor{filteredDoctors.length !== 1 ? 's' : ''} found</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doc, i) => (
              <motion.div key={doc.id || i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                <GlassCard className="p-6 text-center cursor-pointer depth-card" depth onClick={() => setSelectedDoctor(doc)}>
                  <img src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=120&h=120&fit=crop&crop=face" alt="" className="w-20 h-20 rounded-2xl object-cover mx-auto mb-4 shadow-premium" />
                  <h3 className="font-semibold text-lg mb-1 text-text-primary">{doc.name}</h3>
                  <p className="text-sm text-primary mb-3">{doc.specialization}</p>
                  <div className="flex items-center justify-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={`text-sm ${i < Math.floor(doc.rating || 0) ? 'text-amber-400' : 'text-black/10'}`}>★</span>
                    ))}
                    <span className="text-xs text-text-tertiary ml-1">{(doc.rating || 0).toFixed(1)}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-text-tertiary mb-4">
                    <span>{(doc.patientsCount || 0).toLocaleString()} patients</span>
                    <span className={doc.online ? 'text-green-500' : 'text-black/20'}>● {doc.online ? 'Online' : 'Offline'}</span>
                  </div>
                  <div onClick={(e) => e.stopPropagation()}>
                    <MagneticButton variant="secondary" size="sm" className="w-full" onClick={() => setSelectedDoctor(doc)}>
                      Book Consultation
                    </MagneticButton>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </>
      )}

      <AnimatePresence>
        {selectedDoctor && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/30 backdrop-blur-md"
            onClick={() => setSelectedDoctor(null)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()} className="w-full max-w-md">
              <GlassCard className="p-6" depth>
                <h3 className="text-lg font-bold text-text-primary mb-1">Book Consultation</h3>
                <p className="text-sm text-text-tertiary mb-2">with {selectedDoctor.name}</p>
                <p className="text-xs text-text-tertiary/70 mb-6">{selectedDoctor.specialization}</p>
                <textarea value={symptoms} onChange={(e) => setSymptoms(e.target.value)}
                  placeholder="Describe your symptoms..."
                  className="input-premium w-full min-h-[100px] mb-4 resize-none" />
                {bookingMsg && (
                  <div className={`text-sm mb-4 p-3 rounded-xl ${bookingMsg.includes('failed') || bookingMsg.includes('error') ? 'text-red-500 bg-red-50 border border-red-200' : 'text-green-600 bg-green-50 border border-green-200'}`}>
                    {bookingMsg}
                  </div>
                )}
                <div className="flex gap-3">
                  <MagneticButton variant="secondary" size="sm" className="flex-1" onClick={() => setSelectedDoctor(null)}>Cancel</MagneticButton>
                  <MagneticButton variant="primary" size="sm" className="flex-1" onClick={handleBook} disabled={booking}>
                    {booking ? 'Booking...' : 'Confirm Booking'}
                  </MagneticButton>
                </div>
              </GlassCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )

  return (
    <div className="min-h-screen bg-bg-light relative">
      <div className="absolute inset-0 pointer-events-none mesh-gradient opacity-30" />
      <FloatingParticles count={800} color="#0ea5e9" size={0.008} spread={3} opacity={0.08} />

      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-2xl border-b border-black/[0.04] shadow-premium">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <span className="font-semibold text-sm text-text-primary">Patient Dashboard</span>
            {connected && <span className="w-2 h-2 rounded-full bg-green-500" title="Live connected" />}
          </div>
          <div className="flex items-center gap-4">
            <span className="badge-premium text-[10px]">
              <span className="live-dot" />
              Live
            </span>
            <div className="text-xs text-text-tertiary">{user?.email}</div>
            <button onClick={logout} className="text-xs text-text-tertiary hover:text-text-primary transition-colors">Sign Out</button>
            <button onClick={() => navigate('/profile/settings')} className="text-xs text-text-tertiary hover:text-text-primary transition-colors">Settings</button>
          </div>
        </div>
      </nav>

      <div className="relative z-10 pt-16 flex">
        <aside className="hidden lg:flex flex-col w-64 h-[calc(100vh-64px)] sticky top-16 border-r border-black/[0.04] bg-white/40 backdrop-blur-sm p-4 gap-1">
          {menu.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); if (item.id === 'ai-assistant') navigate('/ai-assistant') }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${
                activeTab === item.id
                  ? 'bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border border-primary/20 shadow-premium'
                  : 'text-text-tertiary hover:text-text-primary hover:bg-black/[0.02]'
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </aside>

        <main className="flex-1 p-6 max-w-7xl">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'consultations' && renderConsultations()}
          {activeTab === 'records' && renderRecords()}
          {activeTab === 'prescriptions' && renderPrescriptions()}
          {activeTab === 'find-doctors' && renderFindDoctors()}
        </main>
      </div>
    </div>
  )
}
