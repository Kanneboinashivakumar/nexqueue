import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Header from '../components/common/Header'
import QueueControl from '../components/staff/QueueControl'
import PatientList from '../components/staff/PatientList'
import Loader from '../components/common/Loader'

const StaffDashboard = () => {
  const { user, loading: authLoading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login')
    }
    if (user && user.role !== 'staff' && user.role !== 'doctor') {
      navigate(`/${user.role}`)
    }
  }, [user, authLoading, navigate])

  if (authLoading) return <Loader />

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Staff Dashboard" />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl shadow p-6">
              <div className="text-3xl font-bold text-blue-600">4</div>
              <div className="text-sm text-gray-600">Total Appointments</div>
            </div>
            <div className="bg-white rounded-xl shadow p-6">
              <div className="text-3xl font-bold text-green-600">3</div>
              <div className="text-sm text-gray-600">Tokens Generated</div>
            </div>
            <div className="bg-white rounded-xl shadow p-6">
              <div className="text-3xl font-bold text-yellow-600">1</div>
              <div className="text-sm text-gray-600">In Progress</div>
            </div>
            <div className="bg-white rounded-xl shadow p-6">
              <div className="text-3xl font-bold text-purple-600">2</div>
              <div className="text-sm text-gray-600">Waiting Now</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Queue Control */}
          <div className="lg:col-span-2">
            <QueueControl />
          </div>

          {/* Right Column - Quick Actions */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button 
                  className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition"
                  onClick={() => navigate('/patient')}
                >
                  <div className="font-medium text-blue-700">View All Appointments</div>
                  <div className="text-sm text-blue-600">Manage all patient appointments</div>
                </button>
                <button className="w-full text-left p-3 bg-green-50 hover:bg-green-100 rounded-lg transition">
                  <div className="font-medium text-green-700">Billing & Payments</div>
                  <div className="text-sm text-green-600">Manage invoices and payments</div>
                </button>
                <button className="w-full text-left p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition">
                  <div className="font-medium text-purple-700">Generate Reports</div>
                  <div className="text-sm text-purple-600">Daily/weekly/monthly reports</div>
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-gray-500">Email</div>
                  <div className="font-medium">{user?.email}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Full Name</div>
                  <div className="font-medium">{user?.fullName}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Role</div>
                  <div className="font-medium capitalize">{user?.role}</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Overview</h3>
              <div className="space-y-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Today's Appointments</span>
                    <span className="text-xl font-bold text-blue-600">4</span>
                  </div>
                  <div className="text-sm text-blue-600 mt-1">Total scheduled for today</div>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Completed Today</span>
                    <span className="text-xl font-bold text-green-600">2</span>
                  </div>
                  <div className="text-sm text-green-600 mt-1">Patients served</div>
                </div>
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Avg. Wait Time</span>
                    <span className="text-xl font-bold text-yellow-600">18min</span>
                  </div>
                  <div className="text-sm text-yellow-600 mt-1">Current average</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Patient List Section */}
        <div className="mt-8">
          <PatientList />
        </div>
      </main>
    </div>
  )
}

export default StaffDashboard