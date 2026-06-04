import StatsCards from '../components/StatsCards'
import DashboardHero from '../components/DashboardHero'
import AppointmentTimeline from '../components/AppointmentTimeline'
import PatientList from '../components/PatientList'
import ActivityFeed from '../components/ActivityFeed'
import AnalyticsChart from '../components/AnalyticsChart'

export default function Dashboard({ data, userName, date, onAccept, onReject, onJoin }) {
  const schedule = data?.schedule || []
  const patients = data?.recentPatients || []
  const activities = data?.activities || []

  const weeklyData = data?.weeklyData || []
  const chartData = weeklyData.length > 0
    ? weeklyData
    : (() => {
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        if (data?.weeklyConsultations) {
          return days.map(day => ({
            name: day,
            value: data.weeklyConsultations[day] || 0,
            previous: Math.floor((data.weeklyConsultations[day] || 0) * 0.7),
          }))
        }
        return days.map(day => ({ name: day, value: 0, previous: 0 }))
      })()

  return (
    <div>
      <DashboardHero userName={userName} date={date} />
      <StatsCards data={data} />

      <div className="grid xl:grid-cols-3 gap-5 mb-6">
        <div className="xl:col-span-2">
          <AnalyticsChart
            data={chartData}
            title="Consultation Overview"
            dataKey="value"
            color="#2563eb"
          />
        </div>
        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-800">Today's Schedule</h3>
            <span className="text-[10px] font-medium text-slate-400 bg-slate-50 px-2 py-1 rounded-md border border-slate-200">
              {schedule.length} {schedule.length === 1 ? 'appointment' : 'appointments'}
            </span>
          </div>
          <AppointmentTimeline
            appointments={schedule}
            onAccept={onAccept}
            onReject={onReject}
            onJoin={onJoin}
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-800">Recent Patients</h3>
            <span className="text-[10px] font-medium text-slate-400 bg-slate-50 px-2 py-1 rounded-md border border-slate-200">
              {patients.length} total
            </span>
          </div>
          <PatientList patients={patients} />
        </div>
        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-800">Activity Feed</h3>
            <span className="inline-flex items-center gap-1.5 text-[10px] font-medium text-green-600 bg-green-50 px-2 py-1 rounded-md border border-green-200">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              Live
            </span>
          </div>
          <ActivityFeed activities={activities} />
        </div>
      </div>
    </div>
  )
}
