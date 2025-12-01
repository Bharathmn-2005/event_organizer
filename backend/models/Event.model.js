import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 100 },
  description: { type: String, required: true, maxlength: 2000 },
  category: { type: String, required: true, enum: ['Indie','Electronic','Rock','Jazz','Hip Hop','Classical','Pop','Country'] },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  location: { type: String, required: true, trim: true },
  organizer: { type: String, required: true, trim: true },
  imageUrl: { type: String, default: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&h=600&fit=crop' },
  programInfo: { type: String, default: '' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  maxAttendees: { type: Number, default: 1000, min: 1 },
  status: { type: String, enum: ['upcoming','ongoing','completed','cancelled'], default: 'upcoming' }
}, { timestamps: true });

eventSchema.index({ title: 'text', location: 'text', organizer: 'text' });
eventSchema.index({ category: 1 });
eventSchema.index({ date: 1 });
eventSchema.index({ createdBy: 1 });

eventSchema.virtual('attendeeCount').get(function() { return this.attendees.length; });

eventSchema.set('toJSON', { virtuals: true });
eventSchema.set('toObject', { virtuals: true });

export default mongoose.model('Event', eventSchema);
