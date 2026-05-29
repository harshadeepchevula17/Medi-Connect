import { useRef } from 'react'
import { motion } from 'framer-motion'
import { useScrollAnimation } from '../../hooks/useScrollAnimation'
import { useData } from '../../hooks/useData'
import { publicAPI } from '../../utils/api'
import GlassCard from '../ui/GlassCard'

export default function Testimonials() {
  const ref = useRef(null)
  useScrollAnimation(ref, { animation: 'fadeUp', duration: 1 })
  const { data: testimonials, loading } = useData(() => publicAPI.getTestimonials(), [])

  return (
    <section ref={ref} className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 via-white to-sky-50/50" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-100/20 rounded-full blur-[180px]" />
      <div className="absolute top-10 left-10 w-32 h-32 border border-blue-200/30 rounded-full animate-float-slow" />
      <div className="absolute bottom-20 right-20 w-24 h-24 border border-sky-200/30 rounded-full animate-float-medium" />
      <div className="absolute top-1/4 right-1/4 w-16 h-16 border border-blue-200/30 rounded-full animate-float-fast" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="badge-premium badge-premium-cyber mb-4 inline-flex">Testimonials</motion.span>
          <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} className="font-display text-4xl md:text-5xl font-bold mb-4">
            Trusted by <span className="gradient-text">Thousands</span>
          </motion.h2>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-3 gap-6">
            {[1,2,3].map(i => (
              <div key={i} className="bg-white/80 backdrop-blur border border-black/[0.04] shadow-premium-lg rounded-2xl p-6 animate-pulse">
                <div className="h-3 bg-black/5 rounded w-1/4 mb-4" />
                <div className="space-y-2 mb-6">
                  <div className="h-3 bg-black/5 rounded" />
                  <div className="h-3 bg-black/5 rounded w-5/6" />
                  <div className="h-3 bg-black/5 rounded w-4/6" />
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-black/5 rounded-full" />
                  <div>
                    <div className="h-3 bg-black/5 rounded w-20 mb-1" />
                    <div className="h-2 bg-black/5 rounded w-16" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {(testimonials || []).slice(0, 3).map((t, i) => (
              <motion.div
                key={t.author + i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
              >
                <GlassCard className="p-6 h-full flex flex-col group depth-card" glow hover depth borderGlow>
                  <div className="flex gap-1 mb-4">
                    {[...Array(t.rating || 5)].map((_, i) => (
                      <span key={i} className="text-amber-400 text-sm">★</span>
                    ))}
                  </div>
                  <p className="text-sm text-text-secondary leading-relaxed flex-1 mb-6 italic">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-3 pt-4 border-t border-black/[0.04]">
                    {t.avatarUrl ? (
                      <img src={t.avatarUrl} alt={t.author} className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-xs font-bold shadow-premium text-white">
                        {t.author.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </div>
                    )}
                    <div>
                      <div className="text-sm font-semibold text-text-primary">{t.author}</div>
                      <div className="text-xs text-text-tertiary">{t.role}</div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
