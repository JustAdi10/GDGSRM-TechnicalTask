const express = require('express');
const { check } = require('express-validator');
const { getUserRegistrations, checkInWithQR } = require('../controllers/registrations');
const { verifyTOTPForCheckIn } = require('../controllers/totp');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

// Get user's registrations
router.get('/', protect, getUserRegistrations);

// Check in with QR code
router.post(
  '/check-in',
  [
    protect,
    authorize('admin'),
    check('qrData', 'QR data is required').not().isEmpty(),
    validate
  ],
  checkInWithQR
);

// Verify TOTP for check-in
router.post(
  '/verify-totp',
  [
    protect,
    authorize('admin'),
    check('userId', 'User ID is required').not().isEmpty(),
    check('token', 'Token is required').not().isEmpty(),
    validate
  ],
  verifyTOTPForCheckIn
);

module.exports = router;
