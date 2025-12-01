import { validationResult } from 'express-validator';
import Event from '../models/Event.model.js';
import User from '../models/User.model.js';

export const getAllEvents = async (req, res) => {
  try {
    const { category, search, sort = '-createdAt', limit = 50, page = 1 } = req.query;
    let query = {};
    if (category && category !== 'All') query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { organizer: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
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
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error while fetching events' });
  }
};

export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('createdBy', 'name email avatar')
      .populate('attendees', 'name email avatar');
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
    res.json({ success: true, event });
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') return res.status(404).json({ success: false, message: 'Event not found' });
    res.status(500).json({ success: false, message: 'Server error while fetching event' });
  }
};

export const createEvent = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
    const eventData = { ...req.body, createdBy: req.user._id };
    const event = await Event.create(eventData);
    await User.findByIdAndUpdate(req.user._id, { $push: { createdEvents: event._id } });
    await event.populate('createdBy', 'name email');
    res.status(201).json({ success: true, message: 'Event created successfully', event });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error while creating event' });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
    if (event.createdBy.toString() !== req.user._id.toString()) return res.status(403).json({ success: false, message: 'Not authorized' });
    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).populate('createdBy', 'name email');
    res.json({ success: true, message: 'Event updated successfully', event: updatedEvent });
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') return res.status(404).json({ success: false, message: 'Event not found' });
    res.status(500).json({ success: false, message: 'Server error while updating event' });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
    if (event.createdBy.toString() !== req.user._id.toString()) return res.status(403).json({ success: false, message: 'Not authorized' });
    await Event.findByIdAndDelete(req.params.id);
    await User.findByIdAndUpdate(req.user._id, { $pull: { createdEvents: req.params.id } });
    await User.updateMany({ joinedEvents: req.params.id }, { $pull: { joinedEvents: req.params.id } });
    res.json({ success: true, message: 'Event deleted successfully' });
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') return res.status(404).json({ success: false, message: 'Event not found' });
    res.status(500).json({ success: false, message: 'Server error while deleting event' });
  }
};

export const joinEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
    if (event.attendees.includes(req.user._id)) return res.status(400).json({ success: false, message: 'Already joined' });
    if (event.attendees.length >= event.maxAttendees) return res.status(400).json({ success: false, message: 'Event is full' });
    event.attendees.push(req.user._id);
    await event.save();
    await User.findByIdAndUpdate(req.user._id, { $push: { joinedEvents: event._id } });
    await event.populate('createdBy', 'name email');
    await event.populate('attendees', 'name email');
    res.json({ success: true, message: 'Successfully joined the event', event });
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') return res.status(404).json({ success: false, message: 'Event not found' });
    res.status(500).json({ success: false, message: 'Server error while joining event' });
  }
};

export const leaveEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
    if (!event.attendees.includes(req.user._id)) return res.status(400).json({ success: false, message: 'Not joined' });
    event.attendees = event.attendees.filter(attendee => attendee.toString() !== req.user._id.toString());
    await event.save();
    await User.findByIdAndUpdate(req.user._id, { $pull: { joinedEvents: event._id } });
    res.json({ success: true, message: 'Successfully left the event' });
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') return res.status(404).json({ success: false, message: 'Event not found' });
    res.status(500).json({ success: false, message: 'Server error while leaving event' });
  }
};
