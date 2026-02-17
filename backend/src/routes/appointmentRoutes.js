import express from 'express';
import { 
  bookAppointment, 
  getUserAppointments, 
  getAllAppointments 
} from '../controllers/appointmentController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/book', authenticate, bookAppointment);
router.get('/my-appointments', authenticate, getUserAppointments);
router.get('/all', authenticate, authorize('staff', 'doctor'), getAllAppointments);

export default router;