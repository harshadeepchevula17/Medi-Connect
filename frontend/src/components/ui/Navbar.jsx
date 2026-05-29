import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import MagneticButton from './MagneticButton'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMobileOpen(false) }, [location])

  const isHome = location.pathname === '/'
  const links = isHome
    ? [
        { label: 'Home', href: '#hero' },
        { label: 'AI Platform', href: '#ai' },
        { label: 'Doctors', href: '#doctors' },
        { label: 'Analytics', href: '#analytics' },
        { label: 'Dashboard', href: '#dashboard' },
      ]
    : []

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-[rgba(255,255,255,0.82)] backdrop-blur-2xl border-b border-blue-100/50 shadow-premium-md' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center shadow-[0_16px_40px_rgba(37,99,235,0.18)] group-hover:shadow-[0_20px_48px_rgba(37,99,235,0.24)] transition-shadow duration-500 relative z-10">
              <span className="text-white font-bold text-sm tracking-tight">M</span>
            </div>
          </div>
          <span className="font-display text-lg font-bold tracking-tight text-text-primary">
            medi-<span className="text-primary">connect</span>
          </span>
        </Link>

        {isHome && (
          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-text-tertiary hover:text-text-primary transition-all duration-300 relative group tracking-wide font-medium"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-sky-400 transition-all duration-300 group-hover:w-full rounded-full" />
              </a>
            ))}
          </div>
        )}

        <div className="hidden md:flex items-center gap-3">
          <Link to="/login">
            <MagneticButton variant="ghost" size="sm">Sign In</MagneticButton>
          </Link>
          <Link to="/signup">
            <MagneticButton variant="primary" size="sm">Get Started</MagneticButton>
          </Link>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 relative z-50"
          aria-label="Toggle menu"
        >
          <motion.span
            animate={mobileOpen ? { rotate: 45, y: 6, width: 24 } : { rotate: 0, y: 0, width: 20 }}
            className="h-[2px] bg-text-tertiary rounded-full origin-center"
            style={{ width: 20 }}
          />
          <motion.span
            animate={mobileOpen ? { opacity: 0, x: -10 } : { opacity: 1, x: 0 }}
            className="h-[2px] bg-text-tertiary rounded-full"
            style={{ width: 16 }}
          />
          <motion.span
            animate={mobileOpen ? { rotate: -45, y: -6, width: 24 } : { rotate: 0, y: 0, width: 12 }}
            className="h-[2px] bg-text-tertiary rounded-full origin-center"
            style={{ width: 12 }}
          />
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-[rgba(37,99,235,0.06)] backdrop-blur-2xl md:hidden flex flex-col items-center justify-center"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="flex flex-col items-center gap-8 bg-white/85 backdrop-blur-2xl rounded-[2rem] border border-black/5 p-8 shadow-[0_24px_60px_rgba(15,23,42,0.12)]"
            >
              {links.length > 0 && links.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="text-xl text-text-tertiary hover:text-text-primary transition-colors tracking-wide font-medium"
                >
                  {link.label}
                </motion.a>
              ))}
              <div className="flex gap-4 mt-8">
                <Link to="/login" onClick={() => setMobileOpen(false)}>
                  <MagneticButton variant="secondary" size="md">Sign In</MagneticButton>
                </Link>
                <Link to="/signup" onClick={() => setMobileOpen(false)}>
                  <MagneticButton variant="primary" size="md">Get Started</MagneticButton>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
