import { useState } from 'react'
import { motion } from 'framer-motion'
import GlassCard from '../ui/GlassCard'
import AnimatedCounter from '../ui/AnimatedCounter'
import MagneticButton from '../ui/MagneticButton'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { usePolling } from '../../hooks/useData'
import { useWebSocket } from '../../hooks/useWebSocket'
import { dashboardAPI, appointmentAPI } from '../../utils/api'
import FloatingParticles from '../three/FloatingParticles'

const statusLabel = { COMPLETED: 'Completed', IN_PROGRESS: 'In Progress', UPCOMING: 'Upcoming', CONFIRMED: 'Upcoming', PENDING: 'Pending' }
const statusBadge = (s) => `text-xs px-2 py-1 rounded-full ${
  s === 'COMPLETED' ? 'bg-green-50 text-green-600' :
  s === 'IN_PROGRESS' ? 'bg-primary/10 text-primary' :
  s === 'UPCOMING' || s === 'CONFIRMED' ? 'bg-primary/10 text-primary' :
  s === 'PENDING' ? 'bg-amber-50 text-amber-600' :
  'bg-black/5 text-text-tertiary'
}`
const dotColor = { COMPLETED: 'bg-green-500', IN_PROGRESS: 'bg-primary animate-pulse', UPCOMING: 'bg-black/20', CONFIRMED: 'bg-primary', PENDING: 'bg-amber-400' }

