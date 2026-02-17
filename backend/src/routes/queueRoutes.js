import express from 'express';
import { 
  getQueue,
  getDoctorQueue,      // ✅ Added
  getPatientToken,
  callNextPatient,     // ✅ Added
  markAsEmergency,
  skipPatient,
  markAsCompleted,
  markAsInProgress,    // ✅ Added
  updatePatientNotes   // ✅ Added
} from '../controllers/queueController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Staff routes
router.get('/', authenticate, getQueue);
router.get('/my-token', authenticate, getPatientToken);
router.post('/call-next', authenticate, authorize('staff', 'doctor'), callNextPatient);
router.patch('/emergency/:tokenId', authenticate, authorize('staff', 'doctor'), markAsEmergency);
router.patch('/skip/:tokenId', authenticate, authorize('staff', 'doctor'), skipPatient);
router.patch('/complete/:tokenId', authenticate, authorize('staff', 'doctor'), markAsCompleted);

// Doctor routes
router.get('/doctor', authenticate, authorize('doctor'), getDoctorQueue);
router.patch('/in-progress/:tokenId', authenticate, authorize('doctor'), markAsInProgress);
router.patch('/:tokenId/notes', authenticate, authorize('doctor'), updatePatientNotes);

export default router;