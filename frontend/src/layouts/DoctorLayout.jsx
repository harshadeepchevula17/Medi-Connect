import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'

export default function DoctorLayout({ children, activeView, onNavigate, pendingCount }) {
  const { user, logout } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleSignOut = () => logout()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-white">
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_20%_35%,rgba(37,99,235,0.04),transparent_50%),radial-gradient(ellipse_at_80%_75%,rgba(6,182,212,0.03),transparent_50%)]" />

      <div className="relative flex">
        <Sidebar
          activeView={activeView}
          onNavigate={onNavigate}
          pendingCount={pendingCount}
        />

        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <motion.aside
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                transition={{ type: 'spring', damping: 25, stiffness: 250 }}
                className="w-64 h-full bg-white/95 backdrop-blur-xl border-r border-blue-100/50"
                onClick={(e) => e.stopPropagation()}
              >
                <Sidebar
                  activeView={activeView}
                  onNavigate={(id) => { onNavigate(id); setSidebarOpen(false) }}
                  pendingCount={pendingCount}
                />
              </motion.aside>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex-1 min-h-screen flex flex-col">
          <Navbar
            user={user}
            onToggleSidebar={() => setSidebarOpen(true)}
            onSignOut={handleSignOut}
          />
          <main className="flex-1 p-4 lg:p-6">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            >
              {children}
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  )
}
