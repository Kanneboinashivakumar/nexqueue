import { useState, useEffect } from 'react'
import { queueAPI } from '../../services/api'
import { useSocket } from '../../hooks/useSocket'
import Loader from '../common/Loader'
import toast from 'react-hot-toast'

const QueueControl = () => {
  const [queue, setQueue] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedToken, setSelectedToken] = useState(null)
  const socketService = useSocket()

  useEffect(() => {
    fetchQueue()

    // Listen for real-time updates
    if (socketService.socket) {
      socketService.onQueueUpdated(() => {
        fetchQueue()
      })

      socketService.onPatientCalled((data) => {
        toast.success(`Patient ${data.token.patientId?.fullName} called!`)
        fetchQueue()
      })
    }

    return () => {
      if (socketService.socket) {
        socketService.off('queue-updated')
        socketService.off('patient-called')
      }
    }
  }, [socketService])

  const fetchQueue = async () => {
    try {
      setLoading(true)
      const response = await queueAPI.getQueue()
      setQueue(response.data)
    } catch (error) {
      toast.error('Failed to fetch queue')
    } finally {
      setLoading(false)
    }
  }

  const callNextPatient = async () => {
    try {
      await queueAPI.callNextPatient()
      toast.success('Next patient called successfully')
      fetchQueue()
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to call next patient')
    }
  }

  const markEmergency = async (tokenId) => {
    try {
      await queueAPI.markAsEmergency(tokenId)
      toast.success('Patient marked as emergency')
      fetchQueue()
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to mark emergency')
    }
  }

  const skipPatient = async (tokenId) => {
    try {
      await queueAPI.skipPatient(tokenId)
      toast.success('Patient skipped')
      fetchQueue()
      setSelectedToken(null)
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to skip patient')
    }
  }

  const completePatient = async (tokenId) => {
    try {
      await queueAPI.markAsCompleted(tokenId)
      toast.success('Patient consultation completed')
      fetchQueue()
      setSelectedToken(null)
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to complete patient')
    }
  }

  if (loading) return <Loader />

  const currentToken = queue[0]

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Queue Management</h3>
        <div className="text-sm text-gray-500">
          {queue.length} patient{queue.length !== 1 ? 's' : ''} waiting
        </div>
      </div>

      {/* Current Token Display */}
      {currentToken && (
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-blue-600 font-medium">CURRENT PATIENT</div>
              <div className="text-xl font-bold text-gray-900">
                {currentToken.patientId?.fullName || 'Unknown Patient'}
              </div>
              <div className="text-sm text-gray-600">
                Token: {currentToken.tokenNumber} • 
                <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                  currentToken.priorityType === 'emergency' ? 'bg-red-100 text-red-800' :
                  currentToken.priorityType === 'senior' ? 'bg-purple-100 text-purple-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {currentToken.priorityType.toUpperCase()}
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-600">{currentToken.tokenNumber}</div>
              <div className="text-sm text-gray-600">Position: 1</div>
            </div>
          </div>
        </div>
      )}

      {/* Control Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <button
          onClick={callNextPatient}
          className="p-4 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition flex flex-col items-center"
        >
          <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Call Next
        </button>

        <button
          onClick={() => selectedToken && skipPatient(selectedToken._id)}
          disabled={!selectedToken}
          className="p-4 bg-yellow-600 text-white rounded-lg font-semibold hover:bg-yellow-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex flex-col items-center"
        >
          <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          Skip
        </button>

        <button
          onClick={() => selectedToken && markEmergency(selectedToken._id)}
          disabled={!selectedToken}
          className="p-4 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex flex-col items-center"
        >
          <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.246 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          Emergency
        </button>

        <button
          onClick={() => selectedToken && completePatient(selectedToken._id)}
          disabled={!selectedToken}
          className="p-4 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex flex-col items-center"
        >
          <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Complete
        </button>
      </div>

      {/* Queue List */}
      <div>
        <h4 className="font-medium text-gray-700 mb-3">Waiting Patients</h4>
        {queue.length === 0 ? (
          <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
            <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="mt-2">No patients in queue</p>
          </div>
        ) : (
          <div className="space-y-3">
            {queue.map((token, index) => (
              <div
                key={token._id}
                onClick={() => setSelectedToken(token)}
                className={`p-4 border rounded-lg cursor-pointer transition ${
                  selectedToken?._id === token._id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                      token.priorityType === 'emergency' ? 'bg-red-100 text-red-800' :
                      token.priorityType === 'senior' ? 'bg-purple-100 text-purple-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{token.patientId?.fullName || 'Unknown'}</div>
                      <div className="text-sm text-gray-600">
                        {token.patientId?.age || 'N/A'} years • Priority: {token.priorityType}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg">{token.tokenNumber}</div>
                    <div className="text-sm text-gray-600">
                      ~{token.estimatedWaitTime || 0} min wait
                    </div>
                  </div>
                </div>
                {selectedToken?._id === token._id && (
                  <div className="mt-3 pt-3 border-t border-gray-200 flex justify-end space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        markEmergency(token._id)
                      }}
                      className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
                    >
                      Emergency
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        skipPatient(token._id)
                      }}
                      className="px-3 py-1 text-sm bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200"
                    >
                      Skip
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        completePatient(token._id)
                      }}
                      className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200"
                    >
                      Complete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default QueueControl