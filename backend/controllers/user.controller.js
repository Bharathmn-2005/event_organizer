import User from '../models/User.model.js';

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate({ path: 'joinedEvents', populate: { path: 'createdBy', select: 'name email' } })
      .populate('createdEvents');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error while fetching profile' });
  }
};

export const getJoinedEvents = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({ path: 'joinedEvents', populate: { path: 'createdBy', select: 'name email' } });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, count: user.joinedEvents.length, events: user.joinedEvents });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error while fetching joined events' });
  }
};

export const getCreatedEvents = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({ path: 'createdEvents', populate: { path: 'attendees', select: 'name email' } });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, count: user.createdEvents.length, events: user.createdEvents });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error while fetching created events' });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const { name, avatar } = req.body;
    const updateData = {};
    if (name) updateData.name = name;
    if (avatar) updateData.avatar = avatar;
    const user = await User.findByIdAndUpdate(req.user._id, updateData, { new: true, runValidators: true });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, message: 'Profile updated successfully', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error while updating profile' });
  }
};
