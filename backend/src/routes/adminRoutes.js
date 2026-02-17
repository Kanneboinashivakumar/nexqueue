import express from 'express';
import { 
  getDashboardStats,
  getUsers,
  updateUser,
  getPerformanceMetrics
} from '../controllers/adminController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticate, authorize('admin'));

router.get('/stats', getDashboardStats);
router.get('/users', getUsers);
router.put('/users/:id', updateUser);
router.get('/performance', getPerformanceMetrics);

export default router;