const express = require('express');
const { check } = require('express-validator');
const { register, login, getMe } = require('../controllers/auth');
const { enableTOTP, verifyAndActivateTOTP, disableTOTP } = require('../controllers/totp');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

// Register route with validation
router.post(
  '/register',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('studentID', 'Student ID is required').not().isEmpty(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
    validate
  ],
  register
);

// Login route with validation
router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
    validate
  ],
  login
);

// Get current user route
router.get('/me', protect, getMe);

// TOTP routes
router.post('/totp/enable', protect, enableTOTP);
router.post(
  '/totp/verify',
  [
    protect,
    check('token', 'Token is required').not().isEmpty(),
    validate
  ],
  verifyAndActivateTOTP
);
router.post('/totp/disable', protect, disableTOTP);

module.exports = router;
