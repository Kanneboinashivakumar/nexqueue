import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Header from '../components/common/Header'
import CurrentPatient from '../components/doctor/CurrentPatient'
import UpcomingPatients from '../components/doctor/UpcomingPatients'
import QuickActions from '../components/doctor/QuickActions'
import Loader from '../components/common/Loader'

const DoctorDashboard = () => {
  const { user, loading: authLoading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login')
    }
    if (user && user.role !== 'doctor') {
      navigate(`/${user.role}`)
    }
  }, [user, authLoading, navigate])

  if (authLoading) return <Loader />

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Doctor Dashboard" />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl shadow p-6">
              <div className="text-3xl font-bold text-blue-600">8</div>
              <div className="text-sm text-gray-600">Total Patients Today</div>
            </div>
            <div className="bg-white rounded-xl shadow p-6">
              <div className="text-3xl font-bold text-green-600">5</div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
            <div className="bg-white rounded-xl shadow p-6">
              <div className="text-3xl font-bold text-yellow-600">2</div>
              <div className="text-sm text-gray-600">Waiting</div>
            </div>
            <div className="bg-white rounded-xl shadow p-6">
              <div className="text-3xl font-bold text-red-600">1</div>
              <div className="text-sm text-gray-600">Emergency</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Current Patient */}
          <div className="lg:col-span-2">
            <CurrentPatient />
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            <UpcomingPatients />
            <QuickActions />
            
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Schedule</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">Completed</div>
                    <div className="text-sm text-blue-600">Patients served</div>
                  </div>
                  <div className="text-2xl font-bold text-blue-600">5</div>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">Remaining</div>
                    <div className="text-sm text-yellow-600">Patients in queue</div>
                  </div>
                  <div className="text-2xl font-bold text-yellow-600">3</div>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">Avg. Time</div>
                    <div className="text-sm text-green-600">Per consultation</div>
                  </div>
                  <div className="text-2xl font-bold text-green-600">12min</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow p-6 text-white">
              <h3 className="text-lg font-semibold mb-2">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="opacity-90">Consultations Today</span>
                  <span className="font-bold">8</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-90">Emergency Cases</span>
                  <span className="font-bold">1</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-90">Avg. Satisfaction</span>
                  <span className="font-bold">94%</span>
                </div>
              </div>
              <button className="w-full mt-4 bg-white text-blue-600 py-2 px-4 rounded-lg font-semibold hover:bg-blue-50 transition">
                View Full Report
              </button>
            </div>
          </div>
        </div>

        {/* Today's Completed Patients */}
        <div className="mt-8">
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Completed Patients</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Patient
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Token
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Consultation Time
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Diagnosis
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {[
                    { name: 'John Doe', token: 'T-001', time: '10:15 AM', diagnosis: 'Common Cold', status: 'Completed' },
                    { name: 'Jane Smith', token: 'T-002', time: '11:30 AM', diagnosis: 'Hypertension', status: 'Completed' },
                    { name: 'Robert Johnson', token: 'T-003', time: '12:45 PM', diagnosis: 'Diabetes Check', status: 'Completed' },
                    { name: 'Sarah Williams', token: 'T-004', time: '2:00 PM', diagnosis: 'General Checkup', status: 'Completed' },
                    { name: 'Michael Brown', token: 'T-005', time: '3:20 PM', diagnosis: 'Fever', status: 'Completed' }
                  ].map((patient, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900">{patient.name}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 text-sm bg-blue-100 text-blue-800 rounded-full">
                          {patient.token}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-gray-900">{patient.time}</div>
                        <div className="text-sm text-gray-500">~15 minutes</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-gray-900">{patient.diagnosis}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                          {patient.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default DoctorDashboard