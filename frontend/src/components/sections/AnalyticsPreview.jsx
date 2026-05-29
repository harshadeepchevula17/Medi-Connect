import { useRef } from 'react'
import { motion } from 'framer-motion'
import { useScrollAnimation } from '../../hooks/useScrollAnimation'
import { useData } from '../../hooks/useData'
import { publicAPI } from '../../utils/api'
import GlassCard from '../ui/GlassCard'
import AnimatedCounter from '../ui/AnimatedCounter'

export default function AnalyticsPreview() {
  const ref = useRef(null)
  useScrollAnimation(ref, { animation: 'fadeUp', duration: 1 })
  const { data: stats } = useData(() => publicAPI.getStats(), [])

  const metrics = [
    { value: stats?.consultationsCompleted || 12456, label: 'Consultations Completed', suffix: '+', color: 'from-primary' },
    { value: stats?.aiAccuracyRate || 98, label: 'AI Accuracy Rate', suffix: '%', color: 'from-secondary', decimals: 1 },
    { value: stats?.citiesCovered || 247, label: 'Cities Covered', suffix: '+', color: 'from-accent' },
    { value: stats?.platformUptime || 99.9, label: 'Platform Uptime', suffix: '%', color: 'from-secondary', decimals: 1 },
  ]

  return (
    <section id="analytics" ref={ref} className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 via-white to-sky-50/50" />
      <div className="absolute inset-0 mesh-gradient opacity-50" />
      <div className="absolute bottom-0 right-0 w-[700px] h-[700px] bg-blue-100/20 rounded-full blur-[180px]" />
      <div className="absolute top-20 left-20 w-[500px] h-[500px] bg-sky-100/20 rounded-full blur-[140px]" />
      <div className="absolute top-1/2 right-1/4 w-32 h-32 border border-blue-200/40 rounded-full animate-float-slow" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="badge-premium badge-premium-cyber mb-4 inline-flex">
            <span className="live-dot" />
            Live Analytics
          </motion.span>
          <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} className="font-display text-4xl md:text-5xl font-bold mb-4">
            Intelligence in <span className="gradient-text">Real-Time</span>
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="text-text-tertiary max-w-xl mx-auto font-light">
            Monitor healthcare metrics with live-updating dashboards
          </motion.p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {metrics.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
            >
              <GlassCard className="p-6 text-center depth-card" glow hover depth borderGlow>
                <div className="stat-premium mb-1">
                  <AnimatedCounter end={m.value} suffix={m.suffix || ''} prefix={m.prefix || ''} decimals={m.decimals || 0} />
                </div>
                <div className="stat-label">{m.label}</div>
                <div className="mt-4 progress-premium">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: '100%' }}
                    transition={{ delay: 0.5 + i * 0.1, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                    className={`progress-premium-fill bg-gradient-to-r ${m.color} to-transparent`}
                  />
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <GlassCard className="p-8 depth-card" depth borderGlow>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-text-primary">Weekly Consultations</h3>
              <div className="flex items-center gap-2">
                <div className="relative flex w-2 h-2">
                  <span className="absolute inline-flex w-full h-full rounded-full bg-primary animate-ping opacity-75" />
                  <span className="relative inline-flex w-2 h-2 rounded-full bg-primary" />
                </div>
                <span className="text-xs text-text-tertiary">Live Data</span>
              </div>
            </div>
            <div className="flex items-end justify-between h-40 gap-3">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
                <div key={day} className="flex flex-col items-center gap-2 flex-1">
                  <motion.div
                    initial={{ height: 0 }}
                    whileInView={{ height: `${30 + Math.sin(i * 1.2) * 30 + 20}%` }}
                    transition={{ delay: i * 0.05, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full rounded-lg bg-gradient-to-t from-primary to-secondary/30 relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-white/[0.05] to-transparent" />
                  </motion.div>
                  <span className="text-xs text-text-tertiary">{day}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  )
}
