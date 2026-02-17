import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import axios from 'axios'
import toast from 'react-hot-toast'

const LabQueue = () => {
  const [queue, setQueue] = useState([])
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState('all')

  // Dummy data for immediate display
  const dummyData = [
    {
      _id: '1',
      tokenNumber: 'LAB-20260214-001',
      patientId: { fullName: 'Rajesh Kumar', age: 35 },
      testType: 'blood',
      testName: 'Complete Blood Count',
      priority: 'normal',
      status: 'waiting',
      currentPosition: 1,
      requestedBy: { fullName: 'Dr. Amit Patel' }
    },
    {
      _id: '2',
      tokenNumber: 'LAB-20260214-002',
      patientId: { fullName: 'Lakshmi Amma', age: 68 },
      testType: 'xray',
      testName: 'Chest X-Ray',
      priority: 'urgent',
      status: 'waiting',
      currentPosition: 2,
      requestedBy: { fullName: 'Dr. Amit Patel' }
    },
    {
      _id: '3',
      tokenNumber: 'LAB-20260214-003',
      patientId: { fullName: 'Emergency Patient', age: 45 },
      testType: 'blood',
      testName: 'Cardiac Enzymes',
      priority: 'emergency',
      status: 'in-progress',
      currentPosition: 3,
      requestedBy: { fullName: 'Dr. Sarah Lee' }
    },
    {
      _id: '4',
      tokenNumber: 'LAB-20260214-004',
      patientId: { fullName: 'John Doe', age: 28 },
      testType: 'ultrasound',
      testName: 'Abdominal Ultrasound',
      priority: 'normal',
      status: 'completed',
      currentPosition: 4,
      requestedBy: { fullName: 'Dr. Amit Patel' }
    },
    {
      _id: '5',
      tokenNumber: 'LAB-20260214-005',
      patientId: { fullName: 'Priya Sharma', age: 32 },
      testType: 'blood',
      testName: 'Thyroid Profile',
      priority: 'normal',
      status: 'waiting',
      currentPosition: 5,
      requestedBy: { fullName: 'Dr. Michael Chen' }
    }
  ]

  useEffect(() => {
    // Try to fetch real data, fallback to dummy
    fetchLabQueue()
  }, [])

  const fetchLabQueue = async () => {
    setLoading(true)
    try {
      const response = await axios.get('/api/lab/queue')
      if (response.data && response.data.queue && response.data.queue.length > 0) {
        setQueue(response.data.queue)
      } else {
        // Use dummy data if no real data
        setQueue(dummyData)
      }
    } catch (error) {
      console.log('Using dummy data for lab queue')
      setQueue(dummyData)
    } finally {
      setLoading(false)
    }
  }

  const handleStartTest = async (id) => {
    try {
      // Update local state for demo
      setQueue(queue.map(item => 
        item._id === id 
          ? { ...item, status: 'in-progress' } 
          : item
      ))
      toast.success('Test started successfully')
    } catch (error) {
      toast.error('Failed to start test')
    }
  }

  const handleCompleteTest = async (id) => {
    const resultText = prompt('Enter test results:')
    if (!resultText) return
    
    try {
      // Update local state for demo
      setQueue(queue.map(item => 
        item._id === id 
          ? { ...item, status: 'completed' } 
          : item
      ))
      toast.success('Test completed successfully')
    } catch (error) {
      toast.error('Failed to complete test')
    }
  }

  const filteredQueue = filter === 'all' 
    ? queue 
    : queue.filter(item => item.priority === filter)

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'emergency': return 'bg-red-100 text-red-800 border border-red-200'
      case 'urgent': return 'bg-yellow-100 text-yellow-800 border border-yellow-200'
      default: return 'bg-blue-100 text-blue-800 border border-blue-200'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'waiting': return 'bg-yellow-100 text-yellow-800'
      case 'in-progress': return 'bg-blue-100 text-blue-800'
      case 'completed': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">🔬 Lab Queue</h2>
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="all">All Tests</option>
          <option value="normal">Normal</option>
          <option value="urgent">Urgent</option>
          <option value="emergency">Emergency</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Token</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Test</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredQueue.map((item) => (
              <tr key={item._id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                    {item.tokenNumber}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {item.patientId?.fullName || 'Unknown'}
                  </div>
                  <div className="text-sm text-gray-500">
                    Age: {item.patientId?.age || 'N/A'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{item.testName}</div>
                  <div className="text-sm text-gray-500">{item.testType}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${getPriorityColor(item.priority)}`}>
                    {item.priority}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-semibold text-gray-900">#{item.currentPosition}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {item.status === 'waiting' && (
                    <button
                      onClick={() => handleStartTest(item._id)}
                      className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-xs font-medium"
                    >
                      Start
                    </button>
                  )}
                  {item.status === 'in-progress' && (
                    <button
                      onClick={() => handleCompleteTest(item._id)}
                      className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-xs font-medium"
                    >
                      Complete
                    </button>
                  )}
                  {item.status === 'completed' && (
                    <span className="text-xs text-gray-500">Completed</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredQueue.length === 0 && (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
          <p className="text-gray-500">No tests in queue</p>
        </div>
      )}

      {/* Summary Stats */}
      <div className="mt-6 pt-6 border-t border-gray-200 grid grid-cols-4 gap-4">
        <div>
          <p className="text-xs text-gray-500">Total Tests</p>
          <p className="text-xl font-bold text-gray-900">{queue.length}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Waiting</p>
          <p className="text-xl font-bold text-yellow-600">{queue.filter(t => t.status === 'waiting').length}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">In Progress</p>
          <p className="text-xl font-bold text-blue-600">{queue.filter(t => t.status === 'in-progress').length}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Completed</p>
          <p className="text-xl font-bold text-green-600">{queue.filter(t => t.status === 'completed').length}</p>
        </div>
      </div>
    </motion.div>
  )
}

export default LabQueue