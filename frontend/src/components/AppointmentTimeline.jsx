import { motion } from 'framer-motion'
import { FiClock, FiVideo, FiCheckCircle, FiXCircle } from 'react-icons/fi'

const statusConfig = {
  COMPLETED: { label: 'Completed', dot: 'bg-green-500', icon: FiCheckCircle, color: 'text-green-600', bg: 'bg-green-50 border-green-200' },
  IN_PROGRESS: { label: 'In Progress', dot: 'bg-blue-500 animate-pulse', icon: FiVideo, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200' },
  CONFIRMED: { label: 'Upcoming', dot: 'bg-cyan-500', icon: FiClock, color: 'text-cyan-600', bg: 'bg-cyan-50 border-cyan-200' },
  PENDING: { label: 'Pending', dot: 'bg-amber-400', icon: FiClock, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' },
  CANCELLED: { label: 'Cancelled', dot: 'bg-red-400', icon: FiXCircle, color: 'text-red-600', bg: 'bg-red-50 border-red-200' },
}

export default function AppointmentTimeline({ appointments = [], onAccept, onReject, onJoin }) {
  if (appointments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-slate-400">
        <FiClock className="w-10 h-10 mb-3 text-slate-300" />
        <p className="text-sm font-medium">No appointments scheduled</p>
        <p className="text-xs mt-1">Your schedule will appear here</p>
      </div>
    )
  }

  return (
    <div className="relative">
      <div className="absolute left-[9px] top-3 bottom-3 w-0.5 bg-gradient-to-b from-blue-200 via-slate-100 to-transparent" />
      {appointments.map((apt, i) => {
        const config = statusConfig[apt.status] || statusConfig.PENDING
        const StatusIcon = config.icon
        return (
          <motion.div
            key={apt.id || i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04 }}
            className="relative flex items-start gap-4 pb-6 last:pb-0 pl-2 group"
          >
            <div className="relative z-10 mt-1.5">
              <div className={`w-[18px] h-[18px] rounded-full border-[3px] border-white ${config.dot} shadow-sm`} />
            </div>

            <div className="flex-1 min-w-0 bg-white rounded-xl border border-slate-200/60 p-4 shadow-sm hover:shadow-md transition-all duration-200 group-hover:border-blue-200/60">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-slate-800 truncate">{apt.patientName}</span>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border ${config.bg || 'bg-slate-50 border-slate-200'} ${config.color || 'text-slate-500'}`}>
                      <StatusIcon className="w-3 h-3" />
                      {config.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="px-2 py-0.5 rounded-md bg-slate-50 border border-slate-200">{apt.type || 'General'}</span>
                    {apt.time && <span className="font-mono">{apt.time}</span>}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {apt.status === 'PENDING' && onAccept && onReject && (
                    <div className="flex gap-1">
                      <button
                        onClick={() => onAccept(apt.id)}
                        className="p-2 rounded-lg bg-green-50 border border-green-200 text-green-600 hover:bg-green-100 transition-colors"
                        title="Accept"
                      >
                        <FiCheckCircle className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onReject(apt.id)}
                        className="p-2 rounded-lg bg-red-50 border border-red-200 text-red-500 hover:bg-red-100 transition-colors"
                        title="Decline"
                      >
                        <FiXCircle className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  {(apt.status === 'CONFIRMED' || apt.status === 'IN_PROGRESS') && onJoin && (
                    <button
                      onClick={() => onJoin(apt.id)}
                      className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs font-semibold hover:shadow-lg hover:shadow-blue-500/20 transition-all"
                    >
                      {apt.status === 'IN_PROGRESS' ? 'Join Live' : 'Start'}
                    </button>
                  )}
                  {apt.status === 'COMPLETED' && (
                    <button
                      onClick={() => onJoin?.(apt.id)}
                      className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-500 text-xs font-medium hover:bg-slate-100 transition-colors"
                    >
                      View
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
