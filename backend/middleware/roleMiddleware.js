// Grant access to specific roles
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            res.status(403);
            const error = new Error(`User role ${req.user.role} is not authorized to access this route`);
            error.statusCode = 403;
            return next(error);
        }
        next();
    };
};
