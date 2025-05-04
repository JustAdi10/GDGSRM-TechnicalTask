const express = require('express');
const { check } = require('express-validator');
const {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventAttendees,
  exportEventAttendees
} = require('../controllers/events');
const { registerForEvent } = require('../controllers/registrations');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

// Get all events and create event
router
  .route('/')
  .get(getEvents)
  .post(
    [
      protect,
      authorize('admin'),
      check('title', 'Title is required').not().isEmpty(),
      check('description', 'Description is required').not().isEmpty(),
      check('location', 'Location is required').not().isEmpty(),
      check('date', 'Date is required').not().isEmpty(),
      check('time', 'Time is required').not().isEmpty(),
      validate
    ],
    createEvent
  );

// Get, update and delete single event
router
  .route('/:id')
  .get(getEvent)
  .put(
    [
      protect,
      authorize('admin'),
      check('title', 'Title is required').optional().not().isEmpty(),
      check('description', 'Description is required').optional().not().isEmpty(),
      check('location', 'Location is required').optional().not().isEmpty(),
      check('date', 'Date is required').optional().not().isEmpty(),
      check('time', 'Time is required').optional().not().isEmpty(),
      validate
    ],
    updateEvent
  )
  .delete(protect, authorize('admin'), deleteEvent);

// Register for an event
router.post('/:eventId/register', protect, registerForEvent);

// Get attendees for an event
router.get('/:id/attendees', protect, authorize('admin'), getEventAttendees);

// Export attendees for an event
router.get(
  '/:id/export',
  [
    protect,
    authorize('admin'),
    check('format', 'Format must be either json or csv').isIn(['json', 'csv']),
    validate
  ],
  exportEventAttendees
);

module.exports = router;
