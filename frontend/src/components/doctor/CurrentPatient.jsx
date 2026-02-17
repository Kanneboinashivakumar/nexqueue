import { useState, useEffect, useRef } from 'react'
import { queueAPI } from '../../services/api'
import { socketService } from '../../services/socketService'
import PrescriptionModal from './PrescriptionModal'
import toast from 'react-hot-toast'

const CurrentPatient = () => {
  const [currentPatient, setCurrentPatient] = useState(null)
  const [prescription, setPrescription] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(true)
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false)
  const fetchedRef = useRef(false)
  const timeoutRef = useRef(null)

  // Fetch current patient with debounce
  const fetchCurrentPatient = async (isInitial = false) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(async () => {
      try {
        const response = await queueAPI.getDoctorQueue()
        
        if (response.data && response.data.length > 0) {
          const patient = response.data[0]
          setCurrentPatient(patient)
          if (patient.notes) {
            setNotes(patient.notes)
          }
        } else {
          setCurrentPatient(null)
          setNotes('')
          setPrescription('')
        }
      } catch (error) {
        console.error('Failed to fetch patient data:', error)
      } finally {
        if (isInitial) {
          setLoading(false)
          fetchedRef.current = true
        }
      }
    }, isInitial ? 0 : 100)
  }

  useEffect(() => {
    if (socketService.socket) {
      socketService.joinDoctorRoom()
    }

    if (!fetchedRef.current) {
      fetchCurrentPatient(true)
    }

    const handlePatientCalled = (data) => {
      console.log('👨‍⚕️ New patient called:', data)
      toast.success(`New patient: ${data.token.patientId?.fullName}`, {
        duration: 3000
      })
      fetchCurrentPatient()
    }

    const handleQueueUpdated = () => {
      console.log('🔄 Queue updated, refreshing...')
      fetchCurrentPatient()
    }

    const handleConsultationCompleted = () => {
      fetchCurrentPatient()
    }

    if (socketService.socket) {
      socketService.socket.off('patient-called-doctor', handlePatientCalled)
      socketService.socket.off('queue-updated-doctor', handleQueueUpdated)
      socketService.socket.off('consultation-completed', handleConsultationCompleted)
      
      socketService.socket.on('patient-called-doctor', handlePatientCalled)
      socketService.socket.on('queue-updated-doctor', handleQueueUpdated)
      socketService.socket.on('consultation-completed', handleConsultationCompleted)
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      if (socketService.socket) {
        socketService.socket.off('patient-called-doctor', handlePatientCalled)
        socketService.socket.off('queue-updated-doctor', handleQueueUpdated)
        socketService.socket.off('consultation-completed', handleConsultationCompleted)
      }
    }
  }, [])

  const handleSaveNotes = async () => {
    if (!currentPatient) return
    
    try {
      await queueAPI.updatePatientNotes(currentPatient._id, { notes })
      toast.success('Notes saved successfully')
    } catch (error) {
      toast.error('Failed to save notes')
    }
  }

  const handlePrintPrescription = () => {
    if (!currentPatient) return
    
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Prescription - NexQueue</title>
          <style>
            body { 
              font-family: 'Arial', sans-serif; 
              padding: 40px; 
              max-width: 800px; 
              margin: 0 auto;
              color: #1f2937;
            }
            .header { 
              text-align: center; 
              margin-bottom: 30px;
              border-bottom: 2px solid #2563eb;
              padding-bottom: 20px;
            }
            .hospital-name { 
              color: #2563eb; 
              font-size: 28px; 
              font-weight: bold;
              letter-spacing: 1px;
            }
            .tagline {
              color: #6b7280;
              font-size: 14px;
              margin-top: 5px;
            }
            .patient-info { 
              background: #f3f4f6; 
              padding: 25px; 
              border-radius: 12px; 
              margin-bottom: 25px;
              border-left: 6px solid #2563eb;
            }
            .prescription { 
              border: 1px solid #e5e7eb; 
              padding: 25px; 
              border-radius: 12px; 
              margin-bottom: 25px;
              background: white;
            }
            .notes {
              border: 1px solid #e5e7eb;
              padding: 25px;
              border-radius: 12px;
              margin-bottom: 25px;
              background: #fafafa;
            }
            .footer { 
              margin-top: 50px; 
              text-align: center; 
              color: #6b7280; 
              font-size: 12px;
              border-top: 1px solid #e5e7eb;
              padding-top: 20px;
            }
            h2 { 
              color: #1f2937;
              font-size: 20px;
              margin-top: 0;
              margin-bottom: 15px;
            }
            .doctor-signature {
              margin-top: 40px;
              text-align: right;
              border-top: 1px dashed #9ca3af;
              padding-top: 20px;
            }
            .badge {
              background: #2563eb;
              color: white;
              padding: 4px 12px;
              border-radius: 20px;
              font-size: 12px;
              display: inline-block;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="hospital-name">NexQueue Healthcare</div>
            <div class="tagline">Smart Queue Management System • DPDP Act Compliant</div>
          </div>
          
          <div class="patient-info">
            <h2>👤 Patient Information</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0;"><strong>Name:</strong></td>
                <td style="padding: 8px 0;">${currentPatient.patientId?.fullName || 'N/A'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0;"><strong>Age/Gender:</strong></td>
                <td style="padding: 8px 0;">${currentPatient.patientId?.age || 'N/A'} years</td>
              </tr>
              <tr>
                <td style="padding: 8px 0;"><strong>Token Number:</strong></td>
                <td style="padding: 8px 0;"><span class="badge">${currentPatient.tokenNumber}</span></td>
              </tr>
              <tr>
                <td style="padding: 8px 0;"><strong>Date:</strong></td>
                <td style="padding: 8px 0;">${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0;"><strong>Priority:</strong></td>
                <td style="padding: 8px 0; text-transform: uppercase;">${currentPatient.priorityType || 'NORMAL'}</td>
              </tr>
            </table>
          </div>
          
          <div class="prescription">
            <h2>💊 Prescription</h2>
            <p style="white-space: pre-wrap; line-height: 1.6; font-size: 15px;">${prescription || 'No prescription entered'}</p>
          </div>
          
          <div class="notes">
            <h2>📋 Doctor's Notes</h2>
            <p style="white-space: pre-wrap; line-height: 1.6; font-size: 15px;">${notes || 'No notes entered'}</p>
          </div>
          
          <div class="doctor-signature">
            <p><strong>Dr. ${currentPatient.doctorId?.fullName || 'Attending Physician'}</strong></p>
            <p style="color: #6b7280; font-size: 14px;">Medical License: NXQ-${Math.floor(Math.random() * 10000)}</p>
            <p style="color: #6b7280; font-size: 12px; margin-top: 10px;">Digitally Generated Prescription • No Signature Required</p>
          </div>
          
          <div class="footer">
            <p>© 2026 NexQueue India - Revolutionizing Healthcare Queues</p>
            <p style="margin-top: 5px;">Skip the Queue. Meet the Cure.</p>
          </div>
        </body>
      </html>
    `
    
    const printWindow = window.open('', '_blank')
    printWindow.document.write(printContent)
    printWindow.document.close()
    printWindow.focus()
    printWindow.print()
  }

  const handleCompleteConsultation = async () => {
    if (!currentPatient) return
    
    try {
      await queueAPI.markAsCompleted(currentPatient._id)
      if (socketService.socket) {
        socketService.socket.emit('consultation-complete', { 
          tokenId: currentPatient._id 
        })
      }
      toast.success(`Consultation completed for ${currentPatient.patientId?.fullName}`)
      setCurrentPatient(null)
      setPrescription('')
      setNotes('')
      fetchCurrentPatient()
    } catch (error) {
      toast.error('Failed to complete consultation')
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    )
  }

  if (!currentPatient) {
    return (
      <div className="bg-white rounded-xl shadow p-6">
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Active Patient</h3>
          <p className="text-gray-600">Waiting for staff to call the next patient</p>
          <div className="flex items-center justify-center space-x-2 mt-4 text-sm text-gray-500">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Ready to receive patients</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <h3 className="text-lg font-semibold">Current Consultation</h3>
            </div>
            <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
              Token: {currentPatient.tokenNumber}
            </span>
          </div>
        </div>

        <div className="p-6">
          {/* Patient Information */}
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <span className="text-3xl font-bold text-white">
                  {currentPatient.patientId?.fullName?.charAt(0) || 'P'}
                </span>
              </div>
              <div>
                <h4 className="text-2xl font-bold text-gray-900">{currentPatient.patientId?.fullName || 'Unknown'}</h4>
                <div className="flex items-center space-x-3 mt-1">
                  <span className="text-gray-600">{currentPatient.patientId?.age || 'N/A'} years</span>
                  <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    currentPatient.priorityType === 'emergency' ? 'bg-red-100 text-red-800' :
                    currentPatient.priorityType === 'senior' ? 'bg-purple-100 text-purple-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {currentPatient.priorityType?.toUpperCase() || 'NORMAL'}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h5 className="font-medium text-gray-700 mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Contact Information
                </h5>
                <div className="space-y-2">
                  <div className="flex items-center text-gray-600">
                    <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {currentPatient.patientId?.phone || 'Not provided'}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {currentPatient.patientId?.email || 'Not provided'}
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h5 className="font-medium text-gray-700 mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Queue Information
                </h5>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Called at:</span>
                    <span className="font-medium">
                      {currentPatient.calledAt ? new Date(currentPatient.calledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Wait time:</span>
                    <span className="font-medium">{currentPatient.estimatedWaitTime || 0} minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Priority score:</span>
                    <span className="font-medium">{currentPatient.priorityScore?.toFixed(1) || '0.0'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Consultation Area */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Doctor's Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter examination findings, diagnosis, and treatment notes..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prescription
              </label>
              <textarea
                value={prescription}
                onChange={(e) => setPrescription(e.target.value)}
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter medication, dosage, and instructions..."
              />
            </div>

            {/* Digital Prescription Button */}
            <div className="flex justify-center">
              <button
                onClick={() => setShowPrescriptionModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-teal-700 transition flex items-center space-x-2 shadow-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Create Digital Prescription</span>
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={handleSaveNotes}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
                Save Notes
              </button>
              
              <button
                onClick={handlePrintPrescription}
                className="px-6 py-2.5 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Print Prescription
              </button>
              
              <button
                onClick={handleCompleteConsultation}
                className="px-6 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Complete Consultation
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Prescription Modal */}
      <PrescriptionModal
        isOpen={showPrescriptionModal}
        onClose={() => setShowPrescriptionModal(false)}
        patient={currentPatient?.patientId}
        doctorId={currentPatient?.doctorId}
      />
    </>
  )
}

export default CurrentPatient