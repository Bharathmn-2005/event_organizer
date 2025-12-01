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
router.get('/', getAllEvents);
router.get('/:id', getEventById);
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
router.put('/:id', authenticate, updateEvent);
router.delete('/:id', authenticate, deleteEvent);
router.post('/:id/join', authenticate, joinEvent);
router.post('/:id/leave', authenticate, leaveEvent);

export default router;
