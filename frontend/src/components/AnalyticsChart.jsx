import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Area,
  AreaChart,
} from 'recharts'
import { FiBarChart2, FiTrendingUp } from 'react-icons/fi'

const chartTypes = [
  { key: 'line', label: 'Line', icon: FiTrendingUp },
  { key: 'bar', label: 'Bar', icon: FiBarChart2 },
]

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-lg p-3 text-xs">
      <p className="text-slate-500 mb-1 font-medium">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-slate-700 font-semibold">{entry.value.toLocaleString()}</span>
          <span className="text-slate-400">{entry.name}</span>
        </p>
      ))}
    </div>
  )
}

export default function AnalyticsChart({ data, title = 'Analytics', dataKey = 'value', color = '#2563eb', type = 'line' }) {
  const [chartType, setChartType] = useState(type)

  const chartData = data?.length
    ? data
    : [
        { name: 'Mon', value: 0, previous: 0 },
        { name: 'Tue', value: 0, previous: 0 },
        { name: 'Wed', value: 0, previous: 0 },
        { name: 'Thu', value: 0, previous: 0 },
        { name: 'Fri', value: 0, previous: 0 },
        { name: 'Sat', value: 0, previous: 0 },
        { name: 'Sun', value: 0, previous: 0 },
      ]

  return (
    <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
          <p className="text-xs text-slate-400 mt-0.5">Weekly consultation volume</p>
        </div>
        <div className="flex items-center gap-1.5 bg-slate-50 rounded-lg p-1 border border-slate-200">
          {chartTypes.map((ct) => {
            const Icon = ct.icon
            const isActive = chartType === ct.key
            return (
              <button
                key={ct.key}
                onClick={() => setChartType(ct.key)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-white text-blue-600 shadow-sm border border-slate-200'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {ct.label}
              </button>
            )
          })}
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'line' ? (
            <LineChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey={dataKey}
                stroke={color}
                strokeWidth={2.5}
                dot={{ fill: color, stroke: 'white', strokeWidth: 2, r: 4 }}
                activeDot={{ fill: color, stroke: 'white', strokeWidth: 2, r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="previous"
                stroke="#94a3b8"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                dot={false}
              />
            </LineChart>
          ) : (
            <BarChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey={dataKey}
                fill={color}
                radius={[6, 6, 0, 0]}
                maxBarSize={40}
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  )
}
