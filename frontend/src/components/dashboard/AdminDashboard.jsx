import { useState, useEffect, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { usePolling } from '../../hooks/useData'
import { useWebSocket } from '../../hooks/useWebSocket'
import { dashboardAPI, adminAPI, appointmentAPI } from '../../utils/api'
import {
  FiUsers, FiUserCheck, FiUserPlus, FiVideo, FiClock, FiBell, FiSearch,
  FiMenu, FiLogOut, FiShield, FiActivity, FiCalendar, FiTrendingUp,
  FiBarChart2, FiServer, FiCheckCircle, FiAlertTriangle, FiCpu,
  FiDatabase, FiGlobe, FiRefreshCw, FiChevronDown, FiGrid, FiSettings,
  FiFileText, FiDollarSign, FiMail, FiTrash2, FiMapPin, FiPhone,
  FiStar, FiTool, FiAward, FiPlus, FiMoreHorizontal, FiArrowUp,
  FiArrowDown, FiPieChart, FiDownload, FiEye, FiX, FiCheck,
  FiMessageCircle,
} from 'react-icons/fi'

const navItems = [
  { id: 'overview', label: 'Overview', icon: FiGrid },
  { id: 'doctors', label: 'Doctors', icon: FiUserCheck },
  { id: 'patients', label: 'Patients', icon: FiUserPlus },
  { id: 'appointments', label: 'Appointments', icon: FiCalendar },
  { id: 'analytics', label: 'Analytics', icon: FiBarChart2 },
  { id: 'reports', label: 'Reports', icon: FiFileText },
  { id: 'billing', label: 'Billing', icon: FiDollarSign },
  { id: 'settings', label: 'Settings', icon: FiSettings },
]

const cardStyles = {
  blue: 'bg-blue-50 border-blue-200 text-blue-600',
  emerald: 'bg-emerald-50 border-emerald-200 text-emerald-600',
  violet: 'bg-violet-50 border-violet-200 text-violet-600',
  cyan: 'bg-cyan-50 border-cyan-200 text-cyan-600',
  amber: 'bg-amber-50 border-amber-200 text-amber-600',
}

function StatCard({ label, value, icon: Icon, color, delay }) {
  const key = color?.split('-')[1] || 'blue'
  const iconStyle = cardStyles[key] || cardStyles.blue
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, ease: [0.4, 0, 0.2, 1] }}
      whileHover={{ y: -4 }}
      className="group relative overflow-hidden rounded-2xl bg-white border border-slate-200/60 shadow-sm hover:shadow-md transition-all duration-300"
    >
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${color} opacity-[0.03]`} />
      <div className="relative p-5">
        <div className="flex items-center justify-between mb-4">
          <div className={`w-10 h-10 rounded-xl ${iconStyle} flex items-center justify-center border`}>
            <Icon className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Live</span>
        </div>
        <div className="text-3xl font-bold text-slate-800 tabular-nums">{value.toLocaleString()}</div>
        <div className="text-sm text-slate-400 mt-1">{label}</div>
      </div>
      <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${color} scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`} />
    </motion.div>
  )
}

