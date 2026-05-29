import { useRef } from 'react'
import { motion } from 'framer-motion'
import { useScrollAnimation } from '../../hooks/useScrollAnimation'
import GlassCard from '../ui/GlassCard'
import MagneticButton from '../ui/MagneticButton'
import { Link } from 'react-router-dom'
import AiEnergyOrb from '../three/AiEnergyOrb'

export default function AiAssistant() {
  const ref = useRef(null)
  useScrollAnimation(ref, { animation: 'scale', duration: 1.2 })

  return (
    <section ref={ref} className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50/60 via-white to-sky-50/60" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[760px] h-[760px] bg-primary/5 rounded-full blur-[220px]" />
      <div className="absolute top-12 right-20 w-52 h-52 border border-blue-200/40 rounded-full animate-float-slow" />
      <div className="absolute bottom-20 left-20 w-36 h-36 border border-sky-200/40 rounded-full animate-float-medium" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }}>
            <span className="badge-premium badge-premium-cyber mb-4 inline-flex shadow-[0_10px_24px_rgba(15,23,42,0.05)]">
              AI Assistant
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold leading-tight mb-6">
              Your Personal <span className="gradient-text">Health AI</span>
            </h2>
            <p className="text-lg text-text-tertiary mb-8 leading-relaxed">
              Meet MediAssist &mdash; your intelligent healthcare companion. 
              Available 24/7 for symptom checking, medication reminders, 
              and instant medical guidance.
            </p>
            <div className="flex flex-wrap gap-3 mb-10">
              {['Symptom Checker', 'Medication Reminder', 'Health Tips', 'Appointment Scheduling'].map((tag) => (
                <span key={tag} className="tag-premium">
                  {tag}
                </span>
              ))}
            </div>
            <Link to="/ai-assistant">
              <MagneticButton variant="primary" size="lg">Try AI Assistant</MagneticButton>
            </Link>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <GlassCard className="p-6" glow borderGlow>
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-black/[0.05]">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-sm font-bold relative z-10 text-white shadow-[0_12px_28px_rgba(37,99,235,0.22)]">
                    AI
                  </div>
                  <div className="absolute inset-0 rounded-full bg-primary/12 blur-md animate-pulse-soft" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-text-primary">MediAssist</div>
                  <div className="flex items-center gap-2 text-xs text-green-600">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Online
                  </div>
                </div>
              </div>

              <div className="space-y-4 mb-4 h-40 overflow-y-auto">
                {[
                  { text: 'Hello! I\'m MediAssist, your AI health companion. How can I help you today?', side: 'left' },
                ].map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="max-w-[80%] p-3 rounded-2xl text-sm bg-white/80 border border-black/[0.05] text-text-secondary rounded-bl-md shadow-[0_10px_20px_rgba(15,23,42,0.04)]">
                      {msg.text}
                    </div>
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="flex justify-start"
                >
                  <div className="flex gap-1 px-3 py-2 rounded-xl bg-white/75 border border-black/5 shadow-[0_8px_20px_rgba(15,23,42,0.04)]">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/20" />
                  </div>
                </motion.div>
              </div>

              <div className="flex gap-2 pt-4 border-t border-black/[0.05]">
                <input
                  type="text"
                  placeholder="Type your symptoms..."
                  className="flex-1 bg-white/90 border border-black/10 rounded-full px-4 py-2 text-sm text-text-primary placeholder:text-text-tertiary outline-none focus:border-primary/40 transition-all duration-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]"
                />
                <Link to="/ai-assistant">
                  <button className="w-9 h-9 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center hover:shadow-glow-primary transition-shadow duration-300 shadow-[0_10px_24px_rgba(37,99,235,0.2)]">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </button>
                </Link>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
