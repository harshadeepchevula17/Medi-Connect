import { usePolling } from './useData'
import { useWebSocket } from './useWebSocket'
import { dashboardAPI } from '../utils/api'

export function useDoctorDashboard(refreshInterval = 10000) {
  const { data, loading, error, refetch } = usePolling(
    () => dashboardAPI.getDoctor(),
    refreshInterval
  )

  useWebSocket('/topic/appointments', () => { refetch() })

  return {
    dashboardData: data,
    loading,
    error,
    refetch,
    totalPatients: data?.totalPatients || 0,
    todayAppointments: data?.todayAppointments || 0,
    pendingReviews: data?.pendingReviews || 0,
    averageRating: data?.averageRating || 0,
    schedule: data?.schedule || [],
    pendingRequests: data?.pendingRequests || [],
    recentPatients: data?.recentPatients || [],
    activities: data?.activities || [],
  }
}

export function usePatientDashboard(refreshInterval = 15000) {
  const { data, loading, error, refetch } = usePolling(
    () => dashboardAPI.getPatient(),
    refreshInterval
  )

  useWebSocket('/topic/vitals', () => { refetch() })

  return {
    dashboardData: data,
    loading,
    error,
    refetch,
  }
}

export function useAdminDashboard(refreshInterval = 10000) {
  const { data, loading, error, refetch } = usePolling(
    () => dashboardAPI.getAdmin(),
    refreshInterval
  )

  useWebSocket('/topic/dashboard', () => { refetch() })

  return {
    dashboardData: data,
    loading,
    error,
    refetch,
  }
}
