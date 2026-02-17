import Token from '../models/Token.js'
import Appointment from '../models/Appointment.js'

// Get doctor's queue (patients called or in-progress)
export const getDoctorQueue = async (req, res) => {
  try {
    const queue = await Token.find({ 
      status: { $in: ['called', 'in-progress'] }
    })
      .populate('patientId', 'fullName email phone age gender priorityType')
      .sort({ calledAt: 1 })

    res.json(queue)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Update patient notes
export const updatePatientNotes = async (req, res) => {
  try {
    const { tokenId } = req.params
    const { notes } = req.body

    const token = await Token.findById(tokenId)
    if (!token) {
      return res.status(404).json({ error: 'Token not found' })
    }

    token.notes = notes
    await token.save()

    res.json({
      message: 'Notes updated successfully',
      token
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Get patient medical history
export const getPatientHistory = async (req, res) => {
  try {
    const { patientId } = req.params

    const appointments = await Appointment.find({ patientId })
      .populate('doctorId', 'fullName')
      .sort({ date: -1 })

    const tokens = await Token.find({ patientId })
      .sort({ arrivalTime: -1 })

    res.json({
      appointments,
      tokens,
      patient: {
        totalVisits: appointments.length,
        lastVisit: appointments[0]?.date || null,
        averageWaitTime: tokens.reduce((acc, token) => acc + (token.estimatedWaitTime || 0), 0) / tokens.length || 0
      }
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}