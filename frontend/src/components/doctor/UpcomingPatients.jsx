import { useState, useEffect } from 'react'
import { queueAPI } from '../../services/api'
import Loader from '../common/Loader'

const UpcomingPatients = () => {
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUpcomingPatients()
    const interval = setInterval(fetchUpcomingPatients, 10000) // Update every 10 seconds
    return () => clearInterval(interval)
  }, [])

  const fetchUpcomingPatients = async () => {
    try {
      setLoading(true)
      const response = await queueAPI.getQueue()
      // Only show waiting patients
      const waitingPatients = response.data.filter(p => p.status === 'waiting')
      setPatients(waitingPatients.slice(0, 5)) // Show next 5 patients
    } catch (error) {
      console.error('Failed to fetch upcoming patients:', error)
    } finally {
      setLoading(false)
    }
  }

  const getWaitTimeColor = (minutes) => {
    if (minutes < 10) return 'text-green-600'
    if (minutes < 20) return 'text-yellow-600'
    return 'text-red-600'
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Patients</h3>
      
      {patients.length === 0 ? (
        <div className="text-center py-8">
          <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.707-3.707a10 10 0 01-1.414 1.414M13 10a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <p className="mt-2 text-gray-500">No patients waiting</p>
        </div>
      ) : (
        <div className="space-y-4">
          {patients.map((patient, index) => (
            <div key={patient._id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                  patient.priorityType === 'emergency' ? 'bg-red-100 text-red-800' :
                  patient.priorityType === 'senior' ? 'bg-purple-100 text-purple-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {index + 1}
                </div>
                <div>
                  <div className="font-medium text-gray-900">{patient.patientId?.fullName || 'Unknown'}</div>
                  <div className="text-sm text-gray-500">
                    Token: {patient.tokenNumber} • {patient.patientId?.age || 'N/A'} years
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-sm font-medium ${getWaitTimeColor(patient.estimatedWaitTime || 0)}`}>
                  ~{patient.estimatedWaitTime || 0} min
                </div>
                <div className="text-xs text-gray-500">Est. wait</div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Total Waiting:</span>
          <span className="font-medium">{patients.length} patients</span>
        </div>
        <div className="flex justify-between text-sm mt-1">
          <span className="text-gray-600">Next Patient:</span>
          <span className="font-medium">
            {patients[0] ? `Token ${patients[0].tokenNumber}` : 'None'}
          </span>
        </div>
      </div>
    </div>
  )
}

export default UpcomingPatients