import { io } from 'socket.io-client'

class SocketService {
  constructor() {
    this.socket = null
  }

  connect() {
    const token = localStorage.getItem('token')
    if (!this.socket && token) {
      this.socket = io('http://localhost:5000', {
        auth: { token },
        transports: ['websocket', 'polling']
      })
      
      this.socket.on('connect', () => {
        console.log('🔌 Socket connected:', this.socket.id)
      })
    }
    return this.socket
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }

  // Staff methods
  joinQueueRoom() {
    if (this.socket) {
      this.socket.emit('join-queue-room')
    }
  }

  // 🔴 FIX: Add doctor room join
  joinDoctorRoom() {
    if (this.socket) {
      this.socket.emit('join-doctor-room')
    }
  }

  joinUserRoom(userId) {
    if (this.socket) {
      this.socket.emit('join-user-room', userId)
    }
  }

  // Event listeners
  onQueueUpdated(callback) {
    if (this.socket) {
      this.socket.on('queue-updated', callback)
    }
  }

  onPatientCalled(callback) {
    if (this.socket) {
      this.socket.on('patient-called', callback)
    }
  }

  // 🔴 FIX: Add doctor-specific listeners
  onPatientCalledDoctor(callback) {
    if (this.socket) {
      this.socket.on('patient-called-doctor', callback)
    }
  }

  onQueueUpdatedDoctor(callback) {
    if (this.socket) {
      this.socket.on('queue-updated-doctor', callback)
    }
  }

  onYourTurn(callback) {
    if (this.socket) {
      this.socket.on('your-turn', callback)
    }
  }

  onEmergencyUpdated(callback) {
    if (this.socket) {
      this.socket.on('emergency-updated', callback)
    }
  }

  // Emitters
  callNextPatient(staffId) {
    if (this.socket) {
      this.socket.emit('call-next-patient', { staffId })
    }
  }

  markEmergency(tokenId) {
    if (this.socket) {
      this.socket.emit('mark-emergency', { tokenId })
    }
  }

  consultationComplete(tokenId) {
    if (this.socket) {
      this.socket.emit('consultation-complete', { tokenId })
    }
  }

  off(event) {
    if (this.socket) {
      this.socket.off(event)
    }
  }
}

export const socketService = new SocketService()