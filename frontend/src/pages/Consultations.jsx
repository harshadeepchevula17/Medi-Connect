import { useState } from 'react'
import { FiVideo, FiSearch, FiClock } from 'react-icons/fi'
import { motion } from 'framer-motion'
import EmptyState from '../components/EmptyState'

const statusConfig = {
  IN_PROGRESS: { label: 'Live', dot: 'bg-green-500 animate-pulse', pulse: true },
  CONFIRMED: { label: 'Scheduled', dot: 'bg-blue-500' },
  COMPLETED: { label: 'Completed', dot: 'bg-slate-400' },
  CANCELLED: { label: 'Cancelled', dot: 'bg-red-400' },
}

export default function Consultations({ schedule = [], onJoin }) {
  const [search, setSearch] = useState('')

  const consultations = (schedule || []).filter((apt) => {
    const isConsultation = apt.type === 'consultation' || apt.type === 'video' || apt.meetingRoomId
    return isConsultation || !apt.type
  })

  const filtered = consultations.filter((apt) =>
    !search || apt.patientName?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-slate-800">Consultations</h1>
        <p className="text-sm text-slate-400 mt-1">Video consultations and appointments</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm">
        <div className="p-4 border-b border-slate-100">
          <div className="relative max-w-xs">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search consultations..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
            />
          </div>
        </div>

        <div className="p-4">
          {filtered.length === 0 ? (
            <EmptyState
              icon={FiVideo}
              title="No consultations"
              message="Upcoming video consultations will appear here"
            />
          ) : (
            <div className="space-y-2">
              {filtered.map((apt, i) => {
                const config = statusConfig[apt.status] || { label: apt.status, dot: 'bg-slate-400' }
                return (
                  <motion.div
                    key={apt.id || i}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="flex items-center justify-between p-4 rounded-xl border border-slate-200/60 hover:border-blue-200/60 hover:bg-blue-50/30 transition-all"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white">
                          <FiVideo className="w-4 h-4" />
                        </div>
                        {config.pulse && (
                          <span className="absolute -top-0.5 -right-0.5 w-3 h-3">
                            <span className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-75" />
                            <span className="absolute inset-0 rounded-full bg-green-500" />
                          </span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-slate-800 truncate">{apt.patientName}</div>
                        <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400">
                          <span>{apt.type || 'Video Consultation'}</span>
                          {apt.time && (
                            <>
                              <span className="w-1 h-1 rounded-full bg-slate-300" />
                              <span className="font-mono">{apt.time}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500 px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200">
                        <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
                        {config.label}
                      </span>
                      {(apt.status === 'CONFIRMED' || apt.status === 'IN_PROGRESS') && (
                        <button
                          onClick={() => onJoin?.(apt.id)}
                          className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs font-semibold hover:shadow-lg hover:shadow-blue-500/20 transition-all"
                        >
                          {apt.status === 'IN_PROGRESS' ? 'Join Live' : 'Start Call'}
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
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
