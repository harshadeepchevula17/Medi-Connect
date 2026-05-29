import { useRef } from 'react'

export default function MagneticButton({ children, onClick, className = '', variant = 'primary', size = 'md', type = 'button', disabled = false }) {
  const ref = useRef(null)

  const onMove = (event) => {
    if (!ref.current || disabled) return
    const rect = ref.current.getBoundingClientRect()
    const offsetX = ((event.clientX - rect.left) / rect.width - 0.5) * 10
    const offsetY = ((event.clientY - rect.top) / rect.height - 0.5) * 10
    ref.current.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0)`
  }

  const onLeave = () => {
    if (!ref.current) return
    ref.current.style.transform = 'translate3d(0, 0, 0)'
  }

  const base = 'inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 select-none will-change-transform'

  const variants = {
    primary: 'bg-gradient-to-r from-[#13C2F7] via-[#4F7CFF] to-[#7A5CFF] text-white shadow-[0_10px_28px_rgba(79,124,255,0.35)] hover:shadow-[0_14px_34px_rgba(79,124,255,0.48)]',
    secondary: 'bg-[rgba(14,26,49,0.74)] text-[#d9e7ff] border border-white/15 hover:bg-[rgba(18,34,62,0.92)]',
    ghost: 'bg-transparent text-[#9bb6e6] hover:text-white hover:bg-white/10',
    outline: 'border border-[#56e8ff]/45 text-[#83f1ff] hover:bg-[#56e8ff]/10',
    'outline-dark': 'border border-white/20 text-[#9bb6e6] hover:bg-white/10 hover:text-white',
  }

  const sizes = {
    sm: 'px-4 py-2 text-xs tracking-wide',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  }

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled}
      onClick={onClick}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      <span className="flex items-center justify-center gap-2">{children}</span>
    </button>
  )
}
