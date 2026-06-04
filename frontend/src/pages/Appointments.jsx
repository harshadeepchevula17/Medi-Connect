import { useState } from 'react'
import { FiCalendar, FiFilter, FiSearch, FiCheck, FiX } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import EmptyState from '../components/EmptyState'
import { appointmentAPI } from '../utils/api'

const statusColors = {
  COMPLETED: 'bg-green-100 text-green-700 border-green-200',
  CONFIRMED: 'bg-blue-100 text-blue-700 border-blue-200',
  PENDING: 'bg-amber-100 text-amber-700 border-amber-200',
  IN_PROGRESS: 'bg-cyan-100 text-cyan-700 border-cyan-200 animate-pulse',
  CANCELLED: 'bg-slate-100 text-slate-500 border-slate-200',
}

const statusLabels = {
  COMPLETED: 'Completed',
  CONFIRMED: 'Confirmed',
  PENDING: 'Pending',
  IN_PROGRESS: 'In Progress',
  CANCELLED: 'Cancelled',
}

export default function Appointments({ schedule = [], onRefetch, onJoin }) {
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  const filters = ['all', 'pending', 'confirmed', 'in_progress', 'completed']

  const filtered = schedule.filter((apt) => {
    const statusMatch = filter === 'all' || apt.status?.toLowerCase().replace('_', '_') === filter
    const searchMatch = !search || apt.patientName?.toLowerCase().includes(search.toLowerCase())
    return statusMatch && searchMatch
  })

  const handleAccept = async (id) => {
    try {
      await appointmentAPI.updateStatus(id, 'CONFIRMED')
      onRefetch?.()
    } catch {}
  }

  const handleReject = async (id) => {
    try {
      await appointmentAPI.updateStatus(id, 'CANCELLED')
      onRefetch?.()
    } catch {}
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-slate-800">Appointments</h1>
        <p className="text-sm text-slate-400 mt-1">Manage your patient appointments</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm">
        <div className="p-4 border-b border-slate-100">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <div className="relative flex-1 max-w-xs">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search patients..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
              />
            </div>
            <div className="flex items-center gap-1.5 bg-slate-50 rounded-lg p-1 border border-slate-200">
              {filters.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium capitalize transition-all ${
                    filter === f
                      ? 'bg-white text-blue-600 shadow-sm border border-slate-200'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {f === 'in_progress' ? 'Live' : f}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4">
          {filtered.length === 0 ? (
            <EmptyState
              icon={FiCalendar}
              title="No appointments found"
              message={search ? 'Try a different search term' : 'No appointments match the selected filter'}
            />
          ) : (
            <div className="space-y-2">
              {filtered.map((apt, i) => (
                <motion.div
                  key={apt.id || i}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.02 }}
                  className="flex items-center justify-between p-4 rounded-xl border border-slate-200/60 hover:border-blue-200/60 hover:bg-blue-50/30 transition-all"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-cyan-300 flex items-center justify-center text-sm font-bold text-white shrink-0">
                      {apt.patientName?.[0] || '?'}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-slate-800 truncate">{apt.patientName}</div>
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400">
                        <span className="px-1.5 py-0.5 rounded bg-slate-50 border border-slate-200">{apt.type || 'General'}</span>
                        <span className="font-mono">{apt.time || '--:--'}</span>
                        {apt.date && <span>{new Date(apt.date).toLocaleDateString()}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full border ${statusColors[apt.status] || 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                      {statusLabels[apt.status] || apt.status}
                    </span>
                    {apt.status === 'PENDING' && (
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleAccept(apt.id)}
                          className="p-1.5 rounded-lg bg-green-50 border border-green-200 text-green-600 hover:bg-green-100 transition-colors"
                        >
                          <FiCheck className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleReject(apt.id)}
                          className="p-1.5 rounded-lg bg-red-50 border border-red-200 text-red-500 hover:bg-red-100 transition-colors"
                        >
                          <FiX className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                    {(apt.status === 'CONFIRMED' || apt.status === 'IN_PROGRESS') && (
                      <button
                        onClick={() => onJoin?.(apt.id)}
                        className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs font-semibold hover:shadow-lg hover:shadow-blue-500/20 transition-all"
                      >
                        {apt.status === 'IN_PROGRESS' ? 'Join' : 'Start'}
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
