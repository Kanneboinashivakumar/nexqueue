import express from 'express'
import { authenticate, authorize } from '../middleware/auth.js'
import { 
  getDoctorQueue,
  updatePatientNotes,
  getPatientHistory 
} from '../controllers/doctorController.js'

const router = express.Router()

// Doctor-specific routes
router.get('/queue', authenticate, authorize('doctor'), getDoctorQueue)
router.patch('/:tokenId/notes', authenticate, authorize('doctor'), updatePatientNotes)
router.get('/patients/:patientId/history', authenticate, authorize('doctor'), getPatientHistory)

export default router