const Registration = require('../models/Registration');
const Event = require('../models/Event');
const User = require('../models/User');
const { generateQRCode } = require('../utils/qrGenerator');
const { sendQRCodeEmail, createEventRegistrationEmailTemplate } = require('../utils/emailSender');

// @desc    Register for an event
// @route   POST /api/events/:eventId/register
// @access  Private
exports.registerForEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.eventId);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: `Event not found with id of ${req.params.eventId}`
      });
    }

    // Check if user is already registered
    const existingRegistration = await Registration.findOne({
      user: req.user.id,
      event: req.params.eventId
    });

    if (existingRegistration) {
      return res.status(400).json({
        success: false,
        message: 'You are already registered for this event'
      });
    }

    // Generate QR code
    const qrData = {
      userId: req.user.id,
      eventId: req.params.eventId,
      timestamp: new Date().toISOString()
    };

    const qrResult = await generateQRCode(qrData);

    // Create registration
    const registration = await Registration.create({
      user: req.user.id,
      event: req.params.eventId,
      qrCode: qrResult.qrCodeData
    });

    // Send email with QR code
    const user = await User.findById(req.user.id);
    
    const emailHtml = createEventRegistrationEmailTemplate(user, event, qrResult.fileName);
    
    await sendQRCodeEmail({
      email: user.email,
      subject: `Registration Confirmation: ${event.title}`,
      html: emailHtml,
      qrFileName: qrResult.fileName,
      qrFilePath: qrResult.filePath
    });

    res.status(201).json({
      success: true,
      data: registration
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's registrations
// @route   GET /api/registrations
// @access  Private
exports.getUserRegistrations = async (req, res, next) => {
  try {
    const registrations = await Registration.find({ user: req.user.id })
      .populate({
        path: 'event',
        select: 'title description location date time'
      });

    res.status(200).json({
      success: true,
      count: registrations.length,
      data: registrations
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Check in with QR code
// @route   POST /api/check-in
// @access  Private/Admin
exports.checkInWithQR = async (req, res, next) => {
  try {
    const { qrData } = req.body;

    if (!qrData) {
      return res.status(400).json({
        success: false,
        message: 'Please provide QR code data'
      });
    }

    let parsedData;
    try {
      parsedData = JSON.parse(qrData);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: 'Invalid QR code data'
      });
    }

    const { userId, eventId } = parsedData;

    if (!userId || !eventId) {
      return res.status(400).json({
        success: false,
        message: 'Invalid QR code data'
      });
    }

    // Find registration
    const registration = await Registration.findOne({
      user: userId,
      event: eventId
    }).populate({
      path: 'user',
      select: 'name email studentID'
    }).populate({
      path: 'event',
      select: 'title'
    });

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found'
      });
    }

    // Check if already checked in
    if (registration.isCheckedIn) {
      return res.status(400).json({
        success: false,
        message: 'User already checked in',
        data: {
          user: registration.user,
          event: registration.event,
          checkedInAt: registration.checkedInAt
        }
      });
    }

    // Update registration
    registration.isCheckedIn = true;
    registration.checkedInAt = new Date();
    await registration.save();

    res.status(200).json({
      success: true,
      message: 'Check-in successful',
      data: {
        user: registration.user,
        event: registration.event,
        checkedInAt: registration.checkedInAt
      }
    });
  } catch (error) {
    next(error);
  }
};
