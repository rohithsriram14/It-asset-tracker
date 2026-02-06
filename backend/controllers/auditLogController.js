const asyncHandler = require('express-async-handler');
const AuditLog = require('../models/AuditLog');

// @desc    Get Audit Logs
// @route   GET /api/auditlogs
// @access  Private/Admin
exports.getAuditLogs = asyncHandler(async (req, res) => {
    const logs = await AuditLog.find()
        .populate('performedBy', 'name email role')
        .sort('-timestamp')
        .limit(100); // Limit response size for performance

    res.status(200).json({
        success: true,
        count: logs.length,
        data: logs
    });
});
