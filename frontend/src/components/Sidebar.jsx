import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FiGrid, FiCalendar, FiVideo, FiStar, FiUsers, FiSettings, FiLogOut } from 'react-icons/fi'

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: FiGrid },
  { id: 'appointments', label: 'Appointments', icon: FiCalendar },
  { id: 'consultations', label: 'Consultations', icon: FiVideo },
  { id: 'reviews', label: 'Reviews', icon: FiStar },
  { id: 'patients', label: 'Patients', icon: FiUsers },
]

export default function Sidebar({ activeView, onNavigate, pendingCount }) {
  const navigate = useNavigate()
  const { logout } = useAuth()
  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen sticky top-0 bg-white/70 backdrop-blur-xl border-r border-blue-100/50 shadow-sm">
      <div className="p-5 border-b border-blue-100/30">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="MediConnect" className="w-8 h-8 object-contain" />
          <div>
            <span className="font-semibold text-sm text-slate-800">MediConnect</span>
            <div className="text-[10px] text-slate-400 tracking-widest uppercase">Doctor Portal</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = activeView === item.id
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`relative flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'text-blue-600 bg-blue-50/80 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50/60'
              }`}
            >
              <Icon className={`w-4.5 h-4.5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
              <span>{item.label}</span>
              {item.id === 'appointments' && pendingCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                  className="ml-auto bg-gradient-to-br from-red-500 to-red-600 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow-sm"
                >
                  {pendingCount}
                </motion.span>
              )}
            </button>
          )
        })}
      </nav>

      <div className="p-3 border-t border-blue-100/30 space-y-1">
        <button onClick={() => navigate('/profile/settings')} className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-50/60 transition-all">
          <FiSettings className="w-4.5 h-4.5 text-slate-400" />
          <span>Settings</span>
        </button>
        <button onClick={() => { logout(); navigate('/login') }} className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-slate-500 hover:text-red-600 hover:bg-red-50/60 transition-all">
          <FiLogOut className="w-4.5 h-4.5" />
          <span>Sign Out</span>
        </button>
      </div>

      <div className="p-4 mx-3 mb-3 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100/50">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 shadow-sm shadow-green-500/40" />
          <span className="text-xs text-green-700 font-medium">All systems online</span>
        </div>
        <div className="text-[10px] text-slate-400 mt-1 font-mono">WebSocket connected</div>
      </div>
    </aside>
  )
}
