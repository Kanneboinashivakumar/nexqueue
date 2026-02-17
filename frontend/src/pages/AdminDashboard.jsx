import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'
import { motion } from 'framer-motion'
import Header from '../components/common/Header'
import Loader from '../components/common/Loader'
import StatsCards from '../components/admin/StatsCards'
import AppointmentsChart from '../components/admin/AppointmentsChart'
import UserManagement from '../components/admin/UserManagement'
import QuickActions from '../components/admin/QuickActions'
import RecentActivity from '../components/admin/RecentActivity'
import toast from 'react-hot-toast'

const AdminDashboard = () => {
  const { user, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [metrics, setMetrics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [userFilter, setUserFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [dateRange, setDateRange] = useState('week')

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login')
    }
    if (user && user.role !== 'admin') {
      navigate(`/${user.role}`)
    }
  }, [user, authLoading, navigate])

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchDashboardData()
    }
  }, [user, dateRange])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const [statsRes, usersRes, metricsRes] = await Promise.all([
        axios.get('/api/admin/stats'),
        axios.get('/api/admin/users?limit=10'),
        axios.get('/api/admin/performance')
      ])
      
      setStats(statsRes.data.stats)
      setUsers(usersRes.data.users)
      setMetrics(metricsRes.data.metrics)
      setTotalPages(usersRes.data.totalPages)
    } catch (error) {
      toast.error('Failed to load admin data')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUsers = async (page = 1) => {
    try {
      const response = await axios.get(`/api/admin/users?role=${userFilter}&search=${searchTerm}&page=${page}&limit=10`)
      setUsers(response.data.users)
      setTotalPages(response.data.totalPages)
      setCurrentPage(response.data.currentPage)
    } catch (error) {
      toast.error('Failed to load users')
    }
  }

  const handleUserUpdate = async (userId, updates) => {
    try {
      await axios.put(`/api/admin/users/${userId}`, updates)
      toast.success('User updated successfully')
      fetchUsers(currentPage)
      fetchDashboardData() // Refresh stats
    } catch (error) {
      toast.error('Failed to update user')
    }
  }

  const handleSearch = () => {
    fetchUsers(1)
  }

  if (authLoading || loading) return <Loader />

  return (
    <div className="min-h-screen bg-gray-100">
      <Header title="Admin Dashboard" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg p-6 mb-8 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Welcome back, {user?.fullName}!</h2>
              <p className="text-blue-100">Here's what's happening with your system today.</p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg text-white border border-white/30"
              >
                <option value="day">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <StatsCards stats={stats} />

        {/* Tabs Navigation */}
        <div className="bg-white rounded-xl shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              {['dashboard', 'users', 'analytics', 'settings'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-6 font-medium text-sm capitalize transition ${
                    activeTab === tab
                      ? 'border-b-2 border-blue-500 text-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <AppointmentsChart data={metrics?.last7Days} />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <QuickActions />
                <RecentActivity />
              </div>
            </div>
            
            <div className="space-y-6">
              <UserManagement 
                users={users.slice(0, 5)} 
                onUpdate={handleUserUpdate}
                onRefresh={fetchUsers}
              />
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <select
                  value={userFilter}
                  onChange={(e) => setUserFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Roles</option>
                  <option value="patient">Patients</option>
                  <option value="staff">Staff</option>
                  <option value="doctor">Doctors</option>
                  <option value="admin">Admins</option>
                </select>
                
                <div className="flex-1 flex gap-2">
                  <input
                    type="text"
                    placeholder="Search by name, email, or phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleSearch}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Search
                  </button>
                </div>
              </div>

              <UserManagement 
                users={users} 
                onUpdate={handleUserUpdate}
                onRefresh={() => fetchUsers(currentPage)}
              />

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-6 space-x-2">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => fetchUsers(i + 1)}
                      className={`px-4 py-2 rounded-lg transition ${
                        currentPage === i + 1
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 gap-6">
            <AppointmentsChart data={metrics?.last7Days} />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Peak Hours</h3>
                <div className="space-y-3">
                  {metrics?.peakHours?.map((peak, index) => (
                    <div key={index} className="flex items-center">
                      <span className="w-16 text-sm text-gray-600">{peak.hour}:00</span>
                      <div className="flex-1 h-8 bg-gray-200 rounded-lg overflow-hidden">
                        <div 
                          className="h-full bg-blue-500"
                          style={{ width: `${(peak.count / 50) * 100}%` }}
                        />
                      </div>
                      <span className="ml-3 text-sm font-medium">{peak.count} patients</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">System Health</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600">Server Status</span>
                      <span className="text-sm font-medium text-green-600">Healthy</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '100%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600">Database Load</span>
                      <span className="text-sm font-medium text-blue-600">23%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '23%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600">API Response</span>
                      <span className="text-sm font-medium text-purple-600">124ms</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-500 h-2 rounded-full" style={{ width: '12%' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard