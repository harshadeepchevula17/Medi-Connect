import { motion } from 'framer-motion'
import { FiMoreHorizontal, FiMessageCircle } from 'react-icons/fi'

export default function PatientList({ patients = [] }) {
  if (patients.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-slate-400">
        <FiMessageCircle className="w-8 h-8 mb-2 text-slate-300" />
        <p className="text-sm">No recent patients</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {patients.slice(0, 6).map((patient, i) => (
        <motion.div
          key={patient.id || i}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.03 }}
          className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors group cursor-pointer"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-cyan-300 flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-sm">
              {patient.name?.[0] || 'P'}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-medium text-slate-700 truncate">{patient.name || 'Unknown Patient'}</div>
              <div className="text-xs text-slate-400 truncate">
                {patient.condition || patient.type || 'General'} · {patient.lastVisit ? new Date(patient.lastVisit).toLocaleDateString() : 'Recent'}
              </div>
            </div>
          </div>
          <button className="p-1.5 rounded-lg text-slate-300 hover:text-slate-500 hover:bg-slate-100 opacity-0 group-hover:opacity-100 transition-all">
            <FiMoreHorizontal className="w-4 h-4" />
          </button>
        </motion.div>
      ))}
    </div>
  )
}
