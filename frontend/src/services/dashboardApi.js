import { dashboardAPI, appointmentAPI, reviewAPI, publicAPI } from '../utils/api'

export const getDoctorDashboardData = () => dashboardAPI.getDoctor()

export const getPatientDashboardData = () => dashboardAPI.getPatient()

export const getAdminDashboardData = () => dashboardAPI.getAdmin()

export const getPendingAppointments = () => appointmentAPI.getPendingForDoctor()

export const updateAppointmentStatus = (id, status) => appointmentAPI.updateStatus(id, status)

export const getDoctorReviews = (doctorId) => reviewAPI.getByDoctor(doctorId)

export const getDoctorPatients = () => {
  return dashboardAPI.getDoctor().then(res => {
    return { data: res.data?.patients || [] }
  })
}

export const getAppointments = () => {
  return appointmentAPI.getMyAppointments()
}
