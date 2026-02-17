import express from 'express';
import {
  createPrescription,
  getPatientPrescriptions,  // ✅ NOW THIS EXISTS
  getAllPrescriptions,
  getPrescriptionById
} from '../controllers/prescriptionController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Doctor routes
router.post('/create', authorize('doctor'), createPrescription);

// Patient routes
router.get('/patient/:patientId', getPatientPrescriptions);

// Admin routes
router.get('/all', authorize('admin'), getAllPrescriptions);

// General routes
router.get('/:id', getPrescriptionById);

export default router;