import { motion } from 'framer-motion'

export default function DashboardHero({ userName, date }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-800">
            Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}, Dr. {userName || 'Doctor'}
          </h1>
          <p className="text-slate-400 text-sm mt-1">Here's your practice overview for today</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 shadow-sm text-xs text-slate-500">
            <svg className="w-3.5 h-3.5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {date}
          </span>
          <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-green-50 border border-green-200 shadow-sm text-xs font-medium text-green-700">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-sm shadow-green-500/40" />
            Live Data
          </span>
        </div>
      </div>
    </motion.div>
  )
}
