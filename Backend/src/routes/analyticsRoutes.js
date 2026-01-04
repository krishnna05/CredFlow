const express = require('express');
const router = express.Router();
const { getAnalyticsOverview } = require('../controllers/analyticsController');
const { protect, allowRoles } = require('../middleware/authMiddleware');

router.get('/overview', protect, allowRoles('business'), getAnalyticsOverview);

module.exports = router;