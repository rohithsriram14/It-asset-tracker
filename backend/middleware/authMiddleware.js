const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// Protect routes
exports.protect = asyncHandler(async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        // Set token from Bearer token in header
        token = req.headers.authorization.split(' ')[1];
    }

    // Make sure token exists
    if (!token) {
        res.status(401);
        throw new Error('Not authorized to access this route');
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await User.findById(decoded.id);

        next();
    } catch (err) {
        res.status(401);
        throw new Error('Not authorized to access this route');
    }
});
