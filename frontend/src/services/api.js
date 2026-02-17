import axios from 'axios'

// =====================================
// Axios Base Configuration
// =====================================
const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// =====================================
// Request Interceptor (Attach Token)
// =====================================
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// =====================================
// Response Interceptor (Handle 401)
// =====================================
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)


// =====================
// Auth API
// =====================
export const authAPI = {
  login: (credentials) => API.post('/auth/login', credentials),
  register: (userData) => API.post('/auth/register', userData),
  getCurrentUser: () => API.get('/auth/me'),
}


// =====================
// Appointment API
// =====================
export const appointmentAPI = {
  bookAppointment: (data) => API.post('/appointments/book', data),
  getMyAppointments: () => API.get('/appointments/my-appointments'),
  getAllAppointments: () => API.get('/appointments/all'),
}


// =====================
// Queue API
// =====================
export const queueAPI = {
  // General Queue
  getQueue: () => API.get('/queue'),
  getMyToken: () => API.get('/queue/my-token'),

  // Staff Actions
  callNextPatient: () => API.post('/queue/call-next'),
  markAsEmergency: (tokenId) =>
    API.patch(`/queue/emergency/${tokenId}`),
  skipPatient: (tokenId) =>
    API.patch(`/queue/skip/${tokenId}`),
  markAsCompleted: (tokenId) =>
    API.patch(`/queue/complete/${tokenId}`),

  // Doctor-Specific
  getDoctorQueue: () => API.get('/queue/doctor'),
  markAsInProgress: (tokenId) =>
    API.patch(`/queue/in-progress/${tokenId}`),

  updatePatientNotes: (tokenId, notes) =>
    API.patch(`/queue/${tokenId}/notes`, { notes }),
}


// =====================
// Prescription API (Future Expansion)
// =====================
export const prescriptionAPI = {
  createPrescription: (data) =>
    API.post('/prescriptions', data),

  getPatientPrescriptions: (patientId) =>
    API.get(`/prescriptions/patient/${patientId}`),
}


export default API
