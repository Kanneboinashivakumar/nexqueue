import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import axios from 'axios'
import toast from 'react-hot-toast'

const PharmacyQueue = () => {
  const [queue, setQueue] = useState([])
  const [loading, setLoading] = useState(false)

  // Dummy data for immediate display
  const dummyData = [
    {
      _id: '1',
      tokenNumber: 'PHM-20260214-001',
      patientId: { fullName: 'Rajesh Kumar', age: 35 },
      medicines: [
        { name: 'Paracetamol', dosage: '650mg', quantity: 10, instructions: 'After food' },
        { name: 'Azithromycin', dosage: '500mg', quantity: 3, instructions: 'Empty stomach' }
      ],
      priority: 'normal',
      status: 'waiting',
      currentPosition: 1,
      prescribedBy: { fullName: 'Dr. Amit Patel' }
    },
    {
      _id: '2',
      tokenNumber: 'PHM-20260214-002',
      patientId: { fullName: 'Lakshmi Amma', age: 68 },
      medicines: [
        { name: 'Amlodipine', dosage: '5mg', quantity: 30, instructions: 'Once daily' },
        { name: 'Metformin', dosage: '500mg', quantity: 60, instructions: 'Twice daily' }
      ],
      priority: 'normal',
      status: 'processing',
      currentPosition: 2,
      prescribedBy: { fullName: 'Dr. Amit Patel' }
    },
    {
      _id: '3',
      tokenNumber: 'PHM-20260214-003',
      patientId: { fullName: 'Emergency Patient', age: 45 },
      medicines: [
        { name: 'Nitroglycerin', dosage: '0.4mg', quantity: 10, instructions: 'Sublingual as needed' },
        { name: 'Aspirin', dosage: '325mg', quantity: 30, instructions: 'Once daily' }
      ],
      priority: 'emergency',
      status: 'ready',
      currentPosition: 3,
      prescribedBy: { fullName: 'Dr. Sarah Lee' }
    },
    {
      _id: '4',
      tokenNumber: 'PHM-20260214-004',
      patientId: { fullName: 'John Doe', age: 28 },
      medicines: [
        { name: 'Cetirizine', dosage: '10mg', quantity: 15, instructions: 'Once daily at bedtime' },
        { name: 'Montelukast', dosage: '10mg', quantity: 15, instructions: 'Once daily' }
      ],
      priority: 'normal',
      status: 'completed',
      currentPosition: 4,
      prescribedBy: { fullName: 'Dr. Michael Chen' }
    },
    {
      _id: '5',
      tokenNumber: 'PHM-20260214-005',
      patientId: { fullName: 'Priya Sharma', age: 32 },
      medicines: [
        { name: 'Omeprazole', dosage: '20mg', quantity: 30, instructions: 'Before breakfast' },
        { name: 'Domperidone', dosage: '10mg', quantity: 30, instructions: 'Before meals' }
      ],
      priority: 'urgent',
      status: 'waiting',
      currentPosition: 5,
      prescribedBy: { fullName: 'Dr. Amit Patel' }
    }
  ]

  useEffect(() => {
    fetchPharmacyQueue()
  }, [])

  const fetchPharmacyQueue = async () => {
    setLoading(true)
    try {
      const response = await axios.get('/api/pharmacy/queue')
      if (response.data && response.data.queue && response.data.queue.length > 0) {
        setQueue(response.data.queue)
      } else {
        // Use dummy data if no real data
        setQueue(dummyData)
      }
    } catch (error) {
      console.log('Using dummy data for pharmacy queue')
      setQueue(dummyData)
    } finally {
      setLoading(false)
    }
  }

  const handleStartProcessing = async (id) => {
    try {
      setQueue(queue.map(item => 
        item._id === id ? { ...item, status: 'processing' } : item
      ))
      toast.success('Processing started')
    } catch (error) {
      toast.error('Failed to start processing')
    }
  }

  const handleMarkReady = async (id) => {
    try {
      setQueue(queue.map(item => 
        item._id === id ? { ...item, status: 'ready' } : item
      ))
      toast.success('Prescription ready for pickup')
    } catch (error) {
      toast.error('Failed to mark as ready')
    }
  }

  const handleCompletePickup = async (id) => {
    try {
      setQueue(queue.map(item => 
        item._id === id ? { ...item, status: 'completed' } : item
      ))
      toast.success('Pickup completed')
    } catch (error) {
      toast.error('Failed to complete pickup')
    }
  }

  const getStatusBadge = (status) => {
    const styles = {
      'waiting': 'bg-yellow-100 text-yellow-800 border border-yellow-200',
      'processing': 'bg-blue-100 text-blue-800 border border-blue-200',
      'ready': 'bg-green-100 text-green-800 border border-green-200',
      'completed': 'bg-gray-100 text-gray-800 border border-gray-200'
    }
    return styles[status] || 'bg-gray-100 text-gray-800'
  }

  const getPriorityBadge = (priority) => {
    const styles = {
      'emergency': 'bg-red-100 text-red-800 border border-red-200',
      'urgent': 'bg-orange-100 text-orange-800 border border-orange-200',
      'normal': 'bg-blue-100 text-blue-800 border border-blue-200'
    }
    return styles[priority] || 'bg-gray-100 text-gray-800'
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
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl flex items-center justify-center">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">💊 Pharmacy Queue</h2>
      </div>

      <div className="space-y-4">
        {queue.map((item) => (
          <motion.div
            key={item._id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.01 }}
            className="border border-gray-200 rounded-xl p-5 bg-white hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <span className="font-mono text-sm bg-gray-100 px-3 py-1.5 rounded-lg">
                  {item.tokenNumber}
                </span>
                <span className={`px-3 py-1 text-xs font-medium rounded-full ${getPriorityBadge(item.priority)}`}>
                  {item.priority}
                </span>
                <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusBadge(item.status)}`}>
                  {item.status}
                </span>
              </div>
              <span className="text-sm bg-purple-100 text-purple-800 px-3 py-1.5 rounded-lg font-medium">
                Position #{item.currentPosition}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Patient</p>
                <p className="font-medium text-gray-900">{item.patientId?.fullName}</p>
                <p className="text-xs text-gray-500">Age: {item.patientId?.age}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Prescribed By</p>
                <p className="font-medium text-gray-900">{item.prescribedBy?.fullName}</p>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-xs text-gray-500 mb-2">Medicines:</p>
              <div className="space-y-2">
                {item.medicines?.map((med, idx) => (
                  <div key={idx} className="bg-blue-50 p-3 rounded-lg flex items-center justify-between">
                    <div>
                      <span className="font-medium text-gray-900">{med.name}</span>
                      <span className="text-sm text-gray-600 ml-2">{med.dosage}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-sm bg-white px-2 py-1 rounded">Qty: {med.quantity}</span>
                      {med.instructions && (
                        <span className="text-xs text-gray-500 italic">{med.instructions}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-2 mt-3 pt-3 border-t border-gray-100">
              {item.status === 'waiting' && (
                <button
                  onClick={() => handleStartProcessing(item._id)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                >
                  Start Processing
                </button>
              )}
              {item.status === 'processing' && (
                <button
                  onClick={() => handleMarkReady(item._id)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
                >
                  Mark Ready
                </button>
              )}
              {item.status === 'ready' && (
                <button
                  onClick={() => handleCompletePickup(item._id)}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium"
                >
                  Complete Pickup
                </button>
              )}
              {item.status === 'completed' && (
                <span className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm">
                  Completed
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {queue.length === 0 && (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-gray-500">No prescriptions in queue</p>
        </div>
      )}

      {/* Summary Stats */}
      <div className="mt-6 pt-6 border-t border-gray-200 grid grid-cols-4 gap-4">
        <div>
          <p className="text-xs text-gray-500">Total Prescriptions</p>
          <p className="text-xl font-bold text-gray-900">{queue.length}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Waiting</p>
          <p className="text-xl font-bold text-yellow-600">{queue.filter(p => p.status === 'waiting').length}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Processing</p>
          <p className="text-xl font-bold text-blue-600">{queue.filter(p => p.status === 'processing').length}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Ready/Completed</p>
          <p className="text-xl font-bold text-green-600">{queue.filter(p => ['ready', 'completed'].includes(p.status)).length}</p>
        </div>
      </div>
    </motion.div>
  )
}

export default PharmacyQueue