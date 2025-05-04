const Event = require('../models/Event');
const Registration = require('../models/Registration');
const { exportToJSON, exportToCSV } = require('../utils/exportData');

// @desc    Create new event
// @route   POST /api/events
// @access  Private/Admin
exports.createEvent = async (req, res, next) => {
  try {
    // Add user to req.body
    req.body.createdBy = req.user.id;

    const event = await Event.create(req.body);

    res.status(201).json({
      success: true,
      data: event
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all events
// @route   GET /api/events
// @access  Public
exports.getEvents = async (req, res, next) => {
  try {
    const events = await Event.find().sort({ date: 1 });

    res.status(200).json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
exports.getEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: `Event not found with id of ${req.params.id}`
      });
    }

    res.status(200).json({
      success: true,
      data: event
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private/Admin
exports.updateEvent = async (req, res, next) => {
  try {
    let event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: `Event not found with id of ${req.params.id}`
      });
    }

    event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: event
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private/Admin
exports.deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: `Event not found with id of ${req.params.id}`
      });
    }

    // Delete all registrations for this event
    await Registration.deleteMany({ event: req.params.id });

    // Delete the event
    await event.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get attendees for an event
// @route   GET /api/events/:id/attendees
// @access  Private/Admin
exports.getEventAttendees = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: `Event not found with id of ${req.params.id}`
      });
    }

    const registrations = await Registration.find({ event: req.params.id })
      .populate({
        path: 'user',
        select: 'name email studentID'
      });

    res.status(200).json({
      success: true,
      count: registrations.length,
      checkedIn: registrations.filter(reg => reg.isCheckedIn).length,
      data: registrations
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Export attendees for an event
// @route   GET /api/events/:id/export
// @access  Private/Admin
exports.exportEventAttendees = async (req, res, next) => {
  try {
    const { format } = req.query;

    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: `Event not found with id of ${req.params.id}`
      });
    }

    const registrations = await Registration.find({ event: req.params.id })
      .populate({
        path: 'user',
        select: 'name email studentID'
      });

    let result;

    if (format === 'json') {
      result = await exportToJSON(registrations, req.params.id);
    } else {
      result = await exportToCSV(registrations, req.params.id);
    }

    res.status(200).json({
      success: true,
      data: {
        fileName: result.fileName,
        filePath: result.filePath,
        format
      }
    });
  } catch (error) {
    next(error);
  }
};
