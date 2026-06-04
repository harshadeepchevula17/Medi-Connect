import { motion } from 'framer-motion'
import { FiBell, FiSearch, FiMenu } from 'react-icons/fi'

export default function Navbar({ user, onToggleSidebar, onSignOut }) {
  return (
    <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-blue-100/30 shadow-sm">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
          >
            <FiMenu className="w-5 h-5" />
          </button>
          <div className="relative hidden sm:block">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search patients, appointments..."
              className="w-72 lg:w-96 pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-50 border border-green-200 text-xs font-medium text-green-700">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-sm shadow-green-500/40" />
            Live
          </span>

          <button className="relative p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors">
            <FiBell className="w-4.5 h-4.5" />
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 shadow-sm shadow-red-500/40"
            />
          </button>

          <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-xs font-bold text-white shadow-sm">
              {user?.name?.[0] || 'D'}
            </div>
            <div className="hidden md:block">
              <div className="text-sm font-medium text-slate-700 leading-tight">Dr. {user?.name || 'Doctor'}</div>
              <div className="text-[11px] text-slate-400">{user?.email || ''}</div>
            </div>
          </div>

          <button
            onClick={onSignOut}
            className="ml-2 text-xs text-slate-400 hover:text-slate-600 transition-colors px-2.5 py-1.5 rounded-lg hover:bg-slate-50 font-medium"
          >
            Sign Out
          </button>
        </div>
      </div>
    </nav>
  )
}
