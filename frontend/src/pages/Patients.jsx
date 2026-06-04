import { useState } from 'react'
import { FiUsers, FiSearch, FiChevronRight, FiCalendar, FiPhone, FiMail } from 'react-icons/fi'
import { motion } from 'framer-motion'
import EmptyState from '../components/EmptyState'

export default function Patients({ patients = [] }) {
  const [search, setSearch] = useState('')

  const filtered = patients.filter((p) => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      p.name?.toLowerCase().includes(q) ||
      p.condition?.toLowerCase().includes(q) ||
      p.email?.toLowerCase().includes(q)
    )
  })

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-slate-800">Patients</h1>
        <p className="text-sm text-slate-400 mt-1">View and manage your patients</p>
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
            <span className="text-xs text-slate-400 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
              {filtered.length} {filtered.length === 1 ? 'patient' : 'patients'}
            </span>
          </div>
        </div>

        <div className="p-4">
          {filtered.length === 0 ? (
            <EmptyState
              icon={FiUsers}
              title="No patients found"
              message={search ? 'Try a different search term' : 'No patients assigned yet'}
            />
          ) : (
            <div className="divide-y divide-slate-100">
              {filtered.map((patient, i) => (
                <motion.div
                  key={patient.id || i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.015 }}
                  className="flex items-center justify-between py-3.5 px-2 hover:bg-slate-50 rounded-xl transition-colors group cursor-pointer"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-cyan-300 flex items-center justify-center text-sm font-bold text-white shrink-0">
                      {patient.name?.[0] || 'P'}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-slate-800 truncate">{patient.name || 'Unknown'}</div>
                      <div className="flex items-center gap-3 mt-0.5 text-xs text-slate-400">
                        {patient.condition && (
                          <span className="px-1.5 py-0.5 rounded bg-slate-50 border border-slate-200">{patient.condition}</span>
                        )}
                        {patient.lastVisit && (
                          <span className="flex items-center gap-1">
                            <FiCalendar className="w-3 h-3" />
                            {new Date(patient.lastVisit).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    {patient.email && (
                      <button className="p-1.5 rounded-lg text-slate-300 hover:text-blue-500 hover:bg-blue-50 transition-all">
                        <FiMail className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {patient.phone && (
                      <button className="p-1.5 rounded-lg text-slate-300 hover:text-green-500 hover:bg-green-50 transition-all">
                        <FiPhone className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <FiChevronRight className="w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100 transition-all" />
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
