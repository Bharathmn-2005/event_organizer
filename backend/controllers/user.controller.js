import User from '../models/User.model.js';

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate({
        path: 'joinedEvents',
        populate: { path: 'createdBy', select: 'name email' }
      })
      .populate('createdEvents');

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Get User Profile Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching profile',
      error: error.message 
    });
  }
};

// @desc    Get user's joined events
// @route   GET /api/users/joined-events
// @access  Private
export const getJoinedEvents = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'joinedEvents',
      populate: { path: 'createdBy', select: 'name email' }
    });

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    res.json({
      success: true,
      count: user.joinedEvents.length,
      events: user.joinedEvents
    });
  } catch (error) {
    console.error('Get Joined Events Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching joined events',
      error: error.message 
    });
  }
};

// @desc    Get user's created events
// @route   GET /api/users/created-events
// @access  Private
export const getCreatedEvents = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'createdEvents',
      populate: { path: 'attendees', select: 'name email' }
    });

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    res.json({
      success: true,
      count: user.createdEvents.length,
      events: user.createdEvents
    });
  } catch (error) {
    console.error('Get Created Events Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching created events',
      error: error.message 
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req, res) => {
  try {
    const { name, avatar } = req.body;
    
    const updateData = {};
    if (name) updateData.name = name;
    if (avatar) updateData.avatar = avatar;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    console.error('Update User Profile Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while updating profile',
      error: error.message 
    });
  }
};
