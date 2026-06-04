import { useState, useCallback } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useDoctorDashboard } from '../../hooks/useDashboard'
import { appointmentAPI } from '../../utils/api'
import DoctorLayout from '../../layouts/DoctorLayout'
import DashboardPage from '../../pages/Dashboard'
import AppointmentsPage from '../../pages/Appointments'
import ConsultationsPage from '../../pages/Consultations'
import ReviewsPage from '../../pages/Reviews'
import PatientsPage from '../../pages/Patients'
import { useWebSocket } from '../../hooks/useWebSocket'

export default function DoctorDashboard() {
  const { user } = useAuth()
  const [activeView, setActiveView] = useState('dashboard')
  const { dashboardData, refetch, schedule, pendingRequests, pendingReviews } = useDoctorDashboard()

  useWebSocket('/topic/appointments', useCallback(() => {
    refetch()
  }, [refetch]))

  const handleAccept = async (id) => {
    try {
      await appointmentAPI.updateStatus(id, 'CONFIRMED')
      refetch()
    } catch {}
  }

  const handleReject = async (id) => {
    try {
      await appointmentAPI.updateStatus(id, 'CANCELLED')
      refetch()
    } catch {}
  }

  const handleJoin = (id) => {
    window.location.href = `/video-consultation/${id}`
  }

  const date = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return (
          <DashboardPage
            data={dashboardData}
            userName={user?.name}
            date={date}
            onAccept={handleAccept}
            onReject={handleReject}
            onJoin={handleJoin}
          />
        )
      case 'appointments':
        return (
          <AppointmentsPage
            schedule={schedule}
            onRefetch={refetch}
            onJoin={handleJoin}
          />
        )
      case 'consultations':
        return (
          <ConsultationsPage
            schedule={schedule}
            onJoin={handleJoin}
          />
        )
      case 'reviews':
        return (
          <ReviewsPage doctorId={user?.id} />
        )
      case 'patients':
        return (
          <PatientsPage patients={dashboardData?.recentPatients || []} />
        )
      default:
        return null
    }
  }

  return (
    <DoctorLayout
      activeView={activeView}
      onNavigate={setActiveView}
      pendingCount={pendingRequests?.length || 0}
    >
      {renderView()}
    </DoctorLayout>
  )
}
