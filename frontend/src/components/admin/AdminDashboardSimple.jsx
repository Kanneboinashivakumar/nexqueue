import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'
import Header from '../components/common/Header'
import Loader from '../components/common/Loader'
import toast from 'react-hot-toast'

// Simple version without charts to isolate the issue
const AdminDashboardSimple = () => {
  const { user, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

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
      fetchData()
    }
  }, [user])

  const fetchData = async () => {
    try {
      setLoading(true)
      const statsRes = await axios.get('/api/admin/stats')
      setStats(statsRes.data.stats)
    } catch (error) {
      toast.error('Failed to load admin data')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  if (authLoading || loading) return <Loader />

  return (
    <div className="min-h-screen bg-gray-100">
      <Header title="Admin Dashboard (Simple)" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Welcome, {user?.fullName}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Total Patients</p>
              <p className="text-3xl font-bold text-blue-600">{stats?.totalPatients || 0}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Total Staff</p>
              <p className="text-3xl font-bold text-green-600">{stats?.totalStaff || 0}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Total Doctors</p>
              <p className="text-3xl font-bold text-purple-600">{stats?.totalDoctors || 0}</p>
            </div>
          </div>
          
          <button
            onClick={() => navigate('/')}
            className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboardSimple