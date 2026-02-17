import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext'

const PatientJourney = () => {
  const { user } = useAuth()
  const [journey, setJourney] = useState({
    doctor: null,
    lab: [],
    pharmacy: null
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchPatientJourney()
    }
  }, [user])

  const fetchPatientJourney = async () => {
    try {
      // Fetch doctor queue status
      const doctorRes = await axios.get('/api/queue/my-token')
      
      // Fetch lab queue status
      const labRes = await axios.get('/api/lab/patient')
      
      // Fetch pharmacy queue status
      const pharmacyRes = await axios.get('/api/pharmacy/patient')

      setJourney({
        doctor: doctorRes.data,
        lab: labRes.data,
        pharmacy: pharmacyRes.data
      })
    } catch (error) {
      console.error('Failed to fetch journey:', error)
    } finally {
      setLoading(false)
    }
  }

  const steps = [
    {
      name: 'Doctor Consultation',
      status: journey.doctor ? 'completed' : 'pending',
      token: journey.doctor?.tokenNumber,
      position: journey.doctor?.currentPosition,
      icon: '👨‍⚕️'
    },
    ...journey.lab.map(test => ({
      name: `Lab: ${test.testName}`,
      status: test.status,
      token: test.tokenNumber,
      position: test.currentPosition,
      icon: '🔬'
    })),
    journey.pharmacy ? {
      name: 'Pharmacy',
      status: journey.pharmacy.status,
      token: journey.pharmacy.tokenNumber,
      position: journey.pharmacy.currentPosition,
      icon: '💊'
    } : null
  ].filter(Boolean)

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-500'
      case 'in-progress': return 'bg-blue-500'
      case 'processing': return 'bg-yellow-500'
      case 'ready': return 'bg-purple-500'
      default: return 'bg-gray-300'
    }
  }

  if (loading) {
    return <div className="text-center py-4">Loading your journey...</div>
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-6"
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Your Healthcare Journey</h3>

      <div className="relative">
        {/* Progress Line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200" />

        {/* Steps */}
        <div className="space-y-6 relative">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start relative"
            >
              {/* Step Circle */}
              <div className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center text-xl ${
                step.status === 'completed' ? 'bg-green-100' : 'bg-gray-100'
              }`}>
                <span>{step.icon}</span>
                {step.status === 'completed' && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
                )}
              </div>

              {/* Step Content */}
              <div className="ml-4 flex-1">
                <h4 className="font-medium text-gray-900">{step.name}</h4>
                {step.token && (
                  <p className="text-sm text-gray-600">Token: {step.token}</p>
                )}
                {step.position && step.position > 0 && (
                  <div className="mt-2">
                    <div className="flex items-center">
                      <span className="text-xs text-gray-500 mr-2">Position: {step.position}</span>
                      <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(1 - (step.position / 10)) * 100}%` }}
                          className={`h-full ${getStatusColor(step.status)}`}
                        />
                      </div>
                    </div>
                  </div>
                )}
                <p className="text-xs text-gray-400 mt-1">
                  Status: <span className="capitalize">{step.status}</span>
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default PatientJourney