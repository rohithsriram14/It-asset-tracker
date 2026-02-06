const mongoose = require('mongoose');

const AuditLogSchema = new mongoose.Schema({
    action: {
        type: String,
        required: true
    },
    performedBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    entityType: {
        type: String,
        required: true
    },
    entityId: {
        type: String
    },
    description: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('AuditLog', AuditLogSchema);
