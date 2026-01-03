const AuditLog = require('../models/AuditLog');

exports.getAuditLogs = async (req, res) => {
  try {
    const logs = await AuditLog.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);
    
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};