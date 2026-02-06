const asyncHandler = require('express-async-handler');
const Allocation = require('../models/Allocation');
const Asset = require('../models/Asset');
const AuditLog = require('../models/AuditLog');

// @desc    Assign asset (Admin)
// @route   POST /api/allocations/assign
// @access  Private/Admin
exports.assignAsset = asyncHandler(async (req, res) => {
    const { assetId, assignedTo, remarks, assignedDate } = req.body;

    // Check if asset exists and is available
    const asset = await Asset.findById(assetId);
    if (!asset) {
        res.status(404);
        throw new Error('Asset not found');
    }

    if (asset.status !== 'Available') {
        res.status(400);
        throw new Error('Asset is not available for assignment');
    }

    const allocation = await Allocation.create({
        assetId,
        assignedTo,
        assignedBy: req.user.id,
        assignedDate: assignedDate || Date.now(),
        remarks,
        status: 'assigned'
    });

    // Update asset status
    asset.status = 'Assigned';
    asset.assignedTo = assignedTo;
    await asset.save();

    // Audit Log
    await AuditLog.create({
        action: 'ASSIGN',
        performedBy: req.user.id,
        entityType: 'Asset',
        entityId: asset._id,
        description: `Assigned asset ${asset.assetId} to user ${assignedTo}`
    });

    res.status(201).json({
        success: true,
        data: allocation
    });
});

// @desc    Transfer asset (Admin)
// @route   POST /api/allocations/transfer
// @access  Private/Admin
exports.transferAsset = asyncHandler(async (req, res) => {
    const { assetId, fromUser, toUser, remarks, transferDate } = req.body;

    const asset = await Asset.findById(assetId);
    if (!asset) throw new Error('Asset not found');

    // Verify current assignment matches fromUser? Optional but good check.

    // NOTE: Logic - Close previous allocation, create new one OR just track history.
    // Standard practice: Mark previous entry returned/transferred, create new entry.

    // Find active allocation
    const activeAllocation = await Allocation.findOne({ assetId, status: 'assigned' });
    if (activeAllocation) {
        activeAllocation.status = 'transferred';
        activeAllocation.returnDate = transferDate || Date.now();
        await activeAllocation.save();
    }

    const newAllocation = await Allocation.create({
        assetId,
        assignedTo: toUser,
        assignedBy: req.user.id,
        assignedDate: transferDate || Date.now(),
        remarks: `Transferred from previous user. ${remarks || ''}`,
        status: 'assigned'
    });

    asset.assignedTo = toUser;
    await asset.save();

    await AuditLog.create({
        action: 'TRANSFER',
        performedBy: req.user.id,
        entityType: 'Asset',
        entityId: asset._id,
        description: `Transferred asset ${asset.assetId} to user ${toUser}`
    });

    res.status(200).json({
        success: true,
        data: newAllocation
    });
});

// @desc    Return asset
// @route   POST /api/allocations/return
// @access  Private/Admin
exports.returnAsset = asyncHandler(async (req, res) => {
    const { assetId, returnDate, remarks } = req.body;

    const asset = await Asset.findById(assetId);
    if (!asset) throw new Error('Asset not found');

    const activeAllocation = await Allocation.findOne({ assetId, status: 'assigned' });

    if (activeAllocation) {
        activeAllocation.status = 'returned';
        activeAllocation.returnDate = returnDate || Date.now();
        activeAllocation.remarks = activeAllocation.remarks + (remarks ? ` | Return remark: ${remarks}` : '');
        await activeAllocation.save();
    }

    asset.status = 'Available';
    asset.assignedTo = null;
    await asset.save();

    await AuditLog.create({
        action: 'RETURN',
        performedBy: req.user.id,
        entityType: 'Asset',
        entityId: asset._id,
        description: `Returned asset ${asset.assetId}`
    });

    res.status(200).json({
        success: true,
        data: activeAllocation || {}
    });
});

// @desc    Get allocation history for an asset (Admin)
// @route   GET /api/allocations/history/:assetId
// @access  Private/Admin
exports.getAssetHistory = asyncHandler(async (req, res) => {
    const history = await Allocation.find({ assetId: req.params.assetId })
        .populate('assignedTo', 'name email')
        .populate('assignedBy', 'name')
        .sort('-assignedDate');

    res.status(200).json({
        success: true,
        count: history.length,
        data: history
    });
});

// @desc    Get my allocation history (Employee)
// @route   GET /api/allocations/my-history
// @access  Private
exports.getMyHistory = asyncHandler(async (req, res) => {
    const history = await Allocation.find({ assignedTo: req.user.id })
        .populate('assetId') // Populate asset details too
        .populate('assignedBy', 'name')
        .sort('-assignedDate');

    res.status(200).json({
        success: true,
        count: history.length,
        data: history
    });
});