function SystemHealthWidget({ systemHealth }) {
  const services = Object.entries(systemHealth)

  if (services.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400">
            <FiServer className="w-4.5 h-4.5" />
          </div>
          <h3 className="text-sm font-semibold text-slate-800">System Health</h3>
        </div>
        <div className="flex items-center justify-center py-10 text-slate-400">
          <FiRefreshCw className="w-5 h-5 animate-spin mr-2" />
          <span className="text-sm">Loading system data...</span>
        </div>
      </div>
    )
  }

  const operational = services.filter(([, s]) => s?.status === 'operational').length
  const total = services.length

  return (
    <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
            <FiServer className="w-4.5 h-4.5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-800">System Health</h3>
            <p className="text-xs text-slate-400">{operational}/{total} services operational</p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-50 border border-green-200 text-xs font-medium text-green-700">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
          {Math.round((operational / total) * 100)}% Uptime
        </span>
      </div>
      <div className="space-y-2">
        {services.map(([key, svc]) => {
          const isOperational = svc?.status === 'operational'
          const uptime = svc?.uptime || '99.9%'
          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center justify-between py-2.5 px-3.5 rounded-xl bg-slate-50/50 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className={`w-2 h-2 rounded-full ${isOperational ? 'bg-green-500' : 'bg-amber-400'}`} />
                <span className="text-sm font-medium text-slate-700 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className={`text-xs font-semibold font-mono ${isOperational ? 'text-green-600' : 'text-amber-600'}`}>
                  {svc?.status || 'unknown'}
                </span>
                <div className="w-20 h-1.5 rounded-full bg-slate-200 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: isOperational ? '92%' : '60%' }}
                    className={`h-full rounded-full ${isOperational ? 'bg-gradient-to-r from-green-500 to-emerald-400' : 'bg-gradient-to-r from-amber-500 to-amber-400'}`}
                  />
                </div>
                <span className="text-[10px] text-slate-400 font-mono w-10 text-right">{uptime}</span>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

function ActivitySection({ dashData }) {
  const hasData = (dashData?.totalUsers || 0) > 0 || (dashData?.totalConsultations || 0) > 0

  if (!hasData) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
            <FiActivity className="w-4.5 h-4.5" />
          </div>
          <h3 className="text-sm font-semibold text-slate-800">Platform Activity</h3>
        </div>
        <div className="flex flex-col items-center justify-center py-10 text-slate-400">
          <FiActivity className="w-8 h-8 mb-3 text-slate-300" />
          <p className="text-sm font-medium">No platform activity yet</p>
          <p className="text-xs mt-1">Data will appear once users start engaging</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-xl bg-violet-50 border border-violet-200 flex items-center justify-center text-violet-600">
          <FiActivity className="w-4.5 h-4.5" />
        </div>
        <h3 className="text-sm font-semibold text-slate-800">Platform Activity</h3>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-sky-50/50 border border-blue-100/60">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
            <FiUsers className="w-3.5 h-3.5" />
            Total Users
          </div>
          <div className="text-2xl font-bold text-slate-800 tabular-nums">{dashData?.totalUsers?.toLocaleString() || 0}</div>
        </div>
        <div className="p-4 rounded-xl bg-gradient-to-br from-cyan-50 to-teal-50/50 border border-cyan-100/60">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
            <FiVideo className="w-3.5 h-3.5" />
            Today's Consultations
          </div>
          <div className="text-2xl font-bold text-slate-800 tabular-nums">{dashData?.consultationsToday?.toLocaleString() || 0}</div>
        </div>
      </div>
      <div className="mt-4 p-3 rounded-xl bg-slate-50/50 border border-slate-200/60">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500">Total Consultations</span>
          <span className="font-semibold text-slate-800 tabular-nums">{dashData?.totalConsultations?.toLocaleString() || 0}</span>
        </div>
        <div className="flex items-center justify-between text-sm mt-2">
          <span className="text-slate-500">Pending Requests</span>
          <span className="font-semibold text-amber-600 tabular-nums">{dashData?.pendingAppointments?.toLocaleString() || 0}</span>
        </div>
        <div className="flex items-center justify-between text-sm mt-2">
          <span className="text-slate-500">Active Doctors</span>
          <span className="font-semibold text-slate-800 tabular-nums">{dashData?.totalDoctors?.toLocaleString() || 0}</span>
        </div>
        <div className="flex items-center justify-between text-sm mt-2">
          <span className="text-slate-500">Total Patients</span>
          <span className="font-semibold text-slate-800 tabular-nums">{dashData?.totalPatients?.toLocaleString() || 0}</span>
        </div>
      </div>
    </div>
  )
}

function WeeklyChart({ weeklyData }) {
  const chartData = useMemo(() => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    return days.map(day => ({
      day,
      value: weeklyData?.[day] || 0,
    }))
  }, [weeklyData])

  const maxVal = Math.max(...chartData.map(d => d.value), 1)

  return (
    <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
            <FiBarChart2 className="w-4.5 h-4.5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-800">Weekly Consultation Volume</h3>
            <p className="text-xs text-slate-400">Current week overview</p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs font-medium text-blue-700">
          <FiTrendingUp className="w-3.5 h-3.5" />
          This Week
        </span>
      </div>
      <div className="flex items-end justify-between h-52 gap-2.5 pt-2">
        {chartData.map((item, i) => {
          const heightPct = (item.value / maxVal) * 100
          return (
            <div key={item.day} className="flex flex-col items-center gap-2 flex-1 group">
              <motion.span
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="text-[10px] font-bold text-slate-400 group-hover:text-slate-600 transition-colors tabular-nums"
              >
                {item.value}
              </motion.span>
              <div className="relative w-full flex-1 flex items-end">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${Math.max(heightPct, 2)}%` }}
                  transition={{ delay: i * 0.05, duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                  className="relative w-full rounded-lg bg-gradient-to-t from-blue-600 via-blue-500 to-cyan-400 group-hover:shadow-lg group-hover:shadow-blue-500/20 transition-shadow"
                >
                  <div className="absolute inset-x-0 top-0 h-1 rounded-full bg-white/30 blur-sm" />
                </motion.div>
              </div>
              <span className="text-[11px] font-medium text-slate-400 font-mono">{item.day}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function MobileNav({ isOpen, onClose }) {
  const { logout } = useAuth()
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        >
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
            className="w-64 h-full bg-white border-r border-slate-200 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <img src="/logo.png" alt="MediConnect" className="w-8 h-8 object-contain" />
                <div>
                  <span className="font-semibold text-sm text-slate-800">MediConnect</span>
                  <div className="text-[10px] text-slate-400 tracking-widest uppercase">Admin Console</div>
                </div>
              </div>
            </div>
            <nav className="p-3 space-y-0.5">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <button key={item.id} className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-all">
                    <Icon className="w-4 h-4 text-slate-400" />
                    <span>{item.label}</span>
                  </button>
                )
              })}
            </nav>
            <div className="p-3 border-t border-slate-100">
              <button onClick={() => { logout() }} className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:text-red-600 hover:bg-red-50 transition-all">
                <FiLogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function DoctorsView({ doctors, loading, deletingId, onDelete, onRefresh }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Doctors Management</h2>
          <p className="text-sm text-slate-400">{doctors.length} registered doctors</p>
        </div>
        <button onClick={onRefresh} className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 shadow-sm text-xs text-slate-500 hover:bg-slate-50 transition-all">
          <FiRefreshCw className="w-3.5 h-3.5" />
          Refresh
        </button>
      </div>
      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-slate-400">
            <FiRefreshCw className="w-5 h-5 animate-spin mr-2" />
            Loading doctors...
          </div>
        ) : doctors.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <FiUserCheck className="w-10 h-10 mb-3 text-slate-300" />
            <p className="text-sm font-medium">No doctors registered yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3.5">Doctor</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3.5">Specialization</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3.5">Contact</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3.5">Location</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3.5">Status</th>
                  <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3.5">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {doctors.map((doc, i) => (
                  <motion.tr
                    key={doc.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.02 }}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-teal-400 flex items-center justify-center text-xs font-bold text-white shadow-sm">
                          {doc.name?.[0] || 'D'}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-slate-700">{doc.name}</div>
                          <div className="text-xs text-slate-400">{doc.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-100 text-xs font-medium text-blue-700">
                        <FiTool className="w-3 h-3" />
                        {doc.specialization || 'General'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 text-sm text-slate-500">
                        <FiPhone className="w-3.5 h-3.5 text-slate-400" />
                        {doc.phone || 'N/A'}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 text-sm text-slate-500">
                        <FiMapPin className="w-3.5 h-3.5 text-slate-400" />
                        {doc.city || 'N/A'}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                        doc.verifiedByAdmin
                          ? 'bg-green-50 border border-green-200 text-green-700'
                          : 'bg-amber-50 border border-amber-200 text-amber-700'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${doc.verifiedByAdmin ? 'bg-green-500' : 'bg-amber-400'}`} />
                        {doc.verifiedByAdmin ? 'Verified' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => onDelete(doc.id)}
                        disabled={deletingId === doc.id}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition-all disabled:opacity-50"
                      >
                        <FiTrash2 className="w-3.5 h-3.5" />
                        {deletingId === doc.id ? 'Deleting...' : 'Delete'}
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

function PatientsView({ patients, loading, deletingId, onDelete, onRefresh }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Patients Management</h2>
          <p className="text-sm text-slate-400">{patients.length} registered patients</p>
        </div>
        <button onClick={onRefresh} className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 shadow-sm text-xs text-slate-500 hover:bg-slate-50 transition-all">
          <FiRefreshCw className="w-3.5 h-3.5" />
          Refresh
        </button>
      </div>
      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-slate-400">
            <FiRefreshCw className="w-5 h-5 animate-spin mr-2" />
            Loading patients...
          </div>
        ) : patients.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <FiUserPlus className="w-10 h-10 mb-3 text-slate-300" />
            <p className="text-sm font-medium">No patients registered yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3.5">Patient</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3.5">Contact</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3.5">Gender</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3.5">Blood Group</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3.5">Location</th>
                  <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3.5">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {patients.map((pat, i) => (
                  <motion.tr
                    key={pat.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.02 }}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-purple-400 flex items-center justify-center text-xs font-bold text-white shadow-sm">
                          {pat.name?.[0] || 'P'}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-slate-700">{pat.name}</div>
                          <div className="text-xs text-slate-400">{pat.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 text-sm text-slate-500">
                        <FiPhone className="w-3.5 h-3.5 text-slate-400" />
                        {pat.phone || 'N/A'}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-slate-600 capitalize">{pat.gender || 'N/A'}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-red-50 border border-red-100 text-xs font-medium text-red-600">
                        {pat.bloodGroup || 'N/A'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 text-sm text-slate-500">
                        <FiMapPin className="w-3.5 h-3.5 text-slate-400" />
                        {pat.city || 'N/A'}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => onDelete(pat.id)}
                        disabled={deletingId === pat.id}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition-all disabled:opacity-50"
                      >
                        <FiTrash2 className="w-3.5 h-3.5" />
                        {deletingId === pat.id ? 'Deleting...' : 'Delete'}
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

function AppointmentsView({ appointments, loading, onRefresh }) {
  const statusColors = {
    CONFIRMED: 'text-blue-600 bg-blue-50 border-blue-200',
    PENDING: 'text-amber-600 bg-amber-50 border-amber-200',
    CANCELLED: 'text-red-600 bg-red-50 border-red-200',
    COMPLETED: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    IN_PROGRESS: 'text-cyan-600 bg-cyan-50 border-cyan-200',
  }
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Appointments</h2>
          <p className="text-sm text-slate-400">{appointments.length} total appointments</p>
        </div>
        <button onClick={onRefresh} className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 shadow-sm text-xs text-slate-500 hover:bg-slate-50 transition-all">
          <FiRefreshCw className="w-3.5 h-3.5" />
          Refresh
        </button>
      </div>
      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-slate-400">
            <FiRefreshCw className="w-5 h-5 animate-spin mr-2" />
            Loading appointments...
          </div>
        ) : appointments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <FiCalendar className="w-10 h-10 mb-3 text-slate-300" />
            <p className="text-sm font-medium">No appointments yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3.5">ID</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3.5">Patient</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3.5">Doctor</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3.5">Date</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3.5">Time</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3.5">Status</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3.5">Type</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {appointments.map((apt, i) => (
                  <motion.tr
                    key={apt.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.02 }}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-5 py-4 text-sm font-mono text-slate-500">#{apt.id}</td>
                    <td className="px-5 py-4 text-sm font-medium text-slate-700">{apt.patientName || apt.patient?.name || 'N/A'}</td>
                    <td className="px-5 py-4 text-sm text-slate-600">{apt.doctorName || apt.doctor?.name || 'N/A'}</td>
                    <td className="px-5 py-4 text-sm text-slate-500">{apt.date ? new Date(apt.date).toLocaleDateString() : 'N/A'}</td>
                    <td className="px-5 py-4 text-sm text-slate-500">{apt.time || apt.timeSlot || 'N/A'}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${statusColors[apt.status] || 'text-slate-600 bg-slate-50 border-slate-200'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${apt.status === 'COMPLETED' ? 'bg-emerald-500' : apt.status === 'CONFIRMED' ? 'bg-blue-500' : apt.status === 'CANCELLED' ? 'bg-red-500' : apt.status === 'IN_PROGRESS' ? 'bg-cyan-500' : 'bg-amber-400'}`} />
                        {apt.status || 'UNKNOWN'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs text-slate-500">{apt.consultationType || apt.type || 'N/A'}</span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

function AnalyticsView({ dashData }) {
  const stats = [
    { label: 'Total Users', value: dashData?.totalUsers || 0, icon: FiUsers, color: 'from-blue-600 to-blue-700' },
    { label: 'Total Doctors', value: dashData?.totalDoctors || 0, icon: FiUserCheck, color: 'from-emerald-600 to-emerald-700' },
    { label: 'Total Patients', value: dashData?.totalPatients || 0, icon: FiUserPlus, color: 'from-violet-600 to-violet-700' },
    { label: 'Consultations', value: dashData?.totalConsultations || 0, icon: FiVideo, color: 'from-cyan-600 to-cyan-700' },
    { label: 'Pending Requests', value: dashData?.pendingAppointments || 0, icon: FiClock, color: 'from-amber-600 to-amber-700' },
  ]
  const weekly = dashData?.weeklyConsultations || {}
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const maxVal = Math.max(...days.map(d => weekly[d] || 0), 1)
  return (
    <div>
      <h2 className="text-xl font-bold text-slate-800 mb-6">Analytics Dashboard</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
            className="relative overflow-hidden rounded-2xl bg-white border border-slate-200/60 shadow-sm p-5"
          >
            <div className={`absolute top-0 right-0 w-24 h-24 rounded-full bg-gradient-to-br ${s.color} opacity-[0.06] -translate-y-8 translate-x-8`} />
            <s.icon className="w-5 h-5 text-slate-400 mb-3" />
            <div className="text-3xl font-bold text-slate-800 tabular-nums">{s.value.toLocaleString()}</div>
            <div className="text-sm text-slate-400 mt-1">{s.label}</div>
          </motion.div>
        ))}
      </div>
      <div className="grid lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6">
          <h3 className="text-sm font-semibold text-slate-800 mb-4">Weekly Consultation Volume</h3>
          <div className="flex items-end justify-between h-44 gap-2.5 pt-2">
            {days.map((day, i) => {
              const val = weekly[day] || 0
              const h = (val / maxVal) * 100
              return (
                <div key={day} className="flex flex-col items-center gap-2 flex-1">
                  <span className="text-[10px] font-bold text-slate-400 tabular-nums">{val}</span>
                  <div className="relative w-full flex-1 flex items-end">
                    <motion.div initial={{ height: 0 }} animate={{ height: `${Math.max(h, 2)}%` }}
                      transition={{ delay: i * 0.05, duration: 0.6 }}
                      className="w-full rounded-lg bg-gradient-to-t from-blue-600 via-blue-500 to-cyan-400"
                    />
                  </div>
                  <span className="text-[11px] font-medium text-slate-400">{day}</span>
                </div>
              )
            })}
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6">
          <h3 className="text-sm font-semibold text-slate-800 mb-4">Platform Breakdown</h3>
          <div className="space-y-4">
            {[
              { label: 'Doctors', value: dashData?.totalDoctors || 0, total: Math.max(dashData?.totalUsers || 1, 1), color: 'bg-emerald-500' },
              { label: 'Patients', value: dashData?.totalPatients || 0, total: Math.max(dashData?.totalUsers || 1, 1), color: 'bg-violet-500' },
              { label: 'Consultations Completed', value: dashData?.totalConsultations || 0, total: Math.max(dashData?.totalUsers || 1, 1), color: 'bg-cyan-500' },
            ].map(item => {
              const pct = Math.min(Math.round((item.value / item.total) * 100), 100)
              return (
                <div key={item.label}>
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <span className="text-slate-600">{item.label}</span>
                    <span className="font-semibold text-slate-800">{pct}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                      className={`h-full rounded-full ${item.color}`}
                    />
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">{item.value.toLocaleString()} total</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

function ReportsView({ dashData }) {
  const stats = [
    { label: 'Total Users', value: dashData?.totalUsers || 0, change: '+12%', up: true },
    { label: 'Active Doctors', value: dashData?.totalDoctors || 0, change: '+5%', up: true },
    { label: 'Total Patients', value: dashData?.totalPatients || 0, change: '+18%', up: true },
    { label: 'Consultations Today', value: dashData?.consultationsToday || 0, change: dashData?.consultationsToday > 0 ? '+8%' : '0%', up: dashData?.consultationsToday > 0 },
    { label: 'Pending Appointments', value: dashData?.pendingAppointments || 0, change: dashData?.pendingAppointments > 0 ? '-3%' : '0%', up: false },
  ]
  return (
    <div>
      <h2 className="text-xl font-bold text-slate-800 mb-6">Reports</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
            className="rounded-2xl bg-white border border-slate-200/60 shadow-sm p-5"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-slate-500">{s.label}</span>
              <span className={`inline-flex items-center gap-0.5 text-xs font-semibold ${s.up ? 'text-emerald-600' : 'text-red-500'}`}>
                {s.up ? <FiArrowUp className="w-3 h-3" /> : <FiArrowDown className="w-3 h-3" />}
                {s.change}
              </span>
            </div>
            <div className="text-2xl font-bold text-slate-800 tabular-nums">{s.value.toLocaleString()}</div>
          </motion.div>
        ))}
      </div>
      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-slate-800">Export Options</h3>
          <div className="flex items-center gap-2">
            <button className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-50 border border-blue-200 text-xs font-medium text-blue-700 hover:bg-blue-100 transition-all">
              <FiDownload className="w-3.5 h-3.5" />
              Export CSV
            </button>
            <button className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-all">
              <FiDownload className="w-3.5 h-3.5" />
              Export PDF
            </button>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-sky-50/50 border border-blue-100/60">
            <div className="text-xs text-slate-400 mb-1">User Growth Report</div>
            <div className="text-lg font-bold text-slate-800">{dashData?.totalUsers || 0} users</div>
            <div className="text-xs text-slate-400 mt-1">{dashData?.totalDoctors || 0} doctors · {dashData?.totalPatients || 0} patients</div>
          </div>
          <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50/50 border border-emerald-100/60">
            <div className="text-xs text-slate-400 mb-1">Consultation Report</div>
            <div className="text-lg font-bold text-slate-800">{dashData?.totalConsultations || 0} total</div>
            <div className="text-xs text-slate-400 mt-1">{dashData?.consultationsToday || 0} today · {dashData?.pendingAppointments || 0} pending</div>
          </div>
        </div>
      </div>
    </div>
  )
}

function SettingsView() {
  return (
    <div>
      <h2 className="text-xl font-bold text-slate-800 mb-4">Settings</h2>
      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-8">
        <div className="flex flex-col items-center justify-center text-slate-400 py-8">
          <FiSettings className="w-10 h-10 mb-3 text-slate-300" />
          <h3 className="text-base font-semibold text-slate-600 mb-1">Admin Settings</h3>
          <p className="text-sm text-slate-400 text-center max-w-md">
            Profile settings and account management are available through your profile page.
          </p>
        </div>
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const { user, logout } = useAuth()
  const { data: dashData, refetch } = usePolling(() => dashboardAPI.getAdmin(), 10000)
  useWebSocket('/topic/dashboard', () => { refetch() })
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [activeView, setActiveView] = useState('overview')

  const systemHealth = dashData?.systemHealth || {}
  const weeklyData = dashData?.weeklyConsultations || {}

  const [doctors, setDoctors] = useState([])
  const [patients, setPatients] = useState([])
  const [appointments, setAppointments] = useState([])
  const [loadingDoctors, setLoadingDoctors] = useState(false)
  const [loadingPatients, setLoadingPatients] = useState(false)
  const [loadingAppointments, setLoadingAppointments] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  const fetchDoctors = useCallback(async () => {
    setLoadingDoctors(true)
    try {
      const res = await adminAPI.getUsers('DOCTOR')
      setDoctors(res.data)
    } catch { setDoctors([]) }
    finally { setLoadingDoctors(false) }
  }, [])

  const fetchPatients = useCallback(async () => {
    setLoadingPatients(true)
    try {
      const res = await adminAPI.getUsers('PATIENT')
      setPatients(res.data)
    } catch { setPatients([]) }
    finally { setLoadingPatients(false) }
  }, [])

  const fetchAppointments = useCallback(async () => {
    setLoadingAppointments(true)
    try {
      const res = await appointmentAPI.list()
      setAppointments(res.data)
    } catch { setAppointments([]) }
    finally { setLoadingAppointments(false) }
  }, [])

  useEffect(() => {
    if (activeView === 'doctors') fetchDoctors()
  }, [activeView, fetchDoctors])

  useEffect(() => {
    if (activeView === 'patients') fetchPatients()
  }, [activeView, fetchPatients])

  useEffect(() => {
    if (activeView === 'appointments') fetchAppointments()
  }, [activeView, fetchAppointments])

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return
    setDeletingId(id)
    try {
      await adminAPI.deleteUser(id)
      setDoctors(prev => prev.filter(u => u.id !== id))
      setPatients(prev => prev.filter(u => u.id !== id))
    } catch {
      alert('Failed to delete user. They may have associated records.')
    }
    finally { setDeletingId(null) }
  }

  const dateTime = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-white">
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_15%_30%,rgba(37,99,235,0.03),transparent_50%),radial-gradient(ellipse_at_75%_25%,rgba(6,182,212,0.02),transparent_50%)]" />

      <MobileNav isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

      <div className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 z-30 flex-col bg-white/70 backdrop-blur-xl border-r border-blue-100/50 shadow-sm">
        <div className="p-5 border-b border-blue-100/30">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="MediConnect" className="w-8 h-8 object-contain" />
            <div>
              <span className="font-semibold text-sm text-slate-800">MediConnect</span>
              <div className="text-[10px] text-slate-400 tracking-widest uppercase">Admin Console</div>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeView === item.id
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'text-blue-600 bg-blue-50/80 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50/60'
                }`}
              >
                <Icon className={`w-4.5 h-4.5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>
        <div className="p-3 border-t border-blue-100/30">
          <button onClick={() => { logout() }} className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:text-red-600 hover:bg-red-50 transition-all">
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
      </div>

      <div className="lg:pl-64">
        <nav className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-blue-100/30 shadow-sm">
          <div className="flex items-center justify-between h-16 px-4 lg:px-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMobileNavOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
              >
                <FiMenu className="w-5 h-5" />
              </button>
              <div className="hidden sm:block">
                <span className="text-sm text-slate-400 font-mono">{dateTime}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative hidden md:block">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-56 pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                />
              </div>
              <button className="relative p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors">
                <FiBell className="w-4.5 h-4.5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 shadow-sm shadow-red-500/40" />
              </button>
              <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-50 border border-green-200 text-xs font-medium text-green-700">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-sm shadow-green-500/40" />
                Live
              </span>
              <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-400 flex items-center justify-center text-xs font-bold text-white shadow-sm">
                  {user?.name?.[0] || 'A'}
                </div>
                <div className="hidden md:block">
                  <div className="text-sm font-medium text-slate-700 leading-tight">{user?.name || 'Admin'}</div>
                  <div className="text-[11px] text-slate-400">{user?.email || ''}</div>
                </div>
              </div>
              <button onClick={() => { logout() }} className="hidden md:inline-flex text-xs text-slate-400 hover:text-slate-600 transition-colors px-2.5 py-1.5 rounded-lg hover:bg-slate-50 font-medium">
                Sign Out
              </button>
            </div>
          </div>
        </nav>

        <div className="p-4 lg:p-6">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-slate-800">Admin Command Center</h1>
                  <p className="text-slate-400 text-sm mt-1">Real-time platform overview</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 shadow-sm text-xs text-slate-500">
                    <FiRefreshCw className="w-3.5 h-3.5 text-blue-500" />
                    Auto-refreshing
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-green-50 border border-green-200 shadow-sm text-xs font-medium text-green-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-sm shadow-green-500/40" />
                    WebSocket Connected
                  </span>
                </div>
              </div>
            </div>

            {activeView === 'overview' && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                  <StatCard label="Total Users" value={dashData?.totalUsers || 0} icon={FiUsers} color="from-blue-600 to-blue-700" delay={0.02} />
                  <StatCard label="Active Doctors" value={dashData?.totalDoctors || 0} icon={FiUserCheck} color="from-emerald-600 to-emerald-700" delay={0.04} />
                  <StatCard label="Total Patients" value={dashData?.totalPatients || 0} icon={FiUserPlus} color="from-violet-600 to-violet-700" delay={0.06} />
                  <StatCard label="Consultations" value={dashData?.totalConsultations || 0} icon={FiVideo} color="from-cyan-600 to-cyan-700" delay={0.08} />
                  <StatCard label="Pending" value={dashData?.pendingAppointments || 0} icon={FiClock} color="from-amber-600 to-amber-700" delay={0.10} />
                </div>

                <div className="grid xl:grid-cols-2 gap-5 mb-6">
                  <SystemHealthWidget systemHealth={systemHealth} />
                  <ActivitySection dashData={dashData} />
                </div>

                <WeeklyChart weeklyData={weeklyData} />
              </>
            )}

            {activeView === 'doctors' && <DoctorsView doctors={doctors} loading={loadingDoctors} deletingId={deletingId} onDelete={handleDeleteUser} onRefresh={fetchDoctors} />}
            {activeView === 'patients' && <PatientsView patients={patients} loading={loadingPatients} deletingId={deletingId} onDelete={handleDeleteUser} onRefresh={fetchPatients} />}
            {activeView === 'appointments' && <AppointmentsView appointments={appointments} loading={loadingAppointments} onRefresh={fetchAppointments} />}
            {activeView === 'analytics' && <AnalyticsView dashData={dashData} />}
            {activeView === 'reports' && <ReportsView dashData={dashData} />}
            {activeView === 'billing' && (
              <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-12">
                <div className="flex flex-col items-center justify-center text-slate-400">
                  <FiDollarSign className="w-10 h-10 mb-3 text-slate-300" />
                  <h3 className="text-base font-semibold text-slate-600 mb-1">Billing Management</h3>
                  <p className="text-sm text-slate-400">This module is coming soon</p>
                </div>
              </div>
            )}
            {activeView === 'settings' && <SettingsView />}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
