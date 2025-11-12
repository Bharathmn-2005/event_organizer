import express from 'express';
import { 
  getUserProfile, 
  getJoinedEvents, 
  getCreatedEvents,
  updateUserProfile
} from '../controllers/user.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

// All user routes require authentication
router.use(authenticate);

// @route   GET /api/users/profile
// @desc    Get current user profile
// @access  Private
router.get('/profile', getUserProfile);

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', updateUserProfile);

// @route   GET /api/users/joined-events
// @desc    Get all events joined by current user
// @access  Private
router.get('/joined-events', getJoinedEvents);

// @route   GET /api/users/created-events
// @desc    Get all events created by current user
// @access  Private
router.get('/created-events', getCreatedEvents);

export default router;
