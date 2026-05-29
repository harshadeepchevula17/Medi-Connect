import { motion } from 'framer-motion'
import GlassCard from '../ui/GlassCard'
import AnimatedCounter from '../ui/AnimatedCounter'
import { useAuth } from '../../context/AuthContext'
import { usePolling } from '../../hooks/useData'
import { useWebSocket } from '../../hooks/useWebSocket'
import { dashboardAPI } from '../../utils/api'
import AnimatedBackground from '../three/AnimatedBackground'
import MedicalGrid from '../three/MedicalGrid'

export default function AdminDashboard() {
  const { user, logout } = useAuth()
  const { data: dashData, refetch } = usePolling(() => dashboardAPI.getAdmin(), 10000)
  useWebSocket('/topic/dashboard', () => { refetch() })

  const systemHealth = dashData?.systemHealth || {}
  const weeklyData = dashData?.weeklyConsultations || {}

  return (
    <div className="min-h-screen bg-midnight relative">
      <AnimatedBackground className="opacity-30" />
      <MedicalGrid className="absolute inset-0 z-0 opacity-10" />
      <div className="absolute inset-0 pointer-events-none mesh-gradient opacity-20" />

      <nav className="fixed top-0 left-0 right-0 z-50 bg-midnight/80 backdrop-blur-2xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}
              className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-neon via-cyan-400 to-cyber flex items-center justify-center shadow-lg shadow-neon/20">
              <span className="text-midnight font-black text-lg tracking-tight">M</span>
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse" />
            </motion.div>
            <span className="font-semibold text-sm">Admin Console</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="badge-glow text-[10px]">
              <span className="live-dot" />
              Live
            </div>
            <div className="text-[11px] text-white/30 font-mono truncate max-w-[140px]">{user?.email}</div>
            <button onClick={logout} className="text-[11px] text-white/30 hover:text-white/80 transition-colors">Sign Out</button>
          </div>
        </div>
      </nav>

      <div className="relative z-10 pt-24 p-6 max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <h1 className="text-2xl font-bold">Admin Command Center</h1>
          <p className="text-white/30 text-sm flex items-center gap-2 mt-1">
            <span className="live-dot" />
            Real-time platform overview · WebSocket connected · System nominal
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {[
            { label: 'Total Users', value: dashData?.totalUsers || 0, icon: '👥' },
            { label: 'Active Doctors', value: dashData?.totalDoctors || 0, icon: '🧑‍⚕️' },
            { label: 'Total Patients', value: dashData?.totalPatients || 0, icon: '👤' },
            { label: 'Consultations', value: dashData?.totalConsultations || 0, icon: '🎥' },
            { label: 'Pending', value: dashData?.pendingAppointments || 0, icon: '⏳' },
          ].map((card, i) => (
            <motion.div key={card.label} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }} whileHover={{ y: -6, scale: 1.02 }}>
              <GlassCard className="p-5 depth-card relative" depth>
                <div className="flex items-center justify-between mb-3">
                  <motion.span whileHover={{ rotate: [0, -10, 10, 0] }} className="text-lg">{card.icon}</motion.span>
                  <div className={`w-6 h-6 rounded-full bg-${i < 3 ? 'green' : i < 4 ? 'cyan' : 'yellow'}-400/10 flex items-center justify-center`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${i < 3 ? 'bg-green-400' : i < 4 ? 'bg-cyan-400' : 'bg-yellow-400'}`} />
                  </div>
                </div>
                <div className="stat-premium"><AnimatedCounter end={card.value} /></div>
                <div className="stat-label">{card.label}</div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <GlassCard className="p-6 depth-card" depth>
            <div className="flex items-center gap-3 mb-6">
              <span className="live-dot" />
              <h3 className="font-semibold text-sm uppercase text-white/70">System Health</h3>
            </div>
            {Object.keys(systemHealth).length === 0 ? (
              <div className="text-sm text-white/20 text-center py-10">Loading system data...</div>
            ) : (
              <div className="space-y-3">
                {Object.entries(systemHealth).map(([key, svc], idx) => {
                  const s = svc
                  const isOperational = s?.status === 'operational'
                  return (
                    <div key={key}
                      className="flex items-center justify-between py-3 px-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-colors border border-transparent hover:border-white/[0.06]">
                      <div className="flex items-center gap-3">
                        <span className={`w-2.5 h-2.5 rounded-full ${isOperational ? 'bg-green-400' : 'bg-yellow-400'}`} />
                        <span className="text-sm capitalize font-medium text-white/70">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                      </div>
                      <div className="flex items-center gap-5">
                        <span className={`text-[11px] font-mono font-semibold ${isOperational ? 'text-green-400' : 'text-yellow-400'}`}>{s?.status}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-1.5 rounded-full bg-white/5 overflow-hidden">
                            <motion.div initial={{ width: 0 }} animate={{ width: isOperational ? '92%' : '60%' }}
                              className={`h-full rounded-full ${isOperational ? 'bg-gradient-to-r from-green-500 to-emerald-400' : 'bg-gradient-to-r from-yellow-500 to-amber-400'}`} />
                          </div>
                          <span className="text-[10px] text-white/25 font-mono">{s?.uptime}</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </GlassCard>

          <GlassCard className="p-6 depth-card" depth>
            <div className="flex items-center gap-3 mb-6">
              <span className="live-dot" />
              <h3 className="font-semibold text-sm uppercase text-white/70">Recent Activity</h3>
            </div>
            {dashData?.totalUsers === 0 && dashData?.totalConsultations === 0 ? (
              <div className="text-sm text-white/20 text-center py-10">No platform activity yet</div>
            ) : (
              <div className="text-center py-8">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 via-violet-500 to-indigo-600 flex items-center justify-center mx-auto mb-5">📊</div>
                <div>
                  <p className="text-lg font-bold text-white/80">
                    <AnimatedCounter end={dashData?.totalUsers || 0} />
                    <span className="text-white/40 ml-1.5 font-normal">total users</span>
                  </p>
                  <div className="flex items-center justify-center gap-1.5 mt-3">
                    <span className="w-1 h-1 rounded-full bg-purple-400" />
                    <p className="text-xs text-white/30 font-mono">
                      <AnimatedCounter end={dashData?.consultationsToday || 0} />
                      {' '}consultations today
                    </p>
                    <span className="w-1 h-1 rounded-full bg-purple-400" />
                  </div>
                </div>
              </div>
            )}
          </GlassCard>
        </div>

        <GlassCard className="p-6 depth-card relative overflow-hidden" depth>
          <div className="flex items-center gap-3 mb-8">
            <span className="live-dot" />
            <h3 className="font-semibold text-sm uppercase text-white/70">Weekly Consultation Volume</h3>
          </div>
          <div className="flex items-end justify-between h-48 gap-3">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => {
              const val = weeklyData[day] || 0
              const maxVal = Math.max(...Object.values(weeklyData), 1)
              const heightPct = (val / maxVal) * 100
              return (
                <div key={day} className="flex flex-col items-center gap-2 flex-1 group">
                  <span className="text-[10px] font-mono font-bold text-white/30 group-hover:text-white/60 transition-colors">{val}</span>
                  <div className="relative w-full flex-1 flex items-end">
                    <motion.div initial={{ height: 0 }} animate={{ height: `${Math.max(heightPct, 2)}%` }}
                      className="relative w-full rounded-xl bg-gradient-to-t from-cyan-600 via-cyan-500 to-cyan-400 group-hover:shadow-[0_0_25px_-5px_rgba(0,255,255,0.4)] transition-shadow" />
                  </div>
                  <span className="text-[10px] text-white/30 font-mono uppercase">{day}</span>
                </div>
              )
            })}
          </div>
          <div className="absolute bottom-3 right-6 text-[9px] text-white/[0.08] font-mono tracking-[0.2em] uppercase">L·I·V·E</div>
        </GlassCard>
      </div>
    </div>
  )
}
