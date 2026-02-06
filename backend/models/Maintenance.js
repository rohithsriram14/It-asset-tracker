const mongoose = require('mongoose');

const MaintenanceSchema = new mongoose.Schema({
    assetId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Asset',
        required: true
    },
    maintenanceDate: {
        type: Date,
        default: Date.now
    },
    issueDescription: {
        type: String,
        required: [true, 'Please add issue description']
    },
    vendor: {
        type: String
    },
    cost: {
        type: Number
    },
    nextMaintenanceDate: {
        type: Date
    },
    status: {
        type: String,
        enum: ['Open', 'Closed'],
        default: 'Open'
    }
});

module.exports = mongoose.model('Maintenance', MaintenanceSchema);
