const express = require('express');
const router = express.Router();
const { getNotifications, markAsRead, deleteNotifications } = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getNotifications);
router.patch('/:id/read', protect, markAsRead);
router.delete('/', protect, deleteNotifications);

module.exports = router;