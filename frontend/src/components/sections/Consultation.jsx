import { useRef } from 'react'
import { motion } from 'framer-motion'
import { useScrollAnimation } from '../../hooks/useScrollAnimation'
import MedicalGrid from '../three/MedicalGrid'
import GlassCard from '../ui/GlassCard'

const steps = [
  { icon: 'https://img.icons8.com/fluency/48/video-call.png', title: 'Start Session', desc: 'Initiate a video consultation with a single click' },
  { icon: 'https://img.icons8.com/fluency/48/robot.png', title: 'AI Assistance', desc: 'Real-time symptom analysis during your consultation' },
  { icon: 'https://img.icons8.com/fluency/48/diagnosis.png', title: 'Smart Diagnosis', desc: 'AI-powered preliminary diagnosis & recommendations' },
  { icon: 'https://img.icons8.com/fluency/48/health-card.png', title: 'Follow-Up', desc: 'Automated care plans and medication tracking' },
]

export default function Consultation() {
  const ref = useRef(null)
  useScrollAnimation(ref, { animation: 'fadeUp', duration: 1 })

  return (
    <section ref={ref} className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-sky-50/50 via-white to-blue-50/50" />
      <div className="absolute top-20 left-10 w-[500px] h-[500px] bg-blue-100/20 rounded-full blur-[140px]" />
      <div className="absolute bottom-20 right-10 w-[450px] h-[450px] bg-sky-100/20 rounded-full blur-[120px]" />
      <div className="absolute top-0 left-0 w-full h-full opacity-20">
        <MedicalGrid />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="badge-premium mb-4 inline-flex">
              <span className="live-dot" />
              Real-Time Care
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold leading-tight mb-6">
              Consult Anytime,{' '}
              <span className="gradient-text">Anywhere</span>
            </h2>
            <p className="text-lg text-text-tertiary mb-10 leading-relaxed font-light">
              HD video consultations with AI-powered real-time assistance.
              Connect with specialists instantly and receive comprehensive care.
            </p>

            <div className="flex gap-4 mb-12">
              <div className="flex -space-x-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-xs font-bold border-2 border-white shadow-glow-primary text-white">
                    {['SC', 'JW', 'PS', 'MJ'][i]}
                  </div>
                ))}
              </div>
              <div className="text-sm text-text-tertiary">
                <span className="text-text-primary font-semibold">2,000+</span> specialists available now
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-xl border border-black/[0.04] shadow-premium rounded-2xl p-4 inline-flex items-center gap-3">
              <div className="relative flex w-3 h-3">
                <span className="absolute inline-flex w-full h-full rounded-full bg-green-400 animate-ping opacity-75" />
                <span className="relative inline-flex w-3 h-3 rounded-full bg-green-400" />
              </div>
              <span className="text-sm text-text-tertiary">24/7 Available &middot; Average wait: 2 min</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-2 gap-4 relative"
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-3/4 bg-gradient-to-b from-transparent via-primary/10 to-transparent hidden lg:block" />

            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
              >
                <GlassCard className="p-5 h-full depth-card" glow={i % 2 === 0} hover depth>
                  <img src={step.icon} alt="" className="w-8 h-8 mb-3" />
                  <h3 className="font-semibold text-text-primary mb-1 text-sm">{step.title}</h3>
                  <p className="text-xs text-text-tertiary">{step.desc}</p>
                </GlassCard>
              </motion.div>
            ))}

            <div className="col-span-2 mt-2">
              <GlassCard className="p-5 bg-gradient-to-r from-primary/[0.03] to-secondary/[0.03] border-primary/10 depth-card" glow hover depth>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-glow-primary">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-text-primary">Voice-Activated Controls</div>
                    <div className="text-xs text-text-tertiary">&ldquo;Schedule my appointment&rdquo;</div>
                  </div>
                </div>
              </GlassCard>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
