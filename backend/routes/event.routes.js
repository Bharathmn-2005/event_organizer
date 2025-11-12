import express from 'express';
import { body } from 'express-validator';
import { 
  getAllEvents, 
  getEventById, 
  createEvent, 
  updateEvent, 
  deleteEvent,
  joinEvent,
  leaveEvent
} from '../controllers/event.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

// @route   GET /api/events
// @desc    Get all events (with optional filters)
// @access  Public
router.get('/', getAllEvents);

// @route   GET /api/events/:id
// @desc    Get single event by ID
// @access  Public
router.get('/:id', getEventById);

// @route   POST /api/events
// @desc    Create a new event
// @access  Private
router.post('/', authenticate, [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Event title is required')
    .isLength({ max: 100 })
    .withMessage('Title cannot exceed 100 characters'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Event description is required')
    .isLength({ max: 2000 })
    .withMessage('Description cannot exceed 2000 characters'),
  body('category')
    .notEmpty()
    .withMessage('Event category is required')
    .isIn(['Indie', 'Electronic', 'Rock', 'Jazz', 'Hip Hop', 'Classical', 'Pop', 'Country'])
    .withMessage('Invalid category'),
  body('date')
    .notEmpty()
    .withMessage('Event date is required')
    .isISO8601()
    .withMessage('Invalid date format'),
  body('time')
    .notEmpty()
    .withMessage('Event time is required'),
  body('location')
    .trim()
    .notEmpty()
    .withMessage('Event location is required'),
  body('organizer')
    .trim()
    .notEmpty()
    .withMessage('Organizer name is required')
], createEvent);

// @route   PUT /api/events/:id
// @desc    Update an event
// @access  Private (Only creator)
router.put('/:id', authenticate, updateEvent);

// @route   DELETE /api/events/:id
// @desc    Delete an event
// @access  Private (Only creator)
router.delete('/:id', authenticate, deleteEvent);

// @route   POST /api/events/:id/join
// @desc    Join an event
// @access  Private
router.post('/:id/join', authenticate, joinEvent);

// @route   POST /api/events/:id/leave
// @desc    Leave an event
// @access  Private
router.post('/:id/leave', authenticate, leaveEvent);

export default router;
