import { useRef } from 'react'
import { motion } from 'framer-motion'
import { useScrollAnimation } from '../../hooks/useScrollAnimation'
import AiSphere from '../three/AiSphere'
import GlassCard from '../ui/GlassCard'
import DnaHelix from '../three/DnaHelix'

const features = [
  { icon: 'https://img.icons8.com/fluency/48/artificial-intelligence.png', title: 'AI Diagnosis', desc: 'Advanced neural networks analyze symptoms with 99% accuracy' },
  { icon: 'https://img.icons8.com/fluency/48/combo-chart.png', title: 'Predictive Analytics', desc: 'Forecast health trends before they become critical' },
  { icon: 'https://img.icons8.com/fluency/48/prescription.png', title: 'Smart Prescriptions', desc: 'AI-optimized medication plans tailored to your DNA' },
  { icon: 'https://img.icons8.com/fluency/48/health-graph.png', title: 'Health Insights', desc: 'Real-time biometric analysis with predictive warnings' },
]

export default function AiShowcase() {
  const ref = useRef(null)
  useScrollAnimation(ref, { animation: 'fadeUp', duration: 1.2 })

  return (
    <section id="ai" ref={ref} className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 via-white to-sky-50/50" />
      <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-blue-100/20 rounded-full blur-[180px]" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-sky-100/20 rounded-full blur-[160px]" />
      <div className="absolute top-1/3 left-1/4 w-80 h-80 border border-blue-200/30 rounded-full animate-float-slow" />
      <div className="absolute bottom-1/4 right-1/3 w-40 h-40 border border-blue-200/30 rounded-full animate-float-medium" />
      <div className="absolute opacity-[0.02] pointer-events-none top-10 right-1/4 w-64 h-64">
        <DnaHelix />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="badge-premium mb-4 inline-flex"
            >
              <span className="live-dot" />
              AI-Powered Platform
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6"
            >
              Intelligence That
              <span className="gradient-text"> Heals</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-lg text-text-tertiary mb-12 leading-relaxed font-light"
            >
              Our proprietary AI engine processes millions of medical data points
              per second, delivering personalized healthcare recommendations
              with unprecedented accuracy.
            </motion.p>

            <div className="grid sm:grid-cols-2 gap-4">
              {features.map((f, i) => (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i, duration: 0.6 }}
                >
                  <GlassCard className="p-5 cursor-default group depth-card" glow hover depth borderGlow>
                    <img src={f.icon} alt="" className="w-8 h-8 mb-3" />
                    <h3 className="font-semibold text-text-primary mb-1">{f.title}</h3>
                    <p className="text-sm text-text-tertiary">{f.desc}</p>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="h-[500px] lg:h-[600px] relative"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.03] via-transparent to-secondary/[0.03] rounded-full blur-[100px]" />
            <AiSphere />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
