import { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useScrollAnimation } from '../../hooks/useScrollAnimation'
import { dashboardAPI } from '../../utils/api'
import GlassCard from '../ui/GlassCard'

export default function LiveDashboard() {
  const ref = useRef(null)
  useScrollAnimation(ref, { animation: 'fadeUp', duration: 1 })
  const [dashData, setDashData] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('mediconnect_token')
    if (token) {
      dashboardAPI.getPatient().then(r => setDashData(r.data)).catch(() => {})
    }
  }, [])

  const vitals = dashData?.vitals
  const appointments = dashData?.recentConsultations || []

  return (
    <section id="dashboard" ref={ref} className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50/40 via-white to-sky-50/40" />
      <div className="absolute inset-0 mesh-gradient opacity-40" />
      <div className="absolute top-20 right-20 w-[500px] h-[500px] bg-blue-100/20 rounded-full blur-[140px]" />
      <div className="absolute bottom-20 left-20 w-[450px] h-[450px] bg-sky-100/20 rounded-full blur-[120px]" />
      <div className="absolute top-1/3 left-1/3 w-40 h-40 border border-blue-200/40 rounded-full animate-float-slow" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="badge-premium mb-4 inline-flex">
            <span className="live-dot" />
            Live Dashboard
          </motion.span>
          <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} className="font-display text-4xl md:text-5xl font-bold mb-4">
            Your Health at a <span className="gradient-text">Glance</span>
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="text-text-tertiary max-w-xl mx-auto">
            Real-time monitoring dashboard with AI-powered insights
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} className="lg:col-span-2">
            <GlassCard className="p-6 depth-card" depth borderGlow>
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-text-primary">Live Vitals Monitor</h3>
                <span className="flex items-center gap-2 text-xs text-green-500">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  Real-time
                </span>
              </div>
              {vitals ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Heart Rate', value: vitals.heartRate, unit: 'bpm', sub: 'Heart Rate', gradient: 'from-primary/30' },
                    { label: 'Blood Pressure', value: vitals.bloodPressure, unit: 'mmHg', sub: 'Blood Pressure', gradient: 'from-secondary/30' },
                    { label: 'O2 Saturation', value: vitals.oxygenSaturation, unit: '%', sub: 'O2 Saturation', gradient: 'from-accent/30' },
                    { label: 'Temperature', value: vitals.temperature, unit: '°C', sub: 'Temp', gradient: 'from-warm/30' },
                  ].map((v, i) => (
                    <div key={i} className="bg-white/80 backdrop-blur border border-black/[0.04] shadow-premium rounded-xl p-4 text-center group hover:shadow-premium-lg transition-all duration-300">
                      <span className="stat-premium text-xl">{v.value || '-'}</span>
                      <span className="stat-label block mt-1">{v.unit}</span>
                      <span className="text-[10px] text-text-tertiary mt-1 block">{v.sub}</span>
                      <div className={`mt-2 h-0.5 w-full bg-gradient-to-r ${v.gradient} to-transparent rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-500`} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-text-tertiary text-center py-12 bg-bg-subtle rounded-xl">
                  Sign in to see your live vitals
                </div>
              )}
            </GlassCard>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }}>
            <GlassCard className="p-6 h-full depth-card" depth borderGlow>
              <h3 className="font-semibold text-text-primary mb-4">Recent Consultations</h3>
              {appointments.length === 0 ? (
                <div className="text-sm text-text-tertiary text-center py-12">No consultations yet</div>
              ) : (
                <div className="space-y-3">
                  {appointments.slice(0, 4).map((apt, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-bg-subtle transition-colors group"
                    >
                      <div className={`w-2 h-2 rounded-full ${
                        apt.status === 'COMPLETED' ? 'bg-green-500' :
                        apt.status === 'IN_PROGRESS' ? 'bg-primary animate-pulse' :
                        apt.status === 'PENDING' ? 'bg-amber-400' :
                        'bg-black/20'
                      }`} />
                      <div className="flex-1">
                        <div className="text-sm text-text-primary">{apt.doctorName || apt.patientName}</div>
                        <div className="text-xs text-text-tertiary">{apt.type || 'Consultation'}</div>
                      </div>
                      <span className={`text-[10px] px-2.5 py-1 rounded-full font-medium ${
                        apt.status === 'COMPLETED' ? 'bg-green-50 text-green-600' :
                        apt.status === 'IN_PROGRESS' ? 'bg-primary/10 text-primary' :
                        apt.status === 'PENDING' ? 'bg-amber-50 text-amber-600' :
                        'bg-black/5 text-text-tertiary'
                      }`}>
                        {apt.status === 'COMPLETED' ? 'Completed' :
                         apt.status === 'IN_PROGRESS' ? 'Live' :
                         apt.status === 'PENDING' ? 'Pending' : 'Upcoming'}
                      </span>
                    </motion.div>
                  ))}
                </div>
              )}
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
