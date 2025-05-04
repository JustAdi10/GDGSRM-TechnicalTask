const express = require('express');
const { getDashboardStats, getEventStats } = require('../controllers/dashboard');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Get dashboard statistics
router.get('/', protect, authorize('admin'), getDashboardStats);

// Get event statistics
router.get('/events/:id/stats', protect, authorize('admin'), getEventStats);

module.exports = router;
