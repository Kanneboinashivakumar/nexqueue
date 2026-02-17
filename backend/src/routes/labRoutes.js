import express from 'express';
import {
  addToLabQueue,
  getLabQueue,
  startLabTest,
  completeLabTest
} from '../controllers/labController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/add', authenticate, authorize('doctor'), addToLabQueue);
router.get('/queue', authenticate, authorize('staff', 'doctor'), getLabQueue);
router.put('/start/:id', authenticate, authorize('staff'), startLabTest);
router.put('/complete/:id', authenticate, authorize('staff'), completeLabTest);

export default router;