import { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function Footer() {
  const waveRef = useRef(null)

  useEffect(() => {
    const canvas = waveRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId

    const draw = (t) => {
      const w = canvas.width = canvas.offsetWidth
      const h = canvas.height = canvas.offsetHeight
      ctx.clearRect(0, 0, w, h)

      const gradient = ctx.createLinearGradient(0, 0, w, 0)
      gradient.addColorStop(0, 'rgba(37,99,235,0.03)')
      gradient.addColorStop(0.3, 'rgba(14,165,233,0.04)')
      gradient.addColorStop(0.6, 'rgba(59,130,246,0.03)')
      gradient.addColorStop(1, 'rgba(37,99,235,0.03)')

      ctx.beginPath()
      ctx.moveTo(0, h)
      for (let x = 0; x <= w; x++) {
        const y = h * 0.25 + 
          Math.sin(x * 0.008 + t * 0.0008) * 25 + 
          Math.sin(x * 0.015 + t * 0.0015) * 12 +
          Math.sin(x * 0.003 + t * 0.0004) * 35 +
          Math.sin(x * 0.025 + t * 0.002) * 6
        ctx.lineTo(x, y)
      }
      ctx.lineTo(w, h)
      ctx.closePath()
      ctx.fillStyle = gradient
      ctx.fill()

      animId = requestAnimationFrame(draw)
    }
    animId = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(animId)
  }, [])

  const links = [
    { title: 'Platform', items: ['AI Diagnostics', 'Telemedicine', 'Health Analytics', 'Prescriptions'] },
    { title: 'Company', items: ['About Us', 'Careers', 'Blog', 'Press Kit'] },
    { title: 'Legal', items: ['Privacy Policy', 'Terms of Service', 'HIPAA Compliance', 'Cookie Policy'] },
    { title: 'Support', items: ['Help Center', 'Contact Us', 'Community', 'Status'] },
  ]

  return (
    <footer className="relative pt-32 pb-8 overflow-hidden bg-white">
      <canvas ref={waveRef} className="absolute top-0 left-0 w-full h-40 opacity-50" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-16">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4 group">
              <div className="relative">
                <img src="/logo.png" alt="MediConnect" className="w-8 h-8 object-contain relative z-10" />
              </div>
              <span className="font-display text-lg font-bold text-text-primary">
                medi-<span className="text-primary">connect</span>
              </span>
            </Link>
            <p className="text-sm text-text-tertiary leading-relaxed mb-6 max-w-[200px]">
              The future of healthcare, today. AI-powered, human-centered.
            </p>
            <div className="flex gap-2.5">
              {[
                { icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> },
                { icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg> },
                { icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg> },
                { icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg> },
              ].map((social, i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-black/[0.03] flex items-center justify-center text-xs hover:bg-primary-subtle hover:text-primary transition-all cursor-pointer text-text-tertiary border border-black/[0.03] hover:border-primary/20">
                  {social.icon}
                </div>
              ))}
            </div>
          </div>

          {links.map((group) => (
            <div key={group.title}>
              <h4 className="text-sm font-semibold mb-4 text-text-primary">{group.title}</h4>
              <ul className="space-y-2.5">
                {group.items.map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm text-text-tertiary hover:text-primary transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-black/[0.04] flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-text-tertiary">
          <span>&copy; 2026 medi-connect. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              HIPAA Compliant
            </span>
            <span className="text-text-tertiary/30">&middot;</span>
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" /></svg>
              ISO 27001 Certified
            </span>
            <span className="text-text-tertiary/30">&middot;</span>
            <span>Made with care for better healthcare</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
