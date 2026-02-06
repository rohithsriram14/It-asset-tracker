const mongoose = require('mongoose');

const AssetSchema = new mongoose.Schema({
    assetId: {
        type: String,
        required: [true, 'Please add an asset ID'],
        unique: true
    },
    assetType: {
        type: String,
        required: [true, 'Please select an asset type'],
        enum: ['Laptop', 'Desktop', 'Server', 'Printer', 'Software License', 'Other']
    },
    brand: {
        type: String,
        required: [true, 'Please add a brand']
    },
    model: {
        type: String,
        required: [true, 'Please add a model']
    },
    serialNumber: {
        type: String,
        required: [true, 'Please add a serial number']
    },
    purchaseDate: {
        type: Date,
        required: [true, 'Please add a purchase date']
    },
    warrantyExpiryDate: {
        type: Date,
        required: [true, 'Please add warranty expiry date']
    },
    vendor: {
        type: String,
        required: [true, 'Please add a vendor']
    },
    cost: {
        type: Number,
        required: [true, 'Please add cost']
    },
    department: {
        type: String,
        required: [true, 'Please add a department']
    },
    status: {
        type: String,
        enum: ['Available', 'Assigned', 'Under Maintenance', 'Retired'],
        default: 'Available'
    },
    assignedTo: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        default: null
    },
    notes: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Asset', AssetSchema);
