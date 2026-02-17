import express from 'express';
import {
  addToPharmacyQueue,
  getPharmacyQueue,
  startProcessing,
  markAsReady,
  completePickup
} from '../controllers/pharmacyController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/add', authenticate, authorize('doctor'), addToPharmacyQueue);
router.get('/queue', authenticate, authorize('staff', 'doctor'), getPharmacyQueue);
router.put('/start/:id', authenticate, authorize('staff'), startProcessing);
router.put('/ready/:id', authenticate, authorize('staff'), markAsReady);
router.put('/complete/:id', authenticate, authorize('staff'), completePickup);

export default router;