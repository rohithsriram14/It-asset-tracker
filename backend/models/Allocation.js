const mongoose = require('mongoose');

const AllocationSchema = new mongoose.Schema({
    assetId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Asset',
        required: true
    },
    assignedTo: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    assignedBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    assignedDate: {
        type: Date,
        default: Date.now
    },
    returnDate: {
        type: Date
    },
    status: {
        type: String,
        enum: ['assigned', 'transferred', 'returned', 'retired'],
        default: 'assigned'
    },
    remarks: {
        type: String
    }
});

module.exports = mongoose.model('Allocation', AllocationSchema);
