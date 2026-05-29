import { useRef } from 'react'

export default function GlassCard({ children, className = '', glow = true, hover = true, depth = false, glass = 'premium', borderGlow = false, ...props }) {
  const cardRef = useRef(null)

  const handleMove = (e) => {
    if (!hover || !cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    const rotateY = (x - 0.5) * 8
    const rotateX = (0.5 - y) * 8
    cardRef.current.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(0)`
  }

  const resetTilt = () => {
    if (!cardRef.current) return
    cardRef.current.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg) translateZ(0)'
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMove}
      onMouseLeave={resetTilt}
      className={`glass-3d-card relative overflow-hidden rounded-2xl border border-white/10 bg-white/90 shadow-sm transition-transform duration-300 will-change-transform ${className}`}
      {...props}
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.13),transparent_36%,rgba(88,246,255,0.14)_68%,transparent_100%)]" />
      <div className="relative z-10">{children}</div>
    </div>
  )
}
