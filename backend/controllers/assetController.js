const asyncHandler = require('express-async-handler');
const Asset = require('../models/Asset');
const AuditLog = require('../models/AuditLog');

// @desc    Get all assets
// @route   GET /api/assets
// @access  Private
exports.getAssets = asyncHandler(async (req, res) => {
    let query;

    // Copy req.query
    const reqQuery = { ...req.query };

    // Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit'];

    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach(param => delete reqQuery[param]);

    // Create query string
    let queryStr = JSON.stringify(reqQuery);

    // Create operators ($gt, $gte, etc)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    // Finding resource
    query = Asset.find(JSON.parse(queryStr)).populate('assignedTo', 'name email employeeId');

    // Select Fields
    if (req.query.select) {
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields);
    }

    // Sort
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
    } else {
        query = query.sort('-createdAt');
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Asset.countDocuments();

    query = query.skip(startIndex).limit(limit);

    // Executing query
    const assets = await query;

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit
        };
    }

    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit
        };
    }

    res.status(200).json({
        success: true,
        count: assets.length,
        pagination,
        data: assets
    });
});

// @desc    Get single asset
// @route   GET /api/assets/:id
// @access  Private
exports.getAsset = asyncHandler(async (req, res) => {
    const asset = await Asset.findById(req.params.id).populate('assignedTo', 'name email employeeId');

    if (!asset) {
        res.status(404);
        throw new Error(`Asset not found with id of ${req.params.id}`);
    }

    res.status(200).json({
        success: true,
        data: asset
    });
});

// @desc    Create new asset
// @route   POST /api/assets
// @access  Private/Admin
exports.createAsset = asyncHandler(async (req, res) => {
    // Generate Asset ID handled by frontend or auto-generator util?
    // Request body should have assetId, etc.

    const asset = await Asset.create(req.body);

    // Create Audit Log
    await AuditLog.create({
        action: 'CREATE',
        performedBy: req.user.id,
        entityType: 'Asset',
        entityId: asset._id,
        description: `Created asset ${asset.assetId} (${asset.assetType})`
    });

    res.status(201).json({
        success: true,
        data: asset
    });
});

// @desc    Update asset
// @route   PUT /api/assets/:id
// @access  Private/Admin
exports.updateAsset = asyncHandler(async (req, res) => {
    let asset = await Asset.findById(req.params.id);

    if (!asset) {
        res.status(404);
        throw new Error(`Asset not found with id of ${req.params.id}`);
    }

    asset = await Asset.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    // Create Audit Log
    await AuditLog.create({
        action: 'UPDATE',
        performedBy: req.user.id,
        entityType: 'Asset',
        entityId: asset._id,
        description: `Updated asset ${asset.assetId}`
    });

    res.status(200).json({
        success: true,
        data: asset
    });
});

// @desc    Delete asset
// @route   DELETE /api/assets/:id
// @access  Private/Admin
exports.deleteAsset = asyncHandler(async (req, res) => {
    const asset = await Asset.findById(req.params.id);

    if (!asset) {
        res.status(404);
        throw new Error(`Asset not found with id of ${req.params.id}`);
    }

    await asset.deleteOne();

    // Create Audit Log
    await AuditLog.create({
        action: 'DELETE',
        performedBy: req.user.id,
        entityType: 'Asset',
        entityId: asset._id,
        description: `Deleted asset ${asset.assetId}`
    });

    res.status(200).json({
        success: true,
        data: {}
    });
});

// @desc    Get current user's assets
// @route   GET /api/assets/my-assets
// @access  Private
exports.getMyAssets = asyncHandler(async (req, res) => {
    const assets = await Asset.find({ assignedTo: req.user.id });

    res.status(200).json({
        success: true,
        count: assets.length,
        data: assets
    });
});
