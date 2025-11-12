import { validationResult } from 'express-validator';
import Event from '../models/Event.model.js';
import User from '../models/User.model.js';

// @desc    Get all events with filters
// @route   GET /api/events
// @access  Public
export const getAllEvents = async (req, res) => {
  try {
    const { category, search, sort = '-createdAt', limit = 50, page = 1 } = req.query;
    
    let query = {};
    
    // Filter by category
    if (category && category !== 'All') {
      query.category = category;
    }
    
    // Search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { organizer: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Pagination
    const skip = (page - 1) * limit;
    
    const events = await Event.find(query)
      .populate('createdBy', 'name email')
      .populate('attendees', 'name email')
      .sort(sort)
      .limit(parseInt(limit))
      .skip(skip);
    
    const total = await Event.countDocuments(query);
    
    res.json({
      success: true,
      count: events.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      events
    });
  } catch (error) {
    console.error('Get All Events Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching events',
      error: error.message 
    });
  }
};

// @desc    Get event by ID
// @route   GET /api/events/:id
// @access  Public
export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('createdBy', 'name email avatar')
      .populate('attendees', 'name email avatar');
    
    if (!event) {
      return res.status(404).json({ 
        success: false, 
        message: 'Event not found' 
      });
    }
    
    res.json({
      success: true,
      event
    });
  } catch (error) {
    console.error('Get Event By ID Error:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ 
        success: false, 
        message: 'Event not found' 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching event',
      error: error.message 
    });
  }
};

// @desc    Create new event
// @route   POST /api/events
// @access  Private
export const createEvent = async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        message: 'Validation failed',
        errors: errors.array() 
      });
    }

    const eventData = {
      ...req.body,
      createdBy: req.user._id
    };

    const event = await Event.create(eventData);

    // Add event to user's created events
    await User.findByIdAndUpdate(req.user._id, {
      $push: { createdEvents: event._id }
    });

    // Populate creator info
    await event.populate('createdBy', 'name email');

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      event
    });
  } catch (error) {
    console.error('Create Event Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while creating event',
      error: error.message 
    });
  }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private (Only creator)
export const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ 
        success: false, 
        message: 'Event not found' 
      });
    }

    // Check if user is the creator
    if (event.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        success: false, 
        message: 'You are not authorized to update this event' 
      });
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email');

    res.json({
      success: true,
      message: 'Event updated successfully',
      event: updatedEvent
    });
  } catch (error) {
    console.error('Update Event Error:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ 
        success: false, 
        message: 'Event not found' 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Server error while updating event',
      error: error.message 
    });
  }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private (Only creator)
export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ 
        success: false, 
        message: 'Event not found' 
      });
    }

    // Check if user is the creator
    if (event.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        success: false, 
        message: 'You are not authorized to delete this event' 
      });
    }

    await Event.findByIdAndDelete(req.params.id);

    // Remove from creator's created events
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { createdEvents: req.params.id }
    });

    // Remove from all attendees' joined events
    await User.updateMany(
      { joinedEvents: req.params.id },
      { $pull: { joinedEvents: req.params.id } }
    );

    res.json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    console.error('Delete Event Error:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ 
        success: false, 
        message: 'Event not found' 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Server error while deleting event',
      error: error.message 
    });
  }
};

// @desc    Join an event
// @route   POST /api/events/:id/join
// @access  Private
export const joinEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ 
        success: false, 
        message: 'Event not found' 
      });
    }

    // Check if user already joined
    if (event.attendees.includes(req.user._id)) {
      return res.status(400).json({ 
        success: false, 
        message: 'You have already joined this event' 
      });
    }

    // Check if event is full
    if (event.attendees.length >= event.maxAttendees) {
      return res.status(400).json({ 
        success: false, 
        message: 'Event is full, no more attendees allowed' 
      });
    }

    // Add user to attendees
    event.attendees.push(req.user._id);
    await event.save();

    // Add event to user's joined events
    await User.findByIdAndUpdate(req.user._id, {
      $push: { joinedEvents: event._id }
    });

    await event.populate('createdBy', 'name email');
    await event.populate('attendees', 'name email');

    res.json({
      success: true,
      message: 'Successfully joined the event',
      event
    });
  } catch (error) {
    console.error('Join Event Error:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ 
        success: false, 
        message: 'Event not found' 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Server error while joining event',
      error: error.message 
    });
  }
};

// @desc    Leave an event
// @route   POST /api/events/:id/leave
// @access  Private
export const leaveEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ 
        success: false, 
        message: 'Event not found' 
      });
    }

    // Check if user has joined
    if (!event.attendees.includes(req.user._id)) {
      return res.status(400).json({ 
        success: false, 
        message: 'You have not joined this event' 
      });
    }

    // Remove user from attendees
    event.attendees = event.attendees.filter(
      attendee => attendee.toString() !== req.user._id.toString()
    );
    await event.save();

    // Remove event from user's joined events
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { joinedEvents: event._id }
    });

    res.json({
      success: true,
      message: 'Successfully left the event'
    });
  } catch (error) {
    console.error('Leave Event Error:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ 
        success: false, 
        message: 'Event not found' 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Server error while leaving event',
      error: error.message 
    });
  }
};
