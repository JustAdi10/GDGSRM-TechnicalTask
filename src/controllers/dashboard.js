const Event = require('../models/Event');
const Registration = require('../models/Registration');
const User = require('../models/User');

// @desc    Get dashboard statistics
// @route   GET /api/dashboard
// @access  Private/Admin
exports.getDashboardStats = async (req, res, next) => {
  try {
    // Get total users count
    const totalUsers = await User.countDocuments({ role: 'student' });
    
    // Get total events count
    const totalEvents = await Event.countDocuments();
    
    // Get total registrations count
    const totalRegistrations = await Registration.countDocuments();
    
    // Get total check-ins count
    const totalCheckIns = await Registration.countDocuments({ isCheckedIn: true });
    
    // Get upcoming events
    const upcomingEvents = await Event.find({
      date: { $gte: new Date() }
    }).sort({ date: 1 }).limit(5);
    
    // Get recent registrations
    const recentRegistrations = await Registration.find()
      .sort({ registeredAt: -1 })
      .limit(10)
      .populate({
        path: 'user',
        select: 'name email studentID'
      })
      .populate({
        path: 'event',
        select: 'title date time'
      });
    
    // Get event statistics
    const events = await Event.find();
    const eventStats = await Promise.all(
      events.map(async (event) => {
        const registrations = await Registration.countDocuments({ event: event._id });
        const checkIns = await Registration.countDocuments({ 
          event: event._id,
          isCheckedIn: true
        });
        
        return {
          id: event._id,
          title: event.title,
          date: event.date,
          registrations,
          checkIns,
          checkInRate: registrations > 0 ? (checkIns / registrations) * 100 : 0
        };
      })
    );
    
    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalEvents,
        totalRegistrations,
        totalCheckIns,
        checkInRate: totalRegistrations > 0 ? (totalCheckIns / totalRegistrations) * 100 : 0,
        upcomingEvents,
        recentRegistrations,
        eventStats
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get event statistics
// @route   GET /api/dashboard/events/:id/stats
// @access  Private/Admin
exports.getEventStats = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: `Event not found with id of ${req.params.id}`
      });
    }
    
    // Get registrations count
    const registrationsCount = await Registration.countDocuments({ event: req.params.id });
    
    // Get check-ins count
    const checkInsCount = await Registration.countDocuments({ 
      event: req.params.id,
      isCheckedIn: true
    });
    
    // Get check-in rate
    const checkInRate = registrationsCount > 0 ? (checkInsCount / registrationsCount) * 100 : 0;
    
    // Get hourly check-in distribution
    const checkIns = await Registration.find({
      event: req.params.id,
      isCheckedIn: true,
      checkedInAt: { $exists: true }
    }).select('checkedInAt');
    
    // Create hourly distribution
    const hourlyDistribution = Array(24).fill(0);
    
    checkIns.forEach(checkIn => {
      const hour = new Date(checkIn.checkedInAt).getHours();
      hourlyDistribution[hour]++;
    });
    
    res.status(200).json({
      success: true,
      data: {
        event: {
          id: event._id,
          title: event.title,
          date: event.date,
          time: event.time,
          location: event.location
        },
        registrationsCount,
        checkInsCount,
        checkInRate,
        hourlyDistribution
      }
    });
  } catch (error) {
    next(error);
  }
};
