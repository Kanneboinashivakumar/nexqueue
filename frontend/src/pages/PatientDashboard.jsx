import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { appointmentAPI } from '../services/api'
import Header from '../components/common/Header'
import AppointmentForm from '../components/patient/AppointmentForm'
import QueueStatus from '../components/patient/QueueStatus'
import Loader from '../components/common/Loader'
import toast from 'react-hot-toast'

const PatientDashboard = () => {
  const { user, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login')
    }
    if (user && user.role !== 'patient') {
      navigate(`/${user.role}`)
    }
  }, [user, authLoading, navigate])

  useEffect(() => {
    if (user) {
      fetchAppointments()
    }
  }, [user])

  const fetchAppointments = async () => {
    try {
      setLoading(true)
      const response = await appointmentAPI.getMyAppointments()
      setAppointments(response.data)
    } catch (error) {
      toast.error('Failed to load appointments')
    } finally {
      setLoading(false)
    }
  }

  const handleAppointmentBooked = () => {
    fetchAppointments()
  }

  if (authLoading || loading) return <Loader />

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Patient Dashboard" />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Queue Status */}
          <div className="lg:col-span-2 space-y-8">
            <QueueStatus />
            
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Appointments</h3>
              {appointments.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No appointments yet. Book your first appointment!</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date & Time
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Department
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Purpose
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {appointments.map((appt) => (
                        <tr key={appt._id}>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {new Date(appt.date).toLocaleDateString()}
                            </div>
                            <div className="text-sm text-gray-500">{appt.time}</div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                              {appt.department}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-sm text-gray-900 truncate max-w-xs">
                              {appt.purpose || 'General checkup'}
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              appt.status === 'scheduled' ? 'bg-green-100 text-green-800' :
                              appt.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                              appt.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {appt.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Appointment Booking */}
          <div className="space-y-8">
            <AppointmentForm onAppointmentBooked={handleAppointmentBooked} />
            
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow p-6 text-white">
              <h3 className="text-lg font-semibold mb-2">Need Emergency Care?</h3>
              <p className="mb-4 opacity-90">
                If you have a medical emergency, please inform the reception immediately.
              </p>
              <button
                onClick={() => {
                  // In a real app, this would trigger emergency priority
                  toast.success('Emergency request sent to staff')
                }}
                className="w-full bg-white text-blue-600 py-2 px-4 rounded-lg font-semibold hover:bg-blue-50 transition"
              >
                Request Emergency Priority
              </button>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Queue Information</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Average Wait Time</span>
                  <span className="font-semibold">15-20 min</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Patients Ahead</span>
                  <span className="font-semibold">3-5</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Consultation Time</span>
                  <span className="font-semibold">10 min avg</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default PatientDashboard