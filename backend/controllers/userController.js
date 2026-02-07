const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const generateEmployeeId = require('../utils/generateId');

// @desc    Get all users (Admin)
// @route   GET /api/users
// @access  Private/Admin
exports.getUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select('-password');
    res.status(200).json({
        success: true,
        count: users.length,
        data: users
    });
});

// @desc    Create user (Admin)
// @route   POST /api/users
// @access  Private/Admin
exports.createUser = asyncHandler(async (req, res) => {
    const { name, email, password, department, role } = req.body;

    const employeeId = await generateEmployeeId();

    const user = await User.create({
        employeeId,
        name,
        email,
        password,
        department,
        role
    });

    res.status(201).json({
        success: true,
        data: user
    });
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
exports.updateUser = asyncHandler(async (req, res) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    }).select('-password');

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    res.status(200).json({
        success: true,
        data: user
    });
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    await user.deleteOne();

    res.status(200).json({
        success: true,
        data: {}
    });
});
