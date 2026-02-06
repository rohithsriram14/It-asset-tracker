const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public (or Admin only depending on requirements, prompt said Admin can create users, but kept public for initial setup/testing or if we follow strict 'Admin can create users' this might be User Create. Let's make this Admin only in routes, but logic here)
exports.register = asyncHandler(async (req, res) => {
    const { employeeId, name, email, password, department, role } = req.body;

    // Create user
    const user = await User.create({
        employeeId,
        name,
        email,
        password,
        department,
        role
    });

    sendTokenResponse(user, 201, res);
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
        res.status(400);
        throw new Error('Please provide an email and password');
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        res.status(401);
        throw new Error('Invalid credentials');
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
        res.status(401);
        throw new Error('Invalid credentials');
    }

    sendTokenResponse(user, 200, res);
});

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        data: user
    });
});

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    // Create token
    const token = user.getSignedJwtToken();

    const options = {
        expires: new Date(
            Date.now() + process.env.JWT_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true
    };

    res
        .status(statusCode)
        // .cookie('token', token, options) // Optional: if using cookies
        .json({
            success: true,
            token,
            user
        });
};
