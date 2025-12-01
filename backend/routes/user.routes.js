import express from 'express';
import { 
  getUserProfile, 
  getJoinedEvents, 
  getCreatedEvents,
  updateUserProfile
} from '../controllers/user.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();
router.use(authenticate);
router.get('/profile', getUserProfile);
router.put('/profile', updateUserProfile);
router.get('/joined-events', getJoinedEvents);
router.get('/created-events', getCreatedEvents);

export default router;
