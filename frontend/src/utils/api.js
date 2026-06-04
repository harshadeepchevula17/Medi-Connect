import axios from 'axios'

const API_BASE = '/api'

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('mediconnect_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('mediconnect_token')
      window.dispatchEvent(new CustomEvent('auth:expired'))
    }
    return Promise.reject(err)
  }
)

/* ─── Auth ─── */
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  signup: (data) => api.post('/auth/signup', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
}

/* ─── Public (no auth needed) ─── */
export const publicAPI = {
  getStats: () => api.get('/public/stats'),
  getDoctors: () => api.get('/public/doctors'),
  getTestimonials: () => api.get('/public/testimonials'),
  submitTestimonial: (data) => api.post('/public/testimonials', data),
}

export const reviewAPI = {
  report: (id, data) => api.post(`/reviews/${id}/report`, data),
  getByDoctor: (doctorId) => api.get(`/reviews/doctor/${doctorId}`),
}

/* ─── Admin ─── */
export const adminAPI = {
  getUsers: (role) => api.get('/admin/users', { params: { role } }),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
}

/* ─── Dashboards ─── */
export const dashboardAPI = {
  getPatient: () => api.get('/dashboard/patient'),
  getDoctor: () => api.get('/dashboard/doctor'),
  getAdmin: () => api.get('/dashboard/admin'),
}

/* ─── Appointments ─── */
export const appointmentAPI = {
  book: (data) => api.post('/appointments/book', data),
  updateStatus: (id, status) => api.post('/appointments/updateStatus', { id, status }),
  getPendingForDoctor: () => api.get('/appointments/doctor/pending'),
  getById: (id) => api.get(`/appointments/${id}`),
  getMyAppointments: () => api.get('/appointments/my'),
  list: () => api.post('/appointments/list'),
}

export const vitalsAPI = {
  getMyVitals: () => api.get('/vitals/my'),
}

/* ─── Chat ─── */
export const chatAPI = {
  getMessages: (room) => api.get(`/chat/${room}`),
  sendMessage: (data) => api.post('/chat/send', data),
}

/* ─── Prescriptions ─── */
export const prescriptionAPI = {
  create: (data) => api.post('/prescriptions', data),
  getMy: () => api.get('/prescriptions/my'),
  getByAppointment: (id) => api.get(`/prescriptions/appointment/${id}`),
}

/* ─── AI ─── */
export const aiAPI = {
  chat: (message, sessionId) => api.post('/ai/chat', { message, sessionId }),
}

const fileApi = axios.create({
  baseURL: API_BASE,
})

fileApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('mediconnect_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

fileApi.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('mediconnect_token')
      window.dispatchEvent(new CustomEvent('auth:expired'))
    }
    return Promise.reject(err)
  }
)

/* ─── Files ─── */
export const fileAPI = {
  upload: (file, category) => {
    const fd = new FormData()
    fd.append('file', file)
    if (category) fd.append('category', category)
    return fileApi.post('/files/upload', fd)
  },
  getMyFiles: () => api.get('/files/my'),
  delete: (id) => api.delete(`/files/${id}`),
  getDownloadUrl: (id) => `/api/files/${id}`,
  downloadFile: async (id) => {
    const token = localStorage.getItem('mediconnect_token')
    const res = await fetch(`/api/files/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) throw new Error('Download failed')
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    window.open(url, '_blank')
    setTimeout(() => URL.revokeObjectURL(url), 60000)
  },
}

export default api
