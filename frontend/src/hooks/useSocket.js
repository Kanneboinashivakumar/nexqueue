import { useEffect, useRef } from 'react'
import { socketService } from '../services/socketService'
import { useAuth } from '../context/AuthContext'

export const useSocket = () => {
  const { user } = useAuth()
  const socketRef = useRef(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token && user) {
      socketRef.current = socketService.connect(token)
      socketService.joinUserRoom(user.id)
      
      if (user.role === 'staff' || user.role === 'doctor') {
        socketService.joinQueueRoom()
      }
    }

    return () => {
      if (socketRef.current) {
        socketService.disconnect()
      }
    }
  }, [user])

  return socketService
}