export default function DoctorDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')
  const { data: dashData, refetch } = usePolling(() => dashboardAPI.getDoctor(), 10000)
  useWebSocket('/topic/appointments', () => { refetch() })

  const menu = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'requests', label: 'Requests', icon: '📩' },
    { id: 'consultations', label: 'Consultations', icon: '🎥' },
  ]

  const schedule = dashData?.schedule || []
  const pendingRequests = dashData?.pendingRequests || []

  const handleAccept = async (id) => {
    try { await appointmentAPI.updateStatus(id, 'CONFIRMED'); refetch() } catch {}
  }

  const handleReject = async (id) => {
    try { await appointmentAPI.updateStatus(id, 'CANCELLED'); refetch() } catch {}
  }

  return (
    <div className="min-h-screen bg-bg-light relative">
      <div className="absolute inset-0 pointer-events-none mesh-gradient opacity-30" />
      <FloatingParticles count={800} color="#0ea5e9" size={0.008} spread={3} opacity={0.08} />

      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-2xl border-b border-black/[0.04] shadow-premium">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary via-sky-400 to-secondary flex items-center justify-center shadow-premium">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <div>
              <span className="font-semibold text-sm text-text-primary">Doctor Dashboard</span>
              <div className="text-[10px] text-text-tertiary tracking-widest uppercase">medi-connect</div>
            </div>
          </div>
          <div className="flex items-center gap-5">
            <div className="badge-premium text-[10px]">
              <span className="live-dot" />
              Live
            </div>
            <div className="text-xs text-text-tertiary truncate max-w-[140px]">{user?.email}</div>
            <button onClick={logout} className="text-xs text-text-tertiary hover:text-text-primary transition-colors px-3 py-1.5 rounded-lg hover:bg-black/[0.02]">Sign Out</button>
            <button onClick={() => navigate('/profile/settings')} className="text-xs text-text-tertiary hover:text-text-primary transition-colors px-3 py-1.5 rounded-lg hover:bg-black/[0.02]">Settings</button>
          </div>
        </div>
      </nav>

      <div className="relative z-10 pt-16 flex">
        <aside className="hidden lg:flex flex-col w-64 h-[calc(100vh-64px)] sticky top-16 border-r border-black/[0.04] bg-white/40 backdrop-blur-sm p-4 gap-1">
          {menu.map((item) => (
            <button key={item.id} onClick={() => setActiveTab(item.id)}
              className={`relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all overflow-hidden ${
                activeTab === item.id
                  ? 'text-primary bg-primary/5 border border-primary/10 shadow-premium'
                  : 'text-text-tertiary hover:text-text-primary hover:bg-black/[0.02]'
              }`}>
              <span className="relative z-10">{item.icon}</span>
              <span className="relative z-10">{item.label}</span>
              {item.id === 'requests' && pendingRequests.length > 0 && (
                <motion.span key={pendingRequests.length} initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                  className="ml-auto relative z-10 bg-gradient-to-br from-red-500 to-red-600 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow-premium">
                  {pendingRequests.length}
                </motion.span>
              )}
            </button>
          ))}
          <div className="mt-auto p-4 rounded-xl bg-bg-subtle border border-black/[0.04]">
            <div className="text-[10px] text-text-tertiary uppercase tracking-widest mb-2">Status</div>
            <div className="flex items-center gap-2">
              <span className="live-dot" />
              <span className="text-xs text-green-600/80">All systems online</span>
            </div>
          </div>
        </aside>

        <main className="flex-1 p-6 lg:p-8 max-w-7xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="text-2xl font-bold text-text-primary">Dr. {user?.name || 'Doctor'}'s Dashboard</h1>
            <div className="flex items-center gap-3 mt-1">
              <p className="text-text-tertiary text-sm">Live data · synced via WebSocket</p>
              <span className="w-1 h-1 rounded-full bg-text-tertiary/30" />
              <p className="text-[11px] text-text-tertiary/50">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
            {[
              { label: 'Total Patients', value: dashData?.totalPatients || 0, icon: '👥' },
              { label: 'Today\'s Appointments', value: dashData?.todayAppointments || 0, icon: '📅' },
              { label: 'Pending Reviews', value: dashData?.pendingReviews || 0, icon: '📝' },
              { label: 'Avg. Rating', value: dashData?.averageRating || 0, icon: '⭐', decimals: 1 },
            ].map((card, i) => (
              <motion.div key={card.label} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}>
                <GlassCard className="p-5 depth-card" depth>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xl">{card.icon}</span>
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-green-50 border border-green-200">
                      <span className="live-dot" />
                      <span className="text-[10px] text-green-600 font-medium">Online</span>
                    </div>
                  </div>
                  <div className="stat-premium"><AnimatedCounter end={card.value} decimals={card.decimals || 0} /></div>
                  <div className="stat-label mt-1.5">{card.label}</div>
                </GlassCard>
              </motion.div>
            ))}
          </div>

          {activeTab === 'overview' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <GlassCard className="p-6 depth-card" depth>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-semibold text-lg text-text-primary">Today's Schedule</h3>
                    <span className="live-dot" />
                  </div>
                  {schedule.length === 0 ? (
                    <div className="text-sm text-text-tertiary text-center py-12 flex flex-col items-center gap-3">
                      <span className="text-2xl opacity-30">📋</span>
                      <span>No appointments scheduled</span>
                    </div>
                  ) : (
                    <div className="relative">
                      <div className="absolute left-[7px] top-3 bottom-3 w-px bg-gradient-to-b from-primary/30 via-black/5 to-transparent" />
                      {schedule.map((apt, i) => (
                        <div key={i} className="relative flex items-center justify-between py-3 pl-8 group">
                          <div className="absolute left-0 top-1/2 -translate-y-1/2">
                            <div className={`w-3.5 h-3.5 rounded-full border-2 border-white ${dotColor[apt.status] || 'bg-black/20'}`} />
                          </div>
                          <div className="flex items-center gap-4 flex-1">
                            <div>
                              <div className="text-sm font-medium text-text-primary">{apt.patientName}</div>
                              <div className="text-xs text-text-tertiary flex items-center gap-2 mt-0.5">
                                <span className="px-1.5 py-0.5 rounded bg-bg-subtle text-[10px]">{apt.type}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-text-tertiary font-mono">{apt.time}</span>
                            {apt.status === 'PENDING' ? (
                              <div className="flex gap-1.5">
                                <button onClick={() => handleAccept(apt.id)}
                                  className="w-7 h-7 rounded-lg bg-gradient-to-br from-green-500 to-green-600 text-white font-bold text-xs flex items-center justify-center hover:shadow-premium transition-shadow">
                                  ✓
                                </button>
                                <button onClick={() => handleReject(apt.id)}
                                  className="w-7 h-7 rounded-lg bg-gradient-to-br from-red-500 to-red-600 text-white font-bold text-xs flex items-center justify-center hover:shadow-premium transition-shadow">
                                  ✗
                                </button>
                              </div>
                            ) : (
                              <MagneticButton variant="secondary" size="sm"
                                onClick={() => navigate(`/video-consultation/${apt.id}`)}>
                                {apt.status === 'IN_PROGRESS' ? 'Join →' : 'View'}
                              </MagneticButton>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </GlassCard>
              </div>

              <GlassCard className="p-6 depth-card" depth>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold text-lg text-text-primary">Pending Requests</h3>
                  {pendingRequests.length > 0 && (
                    <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
                      className="badge-premium text-[10px]">
                      {pendingRequests.length} new
                    </motion.span>
                  )}
                </div>
                {pendingRequests.length === 0 ? (
                  <div className="text-sm text-text-tertiary text-center py-12 flex flex-col items-center gap-3">
                    <span className="text-2xl opacity-30">✅</span>
                    <span>No pending requests</span>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {pendingRequests.slice(0, 5).map((req, i) => (
                      <div key={i} className="p-4 rounded-xl bg-bg-subtle border border-black/[0.04] hover:border-primary/20 transition-all">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-text-primary">{req.patientName}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-200">Pending</span>
                        </div>
                        <p className="text-xs text-text-tertiary mb-3 line-clamp-2">{req.symptoms}</p>
                        <div className="flex gap-2">
                          <button onClick={() => handleAccept(req.id)}
                            className="flex-1 text-xs py-2 rounded-lg bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold hover:shadow-premium transition-all">
                            Accept
                          </button>
                          <button onClick={() => handleReject(req.id)}
                            className="flex-1 text-xs py-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold hover:shadow-premium transition-all">
                            Decline
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </GlassCard>
            </motion.div>
          )}

          {activeTab === 'requests' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <GlassCard className="p-6 depth-card" depth>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold text-lg text-text-primary">All Patient Requests</h3>
                  {pendingRequests.length > 0 && (
                    <span className="text-xs px-3 py-1 rounded-full bg-bg-subtle text-text-tertiary border border-black/[0.04]">
                      {pendingRequests.length} total
                    </span>
                  )}
                </div>
                {pendingRequests.length === 0 ? (
                  <div className="text-sm text-text-tertiary text-center py-12 flex flex-col items-center gap-3">
                    <span className="text-2xl opacity-30">📭</span>
                    <span>No pending patient requests</span>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {pendingRequests.map((req, i) => (
                      <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-bg-subtle border border-black/[0.04] hover:border-primary/20 hover:bg-white transition-all">
                        <div className="flex items-center gap-4">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-secondary/20 to-accent/20 flex items-center justify-center text-sm">👤</div>
                          <div>
                            <div className="text-sm font-medium text-text-primary">{req.patientName}</div>
                            <div className="text-xs text-text-tertiary">{req.symptoms}</div>
                            <div className="text-[10px] text-text-tertiary/50 mt-1 font-mono">{new Date(req.requestedAt).toLocaleString()}</div>
                          </div>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <button onClick={() => handleAccept(req.id)}
                            className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-green-600 text-white text-sm font-semibold hover:shadow-premium transition-all">
                            Accept
                          </button>
                          <button onClick={() => handleReject(req.id)}
                            className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-semibold hover:shadow-premium transition-all">
                            Decline
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </GlassCard>
            </motion.div>
          )}

          {activeTab === 'consultations' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <GlassCard className="p-6 depth-card" depth>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold text-lg text-text-primary">All Consultations</h3>
                  <div className="badge-premium text-[10px]">Live feed</div>
                </div>
                {schedule.length === 0 ? (
                  <div className="text-sm text-text-tertiary text-center py-12 flex flex-col items-center gap-3">
                    <span className="text-2xl opacity-30">🎥</span>
                    <span>No consultations yet</span>
                  </div>
                ) : (
                  <div className="relative">
                    <div className="absolute left-[7px] top-3 bottom-3 w-px bg-gradient-to-b from-primary/30 via-black/5 to-transparent" />
                    {schedule.map((apt, i) => (
                      <div key={i} className="relative flex items-center justify-between py-4 pl-8 group">
                        <div className="absolute left-0 top-1/2 -translate-y-1/2">
                          <div className={`w-3.5 h-3.5 rounded-full border-2 border-white ${dotColor[apt.status] || 'bg-black/20'}`} />
                        </div>
                        <div className="flex items-center gap-4 flex-1">
                          <div className="w-10 h-10 rounded-full bg-bg-subtle flex items-center justify-center text-sm border border-black/[0.04]">👤</div>
                          <div>
                            <div className="text-sm font-medium text-text-primary group-hover:text-text-primary transition-colors">{apt.patientName}</div>
                            <div className="text-xs text-text-tertiary flex items-center gap-2 mt-0.5">
                              <span>{apt.type}</span>
                              <span className="w-1 h-1 rounded-full bg-text-tertiary/30" />
                              <span>{apt.time}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {(apt.status === 'CONFIRMED' || apt.status === 'IN_PROGRESS') && (
                            <button onClick={() => navigate(`/video-consultation/${apt.id}`)}
                              className="text-xs px-4 py-1.5 rounded-lg bg-gradient-to-r from-primary to-secondary text-white font-semibold hover:shadow-glow-primary transition-all">
                              Join
                            </button>
                          )}
                          <span className={statusBadge(apt.status)}>{statusLabel[apt.status] || apt.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </GlassCard>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  )
}
