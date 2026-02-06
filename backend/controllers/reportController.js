const asyncHandler = require('express-async-handler');
const Asset = require('../models/Asset');
const Maintenance = require('../models/Maintenance');

// @desc    Get Inventory Report
// @route   GET /api/reports/inventory
// @access  Private/Admin
exports.getInventoryReport = asyncHandler(async (req, res) => {
    // Aggregate counts by status, type, department
    const statusStats = await Asset.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const typeStats = await Asset.aggregate([
        { $group: { _id: '$assetType', count: { $sum: 1 } } }
    ]);

    const departmentStats = await Asset.aggregate([
        { $group: { _id: '$department', count: { $sum: 1 } } }
    ]);

    res.status(200).json({
        success: true,
        data: {
            statusStats,
            typeStats,
            departmentStats
        }
    });
});

// @desc    Get Warranty Expiry Report (next 30 days)
// @route   GET /api/reports/warranty
// @access  Private/Admin
exports.getWarrantyReport = asyncHandler(async (req, res) => {
    // Logic: find assets where warrantyExpiryDate is between now and now+30days
    const today = new Date();
    const next30Days = new Date();
    next30Days.setDate(today.getDate() + 30);

    const assets = await Asset.find({
        warrantyExpiryDate: { $gte: today, $lte: next30Days }
    });

    res.status(200).json({
        success: true,
        count: assets.length,
        data: assets
    });
});

// @desc    Get Maintenance Due Report
// @route   GET /api/reports/maintenance
// @access  Private/Admin
exports.getMaintenanceReport = asyncHandler(async (req, res) => {
    // Find open maintenance
    const openMaintenance = await Maintenance.find({ status: 'Open' }).populate('assetId');

    res.status(200).json({
        success: true,
        count: openMaintenance.length,
        data: openMaintenance
    });
});
