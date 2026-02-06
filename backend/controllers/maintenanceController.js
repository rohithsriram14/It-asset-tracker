const asyncHandler = require('express-async-handler');
const Maintenance = require('../models/Maintenance');
const Asset = require('../models/Asset');
const AuditLog = require('../models/AuditLog');

// @desc    Add maintenance record
// @route   POST /api/maintenance
// @access  Private/Admin
exports.addMaintenance = asyncHandler(async (req, res) => {
    const { assetId, maintenanceDate, issueDescription, vendor, cost, nextMaintenanceDate } = req.body;

    const asset = await Asset.findById(assetId);
    if (!asset) {
        res.status(404);
        throw new Error('Asset not found');
    }

    const maintenance = await Maintenance.create({
        assetId,
        maintenanceDate,
        issueDescription,
        vendor,
        cost,
        nextMaintenanceDate,
        status: 'Open'
    });

    asset.status = 'Under Maintenance';
    await asset.save();

    await AuditLog.create({
        action: 'MAINTENANCE_START',
        performedBy: req.user.id,
        entityType: 'Asset',
        entityId: asset._id,
        description: `Asset ${asset.assetId} sent for maintenance`
    });

    res.status(201).json({
        success: true,
        data: maintenance
    });
});

// @desc    Close maintenance record
// @route   PUT /api/maintenance/:id/close
// @access  Private/Admin
exports.closeMaintenance = asyncHandler(async (req, res) => {
    const maintenance = await Maintenance.findById(req.params.id);

    if (!maintenance) {
        res.status(404);
        throw new Error('Maintenance record not found');
    }

    maintenance.status = 'Closed';
    await maintenance.save();

    // Set asset back to Available if no other open maintenance? 
    // Simplified: Set to Available.
    const asset = await Asset.findById(maintenance.assetId);
    if (asset) {
        asset.status = 'Available';
        await asset.save();
    }

    await AuditLog.create({
        action: 'MAINTENANCE_CLOSE',
        performedBy: req.user.id,
        entityType: 'Asset',
        entityId: asset._id,
        description: `Asset ${asset.assetId} maintenance closed`
    });

    res.status(200).json({
        success: true,
        data: maintenance
    });
});

// @desc    Get all maintenance records
// @route   GET /api/maintenance
// @access  Private/Admin
exports.getMaintenanceRecords = asyncHandler(async (req, res) => {
    const records = await Maintenance.find().populate('assetId'); // Might want to paginate this

    res.status(200).json({
        success: true,
        count: records.length,
        data: records
    });
});

// @desc    Get maintenance for specific asset
// @route   GET /api/maintenance/:assetId
// @access  Private/Admin
exports.getAssetMaintenance = asyncHandler(async (req, res) => {
    const records = await Maintenance.find({ assetId: req.params.assetId });

    res.status(200).json({
        success: true,
        count: records.length,
        data: records
    });
});
