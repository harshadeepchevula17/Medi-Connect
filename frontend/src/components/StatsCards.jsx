import { motion } from 'framer-motion'
import { FiUsers, FiCalendar, FiStar, FiTrendingUp } from 'react-icons/fi'

const cards = [
  { key: 'patients', label: 'Total Patients', icon: FiUsers, color: 'from-blue-500 to-blue-600', bg: 'bg-blue-50', textColor: 'text-blue-600', ring: 'ring-blue-200' },
  { key: 'appointments', label: "Today's Appointments", icon: FiCalendar, color: 'from-cyan-500 to-cyan-600', bg: 'bg-cyan-50', textColor: 'text-cyan-600', ring: 'ring-cyan-200' },
  { key: 'reviews', label: 'Pending Reviews', icon: FiStar, color: 'from-amber-500 to-amber-600', bg: 'bg-amber-50', textColor: 'text-amber-600', ring: 'ring-amber-200' },
  { key: 'rating', label: 'Avg. Rating', icon: FiTrendingUp, color: 'from-violet-500 to-violet-600', bg: 'bg-violet-50', textColor: 'text-violet-600', ring: 'ring-violet-200' },
]

export default function StatsCards({ data }) {
  const values = {
    patients: data?.totalPatients || 0,
    appointments: data?.todayAppointments || 0,
    reviews: data?.pendingReviews || 0,
    rating: data?.averageRating || 0,
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cards.map((card, i) => {
        const Icon = card.icon
        const value = values[card.key]
        const displayValue = card.key === 'rating' ? value.toFixed(1) : value.toLocaleString()
        const suffix = card.key === 'rating' ? '' : ''

        return (
          <motion.div
            key={card.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, ease: [0.4, 0, 0.2, 1] }}
            whileHover={{ y: -3 }}
            className="group relative overflow-hidden rounded-2xl bg-white border border-slate-200/60 shadow-sm hover:shadow-md transition-all duration-300"
          >
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${card.color} opacity-[0.02]`} />
            <div className="relative p-5">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center ${card.textColor} ring-1 ${card.ring}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Today</span>
              </div>
              <div className="text-3xl font-bold text-slate-800 tabular-nums">{displayValue}{suffix}</div>
              <div className="text-sm text-slate-400 mt-1">{card.label}</div>
            </div>
            <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${card.color} scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`} />
          </motion.div>
        )
      })}
    </div>
  )
}
