import { useState, useEffect } from 'react'
import { queueAPI } from '../../services/api'
import { useSocket } from '../../hooks/useSocket'
import Loader from '../common/Loader'
import toast from 'react-hot-toast'

const QueueStatus = () => {
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)
  const [waitTime, setWaitTime] = useState(0)
  const socketService = useSocket()

  useEffect(() => {
    fetchTokenStatus()
    
    // Set up socket listeners
    if (socketService.socket) {
      socketService.onQueueUpdated(() => {
        fetchTokenStatus()
      })

      socketService.onYourTurn((data) => {
        toast.success(`Your turn! ${data.message}`, {
          duration: 10000,
        })
        fetchTokenStatus()
      })
    }

    return () => {
      if (socketService.socket) {
        socketService.off('queue-updated')
        socketService.off('your-turn')
      }
    }
  }, [socketService])

  const fetchTokenStatus = async () => {
    try {
      setLoading(true)
      const response = await queueAPI.getMyToken()
      if (response.data) {
        setToken(response.data)
        // Calculate estimated wait time
        const estimatedMinutes = response.data.estimatedWaitTime || 0
        setWaitTime(estimatedMinutes)
      }
    } catch (error) {
      // No active token is okay
      setToken(null)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <Loader />

  if (!token) {
    return (
      <div className="bg-white rounded-xl shadow p-6 text-center">
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">No Active Token</h3>
        <p className="text-gray-500">Book an appointment to get your token and queue status</p>
      </div>
    )
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'waiting':
        return 'bg-yellow-100 text-yellow-800'
      case 'called':
        return 'bg-green-100 text-green-800'
      case 'in-progress':
        return 'bg-blue-100 text-blue-800'
      case 'completed':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'emergency':
        return 'bg-red-100 text-red-800'
      case 'senior':
        return 'bg-purple-100 text-purple-800'
      case 'normal':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Your Queue Status</h3>
            <p className="text-gray-600">Real-time position updates</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-blue-600">{token.tokenNumber}</div>
            <div className={`text-xs font-medium px-2 py-1 rounded-full ${getPriorityColor(token.priorityType)}`}>
              {token.priorityType.toUpperCase()}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{token.currentPosition || 'N/A'}</div>
            <div className="text-sm text-gray-600">Position in Queue</div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{waitTime}</div>
            <div className="text-sm text-gray-600">Est. Wait Time (min)</div>
          </div>
          
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">{token.priorityScore.toFixed(1)}</div>
            <div className="text-sm text-gray-600">Priority Score</div>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              <span className={`px-2 py-1 rounded text-sm ${getStatusColor(token.status)}`}>
                {token.status.replace('-', ' ').toUpperCase()}
              </span>
            </div>
            <div className="text-sm text-gray-600">Current Status</div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Estimated Timeline</h4>
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                    Your Position: {token.currentPosition}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-blue-600">
                    ~{waitTime} minutes
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                <div
                  style={{ width: `${Math.min(100, (token.currentPosition / 20) * 100)}%` }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                ></div>
              </div>
            </div>
          </div>

          {token.status === 'called' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="font-semibold text-green-800">Please proceed to the doctor's room</span>
              </div>
              <p className="text-green-700 mt-1">Your token has been called. Please go to the reception.</p>
            </div>
          )}

          {token.status === 'waiting' && token.currentPosition <= 3 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-yellow-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span className="font-semibold text-yellow-800">You're next in line!</span>
              </div>
              <p className="text-yellow-700 mt-1">Please be ready. Your turn is coming soon.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default QueueStatus