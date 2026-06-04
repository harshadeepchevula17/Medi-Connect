import { motion } from 'framer-motion'
import { FiActivity, FiUserPlus, FiCalendar, FiStar } from 'react-icons/fi'

const iconMap = {
  appointment: FiCalendar,
  patient: FiUserPlus,
  review: FiStar,
  default: FiActivity,
}

const colorMap = {
  appointment: 'bg-blue-50 text-blue-600 ring-blue-200',
  patient: 'bg-green-50 text-green-600 ring-green-200',
  review: 'bg-amber-50 text-amber-600 ring-amber-200',
  default: 'bg-slate-50 text-slate-500 ring-slate-200',
}

export default function ActivityFeed({ activities = [] }) {
  if (activities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-slate-400">
        <FiActivity className="w-8 h-8 mb-2 text-slate-300" />
        <p className="text-sm">No recent activity</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {activities.slice(0, 8).map((activity, i) => {
        const type = activity.type || 'default'
        const Icon = iconMap[type] || iconMap.default
        const color = colorMap[type] || colorMap.default
        return (
          <motion.div
            key={activity.id || i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.03 }}
            className="flex items-start gap-3 group"
          >
            <div className={`w-8 h-8 rounded-xl ${color} ring-1 flex items-center justify-center shrink-0 mt-0.5`}>
              <Icon className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm text-slate-700">
                <span className="font-medium">{activity.user || 'Someone'}</span>{' '}
                {activity.action || 'performed an action'}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                {activity.time ? new Date(activity.time).toLocaleString() : 'Just now'}
              </p>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
