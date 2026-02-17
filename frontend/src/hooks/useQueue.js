import { useState, useEffect, useCallback } from 'react'
import { queueAPI } from '../services/api'
import { useSocket } from './useSocket'
import toast from 'react-hot-toast'

export const useQueue = () => {
  const [queue, setQueue] = useState([])
  const [loading, setLoading] = useState(true)
  const socketService = useSocket()

  const fetchQueue = useCallback(async () => {
    try {
      setLoading(true)
      const response = await queueAPI.getQueue()
      setQueue(response.data)
    } catch (error) {
      toast.error('Failed to fetch queue')
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch queue on mount
  useEffect(() => {
    fetchQueue()
  }, [fetchQueue])

  // Listen for real-time updates
  useEffect(() => {
    if (socketService.socket) {
      socketService.onQueueUpdated(() => {
        fetchQueue()
      })

      socketService.onEmergencyUpdated(() => {
        fetchQueue()
      })

      socketService.onPatientCalled((data) => {
        toast.success(`Patient ${data.token.patientId.fullName} called!`)
        fetchQueue()
      })

      socketService.onYourTurn((data) => {
        toast.success(`Your turn! ${data.message}`, {
          duration: 60000,
        })
      })
    }

    return () => {
      if (socketService.socket) {
        socketService.off('queue-updated')
        socketService.off('emergency-updated')
        socketService.off('patient-called')
        socketService.off('your-turn')
      }
    }
  }, [socketService, fetchQueue])

  const callNext = async () => {
    try {
      await queueAPI.callNextPatient()
      socketService.callNextPatient('staff')
      toast.success('Next patient called')
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to call next patient')
    }
  }

  const markEmergency = async (tokenId) => {
    try {
      await queueAPI.markAsEmergency(tokenId)
      socketService.markEmergency(tokenId)
      toast.success('Marked as emergency')
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to mark emergency')
    }
  }

  const skipPatient = async (tokenId) => {
    try {
      await queueAPI.skipPatient(tokenId)
      toast.success('Patient skipped')
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to skip patient')
    }
  }

  const completePatient = async (tokenId) => {
    try {
      await queueAPI.markAsCompleted(tokenId)
      toast.success('Patient completed')
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to complete patient')
    }
  }

  return {
    queue,
    loading,
    fetchQueue,
    callNext,
    markEmergency,
    skipPatient,
    completePatient,
  }
}